import { Direction } from "../../utils/Direction";
import { IPosition } from "../../utils/IPosition";
import { Origin } from "../../utils/Origin";

export interface IGlyph {
  moveTo(x: number, y: number, speed?: number, callback?: () => void): void;

  move(dir: Direction, speed?: number, callback?: () => void): void;

  stop(): void;

  pause(): void;

  play(): void;

  setPosition(position: IPosition): void;

  getPosition(): IPosition;

  setOrigin(origin: Origin): void;

  getWidth(): number;

  getHeight(): number;

  render(): void;
}
