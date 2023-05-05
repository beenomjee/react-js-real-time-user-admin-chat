import React, { useEffect, useState } from 'react'
import styles from './Home.module.scss';
import { Header, Loader2 } from '../../components';
import { MdSend } from 'react-icons/md'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { db, sendMessage } from '../../firebase';
import axios from 'axios';

const Home = ({ user }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [allMessages, setAllMessages] = useState([])
    const [conversation, setConversation] = useState({});
    const [message, setMessage] = useState('');
    const handleMessageSubmit = async (e) => {
        if (isLoading) return;
        e.preventDefault();
        setIsLoading(true);
        try {
            await sendMessage({ conversationId: conversation._id, message, receiverId: "6455771e31fadb0839c7928f" });
            setMessage('');
            setIsLoading(false);
        } catch (err) {
            alert(err.message);
            console.log(err);
            setIsLoading(false);
        }
    }
    useEffect(() => {
        if (conversation._id) {
            const collectionRef = collection(db, "messages");
            const q = query(collectionRef, where("conversationId", "==", conversation._id), orderBy("createdAt"));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                setAllMessages(snapshot.docs.map(doc => ({
                    ...doc.data(),
                    _id: doc.id
                })));
            })

            return () => unsubscribe();
        }
    }, [conversation._id]);

    useEffect(() => {
        const getConversation = async () => {
            setIsLoading(true)
            try {
                const { data } = await axios.post('http://localhost:3000/api/v1/conversation/start', {
                    token: user.token,
                    member: "6455771e31fadb0839c7928f"
                })
                setConversation(data);
                setIsLoading(false);
            } catch (err) {
                alert(err.message);
                console.log(err);
                setIsLoading(false);
            }
        }
        getConversation();
    }, []);
    return (
        <>
            <Header user={user} />
            <div className={styles.container}>
                <div className={`${styles.right}`}>
                    <div className={styles.input}>
                        <form action="#" onSubmit={handleMessageSubmit} >
                            <input type="text" required placeholder='Type a Message' value={message} onChange={(e) => setMessage(e.target.value)} />
                            <button>{isLoading ? <Loader2 /> : <MdSend />}</button>
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
            </div>
        </>
    )
}

export default Home