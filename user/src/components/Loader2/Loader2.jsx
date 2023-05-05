import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import styles from './Loader2.module.scss'
const Loading2 = () => {
    return (
        <p className={styles.loader}>
            <span><AiOutlineLoading3Quarters /></span>
        </p>
    )
}

export default Loading2