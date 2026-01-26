'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface CreateButtonModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (button: ButtonData) => void
}

interface ButtonData {
  title: string
  message: string
  emoji: string
  color: string
}

const availableColors = [
  { name: 'Rosa', value: 'bg-pink-500' },
  { name: 'Vermelho', value: 'bg-red-500' },
  { name: 'Laranja', value: 'bg-orange-500' },
  { name: 'Amarelo', value: 'bg-yellow-500' },
  { name: 'Verde', value: 'bg-green-500' },
  { name: 'Azul', value: 'bg-blue-500' },
  { name: 'Roxo', value: 'bg-purple-500' },
  { name: 'Índigo', value: 'bg-indigo-500' },
  { name: 'Cinza', value: 'bg-gray-500' },
  { name: 'Rosa Escuro', value: 'bg-rose-600' },
]

const suggestedEmojis = ['💕', '😘', '🥰', '😍', '🤗', '😊', '😢', '😴', '🤔', '😋', '🎉', '✨', '💖', '🌟', '🦋']

export default function CreateButtonModal({ isOpen, onClose, onSave }: CreateButtonModalProps) {
  const [button, setButton] = useState<ButtonData>({
    title: '',
    message: '',
    emoji: '💕',
    color: 'bg-pink-500'
  })

  const handleSave = () => {
    if (!button.title.trim() || !button.message.trim()) {
      alert('Preencha o título e a mensagem!')
      return
    }

    onSave(button)
    setButton({
      title: '',
      message: '',
      emoji: '💕',
      color: 'bg-pink-500'
    })
    onClose()
  }

  const handleClose = () => {
    setButton({
      title: '',
      message: '',
      emoji: '💕',
      color: 'bg-pink-500'
    })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-200 max-h-full flex flex-col"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Header */}
              <div className="p-6 pb-4 border-b border-gray-100 rounded-t-3xl flex-shrink-0">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Criar Novo Botão ➕
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Crie um botão personalizado
                  </p>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Título */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Título do Botão
                  </label>
                  <input
                    type="text"
                    value={button.title}
                    onChange={(e) => setButton({ ...button, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-base"
                    placeholder="Ex: Estou feliz, Preciso de ajuda..."
                    maxLength={30}
                  />
                  <p className="text-xs text-gray-500 mt-1">{button.title.length}/30</p>
                </div>

                {/* Mensagem */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mensagem para o Gustavo
                  </label>
                  <textarea
                    value={button.message}
                    onChange={(e) => setButton({ ...button, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none resize-none text-base"
                    placeholder="Geovanna está..."
                    rows={3}
                    maxLength={150}
                  />
                  <p className="text-xs text-gray-500 mt-1">{button.message.length}/150</p>
                </div>

                {/* Emojis */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Escolha um Emoji
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {suggestedEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setButton({ ...button, emoji })}
                        className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-all ${
                          button.emoji === emoji 
                            ? 'border-pink-500 bg-pink-50 scale-110' 
                            : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cores */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Escolha uma Cor
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {availableColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setButton({ ...button, color: color.value })}
                        className={`h-12 rounded-xl border-3 transition-all ${color.value} ${
                          button.color === color.value 
                            ? 'border-gray-800 scale-110 shadow-lg' 
                            : 'border-gray-300 hover:scale-105'
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Prévia */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prévia do Botão
                  </label>
                  <div className={`${button.color} rounded-2xl p-4 text-white text-center shadow-lg`}>
                    <div className="text-4xl mb-2">{button.emoji}</div>
                    <h3 className="font-bold mb-1 text-base">{button.title || 'Título do Botão'}</h3>
                    <p className="text-sm opacity-90">{button.message || 'Mensagem para o Gustavo'}</p>
                  </div>
                </div>

                {/* Espaço extra para scroll */}
                <div className="h-4"></div>
              </div>

              {/* Footer Fixo */}
              <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-200 bg-white rounded-b-3xl">
                <div className="flex space-x-3">
                  <motion.button
                    onClick={handleClose}
                    className="flex-1 py-4 px-4 bg-gray-300 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-400 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ❌ Cancelar
                  </motion.button>
                  <motion.button
                    onClick={handleSave}
                    className="flex-1 py-4 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-bold text-lg hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ✨ Criar Botão
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}