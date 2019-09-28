import { IGlyph } from "./IGlyph";
import { IGlyphCircle } from "./IGlyphCircle";
import { IGlyphImage } from "./IGlyphImage";
import { IGlyphRectangle } from "./IGlyphRectangle";
import { IGlyphSprite } from "./IGlyphSprite";
import { IGlyphText } from "./IGlyphText";

export interface IGlyphFactory {
  group(glyphs: IGlyph[]): void;

  circle(color: string, x: number, y: number, radio: number): IGlyphCircle;

  image(
    img: string,
    x: number,
    y: number,
    w?: number,
    h?: number,
  ): Promise<IGlyphImage>;

  rectangle(
    color: string,
    x: number,
    y: number,
    w: number,
    h: number,
  ): IGlyphRectangle;

  sprite(
    sprite: string,
    columns: number,
    rows: number,
    x: number,
    y: number,
    w?: number,
    h?: number,
  ): Promise<IGlyphSprite>;

  text(
    text: string,
    color: string,
    x: number,
    y: number,
    size: number,
  ): IGlyphText;
}
