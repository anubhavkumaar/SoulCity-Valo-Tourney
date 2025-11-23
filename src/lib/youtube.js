export const getLiveStreams = async () => {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    const hashtag = "lifeinsoulcity";

    if (!apiKey) {
        console.warn("No YouTube API Key provided. Using mock data.");
        return [
            {
                id: { videoId: "mock1" },
                snippet: {
                    title: "SoulCity Tournament - Day 1 Qualifiers",
                    channelTitle: "SoulCity Official",
                    thumbnails: {
                        medium: { url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg" } // Rick roll placeholder or generic
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
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&eventType=live&q=%23${hashtag}&key=${apiKey}`
        );
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error("Error fetching YouTube streams:", error);
        return [];
    }
};
