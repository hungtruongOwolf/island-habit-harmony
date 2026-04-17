import { X, Hammer, Lock, Coins } from "lucide-react";
import { useGame, BUILD_LIBRARY } from "../state";

export const BuildOverlay = () => {
  const { screen, setScreen, coins, placeBuilding, pendingSlot, setPendingSlot } = useGame();
  if (screen !== "build") return null;

  const close = () => { setScreen(null); setPendingSlot(null); };

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
              <p className="display-font text-base font-bold">
                {pendingSlot ? `Place at slot (${pendingSlot[0].toFixed(1)}, ${pendingSlot[1].toFixed(1)})` : "Library"}
              </p>
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 overflow-y-auto">
          {BUILD_LIBRARY.map((b) => {
            const locked = !!b.locked;
            const tooExpensive = !locked && coins < b.cost;
            return (
              <button
                key={b.type}
                disabled={locked || !pendingSlot}
                onClick={() => placeBuilding(b.type)}
                className={`relative text-left p-3 rounded-2xl border-2 transition ${
                  locked
                    ? "bg-muted/40 border-muted opacity-60"
                    : tooExpensive
                    ? "bg-card border-border opacity-70"
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
                  <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{b.size}</span>
                </div>
                {locked && (
                  <div className="absolute inset-0 rounded-2xl bg-foreground/30 backdrop-blur-[2px] flex flex-col items-center justify-center text-card font-bold text-xs gap-1">
                    <Lock className="h-5 w-5" />
                    <span className="bg-foreground/80 px-2 py-0.5 rounded">{b.locked}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {!pendingSlot && (
          <div className="p-3 border-t border-foreground/10 bg-honey-soft/40 text-center text-xs font-bold text-honey-foreground">
            💡 Click a glowing 🔨 slot on the island to place a building
          </div>
        )}
      </div>
    </div>
  );
};
