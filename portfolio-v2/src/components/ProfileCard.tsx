import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "../data/profile";
import formal from "../assets/profile.webp";
import casual from "../assets/profile-casual.webp";
import "./ProfileCard.css";

// Portrait card with an animated border, a reveal on scroll and a toggle between the formal and casual photos.
export function ProfileCard() {
  const [isFormal, setFormal] = useState(true);

  return (
    // The in-view trigger sits on the wrapper: the card's own clip-path starts fully clipped,
    // which hides it from the intersection observer.
    <motion.div className="pcard-wrap" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
      <motion.div
        className="pcard"
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
          <div className="pcard__shade" aria-hidden="true" />

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
