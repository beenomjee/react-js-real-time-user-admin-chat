import React, { useState } from 'react'
import styles from './Header.module.scss'
import { IoIosMenu } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const Menu = ({ isMenuOpen, handleClose }) => {
    const navigate = useNavigate()
    const handleLogout = () => {
        window.localStorage.removeItem('user');
        navigate('/signin')
    }
    return (
        <div className={styles.menu}>
            <div onClick={handleClose} className={`${styles.bgWrapper} ${(isMenuOpen) ? styles.open : ''}`}></div>
            <div className={`${styles.menuContainer} ${(isMenuOpen ? styles.open : '')}`}>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}
const Header = ({ id, user }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleClose = () => {
        setIsMenuOpen(false);
    }
    return (
        <div className={`${styles.container} ${id ? styles.close : ''}`}>
            <div className={styles.left}>
                <button onClick={() => setIsMenuOpen(true)} className={styles.icon}><IoIosMenu /></button>
                <Menu isMenuOpen={isMenuOpen} handleClose={handleClose} />
            </div>
            <div className={styles.right}>
                <img src={user.file ? user.file : '/avatar.png'} alt="AVATAR" />
                <span>{`${user.fName} ${user.lName}`}</span>
            </div>
        </div>
    )
}

export default Header