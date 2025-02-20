import React from "react";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import HomeMainScreen from "../screens/HomeMainScreen";
import LibraryScreen from "../screens/LibraryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";

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
              <Ionicons
                name={iconName as any}
                size={size}
                color={color}
                style={styles.tabBarIcon}
              />
            );
          },
          tabBarStyle: allowRoutes.includes(routeName)
            ? styles.tabBar
            : { display: "none" },

          tabBarShowLabel: false,
          tabBarActiveTintColor: colors.primary,
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
    backgroundColor: colors.background,
  },
  text: {
    fontSize: sizes.fontSizeLarge,
    color: colors.primary,
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  tabBar: {
    position: "absolute",
    height: 80, // Increase height
    backgroundColor: colors.secondary,
    shadowColor: "#000", // Add shadow above the tab bar
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: sizes.borderRadius,
    elevation: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  tabBarIcon: {
    marginTop: -10, // Move icons closer to the top of the tab bar
  },
});
