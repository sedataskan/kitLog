import React from "react";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import HomeMainScreen from "../screens/HomeMainScreen";
import LibraryScreen from "../screens/LibraryScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function Navbar() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? "HomeMain";
        const allowRoutes = ["HomeMain", "Library", "Profile"];
        return {
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "HomeMain") iconName = "home-outline";
            else if (route.name === "Library") iconName = "library-outline";
            else if (route.name === "Profile") iconName = "person-outline";
            return (
              <Ionicons name={iconName as any} size={size} color={color} />
            );
          },
          tabBarStyle: allowRoutes.includes(routeName)
            ? styles.tabBar
            : { display: "none" },

          tabBarShowLabel: false,
          tabBarActiveTintColor: "#000",
        };
      }}
    >
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="HomeMain" component={HomeMainScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
  },
  text: {
    fontSize: 20,
    color: "#000000",
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  tabBar: {
    position: "absolute",
    height: 80,
    top: 775,
    backgroundColor: "#D4DCDF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});
