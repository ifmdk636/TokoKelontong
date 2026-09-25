import Data from "../../data/productList.tsx";
import { useNavigate } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import Navbar from "../components/navbar.js";
import parfum1 from "../../assets/images/parfum1.jpg";
import parfum2 from "../../assets/images/parfum2.jpg";
import parfum3 from "../../assets/images/parfum3.jpg";
import { Heart, ShieldCheck, Sparkles, Truck } from "lucide-react";

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
          <div className="w-full">
            <Carousel
              setApi={setApi}
              plugins={[plugin.current]}
              className="w-full"
              opts={{ loop: true, align: "start" }}
            >
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={image} className="basis-full">
                    <Card className="overflow-hidden border-0 shadow-md rounded-xl">
                      <CardContent className="relative p-0">
                        <div className="h-[240px] w-full md:h-[320px]">
                          <img
                            src={image}
                            alt={`Parfum unggulan ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/10 to-transparent p-5 md:p-8">
                            <div className="text-white">
                              <p className="text-sm font-medium uppercase tracking-wider">
                                Koleksi pilihan
                              </p>
                              <h2 className="mt-1 text-2xl font-bold md:text-3xl">
                                Temukan parfum favoritmu
                              </h2>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="left-3 md:left-5" />
              <CarouselNext className="right-3 md:right-5" />
            </Carousel>

            <div className="flex items-center justify-center gap-2 py-3">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Pilih slide ${index + 1}`}
                  aria-current={current === index + 1}
                  onClick={() => api?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all ${
                    current === index + 1
                      ? "w-6 bg-green-500"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          <section className="mt-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
                  Eksplorasi aroma
                </p>
                <h1 className="mt-1 text-3xl font-bold text-gray-900">
                  Temukan parfum yang cocok untukmu
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-gray-500">
                  Pilihan parfum berkualitas untuk menemani setiap momen,
                  dari aktivitas sehari-hari hingga acara spesial.
                </p>
              </div>
              <button
                type="button"
                className="self-start rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-amber-400 hover:text-amber-600 md:self-auto"
              >
                Lihat semua
              </button>
            </div>

            <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
              {["Semua Aroma", "Floral", "Fresh", "Woody", "Unisex"].map(
                (category, index) => (
                  <button
                    key={category}
                    type="button"
                    className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition ${
                      index === 0
                        ? "bg-amber-500 text-white shadow-sm"
                        : "border border-gray-200 bg-white text-gray-600 hover:border-amber-400 hover:text-amber-600"
                    }`}
                  >
                    {category}
                  </button>
                ),
              )}
            </div>
          </section>

          <section className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 p-6 text-white md:col-span-2">
              <p className="text-sm font-medium text-amber-50">PENAWARAN HARI INI</p>
              <h2 className="mt-2 max-w-lg text-2xl font-bold">
                Wangi mewah, harga tetap bersahabat
              </h2>
              <p className="mt-2 max-w-md text-sm text-amber-50">
                Dapatkan parfum pilihan dengan promo spesial untuk pesanan
                pertamamu.
              </p>
              <button
                type="button"
                className="mt-5 rounded-full bg-white px-5 py-2 text-sm font-bold text-orange-600 transition hover:bg-orange-50"
              >
                Belanja sekarang
              </button>
            </div>
            <div className="rounded-2xl bg-gray-900 p-6 text-white">
              <Sparkles className="h-7 w-7 text-amber-400" />
              <h2 className="mt-4 text-xl font-bold">Aroma pilihan</h2>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Koleksi favorit yang paling banyak disukai pelanggan kami.
              </p>
            </div>
          </section>

          <section className="mt-10">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-600">PILIHAN TERBAIK</p>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Best seller minggu ini
                </h2>
              </div>
              <span className="hidden text-sm text-gray-500 sm:block">
                Favorit pelanggan
              </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Data.slice(0, 4).map((item, index) => (
                <div
                  key={`featured-${item.id}-${index}`}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-orange-600 shadow-sm">
                    Terlaris
                  </span>
                  <button
                    type="button"
                    aria-label={`Simpan ${item.name}`}
                    className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-gray-500 shadow-sm transition hover:text-red-500"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                  <div className="h-56 overflow-hidden bg-gray-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-400">{item.location}</p>
                    <h3 className="mt-1 font-semibold text-gray-800">{item.name}</h3>
                    <p className="mt-2 text-lg font-bold text-emerald-600">Rp {item.price}</p>
                    <p className="mt-1 text-sm text-gray-500">⭐ {item.rating} · {item.sold}+ terjual</p>
                    <button
                      type="button"
                      onClick={() => navigate(`/productdetail/${item.id}`)}
                      className="mt-4 w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
                    >
                      Lihat produk
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <div className="mb-5">
              <p className="text-sm font-semibold text-amber-600">KATALOG</p>
              <h2 className="mt-1 text-2xl font-bold text-gray-900">Semua parfum</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {Data.map((item, index) => (
                <div
                  key={`catalog-${item.id}-${index}`}
                  className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="h-44 bg-gray-50">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col p-3">
                    <h3 className="min-h-10 text-sm font-semibold text-gray-800">{item.name}</h3>
                    <p className="mt-2 font-bold text-emerald-600">Rp {item.price}</p>
                    <p className="mt-1 text-xs text-gray-400">⭐ {item.rating} · {item.sold}+ terjual</p>
                    <button
                      type="button"
                      onClick={() => navigate(`/productdetail/${item.id}`)}
                      className="mt-3 w-full rounded-lg bg-gray-900 py-2 text-xs font-semibold text-white transition hover:bg-amber-500"
                    >
                      Beli sekarang
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="my-12 grid gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-5 sm:grid-cols-3">
            {[
              [ShieldCheck, "Produk terpercaya", "Pilihan berkualitas untukmu"],
              [Truck, "Pengiriman cepat", "Pesanan diproses setiap hari"],
              [Heart, "Pilihan sepenuh hati", "Melayani dengan pelayanan terbaik"],
            ].map(([Icon, title, description]) => (
              <div key={title as string} className="flex items-center gap-3">
                <Icon className="h-7 w-7 shrink-0 text-amber-600" />
                <div>
                  <p className="font-semibold text-gray-800">{title as string}</p>
                  <p className="text-xs text-gray-500">{description as string}</p>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}

export default ProductList;
