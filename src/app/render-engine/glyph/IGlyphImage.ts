import { IGlyph } from "./IGlyph";

export interface IGlyphImage extends IGlyph {
  setImage(img: string): Promise<void>;

  setSize(w: number, h: number): void;

  setWidth(w: number): void;

  setHeight(h: number): void;
}
