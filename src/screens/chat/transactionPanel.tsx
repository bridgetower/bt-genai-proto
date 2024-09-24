import { useLazyQuery } from "@apollo/client";
import { formatDistance, formatISO } from "date-fns";
import { CopyIcon, Loader } from "lucide-react";
import React, { useEffect } from "react";

import { GET_BLOCKCHAIN_DATA_BY_HASH } from "@/apollo/schemas/getdatabyhash";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { ITransactionData } from "@/types";

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
  chainType: string;
  transactionHash: string;
};
const TransactionPanel: React.FC<Props> = (props) => {
  const { chainType, transactionHash } = props;
  const [getData, { loading }] = useLazyQuery(GET_BLOCKCHAIN_DATA_BY_HASH);
  const [transactionData, setTransactionData] = React.useState<ITransactionData | null>(null);

  useEffect(() => {
    if (chainType && transactionHash) {
      getData({
        variables: {
          chainType,
          transactionHash
        }
      })
        .then((res) => {
          setTransactionData(res.data?.GetHashTransaction?.data || null);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [chainType, transactionHash]);

  return (
    <div className="px-6 pt-0 ">
      {loading && <Loader />}
      {transactionData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {/* Each detail in a KPI card */}
            <Card value={transactionData?.blockNumber} title="Block Number" showCopyIcon={true} />
            <Card value={transactionData?.chainId} title="Chain Id" showCopyIcon={true} />
            <Card value={transactionData?.status} title="Status" />
          </div>
          <div className="pt-5">
            <InlineDetails value={transactionData?.blockHash} title="Content Hash" showCopyIcon={true} />
            <InlineDetails value={transactionData?.blockHash} title="Block Hash" showCopyIcon={true} />
            <InlineDetails value={transactionData?.transactionId} title="Transaction Hash" showCopyIcon={true} />
            <InlineDetails value={transactionData?.metaData} title="Metadata Hash" showCopyIcon={true} />
            <InlineDetails value={transactionData?.from} title="From" showCopyIcon={true} />
            <InlineDetails value={transactionData?.to} title="To" showCopyIcon={true} />
            <InlineDetails value={transactionData?.confirmations} title="Confirmation" />
            <InlineDetails value={transactionData?.message} title="Message" />
            <InlineDetails value={parseFloat(transactionData?.gas) + " AVAX"} title="Gas" />
            <InlineDetails
              value={
                formatDistance(transactionData?.timestamp, new Date(), { addSuffix: true, includeSeconds: true }) +
                " (" +
                formatISO(transactionData?.timestamp) +
                ")"
              }
              title="Timestamp"
            />
          </div>

          {/* View on Snowtrace Testnet */}
          <hr className="my-6" />
          <div className="flex justify-center pt-5">
            <a
              href={`https://testnet.snowtrace.io/tx/${transactionData.transactionId}`}
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
        <h3 className="text-xs font-extrabold text-primary capitalize">{title}</h3>
      </div>
      <p
        className={`mt-2 ${title === "Status" ? (value === "SUCCESS" ? "text-green-600" : "text-yellow-500") : "text-primary"} flex justify-between text-xs font-medium capitalize`}
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

        <p className="ml-2 text-primary text-xs max-w-[300px] truncate col-span-3 tr">{value}</p>
        {showCopyIcon && (
          <CopyIcon
            size={16}
            onClick={() => copyToClipboard(value.toString())}
            className="text-primary hover:text-secondary-foreground/70 cursor-pointer ml-2"
          />
        )}
      </div>
    </div>
  );
};

export default TransactionPanel;
