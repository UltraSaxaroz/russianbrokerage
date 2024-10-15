// app/api/user/route.ts
import clientPromise from '@/lib/mongodb';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {NextRequest, NextResponse} from 'next/server';
import {ObjectId} from "mongodb";

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

    try {
        const user = await db.collection('users').findOne({email: decoded.email});
        if (!user) {
            return NextResponse.json({message: 'User not found'}, {status: 404});
        }

        // Верните данные пользователя в формате массива
        return NextResponse.json({
            data: [{
                _id: user._id.toString(),
                name: user.name,
                email: user.email
            }]
        }, {status: 200});
    } catch (err) {
        console.error(err);
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
        const { _id, name, email, role } = await request.json();
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
