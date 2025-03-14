import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

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
      favPage?: number;
      favPageImage?: string;
      currentPage?: number;
    };
  };
};

type BookScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "BookPreview"
>;

const getStatusIcon = (status: string) => {
  switch (status) {
    case "read":
      return "checkmark-circle";
    case "to_read":
      return "time";
    case "currently_reading":
      return "book";
    default:
      return "help-circle";
  }
};

export const Book = ({
  title,
  author,
  image,
  pages,
  publication,
  review,
  rating,
  status,
  favPage,
  favPageImage,
  currentPage,
  style,
}: {
  title: string;
  author: string;
  image: string;
  pages: string;
  publication: string;
  review: string;
  rating: number;
  status: string;
  favPage?: number;
  favPageImage?: string;
  currentPage?: number;
  style?: object;
}) => {
  const navigation = useNavigation<BookScreenNavigationProp>();
  const { t } = useTranslation();
  const statusIcon = getStatusIcon(status, t);

  const getSecureImageUrl = (url: string | undefined) => {
    if (!url) return "https://via.placeholder.com/128x192?text=No+Cover";
    return url.replace("http://", "https://").replace("&edge=curl", "");
  };

  const handlePress = () => {
    navigation.navigate("BookPreview", {
      book: {
        title,
        author,
        image: getSecureImageUrl(image)
          ? getSecureImageUrl(image)
          : require("../../assets/images/noCover.jpg"),
        pages,
        publication,
        review,
        rating,
        saveDate: new Date(),
        status,
        favPage,
        favPageImage,
        currentPage: currentPage ?? 0,
      },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.container, style]}>
      <View style={styles.imageContainer}>
        <View style={styles.statusBadge}>
          <Ionicons name={statusIcon} size={12} color={colors.primary} />
        </View>
        <Image
          source={
            image
              ? {
                  uri: getSecureImageUrl(image)
                    ? getSecureImageUrl(image)
                    : require("../../assets/images/noCover.jpg"),
                }
              : require("../../assets/images/noCover.jpg")
          }
          style={styles.image}
        />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.author} numberOfLines={1}>
        {author}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 105,
    marginBottom: 25,
    marginHorizontal: 0,
  },
  imageContainer: {
    width: 105,
    height: 155,
    borderRadius: sizes.borderRadius,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.white,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: sizes.borderRadius,
  },
  title: {
    fontSize: sizes.fontSizeSmall,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
    maxWidth: 105,
    overflow: "hidden",
  },
  author: {
    fontSize: sizes.fontSizeSmall,
    color: colors.textSecondary,
    maxWidth: 105,
    overflow: "hidden",
  },
});
