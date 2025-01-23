'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const Lightbox = ({ src, alt, caption }: { src: string; alt: string; caption: string }) => {
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
        className="max-w-xs cursor-zoom-in"
      />
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95"
          onClick={toggleLightbox}
        >
          <div className="relative flex max-h-screen max-w-2xl flex-col items-center text-center">
            <Image
              src={src}
              alt={alt}
              width={0}
              height={0}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              onClick={(e) => e.stopPropagation()}
              className="mb-4 max-h-[80vh] max-w-full object-contain p-4 sm:px-8"
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }}
            />
            <div className="text-lg text-white" onClick={(e) => e.stopPropagation()}>
              {caption}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lightbox;
