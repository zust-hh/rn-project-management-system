import React from "react";
import {
    Dimensions,
    ScrollView
} from "react-native";
import { NavigationBar, Title, ImageBackground, Tile, Subtitle, Divider, Screen, Button, View, Text, Row, TouchableOpacity, GridRow } from '@shoutem/ui';
import AsyncStorage from '@react-native-community/async-storage';
import { SwitchNavigator } from 'react-navigation';
import Login from './Login';
import { Query } from 'react-apollo';
import gql from '../gql';

const windowWidth = Dimensions.get("window").width;

export default class UserHome extends React.Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            userType: 0,
        }
    }

    renderGridProjectCard = (data, index) => {
        const { navigate } = this.props.navigation;
        const { name, steps, id } = data;
        const stepsLength = steps.length
        let completNum = 0;
        steps.map((step) => {
            if (step.state === 2) {
                completNum++
            }
        })

        return (
            <Button
                style={{ width: 140, height: 140 }}
                key={index}
                onPress={() => navigate('ProjectDetail', {
                    page: 'UserHomeScreen',
                    id
                })}
            >
                <ImageBackground
                    style={{ width: 140, height: 80 }}
                    source={{ uri: "https://i.loli.net/2019/03/22/5c948bca62fc7.jpg" }}
                >
                    <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                        <Text style={{ color: 'white' }}>已完成{completNum / stepsLength * 100}%</Text>
                    </View>
                </ImageBackground>
                <Text style={{ width: 130 }} numberOfLines={1} ellipsizeMode='tail'>{name}</Text>
            </Button>
        )
    }

    renderUserHome = (data) => {
        const { navigate } = this.props.navigation;
        const { type, name, memberProjects } = data
        let doingProject = [];
        memberProjects.map((project) => {
            if (project.state === 1) doingProject.push(project)
        })
        switch (type) {
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
            case 1: return <View>
                <ImageBackground
                    styleName="large-ultra-wide"
                    source={{ uri: "https://i.loli.net/2019/03/22/5c948bca62fc7.jpg" }}
                >
                    <View style={{ position: 'absolute', top: 12, left: 12 }}>
                        <Text>{name}</Text>
                    </View>
                </ImageBackground>
                <View styleName="horizontal h-center" style={{ width: windowWidth - 48, height: 140, position: 'absolute', top: 42, left: 24 }}>
                    <Button
                        style={{ width: (windowWidth - 48) / 2, height: 140 }}
                        onPress={() => navigate('UserProjectList', {
                            page: 'UserHomeScreen',
                            projectList: doingProject
                        })}
                    >
                        <Text>{doingProject.length}</Text>
                        <Text>进行中</Text>
                    </Button>
                    <Button
                        style={{ width: (windowWidth - 48) / 2, height: 140 }}
                        onPress={() => navigate('UserProjectList', {
                            page: 'UserHomeScreen',
                            projectList: memberProjects
                        })}
                    >
                        <Text>{memberProjects.length}</Text>
                        <Text>全部</Text>
                    </Button>
                </View>
                <View style={{ marginTop: 60 }}>
                    <View><Text>最近项目</Text></View>
                    <View>
                        <ScrollView
                            horizontal={true}
                        >
                            {
                                memberProjects.map((project, index) => this.renderGridProjectCard(project, index))
                            }
                        </ScrollView>
                    </View>
                    <View><Text>个人中心</Text></View>
                    <View styleName="horizontal">
                        <Button
                            style={{ backgroundColor: "red", width: (windowWidth - 48) / 3, height: 140 }}
                            onPress={() => navigate('MyFavorite', {
                                page: 'UserHomeScreen',
                            })}
                        >
                            <Text>我的收藏</Text>
                        </Button>
                        <Button
                            style={{ backgroundColor: "blue", width: (windowWidth - 48) / 3, height: 140 }}
                            onPress={() => navigate('MyMessage', {
                                page: 'UserHomeScreen',
                                userType: type
                            })}
                        >
                            <Text>我的消息</Text>
                        </Button>
                        <Button
                            style={{ backgroundColor: "green", width: (windowWidth - 48) / 3, height: 140 }}
                            onPress={() => navigate('MyFollow', {
                                page: 'UserHomeScreen',
                            })}
                        >
                            <Text>我的关注</Text>
                        </Button>
                    </View>
                </View>
            </View>
            case 3: return <View>
                <ImageBackground
                    styleName="large-ultra-wide"
                    source={{ uri: "https://i.loli.net/2019/03/22/5c948bca62fc7.jpg" }}
                >
                    <View style={{ position: 'absolute', top: 12, left: 12 }}>
                        <Text>{name}</Text>
                    </View>
                </ImageBackground>
                <View styleName="horizontal h-center" style={{ width: windowWidth - 48, height: 140, position: 'absolute', top: 42, left: 24 }}>
                    <View style={{ backgroundColor: "red", width: (windowWidth - 48) / 3, height: 140 }}><Text>异常</Text></View>
                    <View style={{ backgroundColor: "blue", width: (windowWidth - 48) / 3, height: 140 }}><Text>进行中</Text></View>
                    <View style={{ backgroundColor: "green", width: (windowWidth - 48) / 3, height: 140 }}><Text>全部</Text></View>
                </View>
                <View style={{ marginTop: 60 }}>
                    <View><Text>最近项目</Text></View>
                    <View>
                        <ScrollView
                            horizontal={true}
                        >
                            {
                                memberProjects.map((project) => this.renderGridProjectCard(project))
                            }
                        </ScrollView>
                    </View>
                    <View><Text>个人中心</Text></View>
                    <GridRow columns={3}>
                        <View style={{ backgroundColor: "red", width: (windowWidth - 48) / 3, height: 140 }}><Text>我的收藏</Text></View>
                        <View style={{ backgroundColor: "blue", width: (windowWidth - 48) / 3, height: 140 }}><Text>我的信息</Text></View>
                        <View style={{ backgroundColor: "green", width: (windowWidth - 48) / 3, height: 140 }}><Text>我的关注</Text></View>
                    </GridRow>
                </View>
            </View>
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
                            this.renderUserHome(data.getUserInfo)
                        )
                    }}
                </Query>
            </Screen>
        );
    }
}
