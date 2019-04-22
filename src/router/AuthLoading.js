import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import { AppRouter } from './AppRouter';

class AuthLoadingScreen  extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.navigation.navigate('AppRouter');
  }

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