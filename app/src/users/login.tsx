import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Validasi Form
  const validate = (values) => {
    const errors = {};

    // Validasi Email
    if (!values.email) {
      errors.email = "Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    // Validasi Password
    if (!values.password) {
      errors.password = "Required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  // Formik
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validate,

    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/login",
          values,
        );

        // Login berhasil
        if (response.status === 200) {
          console.log(response.data);

          // Simpan status login
          // localStorage.setItem("isLogin", true);

          // Redirect ke halaman product
          navigate("/product");
        }
      } catch (err) {
        console.error("Terjadi kesalahan:", err.response?.data || err.message);

        alert("Email atau password salah");
      }
    },
  });

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>

          <p className="text-sm text-gray-600 mt-2">
            Masuk ke akun kamu untuk melanjutkan.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="px-8 py-7 space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              name="email"
              type="email"
              placeholder="Masukkan email"
              onChange={formik.handleChange}
              value={formik.values.email}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
            />

            {formik.errors.email ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            ) : null}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                onChange={formik.handleChange}
                value={formik.values.password}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-20"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-green-600"
              >
                {showPassword ? "Sembunyi" : "Lihat"}
              </button>
            </div>

            {formik.errors.password ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </div>
            ) : null}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
