export const es = {
    fade: {
        title: 'Biblia | Cargando...',
    },
    reader: {
        bibles: 'Selecciona una biblia',
    },
    books: {
        title: '{versionKey} | Libros',
        quote: 'Libros',
        chapters: (num: number) => `Capítulos: ${num}`,
        author: (who: string) => `Autor: ${who}`,
        written: (date: string) => `Escrito ${date}`,
        character: {
            '~': (data: string) => `por el año ${data}`,
            '!': (data?: string) => `Incierto`,
            '.': (data: string) => `a fin del siglo ${data}`,
            '?': (data: string) => `Tal vez ${data}`,
            '/': (data: string) => `entre los años ${data}`,
            ':': (data: string) => `en el siglo ${data}`,
            '=': (data: string) => `en el año ${data}`,
            '<': (data: string) => `antes del año ${data}`,
            '>': (data: string) => `después del año ${data}`,
        },
    },
    chapters: {
        title: '{versionKey} | {bookName}',
        quote: 'Capítulos',
    },
    verses: {
        title: '{versionKey} | {bookAbr} {chapterId}',
        quote: 'Versos',
        prevBook: (bookName: any) => bookName ?? 'Inicial',
        nextBook: (bookName: any) => bookName ?? 'Último',
        prevChapter: (chapterId: any) => chapterId ? `Cap. ${chapterId}` : 'Inicial',
        nextChapter: (chapterId: any) => chapterId ? `Cap. ${chapterId}` : 'Último',
    },
    search: {
        title: 'Biblia | Buscar',
        quote: 'Buscar',
        init: 'Selecciona una biblia',
        bibleVersion: 'Versión de biblia',
        lookupFilter: 'Filtro de búsqueda',
        byQuote: 'Cita bíblica',
        byText: 'Texto bíblico',
        lookup: {
            byQuote: 'Libro Capítulo Verso',
            byText: 'Escribe palabras para buscar',
        },
    },
    favourites: {
        title: '{versionKey} | Favoritos',
        quote: 'Favoritos',
        empty: 'Sin favoritos',
    },
    settings: {
        quote: 'Ajustes',
        theme: {
            label: 'Tema de color',
            value: (theme: string) => theme === 'light' ? 'claro' : 'oscuro',
        },
        fontSize: {
            label: 'Tamaño de letra (versos)',
            hint: '1.3 - 4.0',
        },
        tags: {
            label: 'Mostrar etiqueta de botones',
            value: (flag: boolean) => flag ? 'si' : 'no',
        },
        scrollBehavior: {
            label: 'Desplazamiento suave (versos)',
            value: (flag: boolean) => flag ? 'si' : 'no',
        },
        displaySleep: {
            label: 'Permitir suspensión de pantalla',
            value: (flag: boolean) => flag ? 'si' : 'no'
        },
        defragment: {
            label: 'Desfragmentar',
        },
        resources: {
            label: 'Recursos' ,
            prompt: 'Autoría de los recursos bíblicos perteneciente a sus creadores originales.',
            list: {
                esv: 'English Standard Version. Text Edition: 2016. Copyright © 2001 by Crossway Bibles.',
                niv: 'New International Version. Copyright © 1978, 1984, 2011 by Biblica, Inc.® All rights reserved worldwide.',
                nkjv: 'The Holy Bible, New King James Version, Copyright © 1982 Thomas Nelson.',
                lbla: 'La Biblia de las Américas © 1986, 1995, 1997 by The Lockman Foundation, La Habra, Calif.',
                nvi: 'Nueva Versión Internacional. Copyright © 1999, 2015 by Biblica, Inc.® All rights reserved worldwide.',
                pdt: 'La Palabra de Dios para todos. Bible League International © 2012',
                rv20: 'Reina Valera 2020. © Sociedad Bíblica de España Antigua versión de Casiodoro de Reina (1569), revisada por Cipriano de Valera (1602).',
                rv60: 'Texto bíblico Reina-Valera 1960® © Sociedades Bíblicas en América Latina, 1960. Derechos renovados 1988, Sociedades Bíblicas Unidas.',
                rvc: 'Reina Valera Contemporánea™ © Sociedades Bíblicas Unidas, 2009, 2010.',
            }
        },
        app: {
            developer: 'App desarrollada por',
            windows: 'App para Windows en',
            android: 'Disponible para Android en',
        }
    },
    menu: {
        copy: 'Copiar verso',
        addFavourite: 'Agregar favorito',
        removeFavourite: 'Eliminar favorito',
        color: 'Resaltar verso',
        wrongContent: 'Contenido erroneo',
        error: 'Reportar error',
        feedback: 'Comentar',
    },
};