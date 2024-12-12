import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src={logo} alt="Logo" height={40} width={200}/>
      </div>
      <ul className={`${styles.navLinks} ${isMobileMenuOpen ? styles.active : ""}`}>
        {/* <li><Link to="/login">SIGN IN</Link></li>
        <li><Link to="/signup">SIGN UP</Link></li> */}
        <li><Link to="/profile">PROFILE</Link></li>
      </ul>
      <div className={styles.mobileMenuIcon} onClick={toggleMenu}>
        <span className="material-icons">MENU</span>
      </div>
    </nav>
  );
};

export default Navbar;
