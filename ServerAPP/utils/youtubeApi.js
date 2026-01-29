const axios = require("axios");

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

async function searchVideos(query, maxResults = 10) {
    if (!YOUTUBE_API_KEY) {
        throw new Error("YouTube API key is not configured.");
    }
    const { data } = await axios.get(YOUTUBE_API_URL, {
        params: {
            part: "snippet",
            q: query,
            type: "video",
            maxResults,
            key: YOUTUBE_API_KEY,
        },
    });
    return (data.items || []).map((item) => ({
        videoId: item.id?.videoId,
        title: item.snippet?.title,
        description: item.snippet?.description,
        thumbnailUrl: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url,
        channelTitle: item.snippet?.channelTitle,
    }));
}

module.exports = { searchVideos };
