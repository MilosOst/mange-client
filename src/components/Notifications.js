import React, { useEffect, useState } from 'react';
import {
	Avatar,
	Badge,
	IconButton,
	ListItemAvatar,
	ListItemText,
	Menu,
	MenuItem,
	MenuList,
	Typography
} from '@mui/material';
import styles from '../styles/notifications.module.css';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

function Notifications({ socket }) {
	const [anchorEl, setAnchorEl] = useState(null);
	const [notifications, setNotifications] = useState([]);
	const menuOpen = Boolean(anchorEl);

	const getNotifications = async () => {
		try {
			const headers = {
				Authorization: localStorage.getItem('token'),
			};

			const res = await axios.get(`${BASE_URL}/v1/users/notifications`, { headers });
			setNotifications(res.data.notifications);
		} catch (err) {
			return;
		}
	};

	useEffect(() => {
		getNotifications();
		if (socket) {
			socket.on('followed', (notification) => {
				setNotifications(prevNotifications => [...prevNotifications, notification]);
			});

			socket.on('removeNotification', (notificationID) => {
				setNotifications(prevNotifications => prevNotifications.filter((notification) => notification._id !== notificationID));
			});
		}
	}, []);

	return (
		<div>
			<IconButton sx={{ color: 'whitesmoke' }} size='large' onClick={(e) => setAnchorEl(e.currentTarget)}>
				<Badge
					badgeContent={notifications.length}
					color='success'
					variant='dot'
					classes={{ dot: styles.dot, badge: styles.badge }}
					anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
				>
					<NotificationsOutlinedIcon sx={{ width: 28, height: 28 }}/>
				</Badge>
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				open={menuOpen}
				onClose={() => setAnchorEl(null)}
				onClick={() => setAnchorEl(null)}
				keepMounted
				PaperProps={{
					style: { maxWidth: '300px' }	
				}}
				transformOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
			>
				<MenuList sx={{ maxHeight: '300px' }}>
					<MenuItem disabled sx={{ justifyContent: 'center' }} divider>
						<Typography
							variant='h6'
							sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'black' }}>
							Notifications
						</Typography>
					</MenuItem>
					{notifications.length ? (
						notifications.map((notification) => (
								<MenuItem
									key={notification._id}
									sx={{ gap: '1rem', whiteSpace: 'normal' }}
									divider
									component={Link}
									to={`/users/${notification.sender.username}`}
								>
									<ListItemAvatar sx={{ minWidth: 'auto' }}>
										<Avatar
											src={notification.sender.profilePicURL}
											sx={{ width: '28px', height: '28px' }}
											/>
									</ListItemAvatar>
									<ListItemText 
										primary={
											<Typography
												variant='caption'
												component='p'
												fontSize='14px'
											>
												{notification.message}
											</Typography>
										}
										secondary={
											<Typography
												sx={{ display: 'block' }}
												component="span"
												variant="body2"
												color='GrayText'
											>
												2h ago
											</Typography>
										}
									/>
								</MenuItem>
						))
					) : (
							<MenuItem disabled>
								<ListItemText>
									No Notifications
								</ListItemText>
							</MenuItem>
					)}
				</MenuList>
			</Menu>
		</div>
	);
}

export default Notifications;