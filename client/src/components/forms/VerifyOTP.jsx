import { useState } from 'react';
import '../../assets/css/forms.css';
import api from '../../api/api.js';
import { getOperatingSystem } from '../../utils/getDevice.util.js';
import { useNavigate } from 'react-router';
import { RiCloseLine } from '@remixicon/react';
import Hero from '../../assets/images/hero-image.png';
import Logo from '../../assets/logo.png'

function VerifyOTP() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({
        errorMessage: '',
        success: true,
        code: ''
    });
    const [formData, setFormData] = useState({
        otp: ''
    })
    const [showPopup, setShowPopup] = useState(false);

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

    const handleVerify = async (e) => {
        e.preventDefault();
        changeLoadingState();
        try {
            const res = await api.post('/auth/verify-otp', {
                otp: formData.otp
            });

            localStorage.setItem('token', res.data?.token);
            navigate('/dashboard');
        } catch (err) {
            console.log(err)
        }finally{
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
                    <form onSubmit={handleVerify} className="form-container">
                        <div className="heading-container">
                            <h2>Verify Your Email!</h2>
                            <p>We have sent OTP on your given email, please verify before proceeding.</p>
                        </div>
                        <div className="form-body">
                            <div className="field-container">
                                <input type="text" className='otp-inp' id='otp' name='otp' value={formData.otp} onChange={handleFormDataChange} placeholder='Enter You One-Time Pin' />
                            </div>
                            <div className="cta-container">
                                <span>Didn't recieved an email? Try <a href="/login">Logging in again!</a></span>
                            </div>
                            <div className="button-container">
                                <button disabled={isLoading} >{isLoading ? 'Verifying in...' : 'Verify'}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default VerifyOTP;