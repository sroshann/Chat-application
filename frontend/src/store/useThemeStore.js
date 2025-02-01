import { create } from 'zustand'

export const useThemeStore = create( ( set ) => ({

    theme : JSON.parse( localStorage.getItem('chat-theme') ) || 'coffee',
    setTheme : ( theme ) => {

        localStorage.setItem( 'chat-theme', JSON.stringify( theme ) )
        set({ theme })

    }

}))