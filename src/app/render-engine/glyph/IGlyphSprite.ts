import { IGlyph } from "./IGlyph";

export interface IGlyphSprite extends IGlyph {
  setSprite(text: string): Promise<void>;

  setConfiguration(columns: number, rows: number): void;

  static(index: number): void;

  sequence(indexes: number[], fps?: number): void;

  setSize(w: number, h: number): void;

  setWidth(w: number): void;

  setHeight(h: number): void;

  flip(): void;
}
