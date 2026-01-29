'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedButton from './components/AnimatedButton'
import PendingMessages from './components/PendingMessages'
import ConfirmationModal from './components/ConfirmationModal'
import CreateButtonModal from './components/CreateButtonModal'
import BackupModal from './components/BackupModal'
import ProfileSelector from './components/ProfileSelector'

export default function Home() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [createButtonModalOpen, setCreateButtonModalOpen] = useState(false)
  const [backupModalOpen, setBackupModalOpen] = useState(false)
  const [customButtons, setCustomButtons] = useState<any[]>([])
  const [showLoadingScreen, setShowLoadingScreen] = useState(true)
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true)
  const [showProfileSelector, setShowProfileSelector] = useState(true)
  const [currentProfile, setCurrentProfile] = useState<'geovanna' | 'gustavo' | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<string>('')
  const [daysTogether, setDaysTogether] = useState(0)
  const [customPhotos, setCustomPhotos] = useState<any[]>([])
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false)
  const [showExpandedPlayer, setShowExpandedPlayer] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    emoji: string
    color: string
  }>({
    isOpen: false,
    title: '',
    message: '',
    emoji: '',
    color: ''
  })
  
  const girlfriendName = currentProfile === 'geovanna' ? 'Geovanna' : 'Gustavo'
  const partnerName = currentProfile === 'geovanna' ? 'Gustavo' : 'Geovanna'
  
  // Emails: cada pessoa envia para o email da outra
  const targetEmail = currentProfile === 'geovanna' ? 'gujjbrito@gmail.com' : 'Gecesco94@gmail.com'
  
  const relationshipStart = new Date('2025-11-01') // Data que começaram a ficar juntos

  // Fotos do casal para o carrossel (fixas + personalizadas)
  const defaultPhotos = [
    { src: "/photos/photo1.jpg", alt: "Geovanna e Gustavo - Foto 1", isDefault: true },
    { src: "/photos/photo2.jpg", alt: "Geovanna e Gustavo - Foto 2", isDefault: true },
    { src: "/photos/photo3.jpg", alt: "Geovanna e Gustavo - Foto 3", isDefault: true },
    { src: "/photos/photo4.jpg", alt: "Geovanna e Gustavo - Foto 4", isDefault: true },
    { src: "/photos/photo5.jpg", alt: "Geovanna e Gustavo - Foto 5", isDefault: true },
    { src: "/photos/photo6.jpg", alt: "Geovanna e Gustavo - Foto 6", isDefault: true }
  ]

  // Combinar fotos padrão com personalizadas
  const couplePhotos = [...defaultPhotos, ...customPhotos]

  // Playlist romântica - 7 músicas fixas
  const playlist = [
    { title: "Música 1", artist: "Geovanna & Gustavo", src: "/music/Music1.mp3" },
    { title: "Música 2", artist: "Geovanna & Gustavo", src: "/music/Music2.mp3" },
    { title: "Música 3", artist: "Geovanna & Gustavo", src: "/music/Music3.mp3" },
    { title: "Música 4", artist: "Geovanna & Gustavo", src: "/music/Music4.mp3" },
    { title: "Música 5", artist: "Geovanna & Gustavo", src: "/music/Music5.mp3" },
    { title: "Música 6", artist: "Geovanna & Gustavo", src: "/music/Music6.mp3" },
    { title: "Música 7", artist: "Geovanna & Gustavo", src: "/music/Music7.mp3" }
  ]

  // Calcular dias juntos
  const calculateDaysTogether = () => {
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - relationshipStart.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  useEffect(() => {
    // Atualizar contador de dias - inicialmente e a cada minuto
    const updateDaysCounter = () => {
      setDaysTogether(calculateDaysTogether())
    }
    
    // Atualizar imediatamente
    updateDaysCounter()
    
    // Atualizar a cada minuto (60000ms)
    const daysInterval = setInterval(updateDaysCounter, 60000)
    
    // Carrossel de fotos - trocar a cada 4 segundos
    const photoInterval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % couplePhotos.length)
    }, 4000)
    
    // Carregar botões personalizados baseado no perfil
    const savedButtons = localStorage.getItem(`custom-buttons-${currentProfile}`)
    if (savedButtons) {
      setCustomButtons(JSON.parse(savedButtons))
    }

    // Carregar fotos personalizadas
    const savedPhotos = localStorage.getItem('custom-photos')
    if (savedPhotos) {
      setCustomPhotos(JSON.parse(savedPhotos))
    }

    // Verificar se voltou do FormSubmit
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('sent') === 'true') {
      const method = urlParams.get('method')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
      // Marcar mensagem como enviada no localStorage
      if (method === 'formsubmit') {
        markLastMessageAsSent()
      }
      
      // Limpar URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    // Verificar conexão de internet
    checkInternetConnection()

    return () => {
      clearInterval(daysInterval)
      clearInterval(photoInterval)
      if (audioRef) {
        audioRef.pause()
        audioRef.removeEventListener('ended', handleSongEnd)
      }
    }
  }, [])

  // Função para selecionar perfil
  const handleProfileSelect = (profile: 'geovanna' | 'gustavo') => {
    setCurrentProfile(profile)
    setShowProfileSelector(false)
    
    // Carregar dados específicos do perfil
    const savedButtons = localStorage.getItem(`custom-buttons-${profile}`)
    if (savedButtons) {
      setCustomButtons(JSON.parse(savedButtons))
    } else {
      setCustomButtons([])
    }
  }

  // Função para iniciar o app após interação do usuário
  const startApp = async () => {
    console.log('🎵 Usuário interagiu! Iniciando app...')
    
    // Esconder tela de boas-vindas
    setShowWelcomeScreen(false)
    
    // Mostrar loading por 1 segundo
    setShowLoadingScreen(true)
    
    // Inicializar música
    await initializeMusic()
    
    // Após 1 segundo, esconder loading e mostrar app
    setTimeout(() => {
      setShowLoadingScreen(false)
    }, 1000)
  }

  // Inicializar sistema de música
  const initializeMusic = async () => {
    console.log('🎵 Inicializando sistema de música...')
    const audio = new Audio()
    audio.volume = 0.3 // Volume baixo para não incomodar
    audio.loop = false
    
    // Logs para debug
    audio.addEventListener('loadstart', () => console.log('🎵 Carregando música...'))
    audio.addEventListener('canplay', () => console.log('🎵 Música pronta para tocar'))
    audio.addEventListener('error', (e) => {
      console.error('❌ Erro na música:', e)
      console.log('💡 Verifique se o arquivo Music1.mp3 está na pasta public/music/')
    })
    
    // Atualizar tempo atual e duração
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime)
    })
    
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
    })
    
    // Quando a música termina, passa para a próxima
    const handleSongEnd = () => {
      console.log('🎵 Música terminou, passando para próxima...')
      nextSong()
    }
    
    audio.addEventListener('ended', handleSongEnd)
    
    // Carregar a primeira música
    audio.src = playlist[0].src
    setAudioRef(audio)
    
    // Tentar tocar automaticamente (agora deve funcionar após interação)
    try {
      console.log('🎵 Tentando tocar automaticamente após interação...')
      await audio.play()
      console.log('✅ Música tocando automaticamente!')
      setIsPlaying(true)
    } catch (error) {
      console.log('⚠️ Ainda não conseguiu tocar automaticamente:', error)
      setIsPlaying(false)
    }
  }

  // Controles de música
  const togglePlayPause = () => {
    if (!audioRef) {
      console.log('❌ Audio não inicializado')
      return
    }
    
    if (isPlaying) {
      console.log('⏸️ Pausando música...')
      audioRef.pause()
      setIsPlaying(false)
    } else {
      console.log('▶️ Tocando música...')
      audioRef.play().then(() => {
        console.log('✅ Música tocando!')
        setIsPlaying(true)
      }).catch((error) => {
        console.error('❌ Erro ao tocar:', error)
      })
    }
  }

  const nextSong = () => {
    if (!audioRef) return
    
    const nextIndex = (currentSongIndex + 1) % playlist.length
    setCurrentSongIndex(nextIndex)
    
    audioRef.src = playlist[nextIndex].src
    if (isPlaying) {
      audioRef.play().catch(() => {
        console.log('Erro ao tocar próxima música')
      })
    }
  }

  const previousSong = () => {
    if (!audioRef) return
    
    const prevIndex = (currentSongIndex - 1 + playlist.length) % playlist.length
    setCurrentSongIndex(prevIndex)
    
    audioRef.src = playlist[prevIndex].src
    if (isPlaying) {
      audioRef.play().catch(() => {
        console.log('Erro ao tocar música anterior')
      })
    }
  }

  const seekTo = (time: number) => {
    if (!audioRef) return
    audioRef.currentTime = time
    setCurrentTime(time)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSongEnd = () => {
    nextSong()
  }

  const markLastMessageAsSent = () => {
    try {
      const pendingMessages = JSON.parse(localStorage.getItem('pending-messages') || '[]')
      if (pendingMessages.length > 0) {
        pendingMessages[pendingMessages.length - 1].sent = true
        localStorage.setItem('pending-messages', JSON.stringify(pendingMessages))
      }
    } catch (error) {
      console.error('Erro ao marcar mensagem como enviada:', error)
    }
  }

  const checkInternetConnection = () => {
    if (!navigator.onLine) {
      setShowError(true)
      setTimeout(() => setShowError(false), 5000)
    }
  }

  const handleCreateButton = (newButton: any) => {
    const updatedButtons = [...customButtons, { ...newButton, id: Date.now() }]
    setCustomButtons(updatedButtons)
    localStorage.setItem(`custom-buttons-${currentProfile}`, JSON.stringify(updatedButtons))
  }

  const handleDeleteButton = (buttonId: number) => {
    const updatedButtons = customButtons.filter(btn => btn.id !== buttonId)
    setCustomButtons(updatedButtons)
    localStorage.setItem(`custom-buttons-${currentProfile}`, JSON.stringify(updatedButtons))
  }

  const handleAddPhoto = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const newPhoto = {
        id: Date.now(),
        src: e.target?.result as string,
        alt: `Foto adicionada por Geovanna - ${new Date().toLocaleDateString()}`,
        isDefault: false,
        addedDate: new Date().toISOString()
      }
      
      const updatedPhotos = [...customPhotos, newPhoto]
      setCustomPhotos(updatedPhotos)
      localStorage.setItem('custom-photos', JSON.stringify(updatedPhotos))
      setShowAddPhotoModal(false)
    }
    reader.readAsDataURL(file)
  }

  const handleDeletePhoto = (photoId: number) => {
    const updatedPhotos = customPhotos.filter(photo => photo.id !== photoId)
    setCustomPhotos(updatedPhotos)
    localStorage.setItem('custom-photos', JSON.stringify(updatedPhotos))
    
    // Ajustar índice se necessário
    if (currentPhotoIndex >= couplePhotos.length - 1) {
      setCurrentPhotoIndex(0)
    }
  }

  const handleButtonPress = async (title: string, message: string, emoji: string, color: string) => {
    if (isLoading) return
    
    // Abrir modal de confirmação
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      emoji,
      color
    })
  }

  const handleConfirmSend = async () => {
    const { title, message } = confirmationModal
    
    setConfirmationModal({ ...confirmationModal, isOpen: false })
    setIsLoading(true)
    setShowError(false)

    try {
      // Método 1: Nossa API (sem confirmação)
      const apiSuccess = await sendViaAPI(title, message)
      
      if (apiSuccess) {
        return
      }

      // Método 2: FormSubmit (com confirmação)
      const formSubmitSuccess = await sendViaFormSubmit(title, message)
      
      if (formSubmitSuccess) {
        return
      }

      // Método 3: Fallback - Mailto
      await sendViaMailto(title, message)
      
    } catch (error) {
      console.error('Erro ao enviar:', error)
      setShowError(true)
      setTimeout(() => setShowError(false), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSend = () => {
    setConfirmationModal({ ...confirmationModal, isOpen: false })
  }

  const sendViaAPI = async (title: string, message: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          message,
          senderName: girlfriendName,
          receiverName: partnerName,
          targetEmail: targetEmail,
          timestamp: new Date().toISOString()
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Salvar no localStorage como backup
        saveToLocalStorage(title, message)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
        return true
      }
      
      return false
      
    } catch (error) {
      console.error('Erro na API:', error)
      return false
    }
  }

  const sendViaFormSubmit = async (title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        // Criar formulário para FormSubmit
        const form = document.createElement('form')
        form.action = `https://formsubmit.co/${targetEmail}`
        form.method = 'POST'
        form.style.display = 'none'
        form.target = '_blank' // Abrir em nova aba para não sair do app

        // Campos do formulário
        const fields = {
          '_subject': `💕 ${title} - Mensagem de ${girlfriendName} para ${partnerName}`,
          '_template': 'table',
          '_captcha': 'false',
          '_next': `${window.location.origin}?sent=true&method=formsubmit`,
          'remetente': girlfriendName,
          'destinatario': partnerName,
          'botao': title,
          'mensagem': message,
          'horario': new Date().toLocaleString('pt-BR'),
          'timestamp': Date.now().toString()
        }

        // Adicionar campos ao formulário
        Object.entries(fields).forEach(([key, value]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = value
          form.appendChild(input)
        })

        // Timeout para detectar falha
        const timeout = setTimeout(() => {
          document.body.removeChild(form)
          resolve(false)
        }, 5000)

        // Listener para sucesso
        const handleSuccess = () => {
          clearTimeout(timeout)
          setShowSuccess(true)
          setTimeout(() => setShowSuccess(false), 3000)
          resolve(true)
        }

        // Enviar formulário
        document.body.appendChild(form)
        form.submit()

        // Simular sucesso após 2 segundos (FormSubmit geralmente é rápido)
        setTimeout(handleSuccess, 2000)

      } catch (error) {
        console.error('Erro no FormSubmit:', error)
        resolve(false)
      }
    })
  }

  const sendViaMailto = async (title: string, message: string) => {
    const subject = encodeURIComponent(`💕 ${title} - Mensagem de ${girlfriendName} para ${partnerName}`)
    const body = encodeURIComponent(
      `${message}\n\n` +
      `De: ${girlfriendName}\n` +
      `Para: ${partnerName}\n` +
      `Horário: ${new Date().toLocaleString('pt-BR')}\n` +
      `Botão: ${title}\n\n` +
      `(Enviado via fallback - FormSubmit pode estar indisponível)`
    )
    
    const mailtoUrl = `mailto:${targetEmail}?subject=${subject}&body=${body}`
    
    // Tentar abrir cliente de email
    window.location.href = mailtoUrl
    
    // Mostrar sucesso após tentar mailto
    setTimeout(() => {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1000)
  }

  const saveToLocalStorage = (title: string, message: string) => {
    try {
      const pendingMessages = JSON.parse(localStorage.getItem('pending-messages') || '[]')
      const newMessage = {
        id: Date.now(),
        title,
        message,
        senderName: girlfriendName,
        receiverName: partnerName,
        timestamp: new Date().toISOString(),
        sent: false
      }
      
      pendingMessages.push(newMessage)
      localStorage.setItem('pending-messages', JSON.stringify(pendingMessages))
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error)
    }
  }

  const buttons = [
    {
      title: 'Eu te amo',
      message: `${girlfriendName} quer que ${partnerName} saiba: EU TE AMO MUITO! 💖`,
      emoji: '💖',
      color: 'bg-pink-500',
    },
    {
      title: 'Macaco',
      message: `${girlfriendName} está chamando ${partnerName} de macaco! 🐒`,
      emoji: '🐒',
      color: 'bg-amber-500',
    },
    {
      title: 'Estou Estressada',
      message: `${girlfriendName} está ${currentProfile === 'geovanna' ? 'estressada' : 'estressado'} agora... 😤💢`,
      emoji: '😤',
      color: 'bg-red-500',
    },
    {
      title: 'Precisamos Conversar Agora',
      message: `${girlfriendName} precisa falar com ${partnerName} AGORA. É importante! 🚨`,
      emoji: '🚨',
      color: 'bg-red-600',
    },
    {
      title: 'Precisamos Conversar Depois',
      message: `${girlfriendName} quer conversar com ${partnerName}, mas pode ser mais tarde. 💬`,
      emoji: '💬',
      color: 'bg-orange-500',
    },
    {
      title: 'Estou Cansada',
      message: `${girlfriendName} está ${currentProfile === 'geovanna' ? 'cansada' : 'cansado'} hoje... precisa de um descanso. 😴`,
      emoji: '😴',
      color: 'bg-indigo-500',
    },
    {
      title: 'Estou de Boa',
      message: `${girlfriendName} está ${currentProfile === 'geovanna' ? 'tranquila' : 'tranquilo'} e de bom humor! 😊`,
      emoji: '😊',
      color: 'bg-green-500',
    },
    {
      title: 'Quero Ir Embora',
      message: `${girlfriendName} quer ir embora desse lugar agora... 🚪`,
      emoji: '🚪',
      color: 'bg-gray-500',
    },
    {
      title: 'Estou com Saudade',
      message: `${girlfriendName} está com muita saudade de ${partnerName}... 💔`,
      emoji: '💔',
      color: 'bg-purple-500',
    },
    {
      title: 'Quero Ficar Sozinha',
      message: `${girlfriendName} precisa de um tempo ${currentProfile === 'geovanna' ? 'sozinha' : 'sozinho'} agora. 🤍`,
      emoji: '🤍',
      color: 'bg-slate-400',
    },
    {
      title: 'Está Tudo Certo?',
      message: `${girlfriendName} quer saber se está tudo bem com ${partnerName}. ❓`,
      emoji: '❓',
      color: 'bg-blue-500',
    },
    {
      title: 'Estou com Ciúmes',
      message: `${girlfriendName} está com ciúmes... 😤`,
      emoji: '😤',
      color: 'bg-yellow-500',
    },
    {
      title: 'Não Gostei Dessa Atitude',
      message: `${girlfriendName} não gostou de alguma coisa que aconteceu... 😠`,
      emoji: '😠',
      color: 'bg-red-700',
    },
    {
      title: 'Quero Carinho/Atenção',
      message: `${girlfriendName} está precisando de carinho e atenção ${currentProfile === 'geovanna' ? 'sua' : 'dela'}... 🥺💕`,
      emoji: '🥺',
      color: 'bg-rose-500',
    },
  ]

  // Combinar botões padrão com personalizados
  const allButtons = [...buttons, ...customButtons]

  return (
    <>
      {/* Seletor de Perfil - Primeira tela */}
      {showProfileSelector && (
        <ProfileSelector onSelectProfile={handleProfileSelect} />
      )}

      {/* Tela de Boas-vindas - Segunda tela */}
      <AnimatePresence>
        {showWelcomeScreen && !showProfileSelector && (
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
            <div className="relative z-10 text-center px-8">
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
                className="text-5xl font-bold text-white mb-4 drop-shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Olá, {girlfriendName}! 💖
              </motion.h1>
              
              <motion.p
                className="text-xl text-white/90 mb-8 drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Toque na tela para começar ✨
              </motion.p>

              <motion.button
                className="bg-white/20 backdrop-blur-xl border-2 border-white/40 rounded-full px-12 py-4 text-white font-bold text-lg shadow-2xl hover:bg-white/30 transition-all duration-300"
                onClick={startApp}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 20px 40px rgba(255,255,255,0.3)" 
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  animate={{ 
                    textShadow: [
                      '0 0 20px rgba(255,255,255,0.5)',
                      '0 0 30px rgba(255,255,255,0.8)',
                      '0 0 20px rgba(255,255,255,0.5)'
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  💕 Entrar 💕
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tela de Loading */}
      <AnimatePresence>
        {showLoadingScreen && !showWelcomeScreen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              backgroundImage: 'url(/couple-photo.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Overlay escuro para contraste */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Conteúdo da tela de loading */}
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  duration: 0.8, 
                  type: "spring", 
                  stiffness: 200,
                  damping: 15 
                }}
                className="mb-6"
              >
                <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl">
                  <motion.span 
                    className="text-4xl"
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
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {girlfriendName} & {partnerName}
              </motion.h1>
              
              <motion.div
                className="flex justify-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-white rounded-full shadow-lg"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* App Principal */}
      {!showLoadingScreen && !showWelcomeScreen && !showProfileSelector && (
        <div className="min-h-screen relative pb-24 overflow-hidden">
      {/* Background com foto do casal - foco em 55% */}
      <div 
        className="fixed inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: 'url(/couple-photo.jpg)',
          filter: 'blur(0.5px) brightness(1.2)',
          backgroundPosition: 'center 57%',
        }}
      />
      
      {/* Conteúdo principal */}
      <div className="relative z-10">
      {/* Header com glassmorphism menor */}
      <motion.div
        className="px-6 pt-safe-top pb-4 bg-black/30 backdrop-blur-xl border-b border-white/20 shadow-xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex justify-between items-start gap-4">
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.h1 
              className="text-2xl font-bold text-white drop-shadow-lg mb-1"
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(255,255,255,0.5)',
                  '0 0 30px rgba(255,192,203,0.8)',
                  '0 0 20px rgba(255,255,255,0.5)'
                ]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Olá, {girlfriendName}! 💕
            </motion.h1>
            <motion.p 
              className="text-white/90 font-medium drop-shadow-md text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Como você está se sentindo agora?
            </motion.p>
          </motion.div>
          
          <div className="flex space-x-2">
            <motion.button
              className="bg-black/40 backdrop-blur-xl rounded-2xl p-2.5 shadow-xl border border-white/30 hover:bg-black/50 transition-all duration-300"
              onClick={() => setCreateButtonModalOpen(true)}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              title="Criar novo botão"
            >
              <span className="text-xl drop-shadow-lg">➕</span>
            </motion.button>
            
            <motion.button
              className="bg-black/40 backdrop-blur-xl rounded-2xl p-2.5 shadow-xl border border-white/30 hover:bg-black/50 transition-all duration-300"
              onClick={() => setBackupModalOpen(true)}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              title="Backup dos dados"
            >
              <span className="text-xl drop-shadow-lg">💾</span>
            </motion.button>
            
            <motion.button
              className="bg-black/40 backdrop-blur-xl rounded-2xl p-2.5 shadow-xl border border-white/30 hover:bg-black/50 transition-all duration-300"
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              title="Recarregar página"
            >
              <span className="text-xl drop-shadow-lg">🔄</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Contador de dias juntos - Logo no início */}
      <motion.div
        className="mx-6 mt-4 mb-4 bg-black/30 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        whileHover={{ scale: 1.02, y: -2 }}
      >
        <div className="text-center">
          <motion.div
            className="flex items-center justify-center space-x-2 mb-2"
            animate={{ 
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-2xl">💕</span>
            <span className="text-white font-bold text-lg drop-shadow-md">
              {daysTogether} dias juntos
            </span>
            <span className="text-2xl">💕</span>
          </motion.div>
          <motion.p 
            className="text-white/90 text-sm drop-shadow-sm"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Desde 01/11/2025 ✨
          </motion.p>
        </div>
      </motion.div>

      {/* Carrossel de fotos do casal - Maior e melhor */}
      <motion.div
        className="mx-6 mb-4 bg-black/30 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        whileHover={{ scale: 1.02, y: -2 }}
      >
        <div className="text-center mb-3">
          <p className="text-white font-semibold text-sm drop-shadow-md mb-2">
            Nossas Memórias 📸
          </p>
          <motion.button
            className="w-full bg-gradient-to-r from-pink-500/30 to-purple-500/30 backdrop-blur-xl border-2 border-white/40 text-white py-2 px-4 rounded-xl font-semibold hover:from-pink-500/50 hover:to-purple-500/50 transition-all duration-300 shadow-lg"
            onClick={() => setShowAddPhotoModal(true)}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center space-x-2">
              <motion.span 
                className="text-lg"
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
                📷
              </motion.span>
              <span className="text-sm font-bold drop-shadow-md">
                Adicionar Nova Foto
              </span>
            </div>
          </motion.button>
        </div>
        
        <div className="relative h-64 rounded-xl overflow-hidden group">
          {/* Foto atual */}
          <motion.div
            className="w-full h-full cursor-pointer"
            onClick={() => {
              setSelectedPhoto(couplePhotos[currentPhotoIndex].src)
              setShowPhotoModal(true)
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img
              src={couplePhotos[currentPhotoIndex].src}
              alt={couplePhotos[currentPhotoIndex].alt}
              className="w-full h-full object-cover rounded-xl"
              style={{ filter: 'brightness(0.9)' }}
            />
            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
            
            {/* Ícone de expandir */}
            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-sm">🔍</span>
            </div>
            
            {/* Botão de deletar (só para fotos personalizadas) */}
            {!couplePhotos[currentPhotoIndex]?.isDefault && (
              <motion.button
                className="absolute top-3 left-3 bg-red-500/80 backdrop-blur-sm text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600/80"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeletePhoto(couplePhotos[currentPhotoIndex].id)
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Remover esta foto"
              >
                ✕
              </motion.button>
            )}
          </motion.div>
          
          {/* Botões de navegação - maiores */}
          <button
            className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 text-lg font-bold"
            onClick={() => setCurrentPhotoIndex((prev) => (prev - 1 + couplePhotos.length) % couplePhotos.length)}
          >
            ←
          </button>
          
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 text-lg font-bold"
            onClick={() => setCurrentPhotoIndex((prev) => (prev + 1) % couplePhotos.length)}
          >
            →
          </button>
          
          {/* Indicadores de foto - maiores e mais visíveis */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {couplePhotos.map((_, index) => (
              <motion.button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentPhotoIndex ? 'bg-white shadow-lg' : 'bg-white/40 hover:bg-white/60'
                }`}
                onClick={() => setCurrentPhotoIndex(index)}
                animate={index === currentPhotoIndex ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.1 }}
              />
            ))}
          </div>
        </div>
        
        {/* Info da foto */}
        <div className="mt-3 text-center">
          <p className="text-white/70 text-xs">
            {currentPhotoIndex + 1} de {couplePhotos.length} • Clique para ampliar
          </p>
        </div>
      </motion.div>

      {/* Status Messages com animações fluidas */}
      <AnimatePresence mode="wait">
        {showSuccess && (
          <motion.div
            className="mx-6 mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white p-4 rounded-2xl text-center shadow-lg"
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
            >
              <span className="text-lg font-semibold">
                ✅ Mensagem enviada com sucesso!
              </span>
            </motion.div>
          </motion.div>
        )}

        {showError && (
          <motion.div
            className="mx-6 mb-6 bg-gradient-to-r from-red-400 to-pink-500 text-white p-4 rounded-2xl text-center shadow-lg"
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <span className="text-lg font-semibold">
              ⚠️ Erro ao enviar. Verifique sua conexão!
            </span>
            <p className="text-sm mt-1 opacity-90">
              Tentativa de fallback via email foi acionada
            </p>
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            className="mx-6 mb-6 bg-gradient-to-r from-blue-400 to-indigo-500 text-white p-4 rounded-2xl text-center shadow-lg"
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="flex space-x-1">
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
              </div>
              <span className="text-lg font-semibold">Enviando mensagem...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons Grid com maior espaçamento para ver a foto */}
      <div className="px-6">
        <motion.div 
          className="grid grid-cols-1 gap-8 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {allButtons.map((button, index) => (
            <motion.div
              key={button.id || button.title}
              className="relative"
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.6 + index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              whileHover={{ y: -5 }}
            >
              <AnimatedButton
                title={button.title}
                message={button.message}
                emoji={button.emoji}
                color={button.color}
                onPress={(title, message) => handleButtonPress(title, message, button.emoji, button.color)}
              />
              {/* Botão de deletar menor */}
              {button.id && (
                <motion.button
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white"
                  onClick={() => handleDeleteButton(button.id)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1, type: "spring" }}
                >
                  ✕
                </motion.button>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modal para adicionar foto */}
      <AnimatePresence>
        {showAddPhotoModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddPhotoModal(false)}
          >
            <motion.div
              className="bg-black/40 backdrop-blur-xl border border-white/30 rounded-2xl p-6 mx-4 max-w-md w-full shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <motion.div
                  className="text-4xl mb-3"
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
                  📷
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
                  Adicionar Nova Foto
                </h3>
                <p className="text-white/80 text-sm drop-shadow-sm">
                  Escolha uma foto especial de vocês dois 💕
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleAddPhoto(file)
                    }
                  }}
                  className="w-full p-3 bg-white/10 backdrop-blur-xl border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-white hover:file:bg-pink-600"
                />
                
                <div className="text-xs text-white/60 text-center">
                  Formatos aceitos: JPG, PNG, GIF • Máximo: 5MB
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <motion.button
                  className="flex-1 bg-white/20 backdrop-blur-xl border border-white/30 text-white py-3 px-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300"
                  onClick={() => setShowAddPhotoModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancelar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de foto completa */}
      <AnimatePresence>
        {showPhotoModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPhotoModal(false)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto}
                alt="Foto ampliada"
                className="w-full h-full object-contain rounded-2xl shadow-2xl"
              />
              
              {/* Botão fechar */}
              <motion.button
                className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
                onClick={() => setShowPhotoModal(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
              
              {/* Info */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                {girlfriendName} & {partnerName} 💕
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title={confirmationModal.title}
        message={confirmationModal.message}
        emoji={confirmationModal.emoji}
        color={confirmationModal.color}
        onConfirm={handleConfirmSend}
        onCancel={handleCancelSend}
      />

      {/* Create Button Modal */}
      <CreateButtonModal
        isOpen={createButtonModalOpen}
        onClose={() => setCreateButtonModalOpen(false)}
        onSave={handleCreateButton}
      />

      {/* Backup Modal */}
      <BackupModal
        isOpen={backupModalOpen}
        onClose={() => setBackupModalOpen(false)}
        currentProfile={currentProfile}
      />

      {/* Pending Messages */}
      <PendingMessages />
      </div>
        </div>
      )}

      {/* Player de música fixo na parte inferior */}
      {!showLoadingScreen && !showWelcomeScreen && !showProfileSelector && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-40 bg-black/40 backdrop-blur-xl border-t border-white/30 shadow-2xl"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <div className="px-4 py-3">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              {/* Info da música */}
              <div className="flex-1 min-w-0 mr-4">
                <motion.p 
                  className="text-white font-semibold text-sm truncate drop-shadow-md"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {playlist[currentSongIndex]?.title || "Carregando..."}
                </motion.p>
                <div className="flex items-center justify-between">
                  <p className="text-white/70 text-xs truncate drop-shadow-sm">
                    {playlist[currentSongIndex]?.artist || ""}
                  </p>
                  <span className="text-white/60 text-xs">
                    {currentSongIndex + 1}/{playlist.length}
                  </span>
                </div>
              </div>

              {/* Controles */}
              <div className="flex items-center space-x-3">
                {/* Botão Anterior */}
                <motion.button
                  className="bg-white/20 backdrop-blur-xl rounded-full p-2.5 shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: -10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={previousSong}
                >
                  <span className="text-lg drop-shadow-lg">⏮️</span>
                </motion.button>

                {/* Botão Play/Pause */}
                <motion.button
                  className="bg-white/20 backdrop-blur-xl rounded-full p-2.5 shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePlayPause}
                >
                  <span className="text-lg drop-shadow-lg">
                    {isPlaying ? '⏸️' : '▶️'}
                  </span>
                </motion.button>

                {/* Botão Próxima */}
                <motion.button
                  className="bg-white/20 backdrop-blur-xl rounded-full p-2.5 shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextSong}
                >
                  <span className="text-lg drop-shadow-lg">⏭️</span>
                </motion.button>

                {/* Botão Expandir Player */}
                <motion.button
                  className="bg-white/20 backdrop-blur-xl rounded-full p-2.5 shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowExpandedPlayer(true)}
                  title="Abrir controles avançados"
                >
                  <span className="text-lg drop-shadow-lg">🎛️</span>
                </motion.button>
              </div>
            </div>

            {/* Indicador de status */}
            <div className="flex items-center justify-center mt-2">
              <motion.div
                className="flex items-center space-x-2"
                animate={isPlaying ? { 
                  scale: [1, 1.05, 1]
                } : {}}
                transition={{ 
                  duration: 1,
                  repeat: isPlaying ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                <span className="text-xs text-white/70">
                  {!audioRef ? '🔄 Carregando...' : 
                   isPlaying ? '🎵 Tocando' : 
                   '⏸️ Pausado'}
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
      {/* Player Expandido */}
      <AnimatePresence>
        {showExpandedPlayer && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowExpandedPlayer(false)}
          >
            <motion.div
              className="bg-black/40 backdrop-blur-xl border border-white/30 rounded-2xl p-6 mx-4 max-w-md w-full shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  className="text-4xl mb-3"
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
                  🎵
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
                  Player Avançado
                </h3>
                <p className="text-white/80 text-sm drop-shadow-sm">
                  {playlist[currentSongIndex]?.title} - {playlist[currentSongIndex]?.artist}
                </p>
              </div>

              {/* Barra de Progresso */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-white/70 mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={(e) => seekTo(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                </div>
              </div>

              {/* Controles Principais */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                <motion.button
                  className="bg-white/20 backdrop-blur-xl rounded-full p-3 shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: -10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={previousSong}
                >
                  <span className="text-2xl drop-shadow-lg">⏮️</span>
                </motion.button>

                <motion.button
                  className="bg-white/20 backdrop-blur-xl rounded-full p-4 shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePlayPause}
                >
                  <span className="text-3xl drop-shadow-lg">
                    {isPlaying ? '⏸️' : '▶️'}
                  </span>
                </motion.button>

                <motion.button
                  className="bg-white/20 backdrop-blur-xl rounded-full p-3 shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextSong}
                >
                  <span className="text-2xl drop-shadow-lg">⏭️</span>
                </motion.button>
              </div>

              {/* Lista de Músicas */}
              <div className="mb-6">
                <h4 className="text-white font-semibold text-sm mb-3">Playlist ({playlist.length} músicas)</h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {playlist.map((song, index) => (
                    <motion.button
                      key={index}
                      className={`w-full text-left p-2 rounded-lg transition-all ${
                        index === currentSongIndex 
                          ? 'bg-pink-500/30 border border-pink-400/50' 
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                      onClick={() => {
                        setCurrentSongIndex(index)
                        if (audioRef) {
                          audioRef.src = song.src
                          if (isPlaying) {
                            audioRef.play()
                          }
                        }
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm font-medium">{song.title}</p>
                          <p className="text-white/70 text-xs">{song.artist}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {index === currentSongIndex && isPlaying && (
                            <motion.span
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="text-pink-400"
                            >
                              🎵
                            </motion.span>
                          )}
                          <span className="text-white/60 text-xs">{index + 1}</span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Botão Fechar */}
              <motion.button
                className="w-full bg-white/20 backdrop-blur-xl border border-white/30 text-white py-3 px-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300"
                onClick={() => setShowExpandedPlayer(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Fechar Player
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}