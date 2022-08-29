import React from 'react';
import styles from '../styles/review.module.css';
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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import moment from 'moment';
import { Link } from 'react-router-dom';

function RestaurantReview({ restaurantReview, user, fullWidth }) {
	
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
							src={user.profilePicURL} 
							component={Link} 
							to={`/users/${user.username}`}	
						/> }
					title={user.username}
					subheader={`${moment(restaurantReview.date_posted).fromNow()} @ ${restaurantReview.restaurant.name}`}
					action={
						<IconButton >
							<MoreVertIcon />
						</IconButton>
					}
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
					<IconButton>
						<FavoriteBorderIcon sx={{ marginLeft: '6px' }} />
					</IconButton>
					<IconButton>
						<ChatBubbleOutlineIcon />
					</IconButton>
				</CardActions>
			</Card>
		</Grid>
	);
}

export default RestaurantReview;