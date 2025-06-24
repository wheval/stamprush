import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/10"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      {pages.map((page) => (
        <Button
          key={page}
          className={`w-10 h-10 rounded-full ${
            page === currentPage
              ? "bg-green-400 text-black hover:bg-green-500"
              : "text-white hover:bg-white/10"
          }`}
          variant={page === currentPage ? undefined : "ghost"}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/10"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
} 