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

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const verifyAuth = async () => {
		try {
			await axios.get('http://localhost:3000/v1/isUserAuth', {
				headers: {
					Authorization: localStorage.getItem('token'),
				}
			});
			setIsLoggedIn(true);
			return true;
		} catch (err) {
			setIsLoggedIn(false);
			localStorage.removeItem('token');
			return false;
		}
	};

	useEffect(() => {
		verifyAuth();
	}, []);

	return (
		<AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, verifyAuth }}>
			<div className='container'>
				<Navbar />
				<main className='content'>
					<Routes>
						<Route path='/' element={<h1>Home</h1>}/>
						<Route path='/sign-up' element={<SignUp/>}/>
						<Route path='/login' element={<Login />} />
						<Route path='/users/:username/' element={<Profile/>}/>
						<Route path='/review' element={<PrivateRoute/>}>
							<Route path='new' element={<ReviewForm/>} />
						</Route>
					</Routes>
				</main>
			</div>
		</AuthContext.Provider>
		
	);
}

export default App;
