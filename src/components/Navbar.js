import React, { useState } from "react"
import { Link } from "react-router-dom";
import styles from '../styles/navbar.module.css';
import { Button } from "@mui/material";
import menuIcon from '../images/menu.svg';

function Navbar() {
	const user = null;
	const [expanded, setExpanded] = useState(false);

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
				{user &&			
					<>
						<Button
							variant="contained"
							className={styles.logoutBtn}
							>
							Sign Out
						</Button>
					</>
				}

				{!user &&
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