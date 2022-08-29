import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/navbar.module.css';
import {
	Button,
	IconButton,
	Avatar,
	Menu,
	MenuItem,
	ListItemIcon
} from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import menuIcon from '../images/menu.svg';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AuthContext } from '../contexts/AuthContext.js';
import Searchbar from './Searchbar.js';
import NavLogo from '../images/mange-nav-logo2.png';

function Navbar() {
	const { isLoggedIn, setIsLoggedIn, user, setUser } = useContext(AuthContext);
	const [expanded, setExpanded] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	let navigate = useNavigate();
	let location = useLocation();

	const logOut = () => {
		localStorage.removeItem('token');
		setIsLoggedIn(false);
		setUser(null);
		navigate('/login');
	};

	const handleClick = (e) => {
		setAnchorEl(e.currentTarget);
	};

	useEffect(() => {
		setExpanded(false);
	}, [location.pathname]);

	return (
		<nav className={styles.navbar}>
			<header className={styles.navHeader}>
				<div>
					<img src={NavLogo} alt="Mange" className={styles.navLogo}  onClick={() => navigate('/')}/>
				</div>
				<button className={styles.menuBtn} onClick={() => setExpanded(!expanded)}>
					<img src={menuIcon} alt='Toggle Menu' />
				</button>
			</header>
			<ul className={`${styles.navLinks} ${expanded ? styles.expanded : ''}`}>
				<li><Link to='/' className={styles.navLink}>Home</Link></li>
				<li><Link to='/restaurants' className={styles.navLink}>Restaurants</Link></li>
				<li><Link to='/explore' className={styles.navLink}>Explore</Link></li>
			</ul>
			<section className={`${styles.profileSection} ${expanded ? styles.expanded : ''}`}>
				{isLoggedIn &&			
					<>
					<Searchbar/>
					<IconButton onClick={handleClick}>
						<Avatar src={user.profilePicURL} />
					</IconButton>
					<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={() => setAnchorEl(null)}
						onClick={() => setAnchorEl(null)}
					>
						<MenuItem sx={{ gap: '8px' }} component={Link} to={`/users/${user.username}`}>
							<ListItemIcon className={styles.menuItem}>
								<AccountCircleIcon className={styles.menuIcon} /> Profile
							</ListItemIcon>
						</MenuItem>
						<MenuItem component={Link} to='/reviews/new'>
							<ListItemIcon className={styles.menuItem}>
								<AddIcon className={styles.menuIcon}/> Add Review
							</ListItemIcon>
						</MenuItem>
						<MenuItem onClick={logOut}>
							<ListItemIcon className={styles.menuItem}>
								<Logout className={styles.menuIcon}/> Sign Out
							</ListItemIcon>
						</MenuItem>
					</Menu>
					</>
				}

				{!isLoggedIn &&
				<>
					<Button
						variant='outlined'
						component={Link}
						to='/sign-up'
						sx={{ color: 'white', borderColor: 'white' }}>
						Sign Up
					</Button>
					<Button
						variant='contained'
						component={Link}
						to='/login'
						className={styles.loginBtn}>
						Log In
					</Button>
				</>
				}

			</section>
		</nav>
	);
}

export default Navbar;