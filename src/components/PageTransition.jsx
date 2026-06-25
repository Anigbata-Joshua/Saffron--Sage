import { motion } from "framer-motion";
import { pageTransition } from "../animations";

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
