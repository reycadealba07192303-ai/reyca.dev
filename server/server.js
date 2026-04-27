const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const Conversation = require('./models/Conversation');
const Booking = require('./models/Booking');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ═══════════════════════════════════════════
// 1. MongoDB Connection
// ═══════════════════════════════════════════
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// ═══════════════════════════════════════════
// 2. Nodemailer Setup (Gmail SMTP)
// ═══════════════════════════════════════════
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ═══════════════════════════════════════════
// 3. Google Calendar Setup (OAuth2)
// ═══════════════════════════════════════════
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// ═══════════════════════════════════════════
// 4. AI Knowledge Base & Intent Map
// ═══════════════════════════════════════════
const KNOWLEDGE_BASE = {
  ABOUT: `Reyca Dela Cruz De Alba is a Data Analyst, AI Engineer, and Full-Stack Developer based in Sampaloc, Manila. She is a BS IT student at National University, a consistent Dean's Lister, and an Academic Full Scholar. She's known for her passion in AI and automation.`,
  PROJECTS: `Reyca's key projects include:
1. Gabay Alalay: A VAWC Management System.
2. Lawbot AI: An AI-Powered Legal Assistant.
3. IntelliAccess: An AI Vehicle Control System.
4. 903rd Battalion IS: A Record Management System.
5. InCloud Thesis: An Integrated Cloud-Based Inventory System.
6. SmartCash: A Financial Literacy Learning Management System.`,
  TECH_STACK: `Reyca is proficient in:
- Frontend: React.js, Vite, Tailwind CSS, Shadcn UI.
- Backend: Node.js, Express.js, MongoDB, Python (Flask/FastAPI).
- AI/Data: Gemini API, OpenAI, TensorFlow, Pandas, Power BI.
- Tools: Git, Docker, Google Cloud, Figma.`,
  EDUCATION: `Reyca is currently pursuing a BS in Information Technology at National University (2022-Present) where she is a Dean's Lister. She graduated With High Honors from Cristo Rey High School.`,
  EXPERIENCE: `Reyca has experience as a Data Analyst & AI Engineer Intern at SPMadrid Law and Associates (2026). She was also the Lead Developer and Project Manager for the InCloud Thesis Project (2025).`,
  CONTACT: `You can reach Reyca through:
- Facebook: DealbaReyca072303
- LinkedIn: Reyca De Alba
- GitHub: reycadealba07192303-ai
- Messenger: m.me/DealbaReyca072303`,
};

const SYSTEM_CORE = `
You are Reyca's AI Assistant. You are warm, professional, and helpful.
You represent Reyca Dela Cruz De Alba.

STRICT RULES:
1. ONLY answer based on the facts provided.
2. If asked about unrelated topics, politely say: "I can only answer questions about Reyca's professional background and services."
3. Keep your tone human, not like a robot. Use "Reyca" or "she" when referring to her, or "I" if you are acting as her personal assistant.

BOOKING FLOW:
If the user wants to book or hire Reyca, you MUST collect:
- Full Name
- Contact Number
- Messenger Link
- Project Details
- Preferred Date/Time (Mon-Fri, 9-5 PM)
Once ALL 5 are collected, append:
\`\`\`BOOKING_DATA
{"name":"...","contact":"...","messenger":"...","details":"...","date":"YYYY-MM-DD","time":"HH:mm"}
\`\`\`
`;

// ═══════════════════════════════════════════
// 5. Gemini API (Streaming Support & Key Rotation)
// ═══════════════════════════════════════════
async function callGeminiStream(prompt, onChunk) {
  const apiKeys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3
  ].filter(Boolean);
  
  const models = [
    'gemini-2.0-flash-exp', 
    'gemini-1.5-flash', 
    'gemini-flash-latest',
    'gemini-1.5-pro-latest',
    'gemini-1.5-pro'
  ];

  for (const apiKey of apiKeys) {
    for (const modelName of models) {
      try {
        console.log(`🤖 Attempting model: ${modelName}`);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:streamGenerateContent?alt=sse&key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData.error?.message || response.statusText;
          console.warn(`⚠️ Model ${modelName} failed:`, errMsg);
          
          // Switch model or key on rate limit or high demand
          if (response.status === 429 || response.status === 503 || errMsg.toLowerCase().includes('demand') || errMsg.toLowerCase().includes('limit')) {
            continue; 
          }
          throw new Error(errMsg);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                const text = data.candidates[0].content.parts[0].text;
                if (text) {
                  fullText += text;
                  onChunk(text);
                }
              } catch (e) { /* partial chunk */ }
            }
          }
        }
        return fullText;
      } catch (err) {
        if (err.message.toLowerCase().includes('demand') || err.message.toLowerCase().includes('limit')) continue;
        console.error(`❌ Fatal error with ${modelName}:`, err.message);
      }
    }
  }
  throw new Error('All AI models are currently overwhelmed or limits exceeded. Please try again in a few minutes.');
}

async function callGemini(prompt) {
  let result = "";
  await callGeminiStream(prompt, (chunk) => { result += chunk; });
  return result;
}

// ═══════════════════════════════════════════
// 6. Google Calendar - Create Event
// ═══════════════════════════════════════════
async function createCalendarEvent(bookingData) {
  let startDateTime;
  let endDateTime;
  
  if (bookingData.date && bookingData.time) {
    // User provided date and time
    startDateTime = new Date(`${bookingData.date}T${bookingData.time}:00`);
    endDateTime = new Date(startDateTime);
    endDateTime.setHours(startDateTime.getHours() + 1); // 1 hour duration
  } else {
    // Fallback: Schedule for tomorrow at 10:00 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    startDateTime = tomorrow;
    
    endDateTime = new Date(tomorrow);
    endDateTime.setHours(11, 0, 0, 0);
  }

  const event = {
    summary: `Portfolio Inquiry: ${bookingData.name}`,
    description: `Name: ${bookingData.name}\nContact: ${bookingData.contact}\nMessenger: ${bookingData.messenger}\nProject: ${bookingData.details}\nPreferred Schedule: ${bookingData.date} ${bookingData.time}`,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'Asia/Manila',
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: 'Asia/Manila',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 30 },
        { method: 'email', minutes: 60 },
      ],
    },
  };

  const result = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  });

  console.log('📅 Calendar event created:', result.data.htmlLink);
  return result.data;
}

// ═══════════════════════════════════════════
// 7. Email Notification
// ═══════════════════════════════════════════
async function sendEmailNotification(bookingData) {
  await transporter.sendMail({
    from: `"Portfolio Bot" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `🔔 New Portfolio Booking: ${bookingData.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">📩 New Client Inquiry</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Name:</td><td style="padding: 8px 0;">${bookingData.name}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Contact:</td><td style="padding: 8px 0;">${bookingData.contact}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Messenger:</td><td style="padding: 8px 0;">${bookingData.messenger}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Project:</td><td style="padding: 8px 0;">${bookingData.details}</td></tr>
        </table>
        <p style="margin-top: 20px; color: #888; font-size: 12px;">This booking has been saved to your database and a calendar event has been created.</p>
      </div>
    `,
  });
  console.log('📧 Email notification sent!');
}

// ═══════════════════════════════════════════
// 8. MAIN CHAT ENDPOINT (Hybrid Logic)
// ═══════════════════════════════════════════
app.post('/api/chat', async (req, res) => {
  const { userMessage, conversationId } = req.body;

  // Set headers for SSE (Streaming)
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    // 1. INTENT DETECTION
    const intentPrompt = `
Analyze this user message: "${userMessage}"
Categories: ABOUT, PROJECTS, TECH_STACK, EDUCATION, EXPERIENCE, CONTACT, BOOKING, GENERAL.
Return ONLY the category name. If it doesn't fit strictly, return GENERAL.
Category:`;
    
    const intent = (await callGemini(intentPrompt)).trim().toUpperCase();
    console.log(`🎯 Detected Intent: ${intent}`);

    // 2. CONTEXT BUILDING
    let history = "";
    if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
      const existingConv = await Conversation.findById(conversationId);
      if (existingConv) {
        history = existingConv.messages.slice(-6).map(m => 
          `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`
        ).join('\n');
      }
    }

    const facts = KNOWLEDGE_BASE[intent] || "";
    const currentDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });

    const finalPrompt = `
${SYSTEM_CORE}
[Current Date: ${currentDate}]
[History]:
${history}

[Facts for this request]:
${facts}

[Task]: Respond to the user's message naturally using the facts above.
User: ${userMessage}
Assistant:`;

    let fullBotResponse = "";

    // 3. STREAM RESPONSE
    await callGeminiStream(finalPrompt, (chunk) => {
      fullBotResponse += chunk;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    // 4. POST-PROCESSING (Booking Detection)
    const bookingMatch = fullBotResponse.match(/```BOOKING_DATA\s*\n?([\s\S]*?)\n?```/);
    if (bookingMatch) {
      try {
        const bookingData = JSON.parse(bookingMatch[1].trim());
        if (bookingData.name && bookingData.contact && bookingData.messenger && bookingData.details && bookingData.date && bookingData.time) {
          console.log('🚀 Automation Triggered');
          const newBooking = new Booking({
            name: bookingData.name,
            contact: bookingData.contact,
            messenger: bookingData.messenger,
            projectDetails: bookingData.details,
            status: 'scheduled',
            scheduledAt: new Date(`${bookingData.date}T${bookingData.time}:00`)
          });
          await newBooking.save();
          await createCalendarEvent(bookingData);
          await sendEmailNotification(bookingData);
          
          const successMsg = "\n\n✅ Your booking has been saved! Reyca has been notified.";
          fullBotResponse += successMsg;
          res.write(`data: ${JSON.stringify({ chunk: successMsg })}\n\n`);
        }
      } catch (e) { console.error('Booking Parse Error', e); }
    }

    // 5. SAVE CONVERSATION
    if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
      await Conversation.findByIdAndUpdate(conversationId, {
        $push: { messages: [{ role: 'user', text: userMessage }, { role: 'bot', text: fullBotResponse }] }
      });
      res.write(`data: ${JSON.stringify({ done: true, conversationId })}\n\n`);
    } else {
      const newConv = new Conversation({
        messages: [{ role: 'user', text: userMessage }, { role: 'bot', text: fullBotResponse }]
      });
      await newConv.save();
      res.write(`data: ${JSON.stringify({ done: true, conversationId: newConv._id })}\n\n`);
    }

    res.end();
  } catch (error) {
    console.error('❌ Chat Error:', error.message);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// ═══════════════════════════════════════════
// 9. Health Check
// ═══════════════════════════════════════════
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log('📡 Endpoints:');
  console.log('   POST /api/chat    → AI Chat + Booking Automation');
  console.log('   GET  /api/health  → Health Check\n');
});
