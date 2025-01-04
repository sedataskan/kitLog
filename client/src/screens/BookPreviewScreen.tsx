import React from "react";
import { View, StyleSheet, Text, Image, ScrollView } from "react-native";
import { Layout } from "../layout/layout";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Rating } from "react-native-ratings";

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

  return (
    <Layout title="Book Preview">
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={
            book.image
              ? { uri: book.image }
              : require("../../assets/images/unknownBook.jpg")
          }
          style={styles.image}
        />
        <Rating
          type="heart"
          ratingColor="#3498db"
          ratingBackgroundColor="transparent"
          ratingCount={5}
          imageSize={40}
          fractions={1}
          jumpValue={0.5}
          readonly
          startingValue={book.rating}
          style={{
            paddingVertical: 10,
            backgroundColor: "transparent",
          }}
        />
        <View style={styles.detailsSection}>
          <Text style={styles.label}>Title</Text>
          <Text style={styles.value}>{book.title}</Text>
          <Text style={styles.label}>Author</Text>
          <Text style={styles.value}>{book.author}</Text>
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
          <Text style={styles.label}>Added Date</Text>
          <Text style={styles.value}>
            {book.saveDate
              ? new Date(book.saveDate).toLocaleDateString()
              : "No Date Added"}
          </Text>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  detailsSection: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },
  value: {
    marginBottom: 10,
    color: "#000",
  },
  image: {
    width: 120,
    height: 180,
    borderRadius: 10,
    backgroundColor: "#D3D3D3",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
});
