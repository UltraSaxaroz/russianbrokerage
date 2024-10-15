import clientPromise from '@/lib/mongodb';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

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
    const db = client.db(); // Замените на имя вашей базы данных

    try {
        // Найдём пользователя, который делает запрос
        const requestingUser = await db.collection('users').findOne({ email: decoded.email });
        if (!requestingUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Если пользователь — админ, вернуть всех пользователей
        if (requestingUser.role === 'admin') {
            const users = await db.collection('users').find({}).toArray();
            return NextResponse.json({ data: users.map(user => ({ _id: user._id.toString(), name: user.name, email: user.email, role: user.role })) }, { status: 200 });
        }

        // Если не админ, вернуть только его данные
        return NextResponse.json({ data: [{ _id: requestingUser._id.toString(), name: requestingUser.name, email: requestingUser.email, role: requestingUser.role }] }, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
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
        return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
    }

    const { _id, name, email, role } = await request.json();

    const client = await clientPromise;
    const db = client.db();

    try {
        // Найдём пользователя, который делает запрос
        const requestingUser = await db.collection('users').findOne({ email: decoded.email });
        if (!requestingUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Проверим права (только админ или сам пользователь может редактировать)
        if (requestingUser.role !== 'admin' && requestingUser._id.toString() !== _id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
        }

        // Обновим данные пользователя
        const updateResult = await db.collection('users').updateOne(
            { _id: new ObjectId(_id) },
            { $set: { name, email, role } }
        );

        if (updateResult.modifiedCount === 1) {
            return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
        }

        return NextResponse.json({ message: 'User update failed' }, { status: 500 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
