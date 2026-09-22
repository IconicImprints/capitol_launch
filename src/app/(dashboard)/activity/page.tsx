"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  deleteChatMessage,
  editChatMessage,
  getActivities,
  loadAppState,
  loadRooms,
  loadPinnedMessages,
  pinChatMessage,
  searchChatMessages,
  sendChatMessage,
  toggleChatReaction,
  type CapitolActivity,
} from "@/lib/capitol-session";
import {
  ThumbsUp,
  Heart,
  Laugh,
  PartyPopper,
  Eye,
  Flame,
  Search,
  Pin,
  MoreHorizontal,
  Reply,
  Edit,
  Trash2,
  Copy,
  CheckCircle2,
  Info,
  X,
  Paperclip,
  Send,
} from "lucide-react";

type ChatMessage = CapitolActivity & {
  authorName?: string;
};

const REACTION_ICONS = [
  { emoji: "👍", Icon: ThumbsUp, label: "Like" },
  { emoji: "❤️", Icon: Heart, label: "Love" },
  { emoji: "😂", Icon: Laugh, label: "Laugh" },
  { emoji: "🎉", Icon: PartyPopper, label: "Celebrate" },
  { emoji: "👀", Icon: Eye, label: "Interesting" },
  { emoji: "🔥", Icon: Flame, label: "Fire" },
];

const EMOJI_TO_ICON = Object.fromEntries(REACTION_ICONS.map((r) => [r.emoji, r.Icon]));

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatDateSeparator(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toUpperCase();
}

function MessageActions({
  onReply,
  onEdit,
  onDelete,
  onPin,
  onReact,
  onCopy,
  isPinned,
}: {
  onReply: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPin: () => void;
  onReact: (emoji: string) => void;
  onCopy: () => void;
  isPinned: boolean;
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onMouseEnter={() => setShowActions(true)}
        onFocus={() => setShowActions(true)}
        className="capitol-pill"
        style={{ padding: "0.2rem 0.5rem", fontSize: "0.75rem", opacity: 0, transition: "opacity 0.15s" }}
        onBlur={() => setTimeout(() => setShowActions(false), 150)}
        onMouseLeave={() => setShowActions(false)}
      >
        <MoreHorizontal size={14} />
      </button>
      {showActions && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: 10,
            background: "var(--c-surface)",
            border: "1px solid var(--c-line)",
            borderRadius: "var(--radius-2xs)",
            boxShadow: "var(--shadow-md)",
            padding: "0.25rem",
            minWidth: "170px",
          }}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          <button onClick={() => { onReply(); setShowActions(false); }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.4rem 0.75rem", textAlign: "left", fontSize: "0.85rem", background: "transparent", border: "none", cursor: "pointer", color: "var(--c-text)" }}>
            <Reply size={14} /> Reply
          </button>
          <button onClick={() => { onReact("Ã°Å¸â€˜Â"); setShowActions(false); }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.4rem 0.75rem", textAlign: "left", fontSize: "0.85rem", background: "transparent", border: "none", cursor: "pointer", color: "var(--c-text)" }}>
            <ThumbsUp size={14} /> Like
          </button>
          <button onClick={() => { onReact("Ã°Å¸â€Â¥"); setShowActions(false); }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.4rem 0.75rem", textAlign: "left", fontSize: "0.85rem", background: "transparent", border: "none", cursor: "pointer", color: "var(--c-text)" }}>
            <Flame size={14} /> Fire
          </button>
          <button onClick={() => { onCopy(); setShowActions(false); }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.4rem 0.75rem", textAlign: "left", fontSize: "0.85rem", background: "transparent", border: "none", cursor: "pointer", color: "var(--c-text)" }}>
            <Copy size={14} /> Copy
          </button>
          <button onClick={() => { onEdit(); setShowActions(false); }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.4rem 0.75rem", textAlign: "left", fontSize: "0.85rem", background: "transparent", border: "none", cursor: "pointer", color: "var(--c-text)" }}>
            <Edit size={14} /> Edit
          </button>
          <button onClick={() => { onPin(); setShowActions(false); }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.4rem 0.75rem", textAlign: "left", fontSize: "0.85rem", background: "transparent", border: "none", cursor: "pointer", color: "var(--c-text)" }}>
            <Pin size={14} /> {isPinned ? "Unpin" : "Pin"}
          </button>
          <button onClick={() => { onDelete(); setShowActions(false); }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.4rem 0.75rem", textAlign: "left", fontSize: "0.85rem", background: "transparent", border: "none", cursor: "pointer", color: "var(--c-danger)" }}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function ActivityPage() {
  const rooms = useMemo(() => loadRooms(), []);
  const currentRoom = useMemo(() => {
    const app = loadAppState();
    return app.room ?? rooms[0] ?? null;
  }, [rooms]);

  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ChatMessage[]>([]);
  const [showPins, setShowPins] = useState(false);
  const [newMessageIndicator, setNewMessageIndicator] = useState(false);
  const [attachment, setAttachment] = useState<string | null>(null);
  const [messagesVersion, setMessagesVersion] = useState(0);
  const [pinsVersion, setPinsVersion] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const prevMessageCountRef = useRef(0);

  const messages = useMemo<ChatMessage[]>(() => {
    if (!currentRoom) return [];
    const raw = getActivities(currentRoom.id);
    const sorted = [...raw].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    return sorted.map((msg) => {
      const member = currentRoom.members.find((m) => m.id === msg.userId);
      return {
        ...msg,
        authorName: member?.label ?? msg.userId ?? "Unknown",
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom, messagesVersion]);

  const pinnedMessages = useMemo<ChatMessage[]>(() => {
    if (!currentRoom) return [];
    const raw = loadPinnedMessages(currentRoom.id);
    return raw.map((msg) => {
      const member = currentRoom.members.find((m) => m.id === msg.userId);
      return {
        ...msg,
        authorName: member?.label ?? msg.userId ?? "Unknown",
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom, pinsVersion]);

  const groupedMessages = useMemo(() => {
    const groups: { dateLabel: string; items: ChatMessage[] }[] = [];
    let current: { dateLabel: string; items: ChatMessage[] } | null = null;
    for (const msg of messages) {
      const label = formatDateSeparator(msg.timestamp);
      if (!current || current.dateLabel !== label) {
        current = { dateLabel: label, items: [] };
        groups.push(current);
      }
      current.items.push(msg);
    }
    return groups;
  }, [messages]);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const handleScroll = () => {
      const bottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      setIsAtBottom(bottom);
      if (bottom) setNewMessageIndicator(false);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isAtBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (messages.length > prevMessageCountRef.current) {
      setNewMessageIndicator(true);
    }
    prevMessageCountRef.current = messages.length;
  }, [messages, isAtBottom]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setNewMessageIndicator(false);
    setIsAtBottom(true);
  };

  const handleSend = () => {
    if (!text.trim() && !attachment) return;
    if (!currentRoom) return;

    if (editId) {
      editChatMessage(editId, text.trim());
      setEditId(null);
    } else {
      sendChatMessage(currentRoom.id, text.trim(), {
        replyTo: replyTo?.id,
        image: attachment ?? undefined,
      });
    }

    setText("");
    setAttachment("");
    setReplyTo(null);
    setMessagesVersion((v) => v + 1);
    setPinsVersion((v) => v + 1);
    setIsAtBottom(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape" && editId) {
      setEditId(null);
      setText("");
    }
  };

  const handleSearch = () => {
    if (!currentRoom || !searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const results = searchChatMessages(currentRoom.id, searchQuery.trim());
    const mapped: ChatMessage[] = results.map((msg) => {
      const member = currentRoom.members.find((m) => m.id === msg.userId);
      return {
        ...msg,
        authorName: member?.label ?? msg.userId ?? "Unknown",
      };
    });
    setSearchResults(mapped);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAttachment(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSearchResultClick = (msg: ChatMessage) => {
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
    const el = document.getElementById(`msg-${msg.id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const [lightbox, setLightbox] = useState<string | null>(null);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const handleReplyClick = (msg: ChatMessage) => {
    setReplyTo(msg);
    setEditId(null);
    textareaRef.current?.focus();
  };

  const handleEditClick = (msg: ChatMessage) => {
    setEditId(msg.id);
    setText(msg.text);
    setReplyTo(null);
    textareaRef.current?.focus();
  };

  return (
    <div className="capitol-chat">
      <div className="capitol-chat-header">
        <div className="capitol-chat-header-left">
          <div className="capitol-chat-room-icon">
            {currentRoom ? currentRoom.name.slice(0, 2).toUpperCase() : "?"}
          </div>
          <div className="capitol-chat-room-meta">
            <div className="capitol-chat-room-name">
              {currentRoom ? currentRoom.name : "Select a room"}
            </div>
            <div className="capitol-chat-room-sub">
              {currentRoom ? `${currentRoom.members.length} members` : "No room selected"}
            </div>
          </div>
        </div>
        <div className="capitol-cluster" style={{ gap: "0.5rem" }}>
          {currentRoom && (
            <Link href={`/rooms/${currentRoom.id}`} className="capitol-pill capitol-pill-sm" style={{ textDecoration: "none", color: "var(--c-text)" }}>
              <Info size={14} style={{ display: "inline", marginRight: "0.35rem", verticalAlign: "middle" }} />
              Info
            </Link>
          )}
          <button onClick={() => setShowSearch((v) => !v)} className="capitol-pill capitol-pill-sm">
            <Search size={14} style={{ display: "inline", marginRight: "0.35rem", verticalAlign: "middle" }} />
            Search
          </button>
          <button onClick={() => setShowPins((v) => !v)} className="capitol-pill capitol-pill-sm">
            <Pin size={14} style={{ display: "inline", marginRight: "0.35rem", verticalAlign: "middle" }} />
            Pins
            {pinnedMessages.length > 0 && (
              <span className="capitol-badge" style={{ padding: "0.15rem 0.5rem", fontSize: "0.72rem", background: "var(--c-text)", color: "#fff", borderColor: "var(--c-text)" }}>
                {pinnedMessages.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {showSearch && currentRoom && (
        <div className="capitol-chat-search">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search messages..."
            className="capitol-input"
            autoFocus
          />
          <button onClick={handleSearch} className="capitol-btn" style={{ marginTop: "0.75rem", width: "100%" }}>
            <Search size={16} style={{ display: "inline", marginRight: "0.4rem", verticalAlign: "middle" }} />
            Search
          </button>
          {searchResults.length > 0 && (
            <div style={{ marginTop: "0.75rem", maxHeight: "200px", overflowY: "auto" }}>
              {searchResults.map((msg) => (
                <button key={msg.id} onClick={() => handleSearchResultClick(msg)} style={{ display: "block", width: "100%", padding: "0.5rem", textAlign: "left", background: "transparent", border: "none", borderBottom: "1px solid var(--c-line)", cursor: "pointer", color: "var(--c-text)" }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600 }}>{msg.authorName ?? "Unknown"}</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--c-text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.text}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {showPins && currentRoom && (
        <div className="capitol-chat-pins">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 700 }}>Pinned Messages</p>
            <button onClick={() => setShowPins(false)} className="capitol-pill capitol-pill-sm">
              <X size={14} />
            </button>
          </div>
          {pinnedMessages.length === 0 ? (
            <p style={{ fontSize: "0.85rem", color: "var(--c-text-3)" }}>No pinned messages yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {pinnedMessages.map((msg) => (
                <div key={msg.id} style={{ padding: "0.75rem", borderRadius: "var(--radius-2xs)", border: "1px solid var(--c-line)", background: "var(--c-surface-2)" }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--c-text)", marginBottom: "0.25rem" }}>{msg.authorName ?? "Unknown"}</p>
                  <p style={{ fontSize: "0.9rem", color: "var(--c-text-2)", lineHeight: 1.5 }}>{msg.text}</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--c-text-4)", marginTop: "0.35rem" }}>{formatTime(msg.timestamp)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="capitol-chat-messages" ref={messagesContainerRef}>
        {!currentRoom ? (
          <div className="capitol-empty">
            <p>No room selected.</p>
            <p style={{ color: "var(--c-text-3)", marginTop: "0.5rem" }}>Join a room to see activity chat.</p>
          </div>
        ) : groupedMessages.length === 0 ? (
          <div className="capitol-empty">
            <p>No messages yet.</p>
            <p style={{ color: "var(--c-text-3)", marginTop: "0.5rem" }}>Start the conversation.</p>
          </div>
        ) : (
          groupedMessages.map((group) => (
            <div key={group.dateLabel}>
              <div className="capitol-chat-date-separator"><span>{group.dateLabel}</span></div>
              {group.items.map((msg, idx) => {
                const prev = idx > 0 ? group.items[idx - 1] : null;
                const isGrouped = !!prev && prev.userId === msg.userId && sameDay(new Date(prev.timestamp), new Date(msg.timestamp));
                const replyMsg = msg.replyTo ? messages.find((m) => m.id === msg.replyTo) : null;
                return (
                  <div key={msg.id} className="capitol-chat-message" id={`msg-${msg.id}`}>
                    {!isGrouped && <div className="capitol-chat-message-avatar">{msg.authorName?.slice(0, 2).toUpperCase() ?? "?"}</div>}
                    {isGrouped && <div style={{ width: 36, flexShrink: 0 }} />}
                    <div className="capitol-chat-message-body">
                      {!isGrouped && (
                        <div className="capitol-chat-message-header">
                          <span className="capitol-chat-message-author">{msg.authorName ?? "Unknown"}</span>
                          <span className="capitol-chat-message-time">{formatTime(msg.timestamp)}</span>
                          {msg.edited && <span style={{ fontSize: "0.75rem", color: "var(--c-text-4)" }}>(edited)</span>}
                        </div>
                      )}
                      {replyMsg && (
                        <div className="capitol-chat-reply-preview" style={{ marginBottom: "0.5rem", padding: "0.4rem 0.75rem", borderRadius: "var(--radius-2xs)", background: "var(--c-surface-2)", border: "1px solid var(--c-line)" }}>
                          <p style={{ fontSize: "0.8rem", color: "var(--c-text-3)", marginBottom: "0.15rem" }}>Replying to {replyMsg.authorName ?? "message"}</p>
                          <p style={{ fontSize: "0.85rem", color: "var(--c-text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{replyMsg.text}</p>
                        </div>
                      )}
                      <p className="capitol-chat-message-text">{msg.text}</p>
                      {msg.image && (
                        <div className="capitol-chat-message-image" onClick={() => msg.image && setLightbox(msg.image)}>
                          <img src={msg.image} alt="Attachment" />
                        </div>
                      )}
                      {msg.type === "proof" && (
                        <div className="capitol-chat-message-badges">
                          <span className="capitol-badge" style={{ background: "var(--c-text)", color: "#fff", borderColor: "var(--c-text)" }}>
                            <CheckCircle2 size={12} style={{ display: "inline", marginRight: "0.35rem", verticalAlign: "middle" }} />
                            Proof
                          </span>
                        </div>
                      )}
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="capitol-chat-message-badges" style={{ marginTop: "0.5rem" }}>
                          {msg.reactions.map((r) => {
                            const Icon = EMOJI_TO_ICON[r.emoji];
                            return (
                              <button key={r.emoji} onClick={() => toggleChatReaction(msg.id, r.emoji)} className="capitol-chat-reaction">
                                {Icon ? <Icon size={14} /> : r.emoji} {r.users.length}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      <div style={{ marginTop: "0.25rem" }}>
                        <MessageActions
                          onReply={() => handleReplyClick(msg)}
                          onEdit={() => handleEditClick(msg)}
                          onDelete={() => { deleteChatMessage(msg.id); setMessagesVersion((v) => v + 1); setPinsVersion((v) => v + 1); }}
                          onPin={() => { pinChatMessage(msg.id, true); setPinsVersion((v) => v + 1); }}
                          onReact={(emoji) => { toggleChatReaction(msg.id, emoji); setMessagesVersion((v) => v + 1); }}
                          onCopy={() => handleCopy(msg.text)}
                          isPinned={!!msg.metadata?.pinned}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {newMessageIndicator && (
        <button onClick={scrollToBottom} className="capitol-chat-new-messages capitol-btn" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
          New messages
        </button>
      )}

      {replyTo && (
        <div className="capitol-chat-reply-preview">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "0.8rem", color: "var(--c-text-3)", marginBottom: "0.15rem" }}>Replying to {replyTo.authorName ?? "Unknown"}</p>
              <p style={{ fontSize: "0.85rem", color: "var(--c-text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{replyTo.text}</p>
            </div>
            <button onClick={() => setReplyTo(null)} className="capitol-pill capitol-pill-sm" style={{ marginLeft: "0.5rem" }}>
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {editId && (
        <div className="capitol-chat-reply-preview">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--c-text-2)" }}>Editing message...</p>
            <button onClick={() => { setEditId(null); setText(""); }} className="capitol-pill capitol-pill-sm">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="capitol-chat-composer">
        <button onClick={() => fileInputRef.current?.click()} className="capitol-pill capitol-pill-pill" style={{ padding: "0.5rem" }} title="Attach image">
          <Paperclip size={18} />
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
        {attachment && (
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
            <img src={attachment} alt="Preview" style={{ height: 36, width: 36, objectFit: "cover", borderRadius: "var(--radius-2xs)", border: "1px solid var(--c-line)" }} />
            <button onClick={() => setAttachment(null)} style={{ position: "absolute", top: "-6px", right: "-6px", width: 18, height: 18, borderRadius: "999px", background: "var(--c-danger)", color: "#fff", border: "none", cursor: "pointer", display: "grid", placeItems: "center", fontSize: "0.7rem", lineHeight: 1 }}>
              <X size={10} />
            </button>
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={currentRoom ? `Message #${currentRoom.name.toLowerCase().replace(/\s+/g, "-")}` : "Select a room to message"}
          className="capitol-input"
          rows={1}
          disabled={!currentRoom}
          style={{ resize: "none" }}
        />
        <button onClick={handleSend} disabled={!currentRoom || (!text.trim() && !attachment)} className="capitol-btn" style={{ padding: "0.8rem 1.25rem", fontSize: "0.95rem" }}>
          <Send size={16} />
        </button>
      </div>

      {lightbox && (
        <div className="capitol-chat-lightbox" onClick={() => setLightbox(null)}>
          <div className="capitol-chat-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox} alt="Full size" />
            <button onClick={() => setLightbox(null)} className="capitol-chat-lightbox-close">
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
