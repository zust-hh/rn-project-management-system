import React from "react";
import { Screen, View, Button, ListView, Text, NavigationBar, Title, Icon, Image } from "@shoutem/ui";
import { Query } from "react-apollo";
import LinearGradient from 'react-native-linear-gradient';

import gql from "../gql";

const message1 = require('../static/message1.png');
const message2 = require('../static/message2.png');

export default class MyMessage extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            addMessageList: []
        }
    }

    addMessage = (data) => {
        let addMessageList = this.state.addMessageList;
        addMessageList.push(data)
        this.setState({
            addMessageList
        })
    }

    renderMessageCard = (data) => {
        const random = Math.round(Math.random());
        return (
            <View style={{ height: 80, padding: 12 }} styleName="horizontal v-start">
                {
                    random ? <LinearGradient colors={['#FF9800', '#EF6C00']} style={{ height: 56, width: 56, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            style={{ height: 30, width: 30 }}
                            source={message1}
                        />
                        {
                            data.unreadState ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "red", position: 'absolute', top: 5, right: 5 }}></View> : null
                        }
                    </LinearGradient> : <LinearGradient colors={['#B2DFDB', '#4DB6AC']} style={{ height: 56, width: 56, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                style={{ height: 24, width: 24 }}
                                source={message2}
                            />
                            {
                                data.unreadState ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "red", position: 'absolute', top: 5, right: 5 }}></View> : null
                            }
                        </LinearGradient>
                }
                <View>
                    <View styleName="horizontal" style={{ width: 320, marginLeft: 12 }}>
                        <Text style={{ fontSize: 18, color: 'black' }}>{data.addBy.name}</Text>
                        <Text style={{ position: 'absolute', right: 0, fontSize: 12 }}>{data.createdAt.substr(0, 10)}</Text>
                    </View>
                    <Text style={{ fontSize: 12, marginLeft: 12, marginTop: 10 }}>{data.article}</Text>
                </View>
            </View>
        )
    }

    render() {
        const { navigate, state, goBack } = this.props.navigation;
        return (
            <Screen style={{ marginTop: 32, backgroundColor: 'white' }}>
                <NavigationBar
                    leftComponent={(
                        <Icon styleName="disclosure" name="back" onPress={() => goBack()} />
                    )}
                    centerComponent={
                        <Title>
                            我的信息
                        </Title>
                    }
                    rightComponent={
                        <View styleName="horizontal">
                            <Button>
                                <Text>全部已读</Text>
                            </Button>
                            {
                                state.params.userType === 1 && <Button
                                    onPress={() => navigate('NewMessage', {
                                        page: 'MyMessageScreen',
                                        addMessage: this.addMessage
                                    })}
                                >
                                    <Text>新建</Text>
                                </Button>
                            }
                        </View>
                    }
                    styleName="inline"
                />
                <Query
                    query={gql.USERMESSAGE_QUERY}
                >
                    {({ loading, error, data }) => {
                        if (data && data.getUserInfo) {
                            const { unreadMessage } = data.getUserInfo;
                            unreadMessage.map((message) => {
                                message.unreadState = true;
                            })
                        } else {
                            data.getUserInfo = {};
                            data.getUserInfo.message = [];
                            data.getUserInfo.unreadMessage = [];
                            data.getUserInfo.readMessage = [];
                        }
                        return (
                            <View>
                                {
                                    this.state.addMessageList.length > 0 ? <ListView
                                        data={this.state.addMessageList}
                                        renderRow={this.renderMessageCard}
                                    /> : null
                                }
                                <ListView
                                    data={loading ? [] : data.getUserInfo.message}
                                    renderRow={this.renderMessageCard}
                                />
                                <ListView
                                    data={loading ? [] : data.getUserInfo.unreadMessage}
                                    renderRow={this.renderMessageCard}
                                />
                                <ListView
                                    data={loading ? [] : data.getUserInfo.readMessage}
                                    renderRow={this.renderMessageCard}
                                />
                            </View>
                        )
                    }}
                </Query>
            </Screen>
        );
    }
}
