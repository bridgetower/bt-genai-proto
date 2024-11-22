import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCircle2, ChevronDown, ChevronRight, Copy, Globe, Link2, Loader, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { copyToClipboard } from "@/utils/copyToClipboard";
import { timeAgo } from "@/utils/timeAgo";

export interface ISteperData {
  completed: boolean;

  label: string;
  data: any;
  // sectionId: string;
  isExpanded: boolean;
  onClick?: () => void;
  isLast?: boolean;
  selected?: boolean;
  index?: number;
  dataLoading?: boolean;
}

interface StepperProps {
  steps: ISteperData[];
  renderContent: (sectionId: string) => React.ReactNode;
  animationDuration?: number;
  onStepClick: (index: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({ steps, renderContent, animationDuration = 0.5, className = "", onStepClick }) => {
  const [activeSection, setActiveSection] = useState(steps.length ? steps[0].label : "");
  const activeStepRef = useRef<HTMLLIElement | null>(null);
  const [prevSection, setPrevSection] = useState<string | null>(null);

  const handleStepClick = (data: ISteperData, index: number) => {
    setPrevSection(activeSection);
    setActiveSection(data.label);
    onStepClick(index);
  };

  useEffect(() => {
    if (activeStepRef.current) {
      activeStepRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, [activeSection]);

  const swipeDirection =
    prevSection && steps.findIndex((step) => step.label === activeSection) > steps.findIndex((step) => step.label === prevSection)
      ? 1000
      : -1000;

  return (
    <>
      <div className={`w-full ${className}`}>
        <div className="h-auto overflow-y-auto whitespace-nowrap hide-scrollbar">
          <ol className="flex flex-col items-start">
            {steps.map((step, i) => (
              <StepItem
                key={i}
                step={{ ...step, index: i }}
                onClick={() => {
                  handleStepClick(step, i);
                  if (step.completed) {
                    if (!step.data) {
                      step.dataLoading = true;
                    }
                    step.isExpanded = !step.isExpanded;
                  }
                }}
                ref={step.label === activeSection ? activeStepRef : null}
              />
            ))}
          </ol>
        </div>
      </div>
      <div className="mt-2">
        <AnimatePresence>
          <motion.div
            key={activeSection}
            initial={{ x: swipeDirection, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -swipeDirection, opacity: 0 }}
            transition={{ duration: animationDuration }}
          >
            {renderContent(activeSection)}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

const StepItem = React.forwardRef<HTMLLIElement, { step: ISteperData; onClick: () => void }>(({ step, onClick }, ref) => {
  const { completed, label, data, isExpanded, isLast, dataLoading } = step;
  return (
    <li ref={ref} className="flex flex-col cursor-pointer my-4 relative w-full">
      <div className="flex items-center" onClick={onClick}>
        {/* Toggle Button for Expansion */}
        <button className="ml-2 text-gray-500 hover:text-blue-600">
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Step Circle with Spinner */}
        <span className="relative">
          {/* Spinner only appears when dataLoading is true */}
          {step.data?.status === "INPROGRESS" && (
            <span className="absolute -top-[3.5px] -left-[3.5px] w-12 h-12 border-2 border-t-blue-200 border-[#1890FF] rounded-full animate-spin"></span>
          )}

          {/* Step Icon */}
          <span
            className={`relative flex items-center justify-center w-9 h-9 rounded-full shrink-0 ${
              completed ? "bg-[#E6F7FF] text-[#1890FF]" : "bg-gray-100 border-gray-100"
            }`}
            aria-label={label}
          >
            {completed ? <Check size={20} /> : (step?.index || 0) + 1}
          </span>
        </span>

        {/* Step Label */}
        <div className={`ml-2 flex items-center text-sm ${completed ? "text-[#1890FF]" : "text-gray-500"}`}>
          <div className="font-medium">{label}</div>
        </div>
      </div>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="ml-12 text-gray-600"
          >
            <ul className="pl-10 list-disc">
              {((data?.steps as any[]) || []).map((step, i) => (
                <li className="text-xs" key={i}>
                  <div className="text-sm flex items-center gap-1 mt-4">
                    {/* <Link className="" size={10} /> */}
                    Step {i + 1} : {step?.name}
                    {!step?.stepdetails?.length && <Loader2 className=" text-blue-400 animate-spin" size={16} />}
                  </div>
                  <StepMetadataDetails step={step} />

                  {/* dynamic rendring of metadata  */}
                  {/* <ul className="bule pl-6 text-muted-foreground font-normal list-disc ">
                    {(step.stepdetails as any[]).map((detail, j) => (
                      <li key={i + j} className="text-xs">
                        {detail.metadata}
                      </li>
                    ))}
                  </ul> */}
                </li>
              ))}
              {dataLoading && <Loader className="animate-spin" />}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connecting Line */}
      {!isLast && (
        <span
          className={`absolute top-10 left-[45px] w-[1.5px] opacity-70 ${completed ? "bg-[#1890FF]" : "border border-dotted"}`}
          style={{ height: "calc(100% - 1rem)" }}
        ></span>
      )}
    </li>
  );
});

StepItem.displayName = "StepItem";

const StepMetadataDetails = ({ step }: { step: any }) => {
  const jsonParse = (data: any) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      return data;
    }
  };
  // function base64ToBlob(
  //   base64Data: string,
  //   contentType: string = 'application/octet-stream',
  // ): Blob | null {
  //   try {
  //     // Ensure the base64 string is properly formatted
  //     const cleanedBase64Data = base64Data.replace(/\s/g, ''); // Remove any whitespace characters
  //     const byteCharacters = atob(cleanedBase64Data);
  //     const byteNumbers = Array.from(byteCharacters).map((char) =>
  //       char.charCodeAt(0),
  //     );
  //     const byteArray = new Uint8Array(byteNumbers);

  //     return new Blob([byteArray], { type: contentType });
  //   } catch (error) {
  //     console.error('Error decoding base64 string:', error);
  //     return null;
  //   }
  // }
  // function downloadBase64File(
  //   base64Data: string,
  //   filename: string,
  //   contentType: string,
  // ) {
  //   // Convert base64 to Blob
  //   const blob = base64ToBlob(base64Data, contentType);
  //   if (!blob) {
  //     toast.error('Failed to create Blob from base64 data.');
  //     return;
  //   }
  //   // Use FileSaver to save the Blob as a file
  //   saveAs(blob, filename);
  // }
  const oncopy = (text: string) => {
    copyToClipboard(text).then(() => {
      toast.success("Copied!");
    });
  };

  const Stepdetails = () => {
    switch (step.name) {
      // case "File upload from frontend":
      // case "Upload to S3":
      // case "Read file from s3":
      // return (
      //   <ul className="font-medium text-foreground">
      //     {(step.stepdetails || []).map((d: any, i: number) => {
      //       if (d.metadata === "null" || d.metadata === "undefind") {
      //         return null;
      //       }
      //       const data = jsonParse(d.metadata);
      //       return (
      //         <li key={i} className="w-full flex gap-1 item-center bg-background mb-1 px-2 py-1 rounded-md">
      //           <Paperclip className=" text-foreground" size={14} />
      //           <a
      //             className="underline text-xs"
      //             href={data?.downloadUrl}
      //             target="_blank"
      //             rel="noreferrer"
      //             // onClick={() =>
      //             //   downloadBase64File(
      //             //     (data?.fileContent || data?.content) as string,
      //             //     data?.fileName,
      //             //     data?.contentType,
      //             //   )
      //             // }
      //           >
      //             {data?.fileName}
      //           </a>
      //           {data?.size && <div className="text-xs">{data?.size}</div>}
      //           <CheckCircle2 className="text-green-500" size={16} fill="#52C41A" stroke="white" />
      //         </li>
      //       );
      //     })}
      //   </ul>
      // );

      case "File hashing":
      case "Hashing of s3 file":
        return (
          <ul className="font-medium  text-foreground">
            {(step.stepdetails || []).map((d: any, i: number) => {
              if (d.metadata === "null" || d.metadata === "undefind") {
                return null;
              }
              const data = jsonParse(d.metadata);
              return (
                <li key={i} className="w-full flex gap-1 item-center bg-background mb-1 px-2 py-1 rounded-md cursor-default">
                  <Link2 className=" text-foreground" size={14} />
                  <div className="underline text-xs w-[350px] truncate">{data?.hash}</div>
                  <CheckCircle2 className="text-green-500" size={16} fill="#52C41A" stroke="white" />
                  <Copy className="cursor-pointer" size={14} onClick={() => oncopy(data?.hash || "")} />
                </li>
              );
            })}
          </ul>
        );

      case "Store to Blockchain":
      case "Store chunk hash to Blockchain":
      case "Store recombined file to Blockchain":
        return (
          <ul className="font-medium  text-foreground">
            {(step.stepdetails || []).map((d: any, i: number) => {
              if (d.metadata === "null" || d.metadata === "undefind") {
                return null;
              }
              const data = jsonParse(d.metadata);
              return (
                <li key={i} className="w-full flex gap-1 item-center bg-background mb-1 px-2 py-1 rounded-md cursor-default">
                  <Globe className=" text-foreground" size={14} />
                  <div className="underline text-xs w-[300px] truncate">
                    <a href={`https://testnet.snowtrace.io/tx/${data.txHash}`} target="_blank" rel="noreferrer">
                      {data.txHash}
                    </a>
                  </div>
                  <div>{timeAgo(data.timestamp)}</div>
                  <CheckCircle2 className="text-green-500" size={16} fill="#52C41A" stroke="white" />
                </li>
              );
            })}
          </ul>
        );
      // case "Chunking":
      //   return (
      //     <ul className="font-medium text-foreground">
      //       {(step.stepdetails || []).map((d: any, i: number) => {
      //         if (d.metadata === "null" || d.metadata === "undefind") {
      //           return null;
      //         }
      //         const data = jsonParse(d.metadata);
      //         return (
      //           <li key={i} className="w-full flex gap-1 item-center bg-background mb-1 px-2 py-1 rounded-md">
      //             <Paperclip className=" text-foreground" size={14} />
      //             <div>{data?.fileName}</div>
      //             <div className="text-xs">Chunks</div>
      //             <Badge variant={"success"} className="py-0 text-xs">
      //               {data?.number_of_chunks}
      //             </Badge>
      //             <CheckCircle2 className="text-green-500" size={16} fill="#52C41A" stroke="white" />
      //           </li>
      //         );
      //       })}
      //     </ul>
      //   );

      case "Chunking hash":
        return (
          <ul className="font-medium  text-foreground">
            {(step.stepdetails || []).map((d: any, i: number) => {
              if (d.metadata === "null" || d.metadata === "undefind") {
                return null;
              }
              const data = jsonParse(d.metadata);
              return (
                <>
                  {data?.hash && (
                    <li key={i} className="w-full flex gap-1 item-center bg-background mb-1 px-2 py-1 rounded-md cursor-default">
                      <Link2 className=" text-foreground" size={14} />
                      <div className="underline text-xs">{data?.fileName}</div>
                      <div className="underline text-xs w-[300px] truncate">{data?.hash}</div>
                      <CheckCircle2 className="text-green-500" size={16} fill="#52C41A" stroke="white" />
                      <Copy className="cursor-pointer" size={14} onClick={() => oncopy(data?.hash || "")} />
                    </li>
                  )}
                </>
              );
            })}
          </ul>
        );

      // case "Embedding of chunks":
      //   return (
      //     <ul className="font-medium text-foreground">
      //       {(step.stepdetails || []).map((d: any, i: number) => {
      //         if (d.metadata === "null" || d.metadata === "undefind") {
      //           return null;
      //         }
      //         const data = jsonParse(d.metadata);
      //         return (
      //           <li key={i} className="w-full flex gap-1 item-center bg-background mb-1 px-2 py-1 rounded-md">
      //             <Link2 className=" text-foreground" size={14} />
      //             <div>{data?.fileName}</div>
      //             <div className="text-xs">Chunks</div>
      //             <Badge className="py-0 text-xs" variant={"success"}>
      //               {data?.number_of_chunks}
      //             </Badge>
      //             <div className="text-xs">Vector dimensions</div>
      //             <Badge className="py-0 text-xs" variant={"success"}>
      //               {data?.vector_dimensions}
      //             </Badge>
      //             <CheckCircle2 className="text-green-500" size={16} fill="#52C41A" stroke="white" />
      //           </li>
      //         );
      //       })}
      //     </ul>
      //   );

      case "Hashing of reconstructive data":
        return (
          <ul className="font-medium  text-foreground">
            {(step.stepdetails || []).map((d: any, i: number) => {
              if (d.metadata === "null" || d.metadata === "undefind") {
                return null;
              }
              const data = jsonParse(d.metadata);
              return (
                <>
                  <li key={i} className="w-full flex gap-1 item-center bg-background mb-1 px-2 py-1 rounded-md cursor-default">
                    <Link2 className=" text-foreground" size={14} />
                    <div className="underline text-xs">{data?.file_name}</div>
                    <div className="underline text-xs w-[300px] truncate">{data?.file_content_hash}</div>
                    <CheckCircle2 className="text-green-500" size={16} fill="#52C41A" stroke="white" />
                    <Copy className="cursor-pointer" size={14} onClick={() => oncopy(data?.file_content_hash || "")} />
                  </li>
                </>
              );
            })}
          </ul>
        );

      // case "Reconstruction of data":
      //   return (
      //     <ul className="font-medium text-foreground">
      //       {(step.stepdetails || []).map((d: any, i: number) => {
      //         if (d.metadata === "null" || d.metadata === "undefind") {
      //           return null;
      //         }
      //         const data = jsonParse(d.metadata);
      //         return (
      //           <li key={i} className="w-full flex gap-1 item-center bg-background mb-1 px-2 py-1 rounded-md">
      //             <Paperclip className=" text-foreground" size={14} />
      //             <div className="underline text-xs">{data?.file_name}</div>
      //             <CheckCircle2 className="text-green-500" size={16} fill="#52C41A" stroke="white" />
      //           </li>
      //         );
      //       })}
      //     </ul>
      //   );

      // case "Writing to open search":
      //   return (
      //     <ul className="font-medium text-foreground">
      //       {(step.stepdetails || []).map((d: any, i: number) => {
      //         if (d.metadata === "null" || d.metadata === "undefind") {
      //           return null;
      //         }
      //         const data = jsonParse(d.metadata);
      //         return (
      //           <li key={i} className="w-full flex gap-1 item-center bg-background mb-1 px-2 py-1 rounded-md">
      //             <Link2 className=" text-foreground" size={14} />
      //             <div>{data?.fileName}</div>
      //             <div className="text-xs">Vector Database</div>
      //             <Badge variant={"success"} className="py-0 text-xs">
      //               {data?.vector_database}
      //             </Badge>
      //             <CheckCircle2 className="text-green-500" size={16} fill="#52C41A" stroke="white" />
      //           </li>
      //         );
      //       })}
      //     </ul>
      //   );

      default:
        return null;
    }
  };
  return <Stepdetails />;
};
