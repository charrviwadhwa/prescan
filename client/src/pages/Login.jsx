
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(form);

      localStorage.setItem("prescan_token", data.token);
      localStorage.setItem("prescan_user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F8F1] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-[#E8EBE3] rounded-2xl p-8 sm:p-10">

        <div className="mb-9">
          <h1 className="text-3xl font-semibold tracking-[-1.5px] text-[#34443D]">
            prescan<span className="text-[#82B9A2]">.</span>
          </h1>

          <p className="text-xs uppercase tracking-[2px] text-[#789083] mt-1">
            Prescription records
          </p>
        </div>

        <h2 className="text-2xl font-semibold text-[#34443D]">
          Welcome back
        </h2>

        <p className="text-sm text-gray-500 mt-2 mb-7">
          Sign in to access your prescriptions.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Email address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full border border-[#DCE4DA] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#82B9A2]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full border border-[#DCE4DA] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#82B9A2]"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#527C69] hover:bg-[#426653] disabled:opacity-50 text-white py-3 rounded-lg text-sm font-medium transition"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

        </form>

        <p className="text-sm text-center text-gray-500 mt-7">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#527C69] font-medium hover:underline"
          >
            Create account
          </Link>
        </p>

      </div>
    </main>
  );
}

export default Login;
