import { motion } from 'framer-motion';
import {ReactNode} from "react";

const variants = {
  hover: {
    borderColor: ['rgba(76, 175, 80, 0.8)', 'rgba(52, 211, 153, 0.8)'],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};

export const NiggaButton = ({ children, ...props }: {children: ReactNode}) => (
  <motion.button
    variants={variants}
    initial="initial"
    whileHover="hover"
    className="relative inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700"
    {...props}
  >
    {children}
  </motion.button>
);