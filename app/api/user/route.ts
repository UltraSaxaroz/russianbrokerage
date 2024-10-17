// app/api/user/route.ts
import clientPromise from '@/lib/mongodb';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {NextRequest, NextResponse} from 'next/server';
import {ObjectId} from "mongodb";

interface User {
    _id: ObjectId;
    name: string;
    email: string;
    role: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
        return NextResponse.json({message: 'Access denied'}, {status: 401});
    }

    let decoded: JwtPayload | null = null;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        if (!decoded || typeof decoded !== 'object' || !decoded.email) {
            return NextResponse.json({message: 'Invalid token'}, {status: 403});
        }
    } catch (err) {
        return NextResponse.json({message: 'Invalid token or server error'}, {status: 403});
    }

    const client = await clientPromise;
    const db = client.db(); // Убедитесь, что имя базы данных правильное

    // Получаем параметры пагинации из запроса
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');  // Текущая страница, по умолчанию 1
    const limit = parseInt(searchParams.get('limit') || '5'); // Количество пользователей на странице, по умолчанию 5

    const skip = (page - 1) * limit; // Определяем, сколько записей нужно пропустить

    try {
        // Получаем пользователей с учетом пагинации
        const users = await db.collection<User>('users')
            .find({})
            .skip(skip) // Пропускаем нужное количество документов
            .limit(limit) // Ограничиваем количество возвращаемых документов
            .toArray();

        const totalUsers = await db.collection<User>('users').countDocuments(); // Общее количество пользователей

        // Преобразуем данные пользователей
        const userData = users.map(user => {
            try {
                return {
                    _id: user._id.toString(),
                    name: user.name || '',
                    email: user.email || '',
                    role: user.role || '',
                };
            } catch (error) {
                console.error('Error processing user:', user, error);
                return null;
            }
        }).filter(user => user !== null);

        // Возвращаем данные пользователей с информацией о пагинации
        return NextResponse.json({
            data: userData,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers: totalUsers,
        }, {status: 200});
    } catch (err) {
        console.error('Error fetching users:', err);
        return NextResponse.json({message: 'Server error'}, {status: 500});
    }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
        return NextResponse.json({message: 'Access denied'}, {status: 401});
    }

    let decoded: JwtPayload | null = null;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        if (!decoded || typeof decoded !== 'object' || !decoded.id) {
            return NextResponse.json({message: 'Invalid token'}, {status: 403});
        }
    } catch (err) {
        return NextResponse.json({message: 'Invalid token or server error'}, {status: 403});
    }

    const client = await clientPromise;
    const db = client.db();

    try {
        const {_id, name, email, role} = await request.json();
        console.log(_id, name, email, role);
        await db.collection('users').updateOne(
            {_id: new ObjectId(_id)},  // Проверяем принадлежность данных пользователю
            {$set: {name, email, role}}
        );

        return NextResponse.json({message: 'Driver updated successfully'}, {status: 200});
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: 'Server error'}, {status: 500});
    }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
        return NextResponse.json({message: 'Access denied'}, {status: 401});
    }

    let decoded: JwtPayload | null = null;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        if (!decoded || typeof decoded !== 'object' || !decoded.id) {
            return NextResponse.json({message: 'Invalid token'}, {status: 403});
        }
    } catch (err) {
        return NextResponse.json({message: 'Invalid token or server error'}, {status: 403});
    }

    const client = await clientPromise;
    const db = client.db();

    try {
        const {_id} = await request.json(); // Expecting the user ID from the request body
        await db.collection('users').deleteOne({_id: new ObjectId(_id)});

        return NextResponse.json({message: 'User deleted successfully'}, {status: 200});
    } catch (err) {
        console.error('Error deleting user:', err);
        return NextResponse.json({message: 'Server error'}, {status: 500});
    }
}
