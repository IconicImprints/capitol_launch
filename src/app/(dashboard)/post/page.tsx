"use client";

import { useState, useMemo } from "react";
import {
  loadPosts,
  createPost,
  likePost,
  unlikePost,
  repostPost,
  addComment,
  loadProfile,
  type CapitolPost,
} from "@/lib/capitol-session";

type View = "feed" | "post" | "profile";

export default function PostPage() {
  const [posts, setPosts] = useState<CapitolPost[]>(() => loadPosts());
  const [composerOpen, setComposerOpen] = useState(false);
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [link, setLink] = useState("");
  const [view, setView] = useState<View>("feed");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const maxChars = 280;

  const profile = useMemo(() => loadProfile(), []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handlePost = () => {
    if (!text.trim() && !image) return;
    createPost({
      text: text.trim(),
      image: image ?? undefined,
      link: link.trim() || undefined,
      createdAt: new Date().toISOString(),
      authorId: profile?.id || "you",
      authorName: profile?.display_name?.trim() || "You",
      authorUsername: profile?.username?.trim() || "you",
      replyTo: replyTo ?? undefined,
    });
    setText("");
    setImage(null);
    setLink("");
    setReplyTo(null);
    setReplyText("");
    setComposerOpen(false);
    setPosts(loadPosts());
  };

  const handleLike = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    const userId = profile?.id || "you";
    if (post.likes.includes(userId)) {
      unlikePost(postId);
    } else {
      likePost(postId);
    }
    setPosts(loadPosts());
  };

  const handleRepost = (postId: string) => {
    repostPost(postId);
    setPosts(loadPosts());
  };

  const handleReply = (postId: string) => {
    if (!replyText.trim()) return;
    addComment(postId, replyText.trim());
    setReplyText("");
    setReplyTo(null);
    setPosts(loadPosts());
  };

  const openPost = (postId: string) => {
    setSelectedPostId(postId);
    setView("post");
  };

  const openProfile = (authorId: string) => {
    setSelectedProfileId(authorId);
    setView("profile");
  };

  const goBack = () => {
    setView("feed");
    setSelectedPostId(null);
    setSelectedProfileId(null);
  };

  const userNiches = useMemo(() => {
    const raw = profile?.interest || "";
    return raw
      .split(",")
      .map((n) => n.trim().toLowerCase())
      .filter(Boolean);
  }, [profile]);

  const nicheMatch = (post: CapitolPost) => {
    const hay = (post.text + " " + (post.link || "")).toLowerCase();
    if (!userNiches.length) return false;
    return userNiches.some((niche) => hay.includes(niche));
  };

  const sortedPosts = useMemo(() => {
    const all = [...posts];
    const sameNiche: CapitolPost[] = [];
    const otherNiche: CapitolPost[] = [];
    for (const post of all) {
      if (nicheMatch(post)) {
        sameNiche.push(post);
      } else {
        otherNiche.push(post);
      }
    }
    const half = Math.ceil(all.length * 0.5);
    const takeSame = Math.min(sameNiche.length, half);
    const takeOther = Math.min(otherNiche.length, all.length - takeSame);
    const result: CapitolPost[] = [
      ...sameNiche.slice(0, takeSame),
      ...otherNiche.slice(0, takeOther),
    ];
    return result;
  }, [posts, userNiches]);

  const selectedPost = posts.find((p) => p.id === selectedPostId);
  const selectedProfilePosts = useMemo(() => {
    if (!selectedProfileId) return [];
    return posts.filter((p) => p.authorId === selectedProfileId);
  }, [posts, selectedProfileId]);

  if (view === "post" && selectedPost) {
    return (
      <div className="capitol-stack">
        <div className="capitol-row" style={{ marginBottom: "0.5rem" }}>
          <button onClick={goBack} className="capitol-btn capitol-btn-ghost" style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem" }}>
            ← Back
          </button>
        </div>
        <PostCard post={selectedPost} onLike={handleLike} onRepost={handleRepost} onReply={handleReply} onOpenProfile={openProfile} replyTo={replyTo} setReplyTo={setReplyTo} replyText={replyText} setReplyText={setReplyText} />
      </div>
    );
  }

  if (view === "profile" && selectedProfileId) {
    const profilePosts = selectedProfilePosts;
    return (
      <div className="capitol-stack">
        <div className="capitol-row" style={{ marginBottom: "0.5rem" }}>
          <button onClick={goBack} className="capitol-btn capitol-btn-ghost" style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem" }}>
            ← Back
          </button>
        </div>
        <ProfileView posts={profilePosts} onOpenPost={openPost} />
      </div>
    );
  }

  return (
    <div className="capitol-stack">
      <div>
        <h1 className="capitol-section-title" style={{ fontSize: "1.4rem" }}>Post</h1>
        <p className="capitol-section-sub">Share what you&apos;re building.</p>
      </div>

      {sortedPosts.length === 0 ? (
        <div className="capitol-card" style={{ padding: "2.5rem", textAlign: "center" }}>
          <div className="capitol-empty">
            <p>No posts yet.</p>
            <p style={{ color: "var(--c-text-3)", marginTop: "0.5rem" }}>Be the first to share what you&apos;re building.</p>
          </div>
        </div>
      ) : (
        <div className="capitol-stack">
          {sortedPosts.map((post) => (
            <PostCard key={post.id} post={post} onLike={handleLike} onRepost={handleRepost} onReply={handleReply} onOpenProfile={openProfile} replyTo={replyTo} setReplyTo={setReplyTo} replyText={replyText} setReplyText={setReplyText} />
          ))}
        </div>
      )}

      <button
        onClick={() => setComposerOpen(true)}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--c-text)",
          color: "#fff",
          border: "none",
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
          boxShadow: "var(--shadow-md)",
          zIndex: 50,
        }}
        aria-label="New post"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {composerOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "grid", placeItems: "center", background: "rgba(0,0,0,0.4)" }}>
          <div className="capitol-card" style={{ padding: "1.25rem", width: "100%", maxWidth: 520, maxHeight: "90vh", overflow: "auto" }}>
            <div className="capitol-cluster" style={{ gap: "0.75rem", marginBottom: "0.75rem" }}>
              <div className="capitol-avatar" style={{ width: 40, height: 40, fontSize: "0.85rem" }}>
                {profile?.avatar ? <img src={profile.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (profile?.display_name?.slice(0, 2).toUpperCase() || "YO")}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value.slice(0, maxChars))}
                  placeholder="What are you building?"
                  className="capitol-input"
                  rows={3}
                  style={{ resize: "vertical", minHeight: 80 }}
                />
                {image && (
                  <div style={{ marginTop: "0.75rem", position: "relative" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="Upload preview" style={{ width: "100%", maxHeight: "320px", objectFit: "cover", borderRadius: "var(--radius-2xs)", border: "1px solid var(--c-line)" }} />
                    <button onClick={() => setImage(null)} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, display: "grid", placeItems: "center", cursor: "pointer", fontSize: "0.8rem" }}>Ã—</button>
                  </div>
                )}
                <div className="capitol-cluster" style={{ justifyContent: "space-between", marginTop: "0.75rem" }}>
                  <div className="capitol-cluster" style={{ gap: "0.5rem" }}>
                    <label className="capitol-btn capitol-btn-ghost" style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem", cursor: "pointer" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                    <input
                      type="text"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="Link (optional)"
                      className="capitol-input"
                      style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem", width: "auto" }}
                    />
                  </div>
                  <div className="capitol-cluster" style={{ gap: "0.75rem" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--c-text-4)" }}>{text.length}/{maxChars}</span>
                    <button onClick={handlePost} disabled={!text.trim() && !image} className="capitol-btn" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="capitol-cluster" style={{ justifyContent: "flex-end" }}>
              <button onClick={() => setComposerOpen(false)} className="capitol-btn capitol-btn-ghost" style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PostCard({ post, onLike, onRepost, onReply, onOpenProfile, replyTo, setReplyTo, replyText, setReplyText }: {
  post: CapitolPost;
  onLike: (id: string) => void;
  onRepost: (id: string) => void;
  onReply: (id: string) => void;
  onOpenProfile: (id: string) => void;
  replyTo: string | null;
  setReplyTo: (id: string | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
}) {
  const [localReply, setLocalReply] = useState("");
  const profile = useMemo(() => loadProfile(), []);
  const currentUserId = profile?.id || "you";
  const hasLiked = post.likes.includes(currentUserId);
  const hasReposted = post.reposts.includes(currentUserId);

  const handleSubmitReply = () => {
    if (!localReply.trim()) return;
    onReply(post.id);
    setLocalReply("");
  };

  return (
    <div className="capitol-card" style={{ padding: "1.25rem" }}>
      <div className="capitol-cluster" style={{ gap: "0.75rem", marginBottom: "0.75rem" }}>
        <button onClick={() => onOpenProfile(post.authorId)} className="capitol-avatar" style={{ width: 40, height: 40, fontSize: "0.85rem", cursor: "pointer", background: "none", padding: 0 }}>
          {post.authorAvatar ? <img src={post.authorAvatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : post.authorName.slice(0, 2).toUpperCase()}
        </button>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="capitol-cluster" style={{ gap: "0.5rem" }}>
            <button onClick={() => onOpenProfile(post.authorId)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--c-text)" }}>{post.authorName}</span>
            </button>
            <span style={{ fontSize: "0.8rem", color: "var(--c-text-4)" }}>@{post.authorUsername}</span>
            <span style={{ fontSize: "0.8rem", color: "var(--c-text-4)" }}>Â·</span>
            <span style={{ fontSize: "0.8rem", color: "var(--c-text-4)" }}>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "0.75rem" }}>
        <p style={{ fontSize: "0.95rem", color: "var(--c-text-2)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{post.text}</p>
        {post.image && (
          <div style={{ marginTop: "0.75rem", borderRadius: "var(--radius-2xs)", overflow: "hidden", border: "1px solid var(--c-line)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt="Post" style={{ width: "100%", maxHeight: "480px", objectFit: "cover", display: "block" }} />
          </div>
        )}
        {post.link && (
          <a href={post.link} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem", fontSize: "0.85rem", color: "var(--c-text-3)", textDecoration: "none", border: "1px solid var(--c-line)", borderRadius: "var(--radius-pixel)", padding: "0.5rem 0.75rem" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            {post.link}
          </a>
        )}
      </div>

      <div className="capitol-cluster" style={{ gap: "1.5rem", paddingTop: "0.75rem", borderTop: "1px solid var(--c-line)" }}>
        <button onClick={() => { setReplyTo(post.id); setReplyText(""); }} className="capitol-cluster" style={{ gap: "0.35rem", background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--c-text-3)", fontSize: "0.85rem" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {post.comments.length}
        </button>
        <button onClick={() => onRepost(post.id)} className="capitol-cluster" style={{ gap: "0.35rem", background: "none", border: "none", padding: 0, cursor: "pointer", color: hasReposted ? "var(--c-text)" : "var(--c-text-3)", fontSize: "0.85rem" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <polyline points="7 23 3 19 7 15" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
          {post.reposts.length}
        </button>
        <button onClick={() => onLike(post.id)} className="capitol-cluster" style={{ gap: "0.35rem", background: "none", border: "none", padding: 0, cursor: "pointer", color: hasLiked ? "#c0392b" : "var(--c-text-3)", fontSize: "0.85rem" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {post.likes.length}
        </button>
      </div>

      {replyTo === post.id && (
        <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--c-line)" }}>
          <textarea
            value={localReply}
            onChange={(e) => setLocalReply(e.target.value.slice(0, 280))}
            placeholder="Write a reply..."
            className="capitol-input"
            rows={2}
            style={{ resize: "vertical", minHeight: 60, marginBottom: "0.5rem" }}
          />
          <div className="capitol-cluster" style={{ justifyContent: "flex-end" }}>
            <button onClick={() => setReplyTo(null)} className="capitol-btn capitol-btn-ghost" style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem" }}>Cancel</button>
            <button onClick={handleSubmitReply} disabled={!localReply.trim()} className="capitol-btn" style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem" }}>Reply</button>
          </div>
        </div>
      )}

      {post.comments.length > 0 && (
        <div className="capitol-stack" style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--c-line)" }}>
          {post.comments.map((comment) => (
            <div key={comment.id} className="capitol-cluster" style={{ gap: "0.75rem" }}>
              <div className="capitol-avatar" style={{ width: 32, height: 32, fontSize: "0.75rem" }}>
                {comment.authorAvatar ? <img src={comment.authorAvatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : comment.authorName.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="capitol-cluster" style={{ gap: "0.5rem" }}>
                  <button onClick={() => onOpenProfile(comment.authorId)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, color: "var(--c-text)" }}>{comment.authorName}</button>
                  <span style={{ fontSize: "0.8rem", color: "var(--c-text-4)" }}>@{comment.authorUsername}</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--c-text-4)" }}>Â·</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--c-text-4)" }}>{new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--c-text-2)", lineHeight: 1.5, marginTop: "0.25rem" }}>{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileView({ posts, onOpenPost }: { posts: CapitolPost[]; onOpenPost: (id: string) => void }) {
  const profile = useMemo(() => loadProfile(), []);
  if (!profile) return null;

  return (
    <div className="capitol-stack">
      <div className="capitol-card" style={{ padding: "1.5rem" }}>
        <div className="capitol-cluster" style={{ gap: "1rem", marginBottom: "1rem" }}>
          <div className="capitol-avatar" style={{ width: 64, height: 64, fontSize: "1.25rem" }}>
            {profile.avatar ? <img src={profile.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : profile.display_name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, letterSpacing: "-0.02em" }}>{profile.display_name}</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--c-text-3)" }}>@{profile.username}</p>
          </div>
        </div>
        {profile.bio && <p style={{ fontSize: "0.95rem", color: "var(--c-text-2)", lineHeight: 1.5, marginBottom: "0.75rem" }}>{profile.bio}</p>}
        <div className="capitol-cluster" style={{ gap: "1.25rem" }}>
          <div>
            <span style={{ fontSize: "1rem", fontWeight: 700 }}>{posts.length}</span>
            <span style={{ fontSize: "0.85rem", color: "var(--c-text-3)", marginLeft: "0.25rem" }}>Posts</span>
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="capitol-card" style={{ padding: "2.5rem", textAlign: "center" }}>
          <div className="capitol-empty">
            <p>No posts yet.</p>
          </div>
        </div>
      ) : (
        <div className="capitol-stack">
          {posts.map((post) => (
            <div key={post.id} onClick={() => onOpenPost(post.id)} style={{ cursor: "pointer" }}>
              <PostCard post={post} onLike={() => {}} onRepost={() => {}} onReply={() => {}} onOpenProfile={() => {}} replyTo={null} setReplyTo={() => {}} replyText="" setReplyText={() => {}} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
