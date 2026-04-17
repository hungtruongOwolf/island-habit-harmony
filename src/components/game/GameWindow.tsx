import { Suspense } from "react";
import { Circle } from "lucide-react";
import { TopBar } from "./TopBar";
import { AgentDock } from "./AgentDock";
import { QuestLog } from "./QuestLog";
import { ActionDock } from "./ActionDock";
import { Island3D } from "@/game/three/Island3D";
import { BuildOverlay } from "@/game/overlays/BuildOverlay";
import { ChatOverlay } from "@/game/overlays/ChatOverlay";
import { RecapOverlay } from "@/game/overlays/RecapOverlay";
import { HistoryOverlay } from "@/game/overlays/HistoryOverlay";
import { CheckInOverlay } from "@/game/overlays/CheckInOverlay";
import { ExpandOverlay } from "@/game/overlays/ExpandOverlay";
import { ToastLayer } from "@/game/overlays/ToastLayer";

export const GameWindow = () => (
  <div className="game-window w-full aspect-video relative">
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

    <div className="absolute inset-0 top-9 overflow-hidden">
      {/* 3D world — fills the canvas */}
      <div className="absolute inset-0">
        <Suspense fallback={<div className="h-full w-full bg-world flex items-center justify-center text-foreground font-bold">Loading island...</div>}>
          <Island3D />
        </Suspense>
      </div>

      {/* HUD layers (above canvas) */}
      <TopBar />
      <QuestLog />
      <AgentDock />
      <ActionDock />

      {/* Overlays */}
      <BuildOverlay />
      <ChatOverlay />
      <RecapOverlay />
      <HistoryOverlay />
      <CheckInOverlay />
      <ToastLayer />
    </div>
  </div>
);
