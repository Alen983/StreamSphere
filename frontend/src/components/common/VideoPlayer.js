import { useRef, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function VideoPlayer({ videoUrl, mediaId }) {
  const videoRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const [lastWatchedTime, setLastWatchedTime] = useState(0);
  const saveProgressTimeoutRef = useRef(null);

  // Default S3 video URL (always use this first)
  const defaultVideoUrl = "https://streamsphere151617.s3.ap-south-1.amazonaws.com/videoplayback.mp4";
  
  // Always use the default S3 URL first, ignore MongoDB videoUrl
  const finalVideoUrl = defaultVideoUrl;

  // Fetch last watched time when component mounts
  useEffect(() => {
    if (isAuthenticated && mediaId) {
      const fetchLastWatchedTime = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch("/api/v1/continue-Watching", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (data.success && data.continueWatchingList) {
            const mediaItem = data.continueWatchingList.find(
              (item) => item.media?._id === mediaId
            );
            if (mediaItem && mediaItem.lastTime) {
              setLastWatchedTime(mediaItem.lastTime);
            }
          }
        } catch (error) {
          console.error("Error fetching last watched time:", error);
        }
      };
      fetchLastWatchedTime();
    }
  }, [isAuthenticated, mediaId]);

  // Resume from last watched position
  useEffect(() => {
    if (videoRef.current && lastWatchedTime > 0) {
      videoRef.current.currentTime = lastWatchedTime;
    }
  }, [lastWatchedTime]);

  // Save progress to continue watching
  const saveProgress = async (currentTime) => {
    if (!isAuthenticated || !mediaId) return;

    try {
      const token = localStorage.getItem("token");
      await fetch("/api/v1/continue-Watching", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId: mediaId,
          lastTime: Math.floor(currentTime),
        }),
      });
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  // Handle time update - save progress every 10 seconds
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      
      // Clear existing timeout
      if (saveProgressTimeoutRef.current) {
        clearTimeout(saveProgressTimeoutRef.current);
      }

      // Save progress after 10 seconds of watching
      saveProgressTimeoutRef.current = setTimeout(() => {
        saveProgress(currentTime);
      }, 10000);
    };

    const handlePause = () => {
      // Save immediately when paused
      if (videoRef.current) {
        saveProgress(videoRef.current.currentTime);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("pause", handlePause);
      if (saveProgressTimeoutRef.current) {
        clearTimeout(saveProgressTimeoutRef.current);
      }
    };
  }, [isAuthenticated, mediaId]);

  return (
    <div 
      style={{ 
        maxWidth: "900px", 
        margin: "0 auto",
        width: "100%",
        position: "relative",
      }}
    >
      <video
        ref={videoRef}
        controls
        controlsList="nodownload"
        preload="auto"
        autoPlay={false}
        style={{
          width: "100%",
          height: "auto",
          minHeight: "400px",
          borderRadius: "12px",
          backgroundColor: "#000",
          display: "block",
        }}
      >
        <source src={finalVideoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

