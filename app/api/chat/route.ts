import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { prompt, provider } = body;

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // OPENAI API CALL
        if (provider === 'openai') {
            const apiKey = process.env.OPENAI_API_KEY;

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

            // Error handling for OpenAI response
            if (!response.ok) {
                const errorData = await response.json();
                console.error("OpenAI API Raw Error:", errorData);
                return NextResponse.json(
                    { error: errorData.error?.message || "Failed to fetch from OpenAI" },
                    { status: response.status }
                );
            }

            const data = await response.json();
            return NextResponse.json({ text: data.choices[0].message.content });
        }

        // GEMINI API CALL
        else if (provider === 'gemini') {
            const apiKey = process.env.GEMINI_API_KEY;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            });

            if (!response.ok) {
                // 1. Grab the raw text
                const rawText = await response.text();
                console.error(`Gemini API Raw Error (Status ${response.status}):`,  rawText);

                // 2. Safely attmpt to extract a specific message if it is JSON
                let errorMessage = "Failed to fetch from Gemini";
                try {
                    const errorObj = JSON.parse(rawText);
                    errorMessage = errorObj.error?.message || errorMessage;
                } catch {
                    errorMessage = rawText || errorMessage;
                }

                return NextResponse.json(
                    { error: errorMessage },
                    { status: response.status }
                );
            }

            const data = await response.json();
            return NextResponse.json({ text: data.candidates[0].content.parts[0].text });
        }

        // Fallback for unsupported providers
        return NextResponse.json({ error: "Invalid provider selected" }, { status: 400 });

    } catch (error) {
        console.error("Gateway Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}