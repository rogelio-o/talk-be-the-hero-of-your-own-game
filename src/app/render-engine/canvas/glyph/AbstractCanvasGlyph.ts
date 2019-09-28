import { Direction } from "../../../utils/Direction";
import { HorizontalAlign } from "../../../utils/HorizontalAlign";
import { IPosition } from "../../../utils/IPosition";
import { VerticalAlign } from "../../../utils/VerticalAlign";
import { IGlyph } from "../../glyph/IGlyph";
import { CanvasRenderEngine } from "../CanvasRenderEngine";

export abstract class AbstractCanvasGlyph implements IGlyph {
  protected horizontalAlign: HorizontalAlign = HorizontalAlign.LEFT;

  protected verticalAlign: VerticalAlign = VerticalAlign.TOP;

  protected position: IPosition = { x: 0, y: 0 };

  protected renderEngine: CanvasRenderEngine;

  private animationFrameId?: number;

  private movingTo?: {
    position: IPosition;
    speed: number;
    callback?: () => void;
  };

  private moving?: {
    direction: Direction;
    speed: number;
    callback?: () => void;
  };

  private paused: boolean = false;

  constructor(renderEngine: CanvasRenderEngine) {
    this.renderEngine = renderEngine;
  }

  public moveTo(
    x: number,
    y: number,
    speed?: number,
    callback?: () => void,
  ): void {
    const prevMoving = this.movingTo !== undefined;

    this.paused = false;
    this.moving = undefined;
    this.movingTo = {
      callback,
      position: { x, y },
      speed: speed || 1,
    };

    if (!prevMoving) {
      this.animationFrameId = requestAnimationFrame(
        this.internalMoveTo.bind(this),
      );
    }
  }

  public move(
    direction: Direction,
    speed?: number,
    callback?: () => void,
  ): void {
    const prevMoving = this.moving !== undefined;

    this.paused = false;
    this.movingTo = undefined;
    this.moving = {
      callback,
      direction,
      speed: speed || 1,
    };

    if (!prevMoving) {
      this.animationFrameId = requestAnimationFrame(
        this.internalMove.bind(this),
      );
    }
  }

  public stop(): void {
    this.movingTo = undefined;
    this.moving = undefined;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  public pause(): void {
    this.paused = true;
  }

  public play(): void {
    this.paused = false;
  }

  public setPosition(position: IPosition): void {
    this.position = position;
  }

  public getPosition(): IPosition {
    return this.position;
  }

  public setVerticalAlign(align: VerticalAlign): void {
    this.verticalAlign = align;
  }

  public setHorizontalAlign(align: HorizontalAlign): void {
    this.horizontalAlign = align;
  }

  public abstract getWidth(): number;

  public abstract getHeight(): number;

  public abstract render(): void;

  protected getPositionToDraw(): IPosition {
    let x = this.position.x;
    let y = this.position.y;

    if (this.horizontalAlign === HorizontalAlign.CENTER) {
      x = x - this.getWidth() / 2;
    } else if (this.horizontalAlign === HorizontalAlign.RIGHT) {
      x = x - this.getWidth();
    }

    if (this.verticalAlign === VerticalAlign.MIDDLE) {
      y = y - this.getHeight() / 2;
    } else if (this.verticalAlign === VerticalAlign.BOTTOM) {
      y = y - this.getHeight();
    }

    return { x, y };
  }

  private internalMoveTo() {
    if (this.movingTo) {
      if (this.movingTo.callback) {
        this.movingTo.callback();
      }

      if (this.movingTo) {
        let finished = false;
        if (!this.paused) {
          const s = this.movingTo.speed;
          const x = this.movingTo.position.x;
          const y = this.movingTo.position.y;

          this.position = {
            x:
              x < this.position.x
                ? Math.max(this.position.x - s, x)
                : x > this.position.x
                ? Math.min(this.position.x + s, x)
                : this.position.x,
            y:
              y < this.position.y
                ? Math.max(this.position.y - s, y)
                : y > this.position.y
                ? Math.min(this.position.y + s, y)
                : this.position.y,
          };

          this.renderEngine.render();

          finished = this.position.x === x && this.position.y === y;
        }

        if (!finished) {
          this.animationFrameId = requestAnimationFrame(
            this.internalMoveTo.bind(this),
          );
        } else {
          this.movingTo = undefined;
          this.animationFrameId = undefined;
        }
      }
    }
  }

  private internalMove() {
    if (this.moving) {
      if (this.moving.callback) {
        this.moving.callback();
      }

      if (this.moving) {
        if (!this.paused) {
          const s = this.moving.speed;
          const dir = this.moving.direction;

          this.position = {
            x:
              dir === Direction.LEFT
                ? this.position.x - s
                : dir === Direction.RIGHT
                ? this.position.x + s
                : this.position.x,
            y:
              dir === Direction.UP
                ? this.position.y - s
                : dir === Direction.DOWN
                ? this.position.y + s
                : this.position.y,
          };

          this.renderEngine.render();
        }

        this.animationFrameId = requestAnimationFrame(
          this.internalMove.bind(this),
        );
      }
    }
  }
}
