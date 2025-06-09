import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Adjust path as necessary
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ message: 'Messages are required' }, { status: 400 });
    }

    // Create a chat completion stream
    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or your preferred model
      messages: messages,
      stream: true,
    });

    // Convert the stream to a StreamingTextResponse
    const readableStream = OpenAIStream(stream);

    return new StreamingTextResponse(readableStream);

  } catch (error) {
    console.error('Error calling OpenAI Completions API:', error);
    if (error instanceof OpenAI.APIError) {
      // Handle OpenAI API errors specifically
      return NextResponse.json({ message: error.message, code: error.code }, { status: error.status || 500 });
    }
    return NextResponse.json({ message: 'Error processing chat completion' }, { status: 500 });
  }
}
