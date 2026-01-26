'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  emoji: string
  color: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  emoji,
  color,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop com blur */}
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-200"
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.4
              }}
            >
              {/* Emoji com animação */}
              <motion.div
                className="text-center mb-6"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2
                }}
              >
                <div className="text-7xl mb-4">{emoji}</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Enviar esta mensagem?
                </h2>
                <div className={`inline-block px-4 py-2 rounded-full text-white text-sm font-medium ${color}`}>
                  {title}
                </div>
              </motion.div>

              {/* Mensagem */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-gray-600 leading-relaxed">
                  {message}
                </p>
              </motion.div>

              {/* Botões */}
              <motion.div
                className="flex space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 rounded-2xl font-semibold transition-all duration-200"
                  onClick={onCancel}
                  whileHover={{ scale: 1.02, backgroundColor: '#f3f4f6' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancelar
                </motion.button>
                
                <motion.button
                  className={`flex-1 py-4 px-6 text-white rounded-2xl font-semibold transition-all duration-200 ${color}`}
                  onClick={onConfirm}
                  whileHover={{ scale: 1.02, brightness: 1.1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Enviar 💕
                  </motion.span>
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}