# ⚡ Guia Rápido - EmailJS (5 minutos)

## 🎯 Resultado Final
Emails bonitos chegam direto no `Gecesco94@gmail.com` **sem confirmação**!

## 📋 Passo a Passo

### 1. Criar Conta (2 min)
- Vá em: https://www.emailjs.com/
- Clique "Sign Up" → Use seu Gmail
- Confirme o email

### 2. Conectar Gmail (1 min)
- Painel → "Email Services" → "Add New Service"
- Escolha "Gmail" 
- Faça login com sua conta Gmail
- **Copie o Service ID** (ex: `service_abc123`)

### 3. Criar Template (1 min)
- "Email Templates" → "Create New Template"
- **Subject**: `{{subject}}`
- **Content**: Cole isso:
```
{{html_message}}
```
- Salve e **copie o Template ID** (ex: `template_xyz789`)

### 4. Pegar Chaves (30 seg)
- "Account" → "General"
- **Copie Public Key** (ex: `abc123def456`)
- **Copie Private Key** (ex: `xyz789uvw012`)

### 5. Configurar Vercel (30 seg)
Na Vercel → Settings → Environment Variables:
```
EMAILJS_SERVICE_ID = service_abc123
EMAILJS_TEMPLATE_ID = template_xyz789  
EMAILJS_PUBLIC_KEY = abc123def456
EMAILJS_PRIVATE_KEY = xyz789uvw012
```

## ✅ Pronto!

Agora quando alguém clicar em "Eu te amo", você recebe um email lindo assim:

![Email bonito com gradiente rosa/roxo, ícone de coração, mensagem destacada e detalhes organizados]

**Sem confirmação, sem spam, direto na caixa de entrada!** 📧💕

---
**Limite**: 200 emails/mês grátis (mais que suficiente!)