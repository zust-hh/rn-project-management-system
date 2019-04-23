import React from "react";
import { Screen, View, TextInput, Button, ListView, Text } from "@shoutem/ui";
import { Query } from "react-apollo";
import ProjectCard from '../components/ProjectCard';

import gql from "../gql";
export default class UserProjectList extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { navigate, state } = this.props.navigation;
        const { projectList } = state.params;
        return (
            <Screen style={{ marginTop: 32 }}>
                <ListView
                    data={projectList}
                    renderRow={ProjectCard}
                />
            </Screen>
        );
    }
}
