import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./screens/Home";
import Statistics from "./screens/Statistics";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" options={{headerShown:false}} component={Home} />
        <Tab.Screen name="Statistics" options={{headerShown:false}} component={Statistics} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


