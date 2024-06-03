import React, { useEffect } from 'react';

const Pagination = ({ postsPerPage, totalPosts, currentPage, paginate }) => {
    const pageNumbers = [];

    // Calculate total number of pages
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    // Calculate the range of pages to display
    const displayRange = 5;
    const startPage = Math.max(1, currentPage - Math.floor(displayRange / 2));
    const endPage = Math.min(startPage + displayRange - 1, pageNumbers.length);

    const goToLastPage = () => {
        paginate(Math.ceil(totalPosts / postsPerPage));
    };

    const goToFirstPage = () => {
        paginate(1);
    };

    // Update current page when currentPage changes
    useEffect(() => {
        paginate(currentPage);
    }, [currentPage, paginate]);

    return (
        <ul className='flex gap-2'>
            {/* Previous button */}
            <li>
                <button
                    className={`border px-3 py-1 ${currentPage === 1 ? 'bg-gray-300 text-gray-600' : 'bg-white text-black'
                        }`}
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
            </li>
            {/* Page numbers */}
            {pageNumbers.slice(startPage - 1, endPage).map(number => (
                <li key={number}>
                    <button
                        className={`border px-3 py-1 ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white text-black'
                            }`}
                        onClick={() => paginate(number)}
                    >
                        {number}
                    </button>
                </li>
            ))}
            {/* Next button */}
            <li>
                <button
                    className={`border px-3 py-1 ${currentPage === pageNumbers.length ? 'bg-gray-300 text-gray-600' : 'bg-white text-black'
                        }`}
                    onClick={goToLastPage}
                    disabled={currentPage === pageNumbers.length}
                >
                    Next
                </button>
            </li>
        </ul>
    );
};

export default Pagination;
