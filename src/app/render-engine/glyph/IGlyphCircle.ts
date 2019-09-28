import { IGlyph } from "./IGlyph";

export interface IGlyphCircle extends IGlyph {
  setColor(color: string): void;

  setSize(r: number): void;
}
