// hooks/useProjectDetails.ts
import { useQuery } from "@apollo/client";

import { FETCH_PROJECT_BY_ID } from "@/apollo/schemas/projectSchemas";

// Define types based on the actual query structure
interface StepDetails {
  createdat: string;
  id: string;
  isactive: boolean;
  isdeleted: boolean;
  metadata: string;
  status: string;
  stepid: string;
}

interface Step {
  createdat: string;
  description: string;
  id: string;
  isactive: boolean;
  isdeleted: boolean;
  name: string;
  stageid: string;
  status: string;
  stepsequence: number;
  stepdetails: StepDetails[];
}

interface Stage {
  createdat: string;
  description: string;
  id: string;
  isactive: boolean;
  isdeleted: boolean;
  name: string;
  stagesequence: number;
  stagetypeid: string;
  status: string;
  steps: Step[];
}

interface Project {
  createdat: string;
  createdby: string;
  description: string;
  id: string;
  isactive: boolean;
  name: string;
  organizationid: string;
  projectstage: string;
  projectstatus: string;
  projecttype: string;
}

interface StageData {
  total: number;
  totalPages: number;
  stages: Stage[];
}

interface QueryResponse {
  GetProjectAndStepById: {
    data: {
      project: Project;
      stagedata: StageData;
    };
    error: string | null;
    status: string;
  };
}

interface QueryVariables {
  pageNo: number;
  limit: number;
  projectId: string;
}

export const useProjectDetails = (projectId: string, pageNo: number = 1, limit: number = 1) => {
  const { data, loading, error, refetch, fetchMore } = useQuery<QueryResponse, QueryVariables>(FETCH_PROJECT_BY_ID, {
    variables: {
      projectId,
      pageNo,
      limit
    },
    fetchPolicy: "cache-and-network"
  });

  // Format the project data
  const formattedProject = data?.GetProjectAndStepById?.data?.project
    ? {
        ...data.GetProjectAndStepById.data.project,
        formattedCreatedAt: new Date(data.GetProjectAndStepById.data.project.createdat).toLocaleDateString()
      }
    : null;

  // Format the stages data
  const formattedStages =
    data?.GetProjectAndStepById.data.stagedata.stages.map((stage) => ({
      ...stage,
      formattedCreatedAt: new Date(stage.createdat).toLocaleDateString(),
      activeSteps: stage.steps.filter((step) => step.isactive).length,
      totalSteps: stage.steps.length
    })) || [];

  // Pagination info
  const pagination = {
    currentPage: pageNo,
    totalPages: data?.GetProjectAndStepById.data.stagedata.totalPages || 0,
    total: data?.GetProjectAndStepById.data.stagedata.total || 0,
    hasMore: pageNo < (data?.GetProjectAndStepById.data.stagedata.totalPages || 0)
  };

  // Load more function
  const loadMore = () => {
    if (pagination.hasMore) {
      return fetchMore({
        variables: {
          pageNo: pageNo + 1,
          limit,
          projectId
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return {
            GetProjectAndStepById: {
              ...fetchMoreResult.GetProjectAndStepById,
              data: {
                ...fetchMoreResult.GetProjectAndStepById.data,
                stagedata: {
                  ...fetchMoreResult.GetProjectAndStepById.data.stagedata,
                  stages: [
                    ...prev.GetProjectAndStepById.data.stagedata.stages,
                    ...fetchMoreResult.GetProjectAndStepById.data.stagedata.stages
                  ]
                }
              }
            }
          };
        }
      });
    }
  };

  // Error handling
  const formattedError = error
    ? {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError
      }
    : data?.GetProjectAndStepById.error
      ? {
          message: data.GetProjectAndStepById.error
        }
      : null;

  return {
    project: formattedProject,
    stages: formattedStages,
    pagination,
    loading,
    error: formattedError,
    refetch,
    loadMore,
    status: data?.GetProjectAndStepById.status
  };
};
