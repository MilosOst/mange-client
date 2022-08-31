import React, { useContext, useState } from 'react';
import styles from '../../styles/review.module.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
	Scrollbar,
	Pagination,
	Navigation,
	A11y,
} from 'swiper';
import {
	Avatar,
	Card,
	CardHeader,
	CardActions,
	IconButton,
	Grid,
} from '@mui/material';
import DishReview from './DishReview.js';
import PostMenu from './PostMenu.js';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext.js';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const formatter = Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const headers = {
	Authorization: localStorage.getItem('token')
};

function RestaurantReview({ index, restaurantReview, postUser, fullWidth }) {
	const [hasLiked, setHasLiked] = useState(restaurantReview.liked);
	const [likeCount, setLikeCount] = useState(restaurantReview.likeCount);
	const [anchorEl, setAnchorEl] = useState(null);

	const navigate = useNavigate();
	const { setGlobalUser } = useContext(AuthContext);

	const likePost = async () => {
		try {
			const res = await axios.post(`${BASE_URL}/v1/posts/${restaurantReview._id}/likes`, null, { headers });
			setHasLiked(res.data.liked);
			setLikeCount(res.data.likeCount);
		} catch (err) {
			const status = err.response.status;
			if (status === 401) {
				navigate('/login');
				setGlobalUser(null);
			} 
			else if (status === 409) {
				setLikeCount(err.response.data.likeCount);
				setHasLiked(err.response.data.liked);
			}
		}	
	};

	const unlikePost = async () => {
		try {
			const res = await axios.delete(`${BASE_URL}/v1/posts/${restaurantReview._id}/likes`, { headers });
			setHasLiked(res.data.liked);
			setLikeCount(res.data.likeCount);
		} catch (err) {
			const status = err.response.status;
			if (status === 401) {
				navigate('/login');
				setGlobalUser(null);
			}
		}
	};

	const handleLikeClick = async () => {
		hasLiked ? await unlikePost() : await likePost();
	};

	const bindMenu = (e) => {
		setAnchorEl(e.currentTarget);
	};
	
	return (
		<Grid
			item
			justifyContent='stretch' 
			xs={12}
			sm={12}
			md={fullWidth ? 12 : 6}
			lg={fullWidth ? 12 : 4}
		>
			<Card className={styles.card} variant='elevation' elevation={8}>
				<CardHeader
					avatar={
						<Avatar
							src={postUser.profilePicURL} 
							component={Link} 
							to={`/users/${postUser.username}`}	
						/> }
					title={postUser.username}
					subheader={`${moment(restaurantReview.date_posted).fromNow()} @ ${restaurantReview.restaurant.name}`}
					action={
						<IconButton onClick={bindMenu}>
							<MoreVertIcon />
						</IconButton>
					}
				/>
				<PostMenu
					index={index}
					anchorEl={anchorEl} 
					setAnchorEl={setAnchorEl} 
					options={restaurantReview.options}
				/>
				<Swiper
					grabCursor
					modules={[Navigation, Pagination, Scrollbar, A11y]}
					navigation
					slidesPerView={1}
					pagination={{ clickable: true }}
					scrollbar={{ draggable: true }}
					className={styles.swiper}
				>
					{restaurantReview && restaurantReview.dishReviews.map((dishReview) => {
						return (
							<SwiperSlide key={dishReview._id}>
								<DishReview review={dishReview}/>
							</SwiperSlide>
						);
					})}
				</Swiper>

				<CardActions className={styles.cardActions}>
					<div className={styles.cardAction}>
						<IconButton onClick={handleLikeClick}>
							<FavoriteBorderIcon sx={{ marginLeft: '6px' }} color={hasLiked ? 'secondary' : 'inherit'}/>
						</IconButton>
						<span className={styles.statCount}>{formatter.format(likeCount)}</span>
					</div>
					<div>
						<IconButton>
							<ChatBubbleOutlineIcon />
						</IconButton>
					</div>
				</CardActions>
			</Card>
		</Grid>
	);
}

export default RestaurantReview;