import React from "react";
import {
    Dimensions,
    ScrollView
} from "react-native";
import { NavigationBar, Title, ImageBackground, Screen, Button, View, Text, Row, TouchableOpacity, GridRow, Image } from '@shoutem/ui';
import { SwitchNavigator } from 'react-navigation';
import Login from './Login';
import { Query } from 'react-apollo';
import gql from '../gql';

const windowWidth = Dimensions.get("window").width;
const chart1 = require('../static/chart1.png');
const chart2 = require('../static/chart2.png');
const chart3 = require('../static/chart3.png');
const userFavorite = require('../static/favorite-user.png');
const userFollow = require('../static/follow-user.png');
const userMessage = require('../static/message-user.png');
const project3Image = require('../static/project3.jpg')

export default class UserHome extends React.Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            userType: 0,
            userId: null
        }
    }

    renderGridProjectCard = (data, index) => {
        const { navigate } = this.props.navigation;
        const { name, steps, id } = data;
        const stepsLength = steps.length
        let completNum = 0;
        steps.map((step) => {
            if (step.state === 3) {
                completNum++
            }
        })

        return (
            <TouchableOpacity
                style={{ width: 120, height: 110, paddingLeft: 12 }}
                key={index}
                onPress={() => navigate('ProjectDetail', {
                    page: 'UserHomeScreen',
                    id
                })}
            >
                <ImageBackground
                    style={{ width: 108, height: 70 }}
                    source={index == 0 ? project3Image : { uri: "https://i.loli.net/2019/03/22/5c948bca62fc7.jpg" }}
                >
                    <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: 5 }}>
                        <Text style={{ color: 'white', fontSize: 10 }}>已完成{completNum / stepsLength * 100}%</Text>
                    </View>
                </ImageBackground>
                <Text style={{ width: 120, color: 'black', marginTop: 6, fontSize: 12 }} numberOfLines={1} ellipsizeMode='tail'>{name}</Text>
            </TouchableOpacity>
        )
    }

    renderUserHome = (data) => {
        const { navigate } = this.props.navigation;
        const { type, name, memberProjects } = data
        let doingProject = [];
        let abnormalProject = [];
        memberProjects.map((project) => {
            if (project.state === 1) doingProject.push(project)
            if (project.state === 2) abnormalProject.push(project)
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
                    style={{ width: windowWidth, height: 90 }}
                    source={{ uri: "https://i.loli.net/2019/03/22/5c948bca62fc7.jpg" }}
                >
                    <View style={{ position: 'absolute', top: 12, left: 12 }}>
                        <Text style={{ color: 'white' }}>{name}</Text>
                    </View>
                </ImageBackground>
                <View styleName="horizontal v-center" style={{ width: windowWidth - 48, height: 100, position: 'absolute', top: 42, left: 24, backgroundColor: 'white', borderRadius: 10, elevation: 10, }}>
                    <TouchableOpacity
                        styleName="vertical h-center v-center"
                        style={{ width: (windowWidth - 48) / 2 - 1, height: 100, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => navigate('UserProjectList', {
                            page: 'UserHomeScreen',
                            projectList: doingProject
                        })}
                    >
                        <Text style={{ fontSize: 20 }}>{doingProject.length}</Text>
                        <Text>进行中</Text>
                    </TouchableOpacity>
                    <View style={{ width: 2, height: 40, backgroundColor: 'rgb(210, 210, 210)' }}></View>
                    <TouchableOpacity
                        style={{ width: (windowWidth - 48) / 2, height: 100, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => navigate('UserProjectList', {
                            page: 'UserHomeScreen',
                            projectList: memberProjects
                        })}
                    >
                        <Text style={{ fontSize: 20 }}>{memberProjects.length}</Text>
                        <Text>全部</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ paddingTop: 70, backgroundColor: 'white', paddingLeft: 12, paddingRight: 12 }}>
                    <View style={{ marginBottom: 8 }} ><Text style={{ color: 'black', fontSize: 16 }}>最近项目</Text></View>
                    <View>
                        <ScrollView
                            horizontal={true}
                        >
                            {
                                memberProjects.map((project, index) => this.renderGridProjectCard(project, index))
                            }
                        </ScrollView>
                    </View>
                </View>
                <View style={{ marginTop: 18, backgroundColor: 'white', padding: 12, height: 240 }}>
                    <View style={{ marginBottom: 8 }} ><Text style={{ color: 'black', fontSize: 16 }}>个人中心</Text></View>
                    <View styleName="horizontal">
                        <TouchableOpacity
                            style={{ width: (windowWidth - 48) / 3, height: 90, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => navigate('MyFavorite', {
                                page: 'UserHomeScreen',
                            })}
                        >
                            <Image
                                style={{ height: 24, width: 24 }}
                                source={userFavorite}
                            />
                            <Text style={{ color: 'black', marginTop: 6, fontSize: 12 }}>我的收藏</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ width: (windowWidth - 48) / 3, height: 90, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => navigate('MyFollow', {
                                page: 'UserHomeScreen',
                            })}
                        >
                            <Image
                                style={{ height: 24, width: 24 }}
                                source={userFollow}
                            />
                            <Text style={{ color: 'black', marginTop: 6, fontSize: 12 }}>我的关注</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ width: (windowWidth - 48) / 3, height: 90, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => navigate('MyMessage', {
                                page: 'UserHomeScreen',
                                userType: type
                            })}
                        >
                            <Image
                                style={{ height: 24, width: 24 }}
                                source={userMessage}
                            />
                            <Text style={{ color: 'black', marginTop: 6, fontSize: 12 }}>我的消息</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            case 3: return <View>
                <ImageBackground
                    style={{ width: windowWidth, height: 90 }}
                    source={{ uri: "https://i.loli.net/2019/03/22/5c948bca62fc7.jpg" }}
                >
                    <View style={{ position: 'absolute', top: 12, left: 12 }}>
                        <Text style={{ color: 'white' }}>{name}</Text>
                    </View>
                </ImageBackground>
                <View styleName="horizontal v-center" style={{ width: windowWidth - 48, height: 100, position: 'absolute', top: 42, left: 24, backgroundColor: 'white', borderRadius: 10, elevation: 10, }}>
                    <TouchableOpacity
                        styleName="vertical h-center v-center"
                        style={{ width: (windowWidth - 48) / 3 - 2, height: 100, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => navigate('UserProjectList', {
                            page: 'UserHomeScreen',
                            projectList: abnormalProject
                        })}
                    >
                        <Text style={{ fontSize: 20 }}>{abnormalProject.length}</Text>
                        <Text>异常</Text>
                    </TouchableOpacity>
                    <View style={{ width: 2, height: 40, backgroundColor: 'rgb(210, 210, 210)' }}></View>
                    <TouchableOpacity
                        styleName="vertical h-center v-center"
                        style={{ width: (windowWidth - 48) / 3 - 2, height: 100, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => navigate('UserProjectList', {
                            page: 'UserHomeScreen',
                            projectList: doingProject
                        })}
                    >
                        <Text style={{ fontSize: 20 }}>{doingProject.length}</Text>
                        <Text>进行中</Text>
                    </TouchableOpacity>
                    <View style={{ width: 2, height: 40, backgroundColor: 'rgb(210, 210, 210)' }}></View>
                    <TouchableOpacity
                        style={{ width: (windowWidth - 48) / 3, height: 100, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => navigate('UserProjectList', {
                            page: 'UserHomeScreen',
                            projectList: memberProjects
                        })}
                    >
                        <Text style={{ fontSize: 20 }}>{memberProjects.length}</Text>
                        <Text>全部</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ paddingTop: 70, backgroundColor: 'white', paddingLeft: 12, paddingRight: 12, height: 240 }}>
                    <View style={{ marginBottom: 8 }} ><Text style={{ color: 'black', fontSize: 16 }}>图表中心</Text></View>
                    <View styleName="horizontal">
                        <TouchableOpacity
                            style={{ width: (windowWidth - 48) / 3, height: 90, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => {
                                navigate('AdminChart', {
                                    type: 0
                                })
                            }}
                        >
                            <Image
                                style={{ height: 24, width: 24 }}
                                source={chart1}
                            />
                            <Text style={{ color: 'black', marginTop: 6, fontSize: 12 }}>学院项目表</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ width: (windowWidth - 48) / 3, height: 90, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => {
                                navigate('AdminChart', {
                                    type: 1
                                })
                            }}
                        >
                            <Image
                                style={{ height: 24, width: 24 }}
                                source={chart2}
                            />
                            <Text style={{ color: 'black', marginTop: 6, fontSize: 12 }}>项目状态占比图</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ width: (windowWidth - 48) / 3, height: 90, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => {
                                navigate('AdminChart', {
                                    type: 2
                                })
                            }}
                        >
                            <Image
                                style={{ height: 24, width: 24 }}
                                source={chart3}
                            />
                            <Text style={{ color: 'black', marginTop: 6, fontSize: 12 }}>项目参与数前十</Text>
                        </TouchableOpacity>
                    </View>
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
                    rightComponent={
                        <Button onPress={() => this.props.navigation.navigate('Login', {
                            callBack: (userType, userId) => {
                                this.setState({
                                    userType,
                                    userId
                                });
                            }
                        })}>
                            <Text>登出</Text>
                        </Button>
                    }
                    styleName="inline"
                />
                <Query
                    query={gql.USERINFO_QUERY}
                    variables={{ userId: this.state.userId }}
                >
                    {({ loading, error, data }) => {
                        if (loading) {
                            return (
                                <Text></Text>
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
