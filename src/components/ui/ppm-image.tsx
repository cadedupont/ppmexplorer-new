import Image from "next/image";
import { cn } from "@/lib/utils";

interface PPMImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const PPMImage: React.FC<PPMImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn("pointer-events-none", className)}
      unselectable="on"
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};

export default PPMImage;