import { IGlyph } from "./glyph/IGlyph";
import { IGlyphFactory } from "./glyph/IGlyphFactory";

export interface IRenderEngine {
  add(glyph: IGlyph): void;

  remove(glyph: IGlyph): void;

  render(): void;

  clear(): void;

  factory(): IGlyphFactory;

  getScreenWidth(): number;

  getScreenHeight(): number;
}
