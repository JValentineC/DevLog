import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="navbar bg-base-200 shadow-sm px-4">
      <div className="flex-1 gap-3">
        <img
          src={`${import.meta.env.BASE_URL}profile.jpg`}
          alt="Profile photo"
          width="40"
          height="40"
          className="rounded-full"
        />
        <NavLink to="/" className="text-xl font-bold">DevLog</NavLink>
      </div>
      <nav aria-label="Main navigation" className="flex-none">
        <div className="dropdown dropdown-end">
          <button tabIndex={0} className="btn btn-square btn-ghost" aria-label="Open menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-lg">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/entries">Entries</NavLink></li>
            {user && <li><NavLink to="/entries/new">New Entry</NavLink></li>}
            <li><NavLink to="/about">About</NavLink></li>
            {user ? (
              <>
                <li className="menu-title"><em>{user.username}</em></li>
                <li>
                  <button type="button" onClick={logout}>
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <li><NavLink to="/login">Log In</NavLink></li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Header
