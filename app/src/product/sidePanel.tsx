import { Minus, Plus, Heart, MessageSquare, Share2 } from "lucide-react";
import { useState } from "react";

function SidePanel() {
  const [qty, setQty] = useState(1);

  const increaseQty = () => setQty((prev) => prev + 1);

  const decreaseQty = () => {
    if (qty > 1) {
      setQty((prev) => prev - 1);
    }
  };

  const price = 120000;
  const subtotal = qty * price;

  return (
    <>
      <div className="w-[350px] border border-gray-300 rounded-2xl p-5 bg-white">
        {/* TITLE */}
        <h3 className="text-2xl font-bold">Atur jumlah dan catatan</h3>

        {/* PRODUCT */}
        <div className="flex items-center gap-4 mt-6">
          <img
            // src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800"
            alt="product"
            className="w-20 h-20 rounded-lg object-cover"
          />

          <div>
            <p className="text-xl leading-6">
              Klasik Hitam, 35-36 fit
              <br />
              22.5cm foot
            </p>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t my-6"></div>

        {/* QTY */}
        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded-xl overflow-hidden">
            <button
              onClick={decreaseQty}
              className="w-12 h-12 flex items-center justify-center text-gray-400 hover:bg-gray-100"
            >
              <Minus size={18} />
            </button>

            <div className="w-12 text-center text-xl">{qty}</div>

            <button
              onClick={increaseQty}
              className="w-12 h-12 flex items-center justify-center text-green-500 hover:bg-gray-100"
            >
              <Plus size={18} />
            </button>
          </div>

          <p className="text-xl">
            Stok: <span className="font-bold">542</span>
          </p>
        </div>

        {/* PRICE */}
        <div className="mt-8">
          <p className="text-right text-gray-400 line-through text-lg">
            Rp220.000
          </p>

          <div className="flex justify-between items-center mt-2">
            <p className="text-2xl text-gray-600">Subtotal</p>

            <p className="text-4xl font-bold">
              Rp{subtotal.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* BUTTON */}
        <div className="mt-8 flex flex-col gap-4">
          <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl text-xl transition">
            + Keranjang
          </button>

          <button className="w-full border-2 border-green-500 text-green-500 hover:bg-green-50 font-bold py-4 rounded-2xl text-xl transition">
            Beli Langsung
          </button>
        </div>

        {/* FOOTER ACTION */}
        <div className="flex justify-around items-center mt-8 text-lg">
          <button className="flex items-center gap-2 hover:text-green-500 transition">
            <MessageSquare size={20} />
            Chat
          </button>

          <button className="flex items-center gap-2 hover:text-green-500 transition">
            <Heart size={20} />
            Wishlist
          </button>

          <button className="flex items-center gap-2 hover:text-green-500 transition">
            <Share2 size={20} />
            Share
          </button>
        </div>
      </div>
    </>
  );
}

export default SidePanel;
