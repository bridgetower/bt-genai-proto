import { gql } from "@apollo/client";

export const GET_BLOCKCHAIN_DATA_BY_HASH = gql`
  query My($chainType: String!, $transactionHash: String!) {
    GetHashTransaction(input: { chainType: $chainType, transactionHash: $transactionHash }) {
      status
      error
      data {
        blockHash
        blockNumber
        chainId
        confirmations
        from
        hash
        message
        status
        gas
        timestamp
        gasPrice
        gasLimit
        metaData
        nonce
        to
        transactionId
        type
      }
    }
  }
`;
