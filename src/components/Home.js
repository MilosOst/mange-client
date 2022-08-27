import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.js';
import styles from '../styles/home.module.css';
import appIcon from '../images/mange-icon.jpg';
import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
	const { user } = useContext(AuthContext);

	if (!user) {
		return (
			<div className={styles.heroContainer}>
				<div className={styles.logoBox}>
					
				</div>
				<div className={styles.appInfo}>
					<div className={styles.iconBox}>
						<img src={appIcon} alt="" />
					</div>
					<Typography variant='h4'>Find your favourite foods</Typography>
					<div className={styles.startInfo}>
						<Typography variant='h5'>Join Mange today</Typography>
						<Button
							variant='contained'
							component={Link}
							to='/sign-up'
							className={`${styles.btn} ${styles.signUpBtn}`}>
							Sign Up
						</Button>
					</div>
					<div className={styles.loginBox}>
						<Typography variant='h5'>Already have an account?</Typography>
						<Button
							variant='contained'
							component={Link}
							to='/login'
							className={`${styles.btn} ${styles.loginBtn}`}>
							Log In
						</Button>
					</div>
				</div>
			</div>
		);
	}
}

export default Home;