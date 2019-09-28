import { IGlyph } from "./IGlyph";

export interface IGlyphImage extends IGlyph {
  setImage(img: string): Promise<void>;

  setSize(w: number | string, h: number | string): void;

  setWidth(w: number | string): void;

  setHeight(h: number | string): void;
}
