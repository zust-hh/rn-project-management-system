import React from "react";
import { createAppContainer, createBottomTabNavigator } from "react-navigation";

import {
  ProjectListScreen,
  SearchScreen,
  FavoritesScreen,
  UserHomeScreen
} from "../screens";

import { Icon, TabBar } from '../components';

const TabNavigator = createBottomTabNavigator({
  ProjectListScreen: {
    screen: ProjectListScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name="home" color={tintColor} />
    }
  },
  SearchScreen: {
    screen: SearchScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name="search" color={tintColor} />
    }
  },
  FavoritesScreen: {
    screen: FavoritesScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name="favorites" color={tintColor} />
    }
  },
  UserHomeScreen: {
    screen: UserHomeScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name="profile" color={tintColor} />
    }
  }
},
  {
    tabBarComponent: TabBar,
    tabBarOptions: {
      activeTintColor: "#eeeeee",
      inactiveTintColor: "#222222"
    }
  }
);

export default createAppContainer(TabNavigator);