import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import logo from "../assets/logo.png";
import "../styles/Auth.css";

type AuthTopBarProps = {
  showLogout?: boolean;
  username?: string;

  // When the page has a sidebar, hide the top-left logo
  hideBrand?: boolean;
};

function AuthTopBar({
  showLogout = false,
  username,
  hideBrand = false,
}: AuthTopBarProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Clear token and redirect to login page for logging out
  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  // Close dropdown when user clicks outside the profile menu
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Use username first letter as avatar text
  const displayName = username || "User";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <header className={`auth-top-bar ${hideBrand ? "brand-hidden" : ""}`}>
      {!hideBrand && (
        <a href={showLogout ? "/tasks" : "/"} className="auth-logo">
          <img src={logo} alt="DailyQuest Logo" />
        </a>
      )}

      {showLogout && (
        <div className="user-menu" ref={menuRef}>
          {/* Profile button: avatar + username + dropdown arrow */}
          <button
            className="user-profile-btn"
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Open user menu"
          >
            <span className="user-avatar">{avatarLetter}</span>

            <span className="user-name">{displayName}</span>

            <ChevronDown
              className={`user-chevron ${open ? "open" : ""}`}
              size={18}
              strokeWidth={2.4}
            />
          </button>

          {/* Dropdown menu */}
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