import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Dimensions,
  Text,
} from "react-native";
import { Layout } from "../layout/layout";
import { Book } from "../components/book";
import { CurrentlyReadingBook } from "../components/CurrentlyReadingBook";
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
import { useTranslation } from "react-i18next";

export default function LibraryScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
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
      favPage?: number;
      favPageImage?: string;
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
        book.title.toLowerCase().includes(filters.name.toLowerCase()) ||
        book.author.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.status ||
        book.status.toLowerCase() === filters.status.toLowerCase()) &&
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
    favPage?: number;
    favPageImage?: string;
  }) => {
    setBooks((prevBooks) => {
      const updatedBooks = [newBook, ...prevBooks];
      AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
      return updatedBooks;
    });
  };

  const isFilterActive =
    filters.status !== "" || filters.rating !== 0 || filters.name !== "";
  const currentlyReadingBooks = books.filter(
    (book) =>
      book.status.toLowerCase() === "currently reading" ||
      book.status.toLowerCase() === "şu an okuyorum"
  );

  return (
    <Layout
      title={t("library")}
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
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {!isFilterActive && currentlyReadingBooks.length > 0 && (
          <View style={styles.currentlyReadingSection}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="book" size={22} color={colors.primary} />
              <Text style={styles.sectionTitleText}>
                {t("currently_reading")}
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.currentlyReadingList}
            >
              {currentlyReadingBooks.map((book, index) => (
                <CurrentlyReadingBook
                  key={index}
                  title={book.title}
                  author={book.author}
                  image={book.image}
                  pages={book.pages}
                  publication={book.publication}
                  review={book.review || ""}
                  rating={book.rating}
                  status={book.status}
                  favPage={book.favPage}
                  favPageImage={book.favPageImage}
                />
              ))}
            </ScrollView>
          </View>
        )}
        <View style={styles.bookshelfSection}>
          <View style={styles.bookshelfTitleContainer}>
            <Ionicons name="library" size={20} color={colors.primary} />
            <Text style={styles.bookshelfTitleText}>{t("bookshelf")}</Text>
            <Text style={styles.bookCount}>
              {
                filteredBooks.filter((book) =>
                  isFilterActive
                    ? true
                    : book.status.toLowerCase() !== t("reading").toLowerCase()
                ).length
              }{" "}
              {t("books")}
            </Text>
          </View>
          <View style={styles.booksGrid}>
            {filteredBooks
              .filter((book) =>
                isFilterActive
                  ? true
                  : book.status.toLowerCase() !== t("reading").toLowerCase()
              )
              .map((book, index) => (
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
                  favPage={book.favPage}
                  favPageImage={book.favPageImage}
                />
              ))}
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 0,
  },
  booksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: 100,
    paddingTop: 5,
    columnGap: 15,
  },
  filterButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    padding: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  currentlyReadingSection: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    opacity: 0.9,
  },
  sectionTitleText: {
    fontSize: sizes.fontSizeMedium,
    letterSpacing: 0.3,
    fontWeight: "500",
    color: colors.textSecondary,
    marginLeft: 6,
    textTransform: "uppercase",
  },
  currentlyReadingList: {
    paddingHorizontal: 0,
  },
  currentlyReadingItem: {
    marginRight: 10,
  },
  bookshelfSection: {
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  bookshelfTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 15,
    opacity: 0.85,
  },
  bookshelfTitleText: {
    fontSize: sizes.fontSizeMedium,
    letterSpacing: 0.3,
    fontWeight: "500",
    color: colors.textSecondary,
    marginLeft: 6,
    textTransform: "uppercase",
  },
  bookCount: {
    fontSize: sizes.fontSizeSmall,
    color: colors.textSecondary,
    opacity: 0.7,
    marginLeft: 8,
  },
});
