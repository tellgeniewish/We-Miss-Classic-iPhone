import { Suspense } from "react";
import { RotateCcw } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";

import angle0 from "@/assets/iphone-360/angle-0.png";
import angle1 from "@/assets/iphone-360/angle-1.png";
import angle2 from "@/assets/iphone-360/angle-2.png";
import angle3 from "@/assets/iphone-360/angle-3.png";
import angle4 from "@/assets/iphone-360/angle-4.png";
import angle5 from "@/assets/iphone-360/angle-5.png";
import angle6 from "@/assets/iphone-360/angle-6.png";
import angle7 from "@/assets/iphone-360/angle-7.png";

const images = [angle0, angle1, angle2, angle3, angle4, angle5, angle6, angle7];
const labels = ["전면", "전면 우측", "우측면", "후면 우측", "후면", "후면 좌측", "좌측면", "전면 좌측"];

const IPhoneViewer3D = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const lastIndex = useRef(0);

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handleStart = useCallback((clientX: number) => {
    setIsDragging(true);
    startX.current = clientX;
    lastIndex.current = currentIndex;
  }, [currentIndex]);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX.current;
    const sensitivity = 40;
    const indexDiff = Math.round(diff / sensitivity);
    const newIndex = ((lastIndex.current - indexDiff) % images.length + images.length) % images.length;
    setCurrentIndex(newIndex);
  }, [isDragging]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => { e.preventDefault(); handleStart(e.clientX); };
  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onMouseUp = () => handleEnd();
  const onMouseLeave = () => handleEnd();
  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);
  const onTouchEnd = () => handleEnd();

  return (
    <div className="mb-8 select-none">
      <div
        className="relative flex justify-center items-center cursor-grab active:cursor-grabbing touch-none"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={images[currentIndex]}
          alt={`iPhone SE 1세대 스페이스 그레이 - ${labels[currentIndex]}`}
          className="w-52 h-52 object-contain animate-slide-up dark:brightness-110 dark:contrast-110 drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_40px_rgba(255,255,255,0.08)]"
          draggable={false}
        />
      </div>
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
              i === currentIndex ? "bg-foreground w-3" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-center gap-1.5 mt-2">
        <RotateCcw className="w-3 h-3 text-muted-foreground" />
        <p className="text-[10px] text-muted-foreground tracking-wider uppercase">
          드래그하여 360° 보기
        </p>
      </div>
    </div>
  );
};

export default IPhoneViewer3D;
