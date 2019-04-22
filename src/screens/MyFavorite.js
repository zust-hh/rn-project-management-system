import React from "react";
import { Screen, View, ListView } from "@shoutem/ui";
import { Query } from "react-apollo";
import ProjectCard from '../components/ProjectCard';

import gql from "../gql";
import { _subscribeToUpdateProjects } from './utils'
export default class MyFavorite extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Screen style={{ marginTop: 32 }}>
                <View>
                    <Query
                        query={gql.USERFAVORITE_QUERY}
                    >
                        {({ loading, error, data, subscribeToMore }) => {
                            _subscribeToUpdateProjects(subscribeToMore)
                            if (data && data.getUserInfo && data.getUserInfo.favorite.length > 0) {
                                const { favorite } = data.getUserInfo;
                                favorite.map((project) => {
                                    project.showFavorite = false
                                })
                            } else {
                                data.getUserInfo = {}
                                data.getUserInfo.favorite = []
                            }

                            return (
                                <ListView
                                    loading={loading}
                                    data={loading ? [] : data.getUserInfo.favorite}
                                    renderRow={ProjectCard}
                                />
                            )
                        }}
                    </Query>
                </View>
            </Screen>
        );
    }
}
