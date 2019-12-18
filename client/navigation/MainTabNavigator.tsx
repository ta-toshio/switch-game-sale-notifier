import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'

import TabBarIcon from '../components/TabBarIcon'
import GameSaleScreen from '../screens/GameSaleScreen'
import GameListScreen from '../screens/GameListScreen'
import BookmarkScreen from '../screens/BookmarkScreen'

const config = Platform.select({
  // web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: GameSaleScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Sale List',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-list` : 'md-list'}
    />
  ),
};

HomeStack.path = '';

const GameListStack = createStackNavigator(
  {
    GameList: GameListScreen,
  },
  config
);

GameListStack.navigationOptions = {
  tabBarLabel: 'Game List',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-list-box' : 'md-list-box'}
    />
  ),
};

GameListStack.path = '';

const BookmarkStack = createStackNavigator(
  {
    Bookmark: BookmarkScreen,
  },
  config
);

BookmarkStack.navigationOptions = {
  tabBarLabel: 'Bookmark',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

BookmarkScreen.getInitial()
BookmarkStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  GameListStack,
  BookmarkStack,
});

tabNavigator.path = '';

export default tabNavigator;