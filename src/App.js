import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import SignUp from './components/SignUp.js';
import Login from './components/Login.js';
import { AuthContext } from './contexts/AuthContext.js';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);


	return (
		<AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, }}>
			<div className='container'>
				<Navbar />
				<main className='content'>
					<Routes>
						<Route path='/' element={<h1>Home</h1>}/>
						<Route path='/sign-up' element={<SignUp/>}/>
						<Route path='/login' element={<Login />} />
					</Routes>
				</main>
			</div>
		</AuthContext.Provider>
		
	);
}

export default App;
