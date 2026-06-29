// Loading skeleton — pulsing card grid placeholder.
import { motion } from "framer-motion";

export default function SkeletonGrid({ count = 8, cols = "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" }) {
  return (
    <div className={`grid ${cols} gap-3 lg:gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="bg-gray-100 aspect-[3/4] rounded"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.1 }}
        />
      ))}
    </div>
  );
}