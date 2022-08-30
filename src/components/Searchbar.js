import React, { useEffect, useState } from 'react';
import {
	Autocomplete,
	TextField,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Avatar,
} from '@mui/material';
import axios from 'axios';
// import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function Searchbar() {
	const [username, setUsername] = useState(null);
	const [results, setResults] = useState([]);
	const [open, setOpen] = useState(false);

	const fetchUsers = async () => {
		if (!username) return;

		try {
			const res = await axios.get(`${BASE_URL}/v1/users/search?username=${username}`);
			setResults(res.data);
		} catch (err) {
			setResults([]);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, [username]);

	return (
		<Autocomplete 
			size='small'
			open={open}
			onOpen={() => setOpen(true)}
			onClose={() => setOpen(false)}
			options={results}
			getOptionLabel={(option) => option.username}
			sx={{ width: '200px', backgroundColor: 'whitesmoke', borderRadius: 3 }}
			filterOptions={(x) => x}
			noOptionsText={!username ? 'Enter a username to search' : 'No users found'}
			forcePopupIcon={false}
			renderOption={(params, user) => (
				<ListItem component={Link} to={`/users/${user.username}`} key={user.username} onClick={() => setOpen(false)}>
					<ListItemAvatar>
						<Avatar src={user.profilePicURL} alt={user.username} sx={{ width: '45px', height: '45px', backgroundColor: '#d91426' }}/>
					</ListItemAvatar>
					<ListItemText sx={{ color: 'black !important' }}>{user.username}</ListItemText>
				</ListItem>
			)}
			renderInput={(params) => (
				<TextField {...params}
					placeholder='Search Users'
					variant='outlined'
					onChange={(e) => setUsername(e.target.value)}
				/>
			)}
		/>
	);
}

export default Searchbar;