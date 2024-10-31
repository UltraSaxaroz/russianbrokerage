// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
// @ts-expect-error niggadie bcrypt developer
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongodb'; // Import ObjectId

export async function POST(request: NextRequest): Promise<NextResponse> {
    const { token, newPassword } = await request.json();

    // Верификация токена
    let userId: string | undefined;
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        userId = payload.id; // Здесь мы уверены, что это JwtPayload
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'Invalid token' }), { status: 400 });
    }

    if (!userId) {
        return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Хеширование нового пароля
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Обновление пароля в базе данных, преобразуем userId в ObjectId
    await db.collection('users').updateOne(
        { _id: new ObjectId(userId) }, // Convert userId to ObjectId
        { $set: { password: hashedPassword } }
    );

    return new NextResponse(JSON.stringify({ message: 'Password updated successfully' }), { status: 200 });
}
