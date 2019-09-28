import { IGlyphImage } from "../../glyph/IGlyphImage";
import { CanvasRenderEngine } from "../CanvasRenderEngine";
import { AbstractCanvasGlyph } from "./AbstractCanvasGlyph";

export class CanvasGlyphImage extends AbstractCanvasGlyph
  implements IGlyphImage {
  private w: number = 100;

  private h: number = 100;

  private img: HTMLImageElement = new Image();

  constructor(renderEngine: CanvasRenderEngine) {
    super(renderEngine);
  }

  public setImage(img: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.img = new Image();
      this.img.onload = () => resolve();
      this.img.onerror = (e) => reject(new Error("Error loading img " + img));
      this.img.src = img;
    });
  }

  public setSize(w: number, h: number): void {
    this.w = w;
    this.h = h;
  }

  public setWidth(w: number): void {
    const ratio = this.img.height / this.img.width;

    this.w = w;
    this.h = w * ratio;
  }

  public setHeight(h: number): void {
    const ratio = this.img.width / this.img.height;

    this.w = h * ratio;
    this.h = h;
  }

  public getWidth(): number {
    return this.w;
  }

  public getHeight(): number {
    return this.h;
  }

  public render(): void {
    const context = this.renderEngine.canvas.getContext("2d");

    const positionToDraw = this.getAbsolutePosition();
    const x = positionToDraw.x;
    const y = positionToDraw.y;

    if (context) {
      context.drawImage(this.img, x, y, this.w, this.h);
    }
  }
}
