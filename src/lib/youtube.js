let cachedData = null;
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export const getLiveStreams = async () => {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    const hashtag = "lifeinsoulcity"; // Hardcoded for now, but better to pass as arg if dynamic

    // 1. Check Cache
    const now = Date.now();
    if (cachedData && (now - lastFetchTime < CACHE_DURATION)) {
        console.log("Returning cached YouTube data");
        return cachedData;
    }

    if (!apiKey) {
        console.warn("No YouTube API Key provided. Using mock data.");
        return [
            {
                id: { videoId: "mock1" },
                snippet: {
                    title: "SoulCity Tournament - Day 1 Qualifiers",
                    channelTitle: "SoulCity Official",
                    thumbnails: {
                        medium: { url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg" } 
                    }
                }
            },
            {
                id: { videoId: "mock2" },
                snippet: {
                    title: "Team Alpha vs Team Beta - Highlights",
                    channelTitle: "Valorant Clips",
                    thumbnails: {
                        medium: { url: "https://i.ytimg.com/vi/jNQXAC9IVRw/mqdefault.jpg" }
                    }
                }
            }
        ];
    }

    try {
        // 2. Fetch from API if cache expired or empty
        console.log("Fetching fresh YouTube data...");
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&eventType=live&q=%23${hashtag}&key=${apiKey}&maxResults=10` // Reduced maxResults to save bandwidth/processing, though quota cost is same for search
        );
        
        if (!response.ok) {
            throw new Error(`YouTube API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // 3. Update Cache
        cachedData = data.items || [];
        lastFetchTime = now;
        
        return cachedData;

    } catch (error) {
        console.error("Error fetching YouTube streams:", error);
        // Return stale data if available on error, otherwise empty
        return cachedData || [];
    }
};