import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useWishContext } from '../../context/WishContext';
import { AddWishModal } from '../Dashboard/AddWishModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Snackbar } from '../common/Snackbar';
import { WishFormData } from '../../types/wish.types';

export function WishPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWishById, updateWish, deleteWish } = useWishContext();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const wish = id ? getWishById(id) : undefined;

  useEffect(() => {
    if (!wish) {
      navigate('/');
    }
  }, [wish, navigate]);

  if (!wish) {
    return null;
  }

  const handleUpdate = async (wishData: WishFormData) => {
    const success = await updateWish(wish.id, wishData);
    if (success) {
      setSnackbar({ message: 'Wish updated successfully', type: 'success' });
      setIsUpdateModalOpen(false);
    } else {
      setSnackbar({ message: 'Failed to update wish', type: 'error' });
    }
  };

  const handleDelete = async () => {
    const success = await deleteWish(wish.id);
    if (success) {
      setSnackbar({ message: 'Wish deleted successfully', type: 'success' });
      setTimeout(() => navigate('/'), 1500);
    } else {
      setSnackbar({ message: 'Failed to delete wish', type: 'error' });
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back</span>
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-fade-in">
          <div className="h-64 bg-gray-100 overflow-hidden">
            <img
              src={wish.imageUrl}
              alt={wish.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800';
              }}
            />
          </div>

          <div className="p-6">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {wish.title}
              </h1>
              <span className="text-sm text-gray-500">
                Added {new Date(wish.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="mb-4 pb-4 border-b border-gray-100">
              <div className="text-3xl font-bold text-gray-900">
                ${wish.price.toLocaleString()}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 leading-relaxed">
                {wish.description}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsUpdateModalOpen(true)}
                className="flex-1 btn-primary"
              >
                Edit Wish
              </button>
              <button
                onClick={() => setIsDeleteDialogOpen(true)}
                className="px-5 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <AddWishModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onSubmit={handleUpdate}
          editingWish={wish}
        />

        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
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