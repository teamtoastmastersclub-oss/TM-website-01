import { motion } from "motion/react";

interface ScrollingTextProps {
  text: string;
}

export function ScrollingText({ text }: ScrollingTextProps) {
  const repeatedText = Array(20).fill(text).join(" • ");

  return (
    <div className="relative py-8 md:py-12 overflow-hidden bg-white">
      <motion.div
        animate={{ x: ["-50%", "0%"] }} // Left to right
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex whitespace-nowrap"
      >
        <span className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-bold text-black select-none mr-8">
          {repeatedText}
        </span>
        <span className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-bold text-black select-none">
          {repeatedText}
        </span>
      </motion.div>
    </div>
  );
}
