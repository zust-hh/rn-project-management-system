import gql from 'graphql-tag';

const PROJECTLIST_QUERY = gql`
  query ProjectListQuery($attribution: Int!) {
    projectList(attribution: $attribution) {
      count
      projects {
        id
        name
        type
        description
        addBy {
          name
        }
        tutor {
          name
        }
      }
      myFavoriteProjects {
        id
      }
    }
}
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($idNumber: String!, $password: String!) {
    login(idNumber: $idNumber, password: $password) {
      token
      user {
        type
      }
    }
  }
`

const FAVORITE_MUTATION = gql`
  mutation FavoriteMutation($projectId: String!) {
    collectionProject(projectId: $projectId) {
      id
    }
  }
`

const UPDATE_PROJECTS_SUBSCRIPTION = gql`
  subscription {
    updateProject {
      id
      name
      type
      description
      addBy {
        name
      }
      tutor {
        name
      }
    }
  }
`

export default {
  PROJECTLIST_QUERY,
  LOGIN_MUTATION,
  FAVORITE_MUTATION,
  UPDATE_PROJECTS_SUBSCRIPTION
}