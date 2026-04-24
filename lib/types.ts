export interface Album {
  id: string
  title: string
  artist: string
  releaseYear: number
  genre: string
  rating: number
  notes: string
  favoriteSong: string
  runnersUp: string[]
  coverImage: string
  dateAdded: string
}

export type SortOption =
  | 'highest_rated'
  | 'lowest_rated'
  | 'date_newest'
  | 'date_oldest'
  | 'release_newest'
  | 'release_oldest'
