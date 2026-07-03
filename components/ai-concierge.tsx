'use client'

import { DefaultChatTransport, type UIMessage } from 'ai'
import { useChat } from '@ai-sdk/react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageSquare, X, Send, Loader2 } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

const WELCOME_TEXT =
  "Welcome to Studio AYNSH. I'm here to help you explore our services, recommend the perfect package for your occasion, or guide your booking. How may I assist you today?"

export function AiConcierge() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/concierge' }),
    messages: [
      {
        id: 'welcome',
        role: 'assistant' as UIMessage['role'],
        parts: [{ type: 'text', text: WELCOME_TEXT }],
      },
    ],
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSend = () => {
    const text = inputValue.trim()
    if (!text || isLoading) return
    setInputValue('')
    sendMessage({ text })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      handleSend()
    }
  }

  const getMessageText = (msg: (typeof messages)[0]): string => {
    return msg.parts
      .filter((p) => p.type === 'text')
      .map((p) => (p as { type: 'text'; text: string }).text)
      .join('')
  }

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-foreground text-background flex items-center justify-center shadow-lg hover:bg-accent hover:text-foreground transition-all duration-300 rounded-none"
            aria-label="Open AI Concierge"
          >
            <MessageSquare size={22} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-50 w-[340px] sm:w-[400px] bg-background border border-border shadow-2xl flex flex-col"
            style={{ height: 540 }}
            role="dialog"
            aria-label="Studio AYNSH AI Concierge"
            aria-modal="false"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-foreground">
              <div>
                <p className="font-serif text-background text-base font-medium tracking-wide">
                  Studio AYNSH
                </p>
                <p className="font-sans text-background/50 text-xs tracking-[0.15em] uppercase mt-0.5">
                  AI Concierge
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-background/50 hover:text-background transition-colors duration-200 p-1"
                aria-label="Close concierge"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed font-sans ${
                      msg.role === 'user'
                        ? 'bg-foreground text-background'
                        : 'bg-secondary text-foreground border border-border'
                    }`}
                  >
                    {getMessageText(msg)}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary border border-border px-4 py-3 flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-muted-foreground" />
                    <span className="font-sans text-xs text-muted-foreground">Composing response...</span>
                  </div>
                </div>
              )}
              {error && (
                <div className="text-center font-sans text-xs text-destructive">
                  Something went wrong. Please try again.
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick suggestions (only at start) */}
            {messages.length === 1 && (
              <div className="px-4 pb-3 flex flex-wrap gap-2">
                {['Wedding packages', 'Pre-wedding shoot', 'Book a session'].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setInputValue('')
                      sendMessage({ text: s })
                    }}
                    className="font-sans text-xs text-muted-foreground border border-border px-3 py-1.5 hover:border-foreground hover:text-foreground transition-all duration-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border px-4 py-3 flex items-center gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about our studio..."
                className="flex-1 bg-transparent font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                aria-label="Message the AI concierge"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors duration-200"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
