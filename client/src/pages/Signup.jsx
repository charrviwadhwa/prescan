
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
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
      await registerUser(form);
      navigate("/login", {
        state: { message: "Account created! Please sign in." },
      });
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to create your account."
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
          Create your account
        </h2>

        <p className="text-sm text-gray-500 mt-2 mb-7">
          Start organizing your prescription records.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Full name
            </label>

            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={100}
              placeholder="Your full name"
              className="w-full border border-[#DCE4DA] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#82B9A2]"
            />
          </div>

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
              minLength={8}
              maxLength={72}
              placeholder="At least 8 characters"
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
            {loading ? "Creating account..." : "Create account"}
          </button>

        </form>

        <p className="text-sm text-center text-gray-500 mt-7">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#527C69] font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>

      </div>
    </main>
  );
}

export default Signup;
