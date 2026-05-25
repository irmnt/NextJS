import { NextResponse } from 'next/server';

// This forces the function to run dynamically on the server
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        // 1. Extract the user's message from the incoming frontend request
        const body = await request.json();
        const { prompt } = body;

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

       // 2. Securely retrieve the API key from the server environment
       const apiKey = process.env.OPENAI_API_KEY;
       
       // 3. Forward the request to the AI provider
       const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
        }),
       });
       
       const data = await response.json();

       // 4. Send the AI's response back to the frontend
       return NextResponse.json({
        text: data.choices[0].message.content
       });

    } catch (error) {
        console.error("Gateway Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}