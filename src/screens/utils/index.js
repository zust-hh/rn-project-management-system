import gql from '../../gql';

export const findInArray = (x, arr) => {
    let find = false
    if (arr.length > 0) {
        arr.map((item) => {
            if (x.id == item.id) find = true
        })
    }
    return find
}

export const _subscribeToUpdateProjects = subscribeToMore => {
    subscribeToMore({
        document: gql.UPDATE_PROJECTS_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev
            const UpdateProject = subscriptionData.data.updateProject
            prev.projectList.projects.map((project) => {
                if (project.id === UpdateProject.id) {
                    project.showFavorite = false
                }
            })
            const updatedProjectList = Object.assign({}, prev, {
                projectList: {
                    projects: [...prev.projectList.projects],
                    count: prev.projectList.projects.length,
                    myFavoriteProjects: [...prev.projectList.myFavoriteProjects, { id: UpdateProject.id, __typename: "Project" }],
                    __typename: prev.projectList.__typename
                }
            })
            return updatedProjectList
        }
    })
}

export const _subscribeToUpdateUsers = subscribeToMore => {
    subscribeToMore({
        document: gql.UPDATE_USERS_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev
            const UpdateUser = subscriptionData.data.updateUser
            prev.userList.users.map((user) => {
                if (user.id === UpdateUser.id) {
                    user.showFollow = false
                }
            })
            const updatedUserList = Object.assign({}, prev, {
                userList: {
                    users: [...prev.userList.users],
                    count: prev.userList.users.length,
                    myFollowUsers: [...prev.userList.myFollowUsers, { id: UpdateUser.id, __typename: "Project" }],
                    __typename: prev.userList.__typename
                }
            })
            return updatedUserList
        }
    })
}