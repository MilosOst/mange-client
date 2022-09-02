import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../../styles/profile.module.css';
import {
	Avatar,
	Button, 
	Paper, 
	Tabs, 
	Tab, 
	Box, 
	Grid,
	Typography,
} from '@mui/material';
import RestaurantReview from '../../posts/RestaurantReview.js';
import NotFound from '../../auth/NotFound.js';
import { AuthContext } from '../../../contexts/AuthContext.js';
import { ProfilePostContext } from '../../../contexts/ProfilePostContext.js';
import UsersListModal from './UsersListModal.js';
import EditProfile from './EditProfile.js';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const headers = {
	Authorization: localStorage.getItem('token')
};

function Profile() {
	const params = useParams();
	const username = params.username.toUpperCase();
	const { globalUser, setGlobalUser } = useContext(AuthContext);
	const navigate = useNavigate();

	const [user, setUser] = useState(null);
	const [isFollowing, setIsFollowing] = useState(false);
	const [isCurrentUser, setIsCurrentUser] = useState(false);
	const [selectedTab, setSelectedTab] = useState('All');

	// State variables to keep track of followers/following to know if api should be called to fetch more info
	const [followers, setFollowers] = useState([]);
	const [following, setFollowing] = useState([]);
	const [followersSkip, setFollowersSkip] = useState(0);
	const [followingSkip, setFollowingSkip] = useState(0);
	const [isAllFollowers, setIsAllFollowers] = useState(false);
	const [isAllFollowing, setIsAllFollowing] = useState(false);

	const [followersOpen, setFollowersOpen] = useState(false);
	const [followingOpen, setFollowingOpen] = useState(false);

	const [notFound, setNotFound] = useState(false);
	const [errorOccurred, setErrorOccured] = useState(false);

	const formatter = Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

	// Reset state when navigating to different profile pages
	const resetState = () => {
		setUser(null);
		setIsFollowing(false);
		setIsCurrentUser(false);
		setSelectedTab('All');
		setFollowers([]);
		setFollowing([]);
		setFollowersOpen(false);
		setFollowingOpen(false);
		setFollowersSkip(0);
		setFollowingSkip(0);
		setIsAllFollowers(false);
		setIsAllFollowing(false);
	};

	const fetchUserProfile = async () => {
		try {
			const res = await axios.get(`${BASE_URL}/v1/users/${username}/profile`, { headers });
			const { data } = res;

			setUser(data.user);
			setIsFollowing(data.isFollowing);
			setIsCurrentUser(data.isCurrentUser);

		} catch (err) {

			setNotFound(true);
			setErrorOccured(true);
		}
	};

	useEffect(() => {
		resetState();
		fetchUserProfile();
	}, [username]);

	const unfollowUser = async () => {
		try {
			await axios.delete(`${BASE_URL}/v1/users/${username}/followers`, { headers });
			setIsFollowing(false);
			setUser({
				...user,
				followerCount: user.followerCount - 1,
			});
		} catch (err) {
			return;
		}
	};
	
	const followUser = async () => {
		try {
			const res = await axios.post(`${BASE_URL}/v1/users/${username}/followers`, null, { headers });

			setIsFollowing(res.data.isFollowing);
			setUser({
				...user,
				followerCount: user.followerCount + 1,
			});
		} catch (err) {
			return;
		}
	};

	const handleFollow = async () => {
		if (!globalUser) {
			navigate('/login');
		}
		else if (isFollowing) {
			await unfollowUser();
		}
		else {
			await followUser();
		}
	};

	const fetchFollowers = async () => {
		try {
			const res = await axios.get(`${BASE_URL}/v1/users/${username}/followers?skip=${followersSkip}`, { headers });

			const { data } = res;
			if (data.followers.length === 0) {
				setIsAllFollowers(true);
				return;
			}
			// Set current followers to empty array if followers haven't been fetched yet
			setFollowers([...followers, ...data.followers]);
		} catch (err) {
			if (err.response.status === 401) {
				navigate('/login');
				setGlobalUser(null);
			}
		}
	};

	const handleFollowersOpen = async () => {
		// Check if followers have been fetched already
		if (followers.length === 0) {
			await fetchFollowers();
		}
		setFollowersOpen(true);
	};

	const fetchFollowing = async () => {
		try {
			const res = await axios.get(`${BASE_URL}/v1/users/${username}/following?skip=${followingSkip}`, { headers });
			
			const { data } = res;
			if (data.following.length === 0) {
				setIsAllFollowing(true);
				return;
			}

			// Set current following to empty array if followers haven't been fetched yet
			const followingList = following ? following : [];
			setFollowing([...followingList, ...data.following]);
		} catch (err) {
			if (err.response.status === 401) {
				navigate('/login');
				setGlobalUser(null);
			}
		}
	};

	const handleFollowingOpen = async () => {
		// Check if following has been fetched already
		if (following.length === 0) {
			await fetchFollowing();
		}
		setFollowingOpen(true);
	};

	const deletePost = async (postIndex) => {
		try {
			const postID = user.reviews[postIndex]._id;
			await axios.delete(`${BASE_URL}/v1/posts/${postID}`, { headers });

			// Remove post from posts
			const copy = [...user.reviews];
			copy.splice(postIndex, 1);
			setUser({
				...user,
				reviews: copy 
			});
		} catch (err) {
			if (err.response.status === 401) {
				navigate('/login');
				setGlobalUser(null);
			}
		}
	};

	useEffect(() => {
		headers.Authorization = localStorage.getItem('token');
	}, [localStorage.getItem('token')]);

	// Infinite scroll fetch for followers
	useEffect(() => {
		// Don't fetch if change is due to initial render reset
		if (!isAllFollowers && followersSkip !== 0) {
			fetchFollowers();
		}
	}, [followersSkip]);

	// Infinite scroll fetch for following
	useEffect(() => {
		// Don't fetch if change is due to initial render reset
		if (!isAllFollowing && followingSkip !== 0) {
			fetchFollowing();
		}
	}, [followingSkip]);

	if (notFound) {
		return <NotFound />;
	} 
	else if (errorOccurred) {
		return <div>Sorry, an error occured</div>;
	}
	else {
		return (
			<div>
				<div className={styles.profileMain}>
					<Paper sx={{ padding: '0.6rem' }}>
						<Typography variant='h5' align='center'>{user && user.username}</Typography>
						<div className={styles.profileHeader}>
							<Avatar
								src={user ? user.profilePicURL: ''}
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
						{user && <p className={styles.bio}>{user.bio}</p>}
						<section className={styles.userActions}>
							{isCurrentUser ? (
								<>
									<EditProfile currUser={user} setCurrUser={setUser}/>
								</>
							) :
								(<Button
									variant='contained'
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
					<Grid
						container
						alignItems='center'
						sx={{ padding: '1rem' }}
						spacing={2}
						className={`${styles.reviewGrid} ${user && user.reviews.length < 3 ? styles.centered : ''}`}
					>
						<ProfilePostContext.Provider value={{ deletePost }}>
							{user && user.reviews.map((restaurantReview, index) => {
								return (
									<RestaurantReview 
										key={restaurantReview._id}
										index={index}
										restaurantReview={restaurantReview} 
										postUser={user}
										onDelete={deletePost}
									/>
								);
							})}
						</ProfilePostContext.Provider>
					</Grid>
				</div>
			</div>
		);
	}	
}

export default Profile;