import React, { useEffect, useRef, useState } from 'react'
import styles from './SignIn.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { Loader } from '../../components';
import axios from 'axios';

const SignIn = () => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const emailInputRef = useRef(null);
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: '',
        password: '',
    })
    const handleChange = (e) => {
        setData(prev => ({ ...prev, [e.target.id]: e.target.value }))
    }
    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        try {
            const respone = await axios.post("http://localhost:3000/api/v1/auth/signin", data);
            localStorage.setItem('user', JSON.stringify(respone.data));
            setIsLoading(false);
            navigate('/');
        } catch (err) {
            console.log(err);
            setError(err.response.data);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const user = window.localStorage.getItem('user');
        if (!user)
            setIsLoading(false);
        else
            navigate('/')
    }, []);
    useEffect(() => {
        if (emailInputRef.current)
            emailInputRef.current.focus();
    }, [error, emailInputRef.current]);
    return (
        isLoading ? <Loader /> :
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <h1>Sign In</h1>
                    <form action="#" onSubmit={handleSubmit}>
                        <input type="email" required placeholder='Email' ref={emailInputRef} value={data.email} onChange={handleChange} id='email' />
                        <input type="password" required placeholder='Password' value={data.password} onChange={handleChange} id='password' />
                        <p className={`${styles.error} ${error ? styles.show : ''}`}>{error}</p>
                        <button type="submit">Login</button>
                    </form>
                    <p>Don't have account? <Link to='/signup'>Sign Up</Link></p>
                </div>
            </div>
    )
}

export default SignIn