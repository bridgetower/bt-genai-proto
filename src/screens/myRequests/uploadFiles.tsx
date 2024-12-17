import { FetchResult, useMutation, useSubscription } from "@apollo/client";
import CryptoJS from "crypto-js";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast, { Toaster } from "react-hot-toast";

import { ADD_FILE_TO_PROJECT, PROJECT_UPDATE_SUBSCRIPTION, UPDATE_REF_STATUS } from "@/apollo/schemas/projectSchemas";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { IFileContent } from "@/types/ProjectData";

type Props = {
  onAfterUpload: () => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};
export const AddFilesDialog: React.FC<Props> = (props) => {
  const projectId = localStorage.getItem("projectId") || "";
  const { onAfterUpload, isOpen, setIsOpen } = props;
  const idToken = localStorage.getItem("idToken");
  // const [isOpen, setIsOpen] = useState(false);
  const [base64Files, setBase64Files] = useState<IFileContent[]>([]);
  const [uploading, setUploading] = useState(false);
  const [addFileToProjectMutation] = useMutation(ADD_FILE_TO_PROJECT);
  const [updateReferenceStatus] = useMutation(UPDATE_REF_STATUS);
  const {
    data: subscriptionData,
    loading: loadingMsg,
    error
  } = useSubscription(PROJECT_UPDATE_SUBSCRIPTION, {
    context: {
      headers: {
        identity: idToken
      }
    }
  });

  useEffect(() => {
    console.log("subscriptionData", loadingMsg, subscriptionData);
    console.log("subscriptionError", error);
  }, [subscriptionData, error, loadingMsg]);

  // Toggle modal visibility
  const toggleModal = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setBase64Files([]);
    }
  };

  // Dropzone file handler
  const onDrop = (acceptedFiles: File[]) => {
    convertFilesToBase64(acceptedFiles);
  };

  const convertFilesToBase64 = (files: File[]) => {
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () =>
          resolve({
            fileName: file.name,
            fileContent: replaceBase64(reader.result as string),
            contentType: file.type,
            fileSize: file.size
          });
        reader.onerror = reject;
      });
    });

    Promise.all(promises).then((base64Files) => {
      setBase64Files(base64Files as IFileContent[]);
    });
  };

  const replaceBase64 = (base64: string) => {
    const newstr = base64.replace(/^data:[^;]+;base64,/, "");
    return newstr;
  };

  const onUpload = async () => {
    if (!uploading) {
      setUploading(true);
      const files = base64Files.map(async (file) => ({
        fileName: file.fileName || "",
        hash: await getHashedFile({
          fileName: file.fileName,
          fileContent: file.fileContent
        }),
        fileSize: formatFileSize(Number(file.fileSize) || 0),
        contentType: file.contentType || "",
        depth: 0,
        refType: "DOCUMENT" as const,
        websiteName: "",
        websiteUrl: ""
        // isLocal: file.isLocal,
      }));
      const hashedFilesData = await Promise.all(files);
      addFileToProjectMutation({
        variables: { projectId: projectId, files: hashedFilesData },
        context: {
          headers: {
            identity: idToken
          }
        }
      })
        .then(async (res: any) => {
          if (res.data?.AddFileToProject?.status === 200) {
            const respData = res.data?.AddFileToProject?.data?.urls;
            for (const element of respData) {
              const file = base64Files.find((file) => file.fileName === element.key);
              if (!file) {
                continue;
              }
              const url = element.url;
              const binaryData = Uint8Array.from(atob(file.fileContent || ""), (c) => c.charCodeAt(0));
              const fileUploadRes = await fetch(url, {
                method: "PUT",
                headers: {
                  "Content-Type": file.contentType || "application/octet-stream"
                },
                body: binaryData // Direct string content
              });
              if (!fileUploadRes.ok) {
                toast.error("Failed to upload file!, " + element.key);
              } else {
                const filRefId = res.data?.AddFileToProject?.data?.refs?.find((ref: any) => ref.name === element.key)?.id;
                await updateReferenceStatusMutation({
                  fileId: filRefId || "",
                  status: "UPLOADED"
                });
              }
            }
            setUploading(false);
            toggleModal();
            onAfterUpload();
            toast.success("File uploaded successfully!");
          } else {
            setUploading(false);
            toast.error(res.data?.AddFileToProject?.error);
          }
        })
        .catch((error: any) => {
          toast.error(error?.message || "Failed to add!");
        })
        .finally(() => {
          setUploading(false);
          // hideLoader();
        });
    }
  };
  const updateReferenceStatusMutation = async (content: { fileId: string; status: string }): Promise<FetchResult<any>> => {
    return updateReferenceStatus({
      variables: { ...content },
      context: {
        headers: {
          identity: idToken
        }
      }
    });
  };
  const getHashedFile = async (data: any) => {
    const metadata = JSON.stringify(data);
    const hash = CryptoJS.SHA256(metadata).toString(CryptoJS.enc.Hex);
    console.log("hash", metadata);

    return hash;
  };
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    // Math.floor(Math.log(bytes) / Math.log(k)) finds the appropriate unit
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    // Convert to the appropriate unit and round to 2 decimal places
    const finalSize = parseFloat((bytes / Math.pow(k, i)).toFixed(2));

    return `${finalSize} ${sizes[i]}`;
  };
  // Dropzone settings
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <Toaster />
      {/* <Button variant={"default"} className="" onClick={toggleModal}>
        <Plus size={16} /> Add files
      </Button> */}

      {/* Modal */}
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={toggleModal}>
          <DialogContent className="rounded-2xl">
            <DialogHeader className="text-primary">Upload File</DialogHeader>

            {/* Drag and Drop Area */}
            <div
              {...getRootProps()}
              className="rounded-2xl border-2 border-dashed border-muted-foreground bg-muted p-14 mt-5 text-center cursor-pointer"
            >
              <input {...getInputProps()} />
              <p className="text-muted-foreground hover:opacity-80 ho ">Drag & Drop files here, or click to select files</p>
            </div>

            {/* Uploaded Files (Base64) */}
            {base64Files.length > 0 && (
              <div className="mt-5">
                <h3 className="font-semibold text-sm text-start text-primary">Selected Files</h3>
                <ul className="list-disc list-inside text-start text-primary">
                  {base64Files.map((file, index) => (
                    <li key={index} className="break-words text-xs font-thin">
                      <strong>{file.fileName}:</strong>
                      {/* {file.base64} */}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Close button */}
            <div className="flex justify-center gap-1 mt-10">
              <Button size={"sm"} variant={"secondary"} onClick={toggleModal}>
                Close
              </Button>
              <Button
                size={"sm"}
                variant={"default"}
                className={` flex justify-between gap-1 items-center ${uploading && "cursor-not-allowed opacity-70"}`}
                onClick={onUpload}
              >
                {uploading && <Loader2Icon size={16} className="text-black/90 animate-spin" />}
                Upload
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
