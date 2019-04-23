import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';

import { AppRouter } from './AppRouter';
import Login from '../screens/Login';

class AuthLoadingScreen  extends React.Component {
  constructor(props) {
    super(props);
    this.authAsync();
  }

  authAsync = async () => {
    const userToken = await AsyncStorage.getItem('auth-token');
    this.props.navigation.navigate(userToken ? 'AppRouter' : 'Login');
  };

  render() {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }
}

export const AuthLoadingRouter = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      AppRouter: AppRouter,
      Login: Login
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);