// @ts-expect-error hello
import { hash } from 'bcrypt';
import clientPromise from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const { email, name, password } = await request.json();

    const hashedPassword = await hash(password, 10);
    const client = await clientPromise;
    const db = client.db();

    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
        return new NextResponse(JSON.stringify({ message: 'User already exists' }), { status: 400 });
    }

    await db.collection('users').insertOne({
        email,
        name,
        password: hashedPassword,
    });

    return new NextResponse(JSON.stringify({ message: 'User created successfully' }), { status: 201 });
}
