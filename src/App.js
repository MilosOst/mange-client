import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import SignUp from './components/SignUp.js';
import Login from './components/Login.js';
import { AuthContext } from './contexts/AuthContext.js';
import ReviewForm from './components/forms/ReviewForm.js';
import PrivateRoute from './components/auth/PrivateRoute.js';
import Profile from './components/Profile.js';
import Home from './components/Home.js';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function App() {
	const [globalUser, setGlobalUser] = useState(null);
	const location = useLocation();

	const verifyAuth = async () => {
		try {
			const res = await axios.get(`${BASE_URL}/v1/users/currentUser`, {
				headers: {
					Authorization: localStorage.getItem('token'),
				}
			});
			setGlobalUser(res.data.user);
		} catch (err) {
			setGlobalUser(null);
			localStorage.removeItem('token');
		}
	};

	useEffect(() => {
		verifyAuth();
	}, []);

	return (
		<AuthContext.Provider value={{ verifyAuth, globalUser, setGlobalUser }}>
			<div className='container'>
				{location.pathname === '/' && !globalUser ? null : <Navbar />}
				<main className='content'>
					<Routes>
						<Route path='/' element={<Home/>}/>
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
