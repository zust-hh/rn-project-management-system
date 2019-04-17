import React from "react";
import { NavigationBar, Title, ImageBackground, Tile, Subtitle, Divider, Screen, Button, View, Text } from '@shoutem/ui';
import AsyncStorage from '@react-native-community/async-storage';
import { SwitchNavigator } from 'react-navigation';
import Login from './Login';
import { Query } from 'react-apollo';

import gql from '../gql';

export default class UserHome extends React.Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            userType: 0
        }
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
                        onPress={() => navigate('Login', {
                            page: 'UserHomeScreen',
                            callBack: (userType) => {
                                this.setState({
                                    userType
                                });
                            }
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
                <NavigationBar
                    centerComponent={<Title>我的</Title>}
                    styleName="inline"
                />
                <Query
                    query={gql.USERINFO_QUERY}
                >
                    {({ loading, error, data }) => {
                        if (loading) {
                            return (
                                <Text>123</Text>
                            )
                        }
                        return (
                            this.renderUserHome(data.getUserInfo.type)
                        )
                    }}
                </Query>
            </Screen>
        );
    }
}
