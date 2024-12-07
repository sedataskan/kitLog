import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { generateRandomBook } from "../utils/randomBookGenerator";

export const Book = ({ title, author }: { title: string; author: string }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: generateRandomBook().coverImage }}
          style={styles.image}
        />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.author}>{author}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    margin: 25,
    borderRadius: 10,
  },
  imageContainer: {
    width: 120,
    height: 180,
    borderRadius: 10,
    backgroundColor: "#D3D3D3",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    overflow: "hidden",
    maxWidth: 110,
  },
  author: {
    fontSize: 14,
    color: "#6E6E6E",
    textAlign: "center",
    overflow: "hidden",
    maxWidth: 110,
  },
});
