# 📧 Email Setup Guide - Gmail SMTP

This guide will help you set up Gmail SMTP to send staff account credentials automatically when creating new users.

## 🚀 Quick Setup

### 1. Enable 2-Factor Authentication on Gmail

First, you need to enable 2-Factor Authentication on your Gmail account:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click on "2-Step Verification"
3. Follow the setup process

### 2. Generate App Password

After enabling 2FA, generate an App Password:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click on "App passwords" (under 2-Step Verification)
3. Select "Mail" as the app
4. Select "Other" as the device
5. Enter a name like "Optique App Admin"
6. Click "Generate"
7. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

### 3. Add Environment Variables

Add these variables to your `.env` file:

```env
# Email Service Configuration
GMAIL_USER=your.email@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
APP_NAME=Optique App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important Notes:**
- Use your **full Gmail address** (e.g., `john.doe@gmail.com`)
- Use the **App Password**, NOT your regular Gmail password
- Remove spaces from the App Password if they appear
- For production, use your actual domain URL

### 4. Test the Setup

1. Start your development server: `npm run dev`
2. Go to `/admin/users/new`
3. Create a new staff account
4. Check your console for email success logs
5. Check the recipient's email inbox

## 🔧 How It Works

### Email Flow
1. Admin creates new staff account
2. System generates secure password
3. Email sent via Gmail SMTP
4. Staff receives professional email with credentials
5. Staff can login and change password

### Email Features
- ✅ **Professional HTML template** with your branding
- ✅ **Secure credential delivery** via Gmail
- ✅ **Responsive design** for all devices
- ✅ **Security warnings** about password changes
- ✅ **Fallback text version** for email clients
- ✅ **Error handling** if email fails

## 🛡️ Security Features

### Gmail Security
- Uses **App Passwords** (not regular passwords)
- **2FA required** for App Password generation
- **Secure SMTP connection** with TLS
- **Rate limiting** to prevent abuse

### Email Security
- **No password logging** in system logs
- **Secure credential delivery** via email
- **Professional appearance** to avoid spam filters
- **Clear security instructions** for recipients

## 🚨 Troubleshooting

### Common Issues

#### "Gmail credentials not configured"
- Check your `.env` file has `GMAIL_USER` and `GMAIL_APP_PASSWORD`
- Restart your development server after adding variables

#### "Authentication failed"
- Verify your Gmail address is correct
- Ensure you're using the App Password, not regular password
- Check that 2FA is enabled on your Gmail account

#### "Email not received"
- Check spam/junk folder
- Verify recipient email address is correct
- Check console logs for email success/failure
- Ensure Gmail account has sending permissions

#### "Rate limit exceeded"
- Gmail has daily sending limits
- Wait 24 hours or use multiple Gmail accounts
- Consider upgrading to Gmail Workspace for higher limits

### Debug Mode

To see detailed email logs, check your console for:
```
📧 Email sent successfully: {
  messageId: "abc123...",
  to: "staff@example.com",
  name: "John Doe",
  role: "staff"
}
```

## 🌐 Production Deployment

### Environment Variables
For production, ensure these are set:
```env
GMAIL_USER=admin@yourdomain.com
GMAIL_APP_PASSWORD=your-app-password
APP_NAME=Your Company Name
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Gmail Limits
- **Free Gmail**: 500 emails/day
- **Gmail Workspace**: 2000 emails/day
- **Custom domain**: Higher limits available

### Alternative Email Services
If you need higher limits, consider:
- **SendGrid**: 100 emails/day free, then pay-per-use
- **AWS SES**: Very cost-effective for high volume
- **Mailgun**: Developer-friendly, good free tier

## 📱 Email Template Customization

The email template is located in:
```
src/lib/shared/services/emailService.ts
```

You can customize:
- Colors and styling
- Company branding
- Security messages
- Button appearance
- Footer information

## ✅ Verification Checklist

- [ ] 2-Factor Authentication enabled on Gmail
- [ ] App Password generated and copied
- [ ] Environment variables added to `.env`
- [ ] Development server restarted
- [ ] Test email sent successfully
- [ ] Email received in inbox
- [ ] Console shows success logs

## 🆘 Need Help?

If you encounter issues:

1. **Check console logs** for error messages
2. **Verify environment variables** are set correctly
3. **Test Gmail credentials** manually
4. **Check Gmail security settings**
5. **Review troubleshooting section** above

## 🔄 Next Steps

After email setup is working:

1. **Test user creation** with real email addresses
2. **Customize email template** with your branding
3. **Set up production environment** variables
4. **Monitor email delivery** and success rates
5. **Consider email analytics** for production use

---

**Happy emailing! 🎉**
