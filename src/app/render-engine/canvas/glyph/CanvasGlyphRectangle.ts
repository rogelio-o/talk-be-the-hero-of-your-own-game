import { IGlyphRectangle } from "../../glyph/IGlyphRectangle";
import { CanvasRenderEngine } from "../CanvasRenderEngine";
import { AbstractCanvasGlyph } from "./AbstractCanvasGlyph";

export class CanvasGlyphRectangle extends AbstractCanvasGlyph
  implements IGlyphRectangle {
  private color: string = "red";

  private w: number | string = 100;

  private h: number | string = 70;

  constructor(renderEngine: CanvasRenderEngine) {
    super(renderEngine);
  }

  public setColor(color: string): void {
    this.color = color;
  }

  public setSize(w: number | string, h: number | string): void {
    this.w = w;
    this.h = h;
  }

  public getWidth(): number {
    if (typeof this.w === "number") {
      return this.w as number;
    } else if (this.w.charAt(this.w.length - 1) === "%") {
      const p = parseInt(this.w.substring(0, this.w.length - 1), 10);

      return (this.renderEngine.canvas.width * p) / 100;
    } else {
      throw new Error("Width bad format exception: " + this.w);
    }
  }

  public getHeight(): number {
    if (typeof this.h === "number") {
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

    if (context) {
      const positionToDraw = this.getAbsolutePosition();
      const x = positionToDraw.x;
      const y = positionToDraw.y;

      const w = this.getWidth();
      const h = this.getHeight();

      context.beginPath();
      context.rect(x, y, w, h);
      context.fillStyle = this.color;
      context.fill();
      context.lineWidth = 1;
      context.strokeStyle = this.color;
      context.stroke();
    }
  }
}
