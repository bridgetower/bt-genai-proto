import { gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";

import { ITransactionData } from "@/types";

const GET_QA_HASHES_QUERY = gql`
  query MyQuery($jobId: String!) {
    GetQueryAnswerOrigin(input: { jobId: $jobId }) {
      data {
        blockHash
        blockNumber
        chainId
        chainType
        confirmations
        from
        gasFee
        hash
        message
        nonce
        status
        timestamp
        to
        txHash
        type
      }
      error
      status
    }
  }
`;

export const useGetBlockchainTxData = (job_id: string) => {
  // const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ITransactionData | null>(null);
  const [getData, { loading }] = useLazyQuery(GET_QA_HASHES_QUERY);
  const fetch = () => {
    setData(null);
    if (job_id.trim() !== "") {
      const token = localStorage.getItem("idToken");
      // axios
      //   .post(
      //     `https://yhxv55v5tknylmdtk3dafjymxy0zrsup.lambda-url.us-east-1.on.aws/`,
      //     {
      //       job_id
      //     },
      //     {
      //       headers: {
      //         "Content-Type": "application/json",
      //         identity: token || ""
      //       }
      //     }
      //   )
      getData({
        variables: {
          jobId: job_id
        },
        context: {
          headers: {
            identity: token || ""
          }
        },
        fetchPolicy: "network-only"
      })
        .then((res) => {
          if (res.data?.GetQueryAnswerOrigin?.data) {
            console.log(res.data?.GetQueryAnswerOrigin?.data);
            setData(res.data?.GetQueryAnswerOrigin?.data);
          }
        })
        .catch((e) => {
          console.log("Handle send msg", e);
        })
        .finally(() => {
          // setLoading(false);
        });
    }
  };

  return { fetch, loading, data } as const;
};
