import { IGlyphSprite } from "../../render-engine/glyph/IGlyphSprite";
import { ISoundEngine } from "../../sound-engine/ISoundEngine";
import { collide } from "../../utils/collisionUtils";
import { Direction } from "../../utils/Direction";
import { ICharacter } from "./ICharacter";

export interface ICharacterSequences {
  waiting: number[];
  walkingLeft: number[];
  walkingRight: number[];
  punshing: number[];
  gettingAPunch: number[];
}

enum CharacterStatus {
  WAITING,
  WALKING_LEFT,
  WALKING_RIGHT,
  PUNSHING,
  GETTING_A_PUNCH,
}

export class DefaultCharacter implements ICharacter {
  private soundEngine: ISoundEngine;

  private spriteGlyph: IGlyphSprite;

  private sequences: ICharacterSequences;

  private speed: number;

  private damage: number;

  private name: string;

  private status: CharacterStatus = CharacterStatus.WAITING;

  constructor(
    soundEngine: ISoundEngine,
    spriteGlyph: IGlyphSprite,
    sequences: ICharacterSequences,
    speed: number,
    damage: number,
    name: string,
  ) {
    this.soundEngine = soundEngine;
    this.spriteGlyph = spriteGlyph;
    this.sequences = sequences;
    this.speed = speed;
    this.damage = damage;
    this.name = name;
  }

  public glyph(): IGlyphSprite {
    return this.spriteGlyph;
  }

  public waiting(): void {
    if (this.status === CharacterStatus.PUNSHING) {
      this.soundEngine.stopLoop("punch");
    }
    this.spriteGlyph.sequence(this.sequences.waiting);
    this.spriteGlyph.stop();
    this.status = CharacterStatus.WAITING;
  }

  public walkingLeft(otherCharacter?: ICharacter): void {
    if (this.status === CharacterStatus.PUNSHING) {
      this.soundEngine.stopLoop("punch");
    }
    this.spriteGlyph.sequence(this.sequences.walkingLeft);
    this.spriteGlyph.move(Direction.LEFT, this.speed, () => {
      if (
        otherCharacter &&
        collide(this.spriteGlyph, otherCharacter.glyph(), {
          left: -this.spriteGlyph.getWidth(),
          right: -this.spriteGlyph.getWidth() - 5,
        })
      ) {
        this.spriteGlyph.pause();
      }
    });
    this.status = CharacterStatus.WALKING_LEFT;
  }

  public walkingRight(otherCharacter?: ICharacter): void {
    if (this.status === CharacterStatus.PUNSHING) {
      this.soundEngine.stopLoop("punch");
    }
    this.spriteGlyph.sequence(this.sequences.walkingRight);
    this.spriteGlyph.move(Direction.RIGHT, this.speed, () => {
      if (
        otherCharacter &&
        collide(this.spriteGlyph, otherCharacter.glyph(), {
          right: -this.spriteGlyph.getWidth(),
        })
      ) {
        this.spriteGlyph.pause();
      }
    });
    this.status = CharacterStatus.WALKING_RIGHT;
  }

  public punching(): void {
    this.soundEngine.playInLoop("punch");
    this.spriteGlyph.sequence(this.sequences.punshing);
    this.status = CharacterStatus.PUNSHING;
  }

  public gettingAPunch(): void {
    if (this.status === CharacterStatus.PUNSHING) {
      this.soundEngine.stopLoop("punch");
    }
    this.spriteGlyph.sequence(this.sequences.gettingAPunch);
    this.status = CharacterStatus.GETTING_A_PUNCH;
  }

  public getSpeed(): number {
    return this.speed;
  }

  public getDamage(): number {
    return this.damage;
  }

  public getName(): string {
    return this.name;
  }

  public clone(): ICharacter {
    return new DefaultCharacter(
      this.soundEngine,
      Object.assign(
        Object.create(Object.getPrototypeOf(this.spriteGlyph)),
        this.spriteGlyph,
      ),
      this.sequences,
      this.speed,
      this.damage,
      this.name,
    );
  }
}