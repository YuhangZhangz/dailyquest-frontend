import { useState } from "react";
import api from "../api/axios";
import "../styles/Login.css";
import TopBar from "../components/AuthTopBar";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(
    e: React.SyntheticEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/register", {
        username,
        email,
        password,
      });

      window.location.href = "/";
    } catch (err) {
      setError("Register failed");
      console.error(err);
    }
  }

  return (
    <>
      <TopBar />

      <div className="login-page">
        <form className="login-card" onSubmit={handleRegister}>
          <h1>Create Account</h1>
          <p>Start your DailyQuest journey.</p>

          {error && <div className="login-error">{error}</div>}

          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Register</button>

          <p>
            Already have an account? <a href="/">Login</a>
          </p>
        </form>
      </div>
    </>
  );
}

export default Register;