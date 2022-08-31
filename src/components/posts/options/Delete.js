import React, { useContext, useState } from 'react';
import { ProfilePostContext } from '../../../contexts/ProfilePostContext.js';
import {
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	ListItemIcon,
	ListItemText,
	MenuItem
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function Delete({ index }) {
	const { deletePost } = useContext(ProfilePostContext);
	const [isResponsePending, setIsResponsePending] = useState(false);
	const [open, setOpen] = useState(false);

	const handleConfirm = async () => {
		setIsResponsePending(true);
		await deletePost(index);
		setOpen(false);
	};

	return (
		<>
			<MenuItem onClick={() => setOpen(true)}>
				<ListItemIcon>
					<DeleteOutlineIcon/>
				</ListItemIcon>
				<ListItemText>Delete</ListItemText>
			</MenuItem>
			<Dialog
				open={open}
				keepMounted
				onClose={() =>  setOpen(false)}
				maxWidth='xl'
			>
				<DialogTitle sx={{ fontFamily: 'Literata, serif', fontWeight: 'bold' }}>
					Are you sure you want to delete this post?
				</DialogTitle>
				<DialogActions sx={{ justifyContent: 'center' }}>
					<Button onClick={() => setOpen(false)} sx={{ color: 'gray' }}>Cancel</Button>
					<Button
						disabled={isResponsePending}
						onClick={handleConfirm}
						sx={{ color: '#d91426' }}>
						Confirm
					</Button>
				</DialogActions>
				
			</Dialog>
		</>
	);
}

export default Delete;