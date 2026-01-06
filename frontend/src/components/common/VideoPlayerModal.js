import { useEffect } from "react";
import { Dialog, DialogContent, IconButton, Box } from "@mui/material";
import { Close } from "@mui/icons-material";
import VideoPlayer from "./VideoPlayer";

export default function VideoPlayerModal({ open, onClose, videoUrl, mediaName, mediaId }) {
  useEffect(() => {
    if (open) {
      console.log("VideoPlayerModal opened");
      console.log("Video URL:", videoUrl);
    }
  }, [open, videoUrl]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#000",
          borderRadius: "12px",
          minHeight: "500px",
        },
      }}
      sx={{
        "& .MuiDialog-container": {
          alignItems: "center",
        },
      }}
    >
      <DialogContent
        sx={{
          p: 3,
          position: "relative",
          backgroundColor: "#000",
          minHeight: "500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 1000,
            color: "#fff",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.9)",
            },
          }}
        >
          <Close />
        </IconButton>
        <Box sx={{ width: "100%", mt: 2 }}>
          <VideoPlayer videoUrl={videoUrl} mediaId={mediaId} />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

