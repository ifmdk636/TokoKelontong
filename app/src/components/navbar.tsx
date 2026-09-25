import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  LogOut,
  Search,
  Settings,
  ShoppingCart,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type UserProfile = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
};

function Navbar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<UserProfile | null>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const loadAuth = () => {
    setIsAuthenticated(Boolean(window.localStorage.getItem("authToken")));
  };

  const loadCartCount = () => {
    const token = window.localStorage.getItem("authToken");
    if (!token) {
      setCartCount(0);
      return;
    }

    fetch("http://localhost:3000/cart", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((response) => (response.ok ? response.json() : []))
      .then((items: { quantity: number }[]) =>
        setCartCount(items.reduce((sum, item) => sum + item.quantity, 0)),
      )
      .catch(() => setCartCount(0));
  };

  useEffect(() => {
    const storedHistory = window.localStorage.getItem("searchHistory");
    if (storedHistory) {
      const parsed: unknown = JSON.parse(storedHistory);
      if (Array.isArray(parsed)) {
        setHistory(
          parsed.filter((item): item is string => typeof item === "string"),
        );
      }
    }
    loadAuth();
    loadCartCount();
    window.addEventListener("auth-changed", loadAuth);
    window.addEventListener("auth-changed", loadCartCount);
    window.addEventListener("cart-updated", loadCartCount);
    return () => {
      window.removeEventListener("auth-changed", loadAuth);
      window.removeEventListener("auth-changed", loadCartCount);
      window.removeEventListener("cart-updated", loadCartCount);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/myprofile", {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("authToken")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Gagal mengambil data pengguna");
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const closeMenus = (event: MouseEvent) => {
      if (
        historyRef.current &&
        !historyRef.current.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    const updated = [value, ...history.filter((item) => item !== value)].slice(
      0,
      5,
    );
    setHistory(updated);
    window.localStorage.setItem("searchHistory", JSON.stringify(updated));
    setShowHistory(false);
  };

  const logout = () => {
    window.localStorage.removeItem("authToken");
    window.localStorage.removeItem("authUser");
    setShowProfile(false);
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login");
  };

  return (
    <header className="flex h-[76px] w-full items-center justify-between border-b border-slate-200 bg-white px-6">
      <a href="/" className="flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-black text-white">
          TK
        </span>
        <span className="hidden text-xl font-bold sm:block">
          <span className="text-slate-900">Toko</span>
          <span className="text-amber-600">Kelontong</span>
        </span>
      </a>

      <div ref={historyRef} className="relative hidden md:block">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setShowHistory(true)}
              placeholder="Cari parfum favorit..."
              className="w-[300px] rounded-2xl border border-slate-200 bg-white py-2 pl-9 pr-4 outline-none focus:border-amber-400"
            />
          </div>
          <button
            type="submit"
            className="rounded-2xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
          >
            Search
          </button>
        </form>
        {showHistory && history.length > 0 && (
          <div className="absolute top-12 z-50 w-full rounded-xl border border-slate-100 bg-white p-3 shadow-lg">
            {history.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setQuery(item);
                  setShowHistory(false);
                }}
                className="block w-full truncate py-2 text-left text-sm text-slate-600 hover:text-amber-600"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <button
              type="button"
              onClick={() => navigate("/cart")}
              aria-label="Buka keranjang belanja"
              className="relative rounded-full border border-slate-200 p-2.5 text-slate-700 hover:border-amber-400 hover:text-amber-600"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setShowProfile((value) => !value)}
                className="flex items-center gap-2 rounded-full border border-slate-200 py-1.5 pl-1.5 pr-3 hover:border-amber-400"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                  {user?.name?.charAt(0) || "FK"}
                </span>
                <span className="hidden text-sm font-medium text-slate-700 md:block">
                  {user?.name}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </button>
              {showProfile && (
                <div className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
                  <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-sm font-bold text-slate-900">
                      <span className="truncate">{user?.name}</span>
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user?.email || "faris636@gmail.com"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/myprofile")}
                    className="flex w-full gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50"
                  >
                    <User className="h-4 w-4 text-slate-500" /> Profil Saya
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/settings")}
                    className="flex w-full gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50"
                  >
                    <Settings className="h-4 w-4 text-slate-500" /> Pengaturan
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full gap-3 border-t border-slate-100 px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" /> Keluar
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Masuk
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
