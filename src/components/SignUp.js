import React, { useState } from 'react';
import axios from 'axios';
import { Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import styles from '../styles/authforms.module.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function SignUp() {
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password1, setPassword1] = useState('');
	const [password2, setPassword2] = useState('');
	const [errors, setErrors] = useState([]);

	let navigate = useNavigate();

	const registerUser = async (e) => {
		e.preventDefault();
		
		try {
			const res = await axios.post(`${BASE_URL}/v1/register`, {
				email,
				username,
				password1,
				password2
			});

			if (res.status === 201) {
				navigate('/login');
			}
		} catch (err) {
			setErrors(err.response.data.errors);
		}
	};

	return (
		<Paper className={styles.authForm}>
			<h3 className={styles.formTitle}>Sign Up</h3>
			<p>Already have an account? <Link to='/login' className={styles.accountLink}>Log In</Link></p>
			<form className={styles.formContent} onSubmit={registerUser}>
				<div className={styles.formGroup}>
					<label htmlFor='email' className={styles.formLabel}>Email</label>
					<input
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						name='email'
						id='email'
						className={styles.formInput}
						required
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='username' className={styles.formLabel}>Username</label>
					<input
						type='text'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						name='username'
						id='username'
						className={styles.formInput}
						required
					/>
				</div>
				<div className={styles.formGroup}>
					<label htmlFor='password1' className={styles.formLabel}>Password</label>
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
					<label htmlFor='password2' className={styles.formLabel}>Confirm Password</label>
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
						return <li key={error.msg}>{error.msg}</li>;
					})}
				</ul>
				}
				<Button variant='contained' className={styles.submitBtn} type='submit'>Sign Up</Button>
			</form>
		</Paper>
	);
}

export default SignUp;