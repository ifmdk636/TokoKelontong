import Data from "../../data/productList";
import SidePanel from "./sidePanel";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Carousel from "../components/Carousel";
import OtherProducts from "./otherProducts";

function DetailProduct() {
  const { id } = useParams();

  const result = Data.find((item) => item.id === Number(id));

  const [varian, setVarian] = useState(result?.varian?.[0] || "");

  if (!result) {
    return <div className="text-center mt-10">Produk tidak ditemukan!</div>;
  }

  const relatedProducts = Data.filter((item) => item.id !== result.id);

  return (
    <div className="flex justify-center gap-10 px-10 py-8 bg-white">
      {/* LEFT SECTION */}
      <div className="flex flex-col w-[720px]">
        {/* Main Image */}
        <div className="w-[700px] h-[700px] bg-[#f5f5f5] rounded-2xl overflow-hidden">
          <img
            src={result.image}
            alt={result.description}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thumbnail Carousel */}
        <div className="mt-5 w-full">
          <Carousel
            items={relatedProducts}
            scrollAmount={300}
            renderItem={(item) => (
              <div className="min-w-[95px]">
                <div className="rounded-lg overflow-hidden border bg-[#f5f5f5] hover:border-black transition cursor-pointer">
                  <img
                    src={item.image}
                    alt={item.description}
                    className="w-[95px] h-[95px] object-cover"
                  />
                </div>
              </div>
            )}
          />
        </div>

        {/* Other Products */}
        <div className="mt-10">
          <OtherProducts />
        </div>
      </div>

      {/* PRODUCT DETAIL */}
      <div className="flex flex-col w-[420px]">
        <h1 className="text-3xl font-semibold text-gray-800">{result.name}</h1>

        <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
          <span>Terjual</span>
          <span>{result.sold}</span>
        </div>

        {/* PRICE */}
        <h2 className="mt-6 text-4xl font-bold text-black">Rp{result.price}</h2>

        {/* VARIANT */}
        <div className="mt-6">
          <p className="text-lg font-semibold">
            Pilih warna:
            <span className="text-gray-500 font-normal ml-2">{varian}</span>
          </p>

          {/* Variant List */}
          <div className="flex flex-wrap gap-3 mt-4">
            {result.varian.map((item, index) => (
              <button
                key={index}
                onClick={() => setVarian(item)}
                className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-2
                ${
                  varian === item
                    ? "border-green-500 bg-green-50 text-green-600"
                    : "border-gray-300 bg-white text-gray-600 hover:border-gray-500"
                }`}
              >
                {/* Thumbnail kecil */}
                <div className="w-6 h-6 rounded overflow-hidden bg-gray-100">
                  <img
                    src={result.image}
                    alt={item}
                    className="w-full h-full object-cover"
                  />
                </div>

                <span className="text-sm font-medium">{item}</span>

                {/* Check Icon */}
                {varian === item && (
                  <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px]">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold">Detail Produk</h3>

          <p className="mt-3 text-gray-600 leading-7">{result.description}</p>
        </div>
      </div>

      {/* SIDE PANEL */}
      <div className="sticky top-5 h-fit">
        <SidePanel />
      </div>
    </div>
  );
}

export default DetailProduct;
