import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ProjectModal } from "../../components/ProjectModal";
import { projects, type Project } from "../../data/profile";
import type { WorldPalette, WorldProject } from "./HeroScene.world";
import "./HeroScene.css";

// The 3D "World of Innovation". three / R3F live in their own chunk, fetched once the page is idle,
// so the hero copy paints without waiting on WebGL.
const WorldCanvas = lazy(() => import("./HeroScene.world"));

// Matches the tokens in styles/global.css (three.js can't read CSS variables)
const PALETTE: WorldPalette = {
  primary: "#76b900",
  highlight: "#a3e635",
  secondary: "#6f7a63",
  ink: "#e8eaf0",
  bg: "#050605",
  light: false,
};

const worldProjects: WorldProject[] = projects.slice(0, 3).map((p) => ({
  title: p.title,
  tag: `${p.kind} · ${p.year}`,
  themeColor: "#76b900",
  isLive: Boolean(p.liveUrl),
}));

const ENTER_EVENT = "heroscene:enter";

// Lets any button (e.g. an "Enter the World" CTA in Hero.tsx) start the fly-through into Projects.
// Falls back to a plain scroll when the 3D scene isn't running.
export function requestEnterWorld() {
  window.dispatchEvent(new Event(ENTER_EVENT));
}

// Devices that can't (or shouldn't) run the scene get the static version
function canRender3D() {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 2) return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

class SceneBoundary extends Component<{ fallback: ReactNode; onError: () => void; children: ReactNode }, { failed: boolean }> {
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

function StaticWorld() {
  return (
    <div className="scene__static" aria-hidden="true">
      <div className="scene__orb" />
      <div className="scene__ring" />
      <div className="scene__ring scene__ring--b" />
    </div>
  );
}

function scrollToProjects() {
  document.getElementById("projects")?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
}

type HeroSceneProps = {
  // "background" fills the whole hero behind the copy; "column" keeps it in its own box
  layout?: "column" | "background";
};

export function HeroScene({ layout = "column" }: HeroSceneProps) {
  const box = useRef<HTMLDivElement>(null);
  const tooltip = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [supported, setSupported] = useState(false);
  const [load, setLoad] = useState(false);
  const [failed, setFailed] = useState(false);
  const [shown, setShown] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(false);
  const [entering, setEntering] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const enterTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Capability check, then load the 3D chunk when the browser is idle
  useEffect(() => {
    if (!canRender3D()) return;
    setSupported(true);
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => setLoad(true), { timeout: 1500 });
    else setTimeout(() => setLoad(true), 300);
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 900px)");
    const sync = () => {
      setReduced(motionQuery.matches);
      setCompact(narrow.matches);
    };
    sync();
    motionQuery.addEventListener("change", sync);
    narrow.addEventListener("change", sync);
    return () => {
      motionQuery.removeEventListener("change", sync);
      narrow.removeEventListener("change", sync);
    };
  }, []);

  // Pause rendering whenever the scene is off screen
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Mouse anywhere on the page nudges the camera a little
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const active = supported && load && !failed;
  const live = active && shown && !reduced;

  const finishEnter = useCallback(() => {
    if (enterTimeout.current) clearTimeout(enterTimeout.current);
    enterTimeout.current = null;
    scrollToProjects();
    setEntering(false);
  }, []);

  const enterWorld = useCallback(() => {
    const nearTop = window.scrollY < window.innerHeight * 0.6;
    if (!live || !nearTop) {
      document.getElementById("projects")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      return;
    }
    setEntering(true);
    // never leave the visitor stuck if the scene stalls
    enterTimeout.current = setTimeout(finishEnter, 2600);
  }, [live, reduced, finishEnter]);

  useEffect(() => {
    window.addEventListener(ENTER_EVENT, enterWorld);
    return () => window.removeEventListener(ENTER_EVENT, enterWorld);
  }, [enterWorld]);

  useEffect(
    () => () => {
      if (enterTimeout.current) clearTimeout(enterTimeout.current);
    },
    [],
  );

  const fail = () => setFailed(true);

  return (
    <div ref={box} className={`scene scene--${layout}`}>
      {/* The canvas is decorative: everything in it is also in the page as real content */}
      <div className="scene__stage" aria-hidden="true">
        {(!active || !shown) && <StaticWorld />}
        {active && (
          <div className={`scene__canvas ${shown ? "is-shown" : ""}`}>
            <SceneBoundary fallback={<StaticWorld />} onError={fail}>
              <Suspense fallback={null}>
                <WorldCanvas
                  palette={PALETTE}
                  projects={worldProjects}
                  animate={!reduced}
                  compact={compact}
                  running={visible || entering}
                  entering={entering}
                  pointer={pointer}
                  tooltip={tooltip}
                  onEntered={finishEnter}
                  onSelectProject={(title) => setSelected(projects.find((p) => p.title === title) ?? null)}
                  onContextLost={fail}
                  onCreated={() => setShown(true)}
                  layout={layout}
                />
              </Suspense>
            </SceneBoundary>
          </div>
        )}
        <div ref={tooltip} className="scene__tooltip mono" />
      </div>

      <div className={`scene__footer mono ${entering ? "is-hidden" : ""}`}>
        <span className="scene__hint">{live && !compact ? "Drag to spin the world · click a project" : "Code → Ideas → AI → Products"}</span>
        <button type="button" className="scene__enter" onClick={enterWorld}>
          Enter the world <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Portalled so the hero's entrance transforms can't trap these fixed layers */}
      {createPortal(
        <>
          {/* Covers the jump from the world into Projects */}
          <AnimatePresence>
            {entering && (
              <motion.div
                className="scene__veil"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 1.25, duration: 0.6 } }}
                exit={{ opacity: 0, transition: { duration: 0.7 } }}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
          </AnimatePresence>
        </>,
        document.body,
      )}
    </div>
  );
}
