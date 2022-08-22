import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { AuthContext } from "../contexts/AuthContext.js";
import UsersListModal from "./UsersListModal.js";


function Profile() {
	const params = useParams();
	const username = params.username.toUpperCase();
	const { isLoggedIn } = useContext(AuthContext);
	const navigate = useNavigate();

	const [user, setUser] = useState(null);
	const [isFollowing, setIsFollowing] = useState(false);
	const [isCurrentUser, setIsCurrentUser] = useState(false);
	const [selectedTab, setSelectedTab] = useState('All');

	// State variables to keep track of followers/following if api should be called to fetch more info
	const [followers, setFollowers] = useState(null);
	const [following, setFollowing] = useState(null);
	const [followersSkip, setFollowersSkip] = useState(0);
	const [followingSkip, setFollowingSkip] = useState(0);
	const [isAllFollowers, setIsAllFollowers] = useState(false);
	const [isAllFollowing, setIsAllFollowing] = useState(false);

	const [followersOpen, setFollowersOpen] = useState(false);
	const [followingOpen, setFollowingOpen] = useState(false);

	const [notFound, setNotFound] = useState(false);
	const [errorOcurred, setErrorOccured] = useState(false);

	const formatter = Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })

	// Reset state when navigating to different profile pages
	const resetState = () => {
		setUser(null);
		setIsFollowing(false);
		setIsCurrentUser(false);
		setSelectedTab('All');
		setFollowers(null);
		setFollowing(null);
		setFollowersOpen(false);
		setFollowingOpen(false);
		setFollowersSkip(0);
		setFollowingSkip(0);
		setIsAllFollowers(false);
		setIsAllFollowing(false);
	};

	useEffect(() => {
		resetState();
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
				setIsCurrentUser(data.isCurrentUser);
			}
			else {
				setErrorOccured(true);
			}
		}	

		fetchUserInfo();
	}, [username]);

	const handleFollow = async () => {
		if (!isLoggedIn) {
			navigate('/login');
		}
		else if (isFollowing) {
			// Unfollow if already following
			const request = await fetch(`http://localhost:3000/v1/users/${username}/followers`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: localStorage.getItem('token'),
				}
			});

			if (request.status === 200 || request.status === 204) {
				setIsFollowing(false);
				setUser({
					...user,
					followerCount: user.followerCount - 1,
				});
			}
		}
		else {
			const request = await fetch(`http://localhost:3000/v1/users/${username}/followers`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: localStorage.getItem('token'),
				}
			});

			if (request.status === 201) {
				const data = await request.json();
				setIsFollowing(data.isFollowing);
				setUser({
					...user,
					followerCount: user.followerCount + 1
				});
			}
		}
	};

	const fetchFollowers = async () => {
		const request = await fetch(`http://localhost:3000/v1/users/${username}/followers?skip=${followersSkip}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: localStorage.getItem('token'),
			}
		});

		if (request.status === 401) {
			navigate('/login');
		}
		else if (request.status === 200) {
			const data = await request.json();

			// Check if all followers have been fetched
			if (data.followers.length === 0) {
				setIsAllFollowers(true);
			}
			const followerList = followers ? followers : [];
			setFollowers([...followerList, ...data.followers]);
		}
	}

	const handleFollowersOpen = async () => {
		// Check if followers have been fetched already, null/undefined indicates that they haven't
		if (followers == null) {
			await fetchFollowers();
		}
		setFollowersOpen(true);
	};

	const fetchFollowing = async () => {
		const request = await fetch(`http://localhost:3000/v1/users/${username}/following?skip=${followingSkip}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: localStorage.getItem('token'),
			}
		});

		if (request.status === 401) {
			navigate('/login');
		}
		else if (request.status === 200) {
			const data = await request.json();

			// Check if all following users have been fetched
			if (data.following.length === 0) {
				setIsAllFollowing(true);
			}
			const followingList = following ? following : [];
			setFollowing([...followingList, ...data.following]);
		}
	}

	const handleFollowingOpen = async () => {
		// Check if following has been fetched already, null/undefined indicates no fetch yet
		if (following == null) {
			await fetchFollowing();
		}
		setFollowingOpen(true);
	};

	// Infinite scroll fetch for followers
	useEffect(() => {
		// Check if followers is null to prevent automatic fetch on render
		if (!isAllFollowers && followers != null) {
			fetchFollowers();
		}
	}, [followersSkip]);

	// Infinite scroll fetch for following
	useEffect(() => {
		// Check if following is null to prevent automatic fetch on render
		if (!isAllFollowing && following != null) {
			fetchFollowing();
		}
	}, [followingSkip])

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
					<Paper sx={{ padding: '0.6rem' }}>
						<Typography variant="h5" align="center">{user && user.username}</Typography>
						<div className={styles.profileHeader}>
							<Avatar
								src='placeholder'
								sx={{ width: '5rem', height: '5rem', backgroundColor: '#d91426' }}
								alt={username}
							/>
							<section className={styles.userStats}>
								<div style={{ textAlign: 'center' }}>
									<p>{user ? formatter.format(user.reviews.length) : 0}</p>
									<p className={styles.statTitle}>Reviews</p>
								</div>
								<div className={styles.userModalOpener} onClick={handleFollowersOpen}>
									<p>{user ? formatter.format(user.followerCount) : 0}</p>
									<p className={styles.statTitle}>Followers</p>
								</div>
								<UsersListModal
									open={followersOpen} 
									setOpen={setFollowersOpen} 
									title='Followers'
									users={followers}
									setSkip={setFollowersSkip}
								/>

								<div className={styles.userModalOpener} onClick={handleFollowingOpen}>
									<p>{user ? formatter.format(user.followingCount) : ''}</p>
									<p className={styles.statTitle}>Following</p>
								</div>
								<UsersListModal 
									open={followingOpen}
									setOpen={setFollowingOpen}
									title='Following'
									users={following}
									setSkip={setFollowingSkip}
								/>
							</section>
						</div>
						<section className={styles.userActions}>
							{isCurrentUser ? (
								<Button
									variant="contained"
									className={`${styles.profileBtn}`}>
									Edit Profile
								</Button>
							) :
								(<Button
									variant="contained"
									className={`${styles.profileBtn} ${isFollowing ? styles.following : ''}`}
									onClick={handleFollow}>
									{isFollowing ? 'Following' : 'Follow'}
								</Button>)
							}
						</section>
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