import React from "react";

type CarouselProps = {
  children: React.ReactNode;
  /** Largura de cada card no mobile (exibe ~1.1–1.3 cards por tela) */
  itemWidth?: string; // ex: "82%", "75%", "60%"
  /** Espaço entre cards (px) */
  gap?: number;
  className?: string;
};

const Carousel: React.FC<CarouselProps> = ({
  children,
  itemWidth = "82%",
  gap = 12,
  className = "",
}) => {
  return (
    <div className={`carousel ${className}`}>
      <div className="track">
        {React.Children.map(children, (child, idx) => (
          <div className="item" key={idx}>
            {child}
          </div>
        ))}
      </div>

      <style jsx>{`
        .carousel {
          overflow: hidden;
        }

        .track {
          display: flex;
          gap: ${gap}px;
          overflow-x: auto;
          padding: 0 16px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; /* Firefox */
        }
        .track::-webkit-scrollbar {
          display: none; /* Safari/Chrome */
        }

        .item {
          flex: 0 0 ${itemWidth};
          scroll-snap-align: start;
        }

        /* No desktop volta para grid normal (sem scroll horizontal) */
        @media (min-width: 1024px) {
          .track {
            overflow: visible;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: ${gap}px;
            padding: 0;
          }
          .item {
            flex: none;
            scroll-snap-align: initial;
            width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default Carousel;
