CREATE TABLE verse_errors (
verse_error_id INTEGER PRIMARY KEY,
version_id INTEGER NOT NULL,
verse_id INTEGER NOT NULL,
verse_content TEXT NOT NULL,
error_type_id INTEGER NOT NULL DEFAULT 1 CHECK (error_type_id IN (1, 2, 3)),
registered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE app_errors (
app_error_id INTEGER PRIMARY KEY,
error_type_id INTEGER NOT NULL DEFAULT 4 CHECK (error_type_id IN (4, 5)),
extra_msg TEXT DEFAULT NULL,
registered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE error_types (
error_type_id INTEGER PRIMARY KEY,
error_name TEXT NOT NULL,
error_type TEXT NOT NULL
);

INSERT INTO error_types (error_type_id, error_name, error_type) VALUES
(1, 'Contenido erroneo en el verso', 'database'),
(2, 'Verso anterior faltante', 'database'),
(3, 'Verso siguiente faltante', 'database'),
(4, 'Control/App falla', 'app'),
(5, 'Otro/Sugerencia', 'app');

-- See verse error reports
SELECT ve.error_type_id, et.error_name, et.error_type, ve.verse_error_id, ve.version_id, ve.verse_id
FROM error_types AS et, verse_errors AS ve
WHERE ve.error_type_id = et.error_type_id;