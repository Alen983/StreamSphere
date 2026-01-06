export default function VideoPlayer({ videoUrl }) {
  // Default S3 video URL (always use this first)
  const defaultVideoUrl = "https://streamsphere151617.s3.ap-south-1.amazonaws.com/videoplayback.mp4";
  
  // Always use the default S3 URL first, ignore MongoDB videoUrl
  const finalVideoUrl = defaultVideoUrl;

  console.log("VideoPlayer rendering with URL:", finalVideoUrl);

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
        controls
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

