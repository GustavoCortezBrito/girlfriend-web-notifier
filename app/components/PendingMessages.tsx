'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface PendingMessage {
  id: number
  title: string
  message: string
  girlfriendName: string
  timestamp: string
  sent: boolean
}

export default function PendingMessages() {
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    loadPendingMessages()
    
    // Verificar mensagens pendentes a cada 30 segundos
    const interval = setInterval(loadPendingMessages, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadPendingMessages = () => {
    try {
      const messages = JSON.parse(localStorage.getItem('pending-messages') || '[]')
      const unsentMessages = messages.filter((msg: PendingMessage) => !msg.sent)
      setPendingMessages(unsentMessages)
    } catch (error) {
      console.error('Erro ao carregar mensagens pendentes:', error)
    }
  }

  const retryMessage = async (messageId: number) => {
    try {
      const message = pendingMessages.find(msg => msg.id === messageId)
      if (!message) return

      // Tentar reenviar via FormSubmit
      const form = document.createElement('form')
      form.action = 'https://formsubmit.co/gujjbrito@gmail.com'
      form.method = 'POST'
      form.style.display = 'none'
      form.target = '_blank'

      const fields = {
        '_subject': `💕 ${message.title} - Mensagem da ${message.girlfriendName} (REENVIO)`,
        '_template': 'table',
        '_captcha': 'false',
        'nome': message.girlfriendName,
        'botao': message.title,
        'mensagem': message.message + ' (Mensagem reenviada)',
        'horario': new Date(message.timestamp).toLocaleString('pt-BR'),
        'reenvio': 'true'
      }

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = value
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()

      // Marcar como enviada
      markMessageAsSent(messageId)
      
    } catch (error) {
      console.error('Erro ao reenviar mensagem:', error)
    }
  }

  const markMessageAsSent = (messageId: number) => {
    try {
      const messages = JSON.parse(localStorage.getItem('pending-messages') || '[]')
      const updatedMessages = messages.map((msg: PendingMessage) => 
        msg.id === messageId ? { ...msg, sent: true } : msg
      )
      localStorage.setItem('pending-messages', JSON.stringify(updatedMessages))
      loadPendingMessages()
    } catch (error) {
      console.error('Erro ao marcar mensagem como enviada:', error)
    }
  }

  const clearAllMessages = () => {
    localStorage.removeItem('pending-messages')
    setPendingMessages([])
    setIsOpen(false)
  }

  if (pendingMessages.length === 0) return null

  return (
    <>
      {/* Botão de notificação */}
      <motion.button
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-red-500 text-white rounded-full p-3 sm:p-4 shadow-lg z-50"
        onClick={() => setIsOpen(true)}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          scale: [1, 1.1, 1],
          boxShadow: ['0 4px 20px rgba(239, 68, 68, 0.3)', '0 8px 30px rgba(239, 68, 68, 0.5)', '0 4px 20px rgba(239, 68, 68, 0.3)']
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="relative">
          <span className="text-lg sm:text-xl">📧</span>
          <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-white text-red-500 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs font-bold">
            {pendingMessages.length}
          </div>
        </div>
      </motion.button>

      {/* Modal de mensagens pendentes */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="fixed inset-x-2 sm:inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 z-50 max-w-md mx-auto max-h-80 sm:max-h-96 overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
            >
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-2">
                  📧 Mensagens Pendentes
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {pendingMessages.length} mensagem(ns) não foram enviadas
                </p>
              </div>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {pendingMessages.map((message) => (
                  <div key={message.id} className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base leading-tight flex-1 mr-2">{message.title}</h3>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {new Date(message.timestamp).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed">{message.message}</p>
                    <button
                      onClick={() => retryMessage(message.id)}
                      className="w-full bg-blue-500 text-white py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                      🔄 Tentar Reenviar
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2 sm:space-x-3">
                <button
                  onClick={clearAllMessages}
                  className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl font-medium hover:bg-gray-300 transition-colors text-sm"
                >
                  Limpar Tudo
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-primary-500 text-white rounded-lg sm:rounded-xl font-medium hover:bg-primary-600 transition-colors text-sm"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}