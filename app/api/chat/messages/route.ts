import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Adjust path as necessary
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client'; // Import the Role enum from Prisma

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { content, role } = await request.json();

    if (!content || !role) {
      return NextResponse.json({ message: 'Missing content or role' }, { status: 400 });
    }

    // Validate role
    if (role !== Role.USER && role !== Role.ASSISTANT) {
      return NextResponse.json({ message: 'Invalid role specified' }, { status: 400 });
    }

    const newMessage = await prisma.chatMessage.create({
      data: {
        content,
        role,
        userId,
      },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error saving chat message:', error);
    return NextResponse.json({ message: 'Error saving message' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const messages = await prisma.chatMessage.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'asc', // Get messages in ascending order of creation
      },
    });

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json({ message: 'Error fetching messages' }, { status: 500 });
  }
}
