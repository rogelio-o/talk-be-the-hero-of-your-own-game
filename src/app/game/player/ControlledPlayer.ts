import { IMotionEngine } from "../../motion-engine/IMotionEngine";
import { Intention } from "../../motion-engine/Intention";
import { ICharacter } from "../character/ICharacter";
import { AbstractPlayer, PlayerStatus } from "./AbstractPlayer";
import { IPlayer } from "./IPlayer";

export class ControlledPlayer extends AbstractPlayer implements IPlayer {
  private motionEngine: IMotionEngine;

  constructor(character: ICharacter, motionEngine: IMotionEngine) {
    super(character);

    this.motionEngine = motionEngine;
  }

  public startMoving(): void {
    this.motionEngine.intention(
      "punch",
      Intention.PUNCH,
      () => {
        this.changePunching(true);
      },
      () => {
        this.changePunching(false);
      },
    );

    this.motionEngine.intention(
      "player-left",
      Intention.LEFT,
      () => {
        this.changeStatus(PlayerStatus.WALKING_LEFT);
      },
      () => this.changeStatus(PlayerStatus.AWAITING),
    );
    this.motionEngine.intention(
      "player-right",
      Intention.RIGHT,
      () => {
        this.changeStatus(PlayerStatus.WALKING_RIGHT);
      },
      () => this.changeStatus(PlayerStatus.AWAITING),
    );
  }

  public stopMoving(): void {
    this.motionEngine.removeIntention("punch");
    this.motionEngine.removeIntention("player-left");
    this.motionEngine.removeIntention("player-right");
    this.changeStatus(PlayerStatus.AWAITING);
    this.changeGettingAPunch(false);
    this.changePunching(false);
  }
}
