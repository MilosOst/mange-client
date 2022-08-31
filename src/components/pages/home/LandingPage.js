import React from 'react';
import styles from '../../../styles/landingpage.module.css';
import appIcon from '../../../images/mange-icon.jpg';
import { Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function LandingPage() {
	return (
		<div className={styles.heroContainer}>
			<div className={styles.logoBox}></div>
			<div className={styles.appInfo}>
				<div className={styles.iconBox}>
					<img src={appIcon} alt="" />
				</div>
				<Typography
					variant='h4'
					textAlign='center' 
					sx={{ fontFamily: 'Literata, serif' }}>
					Your World in Food
				</Typography>
				<div className={styles.startInfo}>
					<Typography variant='h5' sx={{ fontFamily: 'Barlow, sans-serif' }}>Join Mange today</Typography>
					<Button
						variant='contained'
						component={Link}
						to='/sign-up'
						className={`${styles.btn} ${styles.signUpBtn}`}>
						Sign Up
					</Button>
				</div>
				<div className={styles.loginBox}>
					<Typography variant='h5' sx={{ fontFamily: 'Barlow, sans-serif' }}>Already have an account?</Typography>
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

export default LandingPage;