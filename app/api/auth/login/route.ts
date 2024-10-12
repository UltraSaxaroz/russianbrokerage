// @ts-expect-error nigha
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
    const { email, password } = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection('users').findOne({ email });

    if (!user) {
        return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 401 });
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
        return new NextResponse(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '240h' }
    );

    return new NextResponse(JSON.stringify({ token }), { status: 200 });
}
