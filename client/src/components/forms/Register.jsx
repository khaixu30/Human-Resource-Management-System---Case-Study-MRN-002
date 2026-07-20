import { useState } from 'react';
import '../../assets/css/forms.css';
import Logo from '../../assets/logo.png';
import Hero from '../../assets/images/hero-image.png';
import GridBG from '../../assets/images/grid-bg.png';
import api from '../../api/api.js';
import { getOperatingSystem } from '../../utils/getDevice.util.js';
import { useNavigate } from 'react-router';
import { RiCloseLine, RiEyeLine, RiLockLine, RiMailLine } from '@remixicon/react';

function Register() {
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
        password: '',
        conPassword: ''
    });

    // Local function - strictly Red, Yellow, Green tiers mapped to your requested classes
    const checkPasswordStrength = (pass) => {
        if (!pass) return { label: '', class: '' };

        let score = 0;

        // Evaluate core security criteria
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        // Map directly to dynamic string css keys
        if (score <= 1) {
            return { label: 'Weak', class: 'weak' };
        } else if (score <= 3) {
            return { label: 'Medium', class: 'medium' };
        } else {
            return { label: 'Strong', class: 'strong' };
        }
    };

    // Dynamically tracks strength on every keystroke
    const strength = checkPasswordStrength(formData.password);

    const changeLoadingState = () => {
        setIsLoading((prev => !prev));
    };

    const handleFormDataChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const createError = (errorMessage, code, success) => {
        setError({ errorMessage, code, success });
        setShowPopup((prev => !prev));
    };

    const togglePopup = () => {
        setShowPopup((prev => !prev));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        changeLoadingState();
        try {
            if (!formData.email) {
                createError("Please enter your email", "EMPTY_FIELD", false);
                return;
            }
            if (!formData.password) {
                createError("Please enter your password", "EMPTY_FIELD", false);
                return;
            }
            if (!formData.conPassword) {
                createError("Please confirm your password", "EMPTY_FIELD", false);
                return;
            }
            if (formData.password.length < 8) {
                createError("Password should be 8 characters long.", "INVALID_PASSWORD", false);
                return;
            }
            // Optional: Block form submission if the password is explicitly Weak
            if (strength.class === 'weak') {
                createError("Please provide a stronger password.", "WEAK_PASSWORD", false);
                return;
            }
            if (formData.conPassword !== formData.password) {
                createError("Password mismatched the confirmed password.", "PASSWORD_MISMATCH", false);
                return;
            }
            const payload = {
                device: getOperatingSystem(),
                lastLogin: new Date().toISOString(),
                userAgent: navigator.userAgent
            };
            const res = await api.post('/auth/register', {
                email: formData.email,
                password: formData.password,
                payload
            });
            createError(res.data.message, res.data.code, res.data.success);

            if (res.data.success) {
                navigate('/verify-otp');
            }
        } catch (err) {
            console.error("Registration failed:", err);
            const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";
            const errorCode = err.response?.data?.code || 500;
            createError(errorMessage, errorCode, false);
        } finally {
            changeLoadingState();
        }
    };

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
                    <form onSubmit={handleRegister} className="form-container">
                        <div className="heading-container">
                            <h2>Welcome!</h2>
                            <p>Setup your account to be the part of our journey.</p>
                        </div>
                        <div className="form-body">
                            <div className={`error-container ${showPopup ? '' : 'hidden'}`}>
                                <div className={`pop-up ${error.success ? 'success' : 'error'}`}>{error.errorMessage}</div>
                                <button type='button' className='show-hide-btn' onClick={togglePopup}><RiCloseLine /></button>
                            </div>
                            <div className="field-container">
                                <span className="icon-container"><RiMailLine size={20} /></span>
                                <input type="email" name='email' id='email' className='email-inp' placeholder='Enter your email' value={formData.email} onChange={handleFormDataChange} />
                            </div>
                            <div className={`field-container ${strength.class}`}>
                                <span className="icon-container"><RiLockLine size={20} /></span>
                                <input
                                    type="password"
                                    name='password'
                                    id='password'
                                    className={`pass-inp `}
                                    placeholder='Enter your password'
                                    value={formData.password}
                                    onChange={handleFormDataChange}
                                />
                                <span className="icon-container">
                                    <button className="show-hide-btn">
                                    <RiEyeLine size={20} />
                                    </button>
                                </span>
                            </div>
                            <div className="field-container">
                                <span className="icon-container"><RiLockLine size={20} /></span>
                                <input type="password" name='conPassword' id='conPassword' className='pass-inp' placeholder='Confirm your password' value={formData.conPassword} onChange={handleFormDataChange} />
                            </div>
                            <div className="cta-container">
                                <span><a href="/login">Login Account</a></span>
                                <span><a href="/reset-password">Reset Password</a></span>
                            </div>
                            <div className="button-container">
                                <button disabled={isLoading}>{isLoading ? 'Registering...' : 'Register'}</button>
                            </div>
                        </div>
                    </form>
                    <img className='grid-bg' src={GridBG} alt="" />
                </div>
            </div>
        </>
    );
}

export default Register;
