CREATE TABLE bibles (
    bible_id INTEGER PRIMARY KEY,
    bible_key TEXT NOT NULL,
    lang TEXT NOT NULL,
    display_name TEXT NOT NULL,
    version_year TEXT DEFAULT NULL
); -- 5 fields -- bibles-info.db

INSERT INTO bibles (bible_id, bible_key, lang, display_name, version_year) VALUES
(1, 'xml-lbla', 'es', 'Biblia de las Américas', '1997'),
(2, 'xml-nvi', 'es', 'Nueva Versión Internacional', '2015'),
(3, 'xml-pdt', 'es', 'Palabra de Dios para todos', '2012'),
(4, 'xml-rv20', 'es', 'Reina Valera 2020', '2020'),
(5, 'xml-rv60', 'es', 'Reina Valera 1960', '1960'),
(6, 'xml-rvc', 'es', 'Reina Valera Contemporánea', '2010');

