/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-useless-escape */
/* eslint-disable no-console */
import { NextRequest, NextResponse } from 'next/server';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_APIKEY,
});

// Handle the incoming request
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const text = formData.get('text') as string;
    const difficulty = formData.get('difficulty') as string;
    const quizCount = formData.get('quizCount') as string;

    const text1 = {
      text: `You are an all-rounder tutor with professional expertise in different fields. You are to generate a list of quiz questions from the document(s) with a difficutly of ${
        difficulty || 'Easy'
      }.`,
    };
    const text2 = {
      text: `You response should be in JSON as an array of the object below. Respond with ${
        quizCount || 5
      } different questions.
  {
   \"id\": 1,
   \"question\": \"\",
   \"description\": \"\",
   \"options\": {
     \"a\": \"\",
     \"b\": \"\",
     \"c\": \"\",
     \"d\": \"\"
   },
   \"answer\": \"\",
  }`,
    };

    const user = text1.text + text2.text;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: user,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 1,
      max_tokens: 16383,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const result = response.choices[0].message?.content || '';

    console.log(result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      {
        error: 'An error occurred while processing the request.',
      },
      { status: 500 },
    );
  }
}
