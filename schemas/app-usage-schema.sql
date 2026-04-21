-- db file name: _app-usage.db
-- read write db

CREATE TABLE favourites (
    favourite_id INTEGER NOT NULL PRIMARY KEY,
    version_key TEXT NOT NULL,
    book_id INTEGER NOT NULL,
    verse_id INTEGER NOT NULL,
    marked_favourite INTEGER NOT NULL DEFAULT 0 CHECK (marked_favourite IN (0, 1)),
    colored_as TEXT NOT NULL DEFAULT 'normal',
    marked_at TEXT NOT NULL DEFAULT (DATE('now', 'localtime'))
); -- 7 fields