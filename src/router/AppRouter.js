import React from "react";
import { createBottomTabNavigator, createStackNavigator } from "react-navigation";
import ProjectList from '../screens/ProjectList';
import UserHome from '../screens/UserHome';
import Login from '../screens/Login';
import Search from '../screens/Search';
import SearchList from '../screens/SearchList';

import { Icon, TabBar } from '../components';

const MyTab = createBottomTabNavigator({
  ProjectListScreen: {
    screen: ProjectList,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name="home" color={tintColor} />
    }
  },
  SearchScreen: {
    screen: Search,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name="search" color={tintColor} />
    }
  },
  UserHomeScreen: {
    screen: UserHome,
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

export const AppRouter = createStackNavigator(
  {
    MyTab: {
      screen: MyTab
    },
    Login: {
      screen: Login
    },
    SearchList: {
      screen: SearchList
    }
  },
  {
    // 快速定制导航条，新版识兔中所有的导航都是重写的，所以这里会将全部的导航置空
    defaultNavigationOptions: () => ({
      header: null,
      gesturesEnabled: true
    }),
  }
);