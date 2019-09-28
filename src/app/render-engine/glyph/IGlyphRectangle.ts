import { IGlyph } from "./IGlyph";

export interface IGlyphRectangle extends IGlyph {
  setColor(color: string): void;

  setSize(w: number, h: number): void;
}
