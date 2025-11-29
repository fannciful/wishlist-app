import React, { useEffect, useState } from 'react';
import { useWishContext } from '../../context/WishContext';
import { FilterBar } from './FilterBar';
import { WishCard } from './WishCard';
import { AddWishModal } from './AddWishModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Snackbar } from '../common/Snackbar';
import { Wish, WishFormData } from '../../types/wish.types';

export function Dashboard() {
  const {
    fetchWishes,
    addWish,
    updateWish,
    deleteWish,
    sortByDate,
    sortByPrice,
    setSortByDate,
    setSortByPrice,
    getSortedWishes,
    loading,
  } = useWishContext();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingWish, setEditingWish] = useState<Wish | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; wishId: string | null }>({
    isOpen: false,
    wishId: null,
  });
  const [snackbar, setSnackbar] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchWishes();
  }, [fetchWishes]);

  const handleAddWish = async (wishData: WishFormData) => {
    const success = await addWish(wishData);
    if (success) {
      setSnackbar({ message: 'Wish added successfully', type: 'success' });
    } else {
      setSnackbar({ message: 'Failed to add wish', type: 'error' });
    }
  };

  const handleUpdateWish = async (wishData: WishFormData) => {
    if (!editingWish) return;
    
    const success = await updateWish(editingWish.id, wishData);
    if (success) {
      setSnackbar({ message: 'Wish updated successfully', type: 'success' });
      setEditingWish(null);
    } else {
      setSnackbar({ message: 'Failed to update wish', type: 'error' });
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ isOpen: true, wishId: id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.wishId) return;

    const success = await deleteWish(deleteConfirm.wishId);
    if (success) {
      setSnackbar({ message: 'Wish deleted successfully', type: 'success' });
    } else {
      setSnackbar({ message: 'Failed to delete wish', type: 'error' });
    }
    setDeleteConfirm({ isOpen: false, wishId: null });
  };

  const handleUpdateClick = (wish: Wish) => {
    setEditingWish(wish);
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEditingWish(null);
  };

  const sortedWishes = getSortedWishes();

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Wishlist
          </h1>
          <p className="text-gray-500 text-lg">
            Things you want to get
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <FilterBar
            sortByDate={sortByDate}
            sortByPrice={sortByPrice}
            onSortByDateChange={setSortByDate}
            onSortByPriceChange={setSortByPrice}
            onAddClick={() => setIsAddModalOpen(true)}
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
        ) : sortedWishes.length === 0 ? (
          <div className="text-center py-32 animate-fade-in">
            <div className="mb-6">
              <svg className="w-20 h-20 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No wishes yet</h2>
            <p className="text-gray-500 mb-8">Create your first wish to get started</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary"
            >
              Add Wish
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedWishes.map((wish, index) => (
              <div
                key={wish.id}
                className="animate-fade-in"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <WishCard
                  wish={wish}
                  onDelete={handleDeleteClick}
                  onUpdate={handleUpdateClick}
                />
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        <AddWishModal
          isOpen={isAddModalOpen}
          onClose={handleModalClose}
          onSubmit={editingWish ? handleUpdateWish : handleAddWish}
          editingWish={editingWish}
        />

        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={() => setDeleteConfirm({ isOpen: false, wishId: null })}
          onConfirm={handleDeleteConfirm}
          title="Delete wish"
          message="Are you sure? This action cannot be undone."
        />

        {snackbar && (
          <Snackbar
            message={snackbar.message}
            type={snackbar.type}
            onClose={() => setSnackbar(null)}
          />
        )}
      </div>
    </div>
  );
}