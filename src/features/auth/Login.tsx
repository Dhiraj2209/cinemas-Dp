import './login1.css'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from "../../auth/AuthContext"
import { useEffect, useState } from 'react'
import { authService } from '../../services/authService'

const Login = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { login, isAuthenticated } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    


    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || "/home"
            navigate(from, { replace: true })
        }
    }, [isAuthenticated, navigate, location])

    const authenticate = async () => {
        // Basic frontend validation
        if (!email || !password) {
            console.warn("Please enter email and password")
            return
        }

        // Email format validation
        const emailRegex = /^\S+@\S+\.\S+$/
        if (!emailRegex.test(email)) {
            console.warn("Please enter a valid email address")
            return
        }

        try {
            const result = await authService.login({ email, password })

            if (result && result.data && result.data.accessToken) {
                const { accessToken, expireAt } = result.data
                login(accessToken, expireAt, email)
                console.log("Login Successful!")

                const from = location.state?.from?.pathname || "/home"
                navigate(from, { replace: true })
            } else {
                console.error(result.data.message || "Login failed")
            }

        } catch (err: any) {
            console.error(err)
            const errorMessage = err.response?.data?.message || err.message || "Something went wrong. Try again."
            if (err.response?.status === 401) {
                console.error("Invalid email or password")
            } else {
                console.error(errorMessage)
            }
        }
    }

    return (
        <>
            <div className="loginContainer">
                <div className='loginLeft'>
                    <img src='logo.png' width={150} alt="Logo" />
                    <br />
                    <div>
                        <h1>
                            <br />
                            Begin your cinematic adventure now
                            with our ticketing platform!
                        </h1>
                    </div>
                </div>

                <div className='loginRight'>
                    <div>
                        <h2>Login To Your Account</h2>
                    </div>

                    <div>
                        <p>Email</p>
                        <input
                            id='email'
                            required
                            type='email'
                            name='email'
                            placeholder='Enter Your Email'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="passwordBox" id='passBox'>
                        <p>Password</p>
                        <input
                            id='password'
                            required
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Enter Your Password'
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <i
                            className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                    </div>

                    <div>
                        <button type='button' onClick={authenticate}>Login</button>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <p>
                            Don't Have An Account?{" "}
                            <a href='#' style={{ color: '#1090DF' }} onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>
                                Register Here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login