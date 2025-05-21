-- TABLES ON MAIN DB (es-rv1960)
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


-- TABLES ON SECONDARY DB (es-rv1960-fv)
CREATE TABLE favourites (
    verse_id int primary key,
    book_id int,
    chapter_num int,
    verse_num int,
    verse_txt text,
    added date
);