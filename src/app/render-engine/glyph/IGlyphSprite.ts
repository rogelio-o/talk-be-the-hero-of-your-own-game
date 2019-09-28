import { IGlyph } from "./IGlyph";

export interface IGlyphSprite extends IGlyph {
  setSprite(text: string): Promise<void>;

  setConfiguration(columns: number, rows: number): void;

  static(index: number): void;

  sequence(indexes: number[], fps?: number): void;

  setSize(w: number | string, h: number | string): void;

  setWidth(w: number | string): void;

  setHeight(h: number | string): void;

  flip(): void;
}
