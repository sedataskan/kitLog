import { StyleSheet, ScrollView, View } from "react-native";
import { Layout } from "../layout/layout";
import { Book } from "../components/book";
import SearchBox from "../components/searchBox";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import AddButton from "../components/addButton";

export default function LibraryScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<
    {
      title: string;
      author: string;
      image: string;
      pages: string;
      publication: string;
      review?: string;
      rating: number;
    }[]
  >([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const storedBooks = await AsyncStorage.getItem("books");
        if (storedBooks) {
          setBooks(JSON.parse(storedBooks));
        }
      } catch (error) {
        console.error("Error fetching books from local storage", error);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = searchQuery
    ? books.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : books;

  const handleBookAdded = (newBook: {
    title: string;
    author: string;
    review?: string;
    image: string;
    pages: string;
    publication: string;
    rating: number;
  }) => {
    setBooks((prevBooks) => {
      const updatedBooks = [newBook, ...prevBooks];
      AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
      return updatedBooks;
    });
  };

  return (
    <Layout title="Library">
      <View style={styles.container}>
        <SearchBox
          placeholder="Search by title"
          onChangeText={setSearchQuery}
        />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {filteredBooks.map((book, index) => (
            <Book
              key={index}
              title={book.title}
              author={book.author}
              image={book.image}
              pages={book.pages}
              publication={book.publication}
              review={book.review || ""}
              rating={book.rating}
            />
          ))}
        </ScrollView>
        <AddButton
          onPress={() =>
            navigation.navigate("AddBook", {
              onBookAdded: handleBookAdded,
            })
          }
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingBottom: 300,
  },
});
