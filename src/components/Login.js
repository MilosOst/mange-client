import React, { useContext } from 'react';
import { useState } from 'react';
import { Paper, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/authforms.module.css';
import { AuthContext } from '../contexts/AuthContext.js';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const { setIsLoggedIn, setUser } = useContext(AuthContext);
	const navigate = useNavigate();

	const getCurrentUser = async () => {
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

	const loginUser = async (e) => {
		e.preventDefault();
		
		try {
			const res = await axios.post(`${BASE_URL}/v1/login`, {
				email,
				password
			});

			const { data } = res;
			localStorage.setItem('token', data.token);
			setError(null);
			
			// Get user info
			await getCurrentUser();
			navigate('/');
		} catch (err) {
			const { response } = err;
			const error = response.data.error;
			setError(error);
		}
	};

	return (
		<Paper className={styles.authForm}>
			<h3 className={styles.formTitle}>Log In</h3>
			<p>Don&apos;t have an account? <Link to='/sign-up' className={styles.accountLink}>Sign Up</Link></p>
			<form className={styles.formContent} onSubmit={loginUser}>
				<div className={styles.formGroup}>
					<label htmlFor='email' className={styles.formLabel}>Email</label>
					<input
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						name='email'
						id='email'
						className={styles.formInput}
						required/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='password' className={styles.formLabel}>Password</label>
					<input
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						name='password'
						id='password'
						className={styles.formInput}
						required/>
				</div>
				{error && <p className={styles.error}>{error}</p>}
				<Button variant='contained' className={styles.submitBtn} type='submit'>Log In</Button>
			</form>
		</Paper>
	);
}

export default Login;