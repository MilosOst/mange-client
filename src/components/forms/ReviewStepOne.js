import React, { useState } from "react";
import {
	Typography,
	Button,
	TextField,
	Autocomplete
} from "@mui/material";
import styles from '../../styles/reviewform.module.css';

function ReviewStepOne() {
	const [restaurantName, setRestaurantName] = useState('');
	const [city, setCity] = useState('');
	const [restaurants, setRestaurants] = useState([]);

	const getRestaurants = async () => {
		const request = await fetch(`http://localhost:3000/v1/restaurants/search?query=${restaurantName}&near=${city}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (request.status !== 200) {
			console.log('error');
		}
		else {
			const data = await request.json();
			setRestaurants(data.results)
			console.log(data.results);
		}


	};

	return (
		<div>
			<Typography variant='h5'>Select a restaurant</Typography>
			<form>
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
				{(restaurants.length > 0) && 
					<Autocomplete
						options={restaurants}
						getOptionLabel={option => `${option.name} - ${option.location.address}`}
						renderInput={(option) => <TextField  {...option} label={option.name} variant="outlined" key={option.fsq_id}/>}
					/>
				
				}
			</form>
		</div>
	);
}

export default ReviewStepOne;