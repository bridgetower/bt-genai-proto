import { useState } from "react";

import { Button } from "../ui/button";

type PaginationProps = {
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
};
const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageClick(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageClick(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Button
          size={"sm"}
          variant={`${i === currentPage ? "default" : "secondary"}`}
          key={i}
          className={`mr-1`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </Button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center my-2 text-sm text-foreground">
      <Button
        size={"sm"}
        className={`mr-2 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      {renderPageNumbers()}
      <Button
        size={"sm"}
        className={`ml-1 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
      <div className="text-sm ml-4 text-foreground">
        Showing {currentPage * itemsPerPage - itemsPerPage}-{totalPages === currentPage ? totalItems : itemsPerPage * currentPage} of{" "}
        {totalItems}
      </div>
    </div>
  );
};

export default Pagination;
