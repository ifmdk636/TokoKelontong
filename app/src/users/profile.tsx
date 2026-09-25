import { useNavigate } from "react-router-dom";
import { useRequireAuth } from "../auth/useRequireAuth";
import {
  ShoppingCart,
  Heart,
  Star,
  MapPin,
  Package,
  ChevronRight,
  LogOut,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react"; // Impor useState

type UserProfile = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  stats?: {
    ordersCount?: number;
    wishlistCount?: number;
    reviewsCount?: number;
  };
};

function Profile() {
  const navigate = useNavigate();
  const { checkingAuth, authenticated } = useRequireAuth();

  // 1. State untuk menyimpan data user dari API, loading, dan error
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. useEffect untuk Fetch Data saat komponen dimuat
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/myprofile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data pengguna");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        console.log("Error fetching user data:", err);
        setError(
          err instanceof Error ? err.message : "Gagal mengambil data pengguna",
        );
      } finally {
        setLoading(false);
      }
    };

    if (authenticated) {
      fetchUserData();
    }
  }, [authenticated]);

  if (checkingAuth || !authenticated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Memuat profil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">Terjadi kesalahan: {error}</p>
      </div>
    );
  }

  const menuItems = [
    {
      icon: Package,
      label: "Pesanan Saya",
      desc: "Lihat status pesanan",
      onClick: () => {},
    },
    {
      icon: Heart,
      label: "Wishlist",
      desc: "Produk yang kamu sukai",
      onClick: () => {},
    },
    {
      icon: ShoppingCart,
      label: "Keranjang",
      desc: "Produk di keranjang",
      onClick: () => {},
    },
    {
      icon: MapPin,
      label: "Alamat",
      desc: "Kelola alamat pengiriman",
      onClick: () => {},
    },
    {
      icon: Star,
      label: "Ulasan",
      desc: "Ulasan yang kamu berikan",
      onClick: () => {},
    },
  ];

  // Helper untuk inisial nama jika foto tidak ada
  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 via-amber-400 to-yellow-300 pt-8 pb-20 px-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-white/80 hover:text-white text-sm mb-4 cursor-pointer"
          >
            &larr; Kembali
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-lg mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <div className="flex items-center gap-4">
            {/* Avatar Dinamis */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(user?.name)
              )}
            </div>

            {/* Nama & Email Dinamis */}
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">
                {user?.name || "Nama Pengguna"}
              </h1>
              <p className="text-sm text-gray-500">
                {user?.email || "email@domain.com"}
              </p>
              <div className="flex items-center gap-1 mt-1"></div>
            </div>
          </div>

          {/* Stats Dinamis */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {user?.stats?.ordersCount ?? 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Pesanan</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {user?.stats?.wishlistCount ?? 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Wishlist</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {user?.stats?.reviewsCount ?? 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Ulasan</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { icon: "💳", label: "Saldo" },
            { icon: "🎫", label: "Voucher" },
            { icon: "⭐", label: "Poin" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-xl p-3 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs text-gray-700 font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Menu List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          {menuItems.map((item, i) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition cursor-pointer ${
                i !== menuItems.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-amber-600" />
              </div>

              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>

              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition border-b border-gray-100 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>

            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-gray-900">Pengaturan</p>
              <p className="text-xs text-gray-500">Atur akun dan preferensi</p>
            </div>

            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              localStorage.removeItem("authUser");
              navigate("/login", { replace: true });
            }}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>

            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-red-500">Keluar</p>{" "}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
