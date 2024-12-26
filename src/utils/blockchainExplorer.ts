import { ChainTypes, IChains } from "@/types/ChainTypes";

const explorerUrl: IChains = {
  Avalanche: {
    name: "Avalanche",
    explorerUrl: "https://subnets-test.avax.network/p-chain/dynamicPath"
  },
  Provenance: {
    name: "Provenance",
    explorerUrl: "https://explorer.test.provenance.io/dynamicPath"
  }
};
export const getExplorerUrl = (chain: ChainTypes, dynamicPath: string) => {
  return explorerUrl[chain].explorerUrl.replace("dynamicPath", dynamicPath);
};
