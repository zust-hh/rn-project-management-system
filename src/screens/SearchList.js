import React from "react";
import { NavigationBar, Title, ImageBackground, Row, Icon, ListView, Tile, Subtitle, Divider, Screen, Button, View, TextInput, Text } from '@shoutem/ui';
import AsyncStorage from '@react-native-community/async-storage';
import { SwitchNavigator } from 'react-navigation';
import Login from './Login';
import { Query, Mutation } from 'react-apollo';
import ProjectCard from '../components/ProjectCard';
import { findInArray, _subscribeToUpdateProjects, _subscribeToUpdateUsers } from './utils'

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

    // 收藏之后的更新
    _updateCacheAfterFollow = (store, followUserId) => {
        const { searchText } = this.state;
        const data = store.readQuery({
            query: gql.SEARCHUSERLIST_QUERY,
            variables: { searchText },
        })

        const followUser = data.userList.users.find(user => user.id === followUserId)
        data.userList.myFollowUsers = [...data.userList.myFollowUsers, {
            id: followUserId,
            __typename: "Project"
        }]
        followUser.showFollow = false
        store.writeQuery({ query: gql.SEARCHUSERLIST_QUERY, data })
    }

    renderRow = (data) => {
        return (
            <View>
                {
                    data.length !== 0 ?
                        <Row styleName="small">
                            <Text style={{ color: 'black' }}>{data.name}</Text>
                            <Text style={{ color: 'black' }}>{data.class}</Text>
                            {
                                data.showFollow ? <Mutation
                                    mutation={gql.FOLLOW_MUTATION}
                                    variables={{ followUserId: data.id }}
                                    update={(store) =>
                                        this._updateCacheAfterFollow(store, data.id)
                                    }
                                >
                                    {mutation => (
                                        <Icon
                                            styleName="disclosure"
                                            name="left-arrow"
                                            onPress={mutation} />
                                    )}
                                </Mutation> : null
                            }

                        </Row> : null
                }
                <Divider styleName="line" />
            </View>
        );
    }

    render() {
        const { navigate, goBack } = this.props.navigation;
        const { searchText } = this.state;
        return (
            <Screen style={{ marginTop: 32 }} >
                <Tile styleName="clear">
                    <Row styleName="small">
                        <Icon styleName="disclosure" name="left-arrow" onPress={() => goBack()} />
                        <TextInput
                            style={{ flex: 1 }}
                            placeholder={"搜索项目名、介绍、人员"}
                            onChangeText={value => this.setState({ searchText: value })}
                        />
                    </Row>
                    <View>
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
                                    <ListView
                                        loading={loading}
                                        data={loading ? [] : data.userList.users}
                                        renderRow={this.renderRow}
                                    />
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
                                        loading={loading}
                                        data={loading ? [] : data.projectList.projects}
                                        renderRow={ProjectCard}
                                    />
                                )
                            }}
                        </Query>
                    </View>
                </Tile>
            </Screen>
        );
    }
}
