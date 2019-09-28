import { GlyphGroup } from "./GlyphGroup";
import { IGlyph } from "./IGlyph";
import { IGlyphCircle } from "./IGlyphCircle";
import { IGlyphImage } from "./IGlyphImage";
import { IGlyphRectangle } from "./IGlyphRectangle";
import { IGlyphSprite } from "./IGlyphSprite";
import { IGlyphText } from "./IGlyphText";

export interface IGlyphFactory {
  group(glyphs: IGlyph[]): GlyphGroup;

  circle(
    color: string,
    x: number,
    y: number,
    radio: number | string,
  ): IGlyphCircle;

  image(
    img: string,
    x: number,
    y: number,
    w?: number | string,
    h?: number | string,
  ): Promise<IGlyphImage>;

  rectangle(
    color: string,
    x: number,
    y: number,
    w: number | string,
    h: number | string,
  ): IGlyphRectangle;

  sprite(
    sprite: string,
    columns: number,
    rows: number,
    x: number,
    y: number,
    w?: number | string,
    h?: number | string,
  ): Promise<IGlyphSprite>;

  text(
    text: string,
    color: string,
    x: number,
    y: number,
    size: number,
  ): IGlyphText;
}
