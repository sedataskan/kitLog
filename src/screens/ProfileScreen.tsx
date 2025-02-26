import { View, StyleSheet, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Layout } from "../layout/layout";
import VersionScreen from "../components/versionScreen";
import { Book } from "../components/book";
import { ScrollView } from "react-native-gesture-handler";
import AddButton from "../components/addButton";

export default function ProfileScreen() {
  const navigation = useNavigation();

  const [totalBooks, setTotalBooks] = useState(0);
  type BookType = {
    title: string;
    author: string;
    image: string;
    pages: number;
    publication: string;
    review?: string;
    rating: number;
    status: string;
  };

  const [recentBooks, setRecentBooks] = useState<BookType[]>([]);
  const [recentReviews, setRecentReviews] = useState<BookType[]>([]);
  const [fontsLoaded] = useFonts({
    DancingScript: require("..//..//assets/fonts/DancingScript-Regular.ttf"),
  });

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

  useFocusEffect(
    React.useCallback(() => {
      const fetchBooks = async () => {
        try {
          const storedBooks = await AsyncStorage.getItem("books");
          if (storedBooks) {
            const books = JSON.parse(storedBooks);
            setTotalBooks(books.length);
            setRecentBooks(books.slice(-2).reverse());
            setRecentReviews(
              books.filter((book: { review: any }) => book.review).reverse()
            );
          }
        } catch (error) {
          console.error("Error fetching books from local storage", error);
        }
      };

      fetchBooks();
    }, [])
  );

  const handleBookAdded = (newBook: {
    title: string;
    author: string;
    review?: string;
    image: string;
    pages: number;
    publication: string;
    rating: number;
    status: string;
  }) => {
    setRecentBooks((prevBooks) => [newBook, ...prevBooks].slice(0, 2));
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <AddButton
        onPress={() =>
          navigation.navigate("AddBook" as never, {
            onBookAdded: handleBookAdded,
          })
        }
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ justifyContent: "center" }}
      >
        <View>
          <View style={styles.header}>
            <Text style={styles.hello}>👋 Hello, </Text>
            <Text style={styles.brand}>KitApper!</Text>
          </View>
        </View>
        <View style={styles.totalReadBook}>
          <Text style={styles.totalBooks}>You have saved </Text>
          <Text style={styles.brand}>{totalBooks}</Text>
          <Text style={styles.totalBooks}> books in total 🥳</Text>
        </View>
        <View>
          <Text style={styles.sectionTitleTop}>Recently Saved Books</Text>
          <View style={styles.featuredBooksContainer}>
            {recentBooks.map((book, index) => (
              <View key={index} style={styles.bookContainer}>
                <Book
                  title={book.title}
                  author={book.author}
                  image={book.image}
                  pages={book.pages.toString()}
                  publication={book.publication}
                  review={book.review || ""}
                  rating={book.rating}
                  status={book.status}
                />
              </View>
            ))}
          </View>
        </View>
        <View>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <FlatList
            nestedScrollEnabled
            data={recentReviews}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.reviewContainer}>
                <Text style={styles.reviewBook}>{item.title}</Text>
                <Text style={styles.reviewText}>{item.review}</Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 10 }}
            style={styles.reviewsList}
          />
        </View>

        <VersionScreen />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    justifyContent: "center",
  },
  hello: {
    fontSize: sizes.fontSizeLarge,
    fontWeight: "bold",
  },
  brand: {
    fontSize: sizes.fontSizeLarge,
    fontWeight: "bold",
    fontFamily: "DancingScript",
    fontStyle: "italic",
    color: colors.primary,
  },
  totalBooks: {
    fontSize: sizes.fontSizeMedium,
    color: colors.black,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: sizes.fontSizeMedium,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  sectionTitleTop: {
    fontSize: sizes.fontSizeMedium,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginTop: 20,
  },
  bookContainer: {
    marginBottom: 20,
  },
  reviewContainer: {
    backgroundColor: colors.backgroundSecondary,
    padding: 15,
    borderRadius: sizes.borderRadius,
    marginBottom: 10,
    elevation: 2,
    width: "100%",
  },
  reviewBook: {
    fontWeight: "bold",
    fontSize: sizes.fontSizeSmall,
  },
  reviewText: {
    marginTop: 8,
    fontSize: sizes.fontSizeSmall,
  },
  featuredBooksContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  reviewsList: {
    maxHeight: 200,
    marginTop: 15,
    marginBottom: 20,
  },

  totalReadBook: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    backgroundColor: colors.secondary,
    borderRadius: sizes.borderRadius,
    padding: 10,
    height: 75,
  },
});
