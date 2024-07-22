/* eslint-disable no-console */
import { NextRequest, NextResponse } from 'next/server';

// Handle the incoming request
export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const topic = formData.get('topic') as string;
  const text = formData.get('text') as string;
  const difficulty = formData.get('difficulty') as string;
  const quizCount = formData.get('quizCount') as string;
  const timer = formData.get('timer') as string;

  // Now you have access to each piece of data individually
  console.log({ topic, text, difficulty, quizCount, timer });

  // You can now process these data as needed
  // For example, generate a quiz, store in a database, etc.

  // Respond with some result or status
  return NextResponse.json({
    message: 'Form data received successfully',
    topic,
    text,
    difficulty,
    quizCount,
    timer,
  });
}
