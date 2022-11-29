import React from 'react';
import { useSelector } from 'react-redux';
import AdminNavbar from './Admin/AdminNavbar'
import AccountVerificationAlertWarning from './Alerts/AccountVerificationAlertWarning';
import AccountVerificationSuccessAlert from './Alerts/AccountVerificationSuccessAlert';
import PrivateNavbar from './Private/PrivateNavbar'
import PublicNavbar from './Public/PublicNavbar'

const Navbar = () => {
    const state = useSelector(state => state?.users);
    const { userAuth } = state;
    const isAdmin = userAuth?.isAdmin;

    // get the account Verification data from state
    const accVerificationData = useSelector(state => state?.accountVerification);
    const { verificationLoading, verificationAppErr, verificationServerErr, token } = accVerificationData;
  return (
    <>
    {isAdmin ? <AdminNavbar isLogin={userAuth} /> : userAuth ? <PrivateNavbar isLogin={userAuth} /> : <PublicNavbar />}
    { userAuth && !userAuth?.isAccountVerified ? <AccountVerificationAlertWarning /> : null }
    { verificationLoading && <h2 className='text-center'>Loading...</h2> }
    { (verificationAppErr || verificationServerErr) && <h2 className='text-center text-red-500'>{verificationServerErr} {verificationAppErr}</h2> }
    { token && <AccountVerificationSuccessAlert /> }
    </>
  )
}

export default Navbar