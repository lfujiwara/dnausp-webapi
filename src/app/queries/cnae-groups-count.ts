export type CnaeGroupsCountOutput = {
  cnae: string;
  count: number;
}[];

export abstract class CnaeGroupsCount {
  abstract execute(): Promise<CnaeGroupsCountOutput>;
}
