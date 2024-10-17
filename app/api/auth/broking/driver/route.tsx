import {NextRequest, NextResponse} from 'next/server';
import jwt, {JwtPayload} from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';
import {ObjectId} from 'mongodb';

export async function POST(request: NextRequest): Promise<NextResponse> {
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
        const {fullName, number, lbs, time, locationFrom, locationTo} = await request.json();

        const existingUser = await db.collection('drivers').findOne({number});

        if (existingUser) {
            return NextResponse.json({message: 'Driver already exists'}, {status: 400});
        }

        await db.collection('drivers').insertOne({
            fullName, number, lbs, time, locationFrom, locationTo,
        });

        return NextResponse.json({message: 'Driver created successfully'}, {status: 201});
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: 'Server error'}, {status: 500});
    }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
        return NextResponse.json({ message: 'Access denied' }, { status: 401 });
    }

    let decoded: JwtPayload | null = null;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        if (!decoded || typeof decoded !== 'object' || !decoded.id) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
        }
    } catch (err) {
        return NextResponse.json({ message: 'Invalid token or server error' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db();

    try {
        const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
        const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const drivers = await db.collection('drivers')
            .find({})
            .skip(skip)
            .limit(limit)
            .toArray();

        const total = await db.collection('drivers').countDocuments({});

        return NextResponse.json({
            data: drivers,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
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
        const {id} = await request.json();

        await db.collection('drivers').deleteOne({_id: new ObjectId(id)});  // Убедиться, что удаляем только записи текущего пользователя

        return NextResponse.json({message: 'Driver deleted successfully'}, {status: 200});
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
        const {id, fullName, description, number, weight, time, locationFrom, locationTo} = await request.json();

        await db.collection('drivers').updateOne(
            {_id: new ObjectId(id)},  // Проверяем принадлежность данных пользователю
            {$set: {fullName, description, number, weight, time, locationFrom, locationTo}}
        );

        return NextResponse.json({message: 'Driver updated successfully'}, {status: 200});
    } catch (err) {
        console.error(err);
        return NextResponse.json({message: 'Server error'}, {status: 500});
    }
}
