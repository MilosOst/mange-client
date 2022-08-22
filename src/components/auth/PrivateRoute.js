import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext.js';

function PrivateRoute() {
	const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
	const navigate = useNavigate();

	const verifyIsLoggedIn = async () => {
		try {
			await axios.get('http://localhost:3000/v1/isUserAuth', {
				headers: {
					Authorization: localStorage.getItem('token'),
				}
			});
			setIsLoggedIn(true);
		} catch (err) {
			setIsLoggedIn(false);
			localStorage.removeItem('token');
			navigate('/login');
		}
	};

	// Verify user is logged in
	useEffect(() => {
		verifyIsLoggedIn();
	}, []);

	return isLoggedIn ? <Outlet /> : '';
}

export default PrivateRoute;