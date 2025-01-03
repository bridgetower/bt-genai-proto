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
  query MyQuery($pageNo: Int!, $limit: Int!, $projectId: String!) {
    ListReferenceByCustomer(input: { limit: $limit, pageNo: $pageNo, projectId: $projectId }) {
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
export const UPDATE_REF_STATUS = gql`
  mutation Mymutation($fileId: String!, $status: String!) {
    UpdateReferenceStatus(input: { files: { id: $fileId, status: $status } }) {
      data {
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
      error
      status
    }
  }
`;
export const FETCH_PROJECT_DDL_LIST = gql`
  query MyQuery($pageNo: Int!, $limit: Int!, $organizationId: String!) {
    ListProject(input: { pageNo: $pageNo, limit: $limit, organizationId: $organizationId }) {
      data {
        projects {
          id
          name
          isactive
        }
      }
      error
      status
    }
  }
`;
//Subscriptions
export const PROJECT_UPDATE_SUBSCRIPTION = gql`
  subscription MySubscription {
    onAddFileToProjectByAdmin {
      data {
        refs {
          createdat
          id
          name
          projectid
          referencestage
          reftype
          size
          status
          url
        }
      }
    }
  }
`;
export const FETCH_STAGE_BY_REFID = gql`
  query MyQuery($refId: String!) {
    GetStepsByRefId(input: { refId: $refId }) {
      data {
        reference {
          createdat
          datasourceid
          depth
          id
          ingested
          ingestionjobid
          name
          projectid
          referencestage
          reftype
          size
          status
          url
        }
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
            stepdetails {
              createdat
              id
              isactive
              isdeleted
              metadata
              refid
              status
              stepid
            }
            stepsequence
          }
        }
      }
      error
      status
    }
  }
`;
