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
// 4. AI Knowledge Base & System Prompt
// ═══════════════════════════════════════════
const REYCA_KB = `
You are Reyca's AI Assistant on her portfolio website.

ABOUT REYCA:
- Name: Reyca Dela Cruz De Alba
- Roles: Data Analyst, AI Engineer, Full-Stack Developer
- Location: Sampaloc, Manila, Philippines
- Education: BS IT at National University (Consistent Dean's Lister, Academic Full Scholar)
- Senior High: Cristo Rey High School (Graduated With High Honors)
- Socials: FB (DealbaReyca072303), LinkedIn, GitHub, Messenger

PROJECTS:
- Gabay Alalay: VAWC Management System
- Lawbot AI: AI-Powered Legal Assistant
- IntelliAccess: AI Vehicle Control System
- 903rd Battalion IS: Record Management System
- InCloud Thesis: Integrated Cloud-Based Inventory System
- SmartCash: Financial Literacy LMS

STRICT RULES:
1. ONLY answer questions about Reyca's background, skills, projects, and services.
2. If asked about anything unrelated (math, trivia, other people, etc.), respond: "I can only answer questions about Reyca's professional background and services."
3. Be professional, warm, and helpful.

BOOKING FLOW:
When a user wants to book/hire Reyca or schedule a consultation, follow these steps:
- Ask for their Full Name
- Ask for their Contact Number
- Ask for their Facebook Messenger username/link
- Ask what kind of project or service they need (brief description)
- Ask for their preferred Date and Time for the consultation (Available hours: Mon-Fri, 9:00 AM to 5:00 PM)

IMPORTANT: Once ALL 5 pieces of info are collected, you MUST append this EXACT JSON block at the very end of your message (after your friendly confirmation):

\`\`\`BOOKING_DATA
{"name":"<full name>","contact":"<contact number>","messenger":"<messenger link>","details":"<project description>","date":"<YYYY-MM-DD>","time":"<HH:mm>"}
\`\`\`

Do NOT generate this JSON until ALL 5 fields are provided by the user.
`;

// ═══════════════════════════════════════════
// 5. Gemini API via native fetch (bypasses SDK version issues)
// Gemini API via native fetch (bypasses SDK version issues)
async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  // Model configurations - specific to the available models on your account
  const models = [
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-2.0-flash-lite-001',
    'gemini-3-flash-preview'
  ];
  
  for (const modelName of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      
      if (response.ok && data.candidates && data.candidates[0]) {
        console.log(`🤖 Using model: ${modelName}`);
        return data.candidates[0].content.parts[0].text;
      }
      
      console.warn(`⚠️ Model ${modelName} failed:`, data.error?.message || response.statusText);

      // If 404 or Quota exceeded (limit 0), try next model
      if (response.status === 404 || data.error?.message?.includes('limit: 0')) continue;
      
      // Other error, throw
      throw new Error(data.error?.message || 'Unknown Gemini error');
    } catch (err) {
      if (err.message.includes('not found') || err.message.includes('limit: 0')) continue;
      throw err;
    }
  }
  
  throw new Error('No available Gemini model found or Quota exceeded. Please check your API key settings.');
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
// 8. MAIN CHAT ENDPOINT
// Chat → AI → Extract → Save → Calendar → Email
// ═══════════════════════════════════════════
app.post('/api/chat', async (req, res) => {
  const { userMessage, conversationId } = req.body;

  try {
    // Build conversation context for AI
    let context = REYCA_KB;
    
    // Load previous messages for context if conversation exists
    if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
      const existingConv = await Conversation.findById(conversationId);
      if (existingConv && existingConv.messages.length > 0) {
        const history = existingConv.messages.slice(-10).map(m => 
          `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`
        ).join('\n');
        context += `\n\nCONVERSATION HISTORY:\n${history}`;
      }
    }

    const currentDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', dateStyle: 'full', timeStyle: 'long' });
    const fullPrompt = `[SYSTEM NOTE: The current date and time in Manila is ${currentDate}]\n\n${context}\n\nUser: ${userMessage}`;
    let botResponse = await callGemini(fullPrompt);

    // ── SMART TRIGGER: Check for Booking Data ──
    const bookingMatch = botResponse.match(/```BOOKING_DATA\s*\n?([\s\S]*?)\n?```/);
    
    if (bookingMatch) {
      try {
        const bookingData = JSON.parse(bookingMatch[1].trim());
        
        // VALIDATE: All fields must be present
        if (bookingData.name && bookingData.contact && bookingData.messenger && bookingData.details && bookingData.date && bookingData.time) {
          console.log('\n🚀 BOOKING AUTOMATION TRIGGERED!');

          // Step 1: Save to MongoDB
          const newBooking = new Booking({
            name: bookingData.name,
            contact: bookingData.contact,
            messenger: bookingData.messenger,
            projectDetails: bookingData.details,
            status: 'scheduled',
            scheduledAt: new Date(`${bookingData.date}T${bookingData.time}:00`)
          });
          await newBooking.save();
          console.log('💾 Saved to database');

          // Step 2: Create Google Calendar Event
          try {
            await createCalendarEvent(bookingData);
          } catch (calErr) {
            console.error('📅 Calendar Error:', calErr.message);
          }

          // Step 3: Send Email Notification
          try {
            await sendEmailNotification(bookingData);
          } catch (emailErr) {
            console.error('📧 Email Error:', emailErr.message);
          }

          // Clean the JSON from the user-facing response
          botResponse = botResponse.replace(/```BOOKING_DATA[\s\S]*?```/, '').trim();
          botResponse += "\n\n✅ Your booking has been saved! I've also added a reminder to Reyca's calendar and sent her an email notification. She'll reach out to you soon!";
          
          console.log('✅ AUTOMATION COMPLETE!\n');
        }
      } catch (parseErr) {
        console.error('JSON Parse Error:', parseErr.message);
      }
    }

    // ── Save conversation to MongoDB ──
    if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
      await Conversation.findByIdAndUpdate(conversationId, {
        $push: { messages: [
          { role: 'user', text: userMessage },
          { role: 'bot', text: botResponse }
        ]}
      });
      res.json({ text: botResponse });
    } else {
      const newConv = new Conversation({
        messages: [
          { role: 'user', text: userMessage },
          { role: 'bot', text: botResponse }
        ]
      });
      await newConv.save();
      res.json({ text: botResponse, conversationId: newConv._id });
    }

  } catch (error) {
    console.error('❌ Chat Error:', error.message);
    res.status(500).json({ error: error.message || 'AI Error' });
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
