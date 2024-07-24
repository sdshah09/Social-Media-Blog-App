import {USER_INFO} from './fragments'
import {gql} from '@apollo/client'

export const PROFILE = gql`
  query {
    profile {
      ...userInfo
    }
  }
  ${USER_INFO}
`;
