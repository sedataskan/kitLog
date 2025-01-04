import { View, StyleSheet, Text, ScrollView, Image } from "react-native";
import { Layout } from "../layout/layout";
import { Book } from "../components/book";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import AddButton from "../components/addButton";

export default function HomeMainScreen() {
  const navigation = useNavigation();
  const [recentBooks, setRecentBooks] = useState<
    {
      title: string;
      author: string;
      review?: string;
      image: string;
      pages: string;
      publication: string;
      rating: number;
    }[]
  >([]);
  const [recentReviews, setRecentReviews] = useState<
    { title: string; review: string }[]
  >([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const storedBooks = await AsyncStorage.getItem("books");
        if (storedBooks) {
          const books = JSON.parse(storedBooks);
          setRecentBooks(books.slice(-2).reverse());
          setRecentReviews(
            books
              .filter((book: { review: any }) => book.review)
              .slice(-3)
              .reverse()
          );
        }
      } catch (error) {
        console.error("Error fetching books from local storage", error);
      }
    };

    fetchBooks();
  }, []);

  const handleBookAdded = (newBook: {
    title: string;
    author: string;
    review?: string;
    image: string;
    pages: string;
    publication: string;
    rating: number;
  }) => {
    setRecentBooks((prevBooks) => [newBook, ...prevBooks].slice(0, 2));
    setRecentReviews((prevReviews) => {
      if (newBook.review) {
        const newReview = { title: newBook.title, review: newBook.review };
        return [newReview, ...prevReviews].slice(0, 3);
      }
      return prevReviews;
    });
  };

  return (
    <Layout title="Home">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently Saved Books</Text>
        <View style={styles.featuredBooksContainer}>
          {recentBooks.map((book, index) => (
            <View key={index} style={styles.bookContainer}>
              <Book
                title={book.title}
                author={book.author}
                image={book.image}
                pages={book.pages}
                publication={book.publication}
                review={book.review || ""}
                rating={book.rating}
              />
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Reviews</Text>
        {recentReviews.map((review, index) => (
          <View key={index} style={styles.reviewContainer}>
            <Text style={styles.reviewBook}>{review.title}</Text>
            <Text style={styles.reviewText}>{review.review}</Text>
          </View>
        ))}
      </View>
      <AddButton
        onPress={() =>
          navigation.navigate("AddBook", {
            onBookAdded: handleBookAdded,
          })
        }
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    alignItems: "center",
  },
  welcomeMessage: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    alignItems: "center",
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  bookContainer: {
    marginRight: 10,
  },
  reviewContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    width: "90%",
  },
  reviewBook: {
    fontWeight: "bold",
  },
  reviewText: {
    marginTop: 5,
  },
  featuredBooksContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
