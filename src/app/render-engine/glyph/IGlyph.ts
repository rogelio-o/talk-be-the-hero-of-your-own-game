import { Direction } from "../../utils/Direction";
import { HorizontalAlign } from "../../utils/HorizontalAlign";
import { IPosition } from "../../utils/IPosition";
import { VerticalAlign } from "../../utils/VerticalAlign";

export interface IGlyph {
  moveTo(x: number, y: number, speed?: number, callback?: () => void): void;

  move(dir: Direction, speed?: number, callback?: () => void): void;

  stop(): void;

  pause(): void;

  play(): void;

  setPosition(position: IPosition): void;

  getPosition(): IPosition;

  setVerticalAlign(align: VerticalAlign): void;

  setHorizontalAlign(align: HorizontalAlign): void;

  getWidth(): number;

  getHeight(): number;

  render(): void;
}
