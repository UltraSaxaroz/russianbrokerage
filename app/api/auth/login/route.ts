// @ts-expect-error nigha
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
    const { email, password } = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection('users').findOne({ email });

    if (!user) {
        return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 401 });
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
        return new NextResponse(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '240h' }
    );

    // Получаем IP-адрес пользователя
    const userIp = request.headers.get('x-forwarded-for') || request.ip || 'Unknown';

    // Пример сохранения IP-адреса в базе данных (если требуется)
    await db.collection('user_logs').insertOne({
        userId: user._id,
        email: user.email,
        loginTime: new Date(),
        ipAddress: userIp,
    });

    const response = new NextResponse(JSON.stringify({ token }), { status: 200 });
    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 240 * 60 * 60, // 240 часов в секундах
        path: '/',
    });
    return response;
}
