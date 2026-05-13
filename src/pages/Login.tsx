import React, { useState } from "react";
import api from "../api/axios";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setError("");

    let hasError = false;

    if (!email) {
      setEmailError("This input is required.");
      hasError = true;
    }

    if (!password) {
      setPasswordError("This input is required.");
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
      <form className="login-card" onSubmit={handleLogin}>
        <h1>DailyQuest</h1>
        <p>Log in to continue your quests.</p>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
        />
        {emailError && <div className="field-error">{emailError}</div>}

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError("");
          }}
        />
        {passwordError && <div className="field-error">{passwordError}</div>}
        
        <div className="login-error-slot">
          {error && <div className="login-error">{error}</div>}
        </div>
        
        <button type="submit">Login</button>

        <p>
          Don&apos;t have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}

export default Login;