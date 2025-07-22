'use client';

import { motion } from 'framer-motion';
import { Icons } from '../icons';

export default function FullPageLoader() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
      <motion.div
        initial={{ scale: 0.9, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      >
        <Icons.logo className="h-16 w-16 text-primary" />
      </motion.div>
      <p className="text-lg text-muted-foreground">
        Preparing your workspace...
      </p>
    </div>
  );
}
