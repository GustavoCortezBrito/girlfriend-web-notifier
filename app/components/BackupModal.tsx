'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface BackupModalProps {
  isOpen: boolean
  onClose: () => void
  currentProfile: 'geovanna' | 'gustavo' | null
}

export default function BackupModal({ isOpen, onClose, currentProfile }: BackupModalProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export')
  const [backupData, setBackupData] = useState('')
  const [importData, setImportData] = useState('')

  const exportData = () => {
    const buttons = localStorage.getItem(`custom-buttons-${currentProfile}`)
    const photos = localStorage.getItem('custom-photos')
    const messages = localStorage.getItem('pending-messages')
    
    const backup = {
      timestamp: new Date().toISOString(),
      profile: currentProfile,
      buttons: buttons ? JSON.parse(buttons) : [],
      photos: photos ? JSON.parse(photos) : [],
      messages: messages ? JSON.parse(messages) : [],
      version: '1.0'
    }
    
    const backupString = JSON.stringify(backup, null, 2)
    setBackupData(backupString)
    
    // Copiar para clipboard
    navigator.clipboard.writeText(backupString).then(() => {
      alert('✅ Backup copiado para a área de transferência!')
    }).catch(() => {
      alert('✅ Backup gerado! Copie o código manualmente.')
    })
  }

  const importBackup = () => {
    if (!importData.trim()) {
      alert('⚠️ Cole o código do backup primeiro!')
      return
    }

    try {
      const backup = JSON.parse(importData)
      
      if (backup.buttons && backup.profile === currentProfile) {
        localStorage.setItem(`custom-buttons-${currentProfile}`, JSON.stringify(backup.buttons))
      }
      
      if (backup.photos) {
        localStorage.setItem('custom-photos', JSON.stringify(backup.photos))
      }
      
      if (backup.messages) {
        localStorage.setItem('pending-messages', JSON.stringify(backup.messages))
      }
      
      alert('✅ Backup restaurado com sucesso! Recarregue a página.')
      onClose()
      
    } catch (error) {
      alert('❌ Código de backup inválido! Verifique se copiou corretamente.')
    }
  }

  const downloadBackup = () => {
    if (!backupData) {
      exportData()
      return
    }
    
    const blob = new Blob([backupData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backup-${currentProfile}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-200 max-h-[90vh] flex flex-col"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Header */}
              <div className="p-6 pb-4 border-b border-gray-100 rounded-t-3xl flex-shrink-0">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    💾 Backup dos Dados
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Salve ou restaure seus botões e fotos personalizadas
                  </p>
                </div>
                
                {/* Tabs */}
                <div className="flex mt-4 bg-gray-100 rounded-xl p-1">
                  <button
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                      activeTab === 'export' 
                        ? 'bg-white text-gray-800 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveTab('export')}
                  >
                    📤 Fazer Backup
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                      activeTab === 'import' 
                        ? 'bg-white text-gray-800 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveTab('import')}
                  >
                    📥 Restaurar
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'export' ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">
                        Crie um backup dos botões de {currentProfile === 'geovanna' ? 'Geovanna' : 'Gustavo'} e fotos compartilhadas
                      </p>
                      
                      <div className="space-y-3">
                        <motion.button
                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg"
                          onClick={exportData}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          📋 Gerar Código de Backup
                        </motion.button>
                        
                        {backupData && (
                          <motion.button
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                            onClick={downloadBackup}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            💾 Baixar Arquivo de Backup
                          </motion.button>
                        )}
                      </div>
                    </div>
                    
                    {backupData && (
                      <motion.div
                        className="mt-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Código de Backup (copie e guarde em local seguro):
                        </label>
                        <textarea
                          value={backupData}
                          readOnly
                          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono bg-gray-50 resize-none"
                          onClick={(e) => e.currentTarget.select()}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Clique no texto para selecionar tudo
                        </p>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">
                        Cole o código de backup para restaurar seus dados
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Código de Backup:
                      </label>
                      <textarea
                        value={importData}
                        onChange={(e) => setImportData(e.target.value)}
                        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Cole aqui o código do backup..."
                      />
                    </div>
                    
                    <motion.button
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
                      onClick={importBackup}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      🔄 Restaurar Backup
                    </motion.button>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-yellow-800 text-xs">
                        ⚠️ <strong>Atenção:</strong> Restaurar um backup vai substituir todos os dados atuais. 
                        Faça um backup dos dados atuais antes de restaurar.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-200 bg-white rounded-b-3xl">
                <motion.button
                  onClick={onClose}
                  className="w-full py-3 px-4 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ✕ Fechar
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}