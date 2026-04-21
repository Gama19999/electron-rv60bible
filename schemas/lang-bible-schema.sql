-- db file name: lang-version.db
-- read only db

CREATE TABLE books (
book_id INTEGER NOT NULL PRIMARY KEY,
book_name TEXT NOT NULL,
book_name_for_search TEXT NOT NULL,
book_abr TEXT NOT NULL,
chapter_count INTEGER NOT NULL,
book_of_nt INTEGER NOT NULL DEFAULT 0 CHECK (book_of_nt IN (0, 1)),
book_order_in_testament INTEGER NOT NULL,
book_author TEXT DEFAULT NULL,
book_written_year TEXT DEFAULT NULL
); -- 9 fields


CREATE TABLE verses (
verse_id INTEGER NOT NULL PRIMARY KEY,
book_id INTEGER NOT NULL,
chapter_id INTEGER NOT NULL,
verse_ordinal INTEGER NOT NULL,
verse_text TEXT NOT NULL,
verse_text_for_search TEXT NOT NULL
); -- 6 fields