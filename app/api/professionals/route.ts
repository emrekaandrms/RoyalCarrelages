import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

type EmailPayload = {
  html: string;
  replyTo: string;
  subject: string;
  recipients: string[];
};

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const DEFAULT_RECIPIENTS = ['info@royalcarrelages.fr'];

export async function POST(req: NextRequest) {
  try {
    const { company, contact, email, phone, activity, siret, message } = await req.json();

    if (!company || !contact || !email || !phone || !activity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const recipients = resolveRecipients();
    if (!recipients.length) {
      return NextResponse.json({ error: 'No recipients configured' }, { status: 500 });
    }

    const subject = `[Professionals] Nouvelle demande - ${company}`;
    const html = buildHtmlBody({ company, contact, email, phone, activity, siret, message });
    const payload: EmailPayload = {
      recipients,
      subject,
      html,
      replyTo: email,
    };

    const resendResult = await trySendViaResend(payload);
    if (resendResult.success) {
      return NextResponse.json({ ok: true, via: 'resend' });
    }

    const smtpResult = await trySendViaSmtp(payload);
    if (smtpResult.success) {
      return NextResponse.json({ ok: true, via: 'smtp' });
    }

    const errorMessage = smtpResult.reason === 'missing-config'
      ? 'Email is not configured'
      : 'Unable to send email';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } catch (error) {
    console.error('Professionals email error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function resolveRecipients() {
  const raw =
    process.env.PROFESSIONALS_TO_EMAILS ||
    process.env.PROFESSIONALS_TO_EMAIL ||
    '';

  const list = raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (list.length) {
    return list;
  }

  return DEFAULT_RECIPIENTS;
}

function buildHtmlBody({
  company,
  contact,
  email,
  phone,
  activity,
  siret,
  message,
}: {
  company: string;
  contact: string;
  email: string;
  phone: string;
  activity: string;
  siret?: string;
  message?: string;
}) {
  return `
    <h2>Nouvelle demande professionnelle</h2>
    <p><strong>Entreprise:</strong> ${company}</p>
    <p><strong>Contact:</strong> ${contact}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Téléphone:</strong> ${phone}</p>
    <p><strong>Secteur d'activité:</strong> ${activity}</p>
    ${siret ? `<p><strong>Numéro SIRET:</strong> ${siret}</p>` : ''}
    ${message ? `<p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br/>')}</p>` : ''}
  `;
}

async function trySendViaResend(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY || process.env.RESEND_TOKEN;
  if (!apiKey) {
    return { success: false, skipped: true as const };
  }

  const fromEmail =
    process.env.RESEND_FROM_EMAIL ||
    process.env.SMTP_USER ||
    'no-reply@royalcarrelages.fr';

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Royal Carrelages <${fromEmail}>`,
        to: payload.recipients,
        subject: payload.subject,
        html: payload.html,
        reply_to: payload.replyTo,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('Resend send error', response.status, body);
      return { success: false, skipped: false as const };
    }

    return { success: true as const, skipped: false as const };
  } catch (error) {
    console.error('Resend request error', error);
    return { success: false, skipped: false as const };
  }
}

async function trySendViaSmtp(payload: EmailPayload) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return { success: false, reason: 'missing-config' as const };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: `Royal Carrelages <${smtpUser}>`,
      to: payload.recipients.join(', '),
      subject: payload.subject,
      replyTo: payload.replyTo,
      html: payload.html,
    });

    return { success: true as const };
  } catch (error) {
    console.error('SMTP send error', error);
    return { success: false, reason: 'send-error' as const };
  }
}

