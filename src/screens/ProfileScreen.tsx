import { View, StyleSheet, Text } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";
import { useFocusEffect } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Layout } from "../layout/layout";

export default function ProfileScreen() {
  const [totalBooks, setTotalBooks] = useState(0);
  const [fontsLoaded] = useFonts({
    DancingScript: require("..//..//assets/fonts/DancingScript-Regular.ttf"),
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const storedBooks = await AsyncStorage.getItem("books");
        if (storedBooks) {
          const books = JSON.parse(storedBooks);
          setTotalBooks(books.length);
        }
      } catch (error) {
        console.error("Error fetching books from local storage", error);
      }
    };

    fetchBooks();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchBooks = async () => {
        try {
          const storedBooks = await AsyncStorage.getItem("books");
          if (storedBooks) {
            const books = JSON.parse(storedBooks);
            setTotalBooks(books.length);
          }
        } catch (error) {
          console.error("Error fetching books from local storage", error);
        }
      };

      fetchBooks();
    }, [])
  );

  const badges = [
    { id: 1, name: "First Book Saved", icon: "📘", requiredBooks: 1 },
    { id: 2, name: "10 Books Saved", icon: "📚", requiredBooks: 10 },
    { id: 3, name: "25 Books Saved", icon: "💪", requiredBooks: 25 },
    { id: 4, name: "50 Books Saved", icon: "🏆", requiredBooks: 50 },
    { id: 5, name: "100 Books Saved!", icon: "💯", requiredBooks: 100 },
  ];

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Layout title="">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.hello}>👋 Hello, </Text>
          <Text style={styles.brand}>KitApper!</Text>
        </View>
        <Text style={styles.totalBooks}></Text>
        <View style={styles.table}>
          <Text>Total Books Read: {totalBooks}</Text>
        </View>
        <View style={styles.badgesContainer}>
          <Text style={styles.badgesTitle}>Achievements</Text>
          <View style={styles.badges}>
            {badges
              .filter((badge) => totalBooks >= badge.requiredBooks)
              .map((badge) => (
                <View key={badge.id} style={styles.badge}>
                  <Text style={styles.badgeIcon}>{badge.icon}</Text>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                </View>
              ))}
          </View>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  hello: {
    fontSize: sizes.fontSizeLarge,
    fontWeight: "bold",
  },
  brand: {
    fontSize: sizes.fontSizeLarge,
    fontWeight: "bold",
    fontFamily: "DancingScript",
    fontStyle: "italic",
    color: colors.primary,
  },
  table: {
    width: "100%",
    padding: 20,
    backgroundColor: colors.secondary,
    marginBottom: 20,
    borderRadius: sizes.borderRadius,
    elevation: 2,
  },
  totalBooks: {
    fontSize: sizes.fontSizeSmall,
    color: colors.primary,
    marginBottom: 20,
  },
  badgesContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: colors.backgroundSecondary,
    marginBottom: 20,
    borderRadius: sizes.borderRadius,
    elevation: 2,
  },
  badgesTitle: {
    fontSize: sizes.fontSizeMedium,
    fontWeight: "bold",
    marginBottom: 10,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  badge: {
    alignItems: "center",
    marginBottom: 10,
  },
  badgeIcon: {
    fontSize: sizes.fontSizeLarge,
  },
  badgeName: {
    fontSize: sizes.fontSizeSmall,
    textAlign: "center",
  },
});
