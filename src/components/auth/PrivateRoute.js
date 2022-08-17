import React from "react";
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext.js";

function PrivateRoute() {
	const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
	const navigate = useNavigate();

	// Verify user is logged in
	useEffect(() => {
		const verifyAuth = async () => {
			const request = await fetch('http://localhost:3000/v1/isUserAuth', {
				method: 'GET',
				headers: {
					Authorization: localStorage.getItem('token'),
				}
			});

			if (request.status !== 200) {
				setIsLoggedIn(false);
				localStorage.removeItem('token');
				navigate('/login');
			}
			else {
				setIsLoggedIn(true);
			}
		}
		
		verifyAuth();
	}, []);

	return isLoggedIn ? <Outlet /> : '';
}

export default PrivateRoute;