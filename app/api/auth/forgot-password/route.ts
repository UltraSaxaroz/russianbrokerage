import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
    const { email } = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection('users').findOne({ email });

    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

    const msg = {
        to: email,
        from: 'rodrigovalladarez31@gmail.com', // Замените на ваш верифицированный email в SendGrid
        subject: 'Сброс пароля',
        text: `Для сброса пароля перейдите по ссылке: ${resetLink}`,
        html: `
      <p>Вы запросили сброс пароля.</p>
      <p>Для установки нового пароля перейдите по следующей ссылке:</p>
      <a href="${resetLink}">Сбросить пароль</a>
      <p>Эта ссылка действительна в течение 1 часа.</p>
    `,
    };

    try {
        await sgMail.send(msg);
        return NextResponse.json({ message: 'Инструкции по сбросу пароля отправлены на вашу почту' });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ message: 'Ошибка при отправке email' }, { status: 500 });
    }
}