import { gql } from "@apollo/client/core";

export const GET_LOCATIONS = gql`
  query {
    locations {
      id
      latitude
      longitude
      name
    }
  }
`;

