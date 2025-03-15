import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { ProgressBar } from "react-native-paper";
import { getSecureImageUrl } from "../util/getSecureImageUrl";

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

type CurrentlyReadingBookProps = {
  book: any;
};

export const CurrentlyReadingBook = ({
  book: {
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
  },
}: CurrentlyReadingBookProps) => {
  const navigation = useNavigation<BookScreenNavigationProp>();
  const { t } = useTranslation();
  const handlePress = () => {
    navigation.navigate("BookPreview", {
      book: {
        title,
        author,
        image: getSecureImageUrl(image),
        pages,
        publication,
        review,
        rating,
        status,
        favPage,
        favPageImage,
        currentPage: currentPage !== undefined ? currentPage : 0,
      },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <View style={styles.card}>
        <Image
          source={
            image
              ? { uri: getSecureImageUrl(image) }
              : require("../../assets/images/noCover.jpg")
          }
          style={styles.image}
        />
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.author} numberOfLines={1}>
              {author}
            </Text>
            <View style={styles.iconContainer}>
              <Ionicons name="book-outline" size={16} color={colors.white} />
              <Text style={styles.pagesText}>
                {t("current_page")}: {currentPage?.toString() || "0"}
              </Text>
            </View>
            <ProgressBar
              progress={
                !isNaN(
                  parseInt(currentPage?.toString() || "0") / parseInt(pages)
                )
                  ? parseInt(currentPage?.toString() || "0") / parseInt(pages)
                  : 0
              }
              color={colors.sliderSecondary}
              style={styles.progressBar}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 160,
    marginRight: 15,
  },
  card: {
    flex: 1,
    borderRadius: sizes.borderRadius,
    overflow: "hidden",
    backgroundColor: colors.secondary,
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
    borderRadius: sizes.borderRadius,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.blur,
    justifyContent: "flex-end",
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: sizes.fontSizeMedium,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 4,
  },
  author: {
    fontSize: sizes.fontSizeSmall,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pagesText: {
    fontSize: sizes.fontSizeSmall,
    color: colors.white,
    opacity: 0.9,
    marginLeft: 4,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginTop: 10,
  },
});
