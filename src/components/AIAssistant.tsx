import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, X, User } from 'lucide-react';
import type { InvitationDetails } from '@/types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  details: InvitationDetails;
  onDetailsUpdate: (details: InvitationDetails) => void;
  eventType: string;
}

const suggestionPrompts = [
  'Plan a wedding for Sarah and James on October 15, 2026 at The Grand Ballroom',
  'Help me write a birthday party invitation for my daughter turning 5',
  'Create a corporate gala invitation for our annual awards night',
];

function generateAIResponse(
  userMessage: string,
  currentDetails: InvitationDetails,
  eventType: string
): { response: string; details: InvitationDetails } {
  const msg = userMessage.toLowerCase();
  const newDetails = { ...currentDetails };
  let response = '';

  // Extract names (e.g., "Sarah and James")
  const nameMatch = userMessage.match(/(?:for|between)\s+([A-Z][a-z]+(?:\s+and\s+[A-Z][a-z]+)?)/);
  if (nameMatch) {
    newDetails.guestOfHonor = nameMatch[1];
    newDetails.hostName = nameMatch[1];
  }

  // Extract date patterns
  const dateMatch = userMessage.match(/(?:on|date[:\s]+)\s*(\w+\s+\d{1,2}(?:,?\s*\d{4})?)/i);
  if (dateMatch) {
    newDetails.eventDate = dateMatch[1];
  }

  // Extract venue (e.g., "at The Grand Ballroom")
  const venueMatch = userMessage.match(/(?:at|venue[:\s]+)\s+([A-Z][^,.\n]{2,40})/);
  if (venueMatch) {
    newDetails.venue = venueMatch[1].trim();
  }

  // Extract time
  const timeMatch = userMessage.match(/(?:at\s+)?(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);
  if (timeMatch) {
    newDetails.eventTime = timeMatch[1];
  }

  // Determine event type context
  const isWedding = msg.includes('wedding') || eventType === 'Wedding';
  const isBirthday = msg.includes('birthday') || eventType === 'Birthday';
  const isCorporate = msg.includes('corporate') || msg.includes('gala') || eventType === 'Corporate';
  const isBabyShower = msg.includes('baby') || msg.includes('shower') || eventType === 'Baby Shower';

  // Generate appropriate message and fill details
  if (isWedding) {
    if (!newDetails.message) {
      newDetails.message = 'Together with their families, we invite you to celebrate the union of our hearts as we begin our journey of forever.';
    }
    if (!newDetails.dressCode) {
      newDetails.dressCode = 'Formal / Black Tie Optional';
    }
    response = `I've drafted your wedding invitation! Here's what I've filled in:\n\n`;
  } else if (isBirthday) {
    if (!newDetails.message) {
      newDetails.message = 'Join us for a day of fun, laughter, and cake as we celebrate this special birthday!';
    }
    if (!newDetails.dressCode) {
      newDetails.dressCode = 'Casual / Festive';
    }
    response = `I've set up your birthday invitation! Here's what I prepared:\n\n`;
  } else if (isCorporate) {
    if (!newDetails.message) {
      newDetails.message = 'You are cordially invited to join us for an evening of celebration and recognition as we honor excellence and achievement.';
    }
    if (!newDetails.dressCode) {
      newDetails.dressCode = 'Business Formal';
    }
    response = `I've prepared your corporate event invitation! Here's what I've set up:\n\n`;
  } else if (isBabyShower) {
    if (!newDetails.message) {
      newDetails.message = 'A little miracle is on the way! Join us as we celebrate the upcoming arrival of our newest little love.';
    }
    if (!newDetails.dressCode) {
      newDetails.dressCode = 'Casual / Pastel Attire';
    }
    response = `I've created your baby shower invitation! Here's what I've filled in:\n\n`;
  } else {
    if (!newDetails.message) {
      newDetails.message = 'You are cordially invited to join us for this special celebration. We would be honored to have your presence.';
    }
    response = `I've started filling in your invitation! Here's what I've set up so far:\n\n`;
  }

  // Set default time if not found
  if (!newDetails.eventTime) {
    newDetails.eventTime = isCorporate ? '6:30 PM' : '4:00 PM';
  }

  // Set default RSVP
  if (!newDetails.rsvpDate) {
    newDetails.rsvpDate = 'One week before the event';
  }

  // Build response summary
  const filled: string[] = [];
  if (newDetails.guestOfHonor) filled.push(`Guest of honor: ${newDetails.guestOfHonor}`);
  if (newDetails.eventDate) filled.push(`Date: ${newDetails.eventDate}`);
  if (newDetails.eventTime) filled.push(`Time: ${newDetails.eventTime}`);
  if (newDetails.venue) filled.push(`Venue: ${newDetails.venue}`);
  if (newDetails.dressCode) filled.push(`Dress code: ${newDetails.dressCode}`);
  if (newDetails.message) filled.push(`Message: ${newDetails.message.substring(0, 60)}...`);
  if (newDetails.rsvpDate) filled.push(`RSVP by: ${newDetails.rsvpDate}`);

  response += filled.join('\n') + '\n\n';
  response += 'I\'ve applied these to your invitation. You can edit any field on the left — or tell me more details to update!';

  return { response, details: newDetails };
}

export default function AIAssistant({ details, onDetailsUpdate, eventType }: AIAssistantProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm your AI invitation assistant. Tell me about your event — the names, date, venue, time — and I'll fill in all the details for you. What are you celebrating?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setThinking(true);

    setTimeout(() => {
      const { response, details: newDetails } = generateAIResponse(text, details, eventType);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      onDetailsUpdate(newDetails);
      setThinking(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Bot className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-medium">AI Assistant</span>
          <Sparkles className="w-4 h-4 text-amber-400" />
        </motion.button>
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden"
            style={{ maxHeight: '70vh' }}
          >
            {/* Header */}
            <div className="bg-stone-900 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">AI Assistant</p>
                  <p className="text-xs text-stone-400">Helps fill in your invitation</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-stone-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' ? 'bg-stone-200' : 'bg-stone-900'
                    }`}>
                      {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-stone-600" /> : <Bot className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <div className={`rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-stone-900 text-white rounded-tr-sm'
                        : 'bg-white border border-stone-200 text-stone-800 rounded-tl-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="flex justify-start">
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-stone-900 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-sm px-3 py-2.5 flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          className="w-1.5 h-1.5 rounded-full bg-stone-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-col gap-1.5 flex-shrink-0">
                {suggestionPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="text-left text-xs text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg px-3 py-2 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-stone-200 flex-shrink-0 bg-white">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your event..."
                  className="flex-1 text-sm px-3 py-2 rounded-xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || thinking}
                  className="bg-stone-900 text-white rounded-xl px-3 py-2 hover:bg-stone-800 transition-colors disabled:opacity-40 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
