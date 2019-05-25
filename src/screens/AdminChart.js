import React from "react";
import { processColor } from 'react-native';
import { Screen, View, ListView } from "@shoutem/ui";
import { Query } from "react-apollo";
import UserCard from '../components/UserCard';
import { PieChart, BarChart } from 'react-native-charts-wrapper';

import gql from "../gql";
export default class AdminChart extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            legend: [{
                enabled: true,
                textSize: 15,
                form: 'CIRCLE',
                horizontalAlignment: "RIGHT",
                verticalAlignment: "CENTER",
                orientation: "VERTICAL",
                wordWrapEnabled: true
            }, {
                enabled: true,
                textSize: 14,
                form: "SQUARE",
                formSize: 14,
                xEntrySpace: 10,
                yEntrySpace: 5,
                wordWrapEnabled: true
            }],
            data: [{
                dataSets: [{
                    values: [{ value: 3, label: '信息学院' },
                    { value: 1, label: '经管学院' },
                    { value: 1, label: '理学院' },
                    { value: 1, label: '机械学院' }],
                    label: '学院示意',
                    config: {
                        colors: [processColor('#C0FF8C'), processColor('#FFF78C'), processColor('#FFD08C'), processColor('#8CEAFF'), processColor('#FF8C9D')],
                        valueTextSize: 20,
                        valueTextColor: processColor('green'),
                        sliceSpace: 5,
                        selectionShift: 13,
                        valueFormatter: "#.#'%'",
                        valueLineColor: processColor('green'),
                        valueLinePart1Length: 0.5
                    }
                }],
            }, {
                dataSets: [{
                    values: [{ y: [2, 1] }, { y: [1] }, { y: [1] }, { y: [1] }],
                    label: '状态示意',
                    config: {
                        colors: [processColor('#C0FF8C'), processColor('#FFF78C')],
                        stackLabels: ['已完成', '进行中', '异常']
                    }
                }],
            }, {
                
            }
            ],
            xAxis: {
                valueFormatter: ['信息学院', '经管学院', '理学院', '机械学院'],
                granularityEnabled: true,
                granularity: 1
            }
        };
    }

    handleSelect(event) {
        let entry = event.nativeEvent
        if (entry == null) {
            this.setState({ ...this.state, selectedEntry: null })
        } else {
            this.setState({ ...this.state, selectedEntry: JSON.stringify(entry) })
        }
        console.log(event.nativeEvent)
    }

    renderChart = (type) => {
        switch (type) {
            case 0: return <PieChart
                style={{ flex: 1 }}
                logEnabled={true}
                data={this.state.data[type]}
                legend={this.state.legend[type]}
                entryLabelTextSize={20}
                drawEntryLabels={true}
                rotationEnabled={true}
                rotationAngle={45}
                usePercentValues={true}
                styledCenterText={{ text: '学院项目分布', color: processColor('pink'), size: 20 }}
                centerTextRadiusPercent={100}
                holeRadius={40}
                holeColor={processColor('#f0f0f0')}
                transparentCircleRadius={45}
                transparentCircleColor={processColor('#f0f0f088')}
                maxAngle={350}
                onSelect={this.handleSelect.bind(this)}
                onChange={(event) => console.log(event.nativeEvent)}
            />
            case 1: return <BarChart
                style={{ height: 700 }}
                xAxis={this.state.xAxis}
                data={this.state.data[type]}
                drawValueAboveBar={false}
                marker={{
                    enabled: true,
                    markerColor: processColor('#F0C0FF8C'),
                    textColor: processColor('white'),
                    markerFontSize: 14,
                }}
                onChange={(event) => console.log(event.nativeEvent)}
            />
        }
    }

    render() {
        const { type } = this.props.navigation.state.params;
        return (
            <Screen style={{ paddingTop: 50 }} >
                {
                    this.renderChart(type)
                }
            </Screen>
        );
    }
}
