import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";


const res = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

if (!res.ok) {
  const data = await res.json();
  throw new Error(data.message || "Login failed");
}

const data = await res.json();
console.log("Logged in:", data);

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address";
    }
    if (!password) {
      next.password = "Password is required";
    } else if (password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
      await new Promise((resolve) => setTimeout(resolve, 900));
      console.log("Login submitted:", { email, password });
    } catch (err) {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1115] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <div className="w-9 h-9 rounded bg-[#5B8DEF] mb-6 flex items-center justify-center text-white font-semibold text-sm">
            A
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Sign in
          </h1>
          <p className="text-sm text-[#8A8F98] mt-1.5">
            Enter your details to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-[#C4C7CE] mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full bg-[#1A1D23] text-white placeholder-[#5A5F68] text-sm rounded-md px-3.5 py-2.5 border outline-none transition-colors focus:border-[#5B8DEF] ${
                errors.email ? "border-[#E5484D]" : "border-[#2A2D34]"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-[#E5484D] mt-1.5">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm text-[#C4C7CE]">
                Password
              </label>
              <a href="#" className="text-xs text-[#5B8DEF] hover:text-[#7BA3F5] transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-[#1A1D23] text-white placeholder-[#5A5F68] text-sm rounded-md px-3.5 py-2.5 pr-10 border outline-none transition-colors focus:border-[#5B8DEF] ${
                  errors.password ? "border-[#E5484D]" : "border-[#2A2D34]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5F68] hover:text-[#C4C7CE] transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-[#E5484D] mt-1.5">{errors.password}</p>
            )}
          </div>

          {errors.form && (
            <div className="text-xs text-[#E5484D] bg-[#E5484D]/10 border border-[#E5484D]/30 rounded-md px-3 py-2">
              {errors.form}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#5B8DEF] hover:bg-[#4B7DDF] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md py-2.5 transition-colors flex items-center justify-center gap-1.5 mt-6"
          >
            {submitting ? "Signing in…" : "Sign in"}
            {!submitting && <ArrowRight size={15} />}
          </button>
        </form>

        <p className="text-sm text-[#8A8F98] text-center mt-6">
          Don't have an account?{" "}
          <a href="#" className="text-[#5B8DEF] hover:text-[#7BA3F5] transition-colors">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}