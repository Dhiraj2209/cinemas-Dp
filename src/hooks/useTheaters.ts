import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import type { TheaterType } from '../types';

export const useTheaters = () => {
    const [theaters, setTheaters] = useState<TheaterType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTheaters = async () => {
            try {
                const response = await axiosClient.get<{ data: TheaterType[] }>('/theaters');
                if (Array.isArray(response.data.data)) {
                    setTheaters(response.data.data);
                } else {
                    throw new Error("Invalid data format");
                }
            } catch (err: any) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTheaters();
    }, []);

    return { theaters, loading };
};
