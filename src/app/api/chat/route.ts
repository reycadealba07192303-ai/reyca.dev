import mongoose from 'mongoose';
import { buildSystemPrompt } from '@/lib/knowledge';
import { streamChat, type ChatMessage } from '@/lib/openrouter';
import { Conversation, connectDb } from '@/lib/db';
import { processBooking, stripBookingBlock } from '@/lib/booking';
import { getCalendarAvailability } from '@/lib/calendar';
import { availabilityReply } from '@/lib/calendar-slots';
import { weekBounds } from '@/lib/calendar-slots';
import { asksAvailability, consultationIntent, consultationLabel, consultationPlan, isConfirmation, recoverConsultation, summaryKey, type ConsultationState, type Turn } from '@/lib/consultation';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_MESSAGE_LENGTH = 1000;
const HISTORY_MESSAGES = 10;

// History is a nice-to-have: if the database is unreachable the chat still works
async function loadHistory(conversationId: unknown): Promise<{ history: Turn[]; consultation?: ConsultationState }> {
  if (typeof conversationId !== 'string' || !mongoose.Types.ObjectId.isValid(conversationId)) return { history: [] };
  try {
    await connectDb();
    const conv = await Conversation.findById(conversationId).lean();
    return { consultation: conv?.consultation, history: (conv?.messages ?? []).map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text,
    })) };
  } catch (err) {
    console.warn('Could not load history:', (err as Error).message);
    return { history: [] };
  }
}

async function saveTurn(conversationId: unknown, userText: string, botText: string, consultation?: ConsultationState): Promise<string | null> {
  const turn = [
    { role: 'user' as const, text: userText },
    { role: 'bot' as const, text: botText || '(no reply)' },
  ];
  try {
    await connectDb();
    if (typeof conversationId === 'string' && mongoose.Types.ObjectId.isValid(conversationId)) {
      const updated = await Conversation.findByIdAndUpdate(conversationId, { $push: { messages: { $each: turn } }, ...(consultation ? { $set: { consultation } } : {}) });
      if (updated) return conversationId;
    }
    const created = await Conversation.create({ messages: turn, ...(consultation ? { consultation } : {}) });
    return created._id.toString();
  } catch (err) {
    console.warn('Could not save conversation:', (err as Error).message);
    return null;
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const userMessage = typeof body.userMessage === 'string' ? body.userMessage.trim() : '';
  if (!userMessage || userMessage.length > MAX_MESSAGE_LENGTH) {
    return Response.json({ error: 'Message must be 1-1000 characters.' }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Same SSE format the chat widget already reads: data: {chunk} / {done, conversationId} / {error}
      const send = (payload: object) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));

      try {
        const { history, consultation: saved } = await loadHistory(body.conversationId);
        const now = new Date();
        const consultation = recoverConsultation([...history, { role: 'user', content: userMessage }], saved, now);
        const profileQuestion = /(?:who is|about reyca|her experience|tech stack|education|what projects|anong projects|sino si|background ni)/i.test(userMessage);
        const inConsultation = consultationIntent(userMessage) || isConfirmation(userMessage) || (!profileQuestion && history.some(message => message.role === 'user' && consultationIntent(message.content)));
        const finish = async (reply: string) => {
          const conversationId = await saveTurn(body.conversationId, userMessage, reply, inConsultation ? consultation : undefined);
          send({ chunk: reply });
          send({ done: true, conversationId });
        };
        if (inConsultation && consultation.status === 'booked' && consultation.confirmedSummary === summaryKey(consultation) && !asksAvailability(userMessage)) {
          const plan = consultationPlan(consultation, userMessage);
          if ('reply' in plan) await finish(plan.reply!);
          return;
        }
        const weekRequest = [...history.filter(message => message.role === 'user').map(message => message.content), userMessage]
          .reverse().find(message => /this week|next week|ngayong linggo|susunod na linggo|sa isang linggo/i.test(message)) ?? '';
        const nextWeek = /next week|susunod na linggo|sa isang linggo/i.test(weekRequest);
        const selectedDate = consultation.date ? new Date(`${consultation.date}T12:00:00+08:00`) : undefined;
        const selectedWeek = selectedDate && Number.isFinite(selectedDate.getTime()) ? Math.round((weekBounds(selectedDate).start.getTime() - weekBounds(now).start.getTime()) / (7 * 86400000)) : undefined;
        const weekOffset = !asksAvailability(userMessage) && selectedWeek !== undefined ? selectedWeek : nextWeek ? 1 : 0;
        const availability = inConsultation ? await getCalendarAvailability(now, weekOffset) : undefined;
        const calendarContext = availability?.context;
        if (inConsultation && !availability?.verified) {
          const reply = /anong|kailan|araw|oras|linggo|bukas|pwede|puwede|si reyca/i.test(userMessage)
            ? "Hindi ko ma-check ang live calendar ni Reyca ngayon, kaya hindi ko makumpirma ang available days at oras. Puwede mo siyang i-message sa Messenger para mag-consult: m.me/DealbaReyca072303"
            : "I can't check Reyca's live calendar right now, so I can't confirm available consultation days or times. Please message her on Messenger: m.me/DealbaReyca072303";
          await finish(reply);
          return;
        }
        if (availability?.verified && asksAvailability(userMessage) && !isConfirmation(userMessage)) {
          const reply = availabilityReply(availability.days, /anong|kailan|kelan|araw|oras|linggo|bukas|pwede|puwede|si reyca/i.test(userMessage));
          await finish(reply);
          return;
        }
        if (inConsultation && availability?.verified) {
          const plan = consultationPlan(consultation, userMessage);
          if (plan.action === 'need_slot') {
            await finish(availabilityReply(availability.days, /anong|kailan|kelan|araw|oras|linggo|bukas|pwede|puwede|si reyca/i.test(userMessage)));
          } else if (plan.action !== 'book' && !availability.days.some(day => day.date === consultation.date && day.starts.includes(consultation.time!))) {
            consultation.status = 'collecting';
            consultation.confirmedSummary = undefined;
            await finish(`That slot is not available for a one-hour consultation. I still have your contact details.\n\n${availabilityReply(availability.days, false)}`);
          } else if (plan.action === 'book') {
            const bookingKey = `${body.conversationId}:${consultation.date}:${consultation.time}`;
            const ok = await processBooking({ name: consultation.name!, contact: consultation.contact!, messenger: consultation.messenger || 'Not provided; use the contact above.', details: consultation.details || 'Consultation; project details to be discussed during the meeting.', date: consultation.date!, time: consultation.time! }, bookingKey);
            if (ok) consultation.status = 'booked';
            else { consultation.status = 'collecting'; consultation.confirmedSummary = undefined; }
            await finish(ok
              ? `Booked, ${consultation.name}. Your consultation is saved in Reyca's calendar for ${consultationLabel(consultation)}, Philippine time. You can discuss the project details during the meeting. No need to resend your information.`
              : "I couldn't save the consultation to Reyca's calendar, so it is not confirmed. I kept your details; please try again or message Reyca directly: m.me/DealbaReyca072303");
          } else {
            if (plan.action === 'summary') {
              consultation.status = 'awaiting_confirmation';
              consultation.confirmedSummary = summaryKey(consultation);
            }
            await finish(plan.reply);
          }
          return;
        }
        const messages: ChatMessage[] = [
          { role: 'system', content: buildSystemPrompt(now, calendarContext) },
          ...history.slice(-HISTORY_MESSAGES),
          { role: 'user', content: userMessage },
        ];

        // Booking confirmations are produced only by the server, never streamed from the model.
        let reply = stripBookingBlock(await streamChat(messages, () => {})).replace(/\*/g, '');
        if (!reply.trim()) {
          reply = "I couldn't finish that reply. Please try your question again.";
        }
        if (/\b(?:confirmed|booked)\b|kumpirmado|naka-book/i.test(reply)) {
          reply = 'I can help you arrange a consultation. Tell me your preferred day and time so I can check the calendar. A booking is only confirmed after it is saved to the calendar.';
        }
        await finish(reply);
      } catch (err) {
        console.error('Chat error:', (err as Error).message);
        send({ error: 'The assistant is unavailable right now.' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
