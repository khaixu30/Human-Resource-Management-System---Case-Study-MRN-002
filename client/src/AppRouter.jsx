import {Routes, Route} from 'react-router';
import RegisterView from './views/RegisterView';
import LoginView from './views/LoginView';
import VerifyOTPView from './views/VerifyOTPView';

export default function AppRouter (){
    return(
        <Routes >
            <Route path='/register' Component={RegisterView} />
            <Route path='/login' Component={LoginView} />
            <Route path='/verify-otp' Component={VerifyOTPView} />
        </Routes>
    )
} 