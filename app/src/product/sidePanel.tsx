import { Minus, Plus, Heart, MessageSquare, Share2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type SidePanelProps = {
  product: {
    id: number;
    name: string;
    image: string;
    price: string;
    description?: string;
    rating: number;
    sold: number;
    location: string;
    varian: string | string[];
  };
};

function SidePanel({ product }: SidePanelProps) {
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const increaseQty = () => setQty((prev) => prev + 1);

  const decreaseQty = () => {
    if (qty > 1) {
      setQty((prev) => prev - 1);
    }
  };

  const price = Number(product.price.replace(/\./g, ""));
  const subtotal = qty * price;

  const addToCart = async () => {
    setMessage("");
    const token = window.localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const authHeaders = { Authorization: "Bearer " + token };
      const productsResponse = await fetch("http://localhost:3000/cart");
      if (!productsResponse.ok)
        throw new Error("Gagal mengambil daftar produk");

      const products = (await productsResponse.json()) as {
        id: number;
        name: string;
      }[];
      let productId = products.find((item) => item.name === product.name)?.id;

      if (!productId) {
        const createResponse = await fetch("http://localhost:3000/cart", {
          method: "POST",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({
            ...product,
            variant: Array.isArray(product.varian)
              ? product.varian
              : [product.varian],
            stock: 999,
          }),
        });
        if (!createResponse.ok) throw new Error("Produk gagal disimpan");

        const createdProduct = (await createResponse.json()) as { id?: number };
        productId = createdProduct.id;
      }

      if (!productId) throw new Error("ID produk tidak ditemukan");

      const response = await fetch("http://localhost:3000/cart", {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: qty }),
      });
      if (!response.ok) throw new Error("Gagal menambahkan produk");

      setMessage("Produk masuk ke keranjang.");
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      console.error("Error addToCart:", error);
    }
  };

  return (
    <>
      <div className="w-[350px] border border-gray-300 rounded-2xl p-5 bg-white">
        {/* TITLE */}
        <h3 className="text-2xl font-bold">Atur jumlah dan catatan</h3>

        {/* PRODUCT */}
        <div className="flex items-center gap-4 mt-6">
          <img
            src={product.image}
            alt="product"
            className="w-20 h-20 rounded-lg object-cover"
          />

          <div>
            <p className="text-xl leading-6">
              {product.name}
              <br />
              Parfum pilihan
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
            Stok: <span className="font-bold">Tersedia</span>
          </p>
        </div>

        {/* PRICE */}
        <div className="mt-8">
          <div className="flex justify-between items-center mt-2">
            <p className="text-2xl text-gray-600">Subtotal</p>

            <p className="text-2xl font-bold">
              Rp{subtotal.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* BUTTON */}
        <div className="mt-8 flex flex-col gap-4">
          <button
            onClick={addToCart}
            className="w-full bg-slate-900 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl text-xl transition"
          >
            + Keranjang
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="w-full border-2 border-amber-500 text-amber-600 hover:bg-amber-50 font-bold py-4 rounded-2xl text-xl transition"
          >
            Beli Langsung
          </button>
          {message && (
            <p className="text-center text-sm text-emerald-600">{message}</p>
          )}
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
