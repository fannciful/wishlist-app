import React from 'react';
import { Wish } from '../../types/wish.types';
import { Link } from 'react-router-dom';

interface WishCardProps {
  wish: Wish;
  onDelete: (id: string) => void;
  onUpdate: (wish: Wish) => void;
}

export function WishCard({ wish, onDelete, onUpdate }: WishCardProps) {
  return (
    <div className="card-modern overflow-hidden group">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={wish.imageUrl}
          alt={wish.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400';
          }}
        />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title & Description */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
          {wish.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
          {wish.description}
        </p>

        {/* Price & Date */}
        <div className="flex items-baseline justify-between mb-5">
          <span className="text-2xl font-bold text-gray-900">
            ${wish.price.toLocaleString()}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(wish.createdAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/wish/${wish.id}`}
            className="flex-1 text-center bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            View
          </Link>
          <button
            onClick={() => onUpdate(wish)}
            className="flex-1 bg-gray-100 text-gray-900 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(wish.id)}
            className="px-3 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}