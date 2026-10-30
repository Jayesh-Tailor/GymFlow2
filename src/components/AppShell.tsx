import { useState, type ReactNode } from 'react'
import {
  Activity,
  Bell,
  ChevronDown,
  Dumbbell,
  LayoutDashboard,
  Menu,
  UsersRound,
  X,
} from 'lucide-react'

export type PageName = 'dashboard' | 'members'

interface AppShellProps {
  activePage: PageName
  onNavigate: (page: PageName) => void
  children: ReactNode
}

const navigation: { name: string; page: PageName; icon: typeof LayoutDashboard }[] = [
  { name: 'Dashboard', page: 'dashboard', icon: LayoutDashboard },
  { name: 'Members', page: 'members', icon: UsersRound },
]

export default function AppShell({ activePage, onNavigate, children }: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function navigateTo(page: PageName) {
    onNavigate(page)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="app-shell">
      {isMobileMenuOpen && (
        <button
          className="mobile-menu-scrim"
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <aside className={`sidebar ${isMobileMenuOpen ? 'sidebar--open' : ''}`}>
        <div className="brand">
          <span className="brand-mark">
            <Dumbbell size={21} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <span className="brand-name">gym<span>flow</span></span>
          <button
            className="icon-button sidebar-close"
            type="button"
            aria-label="Close navigation"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        <div className="workspace-switcher">
          <span className="workspace-avatar">S</span>
          <span className="workspace-copy">
            <strong>Studio Eight</strong>
            <small>Fitness club</small>
          </span>
          <ChevronDown size={16} aria-hidden="true" />
        </div>

        <span className="nav-section-label">WORKSPACE</span>
        <nav className="primary-nav" aria-label="Main navigation">
          {navigation.map(({ name, page, icon: Icon }) => (
            <button
              key={page}
              className={`nav-link ${activePage === page ? 'nav-link--active' : ''}`}
              type="button"
              aria-current={activePage === page ? 'page' : undefined}
              onClick={() => navigateTo(page)}
            >
              <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
              <span>{name}</span>
              {page === 'members' && <span className="nav-count">1.2k</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-icon">
              <Activity size={17} aria-hidden="true" />
            </span>
            <strong>Keep your momentum</strong>
            <span>Your members showed up 18% more this week.</span>
            <div className="tip-progress"><span /></div>
          </div>
          <button className="profile-button" type="button">
            <span className="profile-avatar">NS</span>
            <span className="profile-copy">
              <strong>Nora Smith</strong>
              <small>Gym owner</small>
            </span>
            <ChevronDown size={16} aria-hidden="true" />
          </button>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <button
            className="icon-button mobile-menu-button"
            type="button"
            aria-label="Open navigation"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={21} aria-hidden="true" />
          </button>
          <div className="breadcrumb">
            <span>Studio Eight</span>
            <span className="breadcrumb-divider">/</span>
            <strong>{activePage === 'dashboard' ? 'Dashboard' : 'Members'}</strong>
          </div>
          <div className="topbar-actions">
            <span className="today-label">Tuesday, October 27</span>
            <button className="icon-button notification-button" type="button" aria-label="Notifications">
              <Bell size={19} aria-hidden="true" />
              <span />
            </button>
            <span className="topbar-avatar" aria-hidden="true">NS</span>
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  )
}
