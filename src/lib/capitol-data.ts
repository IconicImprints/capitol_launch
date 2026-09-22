export const CURRENT_USER_ID = "u-me";

export type RoomLifecycle = "active" | "full" | "new" | "completed" | "expired";
export type AccomplishmentStatus = "win" | "close" | "tried";
export type BetStatus = "active" | "pending" | "completed";
export type MissionStatus = "active" | "upcoming" | "completed";
export type FriendRelation = "friend" | "request" | "suggested" | "none";

export type CapitolUser = {
  id: string;
  name: string;
  handle: string;
  bio: string;
  initials: string;
  tone: string;
  level: number;
  xp: number;
  streak: number;
  roomsCompleted: number;
  missionsCompleted: number;
  joined: string;
  location: string;
};

export type RoomMember = {
  userId: string;
  role: "host" | "member";
  proofs: number;
  contribution: number;
};

export type CapitolRoom = {
  id: string;
  name: string;
  description: string;
  niche: string;
  ageRange: string;
  memberIds: string[];
  members: RoomMember[];
  maxMembers: number;
  durationDays: number;
  daysRemaining: number;
  streak: number;
  progress: number;
  lifecycle: RoomLifecycle;
  elite: boolean;
  joined: boolean;
  rules: string[];
  recommended?: boolean;
  trending?: boolean;
};

export type ProofItem = {
  id: string;
  userId: string;
  roomId: string;
  caption: string;
  imageSeed: string;
  at: string;
  xp: number;
};

export type FeedItem = {
  id: string;
  kind: "proof" | "streak" | "mission" | "room" | "friend";
  userId: string;
  roomId?: string;
  text: string;
  at: string;
  xp?: number;
  imageSeed?: string;
  reactions: { clap: number; fire: number };
  comments: { userId: string; text: string }[];
};

export type MissionTask = {
  id: string;
  title: string;
  done: boolean;
  ownerId?: string;
};

export type CapitolMission = {
  id: string;
  title: string;
  roomId: string;
  description: string;
  memberIds: string[];
  progress: number;
  deadline: string;
  status: MissionStatus;
  contributions: { userId: string; percent: number; note: string }[];
  tasks: MissionTask[];
  history: { at: string; text: string }[];
};

export type LeaderRow = {
  userId: string;
  xp: number;
  movement: number;
};

export type Accomplishment = {
  id: string;
  title: string;
  detail: string;
  date: string;
  status: AccomplishmentStatus;
  kind: "room" | "mission" | "proof";
};

export type CapitolBet = {
  id: string;
  title: string;
  goal: string;
  opponentId: string;
  durationDays: number;
  daysLeft: number;
  stake: string;
  rules: string;
  status: BetStatus;
  youProgress: number;
  themProgress: number;
  result?: "won" | "lost" | "pending";
  proofs: { at: string; text: string }[];
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  requirement: string;
  progress: number;
  total: number;
  unlocked: boolean;
  rare: boolean;
  icon: "camera" | "flame" | "calendar" | "users" | "flag" | "target" | "star" | "crown" | "check" | "repeat";
};

export type CapitolState = {
  me: CapitolUser;
  users: CapitolUser[];
  rooms: CapitolRoom[];
  proofs: ProofItem[];
  feed: FeedItem[];
  missions: CapitolMission[];
  weekly: LeaderRow[];
  monthly: LeaderRow[];
  allTime: LeaderRow[];
  accomplishments: Accomplishment[];
  friends: string[];
  requests: string[];
  suggested: string[];
  bets: CapitolBet[];
  achievements: Achievement[];
  todayProofDone: boolean;
  todayProofImage: string | null;
  heatmap: number[];
  settings: {
    displayName: string;
    handle: string;
    bio: string;
    email: string;
    proofReminders: boolean;
    roomDigest: boolean;
    friendAlerts: boolean;
    publicPortfolio: boolean;
    showStreak: boolean;
    appearance: "light";
    twoFactor: boolean;
    google: boolean;
    github: boolean;
  };
  loading: boolean;
};

export const USERS: CapitolUser[] = [
  {
    id: CURRENT_USER_ID,
    name: "QuietGrindr",
    handle: "quietgrindr",
    bio: "Shipping in public. Deep work over noise.",
    initials: "QG",
    tone: "#111111",
    level: 8,
    xp: 3840,
    streak: 14,
    roomsCompleted: 3,
    missionsCompleted: 5,
    joined: "March 2026",
    location: "Austin",
  },
  {
    id: "u-nia",
    name: "Nia Okonkwo",
    handle: "niaok",
    bio: "Product designer. Builds in 90-minute blocks.",
    initials: "NO",
    tone: "#2a2a2a",
    level: 11,
    xp: 6120,
    streak: 27,
    roomsCompleted: 6,
    missionsCompleted: 8,
    joined: "January 2026",
    location: "Lagos",
  },
  {
    id: "u-reza",
    name: "Reza Farhadi",
    handle: "reza",
    bio: "Backend, systems, and stubborn debugging.",
    initials: "RF",
    tone: "#3d3d3d",
    level: 9,
    xp: 4410,
    streak: 9,
    roomsCompleted: 2,
    missionsCompleted: 4,
    joined: "February 2026",
    location: "Toronto",
  },
  {
    id: "u-mara",
    name: "Mara Ellison",
    handle: "marae",
    bio: "Writer. One page a day, no exceptions.",
    initials: "ME",
    tone: "#1c1c1c",
    level: 7,
    xp: 2980,
    streak: 41,
    roomsCompleted: 4,
    missionsCompleted: 3,
    joined: "November 2025",
    location: "Portland",
  },
  {
    id: "u-jonah",
    name: "Jonah Pike",
    handle: "jpike",
    bio: "Training for a half. Logging miles and sleep.",
    initials: "JP",
    tone: "#454545",
    level: 6,
    xp: 2210,
    streak: 6,
    roomsCompleted: 1,
    missionsCompleted: 2,
    joined: "April 2026",
    location: "Denver",
  },
  {
    id: "u-hana",
    name: "Hana Iwasaki",
    handle: "hana",
    bio: "Indie founder. Customer calls before code.",
    initials: "HI",
    tone: "#222222",
    level: 12,
    xp: 7340,
    streak: 18,
    roomsCompleted: 7,
    missionsCompleted: 11,
    joined: "October 2025",
    location: "Tokyo",
  },
  {
    id: "u-cole",
    name: "Cole Brennan",
    handle: "cbrennan",
    bio: "CS student. Leetcode in the morning, side project at night.",
    initials: "CB",
    tone: "#333333",
    level: 5,
    xp: 1680,
    streak: 3,
    roomsCompleted: 0,
    missionsCompleted: 1,
    joined: "June 2026",
    location: "Boston",
  },
  {
    id: "u-priya",
    name: "Priya Raman",
    handle: "priyar",
    bio: "ML notebooks and gym logs. Same notebook.",
    initials: "PR",
    tone: "#2f2f2f",
    level: 10,
    xp: 5190,
    streak: 22,
    roomsCompleted: 5,
    missionsCompleted: 6,
    joined: "December 2025",
    location: "Seattle",
  },
];

export const SEED_ROOMS: CapitolRoom[] = [
  {
    id: "r-deep",
    name: "Deep Work Lab",
    description: "Four hours of protected focus each weekday. Cameras on for the first five minutes.",
    niche: "Productivity",
    ageRange: "22-34",
    memberIds: [CURRENT_USER_ID, "u-nia", "u-reza", "u-priya"],
    members: [
      { userId: CURRENT_USER_ID, role: "member", proofs: 12, contribution: 28 },
      { userId: "u-nia", role: "host", proofs: 14, contribution: 31 },
      { userId: "u-reza", role: "member", proofs: 11, contribution: 22 },
      { userId: "u-priya", role: "member", proofs: 13, contribution: 19 },
    ],
    maxMembers: 6,
    durationDays: 30,
    daysRemaining: 11,
    streak: 8,
    progress: 62,
    lifecycle: "active",
    elite: false,
    joined: true,
    rules: ["Daily photo of your desk at start of block", "No phones on the desk", "Miss two days and you sit out the mission"],
  },
  {
    id: "r-founders",
    name: "Ship Club",
    description: "Indie founders who publish something every week. Demos on Fridays.",
    niche: "Startups",
    ageRange: "20-32",
    memberIds: [CURRENT_USER_ID, "u-hana", "u-cole"],
    members: [
      { userId: CURRENT_USER_ID, role: "member", proofs: 6, contribution: 24 },
      { userId: "u-hana", role: "host", proofs: 8, contribution: 48 },
      { userId: "u-cole", role: "member", proofs: 5, contribution: 28 },
    ],
    maxMembers: 8,
    durationDays: 60,
    daysRemaining: 37,
    streak: 5,
    progress: 38,
    lifecycle: "active",
    elite: false,
    joined: true,
    rules: ["Weekly public changelog", "One customer conversation logged", "Friday 15-minute demo"],
    trending: true,
  },
  {
    id: "r-run",
    name: "Northside Miles",
    description: "Run or walk. Log the route. Quiet encouragement, no leaderboard trash talk.",
    niche: "Fitness",
    ageRange: "18-40",
    memberIds: ["u-jonah", "u-mara", "u-priya"],
    members: [
      { userId: "u-jonah", role: "host", proofs: 9, contribution: 40 },
      { userId: "u-mara", role: "member", proofs: 8, contribution: 35 },
      { userId: "u-priya", role: "member", proofs: 7, contribution: 25 },
    ],
    maxMembers: 10,
    durationDays: 21,
    daysRemaining: 14,
    streak: 4,
    progress: 33,
    lifecycle: "active",
    elite: false,
    joined: false,
    rules: ["Photo of shoes or watch after the session", "Rest days count if logged"],
    recommended: true,
  },
  {
    id: "r-pages",
    name: "Night Writers",
    description: "300 words after 9pm. Share a paragraph, not the whole draft.",
    niche: "Writing",
    ageRange: "21-45",
    memberIds: ["u-mara"],
    members: [{ userId: "u-mara", role: "host", proofs: 2, contribution: 100 }],
    maxMembers: 5,
    durationDays: 14,
    daysRemaining: 13,
    streak: 2,
    progress: 8,
    lifecycle: "new",
    elite: false,
    joined: false,
    rules: ["Word count in the caption", "No critique unless asked"],
    recommended: true,
  },
  {
    id: "r-elite",
    name: "90-Day Builders",
    description: "Invite-only. One product from zero to paying users. Weekly review with the host.",
    niche: "Startups",
    ageRange: "24-36",
    memberIds: ["u-hana", "u-nia", "u-reza", "u-priya", "u-mara", "u-jonah"],
    members: [
      { userId: "u-hana", role: "host", proofs: 40, contribution: 22 },
      { userId: "u-nia", role: "member", proofs: 38, contribution: 18 },
      { userId: "u-reza", role: "member", proofs: 36, contribution: 16 },
      { userId: "u-priya", role: "member", proofs: 35, contribution: 16 },
      { userId: "u-mara", role: "member", proofs: 33, contribution: 14 },
      { userId: "u-jonah", role: "member", proofs: 31, contribution: 14 },
    ],
    maxMembers: 6,
    durationDays: 90,
    daysRemaining: 44,
    streak: 19,
    progress: 51,
    lifecycle: "full",
    elite: true,
    joined: false,
    rules: ["Weekly revenue or pipeline screenshot", "Miss a week and you are replaced"],
  },
  {
    id: "r-algo",
    name: "Morning Algorithms",
    description: "One problem before breakfast. Explain the approach in two sentences.",
    niche: "Coding",
    ageRange: "18-26",
    memberIds: ["u-cole", "u-reza", CURRENT_USER_ID],
    members: [
      { userId: "u-cole", role: "host", proofs: 10, contribution: 36 },
      { userId: "u-reza", role: "member", proofs: 9, contribution: 34 },
      { userId: CURRENT_USER_ID, role: "member", proofs: 8, contribution: 30 },
    ],
    maxMembers: 6,
    durationDays: 21,
    daysRemaining: 6,
    streak: 6,
    progress: 71,
    lifecycle: "active",
    elite: false,
    joined: true,
    rules: ["Screenshot of passing tests", "No copy-paste solutions"],
    trending: true,
  },
  {
    id: "r-done",
    name: "First Ten Customers",
    description: "A finished 30-day push to get ten people actually using the product.",
    niche: "Startups",
    ageRange: "20-30",
    memberIds: [CURRENT_USER_ID, "u-hana", "u-nia"],
    members: [
      { userId: CURRENT_USER_ID, role: "member", proofs: 28, contribution: 34 },
      { userId: "u-hana", role: "host", proofs: 30, contribution: 38 },
      { userId: "u-nia", role: "member", proofs: 27, contribution: 28 },
    ],
    maxMembers: 5,
    durationDays: 30,
    daysRemaining: 0,
    streak: 0,
    progress: 100,
    lifecycle: "completed",
    elite: false,
    joined: true,
    rules: ["Named customers only", "No vanity metrics"],
  },
  {
    id: "r-exp",
    name: "Summer Sprint",
    description: "Six weeks of evening builds. Closed when the cohort ended.",
    niche: "Tech",
    ageRange: "18-28",
    memberIds: ["u-cole", "u-jonah"],
    members: [
      { userId: "u-cole", role: "host", proofs: 18, contribution: 55 },
      { userId: "u-jonah", role: "member", proofs: 12, contribution: 45 },
    ],
    maxMembers: 8,
    durationDays: 42,
    daysRemaining: 0,
    streak: 0,
    progress: 64,
    lifecycle: "expired",
    elite: false,
    joined: false,
    rules: ["Weeknight check-in by 11pm"],
  },
];

export const SEED_PROOFS: ProofItem[] = [
  {
    id: "p1",
    userId: CURRENT_USER_ID,
    roomId: "r-deep",
    caption: "Second block done. Phone in the other room.",
    imageSeed: "desk-focus-1",
    at: "Today, 9:14am",
    xp: 40,
  },
  {
    id: "p2",
    userId: "u-nia",
    roomId: "r-deep",
    caption: "Figma file cleaned. Three screens shipped.",
    imageSeed: "design-desk-2",
    at: "Today, 8:41am",
    xp: 40,
  },
  {
    id: "p3",
    userId: "u-hana",
    roomId: "r-founders",
    caption: "Changelog published. Two replies from users.",
    imageSeed: "laptop-notes-3",
    at: "Yesterday, 6:02pm",
    xp: 50,
  },
];

export const SEED_FEED: FeedItem[] = [
  {
    id: "f1",
    kind: "proof",
    userId: "u-nia",
    roomId: "r-deep",
    text: "Submitted proof in Deep Work Lab.",
    at: "18m ago",
    xp: 40,
    imageSeed: "notebook-work-11",
    reactions: { clap: 4, fire: 1 },
    comments: [{ userId: CURRENT_USER_ID, text: "Clean block." }],
  },
  {
    id: "f2",
    kind: "proof",
    userId: CURRENT_USER_ID,
    roomId: "r-algo",
    text: "Logged a binary-search writeup before breakfast.",
    at: "2h ago",
    xp: 35,
    imageSeed: "code-paper-12",
    reactions: { clap: 2, fire: 2 },
    comments: [],
  },
  {
    id: "f3",
    kind: "streak",
    userId: "u-mara",
    roomId: "r-pages",
    text: "Hit a 40-day writing streak.",
    at: "5h ago",
    reactions: { clap: 7, fire: 3 },
    comments: [{ userId: "u-jonah", text: "Still going." }],
  },
  {
    id: "f4",
    kind: "mission",
    userId: "u-hana",
    roomId: "r-founders",
    text: "Ship Club finished the Friday demo mission.",
    at: "Yesterday",
    reactions: { clap: 5, fire: 0 },
    comments: [],
  },
  {
    id: "f5",
    kind: "friend",
    userId: "u-reza",
    text: "Reza completed 9 days in a row.",
    at: "Yesterday",
    reactions: { clap: 1, fire: 1 },
    comments: [],
  },
  {
    id: "f6",
    kind: "room",
    userId: "u-cole",
    roomId: "r-algo",
    text: "Cole joined Morning Algorithms.",
    at: "2 days ago",
    reactions: { clap: 2, fire: 0 },
    comments: [],
  },
];

export const SEED_MISSIONS: CapitolMission[] = [
  {
    id: "m-land",
    title: "Ship the waitlist page",
    roomId: "r-founders",
    description: "Each member publishes a single-page waitlist with a working email capture.",
    memberIds: [CURRENT_USER_ID, "u-hana", "u-cole"],
    progress: 67,
    deadline: "Sep 18",
    status: "active",
    contributions: [
      { userId: "u-hana", percent: 40, note: "Copy and analytics" },
      { userId: CURRENT_USER_ID, percent: 35, note: "Layout and form" },
      { userId: "u-cole", percent: 25, note: "Hosting" },
    ],
    tasks: [
      { id: "t1", title: "Headline and proof point", done: true, ownerId: "u-hana" },
      { id: "t2", title: "Email capture live", done: true, ownerId: CURRENT_USER_ID },
      { id: "t3", title: "Share in the room thread", done: false, ownerId: "u-cole" },
    ],
    history: [
      { at: "Sep 12", text: "Hana posted the first draft." },
      { at: "Sep 13", text: "You wired the form." },
    ],
  },
  {
    id: "m-calls",
    title: "Eight customer calls",
    roomId: "r-founders",
    description: "Talk to eight people who have the problem. Notes in the shared doc.",
    memberIds: [CURRENT_USER_ID, "u-hana"],
    progress: 100,
    deadline: "Sep 8",
    status: "completed",
    contributions: [
      { userId: "u-hana", percent: 55, note: "Five calls" },
      { userId: CURRENT_USER_ID, percent: 45, note: "Three calls" },
    ],
    tasks: [
      { id: "t4", title: "Call list", done: true },
      { id: "t5", title: "Notes filed", done: true },
    ],
    history: [{ at: "Sep 8", text: "Mission marked complete. No XP awarded." }],
  },
  {
    id: "m-focus",
    title: "Perfect attendance week",
    roomId: "r-deep",
    description: "Every member submits proof all five weekdays.",
    memberIds: [CURRENT_USER_ID, "u-nia", "u-reza", "u-priya"],
    progress: 0,
    deadline: "Sep 21",
    status: "upcoming",
    contributions: [
      { userId: "u-nia", percent: 0, note: "Starts Monday" },
      { userId: CURRENT_USER_ID, percent: 0, note: "Starts Monday" },
      { userId: "u-reza", percent: 0, note: "Starts Monday" },
      { userId: "u-priya", percent: 0, note: "Starts Monday" },
    ],
    tasks: [
      { id: "t6", title: "Monday proof", done: false },
      { id: "t7", title: "Friday recap", done: false },
    ],
    history: [{ at: "Sep 14", text: "Scheduled by Nia." }],
  },
];

export const SEED_WEEKLY: LeaderRow[] = [
  { userId: "u-hana", xp: 420, movement: 1 },
  { userId: "u-nia", xp: 390, movement: 0 },
  { userId: CURRENT_USER_ID, xp: 310, movement: 2 },
  { userId: "u-priya", xp: 280, movement: -1 },
  { userId: "u-reza", xp: 240, movement: 1 },
  { userId: "u-mara", xp: 210, movement: 0 },
  { userId: "u-jonah", xp: 160, movement: -2 },
  { userId: "u-cole", xp: 120, movement: 0 },
];

export const SEED_MONTHLY: LeaderRow[] = [
  { userId: "u-nia", xp: 1480, movement: 1 },
  { userId: "u-hana", xp: 1410, movement: -1 },
  { userId: "u-priya", xp: 1120, movement: 0 },
  { userId: CURRENT_USER_ID, xp: 980, movement: 1 },
  { userId: "u-mara", xp: 870, movement: 0 },
  { userId: "u-reza", xp: 760, movement: -1 },
  { userId: "u-jonah", xp: 540, movement: 0 },
  { userId: "u-cole", xp: 410, movement: 0 },
];

export const SEED_ALL: LeaderRow[] = [
  { userId: "u-hana", xp: 7340, movement: 0 },
  { userId: "u-nia", xp: 6120, movement: 0 },
  { userId: "u-priya", xp: 5190, movement: 1 },
  { userId: "u-reza", xp: 4410, movement: -1 },
  { userId: CURRENT_USER_ID, xp: 3840, movement: 1 },
  { userId: "u-mara", xp: 2980, movement: 0 },
  { userId: "u-jonah", xp: 2210, movement: 0 },
  { userId: "u-cole", xp: 1680, movement: 0 },
];

export const SEED_ACCOMPLISHMENTS: Accomplishment[] = [
  {
    id: "a1",
    title: "First Ten Customers",
    detail: "Finished the 30-day room. Ten named users on the product.",
    date: "Aug 2026",
    status: "win",
    kind: "room",
  },
  {
    id: "a2",
    title: "Eight customer calls",
    detail: "Ship Club mission. Notes filed. No XP, just the work.",
    date: "Sep 2026",
    status: "win",
    kind: "mission",
  },
  {
    id: "a3",
    title: "Public changelog week",
    detail: "Shipped four days. Missed Friday demo by two hours.",
    date: "Jul 2026",
    status: "close",
    kind: "mission",
  },
  {
    id: "a4",
    title: "Design critique room",
    detail: "Joined late. Logged three proofs, then dropped.",
    date: "Jun 2026",
    status: "tried",
    kind: "room",
  },
];

export const SEED_BETS: CapitolBet[] = [
  {
    id: "b1",
    title: "14-day coding streak",
    goal: "Submit proof every day in Morning Algorithms.",
    opponentId: "u-reza",
    durationDays: 14,
    daysLeft: 8,
    stake: "Loser buys coffee next meetup",
    rules: "Missed day is a forfeit unless both agree on a rest day in advance.",
    status: "active",
    youProgress: 6,
    themProgress: 5,
    proofs: [
      { at: "Today", text: "You logged the binary-search writeup." },
      { at: "Yesterday", text: "Reza posted a heap-sort trace." },
    ],
  },
  {
    id: "b2",
    title: "Waitlist live by Friday",
    goal: "Public URL with working email capture.",
    opponentId: "u-hana",
    durationDays: 5,
    daysLeft: 3,
    stake: "Public shoutout in Ship Club",
    rules: "Must be reachable from a phone. Placeholder copy allowed.",
    status: "pending",
    youProgress: 0,
    themProgress: 0,
    result: "pending",
    proofs: [],
  },
  {
    id: "b3",
    title: "Gym three times last week",
    goal: "Three logged sessions with a photo of the floor or watch.",
    opponentId: "u-jonah",
    durationDays: 7,
    daysLeft: 0,
    stake: "One playlist swap",
    rules: "Home workouts count.",
    status: "completed",
    youProgress: 2,
    themProgress: 3,
    result: "lost",
    proofs: [{ at: "Sep 7", text: "Jonah hit three. You hit two." }],
  },
];

export const SEED_ACHIEVEMENTS: Achievement[] = [
  { id: "ach-1", name: "First Proof", description: "Submit a proof of work.", requirement: "1 proof", progress: 1, total: 1, unlocked: true, rare: false, icon: "camera" },
  { id: "ach-2", name: "7 Day Streak", description: "Show up seven days in a row.", requirement: "7-day streak", progress: 7, total: 7, unlocked: true, rare: false, icon: "flame" },
  { id: "ach-3", name: "30 Day Streak", description: "A full month without a miss.", requirement: "30-day streak", progress: 14, total: 30, unlocked: false, rare: true, icon: "calendar" },
  { id: "ach-4", name: "First Room", description: "Join an accountability room.", requirement: "1 room joined", progress: 1, total: 1, unlocked: true, rare: false, icon: "users" },
  { id: "ach-5", name: "Room Finisher", description: "Complete a room from start to end.", requirement: "1 room completed", progress: 1, total: 1, unlocked: true, rare: true, icon: "flag" },
  { id: "ach-6", name: "Mission Complete", description: "Finish a team mission.", requirement: "1 mission", progress: 1, total: 1, unlocked: true, rare: false, icon: "target" },
  { id: "ach-7", name: "Top 10", description: "Land in the global top 10.", requirement: "Rank 10 or better", progress: 5, total: 10, unlocked: true, rare: false, icon: "star" },
  { id: "ach-8", name: "Top 3", description: "Stand on the all-time podium.", requirement: "Rank 3 or better", progress: 5, total: 3, unlocked: false, rare: true, icon: "crown" },
  { id: "ach-9", name: "Perfect Week", description: "Proof every day for seven days.", requirement: "7 proofs in 7 days", progress: 7, total: 7, unlocked: true, rare: false, icon: "check" },
  { id: "ach-10", name: "Consistency", description: "Log proof on 20 different days.", requirement: "20 proof days", progress: 14, total: 20, unlocked: false, rare: false, icon: "repeat" },
];

function seededHeatmap(): number[] {
  const cells: number[] = [];
  for (let i = 0; i < 371; i++) {
    const n = (i * 17 + 29) % 11;
    if (i > 300 && n > 3) cells.push(Math.min(4, (n % 5) + 1));
    else if (n > 8) cells.push(4);
    else if (n > 6) cells.push(3);
    else if (n > 4) cells.push(2);
    else if (n > 2) cells.push(1);
    else cells.push(0);
  }
  return cells;
}

export function createInitialState(): CapitolState {
  const me = USERS.find((u) => u.id === CURRENT_USER_ID)!;
  return {
    me,
    users: USERS,
    rooms: SEED_ROOMS,
    proofs: SEED_PROOFS,
    feed: SEED_FEED,
    missions: SEED_MISSIONS,
    weekly: SEED_WEEKLY,
    monthly: SEED_MONTHLY,
    allTime: SEED_ALL,
    accomplishments: SEED_ACCOMPLISHMENTS,
    friends: ["u-nia", "u-reza", "u-hana"],
    requests: ["u-cole"],
    suggested: ["u-mara", "u-jonah"],
    bets: SEED_BETS,
    achievements: SEED_ACHIEVEMENTS,
    todayProofDone: false,
    todayProofImage: null,
    heatmap: seededHeatmap(),
    settings: {
      displayName: "QuietGrindr",
      handle: "quietgrindr",
      bio: "Shipping in public. Deep work over noise.",
      email: "quietgrindr@capitol.app",
      proofReminders: true,
      roomDigest: true,
      friendAlerts: false,
      publicPortfolio: true,
      showStreak: true,
      appearance: "light",
      twoFactor: false,
      google: true,
      github: false,
    },
    loading: false,
  };
}

export function userById(users: CapitolUser[], id: string) {
  return users.find((u) => u.id === id);
}

export function roomById(rooms: CapitolRoom[], id: string) {
  return rooms.find((r) => r.id === id);
}

export function xpToNext(level: number, xp: number) {
  const floor = (level - 1) * 500;
  const next = level * 500;
  const span = next - floor;
  const into = Math.max(0, xp - floor);
  return { into, span, pct: Math.min(100, Math.round((into / span) * 100)) };
}

export function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function proofImage(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/640/400`;
}
