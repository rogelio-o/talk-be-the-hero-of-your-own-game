import { Direction } from "../../../utils/Direction";
import { IPosition } from "../../../utils/IPosition";
import { Origin } from "../../../utils/Origin";
import { IGlyph } from "../../glyph/IGlyph";
import { CanvasRenderEngine } from "../CanvasRenderEngine";

export abstract class AbstractCanvasGlyph implements IGlyph {
  protected origin: Origin = Origin.TOP_LEFT;

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

  public setOrigin(origin: Origin): void {
    this.origin = origin;
  }

  public getAbsolutePosition(): IPosition {
    let x;
    let y;

    switch (this.origin) {
      case Origin.BOTTOM_LEFT:
        x = this.position.x;
        y =
          this.renderEngine.canvas.height - this.position.y - this.getHeight();
        break;
      case Origin.BOTTOM_RIGHT:
        x = this.renderEngine.canvas.width - this.position.x - this.getWidth();
        y =
          this.renderEngine.canvas.height - this.position.y - this.getHeight();
        break;
      case Origin.CENTER:
        x =
          this.renderEngine.canvas.width / 2 +
          this.position.x -
          this.getWidth() / 2;
        y =
          this.renderEngine.canvas.height / 2 +
          this.position.y -
          this.getHeight() / 2;
        break;
      case Origin.TOP_CENTER:
        x =
          this.renderEngine.canvas.width / 2 +
          this.position.x -
          this.getWidth() / 2;
        y = this.position.y;
        break;
      case Origin.BOTTOM_CENTER:
        x =
          this.renderEngine.canvas.width / 2 +
          this.position.x -
          this.getWidth() / 2;
        y =
          this.renderEngine.canvas.height - this.position.y - this.getHeight();
        break;
      case Origin.TOP_RIGHT:
        x = this.renderEngine.canvas.width - this.position.x - this.getWidth();
        y = this.position.y;
        break;
      case Origin.TOP_LEFT:
      default:
        x = this.position.x;
        y = this.position.y;
        break;
    }

    return { x, y };
  }

  public abstract getWidth(): number;

  public abstract getHeight(): number;

  public abstract render(): void;

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

          let hMult =
            dir === Direction.LEFT ? -1 : dir === Direction.RIGHT ? 1 : 0;
          let vMult =
            dir === Direction.UP ? -1 : dir === Direction.DOWN ? 1 : 0;

          if (
            this.origin === Origin.BOTTOM_RIGHT ||
            this.origin === Origin.TOP_RIGHT
          ) {
            hMult *= -1;
          }
          if (
            this.origin === Origin.BOTTOM_RIGHT ||
            this.origin === Origin.BOTTOM_LEFT ||
            this.origin === Origin.BOTTOM_CENTER
          ) {
            vMult *= -1;
          }

          this.position = {
            x: this.position.x + s * hMult,
            y: this.position.y + s * vMult,
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
