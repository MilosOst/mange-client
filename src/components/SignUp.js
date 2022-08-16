import React, { useState } from "react";
import { Paper } from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";
import styles from '../styles/authforms.module.css';

function SignUp() {
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password1, setPassword1] = useState('');
	const [password2, setPassword2] = useState('');
	const [errors, setErrors] = useState([]);

	let navigate = useNavigate();

	const registerUser = async (e) => {
		e.preventDefault();

		const request = await fetch('http://localhost:3000/v1/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				username,
				password1,
				password2,
			})
		});

		const data = await request.json();

		if (request.status !== 201) {
			setErrors(data.errors);
			return;
		}
		else {
			setErrors([]);
			navigate('/login');
		}
	}

	return (
		<Paper className={styles.authForm}>
			<h3 className={styles.formTitle}>Sign Up</h3>
			<p>Already have an account? <Link to='/login' className={styles.accountLink}>Log In</Link></p>
			<form className={styles.formContent} onSubmit={registerUser}>
				<div className={styles.formGroup}>
					<label htmlFor="email" className={styles.formLabel}>Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						name='email'
						id='email'
						className={styles.formInput}
						required
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor="username" className={styles.formLabel}>Username</label>
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						name='username'
						id='username'
						className={styles.formInput}
						required
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor="password1" className={styles.formLabel}>Password</label>
					<input
						type='password'
						value={password1}
						onChange={(e) => setPassword1(e.target.value)}
						name='password1'
						id='password1'
						className={styles.formInput}
						required
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor="password2" className={styles.formLabel}>Confirm Password</label>
					<input
						type='password'
						value={password2}
						onChange={(e) => setPassword2(e.target.value)}
						name='password2'
						id='password2'
						className={styles.formInput}
						required
					/>
				</div>
				{errors && 
				<ul className={styles.errors}>
					{errors.map((error) => {
						return <li key={error.msg}>{error.msg}</li>
					})}
				</ul>
				}
				<Button variant="contained" className={styles.submitBtn} type='submit'>Sign Up</Button>
			</form>
		</Paper>
	);
}

export default SignUp;