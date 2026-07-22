export interface Era {
  id: string;
  era: string;
  year: string;
  map: string;
  image: string;
  caption: string;
  story: string;
  /** Temperatura emocional da era — usada pra variar a luz do card em vez de repetir sempre o mesmo tom de fogo. */
  mood: "warm" | "cool" | "sacred";
}

export interface Dragon {
  name: string;
  universe: string;
  creator: string;
  first: string;
  fact: string;
  detail: string;
  color: string;
}

export interface CinemaEntry {
  year: string;
  title: string;
  note: string;
}

export interface ComparisonRow {
  name: string;
  origem: string;
  elemento: string;
  tamanho: string;
  poder: number;
  inteligencia: number;
  voo: string;
  tipo: string;
}

export interface Curiosity {
  title: string;
  text: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
  label: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  text: string;
}

export interface Chapter {
  id: string;
  numeral: string;
  label: string;
}
