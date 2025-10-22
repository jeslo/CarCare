import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddVehicleScreen from './src/screens/AddVehicleScreen';
import VehicleRequestsScreen from './src/screens/VehicleRequestsScreen';
import VehicleDetailsScreen from './src/screens/VehicleDetailsScreen';

export type RootStackParamList = {
  AddVehicle: undefined;
  VehicleRequests: undefined;
  VehicleDetails: { number: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="VehicleRequests">
        <Stack.Screen
          name="AddVehicle"
          component={AddVehicleScreen}
          options={{ title: 'Submit a Complaint' }}
        />
        <Stack.Screen
          name="VehicleRequests"
          component={VehicleRequestsScreen}
          options={{ title: 'Complaint History' }}
        />
        <Stack.Screen
          name="VehicleDetails"
          component={VehicleDetailsScreen}
          options={{ title: 'Complaint Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
