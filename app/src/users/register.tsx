import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function Register() {
  const navigate = useNavigate();

  // Deklarasi Useform
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  // submit
  const onSubmit = async (register, e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/users",
        register,
      );
      console.log(response);
      if (response) {
        alert("Register berhasil!");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      console.log(error);
      alert("Terjadi kesalahan saat register");
    } finally {
      console.log("Request completed");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl p-6 bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-100 mb-4 to-emerald-100 px-8 py-6 rounded-3xl">
          <h1 className="text-3xl font-bold text-gray-800">Register</h1>

          <p className="text-sm text-gray-600 mt-2">
            Buat akun baru untuk melanjutkan.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* EMAIL */}
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>

          <input
            type="text"
            id="email"
            placeholder="Masukkan Email"
            className="w-full mb-2 rounded-xl border border-gray-300 bg-white px-4 py-3"
            autoComplete="email"
            {...register("email", {
              required: "Email wajib diisi",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Format email tidak valid",
              },
            })}
          />

          {errors.email && (
            <p className="text-red-500 text-sm mb-4">{errors.email.message}</p>
          )}

          {/* USERNAME */}
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Username
          </label>

          <input
            type="text"
            id="username"
            placeholder="Masukkan Username"
            className="w-full mb-2 rounded-xl border border-gray-300 bg-white px-4 py-3"
            {...register("username", {
              required: "Username wajib diisi",
              minLength: {
                value: 3,
                message: "Username minimal 3 karakter",
              },
            })}
          />

          {errors.username && (
            <p className="text-red-500 text-sm mb-4">
              {errors.username.message}
            </p>
          )}

          {/* PHONE */}
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone
          </label>

          <input
            type="text"
            id="phone"
            placeholder="Masukkan Nomor Handphone"
            className="w-full mb-2 rounded-xl border border-gray-300 bg-white px-4 py-3"
            {...register("phone", {
              required: "Nomor HP wajib diisi",
              minLength: {
                value: 10,
                message: "Nomor HP minimal 10 digit",
              },
            })}
          />

          {errors.phone && (
            <p className="text-red-500 text-sm mb-4">{errors.phone.message}</p>
          )}

          {/* PASSWORD */}
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>

          <input
            type="password"
            id="password"
            placeholder="Masukkan Password"
            className="w-full mb-2 rounded-xl border border-gray-300 bg-white px-4 py-3"
            {...register("password", {
              required: "Password wajib diisi",
              minLength: {
                value: 6,
                message: "Password minimal 6 karakter",
              },
            })}
          />

          {errors.password && (
            <p className="text-red-500 text-sm mb-4">
              {errors.password.message}
            </p>
          )}
          <p className="text-center text-sm text-gray-600">
            Sudah Punya Akun?{" "}
            <a
              href="/login"
              className="font-semibold text-green-600 hover:text-green-700"
            >
              Login
            </a>
          </p>
          {/* BUTTON */}
          <button
            type="submit"
            className="w-full mt-4 cursor-pointer bg-amber-200 p-3 rounded-2xl hover:bg-amber-300 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
