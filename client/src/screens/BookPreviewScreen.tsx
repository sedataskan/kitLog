import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import { Layout } from "../layout/layout";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { Rating } from "react-native-ratings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";

type BookPreviewScreenRouteProp = RouteProp<
  {
    params: {
      book: {
        title: string;
        author: string;
        pages: string;
        publication: string;
        review: string;
        rating: number;
        image: string;
        saveDate: Date;
      };
    };
  },
  "params"
>;

export default function BookPreviewScreen() {
  const route = useRoute<BookPreviewScreenRouteProp>();
  const navigation = useNavigation();
  const { book } = route.params;

  if (!book) {
    return (
      <Layout title="Book Preview">
        <View style={styles.container}>
          <Text style={styles.errorText}>Book details not available.</Text>
        </View>
      </Layout>
    );
  }

  const handleDelete = async () => {
    Alert.alert("Delete Book", "Are you sure you want to delete this book?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const existingBooks = await AsyncStorage.getItem("books");
            const books = existingBooks ? JSON.parse(existingBooks) : [];
            const updatedBooks = books.filter(
              (b: any) => b.title !== book.title
            );
            await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
            navigation.goBack();
          } catch (error) {
            console.error("Error deleting book", error);
          }
        },
      },
    ]);
  };

  return (
    <Layout title={book.title}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={
            book.image
              ? { uri: book.image }
              : require("../../assets/images/unknownBook.jpg")
          }
          style={styles.image}
        />
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>
        <Text style={styles.date}>
          {book.saveDate
            ? new Date(book.saveDate).toLocaleDateString()
            : "No Date Added"}
        </Text>
        <Rating
          type="star"
          ratingColor={colors.primary}
          ratingBackgroundColor="transparent"
          ratingCount={5}
          imageSize={sizes.fontSizeLarge * 1.2}
          fractions={1}
          jumpValue={0.5}
          readonly
          startingValue={book.rating}
          style={{
            paddingVertical: 10,
            backgroundColor: colors.background,
          }}
        />
        <View style={styles.textContainer}>
          <View style={styles.detailsSection}>
            <Text style={styles.label}>Pages</Text>
            <Text style={styles.value}>{book.pages}</Text>
            <Text style={styles.label}>Publication</Text>
            <Text style={styles.value}>
              {book.publication ? book.publication : "Unknown"}
            </Text>
            <Text style={styles.label}>Review</Text>
            <Text style={styles.value}>
              {book.review ? book.review : "No Comment Added"}
            </Text>
          </View>
        </View>
        <View style={styles.button}>
          <Button color={colors.error} title="Delete" onPress={handleDelete} />
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  textContainer: {
    width: "100%",
    alignItems: "center",
  },
  detailsSection: {
    width: "90%",
    padding: 10,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: sizes.borderRadius,
  },
  label: {
    fontWeight: "bold",
    color: colors.textPrimary,
    fontSize: sizes.fontSizeSmall,
  },
  value: {
    marginBottom: 10,
    color: colors.textPrimary,
    fontSize: sizes.fontSizeSmall,
  },
  title: {
    marginBottom: 5,
    color: colors.textPrimary,
    fontSize: sizes.fontSizeLarge,
    fontFamily: "DancingScript",
  },
  author: {
    marginBottom: 5,
    color: colors.textPrimary,
    fontSize: sizes.fontSizeSmall,
    fontStyle: "italic",
  },
  date: {
    marginBottom: 5,
    color: colors.textSecondary,
    fontSize: sizes.fontSizeSmall,
    fontStyle: "italic",
  },
  image: {
    width: 150,
    height: 240,
    borderRadius: sizes.borderRadius,
    backgroundColor: colors.background,
    marginBottom: 10,
  },
  errorText: {
    color: colors.error,
    fontSize: sizes.fontSizeMedium,
  },
  button: {
    marginTop: 20,
    width: 150,
    borderRadius: sizes.borderRadius,
    borderWidth: 2,
    borderColor: colors.error,
  },
});
