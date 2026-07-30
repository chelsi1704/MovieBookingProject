import { useState } from "react";
import Modal from "../common/Modal";
//import ReactPlayer from "react-player";

const getYouTubeId = (url) => {
  if (!url) return null;

  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  );

  return match ? match[1] : null;
};

const TrailerModal = ({ isOpen, onClose, trailerUrl, title }) => {
  const [ready, setReady] = useState(false);
  const videoId = getYouTubeId(trailerUrl);

  console.log("Trailer URL =", trailerUrl);
  console.log("Video ID =", videoId);
  // Reset ready state when modal closes
  const handleClose = () => {
    setReady(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`${title} — Trailer`}
      size="xl"
      className="!bg-black/95"
    >
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
        {videoId ? (
          <iframe
            key={videoId}
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            width="100%"
            height="500"
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-white/40">Trailer not available</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TrailerModal;
