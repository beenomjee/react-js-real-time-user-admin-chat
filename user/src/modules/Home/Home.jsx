import React, { useEffect, useRef, useState } from 'react'
import styles from './Home.module.scss';
import { Header, Loader2 } from '../../components';
import { MdSend, MdOutlinePublishedWithChanges } from 'react-icons/md'
import { RxImage } from 'react-icons/rx'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { db, sendImage, sendMessage, storage } from '../../firebase';
import axios from 'axios';
import { getDownloadURL, ref } from 'firebase/storage';

// fixed id
const id = "6455771e31fadb0839c7928f";

const Home = ({ user }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [allMessages, setAllMessages] = useState([])
    const [conversation, setConversation] = useState({});
    const [message, setMessage] = useState('');
    const [file, setFile] = useState('');
    const [fileExtension, setFileExtension] = useState('');
    const fileInputRef = useRef();
    const [filesUrls, setFilesUrls] = useState([]);
    const messagesContainer = useRef(null);
    const rightContainer = useRef(null);

    const handleMessageSubmit = async (e) => {
        if (isLoading) return;
        e.preventDefault();
        setIsLoading(true);
        try {
            await sendMessage({ conversationId: conversation._id, message, receiverId: id });
            setMessage('');
            setIsLoading(false);
        } catch (err) {
            alert(err.message);
            console.log(err);
            setIsLoading(false);
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
                    member: id
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
            <Header user={user} />
            <div className={styles.container}>
                <div className={`${styles.right}`} ref={rightContainer}>
                    <div className={styles.input}>
                        <form action="#" onSubmit={handleMessageSubmit}>
                            <input accept='image/*' type="file" id="file" className={styles.none} onChange={handleImageChange} ref={fileInputRef} />
                            <label htmlFor='file' type='button' className={styles.img}><RxImage /></label>
                            <input type="text" required placeholder='Type a Message' value={message} onChange={(e) => setMessage(e.target.value)} />
                            <button className={styles.send}>{isLoading ? <Loader2 /> : <MdSend />}</button>
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