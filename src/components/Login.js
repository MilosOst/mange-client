import React, { useContext } from 'react';
import { useState } from 'react';
import { Paper, Button } from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/authforms.module.css';
import { AuthContext } from '../contexts/AuthContext.js';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const { setIsLoggedIn } = useContext(AuthContext)

	const navigate = useNavigate();


	const loginUser = async (e) => {
		e.preventDefault();

		const request = await fetch('http://localhost:3000/v1/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		});

		const data = await request.json();

		if (request.status !== 200) {
			setError(data.error);
			return;
		}

		// Valid login, redirect to home
		localStorage.setItem('token', data.token);
		setError([]);
		setIsLoggedIn(true);
		navigate('/');
	}

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
				<Button variant="contained" className={styles.submitBtn} type='submit'>Log In</Button>
			</form>
		</Paper>
	);
}

export default Login;