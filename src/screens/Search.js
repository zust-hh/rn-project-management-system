import React from "react";
import { NavigationBar, Title, ImageBackground, ListView, Tile, Subtitle, Divider, Screen, Button, View, TextInput, Text } from '@shoutem/ui';
import AsyncStorage from '@react-native-community/async-storage';
import { SwitchNavigator } from 'react-navigation';
import Login from './Login';
import { Query } from 'react-apollo';
import ProjectCard from '../components/ProjectCard';

import gql from '../gql';

export default class Search extends React.Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    findInArray = (x, arr) => {
        let find = false
        if (arr.length > 0) {
            arr.map((item) => {
                if (x.id == item.id) find = true
            })
        }
        return find
    }

    // 收藏之后的更新
    _updateCacheAfterCollection = (store, projectId) => {
        const data = store.readQuery({
            query: gql.PROJECTLIST_QUERY,
            variables: { attribution: 0 },
        })

        const favoritedProject = data.projectList.projects.find(project => project.id === projectId)
        data.projectList.myFavoriteProjects = [...data.projectList.myFavoriteProjects, {
            id: projectId,
            __typename: "Project"
        }]
        favoritedProject.showFavorite = false
        store.writeQuery({ query: gql.PROJECTLIST_QUERY, data })
    }

    _subscribeToUpdateProjects = subscribeToMore => {
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
                        myFavoriteProjects: [...prev.projectList.myFavoriteProjects, { id: UpdateProject.id, __typename: "Project" }],
                        __typename: prev.projectList.__typename
                    }
                })
                return updatedProjectList
            }
        })
    }

    renderUserHome = (userType) => {
        const { navigate } = this.props.navigation;
        switch (userType) {
            case 0: return <ImageBackground
                styleName="large-banner"
                source={{ uri: "https://i.loli.net/2019/03/22/5c948bca62fc7.jpg" }}
            >
                <View>
                    <Button
                        style={{ width: 150, height: 50 }}
                        onPress={() => navigate('SearchList', {
                            page: 'SearcheScreen',
                        })}
                    >
                        <Text>Login</Text>
                    </Button>
                </View>
            </ImageBackground>
            case 2:
            case 1: return <View><ImageBackground
                styleName="large-banner"
                source={{ uri: "https://i.loli.net/2019/03/22/5c948bca62fc7.jpg" }}
            >
                <View>
                    <Button
                        style={{ width: 150, height: 50 }}
                        onPress={() => navigate('Login')}
                    >
                        <Text>student / teacher</Text>
                    </Button>
                </View>
            </ImageBackground></View>
            case 3: return <View><ImageBackground
                styleName="large-banner"
                source={{ uri: "https://i.loli.net/2019/03/22/5c948bca62fc7.jpg" }}
            >
                <View>
                    <Button
                        style={{ width: 150, height: 50 }}
                        onPress={() => navigate('Login')}
                    >
                        <Text>admin</Text>
                    </Button>
                </View>
            </ImageBackground></View>
        }
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <Screen style={{ marginTop: 32 }} >
                <TextInput
                    placeholder={"搜索项目名、介绍、人员"}
                />
                <Button
                    style={{ opacity: 0, height: 55, width: 300, position: 'absolute', top: 0 }}
                    onPress={() => navigate('SearchList')}
                />
                <Tile
                    styleName="clear"
                >
                    <View>
                        <Text>热门</Text>
                    </View>
                    <Query
                        query={gql.HOTPROJECTLIST_QUERY}
                    >
                        {({ loading, error, data, subscribeToMore }) => {
                            console.log(data);
                            this._subscribeToUpdateProjects(subscribeToMore)
                            if (data && data.projectList && data.projectList.projects.length > 0) {
                                const { projects, myFavoriteProjects } = data.projectList;
                                projects.map((project) => {
                                    project.showFavorite = !this.findInArray(project, myFavoriteProjects);
                                })
                            } else {
                                data.projectList = {}
                                data.projectList.projects = []
                            }

                            return (
                                <ListView
                                    loading={loading}
                                    data={loading ? [] : data.projectList.projects}
                                    renderRow={ProjectCard}
                                />
                            )
                        }}
                    </Query>
                </Tile>
            </Screen>
        );
    }
}
