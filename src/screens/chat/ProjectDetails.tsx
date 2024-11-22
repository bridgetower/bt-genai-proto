import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { FETCH_PROJECT_BY_ID } from "@/apollo/schemas/projectSchemas";
import { SidepanelSkeleton } from "@/components/common/SidepanelSkeleton";
import { ISteperData, Stepper } from "@/components/common/Stepper";
import { IProjectAttributes, ProjectStageEnum, ProjectStageLabel, stepData } from "@/types/ProjectData";

let tempStepsData: ISteperData[] = [];
const ProjectDetails: React.FC<{ id: string }> = (props) => {
  const rowLimit: number = 1;
  const topRef = useRef<HTMLDivElement | null>(null);
  const { id } = props;
  const [stepperData, setStepperData] = useState<ISteperData[]>([]);
  const [project, setProject] = useState<IProjectAttributes | null>(null);
  const memoizedStepperData = React.useMemo(() => stepperData, [stepperData]);
  const [docPage, setDocPage] = useState(1);
  const [getData, { loading, error, refetch, fetchMore }] = useLazyQuery(FETCH_PROJECT_BY_ID, {
    variables: {
      id,
      docPage,
      rowLimit
    },
    fetchPolicy: "cache-and-network"
  });
  // const { project: projectDetails, refetch, stages, pagination, loading, error, loadMore, status } = useProjectDetails(id);
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
    tempStepsData = stepData;
    setDocPage(1);
    // refetch();
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }
    getProjectDetailsById();
  }, [id, docPage]);

  const getProjectDetailsById = () => {
    // showLoader();
    getData({
      variables: { projectId: id, pageNo: docPage, limit: rowLimit }
    })
      .then((res: any) => {
        if (res.data?.GetProjectAndStepById?.data) {
          setProject(res.data.GetProjectAndStepById.data?.project);
          const lastCompletedStage = res.data.GetProjectAndStepById.data?.project?.projectstage;
          let stepCompleted = true;
          tempStepsData = tempStepsData.map((step) => {
            const stage = res.data?.GetProjectAndStepById?.data?.stagedata?.stages;
            const data: any[] = stage?.filter((s: any) => s.name === step.label) || [];
            const finalData = {
              ...step,
              data: step.data ? step.data : data.length ? data[0] : null,
              completed: stepCompleted,
              dataLoading: false
            };
            if (step.label === ProjectStageLabel[lastCompletedStage as ProjectStageEnum]) {
              stepCompleted = false;
            }
            return finalData;
          });
          setStepperData(tempStepsData);
        } else {
          setProject(null);
          toast.error(res?.data?.GetProjectAndStepById?.error);
        }
      })
      .catch((error: any) => {
        toast.error(error?.message || "Failed to fetch project details!");
      })
      .finally(() => {
        // hideLoader();
        // setLoadingProject(false);
      });
  };

  const onStepClick = (index: number) => {
    if (stepData[index].data) {
      return;
    }
    setDocPage(index + 1);
  };

  return (
    <div className=" " ref={topRef}>
      {loading && !project ? (
        <SidepanelSkeleton />
      ) : (
        <>
          <Stepper
            steps={memoizedStepperData}
            renderContent={() => null}
            animationDuration={0.5}
            className="bg-card rounded-2xl"
            onStepClick={onStepClick}
          />
        </>
      )}
      {!project && !loading && <div className="text-center text-red-500">No data found</div>}
    </div>
  );
};

export default ProjectDetails;
