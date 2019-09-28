import { GlyphGroup } from "../../glyph/GlyphGroup";
import { IGlyph } from "../../glyph/IGlyph";
import { IGlyphCircle } from "../../glyph/IGlyphCircle";
import { IGlyphFactory } from "../../glyph/IGlyphFactory";
import { IGlyphImage } from "../../glyph/IGlyphImage";
import { IGlyphRectangle } from "../../glyph/IGlyphRectangle";
import { IGlyphSprite } from "../../glyph/IGlyphSprite";
import { IGlyphText } from "../../glyph/IGlyphText";
import { CanvasRenderEngine } from "../CanvasRenderEngine";
import { CanvasGlyphCircle } from "./CanvasGlyphCircle";
import { CanvasGlyphImage } from "./CanvasGlyphImage";
import { CanvasGlyphRectangle } from "./CanvasGlyphRectangle";
import { CanvasGlyphSprite } from "./CanvasGlyphSprite";
import { CanvasGlyphText } from "./CanvasGlyphText";

export class CanvasGlyphFactory implements IGlyphFactory {
  private renderEngine: CanvasRenderEngine;

  constructor(renderEngine: CanvasRenderEngine) {
    this.renderEngine = renderEngine;
  }

  public group(glyphs: IGlyph[]): GlyphGroup {
    const glyph = new GlyphGroup();
    glyphs.forEach((g) => glyph.add(g));

    return glyph;
  }

  public circle(
    color: string,
    x: number,
    y: number,
    radio: number,
  ): IGlyphCircle {
    const circle = new CanvasGlyphCircle(this.renderEngine);
    circle.setColor(color);
    circle.setPosition({ x, y });
    circle.setSize(radio);

    return circle;
  }

  public image(
    img: string,
    x: number,
    y: number,
    w?: number | string,
    h?: number | string,
  ): Promise<IGlyphImage> {
    const glyph = new CanvasGlyphImage(this.renderEngine);
    glyph.setPosition({ x, y });
    return glyph.setImage(img).then(() => {
      if (w && h) {
        glyph.setSize(w, h);
      } else if (w) {
        glyph.setWidth(w);
      }

      return glyph;
    });
  }

  public rectangle(
    color: string,
    x: number,
    y: number,
    w: number | string,
    h: number | string,
  ): IGlyphRectangle {
    const rectangle = new CanvasGlyphRectangle(this.renderEngine);
    rectangle.setColor(color);
    rectangle.setPosition({ x, y });
    rectangle.setSize(w, h);

    return rectangle;
  }

  public sprite(
    sprite: string,
    columns: number,
    rows: number,
    x: number,
    y: number,
    w?: number | string,
    h?: number | string,
  ): Promise<IGlyphSprite> {
    const glyph = new CanvasGlyphSprite(this.renderEngine);
    glyph.setPosition({ x, y });

    return glyph.setSprite(sprite).then(() => {
      glyph.setConfiguration(columns, rows);
      if (w && h) {
        glyph.setSize(w, h);
      } else if (w) {
        glyph.setWidth(w);
      }

      return glyph;
    });
  }

  public text(
    text: string,
    color: string,
    x: number,
    y: number,
    size: number,
  ): IGlyphText {
    const glyph = new CanvasGlyphText(this.renderEngine);
    glyph.setText(text);
    glyph.setColor(color);
    glyph.setPosition({ x, y });
    glyph.setSize(size);

    return glyph;
  }
}
