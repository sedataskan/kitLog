import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";

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
      status: string;
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
  status,
}: {
  title: string;
  author: string;
  image: string;
  pages: string;
  publication: string;
  review: string;
  rating: number;
  status: string;
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
        status: status || "To Read", // Ensure status is set correctly
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
    borderRadius: sizes.borderRadius,
  },
  imageContainer: {
    width: 120,
    height: 180,
    borderRadius: sizes.borderRadius,
    backgroundColor: colors.secondary,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: sizes.borderRadius,
  },
  title: {
    fontSize: sizes.fontSizeMedium,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
    overflow: "hidden",
    maxWidth: 110,
  },
  author: {
    fontSize: sizes.fontSizeSmall,
    color: colors.textSecondary,
    textAlign: "center",
    overflow: "hidden",
    maxWidth: 110,
  },
});
