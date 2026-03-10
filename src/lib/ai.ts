import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateAllContent(transcript: string) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
    Analyze the following YouTube video transcript and return a VERY STRICT JSON object with these exact keys:
    {
      "short_summary": "A 2-3 sentence summary",
      "detailed_summary": "A comprehensive paragraph explaining the video in depth",
      "bullet_points": "A markdown string with 5-7 bullet points of the main concepts",
      "key_takeaways": "A markdown string detailing the 3 biggest lessons or takeaways",
      "study_notes": "A strictly structured markdown string containing definitions and key facts suitable for studying",
      "quiz_questions": [
        {
          "question": "String",
          "options": ["A", "B", "C", "D"],
          "answer": "The correct option exactly as written in options"
        }
      ] (Exactly 5 questions)
    }

    --- Transcript:
    ${transcript.substring(0, 15000)}
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
