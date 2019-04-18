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

const HOTPROJECTLIST_QUERY = gql`
  query HotProjectListQuery {
    projectList(orderBy: viewNum_DESC) {
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

const SEARCHPROJECTLIST_QUERY = gql`
  query SearchProjectListQuery($searchText: String!) {
    projectList(filter: $searchText) {
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

const SEARCHUSERLIST_QUERY = gql`
  query SearchUserListQuery($searchText: String!) {
    userList(filter: $searchText) {
      users {
        id
        name
        class
      }
      myFollowUsers {
        id
      }
    }
}
`

const USERINFO_QUERY = gql`
  query UserInfoQuery($userId: String) {
    getUserInfo(userId: $userId) {
      id
      name
      memberProjects {
        id
        name
        steps {
          id
          state
        }
        state
      }
      type
      unreadMessage {
        id
      }
    }
}
`

const USERFAVORITE_QUERY = gql`
  query UserFavoriteQuery($userId: String) {
    getUserInfo(userId: $userId) {
      id
      favorite {
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
}
`

const USERFOLLOW_QUERY = gql`
  query UserFollowQuery($userId: String) {
    getUserInfo(userId: $userId) {
      id
      follow {
        id
        name
        class
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

const FOLLOW_MUTATION = gql`
  mutation FollowMutation($followUserId: String!) {
    followUser(followUserId: $followUserId) {
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

const UPDATE_USERS_SUBSCRIPTION = gql`
  subscription {
    updateUser {
      id
      name
      class
    }
  }
`

export default {
  PROJECTLIST_QUERY,
  HOTPROJECTLIST_QUERY,
  SEARCHPROJECTLIST_QUERY,
  SEARCHUSERLIST_QUERY,
  USERINFO_QUERY,
  USERFAVORITE_QUERY,
  USERFOLLOW_QUERY,
  LOGIN_MUTATION,
  FAVORITE_MUTATION,
  FOLLOW_MUTATION,
  UPDATE_PROJECTS_SUBSCRIPTION,
  UPDATE_USERS_SUBSCRIPTION
}