/**
 * NsPlaylist namespace - stub model for playlists
 */
export namespace NsPlaylist {
  export interface IPlaylistConfig {
    id?: string
    title?: string
    description?: string
    type?: string
  }

  export interface IPlaylist {
    id?: string
    name?: string
    contents?: any[]
  }

  export interface IBtnPlaylist {
    contentId?: string
    contentName?: string
    contentType?: any
    primaryCategory?: any
    mode?: string
  }
}
