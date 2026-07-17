import { useState } from 'react';
import './forms.css';
import api from '../../api/api.js';
import { getOperatingSystem } from '../../utils/getDevice.util.js';
import { useNavigate } from 'react-router';
import { RiCloseLine } from '@remixicon/react';

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
            if(!formData.email){
                createError("Please enter your email", "EMPTY_FIELD", false);
                return;
            }
            if(!formData.password){
                createError("Please enter your password", "EMPTY_FIELD", false);
                return;
            }
            if(!formData.conPassword){
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
                    <h1>EZITech</h1>
                    <p>Keep Growing</p>
                </div>
                <div className="right">
                    <form onSubmit={handleRegister} className="form-container">
                        <h2>Welcome To EZITech</h2>
                        <div className="form-body">
                            <div className={`error-container ${showPopup ? '' : 'hidden'}`}>
                                <div className={`pop-up ${error.success ? 'success' : 'error'}`}>{error.errorMessage}</div>
                                <button type='button' onClick={togglePopup}><RiCloseLine /></button>
                            </div>
                            <div className="field-container">
                                <label htmlFor="email">Email: </label>
                                <input type="email" name='email' id='email' className='email-inp' placeholder='Enter your email' value={formData.email} onChange={handleFormDataChange} />
                            </div>
                            <div className="field-container">
                                <label htmlFor="password">Password: </label>
                                {/* Added dynamic strength class injection here */}
                                <input 
                                    type="password" 
                                    name='password' 
                                    id='password' 
                                    className={`pass-inp ${strength.class}`} 
                                    placeholder='Enter your password' 
                                    value={formData.password} 
                                    onChange={handleFormDataChange} 
                                />
                            </div>
                            <div className="field-container">
                                <label htmlFor="conPassword">Confirm Password: </label>
                                <input type="password" name='conPassword' id='conPassword' className='pass-inp' placeholder='Confirm your password' value={formData.conPassword} onChange={handleFormDataChange} />
                            </div>
                            <div className="cta-container">
                                <span>Already have an account? <a href="/login">Login Here</a></span>
                            </div>
                            <div className="field-container">
                                <button disabled={isLoading}>{isLoading ? 'Registering...' : 'Register'}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Register;
