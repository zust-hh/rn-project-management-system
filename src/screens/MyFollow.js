import React from "react";
import { Screen, View, ListView, NavigationBar, Title, Icon, Button } from "@shoutem/ui";
import { Query } from "react-apollo";
import UserCard from '../components/UserCard';

import gql from "../gql";
import { _subscribeToUpdateUsers } from './utils'
export default class MyFollow extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { goBack } = this.props.navigation;
        return (
            <Screen style={{ marginTop: 32 }}>
                <NavigationBar
                    leftComponent={(
                        <Icon styleName="disclosure" name="back" onPress={() => goBack()} />
                    )}
                    centerComponent={<Title>我的关注</Title>}
                    styleName="inline"
                />
                <View>
                    <Query
                        query={gql.USERFOLLOW_QUERY}
                    >
                        {({ loading, error, data, subscribeToMore }) => {
                            _subscribeToUpdateUsers(subscribeToMore)
                            if (data && data.getUserInfo && data.getUserInfo.follow.length > 0) {
                                const { follow } = data.getUserInfo;
                                follow.map((user) => {
                                    user.showFollow = false;
                                })
                            } else {
                                data.getUserInfo = {}
                                data.getUserInfo.follow = []
                            }

                            return (
                                <ListView
                                    loading={loading}
                                    data={loading ? [] : data.getUserInfo.follow}
                                    renderRow={UserCard}
                                />
                            )
                        }}
                    </Query>
                </View>
            </Screen>
        );
    }
}
