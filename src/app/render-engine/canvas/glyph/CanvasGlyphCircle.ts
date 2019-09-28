import { HorizontalAlign } from "../../../utils/HorizontalAlign";
import { VerticalAlign } from "../../../utils/VerticalAlign";
import { IGlyphCircle } from "../../glyph/IGlyphCircle";
import { CanvasRenderEngine } from "../CanvasRenderEngine";
import { AbstractCanvasGlyph } from "./AbstractCanvasGlyph";

export class CanvasGlyphCircle extends AbstractCanvasGlyph
  implements IGlyphCircle {
  private color: string = "red";

  private r: number = 100;

  constructor(renderEngine: CanvasRenderEngine) {
    super(renderEngine);
  }

  public setColor(color: string): void {
    this.color = color;
  }

  public setSize(r: number): void {
    this.r = r;
  }

  public getWidth(): number {
    return this.r * 2;
  }

  public getHeight(): number {
    return this.r * 2;
  }

  public render(): void {
    const context = this.renderEngine.canvas.getContext("2d");

    if (context) {
      let x = this.position.x;
      let y = this.position.y;
      const r = this.r;

      if (this.horizontalAlign === HorizontalAlign.LEFT) {
        x = x + r;
      } else if (this.horizontalAlign === HorizontalAlign.RIGHT) {
        x = x - r;
      }

      if (this.verticalAlign === VerticalAlign.TOP) {
        y = y + r;
      } else if (this.verticalAlign === VerticalAlign.BOTTOM) {
        y = y - r;
      }

      context.beginPath();
      context.arc(x, y, r, 0, 2 * Math.PI, false);
      context.fillStyle = this.color;
      context.fill();
      context.lineWidth = 1;
      context.strokeStyle = this.color;
      context.stroke();
    }
  }
}
