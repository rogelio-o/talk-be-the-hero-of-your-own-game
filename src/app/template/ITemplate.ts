import { ICharacter } from "../game/character/ICharacter";
import { IMatchTemplate } from "./IMatchTemplate";

export interface IMatchActions {
  onGoHome: () => void;
}

export interface IHomeActions {
  onSinglePlayerMatch: (c1: ICharacter, c2: ICharacter) => void;
}

export interface ITemplate {
  loadResources(callback: (num: number, total: number) => void): void;

  loading(percentage: number): void;

  home(actions: IHomeActions): void;

  match(actions: IMatchActions, scenario?: string): IMatchTemplate;
}
