import Image from "next/image";
import { cn } from "@/lib/utils";

const PPMImage = ({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
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
