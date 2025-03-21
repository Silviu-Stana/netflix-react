import useCurrentUser from '@/hooks/useCurrentUser';
import useFavorites from '@/hooks/useFavorites';
import axios from 'axios';
import React, { useCallback, useMemo } from 'react';
import { AiOutlineCheck, AiOutlinePlus } from 'react-icons/ai';

interface FavoriteButtonProps {
    movieId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId }) => {
    const { mutate: mutateFavorites } = useFavorites();
    const { data: currentUser, mutate } = useCurrentUser();

    const isFavorite = useMemo(() => {
        const list = currentUser?.favoriteIds || [];

        return list.includes(movieId);
    }, [currentUser, movieId]);

    const toggleFavorites = useCallback(async () => {
        console.log('Toggling favorite for movieId:', movieId);
        let response;

        if (isFavorite) {
            response = await axios.delete('/api/favorite', {
                data: { movieId },
            });
        } else {
            response = await axios.post('/api/favorite', { movieId });
        }

        const updateFavoriteIds = response?.data?.favoriteIds;

        if (currentUser) {
            mutate({
                ...currentUser,
                favoriteIds: updateFavoriteIds,
            });
        }
        mutateFavorites();
    }, [currentUser, isFavorite, movieId, mutate, mutateFavorites]);

    const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus;

    return (
        <div
            onClick={toggleFavorites}
            className="cursor-pointer group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300"
        >
            <Icon className="text-white" size={15} />
        </div>
    );
};

export default FavoriteButton;
