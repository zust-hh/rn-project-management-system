import React from "react";
import { NavigationBar, Title, ImageBackground, Row, Icon, ListView, Tile, Subtitle, Divider, Screen, Button, View, TextInput, Text } from '@shoutem/ui';
import { SwitchNavigator } from 'react-navigation';
import Login from './Login';
import { Query, Mutation } from 'react-apollo';
import ProjectCard from '../components/ProjectCard';
import { findInArray, _subscribeToUpdateProjects, _subscribeToUpdateUsers } from './utils'
import UserCard from '../components/UserCard'

import gql from '../gql';

export default class SearchList extends React.Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            searchText: ''
        }
    }

    render() {
        const { navigate, goBack } = this.props.navigation;
        const { searchText } = this.state;
        return (
            <Screen style={{ marginTop: 32 }}>
                <Tile styleName="clear">
                    <View styleName="horizontal v-center" style={{ backgroundColor: 'white' }} >
                        <Icon styleName="disclosure" name="left-arrow" onPress={() => goBack()} />
                        <TextInput
                            style={{ flex: 1 }}
                            placeholder={"搜索项目名、介绍、人员"}
                            onChangeText={value => this.setState({ searchText: value })}
                        />
                    </View>
                    {
                        searchText ? 
                        <View style={{ marginTop: 12 }}>
                            <Query
                                query={gql.SEARCHUSERLIST_QUERY}
                                variables={{ searchText }}
                            >
                                {({ loading, error, data, subscribeToMore }) => {
                                    _subscribeToUpdateUsers(subscribeToMore)
                                    if (data && data.userList && data.userList.users.length > 0) {
                                        const { users, myFollowUsers } = data.userList;
                                        users.map((user) => {
                                            user.showFollow = !findInArray(user, myFollowUsers);
                                        })
                                    } else {
                                        data.userList = {}
                                        data.userList.users = []
                                    }

                                    return (
                                        loading ? [] : <View style={{ marginBottom: 12 }}>{data.userList.users.map(user => UserCard(user) )}</View>
                                    )
                                }}
                            </Query>
                            <Query
                                query={gql.SEARCHPROJECTLIST_QUERY}
                                variables={{ searchText }}
                            >
                                {({ loading, error, data, subscribeToMore }) => {
                                    _subscribeToUpdateProjects(subscribeToMore)
                                    if (data && data.projectList && data.projectList.projects.length > 0) {
                                        const { projects, myFavoriteProjects } = data.projectList;
                                        projects.map((project) => {
                                            project.showFavorite = !findInArray(project, myFavoriteProjects);
                                        })
                                    } else {
                                        data.projectList = {}
                                        data.projectList.projects = []
                                    }

                                    return (
                                        <ListView
                                            data={loading ? [] : data.projectList.projects}
                                            renderRow={ProjectCard}
                                        />
                                    )
                                }}
                            </Query>
                        </View> : null
                    }
                </Tile>
            </Screen>
        );
    }
}
