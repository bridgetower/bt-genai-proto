export interface IChain {
  name: ChainTypes;
  explorerUrl: string;
}
export interface IChains {
  Avalanche: IChain;
  Provenance: IChain;
}
export type ChainTypes = 'Avalanche' | 'Provenance';
