import { useState } from "react";
import axios from "axios";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // logic login di sini
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>
          <p className="text-sm text-gray-600 mt-2">
            Masuk ke akun kamu untuk melanjutkan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email / Username
            </label>
            <input
              id="email"
              type="text"
              placeholder="Masukkan email atau username"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
              autoComplete="username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-20 text-gray-800 placeholder-gray-400 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-green-600 hover:text-green-700"
              >
                {showPassword ? "Sembunyi" : "Lihat"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              Ingat saya
            </label>

            <a
              href="#"
              className="font-medium text-green-600 hover:text-green-700"
            >
              Lupa password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-green-700 active:scale-[0.99]"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <a
              href="#"
              className="font-semibold text-green-600 hover:text-green-700"
            >
              Daftar
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
