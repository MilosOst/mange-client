import React from 'react';
import {
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Delete from './options/Delete.js';

function PostMenu({ index, anchorEl, setAnchorEl, options }) {
	const menuOpen = Boolean(anchorEl);

	const getMenuOption = (option) => {
		switch (option) {
			case 'Delete':
				return (
					<Delete key='Delete' index={index}/>
				);
			case 'Save':
				return (
					<MenuItem key='Save'>
						<ListItemIcon>
							<BookmarkBorderIcon/>
						</ListItemIcon>
						<ListItemText>Save</ListItemText>
					</MenuItem>
				);
			default:
				return;
		}
	};

	return (
		<Menu
			keepMounted
			anchorEl={anchorEl}
			open={menuOpen}
			onClose={() => setAnchorEl(null)}
			onClick={() => setAnchorEl(null)}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
		>
			{options && options.map((option) => (
				getMenuOption(option)
			))}
		</Menu>
	);
}

export default PostMenu;