import React from 'react';
import styles from '../styles/profile.module.css';
import { Button, Card, Typography } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DishReviewPost from './DishReviewPost.js';
import moment from 'moment';

function RestaurantReview({ restaurantReview }) {
	return (
		<Card sx={{ textAlign: 'center', padding: '1rem', margin: '1rem 0' }} key={restaurantReview._id}>
			<h4 className={styles.reviewTitle}>
				{restaurantReview.title}
			</h4>
			<div className={styles.restaurantInfo}>
				<Typography className={styles.iconTextBox} gutterBottom>
					<LocationOnIcon/>
					{restaurantReview.restaurant.name}
				</Typography>
				<Typography align='left' className={styles.datePosted}>
					{moment(restaurantReview.date_posted).fromNow()}
				</Typography>
			</div>
			<ul className={styles.dishReviews}>
				{restaurantReview && restaurantReview.dishReviews.map((dishReview) => {
					return <DishReviewPost key={dishReview._id} review={dishReview} />;
				})}
			</ul>
			<section className={styles.reviewActions}>
				<Button startIcon={<ThumbUpAltIcon/>}>
					Like
				</Button>
				<Button startIcon={<ThumbDownIcon/>}>
					Dislike
				</Button>
			</section>
		</Card>
	);
}

export default RestaurantReview;