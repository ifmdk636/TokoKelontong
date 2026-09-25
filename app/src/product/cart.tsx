import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Navbar from "../components/navbar";
import { useRequireAuth } from "../auth/useRequireAuth";

type CartItem = {
  id: number;
  product_id: number;
  name: string;
  image: string;
  price: string;
  quantity: number;
};

const API_URL = "http://localhost:3000";

function Cart() {
  const { checkingAuth, authenticated } = useRequireAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    const token = window.localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }
    const response = await fetch(`${API_URL}/cart`, {
      headers: { Authorization: "Bearer " + token },
    });
    if (response.ok) setItems(await response.json());
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) {
      loadCart().catch(() => setLoading(false));
    }
  }, [authenticated]);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + Number(String(item.price).replace(/\./g, "")) * item.quantity,
        0,
      ),
    [items],
  );

  if (checkingAuth || !authenticated) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  const updateQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) return;
    const token = window.localStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/cart/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ quantity }),
    });
    if (response.ok) setItems(await response.json());
  };

  const removeItem = async (id: number) => {
    const token = window.localStorage.getItem("authToken");
    const response = await fetch(`${API_URL}/cart/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
    if (response.ok) setItems(await response.json());
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
              Pesananmu
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Keranjang belanja
            </h1>
          </div>

          {loading ? (
            <p className="text-slate-500">Memuat keranjang...</p>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-amber-500" />
              <h2 className="mt-4 text-xl font-bold text-slate-900">
                Keranjang masih kosong
              </h2>
              <p className="mt-2 text-slate-500">
                Yuk pilih parfum favoritmu dan tambahkan ke keranjang.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h2 className="font-semibold text-slate-900">
                        {item.name}
                      </h2>
                      <p className="mt-1 font-bold text-emerald-600">
                        Rp {item.price}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="rounded-lg border border-slate-200 p-1.5 hover:border-amber-400"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="rounded-lg border border-slate-200 p-1.5 hover:border-amber-400"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Hapus ${item.name}`}
                      className="self-start rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
              <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-lg font-bold text-slate-900">
                  Ringkasan pesanan
                </h2>
                <div className="mt-5 flex justify-between text-sm text-slate-500">
                  <span>Total produk</span>
                  <span>
                    {items.reduce((sum, item) => sum + item.quantity, 0)} item
                  </span>
                </div>
                <div className="mt-4 flex justify-between border-t border-slate-100 pt-4">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="font-bold text-emerald-600">
                    Rp {total.toLocaleString("id-ID")}
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-5 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white hover:bg-slate-700"
                >
                  Lanjutkan pembelian
                </button>
              </aside>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Cart;
