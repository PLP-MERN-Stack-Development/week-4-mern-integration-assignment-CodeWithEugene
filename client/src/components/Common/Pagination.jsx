// client/src/components/Common/Pagination.jsx
import React from 'react';

const Pagination = ({ pages, page, onPageChange }) => {
  return (
    pages > 1 && (
      <div className="flex justify-center mt-8 space-x-2">
        {[...Array(pages).keys()].map((x) => (
          <button
            key={x + 1}
            onClick={() => onPageChange(x + 1)}
            className={`px-4 py-2 rounded-lg ${
              x + 1 === page
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {x + 1}
          </button>
        ))}
      </div>
    )
  );
};

export default Pagination;