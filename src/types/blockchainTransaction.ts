export interface ITransactionData {
  // transactionId: string;
  blockNumber: string;
  chainId: string;
  from: string;
  to: string;
  txHash: string;
  hash: string;
  blockHash: string;
  status: string;
  message: string;
  timestamp: string;
  metaData: string;
  confirmations: string;
  gasFee: string;
  value?: string;
  gasPrice?: string;
  gasLimit?: string;
  nonce?: string;
  contractAddress?: string;
  type?: string;
}
