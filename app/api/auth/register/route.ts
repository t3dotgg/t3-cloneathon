import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Import Prisma client
import bcrypt from 'bcryptjs'; // Import bcryptjs

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 }); // 409 Conflict
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create new user in the database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null, // Optional name field
      },
    });

    // Don't return the password in the response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ message: 'User registered successfully', user: userWithoutPassword }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    // Check for specific Prisma errors if needed, e.g., P2002 for unique constraint violation
    // though the check above should catch existing email.
    return NextResponse.json({ message: 'An unexpected error occurred during registration' }, { status: 500 });
  }
}
