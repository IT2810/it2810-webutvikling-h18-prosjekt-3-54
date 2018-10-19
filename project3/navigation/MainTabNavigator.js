import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import CalendarScreen from '../screens/HomeScreen';
import LocationScreen from '../screens/LocationScreen';
import ContactsScreen from '../screens/ContactsScreen';

const CalendarStack = createStackNavigator({
  Calendar: CalendarScreen,
});

CalendarStack.navigationOptions = {
  tabBarLabel: 'To do',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-checkbox${focused ? '' : '-outline'}`
          : 'md-checkbox'
      }
    />
  ),
};

const LocationStack = createStackNavigator({
  Location: LocationScreen,
});

LocationStack.navigationOptions = {
  tabBarLabel: 'Location',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-globe${focused ? '' : '-outline'}` : 'md-globe'}
    />
  ),
};

const ContactsStack = createStackNavigator({
  Contacts: ContactsScreen,
});

ContactsStack.navigationOptions = {
  tabBarLabel: 'Contacts',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-contacts${focused ? '' : '-outline'}` : 'md-contacts'}
    />
  ),
};

export default createBottomTabNavigator({
  CalendarStack,
  LocationStack,
  ContactsStack,
});
