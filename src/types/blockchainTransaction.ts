export interface ITransactionData {
  // transactionId: string;
  blockNumber: { S: string };
  chainId: { S: string };
  from: { S: string };
  to: { S: string };
  txHash: { S: string };
  hash: { S: string };
  blockHash: { S: string };
  status: { S: string };
  message: { S: string };
  timestamp: { S: string };
  metaData: { S: string };
  confirmations: { S: string };
  gasFee: { S: string };
  value?: { S: string };
  gasPrice?: { S: string };
  gasLimit?: { S: string };
  nonce?: { S: string };
  contractAddress?: { S: string };
  type?: { S: string };
}
