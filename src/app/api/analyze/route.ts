import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import { createClient } from '@/lib/supabase/server';
import { generateAllContent } from '@/lib/ai';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { url } = await req.json();
        const videoIdMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;

        if (!videoId) {
            return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
        }

        let transcriptData;
        try {
            transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
        } catch (err) {
            return NextResponse.json({ error: 'Subtitles are disabled for this video.' }, { status: 400 });
        }

        const transcriptText = transcriptData.map((item) => item.text).join(' ');

        const videoTitle = 'YouTube Video';
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

        const generatedContent = await generateAllContent(transcriptText);

        const { data: videoData, error: videoError } = await supabase
            .from('videos')
            .insert({
                user_id: user.id,
                youtube_id: videoId,
                title: videoTitle,
                thumbnail_url: thumbnailUrl,
                transcript: transcriptText
            })
            .select()
            .single();

        if (videoError) throw videoError;

        const { data: summaryData, error: summaryError } = await supabase
            .from('summaries')
            .insert({
                user_id: user.id,
                video_id: videoData.id,
                ...generatedContent
            })
            .select()
            .single();

        if (summaryError) throw summaryError;

        return NextResponse.json({ videoId: videoData.id });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
    }
}
