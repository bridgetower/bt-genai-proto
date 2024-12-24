import { gql } from "@apollo/client";

export const SIGN_IN_QUERY = gql`
  query MyQuery {
    Signin {
      data {
        createdat
        emailid
        id
        tenantid
        tenantuserid
      }
      error
      status
    }
  }
`;
