import Data from "../../data/productList.tsx";
import { useNavigate } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import Navbar from "../components/navbar.js";
import parfum1 from "../../assets/images/parfum1.jpg";
import parfum2 from "../../assets/images/parfum2.jpg";
import parfum3 from "../../assets/images/parfum3.jpg";

import * as React from "react";
import { Card, CardContent } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "~/components/ui/carousel";

function ProductList() {
  const navigate = useNavigate();

  const plugin = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const images = [parfum1, parfum2, parfum3];

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-4 md:p-6">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Carousel kiri */}
            <div className="w-full lg:w-[260px] flex-shrink-0">
              <Carousel
                setApi={setApi}
                plugins={[plugin.current]}
                className="w-full"
                opts={{ loop: true }}
              >
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index} className="basis-full">
                      <Card className="overflow-hidden border-0 shadow-md rounded-xl">
                        <CardContent className="p-0">
                          <div className="h-[240px] w-full">
                            <img
                              src={image}
                              alt={`Parfum ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>

              <div className="py-2 text-center text-sm text-muted-foreground">
                Slide {current} of {count}
              </div>
            </div>

            {/* Carousel kanan */}
            <div className="flex-1 w-full">
              <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index} className="basis-full">
                      <Card className="w-full shadow-md">
                        <CardContent className="h-[240px] flex items-center justify-center">
                          <span className="text-4xl font-semibold">
                            {index + 1}
                          </span>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>

          {/* Product List */}
          <div className="mt-8 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 self-start">
              Product List
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 w-full">
              {Data.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col"
                >
                  <div className="w-full h-52 bg-gray-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px]">
                      {item.name}
                    </h2>

                    <p className="text-green-600 font-bold text-lg mt-2">
                      Rp {item.price}
                    </p>

                    <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                      ⭐ {item.rating} • Terjual {item.sold}+
                    </div>

                    <p className="text-xs text-gray-400 mt-2 mb-2">
                      {item.location}
                    </p>

                    <button
                      onClick={() => navigate(`/card/${item.id}`)}
                      className="w-full mt-auto bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition cursor-pointer"
                    >
                      Beli
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductList;
