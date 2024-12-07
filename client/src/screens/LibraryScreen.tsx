import { StyleSheet, ScrollView } from "react-native";
import { Layout } from "../layout/layout";
import { Book } from "../components/book";
import { generateRandomBook } from "../utils/randomBookGenerator";

export default function LibraryScreen() {
  const books = Array.from({ length: 21 }, () => generateRandomBook());

  return (
    <Layout title="Library">
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {books.map((book, index) => (
          <Book key={index} title={book.title} author={book.author} />
        ))}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingBottom: 120,
  },
});
