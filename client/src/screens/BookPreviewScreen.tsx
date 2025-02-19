import React, { useState } from "react";
import { View, StyleSheet, Text, Image, ScrollView, Alert } from "react-native";
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
        status: string;
      };
    };
  },
  "params"
>;

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Read":
      return styles.statusRead;
    case "Reading":
      return styles.statusReading;
    case "To Read":
      return styles.statusToRead;
    default:
      return styles.statusToRead;
  }
};

export default function BookPreviewScreen() {
  const route = useRoute<BookPreviewScreenRouteProp>();
  const navigation = useNavigation();
  const { book } = route.params;
  const [menuVisible, setMenuVisible] = useState(false);

  if (!book) {
    return (
      <Layout title="Book Preview">
        <View style={styles.container}>
          <Text style={styles.errorText}>Book details not available.</Text>
        </View>
      </Layout>
    );
  }

  const parsedBook = {
    ...book,
    saveDate: new Date(book.saveDate),
    status: book.status ? book.status : "To Read",
  };

  const handleEdit = () => {
    setMenuVisible(false);
    navigation.navigate("AddBook", {
      book: { ...parsedBook, saveDate: parsedBook.saveDate.toISOString() },
      isEdit: true,
    });
  };

  const handleDelete = async () => {
    setMenuVisible(false);
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
    <Layout
      title={parsedBook.title}
      menuVisible={menuVisible}
      setMenuVisible={setMenuVisible}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={
            parsedBook.image
              ? { uri: parsedBook.image }
              : require("../../assets/images/unknownBook.jpg")
          }
          style={styles.image}
        />
        <Text style={styles.title}>{parsedBook.title}</Text>
        <Text style={styles.author}>{parsedBook.author}</Text>
        <Text style={styles.date}>
          {parsedBook.saveDate
            ? new Date(parsedBook.saveDate).toLocaleDateString()
            : "No Date Added"}
        </Text>
        <Text style={[styles.status, getStatusStyle(parsedBook.status)]}>
          {parsedBook.status}
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
          startingValue={parsedBook.rating}
          style={{
            paddingVertical: 10,
            backgroundColor: colors.background,
          }}
        />
        <View style={styles.textContainer}>
          <View style={styles.detailsSection}>
            <Text style={styles.label}>Pages</Text>
            <Text style={styles.value}>{parsedBook.pages}</Text>
            <Text style={styles.label}>Publication</Text>
            <Text style={styles.value}>
              {parsedBook.publication ? parsedBook.publication : "Unknown"}
            </Text>
            <Text style={styles.label}>Review</Text>
            <Text style={styles.value}>
              {parsedBook.review ? parsedBook.review : "No Comment Added"}
            </Text>
          </View>
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
  status: {
    marginBottom: 5,
    padding: 5,
    borderRadius: sizes.borderRadius,
    textAlign: "center",
    fontSize: sizes.fontSizeSmall,
  },
  statusRead: {
    backgroundColor: "green",
    color: "white",
  },
  statusReading: {
    backgroundColor: "orange",
    color: "white",
  },
  statusToRead: {
    backgroundColor: "blue",
    color: "white",
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
  menuButton: {
    fontSize: sizes.fontSizeLarge,
    color: colors.textPrimary,
    padding: 10,
  },
});
