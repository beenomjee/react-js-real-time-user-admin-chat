import React, { useEffect, useRef, useState } from 'react'
import styles from './SignUp.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import { Loader } from '../../components';
import axios from 'axios';

const SignUp = () => {
    const [error, setError] = useState('');
    const firstNameInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: '',
        password: "",
        fName: '',
        lName: '',
        file: '',
        isAdmin: true,
    });
    const handleChange = (e) => {
        if (e.target.id === 'photo') {
            const reader = new FileReader();
            reader.onload = () => {
                setData(prev => ({ ...prev, file: reader.result }))
            }

            reader.onerror = () => {
                setError('Something went wrong!');
            }

            reader.readAsDataURL(e.target.files[0]);
        }
        else
            setData(prev => ({ ...prev, [e.target.id]: e.target.value }))
    }
    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        try {
            const respone = await axios.post("http://localhost:3000/api/v1/auth/signup", data);
            localStorage.setItem('user', JSON.stringify(respone.data));
            setIsLoading(false);
            navigate('/');
        } catch (err) {
            console.log(err);
            if (err.response?.status === 413)
                setError("Image Size is too large!")
            else
                setError(err.response.data.message);
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
        if (firstNameInputRef.current)
            firstNameInputRef.current.focus();
    }, [error, firstNameInputRef.current]);
    return (isLoading ? <Loader /> :
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <h1>Sign Up</h1>
                <form action="#" onSubmit={handleSubmit}>
                    <input type="text" required placeholder='First Name' ref={firstNameInputRef} id='fName' onChange={handleChange} value={data.fName} />
                    <input type="text" required placeholder='Last Name' id='lName' onChange={handleChange} value={data.lName} />
                    <input type="email" required placeholder='Email' id='email' onChange={handleChange} value={data.email} />
                    <input type="password" required placeholder='Password' id='password' onChange={handleChange} value={data.password} />
                    <input type="file" id='photo' accept='image/*' onChange={handleChange} />

                    <label htmlFor="photo"><img src={data.file ? data.file : '/avatar.png'} alt="Avatar" /><span className={styles.photo}>Upload Photo</span></label>
                    <p className={`${styles.error} ${error ? styles.show : ''}`}>{error}</p>
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have account? <Link to='/signin'>Sign In</Link></p>
            </div>
        </div>
    )

}

export default SignUp