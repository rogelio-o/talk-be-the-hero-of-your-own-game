import { IMotionEngine } from "../../motion-engine/IMotionEngine";
import { IMatchTemplate } from "../../template/IMatchTemplate";
import { ICharacter } from "../character/ICharacter";
import { IPlayer } from "../player/IPlayer";
import { Playe1ControlledPlayer } from "../player/Player1ControlledPlayer";
import { Playe2ControlledPlayer } from "../player/Player2ControlledPlayer";
import { AbstractMatch } from "./AbstractMatch";
import { IMatch } from "./IMatch";

export class MultiPlayerMatch extends AbstractMatch implements IMatch {
  private motionEngine: IMotionEngine;

  constructor(matchTemplate: IMatchTemplate, motionEngine: IMotionEngine) {
    super(matchTemplate);
    this.motionEngine = motionEngine;
  }

  protected createPlayer1(c: ICharacter): IPlayer {
    return new Playe1ControlledPlayer(c, this.motionEngine);
  }

  protected createPlayer2(c: ICharacter): IPlayer {
    return new Playe2ControlledPlayer(c, this.motionEngine);
  }
}
