import { IGlyphSprite } from "../../glyph/IGlyphSprite";
import { CanvasRenderEngine } from "../CanvasRenderEngine";
import { AbstractCanvasGlyph } from "./AbstractCanvasGlyph";

export class CanvasGlyphSprite extends AbstractCanvasGlyph
  implements IGlyphSprite {
  private img: HTMLImageElement = new Image();

  private w: number = 100;

  private h: number = 70;

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

  public setSize(w: number, h: number): void {
    this.w = w;
    this.h = h;
  }

  public setWidth(w: number): void {
    const ratio = this.img.height / this.rows / (this.img.width / this.columns);

    this.w = w;
    this.h = w * ratio;
  }

  public setHeight(h: number): void {
    const ratio = this.img.width / this.columns / (this.img.height / this.rows);

    this.w = h * ratio;
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
    return this.w;
  }

  public getHeight(): number {
    return this.h;
  }

  public render(): void {
    const context = this.renderEngine.canvas.getContext("2d");

    if (context) {
      const oW = this.img.width / this.columns;
      const oH = this.img.height / this.rows;
      const firstRow = Math.floor(this.index / this.columns);
      const sy = firstRow * oH;
      const sx = (this.index - firstRow * this.columns) * oW;

      const positionToDraw = this.getPositionToDraw();
      let x = positionToDraw.x;
      let y = positionToDraw.y;

      if (this.flipped) {
        context.translate(x, y);
        context.scale(-1, 1);
        x = 0;
      }
      context.drawImage(this.img, sx, sy, oW, oH, x, y, this.w, this.h);
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
