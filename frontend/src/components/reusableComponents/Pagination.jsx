// src/components/Pagination.jsx
import React from "react";
import { IoMdArrowRoundForward, IoMdArrowRoundBack } from "react-icons/io";

const Pagination = ({ currentPage, totalPages, onNext, onPrev }) => {
  return (
    <div className="flex justify-center items-center mt-4 gap-2">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50"
      >
        <IoMdArrowRoundBack />
      </button>
      <span className="font-bold bg-blue-400 px-3 py-1 rounded-md">
        {currentPage}
      </span>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50"
      >
        <IoMdArrowRoundForward />
      </button>
    </div>
  );
};

export default Pagination;
