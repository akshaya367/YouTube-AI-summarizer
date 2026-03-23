import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateAllContent(transcript: string, context: string = '') {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
    You are an elite-level AI knowledge assistant designed to transform YouTube content into powerful, engaging, and highly actionable insights.
    Your output must feel premium, intelligent, and extremely useful — like it was created by a top expert.

    Analyze the following YouTube video content (transcript and extra context) and return a VERY STRICT JSON object with these exact keys:
    {
      "short_summary": "🔥 [Magnetic Summary] A highly engaging 2–3 line summary that hooks the reader instantly.",
      "detailed_summary": "🧠 [Deep Understanding] Explain the topic in a very clear, beginner-friendly way using simple analogies or examples.",
      "bullet_points": "📌 [Key Insights] A markdown string with high-value, crisp bullet points. No fluff, no repetition.",
      "key_takeaways": "🚀 [Actionable Takeaways] Clear, practical steps the user can apply immediately.",
      "study_notes": "⏱ [Key Moments] Highlight important parts of the content with timestamps if available, formatted as a markdown list.",
      "sentiment": "💡 [One Powerful Insight] A short, memorable takeaway that feels impactful.",
      "learning_path": "🎯 [Learning Roadmap] A 3-step numbered roadmap to master these concepts.",
      "quiz_questions": [
        {
          "question": "String",
          "options": ["A", "B", "C", "D"],
          "answer": "The correct option exactly as written in options"
        }
      ] (Exactly 5 challenging questions)
    }

    Rules:
    - Do NOT mention you are an AI.
    - Do NOT sound robotic.
    - Keep it clean, structured, and premium.
    - Use simple but powerful language.
    - Avoid unnecessary words.

    --- Transcript:
    ${transcript.substring(0, 15000)}

    --- Extra Context (Description/Comments):
    ${context.substring(0, 2000)}
  `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    text = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();

    try {
        return JSON.parse(text);
    } catch (err) {
        console.error('Failed to parse Gemini response as JSON', text);
        throw new Error('AI failed to return valid JSON');
    }
}

export async function answerQuestion(transcript: string, question: string) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Use the provided transcript to answer the user's question accurately. If the answer is not in the transcript, say so.
  
  Question: ${question}
  
  Transcript: ${transcript.substring(0, 15000)}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
}
