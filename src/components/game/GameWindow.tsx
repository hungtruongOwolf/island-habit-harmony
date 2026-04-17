import { Circle } from "lucide-react";
import { TopBar } from "./TopBar";
import { IslandStage } from "./IslandStage";
import { AgentDock } from "./AgentDock";
import { QuestLog } from "./QuestLog";
import { ActionDock } from "./ActionDock";

export const GameWindow = () => (
  <div className="game-window w-full aspect-video relative">
    {/* Browser-style chrome */}
    <div className="absolute top-0 left-0 right-0 h-9 z-40 bg-gradient-to-b from-[hsl(215_30%_18%)] to-[hsl(215_32%_14%)] border-b border-white/5 flex items-center px-4 gap-2">
      <div className="flex gap-1.5">
        <Circle className="h-3 w-3 fill-accent text-accent" />
        <Circle className="h-3 w-3 fill-honey text-honey" />
        <Circle className="h-3 w-3 fill-primary text-primary" />
      </div>
      <div className="flex-1 flex justify-center">
        <div className="px-4 py-1 rounded-md bg-black/30 text-white/70 text-[11px] font-bold flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          islandofhabits.app · Pine Hollow
        </div>
      </div>
      <div className="text-white/50 text-[10px] font-bold">v1.0</div>
    </div>

    {/* Stage */}
    <div className="absolute inset-0 top-9">
      <IslandStage />
      <TopBar />
      <QuestLog />
      <AgentDock />
      <ActionDock />
    </div>
  </div>
);
