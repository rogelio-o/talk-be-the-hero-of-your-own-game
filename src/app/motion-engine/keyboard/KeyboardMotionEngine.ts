import { IGlyph } from "../../render-engine/glyph/IGlyph";
import { IMotionEngine } from "../IMotionEngine";
import { Intention } from "../Intention";

export class KeyboardMotionEngine implements IMotionEngine {
  private canvas: HTMLCanvasElement;

  private clickCallbacks: {
    [id: string]: {
      glyph: IGlyph;
      callbackStart: () => void;
      callbackStop?: () => void;
    };
  } = {};

  private intentionsCallback: {
    [id: string]: {
      intention: Intention;
      callbackStart: () => void;
      callbackStop?: () => void;
    };
  } = {};

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  public click(
    id: string,
    glyph: IGlyph,
    callbackStart: () => void,
    callbackStop: () => void,
  ): void {
    this.clickCallbacks[id] = { glyph, callbackStart, callbackStop };
  }

  public intention(
    id: string,
    intention: Intention,
    callbackStart: () => void,
    callbackStop: () => void,
  ): void {
    this.intentionsCallback[id] = { intention, callbackStart, callbackStop };
  }

  public removeClick(id: string): void {
    delete this.clickCallbacks[id];
  }

  public removeIntention(id: string): void {
    delete this.intentionsCallback[id];
  }

  public removeAll(): void {
    this.clickCallbacks = {};
    this.intentionsCallback = {};
  }

  public listen(): void {
    this.canvas.addEventListener("mousedown", (e) => {
      const elemLeft = this.canvas.offsetLeft;
      const elemTop = this.canvas.offsetTop;
      const x = e.pageX - elemLeft;
      const y = e.pageY - elemTop;

      Object.values(this.clickCallbacks).forEach((cb) => {
        const cbPosition = cb.glyph.getPosition();
        if (
          y > cbPosition.y &&
          y < cbPosition.y + cb.glyph.getHeight() &&
          x > cbPosition.x &&
          x < cbPosition.x + cb.glyph.getWidth()
        ) {
          setTimeout(() => cb.callbackStart(), 0);
        }
      });
    });

    this.canvas.addEventListener("mouseup", (e) => {
      const elemLeft = this.canvas.offsetLeft;
      const elemTop = this.canvas.offsetTop;
      const x = e.pageX - elemLeft;
      const y = e.pageY - elemTop;

      Object.values(this.clickCallbacks).forEach((cb) => {
        const cbPosition = cb.glyph.getAbsolutePosition();

        if (
          y > cbPosition.y &&
          y < cbPosition.y + cb.glyph.getHeight() &&
          x > cbPosition.x &&
          x < cbPosition.x + cb.glyph.getWidth()
        ) {
          const callback = cb.callbackStop;

          if (callback) {
            setTimeout(() => callback(), 0);
          }
        }
      });
    });

    const keyDowns: number[] = [];
    document.onkeydown = (e) => {
      const charCode = typeof e.which === "number" ? e.which : e.keyCode;

      if (keyDowns.indexOf(charCode) < 0) {
        keyDowns.push(charCode);
        this.doCallbacks(charCode, (cb: any) => cb.callbackStart);
      }
    };

    document.onkeyup = (e) => {
      const charCode = typeof e.which === "number" ? e.which : e.keyCode;

      const indexOf = keyDowns.indexOf(charCode);
      if (indexOf >= 0) {
        keyDowns.splice(indexOf, 1);
      }

      this.doCallbacks(charCode, (cb: any) => cb.callbackStop);
    };
  }

  private doCallbacks(charCode: number | null, cbExtractor: any) {
    if (charCode) {
      Object.values(this.intentionsCallback).forEach((cb) => {
        const expectedCharcode = this.intentionToCharcode(cb.intention);

        if (charCode === expectedCharcode) {
          const callback = cbExtractor(cb);

          if (callback) {
            setTimeout(() => callback(), 0);
          }
        }
      });
    }
  }

  private intentionToCharcode(intention: Intention): number {
    switch (intention) {
      case Intention.LEFT:
        return 37;
      case Intention.RIGHT:
        return 39;
      case Intention.DOWN:
        return 40;
      case Intention.UP:
        return 38;
      case Intention.PUNCH:
        return 32;
      case Intention.PAUSE:
        return 19;
      case Intention.EXIT:
      default:
        return 27;
    }
  }
}
