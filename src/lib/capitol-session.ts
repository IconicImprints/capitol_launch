/**
 * Client-side Capitol session until a backend exists.
 * Swap these helpers for API calls without changing the dashboard UI.
 */

export const PROFILE_KEY = "capitol.profile";
export const APP_KEY = "capitol.app";
export const ACCOUNT_KEY = "capitol.account";
export const PROOF_IMAGE_KEY = "capitol.proofImage";
export const ROOMS_KEY = "capitol.rooms";
export const ACTIVITIES_KEY = "capitol.activities";
export const LEADERBOARD_KEY = "capitol.leaderboard";
export const POSTS_KEY = "capitol.posts";

export type CapitolProfile = {
  id: string;
  email: string;
  username: string;
  display_name: string;
  dob: string;
  interest: string;
  bio: string;
  avatar?: string;
  current_project: string;
  status: "building" | "locked_in" | "shipping" | "offline";
  created_at: string;
};

export type RoomMember = {
  id: string;
  label: string;
  isYou?: boolean;
  avatar?: string;
  age?: number;
  niche?: string;
  streak?: number;
  activity?: number;
};

export type CapitolRoomType = "Standard" | "Elite";
export type CapitolRoomStatus = "Open" | "Starting soon" | "Almost full";

export type CapitolRoom = {
  id: string;
  name: string;
  goal: string;
  description: string;
  niche: string;
  creator: string;
  creatorAvatar?: string;
  members: RoomMember[];
  minMembers: number;
  maxMembers: number;
  ageRange: { min: number; max: number };
  durationDays: number;
  startDate: string;
  type: CapitolRoomType;
  status: CapitolRoomStatus;
  activityRate: number;
  proofRate: number;
  rules: {
    dailyProof: boolean;
    proofDeadline: string;
    allowInvites: boolean;
    approvalRequired: boolean;
    autoReplace: boolean;
    visibility: "Public" | "Discoverable" | "Private";
  };
};

export type CapitolAppState = {
  streak: number;
  bestStreak: number;
  xp: number;
  premiumPoints: number;
  lastProofDate: string | null;
  room: CapitolRoom | null;
  graceActive: boolean;
  graceUsedThisMonth: number;
};

export type CapitolAccount = {
  email: string;
};

export type ActivityType = "proof" | "mission_complete" | "mission_start" | "member_join" | "room_join" | "room_leave" | "streak_milestone" | "system" | "post";

export type CapitolActivity = {
  id: string;
  roomId?: string;
  questId?: string;
  type: ActivityType;
  text: string;
  timestamp: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  replyTo?: string;
  reactions?: { emoji: string; users: string[] }[];
  edited?: boolean;
  image?: string;
};

export type LeaderboardEntry = {
  rank: number;
  username: string;
  displayName: string;
  xp: number;
  streak: number;
  level: number;
  isCurrentUser?: boolean;
  movement: number;
  avatar?: string;
};

export type CapitolLeaderboardData = {
  global: LeaderboardEntry[];
  friends: LeaderboardEntry[];
  room: LeaderboardEntry[];
};

export type QuestStatus = "locked" | "available" | "in_progress" | "completed" | "failed" | "abandoned";
export type QuestResult = "completed" | "failed" | "abandoned" | "won" | "lost";
export type PortfolioEntryType = "completed" | "failed" | "abandoned" | "quest_won" | "quest_lost" | "milestone" | "attempted";

export type PortfolioEntry = {
  id: string;
  userId?: string;
  title: string;
  description: string;
  link?: string;
  status: PortfolioEntryType;
  createdAt: string;
  xpEarned?: number;
  questId?: string;
  metadata?: Record<string, unknown>;
};

const DEFAULT_APP: CapitolAppState = {
  streak: 0,
  bestStreak: 0,
  xp: 0,
  premiumPoints: 0,
  lastProofDate: null,
  room: null,
  graceActive: false,
  graceUsedThisMonth: 0,
};

const XP_PER_PROOF = 50;
const XP_PER_LEVEL = 500;

function canUseStorage() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string): T | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function localDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function shiftLocalDateKey(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return localDateKey(dt);
}

export function getProofPeriodEnd(now = new Date()): Date {
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  return end;
}

export function getProofPeriodId(now = new Date()): string {
  return localDateKey(now);
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

export function saveProfile(profile: CapitolProfile) {
  writeJson(PROFILE_KEY, profile);
}

export function loadProfile(): CapitolProfile | null {
  return readJson<CapitolProfile>(PROFILE_KEY);
}

export function saveAccount(account: CapitolAccount) {
  writeJson(ACCOUNT_KEY, account);
}

export function loadAccount(): CapitolAccount | null {
  return readJson<CapitolAccount>(ACCOUNT_KEY);
}

export function saveProofImage(dataUrl: string) {
  writeJson(PROOF_IMAGE_KEY, dataUrl);
}

export function loadProofImage(): string | null {
  return readJson<string>(PROOF_IMAGE_KEY);
}

export function clearProofImage() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(PROOF_IMAGE_KEY);
}

function reconcileStreak(state: CapitolAppState, today = localDateKey()): CapitolAppState {
  if (!state.lastProofDate) {
    return { ...state, streak: 0, bestStreak: 0 };
  }
  const yesterday = shiftLocalDateKey(today, -1);
  if (state.lastProofDate === today || state.lastProofDate === yesterday) {
    return state;
  }
  return { ...state, streak: 0 };
}

export function loadAppState(): CapitolAppState {
  const stored = readJson<CapitolAppState>(APP_KEY);
  const merged: CapitolAppState = {
    ...DEFAULT_APP,
    ...stored,
    room: stored?.room ?? DEFAULT_APP.room,
  };
  const reconciled = reconcileStreak(merged);
  if (!stored || reconciled.streak !== merged.streak) {
    writeJson(APP_KEY, reconciled);
  }
  return reconciled;
}

export function saveAppState(state: CapitolAppState) {
  writeJson(APP_KEY, state);
}

export function isProofSubmittedToday(state: CapitolAppState, today = localDateKey()): boolean {
  return state.lastProofDate === today;
}

export function submitTodayProof(state: CapitolAppState): CapitolAppState {
  const today = localDateKey();
  if (state.lastProofDate === today) return state;

  const yesterday = shiftLocalDateKey(today, -1);
  const nextStreak = state.lastProofDate === yesterday ? state.streak + 1 : 1;
  const nextBest = Math.max(state.bestStreak, nextStreak);

  const next: CapitolAppState = {
    ...state,
    lastProofDate: today,
    streak: nextStreak,
    bestStreak: nextBest,
    xp: state.xp + XP_PER_PROOF,
  };
  saveAppState(next);
  return next;
}

export function xpProgress(xp: number) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const intoLevel = xp % XP_PER_LEVEL;
  return {
    level,
    intoLevel,
    xpPerLevel: XP_PER_LEVEL,
    ratio: intoLevel / XP_PER_LEVEL,
  };
}

export function greetingForHour(hour: number): "Good morning" | "Good afternoon" | "Good evening" {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  return "Good evening";
}

export function firstNameFrom(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "";
  return trimmed.split(/\s+/)[0];
}

export function displayName(profile: CapitolProfile | null, account: CapitolAccount | null): string {
  if (profile?.display_name?.trim()) return firstNameFrom(profile.display_name);
  if (profile?.username?.trim()) return profile.username.trim();
  if (account?.email) {
    const local = account.email.split("@")[0];
    return local || "";
  }
  return "";
}

export function loadRooms(): CapitolRoom[] {
  const stored = readJson<CapitolRoom[]>(ROOMS_KEY);
  return stored ?? [];
}

export function saveRooms(rooms: CapitolRoom[]): void {
  writeJson(ROOMS_KEY, rooms);
}

export function getRoomById(id: string): CapitolRoom | undefined {
  const rooms = loadRooms();
  return rooms.find((r) => r.id === id);
}

export function joinRoom(roomId: string, user: { name: string; age: number; niche: string }): CapitolRoom | null {
  const rooms = loadRooms();
  const index = rooms.findIndex((r) => r.id === roomId);
  if (index === -1) return null;
  const room = rooms[index];
  if (room.members.length >= room.maxMembers) return null;
  const newMember: RoomMember = {
    id: `member-${Date.now()}`,
    label: user.name,
    isYou: true,
    avatar: user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    age: user.age,
    niche: user.niche,
    streak: 0,
    activity: 0,
  };
  const updated = { ...room, members: [...room.members, newMember] };
  rooms[index] = updated;
  saveRooms(rooms);
  return updated;
}

export function leaveRoom(roomId: string): void {
  const rooms = loadRooms();
  const updated = rooms
    .map((r) => {
      if (r.id !== roomId) return r;
      return {
        ...r,
        members: r.members.filter((m) => !m.isYou),
      };
    })
    .filter((r) => r.members.length > 0);
  saveRooms(updated);
}

export function createRoom(
  room: Omit<CapitolRoom, "id" | "members" | "status" | "activityRate" | "proofRate">
): CapitolRoom {
  const rooms = loadRooms();
  const now = new Date();
  const start = new Date(room.startDate);
  const diffMs = start.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  let status: CapitolRoomStatus = "Open";
  if (diffDays <= 1) status = "Starting soon";
  const newRoom: CapitolRoom = {
    ...room,
    id: `room-${Date.now()}`,
    members: [],
    status,
    activityRate: 0,
    proofRate: 0,
  };
  rooms.push(newRoom);
  saveRooms(rooms);
  return newRoom;
}

export function addActivity(roomId: string, type: ActivityType, text: string, metadata?: Record<string, unknown>) {
  const activities = loadActivities();
  const activity: CapitolActivity = {
    id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    roomId,
    type,
    text,
    timestamp: new Date().toISOString(),
    metadata,
  };
  activities.unshift(activity);
  if (activities.length > 500) activities.length = 500;
  saveActivities(activities);
  return activity;
}

export function loadActivities(): CapitolActivity[] {
  return readJson<CapitolActivity[]>(ACTIVITIES_KEY) ?? [];
}

export function saveActivities(activities: CapitolActivity[]) {
  writeJson(ACTIVITIES_KEY, activities);
}

export function getActivities(roomId: string | null | undefined): CapitolActivity[] {
  const all = loadActivities();
  if (!roomId) return all;
  return all.filter((a) => a.roomId === roomId);
}

export function sendChatMessage(roomId: string, text: string, options?: { replyTo?: string; image?: string }) {
  const activity: CapitolActivity = {
    id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    roomId,
    type: "post",
    text,
    timestamp: new Date().toISOString(),
    userId: "you",
    replyTo: options?.replyTo,
    image: options?.image,
  };
  const activities = loadActivities();
  activities.unshift(activity);
  if (activities.length > 500) activities.length = 500;
  saveActivities(activities);
  return activity;
}

export function addQuestActivity(questId: string, type: ActivityType, text: string, metadata?: Record<string, unknown>) {
  const activities = loadActivities();
  const activity: CapitolActivity = {
    id: `quest-activity-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    questId,
    type,
    text,
    timestamp: new Date().toISOString(),
    metadata,
  };
  activities.unshift(activity);
  if (activities.length > 500) activities.length = 500;
  saveActivities(activities);
  return activity;
}

export function getQuestActivities(questId: string): CapitolActivity[] {
  const all = loadActivities();
  return all.filter((a) => a.questId === questId);
}

export function sendQuestChat(questId: string, text: string, options?: { image?: string }) {
  const activity: CapitolActivity = {
    id: `quest-chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    questId,
    type: "post",
    text,
    timestamp: new Date().toISOString(),
    userId: "you",
    image: options?.image,
  };
  const activities = loadActivities();
  activities.unshift(activity);
  if (activities.length > 500) activities.length = 500;
  saveActivities(activities);
  return activity;
}

export function editChatMessage(id: string, text: string) {
  const activities = loadActivities();
  const next = activities.map((a) => (a.id === id ? { ...a, text, edited: true } : a));
  saveActivities(next);
}

export function deleteChatMessage(id: string) {
  const activities = loadActivities().filter((a) => a.id !== id);
  saveActivities(activities);
}

export function toggleChatReaction(messageId: string, emoji: string, userId = "you") {
  const activities = loadActivities();
  const next = activities.map((a) => {
    if (a.id !== messageId) return a;
    const reactions = a.reactions ?? [];
    const existing = reactions.find((r) => r.emoji === emoji);
    if (existing) {
      if (existing.users.includes(userId)) {
        return {
          ...a,
          reactions: reactions
            .filter((r) => !(r.emoji === emoji && r.users.includes(userId)))
            .map((r) => ({ ...r, users: r.users.filter((u) => u !== userId) }))
            .filter((r) => r.users.length > 0),
        };
      }
      return {
        ...a,
        reactions: reactions.map((r) => (r.emoji === emoji ? { ...r, users: [...r.users, userId] } : r)),
      };
    }
    return { ...a, reactions: [...reactions, { emoji, users: [userId] }] };
  });
  saveActivities(next);
}

export function pinChatMessage(messageId: string, pinned: boolean) {
  const activities = loadActivities();
  const next = activities.map((a) => (a.id === messageId ? { ...a, metadata: { ...(a.metadata ?? {}), pinned } } : a));
  saveActivities(next);
}

export function loadPinnedMessages(roomId: string) {
  return getActivities(roomId).filter((a) => (a.metadata as { pinned?: boolean } | undefined)?.pinned);
}

export function searchChatMessages(roomId: string, query: string) {
  const q = query.toLowerCase();
  return getActivities(roomId).filter((a) => a.text.toLowerCase().includes(q));
}

export function loadLeaderboard(): CapitolLeaderboardData | null {
  return readJson<CapitolLeaderboardData>(LEADERBOARD_KEY);
}

export function saveLeaderboard(data: CapitolLeaderboardData) {
  writeJson(LEADERBOARD_KEY, data);
}

export function createEmptyLeaderboard(): CapitolLeaderboardData {
  return { global: [], friends: [], room: [] };
}

export function getLeaderboard(type: "global" | "friends" | "room"): LeaderboardEntry[] {
  const stored = loadLeaderboard();
  if (!stored) return [];
  return stored[type] ?? [];
}

export function getCurrentUserRank(type: "global" | "friends" | "room" = "global"): { rank: number; total: number; entry: LeaderboardEntry | null } {
  const stored = loadLeaderboard();
  if (!stored) return { rank: 0, total: 0, entry: null };
  const pool = stored[type] ?? [];
  const me = pool.find((e) => e.isCurrentUser) ?? null;
  if (!me) return { rank: 0, total: pool.length, entry: null };
  const sorted = [...pool].sort((a, b) => b.xp - a.xp);
  const rank = sorted.findIndex((e) => e.isCurrentUser) + 1;
  return { rank, total: pool.length, entry: me };
}

export const QUESTS_KEY = "capitol.quests";
export const PORTFOLIO_KEY = "capitol.portfolio";

export function loadQuests(): Quest[] {
  return readJson<Quest[]>(QUESTS_KEY) ?? [];
}

export function saveQuests(quests: Quest[]) {
  writeJson(QUESTS_KEY, quests);
}

export type CapitolPost = {
  id: string;
  text: string;
  image?: string;
  link?: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  likes: string[];
  comments: { id: string; text: string; createdAt: string; authorId: string; authorName: string; authorUsername: string; authorAvatar?: string }[];
  reposts: string[];
  quotes: { id: string; text: string; createdAt: string; authorId: string; authorName: string; authorUsername: string; authorAvatar?: string }[];
  replyTo?: string;
};

export function loadPosts(): CapitolPost[] {
  return readJson<CapitolPost[]>(POSTS_KEY) ?? [];
}

export function savePosts(posts: CapitolPost[]) {
  writeJson(POSTS_KEY, posts);
}

export function createPost(post: Omit<CapitolPost, "id" | "likes" | "comments" | "reposts" | "quotes">): CapitolPost {
  const posts = loadPosts();
  const profile = loadProfile();
  const authorName = profile?.display_name?.trim() || "You";
  const authorUsername = profile?.username?.trim() || "you";
  const newPost: CapitolPost = {
    ...post,
    id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    authorName,
    authorUsername,
    authorAvatar: profile?.avatar,
    likes: [],
    comments: [],
    reposts: [],
    quotes: [],
  };
  posts.unshift(newPost);
  if (posts.length > 200) posts.length = 200;
  savePosts(posts);
  return newPost;
}

export function likePost(postId: string) {
  const posts = loadPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) return;
  const profile = loadProfile();
  const userId = profile?.id || "you";
  if (!post.likes.includes(userId)) {
    post.likes.push(userId);
    savePosts(posts);
  }
}

export function unlikePost(postId: string) {
  const posts = loadPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) return;
  const profile = loadProfile();
  const userId = profile?.id || "you";
  post.likes = post.likes.filter((id) => id !== userId);
  savePosts(posts);
}

export function repostPost(postId: string) {
  const posts = loadPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) return;
  const profile = loadProfile();
  const userId = profile?.id || "you";
  if (!post.reposts.includes(userId)) {
    post.reposts.push(userId);
    savePosts(posts);
  }
}

export function addComment(postId: string, text: string) {
  const posts = loadPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) return;
  const profile = loadProfile();
  const comment = {
    id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    text,
    createdAt: new Date().toISOString(),
    authorId: profile?.id || "you",
    authorName: profile?.display_name?.trim() || "You",
    authorUsername: profile?.username?.trim() || "you",
    authorAvatar: profile?.avatar,
  };
  post.comments.push(comment);
  savePosts(posts);
}

export type QuestDayStatus = "locked" | "available" | "in_progress" | "completed" | "failed";

export type QuestDay = {
  day: number;
  status: QuestDayStatus;
  title: string;
  description: string;
  requirement: string;
  completedAt?: string;
  failedAt?: string;
  proofImage?: string;
  proofText?: string;
  xpReward: number;
};

export type Quest = {
  id: string;
  title: string;
  description: string;
  goal: string;
  rules: string[];
  durationDays: number;
  reward: string;
  xpReward: number;
  participants: string[];
  createdBy: string;
  createdAt: string;
  status: QuestStatus;
  days: QuestDay[];
  startDate: string;
  endDate: string;
  requiresRoomLeave: boolean;
  currentStreak: number;
  failureReason?: string;
  completedAt?: string;
  failedAt?: string;
  abandonedAt?: string;
};

export function getQuestById(id: string): Quest | undefined {
  const quests = loadQuests();
  return quests.find((q) => q.id === id);
}

export function createQuest(quest: Omit<Quest, "id" | "createdAt" | "status" | "days" | "currentStreak" | "participants">): Quest {
  const quests = loadQuests();
  const now = new Date();
  const start = new Date(quest.startDate);
  const days: QuestDay[] = [];
  for (let i = 0; i < quest.durationDays; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    days.push({
      day: i + 1,
      status: i === 0 ? "available" : "locked",
      title: `Day ${i + 1}`,
      description: quest.goal,
      requirement: `Submit proof for day ${i + 1}`,
      xpReward: quest.xpReward / quest.durationDays,
    });
  }
  const newQuest: Quest = {
    ...quest,
    id: `quest-${Date.now()}`,
    createdAt: now.toISOString(),
    status: "available",
    days,
    currentStreak: 0,
    participants: [],
  };
  quests.push(newQuest);
  saveQuests(quests);
  return newQuest;
}

export function joinQuest(questId: string, userId = "you"): Quest | null {
  const quests = loadQuests();
  const index = quests.findIndex((q) => q.id === questId);
  if (index === -1) return null;
  const quest = quests[index];
  if (quest.status !== "available") return null;
  if (quest.participants.includes(userId)) return quest;
  const updated = {
    ...quest,
    status: "in_progress" as QuestStatus,
    participants: [...quest.participants, userId],
    days: quest.days.map((d, i) => (i === 0 ? { ...d, status: "in_progress" as QuestDayStatus } : d)),
  };
  quests[index] = updated;
  saveQuests(quests);
  return updated;
}

export function leaveQuest(questId: string, userId = "you"): Quest | null {
  const quests = loadQuests();
  const index = quests.findIndex((q) => q.id === questId);
  if (index === -1) return null;
  const quest = quests[index];
  const updated = {
    ...quest,
    participants: quest.participants.filter((p) => p !== userId),
    status: (quest.participants.length <= 1 ? "abandoned" : quest.status) as QuestStatus,
    abandonedAt: quest.participants.length <= 1 ? new Date().toISOString() : quest.abandonedAt,
  };
  quests[index] = updated;
  saveQuests(quests);
  return updated;
}

export function submitQuestProof(questId: string, dayIndex: number, proofText: string, proofImage?: string): Quest | null {
  const quests = loadQuests();
  const index = quests.findIndex((q) => q.id === questId);
  if (index === -1) return null;
  const quest = quests[index];
  if (quest.status !== "in_progress") return null;
  if (dayIndex < 0 || dayIndex >= quest.days.length) return null;
  const day = quest.days[dayIndex];
  if (day.status === "completed") return quest;
  const updatedDays = quest.days.map((d, i) => {
    if (i !== dayIndex) return d;
    return { ...d, status: "completed" as QuestDayStatus, completedAt: new Date().toISOString(), proofText, proofImage };
  });
  const nextStreak = dayIndex === 0 ? 1 : quest.currentStreak + 1;
  const allCompleted = updatedDays.every((d) => d.status === "completed");
  const updated: Quest = {
    ...quest,
    days: updatedDays,
    currentStreak: nextStreak,
    status: allCompleted ? "completed" : quest.status,
    completedAt: allCompleted ? new Date().toISOString() : quest.completedAt,
  };
  quests[index] = updated;
  saveQuests(quests);
  if (allCompleted) {
    addPortfolioEntry({
      status: "quest_won",
      title: quest.title,
      description: `Completed quest: ${quest.title}`,
      xpEarned: quest.xpReward,
      questId: quest.id,
    });
  }
  return updated;
}

export function failQuestDay(questId: string, dayIndex: number, reason: string): Quest | null {
  const quests = loadQuests();
  const index = quests.findIndex((q) => q.id === questId);
  if (index === -1) return null;
  const quest = quests[index];
  if (quest.status !== "in_progress") return null;
  if (dayIndex < 0 || dayIndex >= quest.days.length) return null;
  const updatedDays = quest.days.map((d, i) => {
    if (i !== dayIndex) return d;
    return { ...d, status: "failed" as QuestDayStatus, failedAt: new Date().toISOString() };
  });
  const updated: Quest = {
    ...quest,
    days: updatedDays,
    status: "failed",
    failureReason: reason,
    failedAt: new Date().toISOString(),
  };
  quests[index] = updated;
  saveQuests(quests);
  addPortfolioEntry({
    status: "quest_lost",
    title: quest.title,
    description: `Failed quest: ${quest.title}. Reason: ${reason}`,
    questId: quest.id,
  });
  return updated;
}

export function failQuest(questId: string, reason: string): Quest | null {
  const quests = loadQuests();
  const index = quests.findIndex((q) => q.id === questId);
  if (index === -1) return null;
  const quest = quests[index];
  const updated: Quest = {
    ...quest,
    status: "failed",
    failureReason: reason,
    failedAt: new Date().toISOString(),
  };
  quests[index] = updated;
  saveQuests(quests);
  addPortfolioEntry({
    status: "quest_lost",
    title: quest.title,
    description: `Failed quest: ${quest.title}. Reason: ${reason}`,
    questId: quest.id,
  });
  return updated;
}

export function loadPortfolioEntries(): PortfolioEntry[] {
  return readJson<PortfolioEntry[]>(PORTFOLIO_KEY) ?? [];
}

export function savePortfolioEntries(entries: PortfolioEntry[]) {
  writeJson(PORTFOLIO_KEY, entries);
}

export function addPortfolioEntry(entry: Omit<PortfolioEntry, "id" | "createdAt">) {
  const entries = loadPortfolioEntries();
  const profile = loadProfile();
  const newEntry: PortfolioEntry = {
    ...entry,
    id: `portfolio-${Date.now()}`,
    userId: entry.userId || profile?.id || "you",
    createdAt: new Date().toISOString(),
  };
  entries.unshift(newEntry);
  if (entries.length > 200) entries.length = 200;
  savePortfolioEntries(entries);
  return newEntry;
}

export function addPortfolioActivityFromActivity(activity: CapitolActivity) {
  const typeMap: Record<string, PortfolioEntryType> = {
    proof: "completed",
    mission_complete: "completed",
    mission_start: "attempted",
    streak_milestone: "milestone",
    room_join: "attempted",
    room_leave: "abandoned",
  };
  const entryType = typeMap[activity.type] ?? "attempted";
  addPortfolioEntry({
    status: entryType,
    title: activity.type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    description: activity.text,
    metadata: activity.metadata,
  });
}

export function getQuestRooms(): CapitolRoom[] {
  return [
    {
      id: "quest-anthropic-1",
      name: "Build with Claude",
      goal: "Build something useful with Claude AI assistance over 14 days.",
      description: "Anthropic Ãƒâ€” Capitol Quest. Build a project using Claude AI assistance.",
      niche: "Tech",
      creator: "Anthropic",
      creatorAvatar: "AN",
      members: [],
      minMembers: 3,
      maxMembers: 8,
      ageRange: { min: 13, max: 99 },
      durationDays: 14,
      startDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      type: "Elite",
      status: "Starting soon",
      activityRate: 0,
      proofRate: 0,
      rules: {
        dailyProof: true,
        proofDeadline: "23:59",
        allowInvites: true,
        approvalRequired: true,
        autoReplace: true,
        visibility: "Discoverable",
      },
    },
  ];
}
