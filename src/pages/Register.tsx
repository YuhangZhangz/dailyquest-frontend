import { useState } from "react";
import api from "../api/axios";
import "../styles/Auth.css";
import TopBar from "../components/AuthTopBar";
import { Eye, EyeOff } from "lucide-react";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleRegister(
    e: React.SyntheticEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setError("");

    let hasError = false;

    if (!username) {
      setUsernameError("Username is required.");
      hasError = true;
    }

    if (!email) {
      setEmailError("Email is required.");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    }

    if (password && password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      hasError = true;
    }

    if (hasError) return;
    try {
      await api.post("/auth/register", {
        username,
        email,
        password,
      });

      window.location.href = "/tasks";
    } catch (err: any) {
      const rawMessage = err.response?.data?.message || "Register failed";

      const cleanedMessage = rawMessage
        .replace(/^\[/, "")
        .replace(/\]$/, "")
        .replace(/^password:\s*/i, "")
        .replace(/^email:\s*/i, "")
        .replace(/^username:\s*/i, "");

      setError(cleanedMessage);
      console.error(err);
    }
  }

  return (
    <div className="login-page">
      <TopBar />

      <div className="login-content">
        <form className="login-card" onSubmit={handleRegister}>
          <h1>Create Account</h1>
          <p>Start your DailyQuest journey.</p>
          <div className="floating-field">
            <input
              type="text"
              placeholder=" "
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");}}
            />
            <label>Username</label>
          </div>
          {usernameError && <div className="field-error">{usernameError}</div>}

          <div className="floating-field">
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");}}
            />
            <label>Email</label>
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
          
          <button type="submit">Register</button>

          <p>
            Already have an account? <a href="/">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;