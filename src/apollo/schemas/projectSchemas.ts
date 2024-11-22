import { gql } from "@apollo/client";

export const FETCH_PROJECT_BY_ID = gql`
  query MyQuery($pageNo: Int!, $limit: Int!, $projectId: String!) {
    GetProjectAndStepById(input: { pageNo: $pageNo, limit: $limit, projectId: $projectId }) {
      data {
        project {
          createdat
          createdby
          description
          id
          isactive
          name
          organizationid
          projectstage
          projectstatus
          projecttype
        }
        stagedata {
          total
          totalPages
          stages {
            createdat
            description
            id
            isactive
            isdeleted
            name
            stagesequence
            stagetypeid
            status
            steps {
              createdat
              description
              id
              isactive
              isdeleted
              name
              stageid
              status
              stepsequence
              stepdetails {
                createdat
                id
                isactive
                isdeleted
                metadata
                status
                stepid
              }
            }
          }
        }
      }
      error
      status
    }
  }
`;
