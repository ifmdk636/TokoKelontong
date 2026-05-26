// components/Carousel.jsx

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { scrollCarousel } from "../utils/carousel";

export default function Carousel({
  title,
  items,
  renderItem,
  scrollAmount = 300,
}) {
  const scrollRef = useRef(null);

  return (
    <div className="w-full py-10 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-4">
        <h2 className="text-2xl font-bold uppercase">{title}</h2>

        <div className="flex gap-2">
          <button
            onClick={() => scrollCarousel(scrollRef, "left", scrollAmount)}
            className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => scrollCarousel(scrollRef, "right", scrollAmount)}
            className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide px-4"
      >
        {items.map((item, index) => (
          <div key={item.id || index}>{renderItem(item)}</div>
        ))}
      </div>
    </div>
  );
}
