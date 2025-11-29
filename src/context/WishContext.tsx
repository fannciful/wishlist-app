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

const API_URL = 'http://localhost:3001/wishes';

export function WishProvider({ children }: { children: ReactNode }) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [sortByDate, setSortByDate] = useState<SortByDate>('newest');
  const [sortByPrice, setSortByPrice] = useState<SortByPrice>('high-to-low');
  
  const { loading, error, execute } = useApi<Wish[]>();

  const fetchWishes = useCallback(async () => {
    const result = await execute(API_URL);
    if (result) {
      setWishes(result);
    }
  }, [execute]);

  const addWish = useCallback(async (wishData: WishFormData): Promise<boolean> => {
    const newWish = {
      ...wishData,
      createdAt: new Date().toISOString(),
    };

    const result = await execute(API_URL, {
      method: 'POST',
      body: JSON.stringify(newWish),
    });

    if (result) {
      await fetchWishes();
      return true;
    }
    return false;
  }, [execute, fetchWishes]);

  const updateWish = useCallback(async (id: string, wishData: WishFormData): Promise<boolean> => {
    const result = await execute(`${API_URL}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(wishData),
    });

    if (result) {
      await fetchWishes();
      return true;
    }
    return false;
  }, [execute, fetchWishes]);

  const deleteWish = useCallback(async (id: string): Promise<boolean> => {
    const result = await execute(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (result !== null) {
      await fetchWishes();
      return true;
    }
    return false;
  }, [execute, fetchWishes]);

  const getWishById = useCallback((id: string) => {
    return wishes.find(wish => wish.id === id);
  }, [wishes]);

  const getSortedWishes = useCallback(() => {
    let sorted = [...wishes];

    // Sort by date
    sorted.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortByDate === 'newest' ? dateB - dateA : dateA - dateB;
    });

    // Sort by price
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