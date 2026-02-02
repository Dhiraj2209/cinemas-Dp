import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import type { CardType } from '../types';

export const useMovies = () => {
    const [movies, setMovies] = useState<CardType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axiosClient.get<CardType[]>('/movies');
                setMovies(response.data);
            } catch (err: any) {
                console.error(err);
                // Error handled by global axios interceptor for 401
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    return { movies, loading };
};
