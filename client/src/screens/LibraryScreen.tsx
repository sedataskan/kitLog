import { StyleSheet, ScrollView, View } from "react-native";
import { Layout } from "../layout/layout";
import { Book } from "../components/book";
import { generateRandomBook } from "../utils/randomBookGenerator";
import SearchBox from "../components/searchBox";
import { useState } from "react";

export default function LibraryScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const books = Array.from({ length: 21 }, () => generateRandomBook());

  const filteredBooks = searchQuery
    ? books.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : books;

  return (
    <Layout title="Library">
      <View style={styles.container}>
        <SearchBox
          placeholder="Search by title"
          onChangeText={setSearchQuery}
        />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {filteredBooks.map((book, index) => (
            <Book key={index} title={book.title} author={book.author} />
          ))}
        </ScrollView>
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
