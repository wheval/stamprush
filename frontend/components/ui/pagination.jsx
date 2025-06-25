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
        className="text-[#FF6F00] hover:bg-[#FF6F00]/10 border border-[#FF6F00]/20 playful-hover"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      {pages.map((page) => (
        <Button
          key={page}
          className={`w-10 h-10 rounded-full transition-all duration-300 playful-hover ${
            page === currentPage
              ? "bg-[#FF6F00] text-white hover:bg-[#FF6F00]/90 vibrant-shadow"
              : "text-[#FF6F00] hover:bg-[#FF6F00]/10 border border-[#FF6F00]/20"
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
        className="text-[#FF6F00] hover:bg-[#FF6F00]/10 border border-[#FF6F00]/20 playful-hover"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
} 