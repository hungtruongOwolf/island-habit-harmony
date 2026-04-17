import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import a1 from "@/assets/agent-1.png";
import a2 from "@/assets/agent-2.png";
import a3 from "@/assets/agent-3.png";
import a4 from "@/assets/agent-4.png";
import a5 from "@/assets/agent-5.png";

export type AgentId = "kael" | "theo" | "mei" | "jordan" | "sofia";
export type ScreenId = "island" | "build" | "chat" | "recap" | "history" | "checkin" | null;

export interface Agent {
  id: AgentId;
  name: string;
  img: string;
  color: string;       // hsl primary color of avatar (capsule body)
  hat: string;         // accent hat color
  mood: number;        // 0-100
  line: string;
  goal: string;
  online: boolean;
  isYou?: boolean;
  // 3D position [x,z]
  home: [number, number];
}

export interface Building {
  id: string;
  type: "house" | "garden" | "library" | "gym" | "lighthouse" | "fountain" | "bonfire";
  pos: [number, number];
  rot?: number;
  color?: string;
}

export interface BuildOption {
  type: Building["type"];
  name: string;
  cost: number;
  size: string;
  emoji: string;
  locked?: string | null;
}

export const BUILD_LIBRARY: BuildOption[] = [
  { type: "house",      name: "Cottage",     cost: 120, size: "2x2", emoji: "🏠" },
  { type: "garden",     name: "Garden",      cost: 80,  size: "1x1", emoji: "🌷" },
  { type: "library",    name: "Library",     cost: 240, size: "2x3", emoji: "📚" },
  { type: "gym",        name: "Gym hut",     cost: 200, size: "2x2", emoji: "🏋️" },
  { type: "fountain",   name: "Fountain",    cost: 160, size: "2x2", emoji: "⛲" },
  { type: "bonfire",    name: "Bonfire",     cost: 60,  size: "1x1", emoji: "🔥" },
  { type: "lighthouse", name: "Lighthouse",  cost: 800, size: "2x2", emoji: "🗼", locked: "Reach Lv.15" },
];

export interface Goal {
  id: string;
  text: string;
  done: boolean;
  reward: number;
  photo?: boolean;
}

export interface ChatMsg {
  from: "agent" | "you";
  text: string;
  ts: number;
}

interface GameState {
  screen: ScreenId;
  setScreen: (s: ScreenId) => void;

  selectedAgent: AgentId;
  setSelectedAgent: (id: AgentId) => void;

  coins: number;
  streak: number;
  level: number;
  xp: number; // 0-100 toward next

  agents: Agent[];
  buildings: Building[];
  goals: Goal[];

  // build flow
  pendingSlot: [number, number] | null;
  setPendingSlot: (s: [number, number] | null) => void;
  placeBuilding: (type: Building["type"]) => boolean;

  completeGoal: (id: string) => void;
  pendingCheckIn: Goal | null;
  setPendingCheckIn: (g: Goal | null) => void;

  chats: Record<AgentId, ChatMsg[]>;
  sendChat: (id: AgentId, text: string) => void;

  toast: string | null;
  showToast: (msg: string) => void;
}

const Ctx = createContext<GameState | null>(null);

const initialAgents: Agent[] = [
  { id: "sofia",  name: "Sofia",  img: a5, color: "#7AC5A0", hat: "#E58F7B", mood: 76, line: "Hydrating!",            goal: "2L water",  online: true,  isYou: true,  home: [ 0.5, -1.2] },
  { id: "kael",   name: "Kael",   img: a1, color: "#6FA8DC", hat: "#F2C46C", mood: 84, line: "Let's lift today!",    goal: "Gym 45m",   online: true,                home: [-2.5, -0.5] },
  { id: "theo",   name: "Theo",   img: a2, color: "#C9A0E0", hat: "#7AC5A0", mood: 62, line: "Reading slowly...",    goal: "Read 15p",  online: true,                home: [ 2.0,  1.5] },
  { id: "mei",    name: "Mei",    img: a3, color: "#E58F7B", hat: "#6FA8DC", mood: 41, line: "Need a walk.",         goal: "Walk 20m",  online: false,               home: [-1.0,  2.0] },
  { id: "jordan", name: "Jordan", img: a4, color: "#F2C46C", hat: "#C9A0E0", mood: 91, line: "On a roll!",           goal: "Sleep 8h",  online: true,                home: [ 1.5, -2.0] },
];

const initialBuildings: Building[] = [
  { id: "b1", type: "house",    pos: [-2.5, -0.5] },
  { id: "b2", type: "house",    pos: [ 2.0,  1.5], rot: 0.4 },
  { id: "b3", type: "garden",   pos: [-0.8, -2.2] },
  { id: "b4", type: "fountain", pos: [ 0.0,  0.0] },
  { id: "b5", type: "bonfire",  pos: [ 2.2, -1.6] },
];

const initialGoals: Goal[] = [
  { id: "g1", text: "Morning meditation",  done: true,  reward: 20 },
  { id: "g2", text: "Drink 2L of water",   done: false, reward: 15, photo: true },
  { id: "g3", text: "Read 15 pages",       done: false, reward: 25 },
  { id: "g4", text: "Sleep before 11pm",   done: false, reward: 30 },
];

const seedChats = (): Record<AgentId, ChatMsg[]> => ({
  sofia:  [{ from: "agent", text: "Hey, that's me! You good?", ts: Date.now() }],
  kael:   [{ from: "agent", text: "Yo! Ready for gym? 💪", ts: Date.now() }],
  theo:   [{ from: "agent", text: "Want me to read aloud later?", ts: Date.now() }],
  mei:    [{ from: "agent", text: "Could really use some company.", ts: Date.now() }],
  jordan: [{ from: "agent", text: "12-day streak baby! 🔥", ts: Date.now() }],
});

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [screen, setScreen] = useState<ScreenId>(null);
  const [selectedAgent, setSelectedAgent] = useState<AgentId>("sofia");
  const [coins, setCoins] = useState(2486);
  const [streak] = useState(12);
  const [level] = useState(14);
  const [xp, setXp] = useState(72);
  const [agents] = useState<Agent[]>(initialAgents);
  const [buildings, setBuildings] = useState<Building[]>(initialBuildings);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [pendingSlot, setPendingSlot] = useState<[number, number] | null>(null);
  const [pendingCheckIn, setPendingCheckIn] = useState<Goal | null>(null);
  const [chats, setChats] = useState<Record<AgentId, ChatMsg[]>>(seedChats);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }, []);

  const placeBuilding = useCallback((type: Building["type"]): boolean => {
    if (!pendingSlot) return false;
    const opt = BUILD_LIBRARY.find((b) => b.type === type)!;
    if (opt.locked) { showToast(opt.locked); return false; }
    if (coins < opt.cost) { showToast("Not enough coins"); return false; }
    setCoins((c) => c - opt.cost);
    setBuildings((bs) => [...bs, { id: `b${Date.now()}`, type, pos: pendingSlot }]);
    setPendingSlot(null);
    showToast(`+1 ${opt.name} built!`);
    return true;
  }, [pendingSlot, coins, showToast]);

  const completeGoal = useCallback((id: string) => {
    setGoals((gs) => gs.map((g) => g.id === id ? { ...g, done: true } : g));
    const g = goals.find((x) => x.id === id);
    if (g && !g.done) {
      setCoins((c) => c + g.reward);
      setXp((x) => Math.min(100, x + 5));
      showToast(`+${g.reward} coins · ${g.text} ✓`);
    }
    setPendingCheckIn(null);
  }, [goals, showToast]);

  const sendChat = useCallback((id: AgentId, text: string) => {
    const userMsg: ChatMsg = { from: "you", text, ts: Date.now() };
    setChats((c) => ({ ...c, [id]: [...c[id], userMsg] }));
    // fake agent reply
    setTimeout(() => {
      const replies = [
        "Love it 💚",
        "Got it — let's do it together!",
        "I'll cheer you on from the island 🏝️",
        "That sounds wonderful.",
        "Mmm okay, I needed that.",
      ];
      const reply: ChatMsg = { from: "agent", text: replies[Math.floor(Math.random() * replies.length)], ts: Date.now() };
      setChats((c) => ({ ...c, [id]: [...c[id], reply] }));
    }, 900);
  }, []);

  return (
    <Ctx.Provider value={{
      screen, setScreen,
      selectedAgent, setSelectedAgent,
      coins, streak, level, xp,
      agents, buildings, goals,
      pendingSlot, setPendingSlot, placeBuilding,
      completeGoal, pendingCheckIn, setPendingCheckIn,
      chats, sendChat,
      toast, showToast,
    }}>
      {children}
    </Ctx.Provider>
  );
};

export const useGame = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useGame must be inside GameProvider");
  return v;
};
