import React, { useContext, useState } from 'react';
import axios from 'axios';
import profileStyles from '../styles/profile.module.css';
import styles from '../styles/editprofile.module.css';
import {
	Button,
	Dialog,
	DialogContent,
	Avatar,
	Typography,
	TextField
} from '@mui/material';
import { AuthContext } from '../contexts/AuthContext.js';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function EditProfile({ currUser, setCurrUser }) {
	const [open, setOpen] = useState(false);
	const [imageFile, setImageFile] = useState(null);
	const [selectedImage, setSelectedImage] = useState(currUser.profilePicURL);
	const [bio, setBio] = useState(currUser.bio);
	const [error, setError] = useState(null);

	const { user, setUser } = useContext(AuthContext);
	
	const handleImageChange = (e) => {
		setImageFile(e.target.files[0]);
		URL.revokeObjectURL(selectedImage);
		setSelectedImage(URL.createObjectURL(e.target.files[0]));
	};

	const closeForm = () => {
		if (selectedImage) URL.revokeObjectURL(selectedImage);
		setError(null);
		setSelectedImage(null);
		setImageFile(null);
		setOpen(false);
	};

	const validateImage = () => {
		const validFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];
		if (imageFile && !(validFileTypes.includes(imageFile?.type))) {
			setError('Invalid image type. Images must be one of the following: png, jpeg, jpg');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		validateImage();
		
		try {
			const headers = {
				Authorization: localStorage.getItem('token'),
				'Content-Type': 'multipart/form-data',
			};
			const formData = new FormData();
			if (imageFile) formData.append('profileImage', imageFile);
			formData.append('bio', bio);

			const res = await axios.put(`${BASE_URL}/v1/users/${currUser.username}/profile`, formData, { headers });

			const { data } = res;

			setCurrUser({
				...currUser,
				bio: data.bio,
				profilePicURL: data.imageURL ? data.imageURL : user.profilePicURL,
			});

			// Update global user profile picture
			setUser({
				...user,
				profilePicURL: data.imageURL ? data.imageURL : user.profilePicURL,
			});

			closeForm();
		} catch (err) {
			setError(err.response.data.error);
		}
	};

	return (
		<>
			<Button
				variant='contained'
				className={`${profileStyles.profileBtn}`}
				onClick={() => setOpen(true)}>
				Edit Profile
			</Button>
			<Dialog open={open} onClose={closeForm} maxWidth='xl'>
				<DialogContent className={profileStyles.modal}>
					<form className={styles.form} onSubmit={handleSubmit}>
						<header className={styles.editHeader}>
							<Button variant='text' sx={{ color: 'gray' }} onClick={closeForm}>Close</Button>
							<Typography variant='subtitle1' sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Edit Profile</Typography>
							<Button variant='text' type='submit'>Done</Button>
						</header>
						<div className={styles.photoSection}>
							<Avatar src={selectedImage} sx={{ width: 80, height: 80 }} />
							<Typography component='label' sx={{ color: 'royalblue', cursor: 'pointer' }}>
								Change profile picture
								<input type='file' accept='image/jpeg, image/jpg, image/png' hidden onChange={handleImageChange}/>
							</Typography>
						</div>
						<TextField
							label='Bio'
							value={bio}
							onChange={(e) => setBio(e.target.value)}
						/>
						{error && <p className={styles.error}>{error}</p>}
					</form>
				</DialogContent>
			</Dialog>
		</>
		
	);
}

export default EditProfile;