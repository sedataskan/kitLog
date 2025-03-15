import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AddBookScreen from "./src/screens/AddBookScreen";
import { Navbar } from "./src/components/navbar";
import BookPreviewScreen from "./src/screens/BookPreviewScreen";
import BookDetailScreen from "./src/screens/BookDetailScreen";
import "./src/i18n";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={Navbar}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddBook"
          component={AddBookScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookPreview"
          component={BookPreviewScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookDetail"
          component={BookDetailScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
