import { IGlyphImage } from "../../glyph/IGlyphImage";
import { CanvasRenderEngine } from "../CanvasRenderEngine";
import { AbstractCanvasGlyph } from "./AbstractCanvasGlyph";

export class CanvasGlyphImage extends AbstractCanvasGlyph
  implements IGlyphImage {
  private w?: number | string = 100;

  private h?: number | string = 100;

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

  public setSize(w: number | string, h: number | string): void {
    this.w = w;
    this.h = h;
  }

  public setWidth(w: number | string): void {
    this.w = w;
    this.h = undefined;
  }

  public setHeight(h: number | string): void {
    this.w = undefined;
    this.h = h;
  }

  public getWidth(): number {
    if (!this.w) {
      return (this.img.width / this.img.height) * this.getHeight();
    } else if (typeof this.w === "number") {
      return this.w as number;
    } else if (this.w.charAt(this.w.length - 1) === "%") {
      const p = parseInt(this.w.substring(0, this.w.length - 1), 10);

      return (this.renderEngine.canvas.width * p) / 100;
    } else {
      throw new Error("Width bad format exception: " + this.w);
    }
  }

  public getHeight(): number {
    if (!this.h) {
      return (this.img.height / this.img.width) * this.getWidth();
    } else if (typeof this.h === "number") {
      return this.h as number;
    } else if (this.h.charAt(this.h.length - 1) === "%") {
      const p = parseInt(this.h.substring(0, this.h.length - 1), 10);

      return (this.renderEngine.canvas.height * p) / 100;
    } else {
      throw new Error("Height bad format exception: " + this.h);
    }
  }

  public render(): void {
    const context = this.renderEngine.canvas.getContext("2d");

    const positionToDraw = this.getAbsolutePosition();
    const x = positionToDraw.x;
    const y = positionToDraw.y;

    if (context) {
      context.drawImage(this.img, x, y, this.getWidth(), this.getHeight());
    }
  }
}
