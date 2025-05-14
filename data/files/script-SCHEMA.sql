CREATE TABLE books (
    book_id int primary key,
    alt_name text,
    use_name text,
    new_testament int,
    abbreviation text,
    chapter_count int
);

CREATE TABLE verses (
    book_id int,
    chapter_num int,
    verse_num int,
    verse_txt text
);