import { IGlyphSprite } from "../../glyph/IGlyphSprite";
import { CanvasRenderEngine } from "../CanvasRenderEngine";
import { AbstractCanvasGlyph } from "./AbstractCanvasGlyph";

export class CanvasGlyphSprite extends AbstractCanvasGlyph
  implements IGlyphSprite {
  private img: HTMLImageElement = new Image();

  private w?: number | string = 100;

  private h?: number | string = 70;

  private columns: number = 1;

  private rows: number = 1;

  private index: number = 1;

  private flipped: boolean = false;

  private playedSequence?: {
    sequence: number[];
    fps: number;
  };

  private playAnimationFrameId?: number;

  constructor(renderEngine: CanvasRenderEngine) {
    super(renderEngine);
  }

  public setSprite(img: string): Promise<void> {
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

  public setConfiguration(columns: number, rows: number): void {
    this.columns = columns;
    this.rows = rows;
  }

  public static(index: number): void {
    this.playedSequence = undefined;
    this.index = index;

    if (this.playAnimationFrameId) {
      cancelAnimationFrame(this.playAnimationFrameId);
    }

    this.renderEngine.render();
  }

  public sequence(indexes: number[], fps?: number): void {
    const previousPlayed: boolean = this.playedSequence !== undefined;
    this.playedSequence = { sequence: indexes, fps: fps || 10 };

    if (!previousPlayed) {
      requestAnimationFrame(this.playSequence.bind(this));
    }
  }

  public flip(): void {
    this.flipped = !this.flipped;

    this.renderEngine.render();
  }

  public getWidth(): number {
    if (!this.w) {
      return (
        (this.img.width / this.columns / (this.img.height / this.rows)) *
        this.getHeight()
      );
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
      return (
        (this.img.height / this.rows / (this.img.width / this.columns)) *
        this.getWidth()
      );
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

    if (context) {
      const w = this.getWidth();
      const h = this.getHeight();
      const oW = this.img.width / this.columns;
      const oH = this.img.height / this.rows;
      const firstRow = Math.floor(this.index / this.columns);
      const sy = firstRow * oH;
      const sx = (this.index - firstRow * this.columns) * oW;

      const positionToDraw = this.getAbsolutePosition();
      let x = positionToDraw.x;
      let y = positionToDraw.y;

      if (this.flipped) {
        context.translate(x, y);
        context.scale(-1, 1);
        x = -w;
        y = 0;
      }
      context.drawImage(this.img, sx, sy, oW, oH, x, y, w, h);
      context.setTransform(1, 0, 0, 1, 0, 0);
    }
  }

  private playSequence(): void {
    if (this.playedSequence) {
      const seq = this.playedSequence.sequence;
      const indexOf = seq.indexOf(this.index);
      const nextIndex = indexOf === seq.length - 1 ? 0 : indexOf + 1;

      this.index = seq[nextIndex];
      this.renderEngine.render();

      setTimeout(() => {
        this.playAnimationFrameId = requestAnimationFrame(
          this.playSequence.bind(this),
        );
      }, 1000 / this.playedSequence.fps);
    }
  }
}
