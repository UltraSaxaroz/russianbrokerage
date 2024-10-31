import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest): Promise<NextResponse> {
    const { email } = await request.json();
    const client = await clientPromise;
    const db = client.db();

    // Проверка, существует ли пользователь с таким email
    const user = await db.collection('users').findOne({ email });
    if (!user) {
        return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    // Генерация временного JWT токена для сброса пароля (15 минут)
    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET!, { expiresIn: '15m' });

    // Настройка транспондера для отправки email через Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Используем Gmail
        auth: {
            user: process.env.EMAIL_USER, // Ваш email
            pass: process.env.EMAIL_PASS, // Ваш пароль или приложение пароль
        },
    });

    // Отправка email с токеном для сброса пароля
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Password Reset Request',
        text: `To reset your password, click the link: https://your-domain.com/reset-password?token=${token}`,
    });

    return new NextResponse(JSON.stringify({ message: 'Reset link sent to email' }), { status: 200 });
}
