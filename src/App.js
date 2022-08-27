import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import SignUp from './components/SignUp.js';
import Login from './components/Login.js';
import { AuthContext } from './contexts/AuthContext.js';
import ReviewForm from './components/forms/ReviewForm.js';
import PrivateRoute from './components/auth/PrivateRoute.js';
import Profile from './components/Profile.js';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState(null);

	const verifyAuth = async () => {
		try {
			const res = await axios.get(`${BASE_URL}/v1/users/currentUser`, {
				headers: {
					Authorization: localStorage.getItem('token'),
				}
			});
			setIsLoggedIn(true);
			setUser(res.data.user);
		} catch (err) {
			setIsLoggedIn(false);
			setUser(null);
			localStorage.removeItem('token');
		}
	};

	useEffect(() => {
		verifyAuth();
	}, []);

	return (
		<AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, verifyAuth, user, setUser }}>
			<div className='container'>
				<Navbar />
				<main className='content'>
					<Routes>
						<Route path='/' element={<h1>Home</h1>}/>
						<Route path='/sign-up' element={<SignUp/>}/>
						<Route path='/login' element={<Login />} />
						<Route path='/users/:username/' element={<Profile/>}/>
						<Route path='/reviews' element={<PrivateRoute/>}>
							<Route path='new' element={<ReviewForm/>} />
						</Route>
					</Routes>
				</main>
			</div>
		</AuthContext.Provider>
		
	);
}

export default App;
