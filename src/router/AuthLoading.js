import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import { AppRouter } from './AppRouter';

class AuthLoadingScreen  extends React.Component {
  constructor(props) {
    super(props);
    // this.authAsync();
  }

  componentDidMount() {
    this.props.navigation.navigate('AppRouter');
  }

  authAsync = async () => {
    // const userToken = await AsyncStorage.getItem('userToken');
    // this.props.navigation.navigate(userToken ? 'AppRouter' : 'AuthRouter');
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
      AppRouter: AppRouter
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);