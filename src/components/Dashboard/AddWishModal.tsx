import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { WishFormData, Wish } from '../../types/wish.types';

interface AddWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (wish: WishFormData) => Promise<void>;
  editingWish?: Wish | null;
}

export function AddWishModal({ isOpen, onClose, onSubmit, editingWish }: AddWishModalProps) {
  const [formData, setFormData] = useState<WishFormData>({
    title: '',
    description: '',
    price: 0,
    imageUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingWish) {
      setFormData({
        title: editingWish.title,
        description: editingWish.description,
        price: editingWish.price,
        imageUrl: editingWish.imageUrl,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: 0,
        imageUrl: '',
      });
    }
    setErrors({});
  }, [editingWish, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      await onSubmit(formData);
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? (value === '' ? 0 : parseFloat(value)) : value,
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingWish ? 'Edit Wish' : 'Add Wish'}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., MacBook Pro"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1.5">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="input-field resize-none"
            placeholder="What makes this special?"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1.5">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              name="price"
              value={formData.price || ''}
              onChange={handleChange}
              className="input-field pl-8"
              placeholder="0.00"
            />
          </div>
          {errors.price && (
            <p className="text-red-500 text-sm mt-1.5">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="input-field"
            placeholder="https://example.com/image.jpg"
          />
          {errors.imageUrl && (
            <p className="text-red-500 text-sm mt-1.5">{errors.imageUrl}</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 btn-primary"
          >
            {editingWish ? 'Save' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  );
}