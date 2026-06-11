"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "How fast can I get an order?",
  "Can you stitch my own design?",
  "What's a good gift under $40?",
];

const GREETING =
  "Hi! I'm Stitch, the shop assistant. Ask me about products, custom orders, shipping, or gift ideas.";

// Client-side cap mirrors the server limit so the UI degrades gracefully.
const MAX_SESSION_MESSAGES = 30;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open, busy]);

  async function send(text: string) {
    const message = text.trim().slice(0, 500);
    if (!message || busy || sent >= MAX_SESSION_MESSAGES) return;
    setInput("");
    setBusy(true);
    setSent((n) => n + 1);
    const history = messages.slice(-10);
    setMessages((m) => [...m, { role: "user", content: message }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      const data = await res.json().catch(() => null);
      const reply =
        data?.reply ??
        "Something went wrong on my end. Please try again, or use the contact page.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "I couldn't connect just now. Please try again in a moment." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  // Turn /paths in replies into links.
  function renderContent(text: string) {
    const parts = text.split(/(\/(?:products\/[a-z0-9-]+|shop(?:\/[a-z0-9-]+)?|custom|faq|shipping|care|contact|cart|gallery|about))/g);
    return parts.map((part, i) =>
      part.startsWith("/") ? (
        <a key={i} href={part} className="font-semibold text-berry underline">
          {part}
        </a>
      ) : (
        <span key={i}>{part}</span>
      ),
    );
  }

  const atCap = sent >= MAX_SESSION_MESSAGES;

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Chat with us"}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-berry text-2xl text-cream shadow-lg transition hover:bg-berry-deep"
      >
        {open ? "✕" : "🧵"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[28rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-2xl">
          <div className="bg-ink px-4 py-3 text-cream">
            <p className="font-semibold">Ask Grace&rsquo;s Stitchery</p>
            <p className="text-xs text-cream/70">
              AI assistant · answers about products &amp; orders · a human replies on the{" "}
              <a href="/contact" className="underline">contact page</a>
            </p>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-cream p-4">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white p-3 text-sm shadow-sm">
              {GREETING}
            </div>
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-ink/20 bg-white px-3 py-1.5 text-xs font-semibold hover:border-berry hover:text-berry"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-berry p-3 text-sm text-cream"
                    : "max-w-[85%] rounded-2xl rounded-tl-sm bg-white p-3 text-sm shadow-sm"
                }
              >
                {m.role === "assistant" ? renderContent(m.content) : m.content}
              </div>
            ))}
            {busy && (
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white p-3 text-sm text-ink-soft shadow-sm">
                Stitching an answer…
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 border-t border-ink/10 bg-white p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder={atCap ? "Chat limit reached, use /contact" : "Type a question…"}
              disabled={busy || atCap}
              className="input flex-1"
              aria-label="Chat message"
            />
            <button
              type="submit"
              disabled={busy || atCap || !input.trim()}
              className="rounded-full bg-berry px-4 font-semibold text-cream transition hover:bg-berry-deep disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
