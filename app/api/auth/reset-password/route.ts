import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
// @ts-expect-error калообразование бкрипта
import { hash } from 'bcrypt';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest): Promise<NextResponse> {
    const { token, newPassword } = await request.json();
    const client = await clientPromise;
    const db = client.db();

    try {
        // Декодирование токена и извлечение userId
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        // Преобразование userId в ObjectId для поиска в MongoDB
        const userObjectId = new ObjectId(decoded.userId);

        // Хэширование нового пароля
        const hashedPassword = await hash(newPassword, 10);

        // Обновление пароля пользователя
        await db.collection('users').updateOne(
            { _id: userObjectId },
            { $set: { password: hashedPassword } }
        );

        return new NextResponse(JSON.stringify({ message: 'Password has been reset' }), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: 'Invalid or expired token' }), { status: 400 });
    }
}
