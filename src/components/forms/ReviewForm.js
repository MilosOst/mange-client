import React, { useState } from "react";
import { Container, Stepper, Step, StepLabel, Paper, Button } from "@mui/material";
import styles from '../../styles/reviewform.module.css';
import ReviewStepOne from "./ReviewStepOne.js";


function ReviewForm() {
	const [activeStep, setActiveStep] = useState(0);

	const getSteps = () => {
		return ['Choose Restaurant', 'Add Reviews', 'Finish'];
	}

	const handleNext = () => {
		setActiveStep(prevNum => prevNum + 1);
	}

	const getStepsContent = (stepIndex) => {
		switch (stepIndex) {
			case 0:
				return <ReviewStepOne/>
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
				{activeStep === getSteps().length ? 'The Steps' : (
					<>
					{getStepsContent(activeStep)}
					<Button onClick={handleNext}>
						{activeStep === getSteps().length - 1 ? 'Finish' : 'Next'}
					</Button>
					</>

				)}
			</Paper>

			
		</Container>
	);
}

export default ReviewForm;