import { collide } from "../../utils/collisionUtils";
import { ICharacter } from "../character/ICharacter";
import { IPlayer } from "./IPlayer";

export enum PlayerStatus {
  AWAITING,
  WALKING_LEFT,
  WALKING_RIGHT,
}

export abstract class AbstractPlayer implements IPlayer {
  public character: ICharacter;

  protected otherPlayer?: IPlayer;

  private status: PlayerStatus = PlayerStatus.AWAITING;

  private punching: boolean = false;

  private gettingAPunch: boolean = false;

  private health: number = 100;

  private healthCb?: (health: number) => void;

  private punchingInterval?: any;

  constructor(character: ICharacter) {
    this.character = character;

    this.processStatus();
  }

  public getHealth(): number {
    return this.health;
  }

  public healthHandler(cb: (health: number) => void): void {
    this.healthCb = cb;
  }

  public abstract startMoving(): void;

  public abstract stopMoving(): void;

  public punch(damage: number): void {
    if (!this.gettingAPunch) {
      this.changeGettingAPunch(true);

      this.health = Math.max(this.health - damage, 0);
      if (this.healthCb) {
        this.healthCb(this.health);
      }

      setTimeout(() => {
        this.changeGettingAPunch(false);
      }, 500);
    }
  }

  public setOtherPlayer(p: IPlayer): void {
    this.otherPlayer = p;
  }

  protected changeStatus(status: PlayerStatus) {
    this.status = status;

    this.processStatus();
  }

  protected changePunching(punching: boolean) {
    this.punching = punching;

    if (this.punchingInterval) {
      clearInterval(this.punchingInterval);
    }

    if (punching) {
      this.punchingInterval = setInterval(() => {
        if (
          !this.gettingAPunch &&
          this.otherPlayer &&
          collide(
            this.character.glyph(),
            this.otherPlayer.character.glyph(),
            {
              right: 10,
            },
            {
              left: this.character.glyph().getWidth() / 4,
              right: this.otherPlayer.character.glyph().getWidth() / 4,
            },
          )
        ) {
          this.otherPlayer.punch(this.character.getDamage());
        }
      }, 100);
    }

    this.processStatus();
  }

  protected changeGettingAPunch(gettingAPunch: boolean) {
    this.gettingAPunch = gettingAPunch;

    this.processStatus();
  }

  private processStatus() {
    if (this.gettingAPunch) {
      this.character.gettingAPunch();
    } else if (this.punching) {
      this.character.punching();
    } else {
      switch (this.status) {
        case PlayerStatus.WALKING_LEFT:
          this.character.walkingLeft(
            this.otherPlayer ? this.otherPlayer.character : undefined,
          );
          break;
        case PlayerStatus.WALKING_RIGHT:
          this.character.walkingRight(
            this.otherPlayer ? this.otherPlayer.character : undefined,
          );
          break;
        case PlayerStatus.WALKING_RIGHT:
        default:
          this.character.waiting();
          break;
      }
    }
  }
}
