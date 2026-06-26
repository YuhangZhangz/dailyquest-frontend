import { useState } from "react";
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
  activePage?: string;
  dailyStreak: number;
};

function Sidebar({ activePage = "Dashboard", dailyStreak }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: "Dashboard", icon: Home },
    { label: "Quests", icon: ClipboardCheck },
    { label: "Rewards", icon: Gift },
    { label: "Progress", icon: TrendingUp },
    { label: "Stats", icon: BarChart3 },
    { label: "Settings", icon: Settings },
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
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.label;

          return (
            <button
              key={item.label}
              className={`sidebar-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </button>
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
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
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