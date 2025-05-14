/** Script that exposes selected properties of Electron to the Renderer proces */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    /**
     * Toggles between fullscreen mode
     * @param state Enabled or Disabled
     */
    setScreenMode: (state) => ipcRenderer.send('fullscreen-state', state),
    /**
     * Terminates the application
     */
    goodBye: () => ipcRenderer.send('exit'),
    /**
     * Requests data of all stored books
     * @returns Promise containing an array of JSON structured as:<br>
     * <i>{bookId, bookName, bookShort, bookTestament, bookChCount}</i>
     */
    fetchAllBooks: async () => await ipcRenderer.invoke('get-all-books'),
    /**
     * Requests verse data of a given book and chapter based on direction of search
     * @param vr VerseRequest as a JSON with the structure:<br>
     * <i>bookId: string - Book ID to search<br>
     * chapterNum: string - Chapter of book to get the verses from<br>
     * verseNum: string - Verse search starting point<br>
     * limit: number - Number of verses to fetch<br>
     * forth: boolean - Flag that enables forward search - If false, search is backwards</i>
     * @returns Promise containing an array of JSON structured as:<br>
     * <i>{verseId, bookId, chapterNum, verseNum, verseTxt}</i>
     */
    fetchVersesOn: async (vr) => await ipcRenderer.invoke('get-verses-on', vr)
})