import { useState, useEffect, useRef } from "react";
import { profileUtils } from "../utils/profile";

function Navbar() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const historyRef = useRef(null);

  // Component avatar
  const ProfileAvatar = profileUtils?.avatarIcon;
  // Load history
  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];

    setHistory(savedHistory);
  }, []);

  // Close dropdown ketika klik luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (historyRef.current && !historyRef.current.contains(event.target)) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Submit Search
  const handleSearch = (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    const updatedHistory = [
      query,
      ...history.filter((item) => item !== query),
    ].slice(0, 5);

    setHistory(updatedHistory);

    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));

    setShowHistory(false);

    console.log("Search:", query);
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("searchHistory");
  };

  return (
    <div className="flex items-center justify-between w-full h-[120px] bg-amber-500 px-8">
      {/* Logo */}
      <a href="/product" className="text-2xl font-bold">
        TokoKelontong
      </a>
      {/* Search */}
      <div className="relative flex flex-col items-center" ref={historyRef}>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowHistory(true)}
            placeholder="Search..."
            className="w-[300px] border border-gray-300 rounded-2xl px-4 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="bg-blue-400 hover:bg-blue-500 transition text-white px-4 py-2 rounded-2xl cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* History Dropdown */}
        {showHistory && history.length > 0 && (
          <div className="absolute top-14 left-0 w-full bg-white rounded-xl shadow-lg p-3 z-50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold">Riwayat Pencarian</h3>

              <button
                onClick={clearHistory}
                className="text-xs text-red-500 hover:underline"
              >
                Hapus Semua
              </button>
            </div>

            <ul className="divide-y divide-gray-200">
              {history.map((item, index) => (
                <li
                  key={index}
                  className="py-2 flex items-center justify-between text-sm"
                >
                  <span className="truncate">{item}</span>

                  <button
                    onClick={() => {
                      setQuery(item);
                      setShowHistory(false);
                    }}
                    className="text-blue-500 text-xs hover:underline"
                  >
                    Isi
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* Avatar */}
      {ProfileAvatar && <ProfileAvatar />}
    </div>
  );
}

export default Navbar;
