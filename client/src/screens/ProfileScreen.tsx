import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { Layout } from "../layout/layout";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({
  title,
  avatarUrl,
}: {
  title: string;
  avatarUrl: string;
}) {
  const navigation = useNavigation();
  const [totalBooks, setTotalBooks] = useState(0);

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

  const handlePress = () => {
    navigation.navigate("Login" as never);
  };

  const badges = [
    { id: 1, name: "First Book Saved", icon: "📘" },
    { id: 2, name: "First 10 Books Saved", icon: "📚" },
    { id: 3, name: "First 100 Books Saved", icon: "🏆" },
    { id: 4, name: "First Review Written", icon: "✍️" },
    { id: 5, name: "First 10 Reviews Written", icon: "📝" },
    { id: 6, name: "First 100 Reviews Written", icon: "📈" },
  ];

  return (
    <>
      <View style={styles.container}>
        <Image
          source={{
            uri: "https://a1cf74336522e87f135f-2f21ace9a6cf0052456644b80fa06d4f.ssl.cf2.rackcdn.com/images/characters/large/800/Bella-Swan.Twilight.webp",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>Schwi Dola</Text>
        <Text style={styles.registrationDate}>
          Registration Date: 01/01/2020
        </Text>
        <Text style={styles.totalBooks}></Text>
        <View style={styles.table}>
          <Text>Total Books Read: {totalBooks}</Text>
        </View>
        <View style={styles.badgesContainer}>
          <Text style={styles.badgesTitle}>Achievements</Text>
          <View style={styles.badges}>
            {badges.map((badge) => (
              <View key={badge.id} style={styles.badge}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.floatingButton} onPress={handlePress}>
        <Ionicons name="log-out" size={24} color="#fff" />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 50,
    marginBottom: 10,
    borderWidth: 5,
    borderColor: "#4B6E7C",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  table: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 10,
    elevation: 2,
  },
  totalBooks: {
    fontSize: 15,
    color: "#666",
    marginBottom: 20,
  },
  registrationDate: {
    fontSize: 15,
    color: "#666",
    marginBottom: 5,
  },
  floatingButton: {
    position: "absolute",
    top: 720,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#4B6E7C",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    zIndex: 1,
  },
  badgesContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 10,
    elevation: 2,
  },
  badgesTitle: {
    fontSize: 18,
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
    fontSize: 30,
  },
  badgeName: {
    fontSize: 12,
    textAlign: "center",
  },
});
