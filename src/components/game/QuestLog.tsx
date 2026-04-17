import { Camera, Check, Circle, ChevronRight, Scroll } from "lucide-react";

const goals = [
  { text: "Morning meditation", done: true, photo: false, reward: 20 },
  { text: "Drink 2L of water", done: false, photo: true, reward: 15 },
  { text: "Read 15 pages", done: false, photo: false, reward: 25 },
  { text: "Sleep before 11pm", done: false, photo: false, reward: 30 },
];

export const QuestLog = () => (
  <div className="absolute left-4 top-[148px] bottom-[120px] z-30 w-[260px] flex flex-col gap-2 pointer-events-auto">
    <div className="quest-scroll p-3 flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Scroll className="h-4 w-4 text-accent" strokeWidth={2.5} />
          <p className="display-font text-sm font-bold text-foreground">Today's Quests</p>
        </div>
        <span className="text-[10px] font-black text-accent-foreground bg-accent/30 px-2 py-0.5 rounded-full">1/4</span>
      </div>

      <div className="space-y-1.5 flex-1 overflow-y-auto scrollbar-hide">
        {goals.map((g) => (
          <div
            key={g.text}
            className={`flex items-center gap-2 p-2 rounded-xl transition cursor-pointer ${
              g.done ? "bg-primary-soft/60" : "bg-white/60 hover:bg-white/90"
            }`}
          >
            {g.done ? (
              <div className="h-6 w-6 rounded-full bg-progress-gradient flex items-center justify-center shadow-soft flex-shrink-0 border-2 border-white">
                <Check className="h-3 w-3 text-white" strokeWidth={3.5} />
              </div>
            ) : (
              <div className="h-6 w-6 rounded-full border-2 border-dashed border-muted-foreground/50 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-[11px] font-bold ${g.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {g.text}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[9px] font-black text-honey-foreground bg-honey/30 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  +{g.reward}🪙
                </span>
                {g.photo && (
                  <span className="text-[9px] font-bold text-accent-foreground bg-accent/30 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Camera className="h-2.5 w-2.5" strokeWidth={2.8} /> proof
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress to next island upgrade */}
      <div className="mt-2 pt-2 border-t border-foreground/10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Group week</span>
          <span className="text-[10px] font-black text-foreground">65%</span>
        </div>
        <div className="xp-bar">
          <div className="xp-bar-fill" style={{ width: '65%' }} />
        </div>
      </div>
    </div>

    {/* Event ticker / lore card */}
    <div className="hud-panel-dark p-3 flex items-center gap-2">
      <div className="h-9 w-9 rounded-xl bg-accent/30 flex items-center justify-center text-lg flex-shrink-0">🌧️</div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-wider opacity-70">Event · 2h left</p>
        <p className="text-[11px] font-extrabold leading-tight">Rain blessing — water habits 2× rewards</p>
      </div>
      <ChevronRight className="h-4 w-4 opacity-60" />
    </div>
  </div>
);
