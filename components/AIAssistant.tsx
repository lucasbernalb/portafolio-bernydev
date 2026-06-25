"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/contexts/LanguageContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-1">
      <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center flex-shrink-0 border border-violet-500/20">
        <span className="text-sm font-bold text-violet-300">B</span>
      </div>
      <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-zinc-800/50 border border-zinc-700/30">
        <motion.span
          className="w-2 h-2 bg-zinc-400 rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
        />
        <motion.span
          className="w-2 h-2 bg-zinc-400 rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
        <motion.span
          className="w-2 h-2 bg-zinc-400 rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        />
      </div>
    </div>
  );
}

export default function AIAssistant() {
  const { t, lang } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const welcomeMessage: Message = {
    role: "assistant",
    content: t("chatbot.welcome"),
  };

  const hints = [t("chatbot.hint1"), t("chatbot.hint2"), t("chatbot.hint3"), t("chatbot.hint4"), t("chatbot.hint5")];

  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [leadSent, setLeadSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    setMessages([{ role: "assistant", content: t("chatbot.welcome") }]);
    setLeadSent(false);
  }, [lang, t]);

  useEffect(() => {
    if (isOpen) return;
    const interval = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % hints.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isOpen, hints.length]);

  const handleSubmit = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    setInput("");
    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ messages: updatedMessages, lang }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (process.env.NODE_ENV !== "production") {
        console.log("[AIAssistant] Lead:", data.lead);
      }

      if (data.lead?.leadCompleto === true && !leadSent) {
        try {
          const leadRes = await fetch("/api/lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data.lead),
          });

          if (leadRes.ok) {
            setLeadSent(true);
            if (process.env.NODE_ENV !== "production") {
              console.log("[AIAssistant] Lead enviado a Make exitosamente");
            }
          } else {
            console.error("[AIAssistant] Error al enviar lead:", leadRes.status);
          }
        } catch (err) {
          console.error("[AIAssistant] Error en fetch de lead:", err);
        }
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t("chatbot.errorMsg"),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-2"
          >
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={hintIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="px-4 py-2 rounded-xl bg-zinc-800/80 backdrop-blur-sm border border-zinc-700/30 text-xs text-zinc-300 whitespace-nowrap shadow-lg"
                >
                  {hints[hintIndex]}
                  <div className="absolute -bottom-1.5 right-6 w-2.5 h-2.5 bg-zinc-800/80 rotate-45 border-r border-b border-zinc-700/30" />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/30 text-[11px] text-zinc-400 font-medium">
                {t("chatbot.subtitle")}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-500 shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] transition-all duration-300 flex items-center justify-center cursor-pointer animate-float flex-shrink-0"
                aria-label={t("chatbot.ariaOpen")}
              >
                <span className="text-2xl font-black text-white">B</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 20, y: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: 20, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-[60] w-[380px] h-[600px] max-h-[calc(100vh-100px)] max-sm:w-[calc(100vw-24px)] max-sm:right-3 max-sm:bottom-3 max-sm:max-h-[calc(100vh-24px)] rounded-2xl border border-zinc-800/50 bg-zinc-900/80 backdrop-blur-2xl shadow-2xl shadow-violet-500/5 flex flex-col overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-violet-600/20 to-purple-600/10 border-b border-zinc-800/50 flex-shrink-0">
              <span className="text-lg">✦</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white">
                  BERNY DEV
                </h3>
                <p className="text-[11px] text-zinc-400">{t("chatbot.subtitle")}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 flex items-center justify-center text-zinc-400 hover:text-white transition-colors flex-shrink-0"
                 aria-label={t("chatbot.ariaClose")}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 scroll-smooth">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center flex-shrink-0 border border-violet-500/20 mt-1">
                      <span className="text-sm font-bold text-violet-300">
                        B
                      </span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-700/50 flex items-center justify-center flex-shrink-0 border border-zinc-600/30 mt-1">
                      <svg
                        className="w-4 h-4 text-zinc-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-violet-600/20 border border-violet-500/25 text-white rounded-tr-md"
                        : "bg-zinc-800/50 border border-zinc-700/30 text-zinc-200 rounded-tl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center gap-2 px-4 py-3 border-t border-zinc-800/50 bg-zinc-900/50 flex-shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("chatbot.placeholder")}
                disabled={isTyping}
                className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none border-none focus:outline-none disabled:opacity-50"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!input.trim() || isTyping}
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  input.trim() && !isTyping
                    ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                    : "bg-zinc-800/50 text-zinc-600"
                }`}
                aria-label={t("chatbot.ariaSend")}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
