import gql from 'graphql-tag';

const PROJECTLIST_QUERY = gql`
{
  projectList {
    count
    projects {
      id
      name
      type
      description
    }
  }
}
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($idNumber: String!, $password: String!) {
    login(idNumber: $idNumber, password: $password) {
      token
    }
  }
`

export default {
  PROJECTLIST_QUERY,
  LOGIN_MUTATION
}