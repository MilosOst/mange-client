import React, { useState } from "react";
import { Container, Stepper, Step, StepLabel, Paper, Button } from "@mui/material";
import styles from '../../styles/reviewform.module.css';
import ReviewStepOne from "./ReviewStepOne.js";


function ReviewForm() {
	const [activeStep, setActiveStep] = useState(0);

	// Step One Information
	const [restaurantName, setRestaurantName] = useState('');
	const [city, setCity] = useState('');
	const [restaurants, setRestaurants] = useState([]);
	const [selectedRestaurant, setSelectedRestaurant] = useState(null);


	const getSteps = () => {
		return ['Choose Restaurant', 'Add Reviews', 'Finish'];
	}

	const handleNext = (e) => {
		e.preventDefault();
		setActiveStep(prevNum => prevNum + 1);
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
				return 'Step 2 (Add Dish Reviews)';
			case 2:
				return 'Step 3 (Confirm Submission)';
			default:
				return 'Unknown Step';
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
						{activeStep > 0 &&
							<Button variant="outlined" onClick={handleBack}>
								Back
							</Button>
						}
						{activeStep < getSteps().length &&
							<Button
								type='submit'
								variant="outlined"
								sx={{ marginLeft: 'auto' }}>
								{activeStep === getSteps().length - 1 ? 'Finish' : 'Next'}
							</Button>
						}
					</div>
				</form>
			</Paper>

			
		</Container>
	);
}

export default ReviewForm;