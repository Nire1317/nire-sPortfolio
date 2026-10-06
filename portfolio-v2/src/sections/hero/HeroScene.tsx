import { motion } from "motion/react";
import type { ReactNode } from "react";
import "./HeroScene.css";

// Placeholder visual for the hero: a small editor card.
// Owned by the hero work stream; replace this component (keep the export name) to swap in a 3D scene.
const lines: { n: number; code: ReactNode; tone?: "add" | "note" }[] = [
  { n: 1, code: <><span className="k">export async function</span> <span className="f">trackParcel</span>(id) {"{"}</> },
  { n: 2, code: <>  <span className="c">// drafted with AI, reviewed by me</span></>, tone: "note" },
  { n: 3, code: <>  <span className="k">const</span> parcel = <span className="k">await</span> db.parcels.<span className="f">find</span>(id);</> },
  { n: 4, code: <>  <span className="k">if</span> (!parcel) <span className="k">throw new</span> <span className="f">NotFound</span>(id);</>, tone: "add" },
  { n: 5, code: <>  <span className="k">return</span> <span className="f">syncStatus</span>(parcel);</> },
  { n: 6, code: <>{"}"}</> },
];

export function HeroScene() {
  return (
    <div className="scene">
      <div className="scene__window">
        <div className="scene__bar">
          <span />
          <span />
          <span />
          <p className="mono">tracking.ts</p>
        </div>
        <pre className="scene__code mono">
          {lines.map((l, i) => (
            <motion.div
              key={l.n}
              className={`scene__line ${l.tone ? `is-${l.tone}` : ""}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="scene__n">{l.n}</span>
              <span>{l.code}</span>
            </motion.div>
          ))}
        </pre>
        <motion.div
          className="scene__status mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <span className="ok" /> tests passing · reviewed · ready to ship
        </motion.div>
      </div>
    </div>
  );
}
