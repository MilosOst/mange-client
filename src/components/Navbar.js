import React, { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import styles from '../styles/navbar.module.css';
import { Button } from "@mui/material";
import menuIcon from '../images/menu.svg';
import { AuthContext } from "../contexts/AuthContext.js";

function Navbar() {
	const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
	const [expanded, setExpanded] = useState(false);

	let navigate = useNavigate();

	const logOut = () => {
		localStorage.removeItem('token');
		setIsLoggedIn(false);
		navigate('/login');
	}

	return (
		<nav className={styles.navbar}>
			<header className={styles.navHeader}>
				<h2 className={styles.brandTitle}>Mange</h2>
				<button className={styles.menuBtn} onClick={() => setExpanded(!expanded)}>
					<img src={menuIcon} alt="Toggle Menu" />
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
						<Button
							variant="contained"
							className={styles.logoutBtn}
							onClick={logOut}
							>
							Sign Out
						</Button>
					</>
				}

				{!isLoggedIn &&
				<>
					<Button
						variant="outlined"
						component={Link}
						to='/sign-up'
						sx={{ color: 'white', borderColor: 'white' }}>
						Sign Up
					</Button>
					<Button
						variant="contained"
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