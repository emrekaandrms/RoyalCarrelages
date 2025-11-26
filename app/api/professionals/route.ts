import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { company, contact, email, phone, activity, siret, message } = await req.json();

    if (!company || !contact || !email || !phone || !activity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const recipientsEnv =
      process.env.PROFESSIONALS_TO_EMAILS ||
      process.env.PROFESSIONALS_TO_EMAIL ||
      '';
    const recipients = recipientsEnv
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    const fallbackRecipients = ['info@royalcarrelages.fr', 'emrekaandrms@gmail.com'];
    const toList = recipients.length ? recipients : fallbackRecipients;

    if (!smtpHost || !smtpUser || !smtpPass || !toList.length) {
      return NextResponse.json({ error: 'Email is not configured' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const html = `
      <h2>Nouvelle demande professionnelle</h2>
      <p><strong>Entreprise:</strong> ${company}</p>
      <p><strong>Contact:</strong> ${contact}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Téléphone:</strong> ${phone}</p>
      <p><strong>Secteur d'activité:</strong> ${activity}</p>
      ${siret ? `<p><strong>Numéro SIRET:</strong> ${siret}</p>` : ''}
      ${message ? `<p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br/>')}</p>` : ''}
    `;

    await transporter.sendMail({
      from: `Professionals Form <${smtpUser}>`,
      to: toList.join(', '),
      subject: `[Professionals] Nouvelle demande - ${company}`,
      replyTo: email,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Professionals email error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

