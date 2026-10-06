import { useState } from "react";
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { profile } from "../data/profile";
import formal from "../assets/profile.webp";
import casual from "../assets/profile-casual.webp";
import "./ProfileCard.css";

// Portrait card that tilts toward the pointer, with a light glare that follows it,
// an animated border, and a toggle between the formal and casual photos.
export function ProfileCard() {
  const reduce = useReducedMotion();
  const [isFormal, setFormal] = useState(true);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 160, damping: 18 };
  const rotateX = useSpring(useTransform(py, [0, 1], [8, -8]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-10, 10]), spring);
  const glareX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(py, [0, 1], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.18), transparent 55%)`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    // The in-view trigger sits on the wrapper: the card's own clip-path starts fully clipped,
    // which hides it from the intersection observer.
    <motion.div className="pcard-wrap" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
      <motion.div
        className="pcard"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
        variants={{
          hidden: { opacity: 0, y: 30, clipPath: "inset(100% 0% 0% 0% round 20px)" },
          show: { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 20px)" },
        }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="pcard__photo">
          <AnimatePresence initial={false}>
            <motion.img
              key={isFormal ? "formal" : "casual"}
              src={isFormal ? formal : casual}
              alt={`${profile.name}, ${isFormal ? "formal" : "casual"} portrait`}
              width={768}
              height={1024}
              loading="lazy"
              initial={{ opacity: 0, scale: 1.06, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </AnimatePresence>
          {!reduce && <motion.div className="pcard__glare" style={{ background: glare }} aria-hidden="true" />}
          <div className="pcard__scan" aria-hidden="true" />
          <div className="pcard__shade" aria-hidden="true" />

          <span className="pcard__status mono">
            <span className="pcard__pulse" aria-hidden="true" />
            Building at Inovers
          </span>

          <div className="pcard__name">
            <p className="pcard__title">{profile.shortName} Tuzon</p>
            <p className="pcard__role mono">{profile.role}</p>
          </div>
        </div>

        <div className="pcard__bar">
          <span className="mono">{"<"}Erin {"/>"}</span>
          <div className="pcard__toggle" role="group" aria-label="Choose photo">
            <button type="button" aria-pressed={isFormal} onClick={() => setFormal(true)}>
              Formal
            </button>
            <button type="button" aria-pressed={!isFormal} onClick={() => setFormal(false)}>
              Casual
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
