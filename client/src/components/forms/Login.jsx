import { useState } from 'react';
import Logo from '../../assets/logo.png'
import './forms.css'
import { RiCloseLine, RiEyeLine, RiEyeOffLine } from '@remixicon/react';
import { useNavigate } from 'react-router';
import api from '../../api/api.js';

// MessageBox Component
const MessageBox = ({ errorState, setErrorState }) => {
    if (!errorState || !errorState.errorMessage) return null;
    

    const handleClose = () => {
        setErrorState({ errorCode: null, errorMessage: null });
    };

    return (
        <div className="message-container">
            <div className={`${!errorState.isSuccess ? 'error' : 'success'} show  `}>
                <p className="message-text"> 
                    {errorState.errorMessage}
                </p>
                
                <button type="button" onClick={handleClose} className="popup-btn">
                    <RiCloseLine />
                </button>
            </div>
        </div>
    );
};

function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [errorData, setErrorData] = useState({
        errorCode: null,
        errorMessage: null,
        isSuccess: false
    });

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const getDevice = () => {
        const ua = navigator.userAgent;
        if (/android/i.test(ua)) return "Android";
        if (/iPad|iPhone|iPod/.test(ua)) return "iOS";
        if (/Windows/i.test(ua)) return "Windows";
        if (/Macintosh|Mac OS X/.test(ua)) return "macOS";
        if (/Linux/i.test(ua)) return "Linux";

        return "Unknown";
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const request = {
            email: formData.email,
            password: formData.password,
            payload: {
                device: getDevice(),
                date: new Date().toISOString(),
                userAgent: navigator.userAgent
            }
        }

        try{
            console.log('idhr hai abhi')
            const response = await api.post('/login', request);

            console.log('api call hogai')

            setErrorData({
                errorCode: response.data.errorCode, 
                errorMessage: response.data.message ,
                isSuccess: response.status === 200 || response.status === 201
            });

            
            setFormData({ email: '', password: ''});
            navigate('/', {replace: true})
        }catch(error){
            console.log(error);
            const serverCode = error.response?.data?.errorCode || "LOGIN_FAILED";
            const serverMessage = error.response?.data?.message || "Something went wrong. Please try again.";

            setErrorData({
                errorCode: serverCode,
                errorMessage: serverMessage
            });
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    return (
        <>
            <div className="login-container">
                <div className="logo-section">
                    <div className="logo-container">
                        <img src={Logo} alt="" />
                    </div>
                    <div className="logo-text">
                        <h1>EZITech</h1>
                        <p>Keep Growing</p>
                    </div>
                </div>
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <div className="form-heading">
                            <h1>Login</h1>
                        </div>
                        <div className="form-body">
                            <MessageBox errorState={errorData} setErrorState={setErrorData} />
                            <div className="field-container">
                                <label htmlFor="Email">Email: </label>
                                <input
                                    type="email"
                                    id="Email"
                                    className='email-inp'
                                    placeholder='e.g email@email.com'
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange} />
                            </div>
                            <div className="field-container">
                                <label htmlFor="Password">Password:</label>
                                <div className="pass-inp-container">

                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="Password"
                                        className="pass-inp"
                                        name="password"
                                        placeholder="Your Secret Key"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />

                                    <button
                                        type="button"
                                        className="eye-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                                    </button>
                                </div>
                            </div>
                            <div className="new-here-section">
                                <p>Don't have an account? <a href="/register">Register here!</a></p>
                            </div>
                            <div className="button-section">
                                <button>Login</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login;