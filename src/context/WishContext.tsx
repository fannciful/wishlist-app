import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Wish, WishFormData, SortByDate, SortByPrice } from '../types/wish.types';
import { useApi } from '../hooks/useApi';

interface WishContextType {
  wishes: Wish[];
  loading: boolean;
  error: string | null;
  fetchWishes: () => Promise<void>;
  addWish: (wish: WishFormData) => Promise<boolean>;
  updateWish: (id: string, wish: WishFormData) => Promise<boolean>;
  deleteWish: (id: string) => Promise<boolean>;
  getWishById: (id: string) => Wish | undefined;
  sortByDate: SortByDate;
  sortByPrice: SortByPrice;
  setSortByDate: (sort: SortByDate) => void;
  setSortByPrice: (sort: SortByPrice) => void;
  getSortedWishes: () => Wish[];
}

const WishContext = createContext<WishContextType | undefined>(undefined);

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://my-json-server.typicode.com/fannciful/wishlist-app/wishes'
  : 'http://localhost:3001/wishes';

export function WishProvider({ children }: { children: ReactNode }) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [sortByDate, setSortByDate] = useState<SortByDate>('newest');
  const [sortByPrice, setSortByPrice] = useState<SortByPrice>('high-to-low');
  
  const { loading, error, execute } = useApi<any>();

  const fetchWishes = useCallback(async () => {
    const result = await execute(API_URL);
    if (result) {
      setWishes(Array.isArray(result) ? result : []);
    }
  }, [execute]);

  const addWish = useCallback(async (wishData: WishFormData): Promise<boolean> => {
    const newWish: Wish = {
      id: Date.now().toString(),
      ...wishData,
      createdAt: new Date().toISOString(),
    };

    try {
      await execute(API_URL, {
        method: 'POST',
        body: JSON.stringify(newWish),
      });
      setWishes(prev => [...prev, newWish]);
      return true;
    } catch (err) {
      console.error('Failed to add wish:', err);
      return false;
    }
  }, [execute]);

  const updateWish = useCallback(async (id: string, wishData: WishFormData): Promise<boolean> => {
    try {
      await execute(`${API_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(wishData),
      });

      setWishes(prev => prev.map(wish => 
        wish.id === id ? { ...wish, ...wishData } : wish
      ));
      return true;
    } catch (err) {
      console.error('Failed to update wish:', err);
      return false;
    }
  }, [execute]);

  const deleteWish = useCallback(async (id: string): Promise<boolean> => {
    try {
      await execute(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      setWishes(prev => prev.filter(wish => wish.id !== id));
      return true;
    } catch (err) {
      console.error('Failed to delete wish:', err);
      return false;
    }
  }, [execute]);

  const getWishById = useCallback((id: string) => {
    return wishes.find(wish => wish.id === id);
  }, [wishes]);

  const getSortedWishes = useCallback(() => {
    let sorted = [...wishes];

    sorted.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortByDate === 'newest' ? dateB - dateA : dateA - dateB;
    });

    sorted.sort((a, b) => {
      return sortByPrice === 'high-to-low' ? b.price - a.price : a.price - b.price;
    });

    return sorted;
  }, [wishes, sortByDate, sortByPrice]);

  return (
    <WishContext.Provider
      value={{
        wishes,
        loading,
        error,
        fetchWishes,
        addWish,
        updateWish,
        deleteWish,
        getWishById,
        sortByDate,
        sortByPrice,
        setSortByDate,
        setSortByPrice,
        getSortedWishes,
      }}
    >
      {children}
    </WishContext.Provider>
  );
}

export function useWishContext() {
  const context = useContext(WishContext);
  if (!context) {
    throw new Error('useWishContext must be used within WishProvider');
  }
  return context;
}