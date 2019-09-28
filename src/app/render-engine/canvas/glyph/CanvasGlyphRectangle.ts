import { IGlyphRectangle } from "../../glyph/IGlyphRectangle";
import { CanvasRenderEngine } from "../CanvasRenderEngine";
import { AbstractCanvasGlyph } from "./AbstractCanvasGlyph";

export class CanvasGlyphRectangle extends AbstractCanvasGlyph
  implements IGlyphRectangle {
  private color: string = "red";

  private w: number = 100;

  private h: number = 70;

  constructor(renderEngine: CanvasRenderEngine) {
    super(renderEngine);
  }

  public setColor(color: string): void {
    this.color = color;
  }

  public setSize(w: number, h: number): void {
    this.w = w;
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

    if (context) {
      const positionToDraw = this.getPositionToDraw();
      const x = positionToDraw.x;
      const y = positionToDraw.y;

      const w = this.w;
      const h = this.h;

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
