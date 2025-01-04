import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  BookPreview: {
    book: {
      title: string;
      author: string;
      image: string;
      pages: string;
      publication: string;
      review: string;
      rating: number;
      saveDate: Date;
    };
  };
};

type BookScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "BookPreview"
>;

export const Book = ({
  title,
  author,
  image,
  pages,
  publication,
  review,
  rating,
}: {
  title: string;
  author: string;
  image: string;
  pages: string;
  publication: string;
  review: string;
  rating: number;
}) => {
  const navigation = useNavigation<BookScreenNavigationProp>();

  const handlePress = () => {
    navigation.navigate("BookPreview", {
      book: {
        title,
        author,
        image,
        pages,
        publication,
        review,
        rating,
        saveDate: new Date(),
      },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={
              image
                ? { uri: image }
                : require("../../assets/images/unknownBook.jpg")
            }
            style={styles.image}
          />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.author}>{author}</Text>
      </View>
    </TouchableOpacity>
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
