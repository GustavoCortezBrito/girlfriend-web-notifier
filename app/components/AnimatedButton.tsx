'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface AnimatedButtonProps {
  title: string
  message: string
  emoji: string
  color: string
  onPress: (title: string, message: string) => void
}

export default function AnimatedButton({
  title,
  message,
  emoji,
  color,
  onPress,
}: AnimatedButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const handlePress = async () => {
    if (isPressed) return
    
    setIsPressed(true)
    
    // Vibração no celular (se suportado)
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }

    try {
      await onPress(title, message)
    } finally {
      setTimeout(() => setIsPressed(false), 1000)
    }
  }

  return (
    <motion.button
      className={`relative w-full overflow-hidden rounded-2xl p-4 text-white font-bold shadow-xl border border-white/50 ${
        isPressed ? 'opacity-50' : ''
      }`}
      onClick={handlePress}
      disabled={isPressed}
      style={{
        background: `rgba(${color.includes('pink') ? '236, 72, 153' : 
                          color.includes('red') ? '239, 68, 68' :
                          color.includes('orange') ? '249, 115, 22' :
                          color.includes('yellow') ? '234, 179, 8' :
                          color.includes('green') ? '34, 197, 94' :
                          color.includes('blue') ? '59, 130, 246' :
                          color.includes('purple') ? '147, 51, 234' :
                          color.includes('indigo') ? '99, 102, 241' :
                          color.includes('gray') ? '107, 114, 128' :
                          color.includes('rose') ? '244, 63, 94' : '236, 72, 153'}, 0.4)`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)',
      }}
      whileHover={{ 
        scale: 1.02, 
        y: -3,
        backgroundColor: `rgba(${color.includes('pink') ? '236, 72, 153' : 
                              color.includes('red') ? '239, 68, 68' :
                              color.includes('orange') ? '249, 115, 22' :
                              color.includes('yellow') ? '234, 179, 8' :
                              color.includes('green') ? '34, 197, 94' :
                              color.includes('blue') ? '59, 130, 246' :
                              color.includes('purple') ? '147, 51, 234' :
                              color.includes('indigo') ? '99, 102, 241' :
                              color.includes('gray') ? '107, 114, 128' :
                              color.includes('rose') ? '244, 63, 94' : '236, 72, 153'}, 0.6)`,
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
    >
      {/* Background overlay mais sutil no hover */}
      <motion.div
        className="absolute inset-0 bg-black/10 rounded-2xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          className="text-3xl mb-2"
          animate={isPressed ? { 
            rotate: [0, -10, 10, -5, 5, 0],
            scale: [1, 1.1, 0.9, 1.05, 0.95, 1]
          } : {}}
          transition={{ duration: 0.6 }}
          whileHover={{ 
            scale: 1.1,
            rotate: [0, 5, -5, 0],
            transition: { duration: 0.3 }
          }}
        >
          {emoji}
        </motion.div>
        
        <motion.h3 
          className="text-lg font-bold mb-2 text-center leading-tight"
          style={{ 
            textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)' 
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {isPressed ? 'Enviando...' : title}
        </motion.h3>
        
        <motion.p 
          className="text-white text-xs leading-relaxed text-center px-2"
          style={{ 
            textShadow: '1px 1px 3px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.4)' 
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
        
        {isPressed && (
          <motion.div
            className="mt-4 flex space-x-2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        initial={{ scale: 0, opacity: 0.5 }}
        whileTap={{ scale: 1, opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
        }}
      />
    </motion.button>
  )
}