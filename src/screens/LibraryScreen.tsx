import { StyleSheet, ScrollView, View, TouchableOpacity } from "react-native";
import { Layout } from "../layout/layout";
import { Book } from "../components/book";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AddButton from "../components/addButton";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";
import { useCallback } from "react";
import FilterModal from "../components/filterModal";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export default function LibraryScreen() {
  const navigation = useNavigation();
  const [books, setBooks] = useState<
    {
      title: string;
      author: string;
      image: string;
      pages: string;
      publication: string;
      review?: string;
      rating: number;
      status: string;
    }[]
  >([]);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    rating: 0,
    name: "",
  });

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

  useFocusEffect(
    useCallback(() => {
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
    }, [])
  );

  const filteredBooks = books.filter((book) => {
    return (
      (!filters.name ||
        book.title.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.status || book.status === filters.status) &&
      (!filters.rating || book.rating === filters.rating)
    );
  });

  const handleBookAdded = (newBook: {
    title: string;
    author: string;
    review?: string;
    image: string;
    pages: string;
    publication: string;
    rating: number;
    status: string;
  }) => {
    setBooks((prevBooks) => {
      const updatedBooks = [newBook, ...prevBooks];
      AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
      return updatedBooks;
    });
  };

  return (
    <Layout
      title="Library"
      rightComponent={
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="filter" size={24} color="white" />
        </TouchableOpacity>
      }
      menuVisible={false}
      setMenuVisible={() => {}}
      handleEdit={() => {}}
    >
      <AddButton
        onPress={() =>
          navigation.navigate("AddBook", {
            onBookAdded: handleBookAdded,
          })
        }
      />
      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={setFilters}
        filters={filters}
      />
      <View style={styles.container}>
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
              status={book.status}
            />
          ))}
        </ScrollView>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  contentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingBottom: 300,
  },
  filterButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 8,
  },
});
