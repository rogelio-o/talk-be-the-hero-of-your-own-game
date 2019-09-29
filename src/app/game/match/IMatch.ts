import { ICharacter } from "../character/ICharacter";

export interface IMatch {
  play(c1: ICharacter, c2: ICharacter, endCallback: () => void): void;
}
