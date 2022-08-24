import axios from 'axios';
import React, { useState } from 'react';

function ImageUpload() {
	const [file, setFile] = useState(null);

	const sendData = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		if (file) formData.append('image', file);
		console.log(formData);

		await axios.put('http://localhost:3000/v1/users/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
	};

	return (
		<div>
			<div onClick={() => console.log(file)}>Value</div>
			<form onSubmit={sendData}>
				<input
					type="file"
					onChange={(e) => setFile(e.target.files[0])}
					accept='image/*'
				/>
				<button type='submit'>Send</button>
			</form>
		</div>
	);
}

export default ImageUpload;