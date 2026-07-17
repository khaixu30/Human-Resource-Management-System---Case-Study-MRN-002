import { useState } from 'react';
import './forms.css';
import api from '../../api/api.js';
import { getOperatingSystem } from '../../utils/getDevice.util.js';
import { useNavigate } from 'react-router';
import { RiCloseLine } from '@remixicon/react';

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
                    <h1>EZITech</h1>
                    <p>Keep Growing</p>
                </div>
                <div className="right">
                    <form onSubmit={handleVerify} className="form-container">
                        <h2>Verify Your Email</h2>
                        <div className="form-body">
                            <div className="field-container">
                                <input type="text" className='otp-inp' id='otp' name='otp' value={formData.otp} onChange={handleFormDataChange} placeholder='Enter You One-Time Pin' />
                            </div>
                            <div className="cta-container">
                                <span>Didn't recieved an email? Try <a href="/login">Logging in again!</a></span>
                            </div>
                            <div className="field-container">
                                <button disabled={isLoading} >{isLoading ? 'Logging in...' : 'Log In'}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default VerifyOTP;