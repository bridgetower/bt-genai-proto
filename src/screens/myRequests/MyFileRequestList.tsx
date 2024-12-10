import { useQuery } from "@apollo/client";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

import { FETCH_MY_FILE_REQ_LIST } from "@/apollo/schemas/projectSchemas";
import { CommonHeader } from "@/components/common/commonHeader";
import { DataTable } from "@/components/common/dataTable";
import Pagination from "@/components/common/pagination";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ActionStatus, statusColor } from "@/types/ProjectData";

import { AddFilesDialog } from "./uploadFiles";
const requests = [
  {
    projectName: "BridgeTower",
    userName: "John Doe",
    fileName: "report_2024.pdf",
    fileSize: "2.5 MB",
    addedOn: "2024-11-25",
    status: "Pending"
  },
  {
    projectName: "Meadowland UI",
    userName: "Jane Smith",
    fileName: "design_mockup.png",
    fileSize: "1.2 MB",
    addedOn: "2024-11-24",
    status: "Rejected"
  },
  {
    projectName: "GeneAI Admin",
    userName: "Michael Brown",
    fileName: "data_analysis.csv",
    fileSize: "3.8 MB",
    addedOn: "2024-11-23",
    status: "Approved"
  },
  {
    projectName: "Document Ingestion",
    userName: "Emily Clark",
    fileName: "requirements.docx",
    fileSize: "800 KB",
    addedOn: "2024-11-22",
    status: "Pending"
  },
  {
    projectName: "AI Sovereignty",
    userName: "Daniel Wilson",
    fileName: "architecture_diagram.pdf",
    fileSize: "5 MB",
    addedOn: "2024-11-21",
    status: "Approved"
  },
  {
    projectName: "BT Generative AI Proto",
    userName: "Sophia Adams",
    fileName: "training_data.json",
    fileSize: "7.5 MB",
    addedOn: "2024-11-20",
    status: "Rejected"
  }
];

const tableColumnDef: ColumnDef<any>[] = [
  {
    accessorKey: "projectName",
    header: "Project Name"
  },
  {
    accessorKey: "userName",
    header: "User Name"
  },
  {
    accessorKey: "name",
    header: "File Name"
  },
  {
    accessorKey: "size",
    header: "File Size"
  },
  {
    accessorKey: "createdat",
    header: "Added On"
  }
  // {
  //   accessorKey: 'status',
  //   header: 'Request Status',
  // },
];
export const MyFileRequestList: React.FC = () => {
  const pageLimit = 10;
  const idToken = localStorage.getItem("idToken");
  const [page, setPage] = useState(1);
  const [fileRequest, setFileRequest] = useState<any[]>([]);
  const memoizedFileRequest = React.useMemo(() => fileRequest, [fileRequest]);
  const {
    data: listdata,
    refetch,
    loading
  } = useQuery(FETCH_MY_FILE_REQ_LIST, {
    variables: {
      limit: pageLimit,
      pageNo: page,
      projectId: process.env.REACT_APP_PROJECT_ID || ""
    },
    context: {
      headers: {
        identity: idToken
      }
    },
    nextFetchPolicy: "network-only"
  });
  useEffect(() => {
    if (!listdata) {
      return;
    }
    const st = (listdata?.ListReferenceByCustomer?.data?.refs || []).map((d: any) => {
      return {
        ...d,
        createdat: new Date(d.createdat).toLocaleString()
      };
    });
    setFileRequest(st);
  }, [listdata]);
  useEffect(() => {
    if (!idToken) {
      return;
    }
    refetch();
  }, [idToken, page]);

  const onPageChange = (page: number) => {
    setPage(page);
  };

  const statusColDef = {
    id: "status",
    header: "Status",
    cell: ({ row }: any) => {
      const dataSet = row.original;
      console.log(dataSet);

      return (
        <>
          <Badge
            className={`text-sm font-medium ${statusColor[dataSet.status.toUpperCase() as ActionStatus].text + " " + statusColor[dataSet.status.toUpperCase() as ActionStatus].bg} hover:${statusColor[dataSet.status.toUpperCase() as ActionStatus].bg}`}
          >
            {dataSet.status.toUpperCase()}
          </Badge>
        </>
      );
    }
  };

  const refetchList = () => {
    console.log("refetched");

    refetch().then((res) => {
      const st = (res.data?.ListReferenceByCustomer?.data?.refs || []).map((d: any) => {
        return {
          ...d
          // createdat: new Date(d.createdat).toLocaleString()
        };
      });
      setFileRequest(st);
    });
  };
  return (
    <>
      <CommonHeader />
      <div className="p-4">
        <div className="bg-card rounded-2xl p-4">
          <div className="flex justify-between pb-4">
            <div className="uppercase text-md text-[#486581]">File Add Requests</div>
            <AddFilesDialog onAfterUpload={refetchList} />
          </div>
          {loading ? (
            <>
              <div>
                <Skeleton className="h-12" />
                {[...Array(7)].map((_, idx) => (
                  <div className="" key={idx}>
                    <div className="flex justify-between mt-2 gap-3">
                      <Skeleton className="h-16 w-1/4" />
                      <Skeleton className="h-16 w-2/3" />
                      <Skeleton className="h-16 w-1/12" />
                    </div>
                  </div>
                ))}
                <div className="flex justify-end gap-1 mt-4">
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-10 w-12" />
                  <Skeleton className="h-10 w-12" />
                  <Skeleton className="h-10 w-12" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </>
          ) : (
            <div>
              <DataTable
                columns={[...tableColumnDef, statusColDef]}
                data={memoizedFileRequest}
                rowSeletable={false}
                actionMenu={true}
                onActionMenuClick={() => {}}
                noDataText="No stage types found"
              />
              <div className="flex justify-end">
                <Pagination totalItems={memoizedFileRequest.length} itemsPerPage={pageLimit} onPageChange={onPageChange} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
