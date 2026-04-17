import { Home, Hammer, BarChart3, Clock, MessageCircle, Camera, Plus } from "lucide-react";

const navItems = [
  { id: "Island", icon: Home, active: true },
  { id: "Build", icon: Hammer },
  { id: "Recap", icon: BarChart3, badge: "NEW" },
  { id: "History", icon: Clock },
  { id: "Chat", icon: MessageCircle, badge: "2" },
];

export const ActionDock = () => (
  <div className="absolute bottom-0 left-0 right-0 z-30 flex items-end justify-center gap-3 p-4 pointer-events-none">
    {/* Left chat ticker */}
    <div className="hud-panel-dark px-3 py-2 flex items-center gap-2 max-w-[220px] mr-auto pointer-events-auto">
      <span className="h-2 w-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
      <p className="text-[11px] font-semibold opacity-90 truncate">
        <span className="font-black opacity-100">Jordan</span> finished sleep goal · just now
      </p>
    </div>

    {/* Center nav dock */}
    <div className="hud-panel flex items-end gap-1 px-2 py-2 pointer-events-auto">
      {navItems.map((it, i) => {
        const Icon = it.icon;
        if (i === 2) {
          return (
            <div key="check-in" className="-mt-8 mx-1 pointer-events-auto">
              <button className="relative h-16 w-16 rounded-full btn-game-coral flex flex-col items-center justify-center shadow-float">
                <span className="absolute inset-0 rounded-full bg-accent/40 animate-ping-soft" />
                <Camera className="h-5 w-5 relative" strokeWidth={2.8} />
                <span className="text-[8px] font-black mt-0.5 relative">CHECK-IN</span>
              </button>
            </div>
          );
        }
        return (
          <button
            key={it.id}
            className={`relative flex flex-col items-center gap-0.5 px-3.5 py-2 rounded-xl transition ${
              it.active ? "bg-progress-gradient text-white shadow-soft" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={2.5} />
            <span className="text-[9px] font-black uppercase tracking-wider">{it.id}</span>
            {it.badge && (
              <span className="absolute -top-1 -right-1 px-1 min-w-[16px] h-4 rounded-full bg-accent text-white text-[8px] font-black flex items-center justify-center border border-white">
                {it.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>

    {/* Right: XP + level pill */}
    <div className="hud-panel-dark px-3 py-2 ml-auto pointer-events-auto min-w-[200px]">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">Island XP</span>
        <span className="text-[10px] font-black">Lv 14 → 15</span>
      </div>
      <div className="xp-bar">
        <div className="xp-bar-fill" style={{ width: '72%' }} />
      </div>
      <p className="text-[9px] opacity-70 mt-1 font-semibold">820 / 1,150 XP — next: lighthouse slot</p>
    </div>
  </div>
);
