-- db file name: _version-list.db
-- read only db

CREATE TABLE versions (
    version_id INTEGER NOT NULL PRIMARY KEY,
    version_key TEXT NOT NULL,
    version_lang TEXT NOT NULL,
    display_name TEXT NOT NULL,
    revision_year TEXT DEFAULT NULL
); -- 5 fields

CREATE TABLE summaries (
    summary_id INTEGER NOT NULL PRIMARY KEY,
    summary_lang TEXT NOT NULL,
    book_id INTEGER NOT NULL,
    book_name TEXT NOT NULL,
    og_name TEXT DEFAULT NULL,
    its_name TEXT DEFAULT NULL,
    og_lang TEXT DEFAULT NULL,
    abstract TEXT DEFAULT NULL,
    outline TEXT DEFAULT NULL
); -- 9 fields

INSERT INTO versions (version_id, version_key, version_lang, display_name, revision_year) VALUES
(1, 'lbla', 'es', 'Biblia de las Américas', '1997'),
(2, 'nvi', 'es', 'Nueva Versión Internacional', '2015'),
(3, 'pdt', 'es', 'Palabra de Dios para todos', '2012'),
(4, 'rv20', 'es', 'Reina Valera 2020', '2020'),
(5, 'rv60', 'es', 'Reina Valera 1960', '1960'),
(6, 'rvc', 'es', 'Reina Valera Contemporánea', '2010'),
(7, 'esv', 'en', 'English Standard Version', '2016'),
(8, 'niv', 'en', 'New International Version', '2011'),
(9, 'nkjv', 'en', 'New King James Version', '1982');

INSERT INTO summaries (summary_id, summary_lang, book_id, book_name, og_lang, og_name, its_name, abstract, outline) VALUES
(1, 'es', 1, 'Génesis', 'Hebreo',
 'Bereshit | (hebreo "En el principio") | Corresponde a las primeras palabras del texto original y mantiene la tradición de titular las obras literarias a partir de sus primeras frases.',
 'Génesis | ("Orígen") | Proviene de la traducción griega de la Biblia conocida como Septuaginta',
 'Presenta el informe de la Creación, la historia de la caida y muchos otros acontecimientos tales como el Diluvio, la torre de Babel y la historia de Abraham, Isaac, Jacob y José.',
 '{"1":{"entry":"Historia de los orígenes","quotes":{"1:1":"1,1,1"}},"2":{"entry":"Historia de los patriarcas","sub":{"a":{"entry":"Abraham","quotes":{"12:1":"1,12,1"}},"b":{"entry":"Isaac","quotes":{"26:1":"1,26,1"}},"c":{"entry":"Jacob","quotes":{"27:1":"1,27,1"}},"d":{"entry":"José","quotes":{"37:1":"1,37,1"}}}}}'
),
(2, 'es', 2, 'Éxodo', 'Hebreo',
 'Shemoth | (hebreo "Estos son los nombres") | Corresponde a las primeras palabras del texto original y mantiene la tradición de titular las obras literarias a partir de sus primeras frases.',
 'Éxodo | ("Salida") | Proviene de la traducción griega de la Biblia conocida como Septuaginta.',
 'Describe la revelación de Dios sobre si mismo, el éxodo de los israelitas de Egipto, la entrega de la Ley en el monte Sinai y las instrucciones para construir el tabernáculo.',
 '{"1":{"entry":"Israel liberado de la esclavitud en Egipto","quotes":{"1:1":"2,1,1"}},"2":{"entry":"Los israelitas parten hacia el monte Sinaí","quotes":{"15:22":"2,15,22"}},"3":{"entry":"El pacto de Dios en el Sinaí","quotes":{"19:1":"2,19,1"}},"4":{"entry":"Instrucciones para la construcción del tabernáculo","quotes":{"25:1":"2,25,1"}},"5":{"entry":"El becerro de oro. Renovación del pacto.","quotes":{"31:18":"2,31,18"}},"6":{"entry":"Construcción del tabernáculo","quotes":{"35:1":"2,35,1"}}}'
),
(3, 'es', 3, 'Levítico', 'Hebreo',
 'Wayiqrá | (hebreo "Llamó Jehova") | Corresponde a las primeras palabras del texto original y mantiene la tradición de titular las obras literarias a partir de sus primeras frases.',
 'Levítico | | Proviene de la traducción griega de la Biblia conocida como Septuaginta y, probablemente, indica que es un texto dedicado a los levitas.',
 'Consiste principalmente en leyes (rituales, civiles, sanitarias). En particular, describe el servicio del tabernáculo con todas sus actividades.',
 '{"1":{"entry":"Ofrendas y sacrificios","quotes":{"1:1":"3,1,1"}},"2":{"entry":"Consagración sacerdotal","quotes":{"8:1":"3,8,1"}},"3":{"entry":"Leyes sobre la pureza y la impureza","quotes":{"11:1":"3,11,1"}},"4":{"entry":"La ley sobre la santidad","quotes":{"17:1":"3,17,1"}},"5":{"entry":"Bendiciones y maldiciones","quotes":{"26:1":"3,26,1"}},"6":{"entry":"Sobre lo que es consagrado a Dios","quotes":{"27:1":"3,27,1"}}}'
),
(4, 'es', 4, 'Números', 'Hebreo',
 'Bemidbar | (hebreo "En el desierto") | En referencia al lugar donde se desarrollan los hechos contenidos en este libro.',
 'Números | | Proviene de la traducción griega de la Biblia conocida como Septuaginta, aludiendo a las muchas citas cuantitativas que encontramos en él.',
 'Narra el trayecto de los israelitas de Egipto a Canaán. El autor incluye diferentes estilos literarios: leyes, censos, informes, bendiciones, oraciones, correspondencia diplomática, poesía, profecía e itinerarios.',
 '{"1":{"entry":"Al pie del Sinaí","quotes":{"1:1":"4,1,1"}},"2":{"entry":"Largo camino a Moab","quotes":{"10:11":"4,10,11"}},"3":{"entry":"En las llanuras de Moab","quotes":{"22:1":"4,22,1"}}}'
),
(5, 'es', 5, 'Deuteronomío', 'Hebreo',
 'Mishneh Torah | (hebreo "Repetición de la ley") | Otro título para el libro es debarim, "Palabras".',
 'Deuteronomio | ("Segunda ley") | Proviene de la traducción griega de la Biblia conocida como Septuaginta, refiriéndose a que contiene una nueva edición de la primera ley.',
 'Está compuesto por una serie de discursos que presentó Moisés a los israelitas al final de su vida. El libro repite pautas indicadas por Dios que ya habían sido dadas en libros anteriores del Pentateuco.',
 '{"1":{"entry":"Primer discurso de Moisés","quotes":{"1:1":"5,1,1"}},"2":{"entry":"Segundo discurso de Moisés","quotes":{"5:1":"5,5,1"}},"3":{"entry":"El código del Deuteronomio","quotes":{"5:1":"5,5,1"}},"4":{"entry":"Bendiciones y maldiciones","quotes":{"27:1":"5,27,1"}},"5":{"entry":"Pacto de Dios con Israel","quotes":{"29:1":"5,29,1"}},"6":{"entry":"Últimas disposiciones. Muerte de Moisés.","quotes":{"31:1":"5,31,1"}}}'
),


{
    "1": {
        "entry": "Primer discurso de Moisés",
        "quotes": {"1:1": "5,1,1"}
    },
    "2": {
        "entry": "Segundo discurso de Moisés",
        "quotes": {"5:1": "5,5,1"}
    },
    "3": {
        "entry": "El código del Deuteronomio",
        "quotes": {"5:1": "5,5,1"}
    },
    "4": {
        "entry": "Bendiciones y maldiciones",
        "quotes": {"27:1": "5,27,1"}
    },
    "5": {
        "entry": "Pacto de Dios con Israel",
        "quotes": {"29:1": "5,29,1"}
    },
    "6": {
        "entry": "Últimas disposiciones. Muerte de Moisés.",
        "quotes": {"31:1": "5,31,1"}
    }
}

