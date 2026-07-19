import React, { useState, useEffect } from 'react';

interface TerminalTextProps {
  text: string;
  delay?: number; // Initial delay in ms
  speed?: number; // Typing speed in ms per char
  className?: string;
  onComplete?: () => void;
}

export const TerminalText: React.FC<TerminalTextProps> = ({
  text,
  delay = 0,
  speed = 30,
  className = '',
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText((prev) => prev + text.charAt(currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [started, text, speed, onComplete]);

  return (
    <span className={`${className} terminal-text-animated`}>
      {displayedText}
    </span>
  );
};
