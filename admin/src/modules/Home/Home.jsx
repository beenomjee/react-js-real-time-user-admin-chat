import React, { useEffect, useState } from 'react'
import styles from './Home.module.scss';
import { Header, Loader2 } from '../../components';
import { MdOutlineKeyboardBackspace, MdSend } from 'react-icons/md'
import axios from 'axios';

const Home = ({ user }) => {
    const [id, setId] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchText, setSearchText] = useState('')
    const [message, setMessage] = useState('')
    const handleUserId = (id) => {
        setSearchText('');
        setId(id);
    }

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        const searchText = e.target.value;
        setFilteredUsers(allUsers.filter(user => user.email.startsWith(searchText)));
    }

    const handleMessageSubmit = (e) => {
        e.preventDefault();
    }

    useEffect(() => {
        setIsLoading(true);
        const getUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/auth', {
                    params: {
                        token: user.token
                    }
                });
                setAllUsers(response.data)
                setIsLoading(false)
            } catch (err) {
                console.log(err);
                alert(err.message);
            }
        }
        getUsers();
    }, []);
    return (
        <>
            <Header id={id} user={user} />
            <div className={styles.container}>
                <div className={`${styles.left} ${id ? styles.close : ''}`}>
                    <form action="#" className={styles.top}>
                        <input type="text" required placeholder='Search User' value={searchText} onChange={handleSearchChange} />
                    </form>
                    <div className={styles.bottom}>
                        {
                            isLoading ? <Loader2 /> :
                                (searchText && filteredUsers.length == 0) ? <p>No User with this email.</p>
                                    : (searchText) ?
                                        filteredUsers.map((user) => (
                                            <div key={user._id} onClick={() => handleUserId(user._id)} className={user._id == id ? styles.selected : ''}>
                                                <img src={user.file ? user.file : "/avatar.png"} alt={`${user.fName} ${user.lName}`} />
                                                <div className={styles.info}>
                                                    <p>{`${user.fName} ${user.lName}`}</p>
                                                    <span>{user.email}</span>
                                                </div>
                                            </div>))
                                        : allUsers.map((user) => (
                                            <div key={user._id} onClick={() => handleUserId(user._id)} className={user._id == id ? styles.selected : ''}>
                                                <img src={user.file ? user.file : "/avatar.png"} alt={`${user.fName} ${user.lName}`} />
                                                <div className={styles.info}>
                                                    <p>{`${user.fName} ${user.lName}`}</p>
                                                    <span>{user.email}</span>
                                                </div>
                                            </div>
                                        ))
                        }
                    </div>
                </div>
                {
                    id ? <div className={`${styles.right} ${id ? styles.open : ''}`}>
                        <div className={styles.header}>
                            <button onClick={() => setId('')} className={styles.icon}><MdOutlineKeyboardBackspace /></button>
                            <div className={styles.user}>
                                <img src="/avatar.png" alt="AVATAR" />
                                <div className={styles.info}>
                                    <p>Muneeb</p>
                                    <span>beenomjee@gmail.com</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.input}>
                            <form action="#" onSubmit={handleMessageSubmit}>
                                <input type="text" required placeholder='Type a Message' value={message} onChange={(e) => setMessage(e.target.value)} />
                                <button><MdSend /></button>
                            </form>
                        </div>

                        <div className={styles.messages}>
                            {
                                Array(20).fill(0).map((_, index) => (
                                    <>
                                        <div key={index + '1'} className={styles.message}>
                                            <div>
                                                <p>i am at ease</p>
                                                <span>08:12</span>
                                            </div>
                                        </div>
                                        <div key={index + "2000"} className={`${styles.message} ${styles.me}`}>
                                            <div>
                                                <p>i am at ease</p>
                                                <span>08:12</span>
                                            </div>
                                        </div>
                                    </>
                                ))
                            }
                        </div>
                    </div>

                        : <div className={`${styles.right}`}>
                            <p>Not any chat selected!</p>
                        </div>
                }
            </div>
        </>
    )
}

export default Home