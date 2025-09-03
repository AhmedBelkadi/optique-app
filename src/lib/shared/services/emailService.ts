import { logError } from '@/lib/errorHandling';
import nodemailer from 'nodemailer';

export interface EmailCredentials {
  to: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface ContactMessageData {
  name: string;
  phone: string;
  email?: string;
  message: string;
}

export interface EmailResult {
  success: boolean;
  error?: string;
}

// Create Gmail transporter
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
    },
  });
}

export async function sendUserCredentialsEmail(credentials: EmailCredentials): Promise<EmailResult> {
  try {
    // Check if Gmail credentials are configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      logError(new Error('Gmail credentials not configured'), {
        action: 'sendUserCredentialsEmail',
        step: 'configuration',
        message: 'GMAIL_USER and GMAIL_APP_PASSWORD environment variables are required',
      });
      
      return {
        success: false,
        error: 'Service d\'email non configuré. Veuillez contacter l\'administrateur.',
      };
    }

    const transporter = createTransporter();
    const emailContent = generateEmailContent(credentials);

    // Send email
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'Optique App'} - Administration" <${process.env.GMAIL_USER}>`,
      to: credentials.to,
      subject: 'Vos Identifiants de Compte Personnel - Bienvenue dans l\'Équipe !',
      html: emailContent.html,
      text: emailContent.text,
    };

    const info = await transporter.sendMail(mailOptions);

    // Log success
    console.log('📧 Email envoyé avec succès :', {
      messageId: info.messageId,
      to: credentials.to,
      name: credentials.name,
      role: credentials.role,
      // Don't log the password
    });

    return {
      success: true,
    };
  } catch (error) {
    // Log the error
    logError(error as Error, {
      action: 'sendUserCredentialsEmail',
      step: 'sending',
      credentials: {
        to: credentials.to,
        name: credentials.name,
        email: credentials.email,
        role: credentials.role,
        // Don't log the password
      }
    });
    
    return {
      success: false,
      error: 'Échec de l\'envoi de l\'email avec les identifiants. Veuillez contacter l\'administrateur.',
    };
  }
}

function generateEmailContent(credentials: EmailCredentials) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Vos Identifiants de Compte Personnel</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f8f9fa;
          margin: 0;
          padding: 20px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header { 
          background: linear-gradient(135deg, #2D8B9C 0%, #4A90A2 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 30px 20px;
        }
        .credentials { 
          background: #fff3cd; 
          border: 1px solid #ffeaa7; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0;
          border-left: 4px solid #ffc107;
        }
        .warning { 
          background: #f8d7da; 
          border: 1px solid #f5c6cb; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0;
          border-left: 4px solid #dc3545;
        }
        .button { 
          display: inline-block; 
          background: linear-gradient(135deg, #2D8B9C 0%, #4A90A2 100%);
          color: white; 
          padding: 14px 28px; 
          text-decoration: none; 
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
          transition: all 0.3s ease;
        }
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(45, 139, 156, 0.4);
        }
        .footer { 
          margin-top: 30px; 
          padding-top: 20px; 
          border-top: 1px solid #eee; 
          font-size: 14px; 
          color: #666;
          text-align: center;
        }
        .credential-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #ffeaa7;
        }
        .credential-item:last-child {
          border-bottom: none;
        }
        .credential-label {
          font-weight: 600;
          color: #856404;
        }
        .credential-value {
          font-family: 'Courier New', monospace;
          background: #fff;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #ffeaa7;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Bienvenue dans Notre Équipe !</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Votre compte personnel a été créé avec succès</p>
        </div>
        
        <div class="content">
          <p>Bonjour <strong>${credentials.name}</strong>,</p>
          
          <p>Nous sommes ravis de vous accueillir dans notre équipe ! Votre compte personnel a été créé et vous pouvez maintenant accéder à notre panneau d'administration.</p>
          
          <div class="credentials">
            <h3 style="margin-top: 0; color: #856404;">🔑 Identifiants de Connexion</h3>
            <div class="credential-item">
              <span class="credential-label">Email :</span>
              <span class="credential-value">${credentials.email}</span>
            </div>
            <div class="credential-item">
              <span class="credential-label">Mot de passe :</span>
              <span class="credential-value">${credentials.password}</span>
            </div>
            <div class="credential-item">
              <span class="credential-label">Rôle :</span>
              <span class="credential-value">${credentials.role}</span>
            </div>
          </div>
          
          <div class="warning">
            <h4 style="margin-top: 0; color: #721c24;">⚠️ Avis de Sécurité Important</h4>
            <p style="margin-bottom: 0; color: #721c24;">
              Pour votre sécurité, veuillez changer votre mot de passe immédiatement après votre première connexion. 
              Ce mot de passe temporaire ne doit être partagé avec personne.
            </p>
          </div>
          
          <p>Vous pouvez maintenant accéder au panneau d'administration avec ces identifiants :</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/login" class="button">
              🚀 Se Connecter au Panneau d'Administration
            </a>
          </div>
          
          <p style="margin-bottom: 0;">
            Si vous avez des questions ou besoin d'assistance, n'hésitez pas à contacter votre administrateur système.
          </p>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">Ceci est un message automatisé. Veuillez ne pas y répondre.</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.7;">
            Envoyé depuis ${process.env.APP_NAME || 'Optique App'} - Système d'Administration
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
🎉 Bienvenue dans Notre Équipe !

Bonjour ${credentials.name},

Nous sommes ravis de vous accueillir dans notre équipe ! Votre compte personnel a été créé avec succès et vous pouvez maintenant accéder à notre panneau d'administration.

🔑 IDENTIFIANTS DE CONNEXION :
Email : ${credentials.email}
Mot de passe : ${credentials.password}
Rôle : ${credentials.role}

⚠️ AVIS DE SÉCURITÉ IMPORTANT :
Pour votre sécurité, veuillez changer votre mot de passe immédiatement après votre première connexion. 
Ce mot de passe temporaire ne doit être partagé avec personne.

Vous pouvez maintenant accéder au panneau d'administration avec ces identifiants :

URL de connexion : ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/login

Si vous avez des questions ou besoin d'assistance, n'hésitez pas à contacter votre administrateur système.

---
Ceci est un message automatisé. Veuillez ne pas y répondre.
Envoyé depuis ${process.env.APP_NAME || 'Optique App'} - Système d'Administration
  `;
  
  return { html, text };
}

export async function sendContactMessageEmail(contactData: ContactMessageData): Promise<EmailResult> {
  try {
    // Check if Gmail credentials are configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      logError(new Error('Gmail credentials not configured'), {
        action: 'sendContactMessageEmail',
        step: 'configuration',
        message: 'GMAIL_USER and GMAIL_APP_PASSWORD environment variables are required',
      });
      
      return {
        success: false,
        error: 'Service d\'email non configuré. Veuillez contacter l\'administrateur.',
      };
    }

    // Get admin contact email from environment or use default
    const adminEmail = process.env.ADMIN_CONTACT_EMAIL || process.env.GMAIL_USER;
    
    const transporter = createTransporter();
    const emailContent = generateContactEmailContent(contactData);

    // Send email to admin
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'Optique App'} Contact Form" <${process.env.GMAIL_USER}>`,
      to: adminEmail,
      subject: `Nouveau message de contact de ${contactData.name}`,
      html: emailContent.html,
      text: emailContent.text,
      replyTo: contactData.email || process.env.GMAIL_USER, // Allow admin to reply directly to customer
    };

    const info = await transporter.sendMail(mailOptions);

    // Log success
    console.log('📧 Message de contact envoyé avec succès :', {
      messageId: info.messageId,
      to: adminEmail,
      from: contactData.name,
      phone: contactData.phone,
      email: contactData.email || 'Aucun email fourni',
    });

    return {
      success: true,
    };
  } catch (error) {
    // Log the error
    logError(error as Error, {
      action: 'sendContactMessageEmail',
      step: 'sending',
      contactData: {
        name: contactData.name,
        phone: contactData.phone,
        email: contactData.email,
        messageLength: contactData.message.length,
      }
    });
    
    return {
      success: false,
      error: 'Échec de l\'envoi du message de contact. Veuillez réessayer plus tard.',
    };
  }
}

function generateContactEmailContent(contactData: ContactMessageData) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouveau Message de Contact</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f8f9fa;
          margin: 0;
          padding: 20px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header { 
          background: linear-gradient(135deg, #2D8B9C 0%, #4A90A2 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 30px 20px;
        }
        .message-box { 
          background: #f8f9fa; 
          border: 1px solid #e9ecef; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0;
          border-left: 4px solid #2D8B9C;
        }
        .contact-info { 
          background: #e3f2fd; 
          border: 1px solid #bbdefb; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0;
          border-left: 4px solid #2196f3;
        }
        .footer { 
          margin-top: 30px; 
          padding-top: 20px; 
          border-top: 1px solid #eee; 
          font-size: 14px; 
          color: #666; 
          text-align: center; 
        }
        .contact-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #bbdefb;
        }
        .contact-item:last-child {
          border-bottom: none;
        }
        .contact-label {
          font-weight: 600;
          color: #1976d2;
        }
        .contact-value {
          font-weight: 500;
          color: #333;
        }
        .message-text {
          background: #fff;
          padding: 15px;
          border-radius: 6px;
          border: 1px solid #e9ecef;
          font-style: italic;
          color: #495057;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 Nouveau Message de Contact</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Un nouveau message a été reçu via le formulaire de contact</p>
        </div>
        
        <div class="content">
          <p>Bonjour,</p>
          
          <p>Un nouveau message de contact a été reçu sur votre site web. Voici les détails :</p>
          
          <div class="contact-info">
            <h3 style="margin-top: 0; color: #1976d2;">👤 Informations de Contact</h3>
            <div class="contact-item">
              <span class="contact-label">Nom :</span>
              <span class="contact-value">${contactData.name}</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">Téléphone :</span>
              <span class="contact-value">${contactData.phone}</span>
            </div>
            ${contactData.email ? `
            <div class="contact-item">
              <span class="contact-label">Email :</span>
              <span class="contact-value">${contactData.email}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="message-box">
            <h3 style="margin-top: 0; color: #2D8B9C;">💬 Message</h3>
            <div class="message-text">
              ${contactData.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <p style="margin-bottom: 0;">
            <strong>Heure de réception :</strong> ${new Date().toLocaleString('fr-FR', { 
              timeZone: 'Europe/Paris',
              year: 'numeric', 
              month: 'long', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">Ce message a été envoyé automatiquement depuis le formulaire de contact de votre site web.</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.7;">
            ${process.env.APP_NAME || 'Optique App'} - Système de Contact
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
📧 Nouveau Message de Contact

Bonjour,

Un nouveau message de contact a été reçu sur votre site web. Voici les détails :

👤 INFORMATIONS DE CONTACT:
Nom: ${contactData.name}
Téléphone: ${contactData.phone}
${contactData.email ? `Email: ${contactData.email}` : ''}

💬 MESSAGE:
${contactData.message}

Heure de réception: ${new Date().toLocaleString('fr-FR', { 
  timeZone: 'Europe/Paris',
  year: 'numeric', 
  month: 'long', 
  day: 'numeric', 
  hour: '2-digit', 
  minute: '2-digit' 
})}

---
Ce message a été envoyé automatiquement depuis le formulaire de contact de votre site web.
${process.env.APP_NAME || 'Optique App'} - Système de Contact
  `;
  
  return { html, text };
}
