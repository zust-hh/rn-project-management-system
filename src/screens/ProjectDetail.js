import React from "react";
import {
    Picker
} from 'react-native'
import { Screen, View, TextInput, Button, ListView, Text, ImageBackground, NavigationBar, Title, Image } from "@shoutem/ui";
import AsyncStorage from '@react-native-community/async-storage';
import { Query, Mutation } from "react-apollo";

import gql from "../gql";
import { _subscribeToUpdateProjects } from './utils'

const completeImg = require('../static/complete.png');
const uncompleteImg = require('../static/uncomplete.png');
const pendingImg = require('../static/pending.png');
const stateArr = [uncompleteImg, pendingImg, completeImg]

export default class ProjectDetail extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            editState: false,
            stepsArr: {},
            formatStepsArr: []
        }
    }

    render() {
        const { state } = this.props.navigation;
        const { id } = state.params;
        const { editState } = this.state;
        const stateColor = ['blue', 'yellow', 'green'];
        const stateText = ['未完成', '待审核', '已完成'];
        return (
            <Screen style={{ marginTop: 32, backgroundColor: 'white' }}>
                <View>
                    <NavigationBar
                        centerComponent={<Title>项目管理</Title>}
                        rightComponent={
                            this.state.editState ? <Mutation
                                mutation={gql.UPDATESTEPS_MUTATION}
                                variables={{ steps: this.state.formatStepsArr }}
                                onCompleted={() => this.setState({ editState: false })}
                            >
                                {mutation => (
                                    <Button
                                        onPress={mutation}
                                    >
                                        <Text>完成</Text>
                                    </Button>
                                )}
                            </Mutation> :
                                <Button onPress={() => {
                                    this.setState({
                                        editState: !this.state.editState
                                    })
                                }}>
                                    <Text>管理</Text>
                                </Button>
                        }
                        styleName="inline"
                    />
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
                                    this.setState({
                                        formatStepsArr
                                    })
                                });
                                return (
                                    <View>
                                        <ImageBackground
                                            styleName="large-ultra-wide"
                                            style={{ marginBottom: 14 }}
                                            source={{ uri: "https://i.loli.net/2019/03/22/5c948bca62fc7.jpg" }}
                                        >
                                            <Text style={{ color: 'white', fontSize: 20 }}>{project.name}</Text>
                                        </ImageBackground>
                                        {
                                            steps.map((step, index) => {
                                                const stepState = stateText[step.state - 1]
                                                return (
                                                    <View styleName="horizontal v-start" key={step.name} style={{ paddingLeft: 16 }}>
                                                        <View styleName="vertical h-center" style={{ width: 80 }}>
                                                            <Text style={{ fontSize: 18 }}>{step.finishTime.substr(5, 5)}</Text>
                                                            <Text style={{ fontSize: 12 }}>{step.finishTime.substr(0, 4)}</Text>
                                                        </View>
                                                        <View styleName="vertical h-center" style={{ width: 24, marginLeft: 10 }}>
                                                            <Image
                                                                style={{ height: 24, width: 24 }}
                                                                source={stateArr[step.state - 1]}
                                                            />
                                                            {
                                                                step.endStep ? null : <View style={{ width: 2, height: 80, backgroundColor: 'rgb(128, 216, 255)' }} />
                                                            }
                                                        </View>
                                                        <View styleName="horizontal" style={{ marginLeft: 10, width: 280 }}>
                                                            <View>
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
                                                                        style={{ width: 160, borderColor: '#cfd8dc', borderStyle: 'solid', borderWidth: 1, height: 40, padding: 4 }}
                                                                    /> : <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{step.name}</Text>
                                                                }
                                                                <View styleName="horizontal" style={{ marginTop: 8 }}>
                                                                    {
                                                                        editState ? <View styleName="horizontal">
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
                                                                                style={{ width: 80, borderColor: '#cfd8dc', borderStyle: 'solid', borderWidth: 1, height: 40, padding: 4 }}
                                                                            />
                                                                        </View> : <Text style={{ fontSize: 12, backgroundColor: '#eceff1', padding: 4, borderRadius: 20, color: 'grey' }}>{step.charge.name}</Text>
                                                                    }
                                                                    {
                                                                        !editState && step.state === 2 ? <Text style={{ fontSize: 12, backgroundColor: '#ff9100', padding: 4, borderRadius: 20, color: 'white', marginLeft: 12 }}>已汇报2次</Text> : null
                                                                    }
                                                                    {
                                                                        !editState && step.state === 3 ? <Text style={{ fontSize: 12, backgroundColor: '#dd2c00', padding: 4, borderRadius: 20, color: 'white', marginLeft: 12 }}>超时两天</Text> : null
                                                                    }
                                                                </View>
                                                            </View>
                                                            <View style={{ position: 'absolute', right: editState ? 0 : 20, top: editState ? 35 : 15 }}>
                                                                {
                                                                    editState ? <Picker
                                                                        style={{ height: 50, width: 130  }}
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
                                                                    </Picker> : <Text style={{ borderColor: '#cfd8dc', borderStyle: 'solid', borderWidth: 1, borderRadius: 20, padding: 4, lineHeight: 18 }}>{stepsArr[step.id] && stepsArr[step.id].state ? stateText[stepsArr[step.id].state - 1] : stepState}</Text>
                                                                }
                                                            </View>
                                                        </View>
                                                    </View>
                                                )
                                            })
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
