import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from '../styles/profile.module.css';
import {
	Avatar,
	Button, 
	Paper, 
	Tabs, 
	Tab, 
	Box, 
	Container, 
	Typography, 
} from "@mui/material";
import RestaurantReview from "./RestaurantReview.js";


function Profile() {
	const params = useParams();
	const username = params.username.toUpperCase();
	const [user, setUser] = useState(null);
	const [isFollowing, setIsFollowing] = useState(false);
	const [selectedTab, setSelectedTab] = useState('All');
	const [notFound, setNotFound] = useState(false);
	const [errorOcurred, setErrorOccured] = useState(false);

	const formatter = Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })

	useEffect(() => {
		const fetchUserInfo = async () => {
			const request = await fetch(`http://localhost:3000/v1/users/${params.username}/profile`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: localStorage.getItem('token'),
				}
			});

			if (request.status === 404) {
				setNotFound(true);
				return;
			} 
			else if (request.status === 200) {
				const data = await request.json();
				setUser(data.user);
				setIsFollowing(data.isFollowing);
				console.log(data);
				console.log(isFollowing)
			}
			else {
				setErrorOccured(true);
			}

		}	

		fetchUserInfo();
	}, []);

	if (notFound) {
		return <div>Page not Found</div>;
	} 
	else if (errorOcurred) {
		return <div>Sorry, an error occured</div>;
	}
	else {
		return (
			<div>
				<div className={styles.profileMain}>
					<Paper className={styles.profileHeader}>
						<Avatar
							src='placeholder'
							sx={{ width: '5rem', height: '5rem', backgroundColor: '#d91426' }}
							alt={username}
						/>
						<div className={styles.profileInfo}>
							<Typography variant="h5" align="center">{user && user.username}</Typography>
							<section className={styles.userStats}>
								<div style={{ textAlign: 'center' }}>
									<p>{user ? formatter.format(user.reviews.length) : 0}</p>
									<p className={styles.statTitle}>Reviews</p>
								</div>
								<div style={{ textAlign: 'center' }}>
									<p>{user ? formatter.format(user.followerCount) : 0}</p>
									<p className={styles.statTitle}>Followers</p>
								</div>
								<div style={{ textAlign: 'center' }}>
									<p>{user ? formatter.format(user.followingCount) : ''}</p>
									<p className={styles.statTitle}>Following</p>
								</div>
							</section>
							<section className={styles.userActions}>
								<Button
									variant="contained"
									className={`${styles.followBtn} ${isFollowing ? styles.following : ''}`}>
									{isFollowing ? 'Following' : 'Follow'}
								</Button>
							</section>
						</div>
					</Paper>
				</div>
				<div className={styles.profileSecondary}>
					<Box sx={{ borderBottom: '1px solid gainsboro' }}>
						<Tabs value={selectedTab} onChange={(e, value) => setSelectedTab(value)} centered>
							<Tab label='All' value='All' />
							<Tab label='Lists' value='Lists'/>
							<Tab label='Recent' value='recent'/>
						</Tabs>
					</Box>
					<Container maxWidth='md' sx={{ marginTop: '1rem' }}>
						{user && user.reviews.map((restaurantReview) => {
							return (
								<RestaurantReview key={restaurantReview._id} restaurantReview={restaurantReview} />
							);
						})}
					</Container>
				</div>
			</div>
		);
	}
	
}

export default Profile;