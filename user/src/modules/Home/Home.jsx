import React, { useEffect, useRef, useState } from 'react'
import styles from './Home.module.scss';
import { Header, Loader2 } from '../../components';
import { MdOutlineKeyboardBackspace, MdOutlinePublishedWithChanges, MdSend } from 'react-icons/md'
import { RxImage } from 'react-icons/rx';
import axios from 'axios';
import { db, sendImage, sendMessage, storage } from '../../firebase';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import ScrollableFeed from 'react-scrollable-feed'

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
    const [file, setFile] = useState('');
    const [fileExtension, setFileExtension] = useState('');
    const fileInputRef = useRef();
    const [filesUrls, setFilesUrls] = useState([]);
    const messagesContainer = useRef(null);
    const rightContainer = useRef(null);

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

    const handleImageChange = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            setFile(reader.result);
        };
        reader.readAsDataURL(e.target.files[0]);
        setFileExtension(e.target.files[0].name.split('.')[e.target.files[0].name.split('.').length - 1]);
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
                const response = await axios.get('http://localhost:3000/api/v1/auth/admins', {
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

    useEffect(() => {
        const urls = [];
        allMessages.forEach((message, index) => {
            if (message.file) {
                urls.push({
                    index,
                    file: message.file
                });
            }
        });
        urls.forEach((urlObj) => {
            const imgRef = ref(storage, urlObj.file);
            getDownloadURL(imgRef).then(url => {
                setFilesUrls(p => {
                    if (p.find((obj) => obj.file === url)) return p;
                    return [...p, { file: url, index: urlObj.index }]
                })
            })
        })
    }, [allMessages])


    useEffect(() => {
        if (rightContainer.current) {
            rightContainer.current.scrollTo(0, rightContainer.current.scrollHeight);
        }

        if (messagesContainer.current) {
            messagesContainer.current.querySelectorAll('img').forEach(imgTag => {
                imgTag.addEventListener('load', () => {
                    if (rightContainer.current)
                        rightContainer.current.scrollTo(0, rightContainer.current.scrollHeight);
                });
            })
        }

        return () => {
            if (messagesContainer.current) {
                messagesContainer.current.querySelectorAll('img').forEach(imgTag => {
                    imgTag.removeEventListener('load', () => {
                        if (rightContainer.current)
                            rightContainer.current.scrollTo(0, rightContainer.current.scrollHeight);
                    });
                })
            }
        }
    }, [allMessages]);
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
                            <div className={`${styles.right} ${id ? styles.open : ''}`} ref={rightContainer}>
                                <div className={styles.header}>
                                    <button onClick={() => setId('')} className={styles.icon}><MdOutlineKeyboardBackspace /></button>
                                    <div className={styles.user}>
                                        <img src={allUsers.find(user => user._id === id).file ? allUsers.find(user => user._id === id).file : "/avatar.png"} alt="AVATAR" />
                                        <div className={styles.info}>
                                            <p>{`${allUsers.find(user => user._id === id).fName} ${allUsers.find(user => user._id === id).lName}`}</p>
                                            <span>{allUsers.find(user => user._id === id).email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.input}>
                                    <form action="#" onSubmit={handleMessageSubmit}>
                                        <input accept='image/*' type="file" id="file" className={styles.none} onChange={handleImageChange} ref={fileInputRef} />
                                        <label htmlFor='file' type='button' className={styles.img}><RxImage /></label>
                                        <input type="text" required placeholder='Type a Message' value={message} onChange={(e) => setMessage(e.target.value)} />
                                        <button className={styles.send}>{isLoading3 ? <Loader2 /> : <MdSend />}</button>
                                        <ImageUploadModal fileInputRef={fileInputRef} file={file} setFile={setFile} fileExtension={fileExtension} user={user} conversation={conversation} receiverId={id} />
                                    </form>
                                </div>

                                <div className={styles.messages} ref={messagesContainer}>
                                    {
                                        allMessages.map((message, index) => (
                                            <div key={index} className={`${styles.message} ${(message.receiverId != user._id ? styles.me : '')}`}>
                                                <div>
                                                    <p>{message.message ? message.message : <img src={filesUrls.find(file => file.index == index)?.file} />}</p>
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

const ImageUploadModal = ({ file, setFile, fileInputRef, user, fileExtension, conversation, receiverId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const bgClickHandler = () => {
        if (isLoading) return;
        setFile('');
        fileInputRef.current.value = null;
    }
    const changeHandler = () => {
        fileInputRef.current.value = null;
        fileInputRef.current.click();
    }
    const sendFile = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await sendImage(file, user._id, fileExtension, conversation._id, receiverId);
            setIsLoading(false);
            bgClickHandler();
        } catch (err) {
            console.log(err);
            alert(err.message);
            setIsLoading(false);
        }
    }
    return (
        <>
            {file && <div onClick={bgClickHandler} className={styles.bgWrapperCover}></div>}
            <div className={`${styles.modal} ${(file) ? styles.open : ''}`}>
                <div className={styles.top}>
                    <img src={file} alt="File" />
                </div>
                <div className={styles.bottom}>
                    <button onClick={changeHandler} type='button'><MdOutlinePublishedWithChanges /></button>
                    <button onClick={sendFile} type='button'>{isLoading ? <Loader2 /> : <MdSend />}</button>
                </div>
            </div>
        </>
    )

}

export default Home