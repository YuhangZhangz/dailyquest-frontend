import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Home,
  ClipboardCheck,
  Gift,
  TrendingUp,
  BarChart3,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Flame,
} from "lucide-react";
import logo from "../assets/logo.png";
import "../styles/Sidebar.css";

type SidebarProps = {
  dailyStreak: number;
};

function Sidebar({ dailyStreak }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const storedCollapsed = window.sessionStorage.getItem("sidebar-collapsed");
    return storedCollapsed === "true";
  });

  useEffect(() => {
    document.body.classList.add("has-sidebar");

    return () => {
      document.body.classList.remove("has-sidebar");
      document.documentElement.style.removeProperty("--sidebar-width");
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      collapsed ? "84px" : "260px"
    );
    window.sessionStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const navItems = [
    { label: "Dashboard", icon: Home, path: "/dashboard" },
    { label: "Quests", icon: ClipboardCheck, path: "/tasks" },
    { label: "Rewards", icon: Gift, path: "/rewards" },
    { label: "Progress", icon: TrendingUp, path: "/progress" },
    { label: "Stats", icon: BarChart3, path: "/stats" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className={`sidebar-header ${collapsed ? "collapsed-header" : ""}`}>
        {!collapsed && (
          <div className="sidebar-brand">
            <img src={logo} alt="DailyQuest logo" className="sidebar-logo" />

            <div>
              <strong>DQ</strong>
              <span>DailyQuest</span>
            </div>
          </div>
        )}

        <button
          className="sidebar-icon-button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
          type="button"
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-nav-item${isActive ? " active" : ""}`
              }
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {!collapsed && (
        <section className="sidebar-streak-card">
          <div className="sidebar-streak-top">
            <Flame size={34} fill="currentColor" />

            <div>
              <strong>{dailyStreak}</strong>
              <span>Days</span>
            </div>
          </div>

          <p>Current Streak</p>

          <div className="mini-calendar">
            <div className="mini-calendar-week">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                <span key={`${day}-${index}`}>{day}</span>
              ))}
            </div>

            <div className="mini-calendar-days">
              {Array.from({ length: 14 }).map((_, index) => (
                <span
                  key={index}
                  className={index < dailyStreak ? "checked" : ""}
                >
                  {index + 16}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}
    </aside>
  );
}

export default Sidebar;