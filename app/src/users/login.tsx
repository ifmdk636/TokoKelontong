import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type LoginValues = { email: string; password: string };
type LoginErrors = Partial<Record<keyof LoginValues, string>>;
type LoginResponse = {
  token: string;
  user: { id: number; username: string; email: string };
};

function validate(values: LoginValues): LoginErrors {
  const errors: LoginErrors = {};
  const email = values.email.trim();
  if (!email) errors.email = "Email wajib diisi";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Format email tidak valid";
  if (!values.password) errors.password = "Password wajib diisi";
  else if (values.password.length < 6)
    errors.password = "Password minimal 6 karakter";
  return errors;
}

function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string") return message;
  }
  return "Tidak dapat terhubung ke server. Silakan coba lagi.";
}

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState<LoginValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateValue = (field: keyof LoginValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerError("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setServerError("");
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      if (!response.data.token) throw new Error("Token login tidak tersedia");
      window.localStorage.setItem("authToken", response.data.token);
      window.localStorage.setItem(
        "authUser",
        JSON.stringify(response.data.user),
      );
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/", { replace: true });
    } catch (error: unknown) {
      console.error("Error login:", error);
      setServerError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-green-50 px-4 py-10">
      <section className="w-full max-w-md overflow-hidden rounded-3xl border border-green-100 bg-white shadow-xl">
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>
          <p className="mt-2 text-sm text-gray-600">
            Masuk ke akun kamu untuk melanjutkan.
          </p>
        </div>
        <form onSubmit={submit} noValidate className="space-y-5 px-8 py-7">
          {serverError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {serverError}
            </div>
          )}
          <div>
            <label
              htmlFor="login-email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => updateValue("email", event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              placeholder="Masukkan email"
              className={`w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:ring-2 ${errors.email ? "border-red-400 focus:ring-red-100" : "border-gray-300 focus:border-green-500 focus:ring-green-100"}`}
            />
            {errors.email && (
              <p id="login-email-error" className="mt-1 text-sm text-red-500">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="login-password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={values.password}
                onChange={(event) =>
                  updateValue("password", event.target.value)
                }
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "login-password-error" : undefined
                }
                placeholder="Masukkan password"
                className={`w-full rounded-xl border bg-white px-4 py-3 pr-20 outline-none transition focus:ring-2 ${errors.password ? "border-red-400 focus:ring-red-100" : "border-gray-300 focus:border-green-500 focus:ring-green-100"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-green-600"
              >
                {showPassword ? "Sembunyikan" : "Lihat"}
              </button>
            </div>
            {errors.password && (
              <p
                id="login-password-error"
                className="mt-1 text-sm text-red-500"
              >
                {errors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Memproses..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Login;
