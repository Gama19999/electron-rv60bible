-- db file name: _app-feedback.db
-- read write db

CREATE TABLE reports (
    report_id INTEGER NOT NULL PRIMARY KEY,
    app_version TEXT NOT NULL,
    version_key TEXT NOT NULL,
    type_id INTEGER NOT NULL CHECK (type_id IN (1, 2, 3)),
    verse_id INTEGER DEFAULT NULL,
    feedback TEXT DEFAULT NULL,
    created_at TEXT NOT NULL DEFAULT (DATE('now', 'localtime'))
); -- 6 fields

CREATE TABLE types (
    type_id INTEGER NOT NULL PRIMARY KEY,
    display_name TEXT NOT NULL,
    severity TEXT NOT NULL
); -- 3 fields

INSERT INTO types (type_id, display_name, severity) VALUES
(1, 'Wrong verse', 'database'),
(2, 'App feature not working', 'app'),
(3, 'Other/Feedback', 'app');



-- See error reports
SELECT t.severity, t.display_name AS error, e.error_id AS errorId, e.version_key AS versionKey, e.app_version AS appVersion, e.feedback
FROM errors AS e, types AS t
WHERE e.error_type = t.error_type;