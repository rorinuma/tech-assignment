import { useState, useEffect } from "react";
import type { BookCardType } from "../components/BookCard/BookCard";

const parseBookDate = (dateString: string): Date => {
  const [month, year] = dateString.split(" ");
  const monthIndex = new Date(`${month} 1, ${year}`).getMonth();

  return new Date(parseInt(year), monthIndex, 1);
};

const extractLastName = (author: string): string => {
  const parts = author.trim().split(" ");
  return parts[parts.length - 1];
};

export function useBookFilters(books: BookCardType[]) {
  const [sortBy, setSortBy] = useState<"price" | "author" | "date">("price");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [selectedTags, setSelectedTags] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("selectedBookTags");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("selectedBookTags", JSON.stringify(selectedTags));
    }
  }, [selectedTags]);

  const allTags = [...new Set(books.flatMap((book) => book.tags || []))];

  const filteredAndSortedBooks = books
    .filter((book) => {
      if (selectedTags.length === 0) return true;
      return selectedTags.every((tag: string) => book.tags?.includes(tag));
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "author":
          aValue = a.author.toLowerCase();
          bValue = b.author.toLowerCase();
          break;
        case "date":
          aValue = parseBookDate(a.date);
          bValue = parseBookDate(b.date);
          break;
        default:
          return 0;
      }

      let result = 0;
      if (sortOrder === "asc") {
        result = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        result = aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }

      if (result === 0) {
        switch (sortBy) {
          case "price": {
            const aAuthor = extractLastName(a.author).toLowerCase();
            const bAuthor = extractLastName(b.author).toLowerCase();
            result = aAuthor.localeCompare(bAuthor);
            break;
          }

          case "author": {
            const aDate = parseBookDate(a.date);
            const bDate = parseBookDate(b.date);
            result = aDate < bDate ? -1 : aDate > bDate ? 1 : 0;
            break;
          }

          case "date": {
            const aAuthorDate = extractLastName(a.author).toLowerCase();
            const bAuthorDate = extractLastName(b.author).toLowerCase();
            result = aAuthorDate.localeCompare(bAuthorDate);
            break;
          }
        }
      }

      return result;
    });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev: string[]) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearTags = () => setSelectedTags([]);

  return {
    filteredBooks: filteredAndSortedBooks,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedTags,
    toggleTag,
    clearTags,
    allTags,
  };
}
