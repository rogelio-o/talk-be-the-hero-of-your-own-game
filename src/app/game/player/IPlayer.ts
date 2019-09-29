import { ICharacter } from "../character/ICharacter";

export interface IPlayer {
  readonly character: ICharacter;

  getHealth(): number;

  healthHandler(cb: (health: number) => void): void;

  startMoving(): void;

  stopMoving(): void;

  punch(damage: number): void;

  setOtherPlayer(p: IPlayer): void;
}
