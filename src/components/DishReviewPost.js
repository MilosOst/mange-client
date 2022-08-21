import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Rating } from "@mui/material";
import RatingFull from "./forms/RatingFull.js";
import RatingEmpty from "./forms/RatingEmpty.js";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import styles from '../styles/profile.module.css';

function DishReviewPost({ review }) {

	return (
		<Accordion>
			<AccordionSummary expandIcon={<ExpandMoreIcon/>}>
				<header className={styles.dishReviewHeader}>
					<div>
						<RestaurantMenuIcon/>
						<Typography variant="subtitle1">{review.dish.name}</Typography>
					</div>
					<Rating
						size='small'
						value={review.rating}
						emptyIcon={<RatingEmpty height={30} width={30}/>}
						icon={<RatingFull height={30} width={30}/>}
						readOnly
					/>
				</header>
			</AccordionSummary>
			<AccordionDetails>
				<p style={{ textAlign: 'left' }}>{review.content}</p>
			</AccordionDetails>
		</Accordion>
	);
	
}

export default DishReviewPost;