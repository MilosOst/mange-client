import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import styles from '../../styles/notfound.module.css';

function NotFound() {
	return (
		<div className={styles.root}>
			<h1 className={styles.title}>404 Not Found</h1>
			<Button
				component={Link}
				to='/'
				variant='outlined'
				className={styles.btn}
			>
				Return to Homepage
			</Button>
		</div>

	);
}

export default NotFound;