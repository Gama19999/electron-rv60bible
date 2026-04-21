export const en = {
    fade: {
        title: 'Bible | Loading...',
    },
    reader: {
        bibles: 'Choose a bible',
    },
    books: {
        title: '{versionKey} | Books',
        quote: 'Books',
        chapters: (num: number) => `Chapters: ${num}`,
        author: (who: string) => `Author: ${who}`,
        written: (date: string) => `Written ${date}`,
        character: {
            '~': (data: string) => `by the year of ${data.replaceAll('a.C.', 'BC').replaceAll('d.C.', 'AD')}`,
            '!': (data: string) => `Unknown`,
            '.': (data: string) => `by the end of ${data.replaceAll('a.C.', 'BC').replaceAll('d.C.', 'AD')} century`,
            '?': (data: string) => `Maybe ${data}`,
            '/': (data: string) => `between the years of ${data.replace('y', '&').replaceAll('a.C.', 'BC').replaceAll('d.C.', 'AD')}`,
            ':': (data: string) => `in the ${data.replaceAll('a.C.', 'BC').replaceAll('d.C.', 'AD')} century`,
            '=': (data: string) => `in the year of ${data.replaceAll('a.C.', 'BC').replaceAll('d.C.', 'AD')}`,
            '<': (data: string) => `before the year of ${data.replaceAll('a.C.', 'BC').replaceAll('d.C.', 'AD')}`,
            '>': (data: string) => `after the year of ${data.replaceAll('a.C.', 'BC').replaceAll('d.C.', 'AD')}`,
        },
    },
    chapters: {
        title: '{versionKey} | {bookName}',
        quote: 'Chapters',
    },
    verses: {
        title: '{versionKey} | {bookAbr} {chapterId}',
        quote: 'Verses',
        prevBook: (bookName: any) => bookName ?? 'First',
        nextBook: (bookName: any) => bookName ?? 'Last',
        prevChapter: (chapterId: any) => chapterId ? `Ch. ${chapterId}` : 'First ch.',
        nextChapter: (chapterId: any) => chapterId ? `Ch. ${chapterId}` : 'Last ch.',
    },
    search: {
        title: 'Bible | Search',
        quote: 'Search',
        init: 'Choose a bible',
        bibleVersion: 'Bible version',
        lookupFilter: 'Search filter',
        byQuote: 'Bible quote',
        byText: 'Bible text',
        lookup: {
            byQuote: 'Book Chapter Verse',
            byText: 'Type words to search',
        }
    },
    favourites: {
        title: '{versionKey} | Favourites',
        quote: 'Favourites',
        empty: 'No favourites',
    },
    settings: {
        quote: 'Settings',
        theme: {
            label: 'Color theme',
            value: (theme: string) => theme,
        },
        fontSize: {
            label: 'Font size (verses)',
            hint: '1.3 - 4.0',
        },
        tags: {
            label: 'Show button tags',
            value: (flag: boolean) => flag ? 'yes' : 'no',
        },
        scrollBehavior: {
            label: 'Smooth scrolling (verses)',
            value: (flag: boolean) => flag ? 'yes' : 'no',
        },
        displaySleep: {
            label: 'Allow display sleep',
            value: (flag: boolean) => flag ? 'yes' : 'no'
        },
        defragment: {
            label: 'Defragment',
        },
        resources: {
            label: 'Resources' ,
            prompt: 'Biblical resources authorship belongs to their original creators.',
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
            developer: 'App developed by',
            windows: 'App for Windows in',
            android: 'Available for Android in',
        }
    },
    menu: {
        copy: 'Copy verse',
        addFavourite: 'Add favourite',
        removeFavourite: 'Remove favourite',
        color: 'Highlight verse',
        wrongContent: 'Wrong content',
        error: 'Report error',
        feedback: 'Feedback',
    },
};