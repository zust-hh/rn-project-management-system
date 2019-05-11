import React from "react";
import { Screen, View, Button, ListView, Text, NavigationBar, Title, Icon } from "@shoutem/ui";
import { Query } from "react-apollo";

import gql from "../gql";

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
        return (
            <View style={data.unreadState ? { backgroundColor: "red" } : null}>
                <View styleName="horizontal space-between">
                    <Text>{data.addBy.name}</Text>
                    <Text>{data.createdAt}</Text>
                </View>
                <Text>{data.article}</Text>
            </View>
        )
    }

    render() {
        const { navigate, state, goBack } = this.props.navigation;
        return (
            <Screen style={{ marginTop: 32 }}>
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
                                    loading={loading}
                                    data={loading ? [] : data.getUserInfo.message}
                                    renderRow={this.renderMessageCard}
                                />
                                <ListView
                                    loading={loading}
                                    data={loading ? [] : data.getUserInfo.unreadMessage}
                                    renderRow={this.renderMessageCard}
                                />
                                <ListView
                                    loading={loading}
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
