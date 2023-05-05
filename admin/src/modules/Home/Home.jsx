import React, { useEffect, useState } from 'react'
import styles from './Home.module.scss';
import { Header, Loader2 } from '../../components';
import { MdOutlineKeyboardBackspace, MdSend } from 'react-icons/md'
import axios from 'axios';
import { db, sendMessage } from '../../firebase';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';

const Home = ({ user }) => {
    const [id, setId] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [isLoading3, setIsLoading3] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchText, setSearchText] = useState('')
    const [message, setMessage] = useState('')
    const [conversation, setConversation] = useState({});
    const [allMessages, SetallMessages] = useState([]);

    const handleUserId = async (userId) => {
        if (userId === id) return;
        setSearchText('');
        setId(userId);
        setIsLoading2(true);
        try {
            const { data } = await axios.post('http://localhost:3000/api/v1/conversation/start', {
                token: user.token,
                member: userId
            })
            setConversation(data);
            setIsLoading2(false);
        } catch (err) {
            alert(err.message);
            console.log(err);
            setIsLoading2(false);
        }
    }

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        const searchText = e.target.value;
        setFilteredUsers(allUsers.filter(user => user.email.startsWith(searchText)));
    }

    const handleMessageSubmit = async (e) => {
        if (isLoading3) return;
        e.preventDefault();
        setIsLoading3(true);
        try {
            await sendMessage({ conversationId: conversation._id, message, receiverId: id });
            setMessage('');
            setIsLoading3(false);
        } catch (err) {
            alert(err.message);
            console.log(err);
            setIsLoading3(false);
        }
    }

    useEffect(() => {
        if (conversation._id) {
            const collectionRef = collection(db, "messages");
            const q = query(collectionRef, where("conversationId", "==", conversation._id), orderBy("createdAt"));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                SetallMessages(snapshot.docs.map(doc => ({
                    ...doc.data(),
                    _id: doc.id
                })));
            })

            return () => unsubscribe();
        }
    }, [conversation]);

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
                    isLoading2 ? <div className={`${styles.right}`}>
                        <p><Loader2 /></p>
                    </div>
                        :
                        !id ? <div className={`${styles.right}`}>
                            <p>Not any chat selected!</p>
                        </div>
                            :
                            <div className={`${styles.right} ${id ? styles.open : ''}`}>
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
                                        <button>{isLoading3 ? <Loader2 /> : <MdSend />}</button>
                                    </form>
                                </div>

                                <div className={styles.messages}>
                                    {
                                        allMessages.map((message, index) => (
                                            <div key={index} className={`${styles.message} ${(message.receiverId != user._id ? styles.me : '')}`}>
                                                <div>
                                                    <p>{message.message}</p>
                                                    <span>{message.createdAt && `${message?.createdAt?.toDate().getHours()}:${message?.createdAt?.toDate().getMinutes()}`}</span>
                                                </div>
                                            </div>

                                        ))
                                    }
                                </div>
                            </div>
                }
            </div>
        </>
    )
}

export default Home