import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Auth.css";
import { Eye, EyeOff } from "lucide-react";
import AuthTopBar from "../components/layout/TopBar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      window.location.replace("/tasks");
    }
  }, []);

  async function handleLogin(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!email) {
      setEmailError("This Email is required.");
      hasError = true;
    }

    if (!password) {
      setPasswordError("This Password is required.");
      hasError = true;
    }

    if (hasError) return;

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/tasks";
    } catch (err) {
      setError("Invalid email or password");
      console.error(err);
    }
  }

  return (
    <div className="login-page">
      <AuthTopBar />

      <div className="login-content">
        <form className="login-card" onSubmit={handleLogin}>
          <h1>DailyQuest</h1>
          <p>Log in to continue your quests.</p>

          <div className="floating-field">
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
                setError("");
              }}
            />
            <label>Email address</label>
          </div>
          {emailError && <div className="field-error">{emailError}</div>}

          <div className="password-wrapper">
            <div className="floating-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder=" "
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                  setError("");
                }}
              />
              <label>Password</label>
            </div>

            <button
              type="button"
              className="password-icon-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {passwordError && <div className="field-error">{passwordError}</div>}

          {error && <div className="login-error">{error}</div>}

          <button type="submit">Login</button>

          <p>
            Don&apos;t have an account? <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;