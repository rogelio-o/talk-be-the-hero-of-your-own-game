import { HorizontalAlign } from "../../../utils/HorizontalAlign";
import { VerticalAlign } from "../../../utils/VerticalAlign";
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
      let y = this.position.y;

      if (this.verticalAlign === VerticalAlign.TOP) {
        y = y + this.h;
      } else if (this.verticalAlign === VerticalAlign.MIDDLE) {
        y = y + this.h / 2;
      }

      context.textAlign =
        this.horizontalAlign === HorizontalAlign.CENTER
          ? "center"
          : this.horizontalAlign === HorizontalAlign.RIGHT
          ? "right"
          : "left";
      context.font = this.h + "px Arial";
      context.fillStyle = this.color;
      context.fillText(this.text, this.position.x, y);
    }
  }
}
