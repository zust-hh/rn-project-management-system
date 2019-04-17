import React from "react";
import { NavigationBar, Title, ImageBackground, ListView, Tile, Subtitle, Divider, Screen, Button, View, TextInput, Text } from '@shoutem/ui';
import AsyncStorage from '@react-native-community/async-storage';
import { SwitchNavigator } from 'react-navigation';
import Login from './Login';
import { Query } from 'react-apollo';
import ProjectCard from '../components/ProjectCard';
import { findInArray, _subscribeToUpdateProjects } from './utils'

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
                </Tile>
            </Screen>
        );
    }
}
