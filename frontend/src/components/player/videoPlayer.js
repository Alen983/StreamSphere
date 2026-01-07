// src/components/player/VideoPlayer.js
import { useRef, useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Slider,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  Forward10,
  Replay10,
} from "@mui/icons-material";

export default function VideoPlayer({
  videoUrl,
  posterUrl,
  onProgress,
  initialTime = 0,
  onEnded,
  autoPlay = false,
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const [videoError, setVideoError] = useState(null);

  // Hide controls after 3 seconds of inactivity
  useEffect(() => {
    let timeout;
    if (showControls && isPlaying) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, isPlaying]);

  // Set initial time when video loads
  useEffect(() => {
    if (videoRef.current && initialTime > 0 && duration > 0) {
      videoRef.current.currentTime = initialTime;
    }
  }, [initialTime, duration]);

  // Handle video URL changes
  useEffect(() => {
    if (videoRef.current && videoUrl) {
      setIsLoading(true);
      setVideoError(null);
      videoRef.current.load();
    }
  }, [videoUrl]);

  // Auto play if requested
  useEffect(() => {
    if (autoPlay && videoRef.current && !isLoading && !videoError) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Auto-play failed:", error);
            setIsPlaying(false);
          });
      }
    }
  }, [autoPlay, isLoading, videoError]);

  // Track progress for continue watching
  useEffect(() => {
    if (isPlaying && onProgress) {
      progressIntervalRef.current = setInterval(() => {
        if (videoRef.current) {
          onProgress(videoRef.current.currentTime);
        }
      }, 10000); // Update every 10 seconds
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, onProgress]);

  // Video event handlers
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
      setVideoError(null);
      console.log(
        "Video metadata loaded, duration:",
        videoRef.current.duration
      );
    }
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    setVideoError(null);
    console.log("Video can play");
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);

      // Update buffered
      if (videoRef.current.buffered.length > 0) {
        const bufferedEnd = videoRef.current.buffered.end(
          videoRef.current.buffered.length - 1
        );
        setBuffered((bufferedEnd / videoRef.current.duration) * 100);
      }
    }
  };

  const handleError = (e) => {
    console.error("Video error:", e);
    const video = videoRef.current;

    let errorMessage = "Failed to load video";
    if (video?.error) {
      switch (video.error.code) {
        case 1:
          errorMessage = "Video loading aborted";
          break;
        case 2:
          errorMessage = "Network error while loading video";
          break;
        case 3:
          errorMessage = "Video format not supported or corrupted";
          break;
        case 4:
          errorMessage = "Video not found or not accessible";
          break;
        default:
          errorMessage = `Video error: ${video.error.message}`;
      }
    }

    setVideoError(errorMessage);
    setIsLoading(false);
    setIsPlaying(false);
  };

  const handlePlay = () => {
    if (videoRef.current && !videoError) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Play error:", error);
            setVideoError("Failed to play video. Please try again.");
          });
      }
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleSeek = (event, newValue) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const handleVolumeChange = (event, newValue) => {
    if (videoRef.current) {
      videoRef.current.volume = newValue;
      setVolume(newValue);
      setIsMuted(newValue === 0);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 0.5;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.currentTime + 10,
        duration
      );
    }
  };

  const handleRewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        videoRef.current.currentTime - 10,
        0
      );
    }
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.mozRequestFullScreen) {
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        )
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (onEnded) {
      onEnded();
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Box
      ref={containerRef}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        cursor: showControls ? "default" : "none",
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        poster={posterUrl}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onError={handleError}
        crossOrigin="anonymous"
        playsInline
        preload="metadata"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
        onClick={handlePlayPause}
      >
        {videoUrl && <source src={videoUrl} type="video/mp4" />}
        Your browser does not support the video tag.
      </video>

      {/* Error Message */}
      {videoError && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "500px",
          }}
        >
          <Alert
            severity="error"
            sx={{
              backgroundColor: "rgba(211, 47, 47, 0.9)",
              color: "#fff",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              {videoError}
            </Typography>
            <Typography variant="body2">
              Please check your internet connection or try refreshing the page.
            </Typography>
          </Alert>
        </Box>
      )}

      {/* Loading Spinner */}
      {isLoading && !videoError && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress sx={{ color: "#ffd700" }} />
        </Box>
      )}

      {/* Center Play Button (when paused) */}
      {!isPlaying && !isLoading && !videoError && (
        <Box
          onClick={handlePlayPause}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            cursor: "pointer",
          }}
        >
          <IconButton
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "#fff",
              width: 80,
              height: 80,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.9)",
              },
            }}
          >
            <PlayArrow sx={{ fontSize: 50 }} />
          </IconButton>
        </Box>
      )}

      {/* Controls */}
      {!videoError && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)",
            opacity: showControls ? 1 : 0,
            transition: "opacity 0.3s ease",
            padding: 2,
          }}
        >
          {/* Progress Bar */}
          <Box sx={{ mb: 1, px: 1, position: "relative" }}>
            {/* Buffered Bar */}
            <Box
              sx={{
                position: "absolute",
                height: 4,
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                width: `${buffered}%`,
                borderRadius: 2,
                bottom: 35,
                left: 16,
              }}
            />

            <Slider
              value={currentTime}
              max={duration || 100}
              onChange={handleSeek}
              sx={{
                color: "#ffd700",
                height: 4,
                "& .MuiSlider-thumb": {
                  width: 12,
                  height: 12,
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: "0 0 0 8px rgba(255, 215, 0, 0.16)",
                  },
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 0.5,
              }}
            >
              <Typography sx={{ color: "#fff", fontSize: "0.875rem" }}>
                {formatTime(currentTime)}
              </Typography>
              <Typography sx={{ color: "#fff", fontSize: "0.875rem" }}>
                {formatTime(duration)}
              </Typography>
            </Box>
          </Box>

          {/* Control Buttons */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 1,
            }}
          >
            {/* Left Controls */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={handlePlayPause} sx={{ color: "#fff" }}>
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>

              <IconButton onClick={handleRewind} sx={{ color: "#fff" }}>
                <Replay10 />
              </IconButton>

              <IconButton onClick={handleForward} sx={{ color: "#fff" }}>
                <Forward10 />
              </IconButton>

              {/* Volume Control */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}
              >
                <IconButton onClick={handleMuteToggle} sx={{ color: "#fff" }}>
                  {isMuted || volume === 0 ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
                <Slider
                  value={isMuted ? 0 : volume}
                  max={1}
                  step={0.1}
                  onChange={handleVolumeChange}
                  sx={{
                    width: 100,
                    color: "#fff",
                    "& .MuiSlider-thumb": {
                      width: 10,
                      height: 10,
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Right Controls */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={handleFullscreen} sx={{ color: "#fff" }}>
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
