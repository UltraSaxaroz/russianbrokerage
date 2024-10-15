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
    const db = client.db();

    try {
        const users = await db.collection('users').find({}).toArray();
        return NextResponse.json({ data: users.map(user => ({ _id: user._id.toString(), name: user.name, email: user.email, role: user.role })) }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

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
    const db = client.db();

    const { _id, name, email, role } = await request.json();

    try {
        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(_id) },
            { $set: { name, email, role } }
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