import React, { useState } from "react";
import { Container, Stepper, Step, StepLabel, Paper, Button, Typography } from "@mui/material";
import styles from '../../styles/reviewform.module.css';
import { Link, useNavigate } from 'react-router-dom';
import ReviewStepOne from "./ReviewStepOne.js";
import ReviewStepTwo from "./ReviewStepTwo.js";


function ReviewForm() {
	const [activeStep, setActiveStep] = useState(0);
	const navigate = useNavigate();

	// Step One props
	const [restaurantName, setRestaurantName] = useState('');
	const [city, setCity] = useState('');
	const [restaurants, setRestaurants] = useState([]);
	const [selectedRestaurant, setSelectedRestaurant] = useState(null);

	// Step Two props
	const [validationErrors, setValidationErrors] = useState(null);
	const [reviews, setReviews] = useState([{}]);
	const [reviewTitle, setReviewTitle] = useState('');
	const [availableDishes, setAvailableDishes] = useState([]);

	const getSteps = () => {
		return ['Choose Restaurant', 'Add Reviews'];
	}

	const getRestaurantDishes = async () => {
		const request = await fetch(`http://localhost:3000/v1/restaurants/${selectedRestaurant.fsq_id}/menu`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		});

		if (request.status === 200) {
			const data = await request.json();
			return data.menu;
		}
		return [];
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

			const request = await fetch(`http://localhost:3000/v1/restaurants/${selectedRestaurant.fsq_id}/reviews`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': localStorage.getItem('token'),
				},
				body: JSON.stringify({
					restaurant: selectedRestaurant,
					reviews,
					review_title: reviewTitle,
				}),
			});

			console.log(request.status)

			if (request.status === 201) {
				setActiveStep(prevNum => prevNum + 1);
				return;
			}
			else if (request.status === 401) {
				navigate('/login');
			}
			else {
				const data = await request.json();
				setValidationErrors(data.errors);
			}
		}
		
	}

	const handleBack = () => {
		setActiveStep(prevNum => prevNum - 1);
	}

	

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
					setSelectedRestaurant={setSelectedRestaurant} />
			case 1:
				return <ReviewStepTwo
					reviews={reviews}
					setReviews={setReviews}
					availableDishes={availableDishes}
					setAvailableDishes={setAvailableDishes}
					reviewTitle={reviewTitle}
					setReviewTitle={setReviewTitle}
					validationErrors={validationErrors}
				/>
			default:
				return <Typography variant="h4" component={Link} to='/'>
					Thank you for your submission. Return to homepage
				</Typography>
		}
	}
	



	return (
		<Container maxWidth='lg'>
			<Paper className={styles.form}>
				<Stepper className={styles.stepper} activeStep={activeStep} alternativeLabel>
					{getSteps().map(label => {
						return <Step
									key={label}
									sx={{
									"& .MuiStepIcon-root.Mui-active": { color: '#d91426' },
									"& .MuiStepIcon-root.Mui-completed": { color: '#d91426' }
									}}>
									<StepLabel>
										{label}
									</StepLabel>
								</Step>
					})}
				</Stepper>
				<br />
				<form onSubmit={handleNext} className={styles.form}>
					{getStepsContent(activeStep)}
					<div className={styles.progSection}>
						{activeStep === 1 &&
							<Button
								variant="outlined"
								onClick={handleBack}
								className={styles.backBtn}>
								Back
							</Button>
						}
						{activeStep < getSteps().length &&
							<Button
								type='submit'
								variant="contained"
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