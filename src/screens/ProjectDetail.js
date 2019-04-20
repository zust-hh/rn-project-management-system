import React from "react";
import {
    Picker
} from 'react-native'
import { Screen, View, TextInput, Button, ListView, Text, ImageBackground } from "@shoutem/ui";
import AsyncStorage from '@react-native-community/async-storage';
import { Query } from "react-apollo";

import gql from "../gql";
import { _subscribeToUpdateProjects } from './utils'

export default class ProjectDetail extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            editState: 0
        }
    }

    renderStepContent = (step) => {
        const stateColor = ['blue', 'yellow', 'green'];
        const stateText = ['未完成', '待审核', '已完成'];
        return (
            <View styleName="horizontal v-start">
                <Text>{step.finishTime.substr(0, 10)}</Text>
                <View style={{ width: 24, alignItems: 'center', marginLeft: 10 }}>
                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: stateColor[step.state - 1] }} />
                    {
                        step.endStep ? null : <View style={{ width: 1, height: 60, backgroundColor: 'blue' }} />
                    }
                </View>
                <View style={{ marginLeft: 10 }}>
                    {
                        this.state.editState ? <TextInput
                            defaultValue={step.name}
                        /> : <Text>{step.name}</Text>
                    }
                    <View styleName="horizontal space-between">
                        {
                            this.state.editState ? <View>
                                <Text>负责人：</Text>
                                <TextInput
                                    defaultValue={step.charge.name}
                                />
                            </View> : <Text>负责人：{step.charge.name}</Text>
                        }
                        {
                            this.state.editState ? <Picker
                                selectedValue={step.state}
                            // onValueChange={(itemValue, itemIndex) => this.setState({ language: itemValue })}\
                            >
                                <Picker.Item label="未完成" value="1" />
                                <Picker.Item label="待审核" value="2" />
                                <Picker.Item label="已完成" value="3" />
                            </Picker> <Text>{stateText[step.state - 1]}</Text>
                        }
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const { state } = this.props.navigation;
        const { id } = state.params;
        return (
            <Screen style={{ marginTop: 32 }}>
                <View>
                    <Query
                        query={gql.PROJECTDETAIL_QUERY}
                        variables={{ id }}
                    >
                        {({ loading, error, data, subscribeToMore }) => {
                            // _subscribeToUpdateProjects(subscribeToMore)
                            console.log(data);
                            if (loading) {
                                return (
                                    <Text>123</Text>
                                )
                            } else {
                                const { project } = data;
                                const { steps } = project;
                                steps[steps.length - 1].endStep = true;
                                return (
                                    <View>
                                        <ImageBackground
                                            styleName="large-ultra-wide"
                                            source={{ uri: "https://i.loli.net/2019/03/22/5c948bca62fc7.jpg" }}
                                        >
                                            <Text>{project.name}</Text>
                                        </ImageBackground>
                                        <ListView
                                            data={project.steps}
                                            renderRow={this.renderStepContent}
                                        />
                                    </View>
                                )
                            }
                        }}
                    </Query>
                </View>
                <Button style={{ height: 48, width: 48, borderRadius: 24, position: 'absolute', right: 48, bottom: 48 }}>
                    <Text>管理</Text>
                </Button>
            </Screen>
        );
    }
}
