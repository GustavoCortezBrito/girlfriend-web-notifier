# 📧 Configuração para Email SEM Confirmação

## ✅ Opção Mais Fácil: EmailJS

### Passo 1: Criar Conta
1. Vá para [https://www.emailjs.com/](https://www.emailjs.com/)
2. Clique em "Sign Up" e crie uma conta gratuita
3. Confirme seu email

### Passo 2: Conectar seu Email
1. No painel, clique em "Email Services"
2. Clique em "Add New Service"
3. Escolha seu provedor (Gmail, Outlook, Yahoo, etc.)
4. Siga as instruções para conectar sua conta
5. **Anote o Service ID** (ex: `service_abc123`)

### Passo 3: Criar Template
1. Clique em "Email Templates"
2. Clique em "Create New Template"
3. Configure o template:
   - **To Email**: `{{to_email}}`
   - **Subject**: `{{subject}}`
   - **Content**: 
   ```
   Olá!
   
   {{message}}
   
   De: {{from_name}}
   Para: {{to_name}}
   Botão: {{button_name}}
   Horário: {{timestamp}}
   
   Enviado pelo App Geovanna & Gustavo 💕
   ```
4. **Anote o Template ID** (ex: `template_xyz789`)

### Passo 4: Pegar as Chaves
1. Vá em "Account" > "General"
2. **Anote a Public Key** (ex: `abc123def456`)
3. **Anote a Private Key** (ex: `xyz789uvw012`)

### Passo 5: Configurar no Projeto
1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione as linhas:
```
EMAILJS_SERVICE_ID=service_abc123
EMAILJS_TEMPLATE_ID=template_xyz789
EMAILJS_PUBLIC_KEY=abc123def456
EMAILJS_PRIVATE_KEY=xyz789uvw012
```

### Passo 6: Deploy na Vercel
1. Na Vercel, vá em Settings > Environment Variables
2. Adicione as 4 variáveis acima

## 🎯 Como Funciona

- **Sem confirmação**: Emails chegam direto na caixa de entrada
- **Gratuito**: 200 emails por mês grátis
- **Confiável**: EmailJS é usado por milhares de sites
- **Seu próprio email**: Emails vêm do SEU email pessoal

## 📧 Resultado

Quando alguém clicar em um botão, você receberá um email assim:

**Assunto**: `💕 Eu te amo - Mensagem de Geovanna para Gustavo`

**Conteúdo**:
```
Olá!

Geovanna quer que Gustavo saiba: EU TE AMO MUITO! 💖

De: Geovanna
Para: Gustavo
Botão: Eu te amo
Horário: 29/01/2026 14:30:25

Enviado pelo App Geovanna & Gustavo 💕
```

## 🔄 Alternativa: Resend

Se preferir, pode usar o [Resend](https://resend.com/):
- 100 emails grátis por dia
- Mais moderno que EmailJS
- Emails com design bonito (HTML)

---

**Tempo total de configuração: ~10 minutos** ⏱️
**Limite gratuito**: 200 emails/mês (EmailJS) ou 100/dia (Resend)