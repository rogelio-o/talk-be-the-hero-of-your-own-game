import { Direction } from "../../utils/Direction";
import { IPosition } from "../../utils/IPosition";
import { Origin } from "../../utils/Origin";
import { IGlyph } from "./IGlyph";

export class GlyphGroup implements IGlyph {
  private glyphs: IGlyph[] = [];

  public add(glyph: IGlyph): void {
    this.glyphs.push(glyph);
  }

  public remove(glyph: IGlyph): void {
    const index = this.glyphs.indexOf(glyph);
    if (index > -1) {
      this.glyphs.splice(index, 1);
    }
  }

  public moveTo(
    x: number,
    y: number,
    speed?: number,
    callback?: () => void,
  ): void {
    const position = this.getPosition();

    this.glyphs.forEach((g) =>
      g.moveTo(
        x + (g.getPosition().x - position.x),
        y + (g.getPosition().y - position.y),
        speed,
        callback,
      ),
    );
  }

  public move(dir: Direction, speed?: number, callback?: () => void): void {
    this.glyphs.forEach((g) => g.move(dir, speed, callback));
  }

  public stop(): void {
    this.glyphs.forEach((g) => g.stop());
  }

  public pause(): void {
    this.glyphs.forEach((g) => g.pause());
  }

  public play(): void {
    this.glyphs.forEach((g) => g.play());
  }

  public setPosition(position: IPosition): void {
    const currentPosition = this.getPosition();

    this.glyphs.forEach((g) =>
      g.setPosition({
        x: position.x + (g.getPosition().x - currentPosition.x),
        y: position.y + (g.getPosition().y - currentPosition.y),
      }),
    );
  }

  public getPosition(): IPosition {
    let x = Number.MAX_VALUE;
    let y = Number.MAX_VALUE;

    this.glyphs.forEach((g) => {
      x = Math.min(x, g.getAbsolutePosition().x);
      y = Math.min(y, g.getAbsolutePosition().y);
    });

    return { x, y };
  }

  public getAbsolutePosition(): IPosition {
    return this.getPosition();
  }

  public setOrigin(origin: Origin): void {
    this.glyphs.forEach((g) => g.setOrigin(origin));
  }

  public getWidth(): number {
    const leftTopCorner = this.getPosition();
    const rightBottomCorner = this.getRightBottomCorner();

    return rightBottomCorner.x - leftTopCorner.x;
  }

  public getHeight(): number {
    const leftTopCorner = this.getPosition();
    const rightBottomCorner = this.getRightBottomCorner();

    return rightBottomCorner.y - leftTopCorner.y;
  }

  public render(): void {
    this.glyphs.forEach((g) => g.render());
  }

  public clone(): IGlyph {
    const group = new GlyphGroup();

    this.glyphs.forEach((g) => group.add(g.clone()));

    return group;
  }

  private getRightBottomCorner(): IPosition {
    let x = 0;
    let y = 0;

    this.glyphs.forEach((g) => {
      x = Math.max(x, g.getAbsolutePosition().x + g.getWidth());
      y = Math.max(y, g.getAbsolutePosition().y + g.getHeight());
    });

    return { x, y };
  }
}
