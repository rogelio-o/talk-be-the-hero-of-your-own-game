import { IGlyph } from "./IGlyph";

export interface IGlyphRectangle extends IGlyph {
  setColor(color: string): void;

  setSize(w: number | string, h: number | string): void;
}
