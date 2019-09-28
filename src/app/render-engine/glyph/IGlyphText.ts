import { IGlyph } from "./IGlyph";

export interface IGlyphText extends IGlyph {
  setText(text: string): void;
  setColor(color: string): void;
  setSize(h: number): void;
}
