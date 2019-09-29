import { IGlyph } from "../glyph/IGlyph";
import { IGlyphFactory } from "../glyph/IGlyphFactory";
import { IRenderEngine } from "../IRenderEngine";
import { CanvasGlyphFactory } from "./glyph/CanvasGlyphFactory";

export class CanvasRenderEngine implements IRenderEngine {
  public readonly canvas: HTMLCanvasElement;

  private glyphs: IGlyph[] = [];

  private glyphFactory: CanvasGlyphFactory = new CanvasGlyphFactory(this);

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  public add(glyph: IGlyph): void {
    this.glyphs.push(glyph);

    glyph.render();
  }

  public remove(glyph: IGlyph): void {
    const index = this.glyphs.indexOf(glyph);
    if (index > -1) {
      this.glyphs[index].stop();
      this.glyphs.splice(index, 1);

      this.render();
    }
  }

  public render(): void {
    this.glyphs.forEach((g) => g.render());
  }

  public clear(): void {
    this.glyphs.forEach((g) => g.stop());
    this.glyphs = [];
  }

  public factory(): IGlyphFactory {
    return this.glyphFactory;
  }

  public getScreenWidth(): number {
    return this.canvas.width;
  }

  public getScreenHeight(): number {
    return this.canvas.height;
  }
}
