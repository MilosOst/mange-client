import React from 'react';
import {
	Dialog, 
	DialogContent, 
	Typography, 
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Avatar
} from '@mui/material';
import { Link } from 'react-router-dom';
import styles from '../styles/userslist.module.css';
import CloseIcon from '@mui/icons-material/Close';

function UsersListModal({ open, setOpen, title, users, setSkip }) {
	
	const handleScroll = (e) => {
		const { offsetHeight, scrollTop, scrollHeight } = e.target;

		if (offsetHeight + scrollTop >= scrollHeight) {
			setSkip(users ? users.length : 0);
		}
	};

	return (
		<Dialog open={open} onClose={() => setOpen(false)} maxWidth='xl'>
			<DialogContent className={styles.modal}>
				<header className={styles.header}>
					<Typography variant='h6'>{title}</Typography>
					<IconButton  
						onClick={() => setOpen(false)}
						sx={{ position: 'absolute', top: '10px', right: '10px', width: '24px', height: '24px' }}
						size='sm'	
					>
						<CloseIcon />
					</IconButton>
				</header>
				<List className={styles.usersList} onScroll={handleScroll}>
					{users && users.map((user) => {
						return (
							<ListItem component={Link} to={`/users/${user.username}`} key={user._id} className={styles.link}>
								<ListItemAvatar>
									<Avatar src={`users/${user.username}`} alt={user.username} sx={{ width: '45px', height: '45px', backgroundColor: '#d91426' }}/>
								</ListItemAvatar>
								<ListItemText>{user.username}</ListItemText>
						</ListItem>
						);
					})}
				</List>
			</DialogContent>
		</Dialog>
	);
}

export default UsersListModal;