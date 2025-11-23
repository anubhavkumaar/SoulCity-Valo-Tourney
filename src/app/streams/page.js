"use client";
import { useState, useEffect } from 'react';
import { useTournament } from "@/context/TournamentContext";

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const HASHTAG = "#lifeinsoulcity";

export default function StreamsPage() {
  const { streamSettings } = useTournament();
  const [liveStreams, setLiveStreams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLiveStreams = async () => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&eventType=live&q=${encodeURIComponent(HASHTAG)}&key=${YOUTUBE_API_KEY}&maxResults=12`
      );
      const data = await res.json();
      if (data.items) {
        setLiveStreams(data.items.map(item => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          channel: item.snippet.channelTitle
        })));
      }
    } catch (error) {
      console.error("YouTube API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveStreams();
    const interval = setInterval(fetchLiveStreams, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  // Helper to render an embedded player
  const StreamPlayer = ({ videoId, title, label }) => (
    <div className="w-full h-full flex flex-col">
      <div className="relative w-full pt-[56.25%] bg-black border border-[#ff4655]">
        <iframe 
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
          title={title}
          allowFullScreen
        />
      </div>
      <div className="bg-[#1c2733] p-3 border-t border-[#ff4655]">
         <span className="text-[#ff4655] font-bold text-xs uppercase tracking-widest block mb-1">{label}</span>
         <h3 className="text-white font-bold truncate">{title}</h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f1923] p-6 pt-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-4xl font-black uppercase text-white border-l-4 border-[#ff4655] pl-4">
            Live Broadcast
          </h1>
          <span className="bg-[#ff4655] text-white px-3 py-1 rounded text-sm font-bold animate-pulse">
            LIVE NOW
          </span>
        </div>

        {/* --- PINNED STREAMS SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Main Broadcast (Spans 2 cols on large screens) */}
          <div className="lg:col-span-2 aspect-video">
            {streamSettings.main ? (
              <StreamPlayer videoId={streamSettings.main.id} title={streamSettings.main.title} label="Official Tournament Stream" />
            ) : (
              <div className="w-full h-full bg-black/50 border border-white/10 flex items-center justify-center">
                <p className="text-gray-500 uppercase font-bold">Waiting for Broadcast...</p>
              </div>
            )}
          </div>

          {/* POV Streams */}
          <div className="flex flex-col gap-6">
            <div className="flex-1">
              {streamSettings.pov1 ? (
                <StreamPlayer videoId={streamSettings.pov1.id} title={streamSettings.pov1.title} label="Team POV 1" />
              ) : (
                 <div className="w-full h-full bg-black/50 border border-white/10 flex items-center justify-center min-h-[200px]">
                    <p className="text-gray-500 uppercase font-bold text-xs">Waiting for POV 1...</p>
                 </div>
              )}
            </div>
            <div className="flex-1">
              {streamSettings.pov2 ? (
                <StreamPlayer videoId={streamSettings.pov2.id} title={streamSettings.pov2.title} label="Team POV 2" />
              ) : (
                 <div className="w-full h-full bg-black/50 border border-white/10 flex items-center justify-center min-h-[200px]">
                    <p className="text-gray-500 uppercase font-bold text-xs">Waiting for POV 2...</p>
                 </div>
              )}
            </div>
          </div>
        </div>

        {/* --- ALL STREAMS GRID --- */}
        <h2 className="text-xl font-bold uppercase text-white mb-4 flex items-center gap-2">
          All Streams <span className="text-[#ff4655] text-sm">#lifeinsoulcity</span>
        </h2>
        
        {loading ? (
          <p className="text-gray-500">Scanning frequency...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {liveStreams.length === 0 ? (
               <p className="col-span-full text-gray-500 italic">No live streams found with tag {HASHTAG}</p>
            ) : (
              liveStreams.map((vid) => (
                <div key={vid.id} className="bg-[#1c2733] border border-white/10 hover:border-[#ff4655] transition group">
                  <div className="relative aspect-video">
                    <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                    <a 
                      href={`https://www.youtube.com/watch?v=${vid.id}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white font-bold uppercase tracking-widest border-2 border-transparent group-hover:border-white m-2"
                    >
                      Watch
                    </a>
                  </div>
                  <div className="p-3">
                    <h3 className="text-white font-bold text-sm truncate" title={vid.title}>{vid.title}</h3>
                    <p className="text-gray-400 text-xs mt-1">{vid.channel}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}