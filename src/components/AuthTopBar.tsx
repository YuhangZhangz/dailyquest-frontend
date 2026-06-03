import logo from "../assets/logo.png";
import "../styles/Auth.css";

type AuthTopBarProps = {
  showLogout?: boolean;
};

function AuthTopBar({ showLogout = false }: AuthTopBarProps) {
  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <header className="auth-top-bar">
      <a href={showLogout ? "/tasks" : "/"} className="auth-logo">
        <img src={logo} alt="DailyQuest Logo" />
      </a>

      {showLogout && (
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      )}
    </header>
  );
}

export default AuthTopBar;