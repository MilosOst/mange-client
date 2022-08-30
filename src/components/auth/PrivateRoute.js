import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext.js';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function PrivateRoute() {
	const { globalUser, setGlobalUser } = useContext(AuthContext);
	const navigate = useNavigate();

	const verifyIsLoggedIn = async () => {
		try {
			await axios.get(`${BASE_URL}/v1/isUserAuth`, {
				headers: {
					Authorization: localStorage.getItem('token'),
				}
			});
		} catch (err) {
			setGlobalUser(null);
			localStorage.removeItem('token');
			navigate('/login');
		}
	};

	// Verify user is logged in
	useEffect(() => {
		verifyIsLoggedIn();
	}, []);

	return globalUser ? <Outlet /> : '';
}

export default PrivateRoute;