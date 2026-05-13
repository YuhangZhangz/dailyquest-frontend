import logo from "../assets/logo.png";
import "../styles/AuthTopBar.css";

function AuthTopBar() {
  return (
    <header className="auth-top-bar">
      <a href="/" className="auth-logo">
        <img src={logo} alt="DailyQuest Logo" />
      </a>
    </header>
  );
}

export default AuthTopBar;