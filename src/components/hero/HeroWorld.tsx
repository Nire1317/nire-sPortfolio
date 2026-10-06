import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from "react";
import type { WorldPalette, WorldProject } from "./WorldScene";

// three / R3F live in their own chunk and are only fetched once the page is idle
const WorldScene = lazy(() => import("./WorldScene"));

export type HeroTheme = "white" | "cream" | "dark" | "red-black";

// three.js can't read the oklch tokens, so each theme gets a hex palette tuned to match it
const PALETTES: Record<HeroTheme, WorldPalette> = {
  white: { primary: "#2f62e6", secondary: "#8a96b8", ink: "#1e2433", bg: "#ffffff", light: true },
  cream: { primary: "#b85a26", secondary: "#a8957c", ink: "#3a2f24", bg: "#f8f3ec", light: true },
  dark: { primary: "#3fd99b", secondary: "#7d93c9", ink: "#dfe6f5", bg: "#05060d", light: false },
  "red-black": {
    primary: "#e2483d",
    secondary: "#8c8f99",
    ink: "#efe7e6",
    bg: "#030202",
    light: false,
  },
};

type Props = {
  theme: HeroTheme;
  projects: WorldProject[];
  entering: boolean;
  onReady: (ready: boolean) => void;
  onEntered: () => void;
  onSelectProject: (title: string) => void;
};

// Devices that can't (or shouldn't) run the scene get the static fallback
function canRender3D() {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 2) return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

class SceneBoundary extends Component<
  { fallback: ReactNode; onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

// Static stand-in: a quiet orb and orbit, shown while loading and on devices without WebGL
function StaticWorld() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/2 left-1/2 lg:left-[72%] -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[560px] aspect-square">
        <div
          className="absolute inset-[18%] rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, color-mix(in oklab, var(--color-primary) 35%, transparent), transparent 62%)",
            boxShadow: "inset 0 0 60px color-mix(in oklab, var(--color-primary) 25%, transparent)",
          }}
        />
        <div className="absolute inset-[18%] rounded-full border border-primary/25" />
        <div className="absolute inset-[6%] rounded-full border border-primary/10 rotate-[20deg] scale-y-[0.35]" />
      </div>
    </div>
  );
}

export default function HeroWorld({
  theme,
  projects,
  entering,
  onReady,
  onEntered,
  onSelectProject,
}: Props) {
  const container = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [supported, setSupported] = useState<boolean | null>(null);
  const [load, setLoad] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(false);
  const [shown, setShown] = useState(false);

  // Capability check, then defer loading the 3D chunk until the browser is idle
  useEffect(() => {
    const ok = canRender3D();
    setSupported(ok);
    if (!ok) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    };
    if (w.requestIdleCallback) {
      w.requestIdleCallback(() => setLoad(true), { timeout: 1500 });
    } else {
      setTimeout(() => setLoad(true), 300);
    }
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 900px)");
    const sync = () => {
      setReduced(motion.matches);
      setCompact(narrow.matches);
    };
    sync();
    motion.addEventListener("change", sync);
    narrow.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      narrow.removeEventListener("change", sync);
    };
  }, []);

  // Pause rendering whenever the hero scrolls out of view
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Track the mouse across the whole hero (the text layer sits above the canvas)
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const active = Boolean(supported && load && !failed);
  useEffect(() => {
    onReady(active && shown && !reduced);
  }, [active, shown, reduced, onReady]);

  const fail = () => setFailed(true);

  return (
    <div ref={container} aria-hidden="true" className="absolute inset-0">
      {(!active || !shown) && <StaticWorld />}
      {active && (
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${shown ? "opacity-100" : "opacity-0"}`}
        >
          <SceneBoundary fallback={<StaticWorld />} onError={fail}>
            <Suspense fallback={null}>
              <WorldScene
                palette={PALETTES[theme]}
                projects={projects}
                animate={!reduced}
                compact={compact}
                running={visible || entering}
                entering={entering}
                pointer={pointer}
                onEntered={onEntered}
                onSelectProject={onSelectProject}
                onContextLost={fail}
                onCreated={() => setShown(true)}
              />
            </Suspense>
          </SceneBoundary>
        </div>
      )}
    </div>
  );
}
