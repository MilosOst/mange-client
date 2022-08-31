import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Container, Stepper, Step, StepLabel, Paper, Button, Alert } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext.js';
import styles from '../../styles/reviewform.module.css';
import { Link, useNavigate } from 'react-router-dom';
import ReviewStepOne from './ReviewStepOne.js';
import ReviewStepTwo from './ReviewStepTwo.js';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function ReviewForm() {
	const { setGlobalUser } = useContext(AuthContext);

	const [activeStep, setActiveStep] = useState(0);
	const [isResponsePending, setIsResponsePending] = useState(false);
	const navigate = useNavigate();

	// Step One props
	const [restaurantName, setRestaurantName] = useState('');
	const [city, setCity] = useState('');
	const [restaurants, setRestaurants] = useState([]);
	const [selectedRestaurant, setSelectedRestaurant] = useState(null);

	// Step Two props
	const [validationErrors, setValidationErrors] = useState(null);
	const [reviews, setReviews] = useState([{}]);
	const [images, setImages] = useState([]);
	const [availableDishes, setAvailableDishes] = useState([]);

	const getSteps = () => {
		return ['Choose Restaurant', 'Add Reviews'];
	};

	const getRestaurantDishes = async () => {
		try {
			const res = await axios.get(`${BASE_URL}/v1/restaurants/${selectedRestaurant.fsq_id}/menu`);
			return res.data.menu;
		} catch (err) {
			return [];
		}
	};

	const submitReview = async () => {
		if (isResponsePending) return;
		setIsResponsePending(true);

		try {
			const headers = {
				Authorization: localStorage.getItem('token'),
				'Content-Type': 'multipart/form-data',
			};
			const formData = new FormData();
			formData.append('reviews', JSON.stringify(reviews));
			formData.append('restaurant', JSON.stringify(selectedRestaurant));

			// Append images
			images.forEach((image, index) => {
				formData.append(`image${index}`, image);
			});

			await axios.post(`${BASE_URL}/v1/restaurants/${selectedRestaurant.fsq_id}/reviews`, formData, { headers });
			setActiveStep(prevStep => prevStep + 1);
		} catch (err) {
			const { response } = err;
			if (response.status === 401) {
				setGlobalUser(null);
				navigate('/login');
			}
			else if (response.status === 400) {
				setValidationErrors(response.data.errors);
			}
		}
		setIsResponsePending(false);
	};

	const handleNext = async (e) => {
		e.preventDefault();

		if (activeStep === 0) {
			// Get restaurant dishes when progressing to second stage
			const dishes = await getRestaurantDishes();
			setAvailableDishes(dishes);
			setActiveStep(prevNum => prevNum + 1);
		}
		else if (activeStep === 1) {
			// First, verify ratings are specified for all reviews
			const isRatingsSet = reviews.every((review) => review.rating > 0);
			
			if (!isRatingsSet) {
				setValidationErrors([ { msg: 'You must select a rating for each review.' } ]);
				return;
			}
			await submitReview();
		}
	};

	const handleBack = () => {
		setActiveStep(prevNum => prevNum - 1);
	};

	const getStepsContent = (stepIndex) => {
		switch (stepIndex) {
			case 0:
				return <ReviewStepOne
					restaurantName={restaurantName}
					setRestaurantName={setRestaurantName}
					city={city}
					setCity={setCity}
					restaurants={restaurants}
					setRestaurants={setRestaurants}
					selectedRestaurant={selectedRestaurant}
					setSelectedRestaurant={setSelectedRestaurant} />;
			case 1:
				return <ReviewStepTwo
					reviews={reviews}
					setReviews={setReviews}
					availableDishes={availableDishes}
					setAvailableDishes={setAvailableDishes}
					validationErrors={validationErrors}
					images={images}
					setImages={setImages}
				/>;
			default:
				return (
					<div className={styles.submitted}>
						<Alert severity='success' variant='filled'>Thank you for your submission</Alert>
						<Link to='/' className={styles.link}>Return to Homepage</Link>
					</div>
				);
		}
	};
	
	return (
		<Container maxWidth='lg'>
			<Paper className={styles.form}>
				<Stepper className={styles.stepper} activeStep={activeStep} alternativeLabel>
					{getSteps().map(label => {
						return <Step
									key={label}
									sx={{
									'& .MuiStepIcon-root.Mui-active': { color: '#d91426' },
									'& .MuiStepIcon-root.Mui-completed': { color: '#d91426' }
									}}>
									<StepLabel>
										{label}
									</StepLabel>
								</Step>;
					})}
				</Stepper>
				<br />
				<form onSubmit={handleNext} className={styles.form}>
					{getStepsContent(activeStep)}
					<div className={styles.progSection}>
						{activeStep === 1 &&
							<Button
								variant='outlined'
								onClick={handleBack}
								className={styles.backBtn}>
								Back
							</Button>
						}
						{activeStep < getSteps().length &&
							<Button
								type='submit'
								variant='contained'
								disabled={isResponsePending}
								className={styles.nextBtn}>
								{activeStep === getSteps().length - 1 ? 'Post Review' : 'Next'}
							</Button>
						}
					</div>
				</form>
			</Paper>
		</Container>
	);
}

export default ReviewForm;