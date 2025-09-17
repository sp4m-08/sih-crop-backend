import express from 'express';
import axios from 'axios';
import authMiddleware from '../middleware/auth.js';
import Session from '../models/session.js'; // Use your Session model
import Conversation from '../models/conversation.js'; // Use your Conversation model

const router = express.Router();

// Base URL of your FastAPI LLM server
const LLM_API_URL = 'https://crop-chat-agent.onrender.com/api/v1/chat';

// @route   POST /api/chat
// @desc    Send a message to the LLM agent, save it, and get a response
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  const { message, sessionId } = req.body;
  const userId = req.user.id; // Get user ID from the auth token

  let session;
  let conversationIndex;

  try {
    // 1. Find or create the session
    if (sessionId) {
      session = await Session.findById(sessionId);
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }
    } else {
      // Create a new session if none exists
      session = new Session({ userId });
      await session.save();
    }

    // 2. Get the next conversation index for this session
    const lastConversation = await Conversation.findOne({ sessionId: session._id })
      .sort({ indexInSession: -1 });

    conversationIndex = lastConversation ? lastConversation.indexInSession + 1 : 0;
    
    // 3. Save the user's message to the conversation history
    const userConversation = new Conversation({
      sessionId: session._id,
      senderRole: 'user',
      content: message,
      indexInSession: conversationIndex,
    });
    await userConversation.save();
    
    // 4. Call the LLM agent API
    const llmResponse = await axios.post(LLM_API_URL, {
      user_id: userId,
      message,
      session_id: session._id.toString()
    });

    // 5. Save the agent's response to the conversation history
    const agentResponse = llmResponse.data.response;
    const agentConversation = new Conversation({
      sessionId: session._id,
      senderRole: 'agent',
      content: agentResponse,
      indexInSession: conversationIndex + 1,
    });
    await agentConversation.save();
    
    // 6. Update the last activity timestamp for the session
    session.lastActivityAt = Date.now();
    await session.save();

    // 7. Send the response back to the client
    res.json({
      response: agentResponse,
      sessionId: session._id,
    });

  } catch (error) {
    console.error('Error in chat route:', error.message);
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    res.status(500).send('Server Error');
  }
});

export default router;