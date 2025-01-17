"use client";

import React, { useState } from "react";
import Image from "next/image";

const Lightbox = ({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleLightbox = () => setIsExpanded(!isExpanded);

  return (
    <div>
      <Image
        src={src}
        alt={alt}
        width={100}
        height={100}
        onClick={toggleLightbox}
        onContextMenu={(e) => e.preventDefault()} // Prevent opening image in new tab from context menu
        onDragStart={(e) => e.preventDefault()} // Prevent dragging image in new tab and downloading
        className="cursor-zoom-in max-w-xs"
      />
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 flex justify-center items-center z-50"
          onClick={toggleLightbox}
        >
          <div
            className="relative flex flex-col items-center max-w-4xl max-h-screen text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              width={0}
              height={0}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              className="max-w-full max-h-[80vh] mb-4"
              sizes="100vw"
              style={{ width: "100%", height: "100%" }}
            />
            <div className="text-white text-lg">{caption}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lightbox;
