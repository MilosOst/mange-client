import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.js';
import styles from '../styles/home.module.css';
import {
	Button,
	Grid,
} from '@mui/material';
import { Link } from 'react-router-dom';
import LandingPage from './LandingPage.js';
import Feed from './Feed.js';

function Home() {
	const { globalUser } = useContext(AuthContext);
	if (!globalUser) {
		return <LandingPage/>;
	}
	else {
		return (
			<Grid container alignItems='center' direction='column'>
				<Button
					variant='contained'
					component={Link}
					to='/reviews/new'
					className={styles.signupBtn}
				>
					Add New Review
				</Button>
				<Feed/>
			</Grid>
		);
	}
}

export default Home;