import { MainIslandScreen } from "@/components/screens/MainIslandScreen";
import { BuildMenuScreen } from "@/components/screens/BuildMenuScreen";
import { AgentChatScreen } from "@/components/screens/AgentChatScreen";
import { WeeklySummaryScreen } from "@/components/screens/WeeklySummaryScreen";
import { CheckInScreen } from "@/components/screens/CheckInScreen";
import { PhoneFrame } from "@/components/PhoneFrame";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-8 pt-12 pb-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
            Mobile UI · v1
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
          Island of Habits
        </h1>
        <p className="text-base text-muted-foreground mt-2 max-w-xl">
          In-game UI mockups wrapping the existing 3D island. Cozy pastels, frosted
          glass over the world, generous spacing — built for friends, not metrics.
        </p>
      </header>

      {/* Phones row */}
      <section className="px-6 pb-20 overflow-x-auto scrollbar-hide">
        <div className="flex gap-10 min-w-max pb-6 px-2">
          <PhoneFrame label="1 · Main Island" sublabel="Group HUD, agents, personal goals">
            <MainIslandScreen />
          </PhoneFrame>
          <PhoneFrame label="2 · Build Menu" sublabel="Library + AI milestone monument">
            <BuildMenuScreen />
          </PhoneFrame>
          <PhoneFrame label="3 · Agent Chat" sublabel="Personal AI companion">
            <AgentChatScreen />
          </PhoneFrame>
          <PhoneFrame label="4 · Weekly Recap" sublabel="AI narrative + contributions">
            <WeeklySummaryScreen />
          </PhoneFrame>
          <PhoneFrame label="5 · Check-in" sublabel="Mark goal complete + photo">
            <CheckInScreen />
          </PhoneFrame>
        </div>
      </section>

      {/* Design system note */}
      <section className="max-w-7xl mx-auto px-8 pb-20 grid md:grid-cols-3 gap-4">
        <SystemCard
          title="Palette"
          body="Sky blue, sage green, warm cream, soft coral and honey accents. No harsh black or pure white."
        />
        <SystemCard
          title="Cards & glass"
          body="20px+ radius, soft warm shadows. Frosted glass over the 3D island so the world stays the hero."
        />
        <SystemCard
          title="Stats"
          body="Every icon paired with a text label. Currency, progress, and streak each get their own color tone."
        />
      </section>
    </div>
  );
};

const SystemCard = ({ title, body }: { title: string; body: string }) => (
  <div className="bg-card rounded-3xl p-5 border border-border/60 shadow-soft">
    <p className="text-[10px] font-extrabold uppercase tracking-wider text-primary mb-1.5">
      {title}
    </p>
    <p className="text-sm text-foreground leading-relaxed">{body}</p>
  </div>
);

export default Index;
