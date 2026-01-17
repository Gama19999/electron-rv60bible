CREATE TABLE books (
book_id INTEGER PRIMARY KEY,
book_name TEXT NOT NULL,
book_name_for_search TEXT NOT NULL,
book_abr TEXT NOT NULL,
chapter_count INTEGER NOT NULL,
book_testament TEXT NOT NULL,
book_order_in_testament INTEGER NOT NULL,
book_author TEXT DEFAULT NULL,
book_written_year TEXT DEFAULT NULL
); -- 9 fields -- xml-????.db


CREATE TABLE verses (
verse_id INTEGER PRIMARY KEY,
book_id INTEGER NOT NULL,
chapter_id INTEGER NOT NULL,
verse_ordinal INTEGER NOT NULL,
verse_text TEXT NOT NULL,
verse_text_for_search TEXT NOT NULL,
marked_favourite BOOLEAN NOT NULL DEFAULT 0 CHECK (marked_favourite IN (0, 1)),
colored_as TEXT NOT NULL DEFAULT 'normal'
); -- 8 fields -- xml-????.db