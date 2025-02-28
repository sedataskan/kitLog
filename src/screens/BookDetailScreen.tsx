import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Layout } from '../layout/layout';
import { colors } from '../constants/colors';
import { sizes } from '../constants/sizes';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, RouteProp } from '@react-navigation/native';

type BookDetailScreenRouteProp = RouteProp<{
  params: {
    book: {
      volumeInfo: {
        title: string;
        authors?: string[];
        description?: string;
        imageLinks?: {
          thumbnail: string;
        };
        pageCount?: number;
        publisher?: string;
        publishedDate?: string;
        categories?: string[];
      };
    };
  };
}, 'params'>;

export default function BookDetailScreen({ route }: { route: BookDetailScreenRouteProp }) {
  const { book } = route.params;
  const navigation = useNavigation();

  const getSecureImageUrl = (url: string | undefined) => {
    if (!url) return 'https://via.placeholder.com/128x192?text=No+Cover';
    return url.replace('http://', 'https://').replace('&edge=curl', '');
  };

  const addToLibrary = async () => {
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
        image: getSecureImageUrl(book.volumeInfo.imageLinks?.thumbnail),
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

  return (
    <Layout
      canGoBack={true}
      title="Book Details"
      leftComponent={
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      }
      rightComponent={
        <TouchableOpacity 
          style={[styles.headerButton, styles.addButtonContainer]} 
          onPress={addToLibrary}
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      }
      menuVisible={false}
      setMenuVisible={() => {}}
      handleEdit={() => {}}
      handleDelete={() => {}}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{
              uri: getSecureImageUrl(book.volumeInfo.imageLinks?.thumbnail),
            }}
            style={styles.coverImage}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{book.volumeInfo.title}</Text>
            <Text style={styles.author}>
              {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
            </Text>
            {book.volumeInfo.publisher && (
              <Text style={styles.publisher}>
                Publisher: {book.volumeInfo.publisher}
              </Text>
            )}
            {book.volumeInfo.publishedDate && (
              <Text style={styles.publishDate}>
                Published: {book.volumeInfo.publishedDate}
              </Text>
            )}
            {book.volumeInfo.pageCount && (
              <Text style={styles.pages}>
                Pages: {book.volumeInfo.pageCount}
              </Text>
            )}
          </View>
        </View>

        {book.volumeInfo.categories && (
          <View style={styles.categoriesContainer}>
            {book.volumeInfo.categories.map((category, index) => (
              <View key={index} style={styles.categoryTag}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>
        )}

        {book.volumeInfo.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{book.volumeInfo.description}</Text>
          </View>
        )}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerButton: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonContainer: {
    backgroundColor: colors.primary,
    borderRadius: sizes.borderRadius,
    paddingHorizontal: 12,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 4,
    fontSize: sizes.fontSizeSmall,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  coverImage: {
    width: 120,
    height: 180,
    borderRadius: sizes.borderRadius,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: sizes.fontSizeLarge,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  author: {
    fontSize: sizes.fontSizeMedium,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  publisher: {
    fontSize: sizes.fontSizeSmall,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  publishDate: {
    fontSize: sizes.fontSizeSmall,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  pages: {
    fontSize: sizes.fontSizeSmall,
    color: colors.textSecondary,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 8,
  },
  categoryTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: 'white',
    fontSize: sizes.fontSizeSmall,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: sizes.fontSizeMedium,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: sizes.fontSizeSmall,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 50,
  },
}); 