// utils/carousel.js

export const scrollCarousel = (ref, direction, amount = 300) => {
  if (!ref?.current) return;

  ref.current.scrollBy({
    left: direction === "left" ? -amount : amount,
    behavior: "smooth",
  });
};
