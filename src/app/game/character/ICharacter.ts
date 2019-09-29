import { IGlyphSprite } from "../../render-engine/glyph/IGlyphSprite";

export interface ICharacter {
  glyph(): IGlyphSprite;

  waiting(): void;

  walkingLeft(otherCharacter?: ICharacter): void;

  walkingRight(otherCharacter?: ICharacter): void;

  punching(): void;

  gettingAPunch(): void;

  getSpeed(): number;

  getDamage(): number;

  getName(): string;

  clone(): ICharacter;
}
