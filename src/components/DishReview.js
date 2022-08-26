import React from 'react';
import styles from '../styles/review.module.css';
import {
	CardMedia,
	CardContent,
	Rating,
	Typography,
} from '@mui/material';
import RatingFull from './forms/RatingFull.js';
import RatingEmpty from './forms/RatingEmpty.js';
import foodPlaceholder from '../images/food-placeholder.png';

function DishReview({ review }) {
	return (
			<>
				<CardMedia
					className={styles.media}
					component='img'
					src={review.photoURL || foodPlaceholder}
				/>
				<CardContent className={styles.cardContent}>
					<Typography variant='h5'>
						{review.dish.name}
					</Typography>
					<Rating
						size='small'
						value={review.rating}
						emptyIcon={<RatingEmpty height={30} width={30}/>}
						icon={<RatingFull height={30} width={30}/>}
						readOnly
					/>
					<Typography>
						{review.content}
					</Typography>
				</CardContent>
			</>
	);
}

export default DishReview;