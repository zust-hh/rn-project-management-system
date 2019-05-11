import React from "react";
import {
    Dimensions
} from 'react-native';
import { Image, ListView, Tile, Screen, Button, View, TextInput, Text } from '@shoutem/ui';
import { Query } from 'react-apollo';
import ProjectCard from '../components/ProjectCard';
import { findInArray, _subscribeToUpdateProjects } from './utils'

import gql from '../gql';

const windowWidth = Dimensions.get("window").width;
const HotImage = require('../static/hot.png')

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
                <View style={{ backgroundColor: 'rgb(56,162,220)' }}>
                    <TextInput
                        style={{ backgroundColor: 'rgb(56,162,220)', color: 'white' }}
                        value={"搜索项目名、介绍、人员"}
                    />
                </View>
                <Button
                    activeOpacity={0}
                    style={{ opacity: 0, height: 55, width: 300, position: 'absolute', top: 0, backgroundColor: 'rgb(56,162,220)' }}
                    onPress={() => navigate('SearchList')}
                />
                <Tile
                    styleName="clear"
                    style={{ marginTop: 12 }}
                >
                    <View
                        styleName="horizontal"
                        style={{ backgroundColor: 'white', paddingLeft: 10, paddingTop: 8, paddingBottom: 8, width: windowWidth, marginRight: 12 }}
                    >
                        <Image
                            style={{ width: 24, height: 24 }}
                            source={HotImage}
                        />
                        <Text>热门项目</Text>
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
