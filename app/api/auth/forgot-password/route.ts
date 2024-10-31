// app/api/auth/forgot-password/route.ts
import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest): Promise<NextResponse> {
    const { email } = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection('users').findOne({ email });

    if (!user) {
        return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Генерация токена для сброса пароля
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    // Создание URL для сброса пароля
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${token}`;

    // Настройки почтового сервиса
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_USER,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: process.env.GOOGLE_ACCESS_TOKEN, // Если необходимо
        },
    });

    // Сообщение
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Password Reset',
        text: `To reset your password, please click on the following link: ${resetUrl}`,
    };

    // Отправка почты
    try {
        await transporter.sendMail(mailOptions);
        return new NextResponse(JSON.stringify({ message: 'Password reset link sent' }), { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return new NextResponse(JSON.stringify({ message: 'Error sending email' }), { status: 500 });
    }
}
