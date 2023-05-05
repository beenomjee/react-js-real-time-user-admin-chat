import React, { useEffect, useState } from 'react'
import styles from './ProtectedRoute.module.scss';
import { Loader } from '../';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState({})
    const navigate = useNavigate();
    useEffect(() => {
        const loadUser = () => {
            setIsLoading(true);
            const user = window.localStorage.getItem('user');
            if (!user)
                navigate('/signin')

            setUser(JSON.parse(user));
            setIsLoading(false);
        }

        window.addEventListener('storage', loadUser);
        loadUser();

        return () => {
            window.removeEventListener('storage', loadUser);
        }
    }, []);
    return (
        isLoading ? <Loader /> : <Element user={user} />
    )
}

export default ProtectedRoute;