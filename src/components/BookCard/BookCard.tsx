import Tag from "../shared/Tag";
import "./BookCard.css";

export interface BookCardType {
  title: string;
  author: string;
  date: string;
  price: number;
  tags: string[];
}

export default function BookCard({
  title,
  author,
  date,
  price,
  tags,
}: BookCardType) {
  if (!title || !author || !date || !price || !tags) {
    console.error("BookCard is missing required props");
    return null;
  }

  return (
    <article>
      <section className="book-details-container">
        <h2>{title}</h2>
        <div>
          <p>{author}</p>
          <p>{date}</p>
          <p>{price}$</p>
        </div>
      </section>
      <section className="tags-container">
        <div className="line" />
        <div className="tags">
          {tags.map((tag, idx) => (
            <Tag key={idx} name={tag} />
          ))}
        </div>
      </section>
    </article>
  );
}
