import axios from "axios";
import { useState } from "react";

import { ITransactionData } from "@/types";

export const useGetBlockchainTxData = (job_id: string) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ITransactionData | null>(null);
  const fetch = () => {
    setData(null);
    if (job_id.trim() !== "") {
      setLoading(true);
      axios
        .post(
          `https://yhxv55v5tknylmdtk3dafjymxy0zrsup.lambda-url.us-east-1.on.aws/`,
          {
            job_id
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data.response);
            setData(JSON.parse(res.data.response || "{}"));
          }
        })
        .catch((e) => {
          console.log("Handle send msg", e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return { fetch, loading, data } as const;
};
