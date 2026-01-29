'use client'

import { motion } from 'framer-motion'

interface ProfileSelectorProps {
  onSelectProfile: (profile: 'geovanna' | 'gustavo') => void
}

export default function ProfileSelector({ onSelectProfile }: ProfileSelectorProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Partículas de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 text-center px-8 max-w-md w-full">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 1, 
            type: "spring", 
            stiffness: 150,
            damping: 12 
          }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border-4 border-white/40 shadow-2xl">
            <motion.span 
              className="text-6xl"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              💕
            </motion.span>
          </div>
        </motion.div>
        
        <motion.h1
          className="text-4xl font-bold text-white mb-4 drop-shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Quem está usando? 💖
        </motion.h1>
        
        <motion.p
          className="text-lg text-white/90 mb-8 drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Escolha seu perfil para continuar
        </motion.p>

        {/* Botões de perfil */}
        <div className="space-y-4">
          <motion.button
            className="w-full bg-gradient-to-r from-pink-500/30 to-rose-500/30 backdrop-blur-xl border-2 border-white/40 rounded-2xl px-8 py-6 text-white font-bold text-xl shadow-2xl hover:from-pink-500/50 hover:to-rose-500/50 transition-all duration-300"
            onClick={() => onSelectProfile('geovanna')}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 20px 40px rgba(255,255,255,0.3)" 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center justify-center space-x-3">
              <motion.span
                className="text-3xl"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                👸
              </motion.span>
              <div className="text-left">
                <div className="text-2xl font-bold">Geovanna</div>
                <div className="text-sm opacity-90">Sua princesa 💖</div>
              </div>
            </div>
          </motion.button>

          <motion.button
            className="w-full bg-gradient-to-r from-blue-500/30 to-indigo-500/30 backdrop-blur-xl border-2 border-white/40 rounded-2xl px-8 py-6 text-white font-bold text-xl shadow-2xl hover:from-blue-500/50 hover:to-indigo-500/50 transition-all duration-300"
            onClick={() => onSelectProfile('gustavo')}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 20px 40px rgba(255,255,255,0.3)" 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center justify-center space-x-3">
              <motion.span
                className="text-3xl"
                animate={{ 
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                🤴
              </motion.span>
              <div className="text-left">
                <div className="text-2xl font-bold">Gustavo</div>
                <div className="text-sm opacity-90">Seu príncipe 💙</div>
              </div>
            </div>
          </motion.button>
        </div>

        <motion.p
          className="text-sm text-white/70 mt-6 drop-shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          Cada perfil tem seus próprios botões personalizados ✨
        </motion.p>
      </div>
    </motion.div>
  )
}