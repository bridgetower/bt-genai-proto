import { useQuery } from "@apollo/client";
import { formatDate, formatDistance } from "date-fns";
import { CopyIcon } from "lucide-react";
import React, { useEffect } from "react";

import { GET_BLOCKCHAIN_DATA_BY_HASH } from "@/apollo/schemas/getdatabyhash";
import TxHashLoader from "@/components/Loaders/hashLoader";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useGetBlockchainTxData } from "@/hooks/useGetBlockchainTxData";

// Dummy data for the transaction (can also be passed as props)
// const transactionInitial: ITransactionData = {
//   blockHash: "0xd2703c71eb3ed46f4312398fcc1daac41638249d919da19f0387c40beaac89c7",
//   blockNumber: "35977432",
//   chainId: "43113",
//   confirmations: "1917",
//   from: "0xDDdd7743CB0F4427483F10Fc8a9A912c87B06Ae7",
//   hash: "0x73e55949be12f43dd0b6ed38866c3563c11847c517a5c077a0d223f08d9cfbcc",
//   message: "Transaction successful!",
//   status: "SUCCESS",
//   gas: "9.157075E-4",
//   timestamp: "2024-09-23T05:31:06.000Z",
//   gasPrice: "26500000000",
//   gasLimit: "34914",
//   metaData: "0x73e55949be12f43dd0b6ed38866c3563c11847c517a5c077a0d223f08d9cfbcc",
//   nonce: "378",
//   to: "0x7b72b77b930656591D0281DEC0532cA6a4a55AB4",
//   transactionHash: "0x1640972dc53ddfe901f1edf9ce28797c2196e2e90add92e467d7bbf80c1626cb",
//   type: "2"
// };

type Props = {
  job_id: string;
};
const TransactionPanel: React.FC<Props> = (props) => {
  const { job_id } = props;
  const [latestConfirmations, setLatestConfirmations] = React.useState<string | null>(null);
  const { loading, fetch, data: transactionData } = useGetBlockchainTxData(job_id);
  const [transactionId, setTransactionId] = React.useState<string>("");
  const { refetch } = useQuery(GET_BLOCKCHAIN_DATA_BY_HASH, { variables: { chainType: "Avalanche", transactionHash: transactionId } });

  useEffect(() => {
    if (job_id) {
      setLatestConfirmations(null);
      fetch();
    }
  }, [job_id]);
  useEffect(() => {
    if (transactionData) {
      setTransactionId(transactionData.transactionId.S);
    }
  }, [transactionData]);

  useEffect(() => {
    if (transactionId) {
      refetch().then((res) => {
        setLatestConfirmations(res.data?.GetHashTransaction?.data?.confirmations || null);
      });
    }
  }, [transactionId]);
  return (
    <div className="px-6 pt-4 ">
      {loading && <TxHashLoader />}
      {transactionData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {/* Each detail in a KPI card */}
            <Card value={transactionData?.blockNumber?.S} title="Block Number" showCopyIcon={true} />
            <Card value={transactionData?.chainId?.S} title="Chain Id" showCopyIcon={true} />
            <Card value={transactionData?.status?.S} title="Status" />
          </div>
          <div className="pt-5">
            <InlineDetails value={transactionData?.hash?.S} title="Content Hash" showCopyIcon={true} />
            <InlineDetails value={transactionData?.blockHash?.S} title="Block Hash" showCopyIcon={true} />
            <InlineDetails value={transactionData?.transactionId?.S} title="Transaction Hash" showCopyIcon={true} />
            {/* <InlineDetails value={transactionData?.metaData?.S} title="Metadata Hash" showCopyIcon={true} /> */}
            <InlineDetails value={transactionData?.from?.S} title="From" showCopyIcon={true} />
            <InlineDetails value={transactionData?.to?.S} title="To" showCopyIcon={true} />
            <InlineDetails value={latestConfirmations ? latestConfirmations : transactionData?.confirmations?.S} title="Confirmation" />
            <InlineDetails value={transactionData?.message?.S} title="Message" />
            <InlineDetails value={parseFloat(transactionData?.gas?.S) + " AVAX"} title="Gas used" />
            <InlineDetails
              value={
                formatDistance(transactionData?.timestamp?.S, new Date(), { addSuffix: true, includeSeconds: true }) +
                " (" +
                formatDate(transactionData?.timestamp?.S, "MMM dd yyyy, mm:hh a") +
                ")"
              }
              title="Timestamp"
            />
          </div>

          {/* View on Snowtrace Testnet */}
          <hr className="my-6" />
          <div className="flex justify-center pt-5">
            <a
              href={`https://testnet.snowtrace.io/tx/${transactionData.transactionId.S}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between items-center w-fit text-lg font-semibold bg-white text-red-500 border border-red-500 px-4 py-2 rounded-lg shadow hover:opacity-90 transition-colors"
            >
              View on Snowtrace <img src="https://snowtrace.io/cdn/chains/avax/avax_32.avif" alt="logo" className="h-5 ml-1 mt-0.5" />
              {/* <SquareArrowUpRight size={20} className="ml-1" /> */}
            </a>
          </div>
        </>
      )}
    </div>
  );
};

const Card = ({ title, value, showCopyIcon = false }: { title: string; value: string; showCopyIcon?: boolean }) => {
  const [copyToClipboard] = useCopyToClipboard();
  return (
    <div className="p-3 bg-primary-foreground rounded-lg shadow-lg border border-primary">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary capitalize">{title}</h3>
      </div>
      <p
        className={`mt-2 ${title === "Status" ? (value === "SUCCESS" ? "text-green-600" : "text-yellow-500") : "text-primary"} flex justify-between items-center text-sm font-medium capitalize`}
      >
        {value}
        {showCopyIcon && (
          <CopyIcon
            size={16}
            onClick={() => copyToClipboard(value.toString())}
            className="text-primary hover:text-secondary-foreground/70 cursor-pointer"
          />
        )}
      </p>
    </div>
  );
};
const InlineDetails = ({ title, value, showCopyIcon = false }: { title: string; value: string; showCopyIcon?: boolean }) => {
  const [copyToClipboard] = useCopyToClipboard();
  return (
    <div className="py-3 shadow-sm rounded-md px-4 mt-2 bg-primary-foreground text-primary">
      <div className="flex items-center">
        <h3 className="text-sm font-bold text-primary capitalize whitespace-nowrap">{title}:</h3>

        <p className="ml-2 text-primary text-sm  truncate col-span-3 tr">{value}</p>
        {showCopyIcon && (
          <div className="min-w-5">
            <CopyIcon
              size={16}
              onClick={() => copyToClipboard(value.toString())}
              className="text-primary hover:text-secondary-foreground/70 cursor-pointer ml-2"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionPanel;
