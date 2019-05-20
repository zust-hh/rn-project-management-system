import React from "react";
import { Text, Dimensions } from "react-native";
import { Screen, View, TextInput, Button, ImageBackground } from "@shoutem/ui";
import AsyncStorage from '@react-native-community/async-storage';
import { Mutation } from "react-apollo";

import gql from "../gql";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const backgroundImg = require('../static/login.jpg');

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
    const { navigate, state, goBack } = this.props.navigation;
    const { token, user } = data.login;
    this._saveUserData(token, user.type);
    if (state && state.params && state.params.callBack) {
      state.params.callBack(user.type, user.id);
      goBack();
    } else {
      navigate('ProjectList');
    }
  }

  _saveUserData = async (token, userType) => {
    await AsyncStorage.setItem('auth-token', token);
    await AsyncStorage.setItem('user-type', userType);
  }

  render() {
    const { idNumber, password } = this.state;
    return (
      <Screen style={{ marginTop: 32 }}>
        <ImageBackground
          style={{ width: windowWidth, height: windowHeight + 20 }}
          source={backgroundImg}
        >
          <View style={{ position: 'absolute', top: 300, left: 65 }}>
            <TextInput
              placeholder={"学号/工号"}
              onChangeText={value => {
                this.setState({ idNumber: value })
              }}
              style={{ width: 300, backgroundColor: 'rgba(0,0,0,0)', color: 'white', borderBottomStyle: 'solid', borderBottomWidth: 1, borderBottomColor: 'white' }}
            />
            <TextInput
              placeholder={"密码"}
              secureTextEntry
              onChangeText={value => this.setState({ password: value })}
              style={{ width: 300, backgroundColor: 'rgba(0,0,0,0)', color: 'white', borderBottomStyle: 'solid', borderBottomWidth: 1, borderBottomColor: 'white', marginTop: 20 }}
            />
            <Mutation
              mutation={gql.LOGIN_MUTATION}
              variables={{ idNumber, password }}
              onCompleted={data => this._confirm(data)}
            >
              {mutation => (
                <Button
                  onPress={mutation}
                  style={{ backgroundColor: 'white', borderRadius: 20, height: 40, width: 300, marginTop: 20 }}
                >
                  <Text>登录</Text>
                </Button>
              )}
            </Mutation>
          </View>
        </ImageBackground>
      </Screen>
    );
  }
}
