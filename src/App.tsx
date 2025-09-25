import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import type { BookCardType } from "./components/BookCard/BookCard";
import BookCard from "./components/BookCard/BookCard";
import { useBookFilters } from "./hooks/useBookFilters";
import useClickOutside from "./hooks/useClickOutside";
import Tag from "./components/shared/Tag";

export default function App() {
  const [books, setBooks] = useState<BookCardType[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [tagsModalOpen, setTagsModalOpen] = useState(false);
  const tagsModalRef = useRef<HTMLElement>(null);
  const tagsTitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/books.json")
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error(error))
      .finally(() => setBooksLoading(false));
  }, []);

  useClickOutside([tagsModalRef, tagsTitleRef], () => setTagsModalOpen(false));

  const {
    filteredBooks,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedTags,
    toggleTag,
    clearTags,
    allTags,
  } = useBookFilters(books);

  const handleSortChange = useCallback(
    (newSortBy: "price" | "author" | "date") => {
      if (sortBy === newSortBy) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortBy(newSortBy);
        setSortOrder("desc");
      }
    },
    [sortBy, sortOrder, setSortBy, setSortOrder],
  );

  const renderBooks = useMemo(() => {
    return filteredBooks.map((book, idx) => <BookCard key={idx} {...book} />);
  }, [filteredBooks]);

  const total = useMemo(
    () => filteredBooks.reduce((acc, book) => acc + book.price, 0),
    [filteredBooks],
  );

  if (booksLoading) {
    return (
      <main>
        <div className="loading">Loading books...</div>
      </main>
    );
  }

  return (
    <main>
      <header>
        <h1>Book Store</h1>
      </header>

      <section className="sorting-container">
        <div className="sort-options">
          <span
            className={`sort-option ${sortBy === "price" ? "active" : ""}`}
            onClick={() => handleSortChange("price")}
          >
            price{" "}
            <span
              className={`sort-arrow ${sortOrder === "desc" && sortBy === "price" ? "rotate" : ""}`}
            >
              ↑
            </span>
          </span>
          <span
            className={`sort-option ${sortBy === "author" ? "active" : ""}`}
            onClick={() => handleSortChange("author")}
          >
            author{" "}
            <span
              className={`sort-arrow ${sortOrder === "desc" && sortBy === "author" ? "rotate" : ""}`}
            >
              ↑
            </span>
          </span>
          <span
            className={`sort-option ${sortBy === "date" ? "active" : ""}`}
            onClick={() => handleSortChange("date")}
          >
            date{" "}
            <span
              className={`sort-arrow ${sortOrder === "desc" && sortBy === "date" ? "rotate" : ""}`}
            >
              ↑
            </span>
          </span>
        </div>

        <div className="tag-filters">
          <div
            className="tag-filter-title"
            onClick={() => setTagsModalOpen((prev) => !prev)}
            ref={tagsTitleRef}
          >
            <span>Tags</span>
            <span
              className={`tags-arrow ${tagsModalOpen ? "open" : ""}`}
            ></span>
          </div>
          <button className="clear-tags" onClick={clearTags}>
            clear rules
          </button>
          {tagsModalOpen && (
            <section className="tags-container" ref={tagsModalRef}>
              {allTags.map((tag) => (
                <Tag
                  key={tag}
                  className={`tag ${selectedTags.includes(tag) ? "selected" : ""}`}
                  onClick={() => toggleTag(tag)}
                  name={tag}
                />
              ))}
            </section>
          )}
        </div>
      </section>

      <section className="books-container">
        {renderBooks}

        {filteredBooks.length === 0 && !booksLoading && (
          <div className="no-books">No books match your filters</div>
        )}
        {filteredBooks.length !== 0 && !booksLoading && (
          <span className="total">
            Total: <span className="total-amount">{total}$</span>
          </span>
        )}
      </section>
    </main>
  );
}
