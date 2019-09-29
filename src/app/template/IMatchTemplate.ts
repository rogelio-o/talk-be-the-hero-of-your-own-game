import { ICharacter } from "../game/character/ICharacter";

export interface IMatchTemplate {
  scenario: string;

  gameOver(player: number): void;

  setHealth(player: number, health: number): void;

  addPlayers(c1: ICharacter, c2: ICharacter): void;
}
