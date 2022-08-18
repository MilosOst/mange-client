import React from "react";
import {
	Typography,
	Button,
	TextField,
	Autocomplete
} from "@mui/material";
import styles from '../../styles/reviewform.module.css';

function ReviewStepOne({ restaurantName, setRestaurantName, city, setCity, restaurants, setRestaurants, selectedRestaurant, setSelectedRestaurant}) {

	const getRestaurants = async () => {
		const request = await fetch(`http://localhost:3000/v1/restaurants/search?query=${restaurantName}&near=${city}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (request.status !== 200) {
			return;
		}
		else {
			const data = await request.json();
			setRestaurants(data.results)
		}
	};

	return (
		<div>
			<Typography variant='h5'>Select a restaurant</Typography>
			<div>
				<TextField
					className={styles.textField}
					label="Restaurant Name"
					variant={"outlined"}
					value={restaurantName}
					onChange={(e) => setRestaurantName(e.target.value)}
				/>
				<TextField
					className={styles.textField}
					label="City"
					variant={"outlined"}
					value={city}
					onChange={(e) => setCity(e.target.value)}
					error={city === ''}
					helperText={city === '' ? 'Please specify a city': ''}
					required
				/>
				<Button
					variant="outlined"
					disabled={city === '' ? true : false}
					style={{ marginBottom: "1rem" }}
					onClick={getRestaurants}
					>
					Search Restaurants
				</Button>
				<Autocomplete
					value={selectedRestaurant}
					onChange={(e, value) => setSelectedRestaurant(value)}
					options={restaurants}
					getOptionLabel={option => option.formatted}
					renderInput={(option) => {
						return <TextField {...option}
							label={'Restaurant'}
							variant="outlined"
							key={option.fsq_id}
							error={!selectedRestaurant}
							required/>
					}}
				/>
				
			</div>
		</div>
	);
}

export default ReviewStepOne;