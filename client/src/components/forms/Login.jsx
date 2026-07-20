import { useState } from 'react';
import '../../assets/css/forms.css';
import Logo from '../../assets/logo.png';
import Hero from '../../assets/images/hero-image.png';
import GridBG from '../../assets/images/grid-bg.png';
import api from '../../api/api.js';
import { getOperatingSystem } from '../../utils/getDevice.util.js';
import { useNavigate } from 'react-router';
import { RiCloseLine, RiLockLine, RiMailLine } from '@remixicon/react';

function Login() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({
        errorMessage: '',
        success: true,
        code: ''
    });

    const [showPopup, setShowPopup] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const changeLoadingState = () => {
        setIsLoading((prev => !prev));
    }

    const handleFormDataChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const createError = (errorMessage, code, success) => {
        setError({ errorMessage, code, success });
        setShowPopup((prev => !prev))
    }

    const togglePopup = () => {
        setShowPopup((prev => !prev));
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        changeLoadingState();
        try {
            const payload = {
                device: getOperatingSystem(),
                lastLogin: new Date().toISOString(),
                userAgent: navigator.userAgent
            }
            const res = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password,
                payload
            });
            createError(res.data.message, res.data.code, res.data.success);
            localStorage.clear();
            localStorage.setItem('token', res.data?.token);
            navigate('/verify-otp');
        } catch (err) {
            // 6. Handle server validation errors or unexpected failures
            console.error("Registration failed:", err);

            const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";
            const errorCode = err.response?.data?.code || 500;

            // Notify the user via your error creation state
            createError(errorMessage, errorCode, false);
        } finally {
            changeLoadingState();
        }
    }

    return (
        <>
            <div className="form-page-container">
                <div className="left">
                    <img src={Hero} alt="" />
                </div>
                <div className="right">
                    <div className="logo-container">
                        <img src={Logo} alt="" />
                        <div className="logo-heading-tagline">
                            <h1 className='logo-heading'>EZITech <br /> Institute</h1>
                            <p>Keep Growing</p>
                        </div>
                    </div>
                    <form onSubmit={handleLogin} className="form-container">
                        <div className="heading-container">
                            <h2>Welcome Back</h2>
                            <p>Log in to your account to get going.</p>
                        </div>
                        <div className="form-body">
                            <div className={`error-container ${showPopup ? '' : 'hidden'}`}>
                                <div className={`pop-up ${error.success ? 'success' : 'error'}`}>{error.errorMessage}</div>
                                <button type='button' onClick={togglePopup}><RiCloseLine /></button>
                            </div>
                            <div className="field-container">
                                <span className="icon-container"><RiMailLine size={20} /></span>
                                <input type="email" name='email' id='email' className='email-inp' placeholder='Enter your email' value={formData.email} onChange={handleFormDataChange} />
                            </div>
                            <div className="field-container">
                                <span className="icon-container">
                                    <RiLockLine size={20} />
                                </span>
                                <input type="password" name='password' id='password' className='pass-inp' placeholder='Enter your password' value={formData.password} onChange={handleFormDataChange} />
                            </div>
                            <div className="cta-container">
                                <span><a href="/register">Register Account</a></span>
                                <span><a href="/reset-password">Reset Password</a></span>
                            </div>
                            <div className="button-container">
                                <button disabled={isLoading} >{isLoading ? 'Logging in...' : 'Log In'}</button>
                            </div>
                        </div>
                    </form>
                    <img className='grid-bg' src={GridBG} alt="" />
                </div>
            </div>
        </>
    )
}

export default Login;