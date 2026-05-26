import { useState } from "react";
import Data from "../../data/Product";

function Card() {
  const [count, setCount] = useState(1);

  function increment() {
    setCount((a) => a + 1);
  }

  function decrement() {
    if (count === 1) {
      return count;
    }
    setCount((a) => a - 1);
  }

  return (
    <>
      <div className="flex justify-center min-h-screen items-center bg-gray-100">
        <div className="w-140 h-auto min-h-80 bg-blue-500 rounded-xl p-4 text-white">
          <div className="flex justify-center mb-4">
            <p className="font-sans text-2xl font-medium">Keranjang Belanja</p>
          </div>

          {Data.map((result) => (
            <div
              key={result.id}
              className="flex items-center mb-4 bg-blue-600 p-3 rounded-lg shadow-md"
            >
              <img
                className="w-32 h-32 rounded-md object-cover flex-shrink-0"
                src={result.body}
                alt="Produk"
              />

              <div className="ml-4 flex flex-col justify-center">
                <p className="text-xl font-semibold">{result.title}</p>
                {/* Kamu bisa menambahkan elemen harga atau deskripsi di bawah sini jika ada */}
                <p className="text-yellow-300 font-bold mt-1">
                  Rp{(result.harga * count).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <div className="flex gap-2 w-20 bg-pink-500 rounded-lg justify-center text-2xl items-end">
              <button
                className="cursor-pointer"
                onClick={() => {
                  decrement();
                }}
              >
                -
              </button>
              <p>{count}</p>
              <button
                className="cursor-pointer"
                onClick={() => {
                  increment();
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;
