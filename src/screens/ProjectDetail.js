import React from "react";
import {
    Picker
} from 'react-native'
import { Screen, View, TextInput, Button, ListView, Text, ImageBackground } from "@shoutem/ui";
import AsyncStorage from '@react-native-community/async-storage';
import { Query, Mutation } from "react-apollo";

import gql from "../gql";
import { _subscribeToUpdateProjects } from './utils'

export default class ProjectDetail extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            editState: false,
            stepsArr: {},
        }
    }

    renderStepContent = (step, editState) => {
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
                        editState ? <TextInput
                            defaultValue={step.name}
                        /> : <Text>{step.name}</Text>
                    }
                    <View styleName="horizontal space-between">
                        {
                            editState ? <View>
                                <Text>负责人：</Text>
                                <TextInput
                                    defaultValue={step.charge.name}
                                />
                            </View> : <Text>负责人：{step.charge.name}</Text>
                        }
                        {
                            editState ? <Picker
                                selectedValue={step.state}
                            // onValueChange={(itemValue, itemIndex) => this.setState({ language: itemValue })}\
                            >
                                <Picker.Item label="未完成" value="1" />
                                <Picker.Item label="待审核" value="2" />
                                <Picker.Item label="已完成" value="3" />
                            </Picker> : <Text>{stateText[step.state - 1]}</Text>
                        }
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const { state } = this.props.navigation;
        const { id } = state.params;
        const { editState } = this.state;
        const stateColor = ['blue', 'yellow', 'green'];
        const stateText = ['未完成', '待审核', '已完成'];
        return (
            <Screen style={{ marginTop: 32 }}>
                <View>
                    <Query
                        query={gql.PROJECTDETAIL_QUERY}
                        variables={{ id }}
                    >
                        {({ loading, error, data, subscribeToMore }) => {
                            // _subscribeToUpdateProjects(subscribeToMore)
                            if (loading) {
                                return (
                                    <Text>123</Text>
                                )
                            } else {
                                const { project } = data;
                                const { steps } = project;
                                steps[steps.length - 1].endStep = true;
                                const formatStepsArr = [];
                                const { stepsArr } = this.state;
                                Object.keys(stepsArr).forEach(async (key) => {
                                    let stepDate = {
                                        id: key
                                    };
                                    if (stepsArr[key].name) {
                                        stepDate.name = stepsArr[key].name
                                    }
                                    if (stepsArr[key].chargeId) {
                                        stepDate.chargeId = stepsArr[key].chargeId
                                    }
                                    if (stepsArr[key].state) {
                                        stepDate.state = stepsArr[key].state
                                    }
                                    formatStepsArr.push(JSON.stringify(stepDate))
                                });
                                return (
                                    <View>
                                        <ImageBackground
                                            styleName="large-ultra-wide"
                                            source={{ uri: "https://i.loli.net/2019/03/22/5c948bca62fc7.jpg" }}
                                        >
                                            <Text>{project.name}</Text>
                                        </ImageBackground>
                                        {
                                            steps.map((step, index) => {
                                                const stepState = stateText[step.state - 1]
                                                return (
                                                    <View styleName="horizontal v-start" key={index}>
                                                        <Text>{step.finishTime.substr(0, 10)}</Text>
                                                        <View style={{ width: 24, alignItems: 'center', marginLeft: 10 }}>
                                                            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: stateColor[step.state - 1] }} />
                                                            {
                                                                step.endStep ? null : <View style={{ width: 1, height: 60, backgroundColor: 'blue' }} />
                                                            }
                                                        </View>
                                                        <View style={{ marginLeft: 10 }}>
                                                            {
                                                                editState ? <TextInput
                                                                    defaultValue={step.name}
                                                                    onChangeText={value => {
                                                                        const stepsArr = this.state.stepsArr;
                                                                        if (!stepsArr[step.id]) {
                                                                            stepsArr[step.id] = {}
                                                                        }
                                                                        stepsArr[step.id].name = value;
                                                                        this.setState({ stepsArr })
                                                                    }}
                                                                /> : <Text>{step.name}</Text>
                                                            }
                                                            <View styleName="horizontal space-between">
                                                                {
                                                                    editState ? <View styleName="horizontal">
                                                                        <Text>负责人：</Text>
                                                                        <TextInput
                                                                            defaultValue={step.charge.name}
                                                                            onChangeText={value => {
                                                                                const stepsArr = this.state.stepsArr;
                                                                                if (!stepsArr[step.id]) {
                                                                                    stepsArr[step.id] = {}
                                                                                }
                                                                                stepsArr[step.id].chargeId = value;
                                                                                this.setState({ stepsArr })
                                                                            }}
                                                                        />
                                                                    </View> : <Text>负责人：{step.charge.name}</Text>
                                                                }
                                                                {
                                                                    editState ? <Picker
                                                                        style={{ height: 50, width: 150 }}
                                                                        selectedValue={stepsArr[step.id] && stepsArr[step.id].state ? stateText[stepsArr[step.id].state - 1] : stepState}
                                                                        onValueChange={(itemValue, itemIndex) => {
                                                                            const stepsArr = this.state.stepsArr;
                                                                            if (!stepsArr[step.id]) {
                                                                                stepsArr[step.id] = {}
                                                                            }
                                                                            stepsArr[step.id].state = itemIndex + 1;
                                                                            this.setState({ stepsArr })
                                                                        }}
                                                                    >
                                                                        <Picker.Item label="未完成" value="未完成" />
                                                                        <Picker.Item label="待审核" value="待审核" />
                                                                        <Picker.Item label="已完成" value="已完成" />
                                                                    </Picker> : <Text>{stepsArr[step.id] && stepsArr[step.id].state ? stateText[stepsArr[step.id].state - 1] : stepState}</Text>
                                                                }
                                                            </View>
                                                        </View>
                                                    </View>
                                                )
                                            })
                                        }
                                        {
                                            this.state.editState ? <Mutation
                                                mutation={gql.UPDATESTEPS_MUTATION}
                                                variables={{ steps: formatStepsArr }}
                                                onCompleted={() => this.setState({ editState: false })}
                                            >
                                                {mutation => (
                                                    <Button
                                                        style={{ height: 48, width: 48, borderRadius: 24, position: 'absolute', right: 48, bottom: 48 }}
                                                        onPress={mutation}
                                                    >
                                                        <Text>完成</Text>
                                                    </Button>
                                                )}
                                            </Mutation> : <Button
                                                style={{ height: 48, width: 48, borderRadius: 24, position: 'absolute', right: 48, bottom: 48 }}
                                                onPress={() => {
                                                    this.setState({
                                                        editState: !this.state.editState
                                                    })
                                                }}
                                            >
                                                    <Text>管理</Text>
                                                </Button>
                                        }
                                    </View>
                                )
                            }
                        }}
                    </Query>
                </View>
            </Screen>
        );
    }
}
