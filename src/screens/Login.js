import React from "react";
import { Text } from "react-native";
import { Screen, View, TextInput } from '@shoutem/ui';
import { Query } from 'react-apollo';

import gql from '../gql';
export default class Login extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      filters: [
        { name: '全部', value: '全部' },
        { name: '我的', value: '我的' },
      ],
    }
  }

  render() {
    return (
      <Screen style={{ marginTop: 32 }} >
        <View>
          
        </View>
      </Screen>
    );
  }
}