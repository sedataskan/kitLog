import { StyleSheet, Text, View, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { Layout } from "../layout/layout";
import React, { useState, useEffect } from "react";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  BookDetail: {
    book: Book;
  };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'BookDetail'>;

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail: string;
    };
    description?: string;
    pageCount?: number;
    publisher?: string;
    publishedDate?: string;
    categories?: string[];
  };
}

const RECOMMENDED_CATEGORIES = [
  { title: "Best Sellers", query: "subject:fiction&orderBy=newest" },
  { title: "Classic Literature", query: "subject:classic+literature" },
  { title: "Science & Technology", query: "subject:science+technology" },
  { title: "Personal Development", query: "subject:self-help" },
];

export default function HomeMainScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [recommendedBooks, setRecommendedBooks] = useState<{[key: string]: Book[]}>({});
  const [loadingRecommended, setLoadingRecommended] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    fetchRecommendedBooks();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setBooks([]);
    }
  }, [searchQuery]);

  const fetchRecommendedBooks = async () => {
    setLoadingRecommended(true);
    try {
      const recommendedResults: {[key: string]: Book[]} = {};
      
      for (const category of RECOMMENDED_CATEGORIES) {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${category.query}&maxResults=5`
        );
        const data = await response.json();
        if (data.items) {
          recommendedResults[category.title] = data.items;
        }
      }
      
      setRecommendedBooks(recommendedResults);
      console.log(recommendedResults);
    } catch (error) {
      console.error("Error fetching recommended books:", error);
    } finally {
      setLoadingRecommended(false);
    }
  };

  const searchBooks = async () => {
    if (!searchQuery.trim()) {
      setBooks([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchQuery
        )}&maxResults=20`
      );
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error("Error searching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToLibrary = async (book: Book) => {
    try {
      const existingBooks = await AsyncStorage.getItem("books");
      const books = existingBooks ? JSON.parse(existingBooks) : [];
      
      // Check if book already exists
      const bookExists = books.some((existingBook: any) => 
        existingBook.title.toLowerCase() === book.volumeInfo.title.toLowerCase()
      );

      if (bookExists) {
        alert("This book is already in your library!");
        return;
      }

      const newBook = {
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors?.[0] || "Unknown Author",
        image: book.volumeInfo.imageLinks?.thumbnail || "",
        pages: book.volumeInfo.pageCount?.toString() || "0",
        publication: book.volumeInfo.publisher || "Unknown Publisher",
        review: "",
        rating: 0,
        status: "To Read",
        saveDate: new Date(),
      };

      books.push(newBook);
      await AsyncStorage.setItem("books", JSON.stringify(books));

      alert("Book added to library!");
    } catch (error) {
      console.error("Error adding book to library:", error);
      alert("Failed to add book to library");
    }
  };

  const navigateToBookDetail = (book: Book) => {
    navigation.navigate('BookDetail', { book } as never);
  };

  const getSecureImageUrl = (url: string | undefined) => {
    if (!url) return 'https://via.placeholder.com/128x192?text=No+Cover';
    // Convert http to https and handle zoom parameter
    return url.replace('http://', 'https://').replace('&edge=curl', '');
  };

  const renderBookItem = ({ item }: { item: Book }) => (
    <TouchableOpacity onPress={() => navigateToBookDetail(item)}>
      <View style={styles.bookItem}>
        <Image
          source={{
            uri: getSecureImageUrl(item.volumeInfo.imageLinks?.thumbnail),
          }}
          style={styles.bookCover}
          resizeMode="cover"
        />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {item.volumeInfo.title}
          </Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            {item.volumeInfo.authors?.[0] || "Unknown Author"}
          </Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={(e) => {
              e.stopPropagation();
              addToLibrary(item);
            }}
          >
            <Ionicons name="add-circle" size={24} color={colors.primary} />
            <Text style={styles.addButtonText}>Add to Library</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRecommendedSection = () => (
    <View style={styles.recommendedContainer}>
      {loadingRecommended ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : (
        Object.entries(recommendedBooks).map(([category, categoryBooks]) => (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryTitle}>
              <Ionicons name="book" size={22} color={colors.primary} />
              <Text style={styles.categoryTitleText}>{category}</Text>
            </View>
            <FlatList
              horizontal
              data={categoryBooks}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.recommendedBookItem}
                  onPress={() => navigateToBookDetail(item)}
                >
                  <Image
                    source={{
                      uri: getSecureImageUrl(item.volumeInfo.imageLinks?.thumbnail),
                    }}
                    style={styles.recommendedBookCover}
                    resizeMode="cover"
                  />
                  <Text style={styles.recommendedBookTitle} numberOfLines={2}>
                    {item.volumeInfo.title}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recommendedListContainer}
            />
          </View>
        ))
      )}
    </View>
  );

  return (
    <Layout
      title="Book Search"
      rightComponent={<></>}
      menuVisible={false}
      setMenuVisible={() => {}}
      handleEdit={() => {}}
      handleDelete={() => {}}
    >
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for books..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchBooks}
          />
          <TouchableOpacity style={styles.searchButton} onPress={searchBooks}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : books.length > 0 ? (
          <FlatList
            data={books}
            renderItem={renderBookItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {renderRecommendedSection()}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
    backgroundColor: colors.background,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: sizes.borderRadius,
    paddingHorizontal: 10,
    backgroundColor: colors.background,
  },
  searchButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: sizes.borderRadius,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  bottomSpacing: {
    height: 0,
  },
  bookItem: {
    flexDirection: "row",
    backgroundColor: colors.backgroundSecondary,
    borderRadius: sizes.borderRadius,
    padding: 10,
    marginBottom: 10,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: sizes.borderRadius,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "space-between",
  },
  bookTitle: {
    fontSize: sizes.fontSizeMedium,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  bookAuthor: {
    fontSize: sizes.fontSizeSmall,
    color: colors.textSecondary,
    marginTop: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    marginLeft: 4,
    color: colors.primary,
    fontSize: sizes.fontSizeSmall,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  recommendedContainer: {
    flex: 1,
    padding: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    opacity: 0.9,
  },
  categoryTitleText: {
    fontSize: sizes.fontSizeMedium,
    letterSpacing: 0.3,
    fontWeight: "500",
    color: colors.textSecondary,
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  recommendedListContainer: {
    paddingRight: 16,
  },
  recommendedBookItem: {
    width: 120,
    marginRight: 16,
  },
  recommendedBookCover: {
    width: 120,
    height: 180,
    borderRadius: sizes.borderRadius,
    marginBottom: 8,
  },
  recommendedBookTitle: {
    fontSize: sizes.fontSizeSmall,
    color: colors.textPrimary,
    textAlign: "center",
  },
});
