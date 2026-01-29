import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, message, senderName, receiverName, targetEmail } = body

    // Método 1: EmailJS (gratuito, direto para email, sem confirmação)
    const emailJSResponse = await sendViaEmailJS({
      title,
      message,
      senderName,
      receiverName,
      targetEmail
    })

    if (emailJSResponse.success) {
      return NextResponse.json({ 
        success: true, 
        method: 'emailjs',
        message: 'Email enviado com sucesso!' 
      })
    }

    // Método 2: Resend (serviço de email moderno)
    const resendResponse = await sendViaResend({
      title,
      message,
      senderName,
      receiverName,
      targetEmail
    })

    if (resendResponse.success) {
      return NextResponse.json({ 
        success: true, 
        method: 'resend',
        message: 'Email enviado via Resend!' 
      })
    }

    // Método 3: Fallback para FormSubmit
    return NextResponse.json({ 
      success: false, 
      method: 'formsubmit',
      message: 'Usando FormSubmit como fallback',
      targetEmail
    })

  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

// EmailJS - GRATUITO, DIRETO PARA EMAIL, SEM CONFIRMAÇÃO
async function sendViaEmailJS({ title, message, senderName, receiverName, targetEmail }: {
  title: string
  message: string
  senderName: string
  receiverName: string
  targetEmail: string
}) {
  try {
    const SERVICE_ID = process.env.EMAILJS_SERVICE_ID
    const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID
    const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY
    const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY
    
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY || !PRIVATE_KEY) {
      console.log('EmailJS não configurado - variáveis de ambiente ausentes')
      return { success: false }
    }

    const emailData = {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      accessToken: PRIVATE_KEY,
      template_params: {
        to_email: targetEmail,
        subject: `💕 ${title} - Mensagem de ${senderName} para ${receiverName}`,
        message: message,
        from_name: senderName,
        to_name: receiverName,
        button_name: title,
        timestamp: new Date().toLocaleString('pt-BR'),
        // Template HTML bonito
        html_message: createEmailTemplate(title, message, senderName, receiverName)
      }
    }

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify(emailData)
    })

    return { success: response.ok }
    
  } catch (error) {
    console.error('Erro no EmailJS:', error)
    return { success: false }
  }
}

// Resend - SERVIÇO DE EMAIL MODERNO (100 emails grátis por dia)
async function sendViaResend({ title, message, senderName, receiverName, targetEmail }: {
  title: string
  message: string
  senderName: string
  receiverName: string
  targetEmail: string
}) {
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    
    if (!RESEND_API_KEY) {
      console.log('Resend não configurado')
      return { success: false }
    }

    const emailData = {
      from: 'App Geovanna & Gustavo <noreply@resend.dev>',
      to: [targetEmail],
      subject: `💕 ${title} - Mensagem de ${senderName} para ${receiverName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">💕 ${title}</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 15px; margin-top: 20px;">
            <div style="background: white; padding: 25px; border-radius: 10px; border-left: 4px solid #667eea;">
              <p style="font-size: 18px; margin: 0; color: #333;">${message}</p>
            </div>
            
            <div style="margin-top: 25px; padding: 20px; background: #e3f2fd; border-radius: 10px;">
              <p style="margin: 5px 0; color: #666;"><strong>De:</strong> ${senderName}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Para:</strong> ${receiverName}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Horário:</strong> ${new Date().toLocaleString('pt-BR')}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Botão:</strong> ${title}</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
            <p>Enviado pelo App Geovanna & Gustavo 💕</p>
          </div>
        </div>
      `
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })

    return { success: response.ok }
    
  } catch (error) {
    console.error('Erro no Resend:', error)
    return { success: false }
  }
}

// Função para criar template de email bonito
function createEmailTemplate(title: string, message: string, senderName: string, receiverName: string): string {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; border-radius: 15px 15px 0 0;">
        <div style="background: rgba(255,255,255,0.2); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 40px;">
          💕
        </div>
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
          ${title}
        </h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">
          Nova mensagem de ${senderName}
        </p>
      </div>
      
      <!-- Content -->
      <div style="background: white; padding: 40px 30px;">
        <!-- Message -->
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 25px; border-radius: 15px; margin-bottom: 30px; position: relative;">
          <div style="position: absolute; top: -10px; left: 30px; width: 0; height: 0; border-left: 15px solid transparent; border-right: 15px solid transparent; border-bottom: 15px solid #f093fb;"></div>
          <p style="color: white; margin: 0; font-size: 18px; line-height: 1.6; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">
            ${message}
          </p>
        </div>
        
        <!-- Details -->
        <div style="background: #f8f9fa; padding: 25px; border-radius: 15px; border-left: 5px solid #667eea;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <div>
              <p style="margin: 0; color: #666; font-size: 14px; font-weight: bold;">DE:</p>
              <p style="margin: 5px 0 0; color: #333; font-size: 16px;">${senderName}</p>
            </div>
            <div>
              <p style="margin: 0; color: #666; font-size: 14px; font-weight: bold;">PARA:</p>
              <p style="margin: 5px 0 0; color: #333; font-size: 16px;">${receiverName}</p>
            </div>
          </div>
          <div style="border-top: 1px solid #e9ecef; padding-top: 15px;">
            <p style="margin: 0; color: #666; font-size: 14px; font-weight: bold;">HORÁRIO:</p>
            <p style="margin: 5px 0 0; color: #333; font-size: 16px;">${new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background: #667eea; padding: 25px 30px; text-align: center; border-radius: 0 0 15px 15px;">
        <p style="color: white; margin: 0; font-size: 14px; opacity: 0.9;">
          💕 Enviado pelo App Geovanna & Gustavo 💕
        </p>
        <p style="color: rgba(255,255,255,0.7); margin: 5px 0 0; font-size: 12px;">
          Mensagem enviada automaticamente
        </p>
      </div>
    </div>
  `
}