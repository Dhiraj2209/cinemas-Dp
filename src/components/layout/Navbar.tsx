import './navbar.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

interface NavbarProps {
  page: string
}

const Navbar: React.FC<NavbarProps> = ({ page }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    console.log("Logged out successfully")
    navigate('/')
  }
  if (page === "home") {
    return (
      <>
        <div className="navbar">
          <div className='logo'>
            <img src='/logo.png' width={150} />
          </div>
          <div className='btnLink'>
            <ul>
              <li className='active' onClick={() => navigate('/home')}>
                Home
              </li>
              <li onClick={() => navigate('/tickets')}>
                My Ticket
              </li>
            </ul>
          </div>
          <div className='logoutBtn'>
            <button type='submit' onClick={() => handleLogout()}>Logout</button>
          </div>
        </div>
      </>
    )
  }
  else {
    return (
      <>
        <div className="navbar">
          <div className='logo'>
            <img src='/logo.png' width={150} />
          </div>
          <div className='btnLink'>
            <ul>
              <li onClick={() => navigate('/home')}>
                Home
              </li>
              <li className='active' onClick={() => navigate('/tickets')}>
                My Ticket
              </li>
            </ul>
          </div>
          <div className='logoutBtn'>
            <button type='submit' onClick={() => handleLogout()}>Logout</button>
          </div>
        </div>
      </>
    )
  }

}

export default Navbar