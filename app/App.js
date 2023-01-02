import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./screens/Home";
import Statistics from "./screens/Statistics";
import ChatScreen from "./screens/ChatScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator()

const MyStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Homesc" options={{headerShown:false}} component={Home} />
        <Tab.Screen name="ChatScreen" options={{headerShown:false}} component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" options={{headerShown:false}} component={MyStack} />
        <Tab.Screen name="Statistics" options={{headerShown:false}} component={Statistics} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


