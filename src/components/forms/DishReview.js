import React from 'react';
import { Autocomplete, TextField, Rating, Card, IconButton, Typography, createFilterOptions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RatingFull from './RatingFull';
import RatingEmpty from './RatingEmpty';
import styles from '../../styles/reviewform.module.css';

function DishReview({ review, removeReview, index, setDish, setOpinion, setRating, availableDishes, setAvailableDishes, handleImages }) {
	const filter = createFilterOptions();

	return (
		<Card variant='outlined' sx={{ padding: '2rem' }} className={styles.dishReview}>
			<header className={styles.reviewHeader}>
				<Autocomplete
					className={styles.selectDish}
					value={review.dish ? review.dish : null}
					onChange={(e, value) => {
						// Check if this is a new dish given by the user
						if (value && value.inputValue) {
							setAvailableDishes([...availableDishes, { name: value.inputValue }]);
							setDish(index, { name: value.inputValue });
						}
						else {
							setDish(index, value);
						}
					}}
					filterOptions={(options, params) => {
						const filtered = filter(options, params);

						const { inputValue } = params;
						// Add option to create new value
						const isExisting = options.some((option) => inputValue.toLowerCase() === option.name.toLowerCase());
						if (inputValue !== '' && !isExisting) {
							filtered.push({ inputValue, name: `Add '${inputValue}'` });
						}

						return filtered;
					}}
					selectOnFocus
					clearOnBlur
					handleHomeEndKeys
					size='medium'
					sx={{ flex: 1 }}
					options={availableDishes}
					getOptionLabel={option => option.name}
					isOptionEqualToValue={(option, value) => option.name === value.name}
					renderInput={option => {
						return <TextField
							{...option}
							label={'Dish'}
							key={option.name}
							variant='outlined'
							required
						/>;
					}}
					
				/>
				<Rating
					size='small'
					value={review.rating ? review.rating : null} 
					onChange={(e, value) => setRating(index, value)}
					icon={<RatingFull height={50} width={50}/>}
					emptyIcon={<RatingEmpty height={50} width={50}/>}
				/>
			</header>
			<TextField
				value={review.opinion}
				onChange={(e) => setOpinion(index, e.target.value)}
				variant='outlined'
				label='What did you think of the food?'
				multiline
				minRows={2}
			/>
			<Typography variant='h5'>Add Photos</Typography>
			<TextField 
				type='file' 
				variant='outlined' 
				inputProps={{ accept: '.jpg, .png, .jpeg', multiple: true }}
				onChange={(e) => handleImages(index, e.target.files)}
			/>
			<IconButton onClick={() => removeReview(index)}>
				<DeleteIcon />
			</IconButton>
		</Card>
	);
}

export default DishReview;