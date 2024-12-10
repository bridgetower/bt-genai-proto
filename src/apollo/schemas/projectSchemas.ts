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
export const ADD_FILE_TO_PROJECT = gql`
  mutation Mymutation($files: [ProjectFileInput]!, $projectId: String!) {
    AddFileToProject(input: { files: $files, projectId: $projectId }) {
      error
      status
      data {
        refs {
          createdat
          datasourceid
          depth
          id
          ingested
          ingestionjobid
          name
          referencestage
          reftype
          size
          status
          url
        }
        urls {
          key
          url
        }
      }
    }
  }
`;
export const FETCH_MY_FILE_REQ_LIST = gql`
  query MyQuery($pageNo: Int!, $limit: Int!) {
    ListReferenceByCustomer(input: { limit: $limit, pageNo: $pageNo }) {
      data {
        refs {
          createdat
          datasourceid
          depth
          id
          ingested
          ingestionjobid
          name
          referencestage
          reftype
          size
          status
          url
        }
        total
        totalPages
      }
      error
      status
    }
  }
`;
