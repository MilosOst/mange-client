import React, { useEffect, useState } from 'react';
import {
	Grid,
	Alert
} from '@mui/material';
import axios from 'axios';
import RestaurantReview from './RestaurantReview.js';
import styles from '../styles/home.module.css';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const headers = {
	Authorization: localStorage.getItem('token')
};

function Feed() {
	const [posts, setPosts] = useState([]);
	const [isAllContent, setIsAllContent] = useState(false);
	const [beforeDate, setBeforeDate] = useState('9999-12-31');

	const navigate = useNavigate();

	// Set up infinite scroll
	const handleScroll = (e) => {
		const { scrollHeight, scrollTop } = e.target.documentElement;

		// Check if end has been reached
		if (window.innerHeight + scrollTop >= scrollHeight) {
			const oldestDate = posts[posts.length - 1].date_posted;
			setBeforeDate(oldestDate);
		}
	};

	const fetchFeed = async () => {
		try {
			const res = await axios.get(`${BASE_URL}/v1/users/feed?beforeDate=${beforeDate}`, { headers });
			const newPosts = res.data.feed;

			// Check if no new posts were returned which indicates end
			if (newPosts.length === 0) {
				setIsAllContent(true);
				return;
			}
			setPosts([...posts, ...newPosts]);
		} catch (err) {
			if (err.response.status === 401) {
				navigate('/login');
			}
		}
	};

	useEffect(() => {
		if (!isAllContent) {
			fetchFeed();
		}
	}, [beforeDate]);

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	return (
		<Grid
			container
			alignItems='center'
			spacing={2}
			className={styles.reviewGrid}
			maxWidth='sm'
		>
			{posts && posts.map((post) => {
				return (
					<RestaurantReview
						key={post.post._id}
						restaurantReview={post.post}
						postUser={post.user}
						fullWidth={true}
					/>
				);
			})}
			{isAllContent && 
				<Alert
					severity='info'
					sx={{ margin: '1rem auto', fontWeight: 'bold', fontSize: '1rem' }}>
					You have reached the end
				</Alert>
			}
		</Grid>
	);
}

export default Feed;