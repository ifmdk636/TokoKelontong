import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Moon,
  ChevronRight,
} from "lucide-react";
import { useRequireAuth } from "../auth/useRequireAuth";
import { useEffect } from "react";

type UserProfile = {
  id: number;
  name: string;
  email: string;
  phone?: string;
};

function Settings() {
  const navigate = useNavigate();
  const { checkingAuth, authenticated } = useRequireAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  if (checkingAuth || !authenticated) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  useEffect(() => {
    const fetchData = async () => {
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
        console.log("Data pengguna:", data);
      } catch (err) {
        console.log("Error fetching user data:", err);
      }
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          <h1 className="text-lg font-bold text-gray-900">Pengaturan</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Profil
            </h2>
          </div>

          <div className="px-5 pb-4 space-y-1">
            <button className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <User className="w-5 h-5 text-amber-600" />
              </div>

              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900">
                  Edit Profil
                </p>
                <p className="text-xs text-gray-500">Nama, foto, bio</p>
              </div>

              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <div className="flex items-center gap-4 p-3 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-lg">📧</span>
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Email</p>
                <p className="text-xs text-gray-500">faris636@gmail.com</p>
              </div>

              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                Terverifikasi
              </span>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-lg">📱</span>
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  Nomor Telepon
                </p>
                <p className="text-xs text-gray-500">0812-3456-7890</p>
              </div>

              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Keamanan
            </h2>
          </div>

          <div className="px-5 pb-4 space-y-1">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Lock className="w-5 h-5 text-blue-600" />
              </div>

              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900">
                  Ubah Password
                </p>
                <p className="text-xs text-gray-500">
                  {showPassword ? "••••••••" : "Terakhir diubah 30 hari lalu"}
                </p>
              </div>

              {showPassword ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Preferensi
            </h2>
          </div>

          <div className="px-5 pb-4 space-y-1">
            {/* Notifications Toggle */}
            <div className="flex items-center gap-4 p-3 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-purple-600" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  Notifikasi
                </p>
                <p className="text-xs text-gray-500">
                  Email dan push notifikasi
                </p>
              </div>

              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  notifications ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-transform ${
                    notifications ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center gap-4 p-3 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <Moon className="w-5 h-5 text-indigo-600" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  Mode Gelap
                </p>
                <p className="text-xs text-gray-500">Tampilan tema gelap</p>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  darkMode ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-transform ${
                    darkMode ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Language */}
            <button className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                <Globe className="w-5 h-5 text-teal-600" />
              </div>

              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-900">Bahasa</p>
                <p className="text-xs text-gray-500">Indonesia</p>
              </div>

              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="px-5 py-4">
            <h2 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">
              Akun
            </h2>
          </div>

          <div className="px-5 pb-4">
            <button className="w-full py-3 rounded-xl border-2 border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 transition cursor-pointer">
              Hapus Akun
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
