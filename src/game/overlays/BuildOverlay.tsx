import { X, Hammer, Lock, Coins, Heart, AlertCircle } from "lucide-react";
import { useGame, BUILD_LIBRARY } from "../state";

export const BuildOverlay = () => {
  const { screen, setScreen, coins, setPlacingType, placingType, districts } = useGame();
  if (screen !== "build") return null;

  const close = () => { setScreen(null); };
  const startPlacing = (type: typeof BUILD_LIBRARY[number]["type"]) => {
    const opt = BUILD_LIBRARY.find((b) => b.type === type)!;
    if (opt.locked) return;
    if (coins < opt.cost) return;
    // Check district unlocked
    if (opt.district !== "main") {
      const d = districts.find((x) => x.id === opt.district);
      if (!d || !d.unlocked) return;
    }
    setPlacingType(type);
    setScreen(null);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="hud-panel max-w-3xl w-full max-h-[85%] flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b border-foreground/10">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-progress-gradient flex items-center justify-center">
              <Hammer className="h-4 w-4 text-white" strokeWidth={2.8} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Build menu</p>
              <p className="display-font text-base font-bold">Pick a building, then place it</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="resource-pill">
              <Coins className="h-4 w-4 text-honey" /> <span className="text-sm">{coins}</span>
            </div>
            <button onClick={close} className="h-9 w-9 rounded-xl bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition">
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Islanders-style hint */}
        <div className="px-4 py-2 bg-secondary-soft/40 border-b border-foreground/5 flex items-center gap-2 text-[11px] font-bold text-foreground/80">
          <Heart className="h-3.5 w-3.5 text-accent fill-accent" />
          Each building loves & hates certain neighbors. Place wisely to earn <b>harmony points</b>.
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 overflow-y-auto">
          {BUILD_LIBRARY.map((b) => {
            const districtLocked = b.district !== "main" && !districts.find((x) => x.id === b.district)?.unlocked;
            const locked = !!b.locked || districtLocked;
            const tooExpensive = !locked && coins < b.cost;
            const lockReason = b.locked || (districtLocked ? `Unlock ${b.district} district` : null);
            const isPlacing = placingType === b.type;

            return (
              <button
                key={b.type}
                disabled={locked || tooExpensive}
                onClick={() => startPlacing(b.type)}
                className={`relative text-left p-3 rounded-2xl border-2 transition ${
                  locked
                    ? "bg-muted/40 border-muted opacity-60"
                    : tooExpensive
                    ? "bg-card border-border opacity-70"
                    : isPlacing
                    ? "bg-primary-soft border-primary shadow-float -translate-y-0.5"
                    : "bg-card border-border hover:border-primary hover:-translate-y-0.5 shadow-soft cursor-pointer"
                }`}
              >
                <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-secondary-soft to-primary-soft flex items-center justify-center text-5xl mb-2">
                  {b.emoji}
                </div>
                <p className="font-extrabold text-sm">{b.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-xs font-black flex items-center gap-1 ${tooExpensive ? "text-destructive" : "text-honey-foreground"}`}>
                    <Coins className="h-3 w-3" /> {b.cost}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    r{b.radius.toFixed(1)}
                  </span>
                </div>
                {/* Like/dislike preview */}
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {b.rules.likes?.slice(0, 2).map((r, i) => (
                    <span key={i} className="text-[9px] font-bold text-primary bg-primary-soft px-1.5 py-0.5 rounded-full">
                      ♥ {r.type} +{r.pts}
                    </span>
                  ))}
                  {b.rules.dislikes?.slice(0, 1).map((r, i) => (
                    <span key={i} className="text-[9px] font-bold text-destructive bg-accent-soft px-1.5 py-0.5 rounded-full">
                      ✗ {r.type} {r.pts}
                    </span>
                  ))}
                </div>
                {locked && (
                  <div className="absolute inset-0 rounded-2xl bg-foreground/30 backdrop-blur-[2px] flex flex-col items-center justify-center text-card font-bold text-xs gap-1">
                    <Lock className="h-5 w-5" />
                    <span className="bg-foreground/80 px-2 py-0.5 rounded text-center">{lockReason}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-3 border-t border-foreground/10 bg-honey-soft/40 text-center text-xs font-bold text-honey-foreground flex items-center justify-center gap-2">
          <AlertCircle className="h-3.5 w-3.5" />
          After picking, hover the island for ghost preview. Green ✓ valid, red ✗ blocked.
        </div>
      </div>
    </div>
  );
};
