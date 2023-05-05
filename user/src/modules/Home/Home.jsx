import React, { useState } from 'react'
import styles from './Home.module.scss';
import { Header } from '../../components';
import { MdOutlineKeyboardBackspace, MdSend } from 'react-icons/md'

const Home = ({ user }) => {
    return (
        <>
            <Header user={user} />
            <div className={styles.container}>
                <div className={`${styles.right}`}>
                    <div className={styles.input}>
                        <form action="#" >
                            <input type="text" required placeholder='Type a Message' />
                            <button><MdSend /></button>
                        </form>
                    </div>

                    <div className={styles.messages}>
                        {/* {
                            Array(20).fill(0).map((_, index) => (
                                <div key={index} className={`${styles.message} ${styles.me}`}>
                                    <div>
                                        <p>i am at ease</p>
                                        <span>08:12</span>
                                    </div>
                                </div>
                            ))
                        } */}
                        <div className={`${styles.message} ${styles.me}`}>
                            <div>
                                <p>i am at ease</p>
                                <span>08:12</span>
                            </div>
                        </div>
                        <div className={`${styles.message}`}>
                            <div>
                                <p>i am at ease</p>
                                <span>08:12</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home