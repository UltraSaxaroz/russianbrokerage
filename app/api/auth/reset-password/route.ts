import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
// @ts-expect-error niggasaurus 123
import { hash } from 'bcrypt';
import {ObjectId} from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
    const { token, newPassword } = await request.json();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const client = await clientPromise;
        const db = client.db();

        const hashedPassword = await hash(newPassword, 10);

        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(decoded.userId)  },
            { $set: { password: hashedPassword } }
        );

        if (result.modifiedCount === 1) {
            return NextResponse.json({ message: 'Пароль успешно обновлен' });
        } else {
            return NextResponse.json({ message: 'Не удалось обновить пароль' }, { status: 400 });
        }
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ message: 'Недействительный или истекший токен' }, { status: 400 });
        } else {
            console.error('Error resetting password:', error);
            return NextResponse.json({ message: 'Произошла ошибка при сбросе пароля' }, { status: 500 });
        }
    }
}