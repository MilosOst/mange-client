import React, { useState } from 'react';
import { Typography, Button } from '@mui/material';
import styles from '../../styles/reviewform.module.css';
import DishReviewForm from './DishReviewForm.js';

function ReviewStepTwo({ reviews, setReviews, availableDishes, setAvailableDishes, validationErrors, images, setImages }) {
	const [error, setError] = useState(null);
	
	const addReview = () => {
		setReviews([...reviews, {}]);
		setError(null);
	};

	const removeReview = (reviewIndex) => {
		if (reviews.length === 1) {
			setError('You must include at least one review.');
			return;
		}
		const copy = [...reviews];
		copy.splice(reviewIndex, 1);
		setReviews(copy);
	};

	const setDish = (index, dish) => {
		const copy = [...reviews];
		
		copy[index].dish = dish;
		setReviews(copy);
	};

	const setOpinion = (index, opinion) => {
		const copy = [...reviews];
		copy[index].opinion = opinion;
		setReviews(copy);
	};

	const setRating = (index, rating) => {
		const copy = [...reviews];
		copy[index].rating = rating;
		setReviews(copy);
	};

	const handleImages = (index, image) => {
		const copy = [...images];
		copy[index] = image;
		setImages(copy);
	};

	return (
		<div className={styles.stepTwo}>
			<header className={styles.formHeader}>
				<Typography variant='h5'>Add Dish Reviews</Typography>
				<Button
					variant='contained'
					className={styles.addBtn}
					onClick={addReview}>
					Add Dish
				</Button>
			</header>
			<ul className={styles.reviews}>
				{reviews.map((review, index) => {
					return <DishReviewForm
						review={review}		
						key={index} 
						setDish={setDish}
						setOpinion={setOpinion}
						setRating={setRating}
						removeReview={removeReview} 
						index={index}
						availableDishes={availableDishes}
						setAvailableDishes={setAvailableDishes}
						handleImages={handleImages}
						/>;
				})}
			</ul>
			<p className={styles.error}>{error}</p>
			{validationErrors && 
				<ul style={{ listStyle: 'none' }}>
					{validationErrors.map((error, index) => <li className={styles.error} key={`${index}: ${error.msg}`}>{error.msg}</li>)}
				</ul>
			}
		</div>
	);
}

export default ReviewStepTwo;