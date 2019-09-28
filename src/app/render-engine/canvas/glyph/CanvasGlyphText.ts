import { Origin } from "../../../utils/Origin";
import { IGlyphText } from "../../glyph/IGlyphText";
import { CanvasRenderEngine } from "../CanvasRenderEngine";
import { AbstractCanvasGlyph } from "./AbstractCanvasGlyph";

export class CanvasGlyphText extends AbstractCanvasGlyph implements IGlyphText {
  private text: string = "";

  private color: string = "black";

  private h: number = 14;

  constructor(renderEngine: CanvasRenderEngine) {
    super(renderEngine);
  }

  public setText(text: string): void {
    this.text = text;
  }

  public setColor(color: string): void {
    this.color = color;
  }

  public setSize(h: number): void {
    this.h = h;
  }

  public getWidth(): number {
    return 0;
  }

  public getHeight(): number {
    return this.h;
  }

  public render(): void {
    const context = this.renderEngine.canvas.getContext("2d");

    if (context) {
      switch (this.origin) {
        case Origin.BOTTOM_CENTER:
        case Origin.TOP_CENTER:
        case Origin.CENTER:
          context.textAlign = "center";
          break;
        case Origin.BOTTOM_RIGHT:
        case Origin.TOP_RIGHT:
          context.textAlign = "right";
        default:
          context.textAlign = "left";
      }

      const positionToDraw = this.getPositionToDraw();
      context.font = this.h + "px Arial";
      context.fillStyle = this.color;
      context.fillText(this.text, positionToDraw.x, positionToDraw.y + this.h);
    }
  }
}
