import clientPromise from '@/lib/mongodb';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// Получить всех пользователей с возможностью фильтрации по имени
export async function GET(request: NextRequest): Promise<NextResponse> {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
        return NextResponse.json({ message: 'Access denied' }, { status: 401 });
    }

    let decoded: JwtPayload | null = null;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        if (!decoded || typeof decoded !== 'object' || !decoded.email) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
        }
    } catch (err) {
        return NextResponse.json({ message: 'Invalid token or server error' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db(); // Убедитесь, что имя базы данных правильное

    const { search } = request.nextUrl; // Получаем строку поиска из URL

    try {
        // Поиск пользователей по имени
        const query = search ? { name: { $regex: search, $options: 'i' } } : {};
        const users = await db.collection('users').find(query).toArray();

        return NextResponse.json({ data: users.map(user => ({ _id: user._id.toString(), name: user.name, email: user.email, role: user.role })) }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

// Добавьте новый метод для обновления пользователя
export async function PATCH(request: NextRequest): Promise<NextResponse> {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
        return NextResponse.json({ message: 'Access denied' }, { status: 401 });
    }

    let decoded: JwtPayload | null = null;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        if (!decoded || typeof decoded !== 'object' || !decoded.email) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
        }
    } catch (err) {
        return NextResponse.json({ message: 'Invalid token or server error' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db(); // Убедитесь, что имя базы данных правильное

    const { _id, name, email, role } = await request.json(); // Теперь получаем роль

    try {
        const updateData: { [key: string]: any } = { name, email };
        if (role) {
            updateData.role = role; // Добавляем роль в обновление, если она передана
        }

        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(_id) },
            { $set: updateData }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: 'User not found or no changes made' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
