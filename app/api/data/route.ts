import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';

async function handlePOST(request: NextRequest) {
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
        const { fullName, number, weight, time, locationFrom, locationTo, description } = await request.json();

        await db.collection('drivers').insertOne({
            userId: decoded.id,
            description,
            fullName,
            weight,
            number,
            time,
            locationFrom,
            locationTo,
            createdAt: new Date(),
        });

        return NextResponse.json({ message: 'Data saved successfully' }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

async function handleGET(request: NextRequest) {
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
        const userData = await db.collection('drivers').find({ userId: decoded.id }).toArray();
        return NextResponse.json({ data: userData }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export { handleGET as GET, handlePOST as POST };
