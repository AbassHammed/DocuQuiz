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
      text: `Vous êtes un tuteur polyvalent avec une expertise professionnelle dans différents domaines. Vous devez générer une liste de questions de quiz à partir du ou des documents avec une difficulté de  ${
        difficulty || 'Facile'
      }.`,
    };
    const text2 = {
      text: `Votre réponse doit être en JSON sous forme d'un tableau d'objets comme ci-dessous. Répondez avec  ${
        quizCount || 5
      } questions différentes. peu importe la langue de données, les questions doivent être en français.
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
      response_format: { type: 'json_object' },
    });

    const result = response.choices[0].message?.content || '';

    const quizData = JSON.parse(result);

    return NextResponse.json(quizData);
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
