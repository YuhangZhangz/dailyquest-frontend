import { useEffect, useRef, useState } from "react";
import { UserRound } from "lucide-react";
import logo from "../assets/logo.png";
import "../styles/Auth.css";

type AuthTopBarProps = {
  showLogout?: boolean;
  username?: string;
};

function AuthTopBar({ showLogout = false, username}: AuthTopBarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Clear token and redirect to login page for logging out
  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <header className="auth-top-bar">
      <a href={showLogout ? "/tasks" : "/"} className="auth-logo">
        <img src={logo} alt="DailyQuest Logo" />
      </a>

      {showLogout && (
        <div className="user-menu" ref={menuRef}>
          {username && (
            <span className="user-name">
              {username}
            </span>
          )}

          <button
            className="user-avatar-btn"
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Open user menu"
          >
            <UserRound size={30} strokeWidth={2.2} />
          </button>

          {open && (
            <div className="user-dropdown">

              <button
                className="user-dropdown-item"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default AuthTopBar;