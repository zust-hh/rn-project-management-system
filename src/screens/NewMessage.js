import React from "react";
import {
    Dimensions
} from 'react-native';
import { Row, Icon, ListView, Tile, GridRow, Divider, Screen, Button, View, TextInput, Text } from '@shoutem/ui';
import { Query, Mutation } from 'react-apollo';
import { findInArray, _subscribeToUpdateProjects, _subscribeToUpdateUsers } from './utils'

import gql from '../gql';
const windowWidth = Dimensions.get("window").width;

export default class NewMessage extends React.Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            sendUserList: [],
            article: ''
        }
    }

    addUser = (user) => {
        let sendUserList = this.state.sendUserList;
        sendUserList.push(user)
        this.setState({
            sendUserList,
            searchText: ''
        })
    }

    deleteUser = (index) => {
        let sendUserList = this.state.sendUserList;
        sendUserList.splice(index, 1);
        this.setState({
            sendUserList
        })
    }

    renderUserIcon = (user, index) => {
        return (
            <View styleName="horizontal" key={index} style={{ marginRight: 12, padding: 10, borderStyle: 'solid', borderWidth: 1, borderColor: 'grey', borderRadius: 5 }}>
                <Text>{user.name}</Text>
                <Icon
                    style={{ marginLeft: 8 }}
                    styleName="disclosure"
                    name="clear-text"
                    onPress={() => this.deleteUser(index)} />
            </View>
        )
    }

    renderUserList = (data) => {
        return (
            data.name !== 'Admin' ?
                <View styleName="horizontal v-center space-between" style={{ height: 50, width: windowWidth, backgroundColor: 'white', paddingLeft: 12, paddingRight: 12 }} >
                    {
                        data.length !== 0 ?
                            <Row styleName="small" style={{ width: windowWidth - 30, paddingRight: 16 }}>
                                <Text style={{ color: 'black' }}>{data.name}</Text>
                                <Text style={{ color: 'black' }}>{data.class}</Text>
                                <Icon
                                    styleName="disclosure"
                                    name="add-friend"
                                    onPress={() => this.addUser(data)} />
                            </Row> : null
                    }
                </View> : null
        )
    }

    render() {
        const { goBack, state } = this.props.navigation;
        const { searchText, sendUserList, article } = this.state;
        let userIdArr = [];
        if (sendUserList.length > 0) {
            sendUserList.map((user) => {
                userIdArr.push(user.id)
            })
        }

        return (
            <Screen style={{ marginTop: 32 }}>
                <Tile styleName="clear">
                    <Row styleName="small">
                        <Icon styleName="disclosure" name="left-arrow" onPress={() => goBack()} />
                        <TextInput
                            style={{ flex: 1 }}
                            placeholder={"搜索想要发送消息的人员"}
                            value={this.state.searchText}
                            onChangeText={value => this.setState({ searchText: value })}
                        />
                        <Mutation
                            mutation={gql.SENDMESSAGE_MUTATION}
                            variables={{
                                userIdArr,
                                article
                            }}
                            onCompleted={(data) => {
                                state.params.addMessage(data.sendMessage)
                                goBack()
                            }}
                        >
                            {mutation => {
                                return <Button onPress={mutation}>
                                    <Text>发送</Text>
                                </Button>
                            }}
                        </Mutation>
                    </Row>
                    <TextInput
                        style={{ width: windowWidth, height: 250 }}
                        placeholder={"输入想要发送的内容"}
                        value={this.state.article}
                        multiline={true}
                        textAlignVertical={'top'}
                        onChangeText={value => this.setState({ article: value })}
                    />
                    {
                        this.state.searchText ? <View style={{ height: 250, position: 'absolute', top: 65, width: windowWidth }}>
                            <Query
                                query={gql.SEARCHUSERLIST_QUERY}
                                variables={{ searchText }}
                            >
                                {({ loading, error, data }) => {
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
                                            renderRow={this.renderUserList}
                                        />
                                    )
                                }}
                            </Query>
                        </View> : null
                    }
                    <View styleName="horizontal" style={{ width: windowWidth, marginTop: 12, paddingLeft: 16 }}>
                        {
                            this.state.sendUserList.map((user, index) => this.renderUserIcon(user, index))
                        }
                    </View>
                </Tile>
            </Screen>
        );
    }
}
