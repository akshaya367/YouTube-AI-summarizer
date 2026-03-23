import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import { createClient } from '@/lib/supabase/server';
import { generateAllContent } from '@/lib/ai';
import FirecrawlApp from '@mendable/firecrawl-js';

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

        // Firecrawl Scrape for more context (Description, Metadata, Comments)
        let firecrawlContext = '';
        let videoTitle = 'YouTube Video Analysis';
        try {
            const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
            const scrapeResponse = await (firecrawl as any).scrape(url, {
                formats: ['markdown'],
            });
            if (scrapeResponse.success) {
                firecrawlContext = scrapeResponse.markdown || '';
                if ((scrapeResponse as any).metadata?.title) {
                    videoTitle = (scrapeResponse as any).metadata.title.replace(' - YouTube', '');
                }
            }
        } catch (err) {
            console.error('Firecrawl failed to scrape context:', err);
        }

        let transcriptText = '';
        try {
            const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
            transcriptText = transcriptData.map((item) => item.text).join(' ');
        } catch (err) {
            console.warn('Transcript fetching failed, relying on context only.');
            if (!firecrawlContext) {
                return NextResponse.json({ error: 'Subtitles are disabled and context scraping failed. Try another video.' }, { status: 400 });
            }
        }

        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

        // Use Firecrawl context + Transcript (if any)
        const generatedContent = await generateAllContent(transcriptText, firecrawlContext);

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
