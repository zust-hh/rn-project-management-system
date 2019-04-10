import React from "react";
import { Text } from "react-native";
import { Screen, View, TextInput, Button } from "@shoutem/ui";
import AsyncStorage from '@react-native-community/async-storage';
import { Mutation } from "react-apollo";

import gql from "../gql";
export default class Login extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      idNumber: "",
      password: ""
    };
  }

  _confirm = async data => {
    const { token } = data.login;
    this._saveUserData(token);
    this.props.navigation.navigate('UserHomeScreen');
  }

  _saveUserData = async token => {
    await AsyncStorage.setItem('auth-token', token);
  }

  render() {
    const { idNumber, password } = this.state;
    return (
      <Screen style={{ marginTop: 32 }}>
        <View>
          <TextInput
            placeholder={"学号/工号"}
            onChangeText={value => {
              this.setState({ idNumber: value })
            }}
          />
          <TextInput
            placeholder={"密码"}
            secureTextEntry
            onChangeText={value => this.setState({ password: value })}
          />
          <Mutation
            mutation={gql.LOGIN_MUTATION}
            variables={{ idNumber, password }}
            onCompleted={data => this._confirm(data)}
          >
            {mutation => (
              <Button
                onPress={mutation}
              >
                <Text>登录</Text>
              </Button>
            )}
          </Mutation>

        </View>
      </Screen>
    );
  }
}
