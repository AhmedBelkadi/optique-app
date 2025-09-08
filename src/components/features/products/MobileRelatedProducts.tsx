"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/features/products/schema/productSchema";
import { ProductCard } from "@/components/ui/product-card";

interface MobileRelatedProductsProps {
  products: Product[];
}

export function MobileRelatedProducts({ products }: MobileRelatedProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  if (!products || products.length === 0) return null;

  const maxIndex = Math.max(0, products.length - 1);

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = (container.children[0] as HTMLElement | undefined)?.clientWidth || 280;
    const gap = 16; // tailwind gap-4
    const left = index * (cardWidth + gap);
    container.scrollTo({ left, behavior: "smooth" });
    setCurrentIndex(index);
  };

  const next = () => scrollToIndex(currentIndex < maxIndex ? currentIndex + 1 : 0);
  const prev = () => scrollToIndex(currentIndex > 0 ? currentIndex - 1 : maxIndex);

  // Drag/Swipe support
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };
  const onMouseUp = () => setIsDragging(false);
  const onTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };
  const onTouchEnd = () => setIsDragging(false);

  // Auto-advance
  useEffect(() => {
    const id = setInterval(() => {
      if (!isDragging) next();
    }, 5000);
    return () => clearInterval(id);
  }, [currentIndex, isDragging]);

  return (
    <div className="md:hidden">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="default"
          size="sm"
          onClick={prev}
          className="h-10 w-10 rounded-full p-0 backdrop-blur-sm border-2 border-gray-200 hover:border-primary hover:bg-primary hover:text-white transition-all duration-200"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex space-x-2">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              className={`h-2 w-2 rounded-full transition-all duration-200 ${idx === currentIndex ? "bg-primary w-6" : "bg-gray-300 hover:bg-gray-400"}`}
            />)
          )}
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={next}
          className="h-10 w-10 rounded-full p-0 backdrop-blur-sm border-2 border-gray-200 hover:border-primary hover:bg-primary hover:text-white transition-all duration-200"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-72 snap-center" style={{ minWidth: "280px" }}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}


