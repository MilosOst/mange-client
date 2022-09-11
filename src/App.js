import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import SignUp from './components/auth/SignUp.js';
import Login from './components/auth/Login.js';
import { AuthContext } from './contexts/AuthContext.js';
import ReviewForm from './components/forms/ReviewForm.js';
import PrivateRoute from './components/auth/PrivateRoute.js';
import Profile from './components/pages/profile/Profile.js';
import Home from './components/pages/home/Home.js';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function App() {
	const [globalUser, setGlobalUser] = useState(null);
	const [socket, setSocket] = useState(null);
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
		setSocket(io(BASE_URL));
		verifyAuth();
	}, []);

	useEffect(() => {
		if (globalUser) {
			socket.emit('setup', globalUser);
		}
	}, [globalUser]);

	return (
		<AuthContext.Provider value={{ verifyAuth, globalUser, setGlobalUser }}>
			<div className='container'>
				{location.pathname === '/' && !globalUser ? null : <Navbar socket={socket}/>}
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
