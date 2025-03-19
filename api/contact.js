const MAX_MONTHLY_EMAILS = 100;
let emailCounter = 0;
let lastReset = new Date().getMonth();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const currentMonth = new Date().getMonth();
    if (currentMonth !== lastReset) {
        emailCounter = 0;
        lastReset = currentMonth;
    }

    if (emailCounter >= MAX_MONTHLY_EMAILS) {
        return res.status(429).json({
            error: 'Monthly email limit reached. Please try again next month.'
        });
    }

    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const nodemailer = require('nodemailer');

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'marcrarescristian@gmail.com',
            replyTo: email,
            subject: `Portfolio Contact: ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
          <h2>New message from your portfolio website</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <h3>Message:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
        };

        await transporter.sendMail(mailOptions);

        emailCounter++;

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Email error:', error);
        return res.status(500).json({ error: 'Failed to send email' });
    }
}