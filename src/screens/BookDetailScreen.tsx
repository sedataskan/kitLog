import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Layout } from "../layout/layout";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, RouteProp } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import DropDownPicker from "react-native-dropdown-picker";

type BookDetailScreenRouteProp = RouteProp<
  {
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
          status?: string;
        };
      };
    };
  },
  "params"
>;

export default function BookDetailScreen({
  route,
}: {
  route: BookDetailScreenRouteProp;
}) {
  const { book } = route.params;
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);

  const getSecureImageUrl = (url: string | undefined) => {
    if (!url) return "https://via.placeholder.com/128x192?text=No+Cover";
    return url.replace("http://", "https://").replace("&edge=curl", "");
  };

  const addToLibrary = async () => {
    try {
      const existingBooks = await AsyncStorage.getItem("books");
      const books = existingBooks ? JSON.parse(existingBooks) : [];
      const bookExists = books.some(
        (existingBook: any) =>
          existingBook.title.toLowerCase() ===
          book.volumeInfo.title.toLowerCase()
      );

      if (bookExists) {
        alert(t("book_already_in_library"));
        return;
      }

      const newBook = {
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors?.[0] || t("unknown_author"),
        image: getSecureImageUrl(book.volumeInfo.imageLinks?.thumbnail),
        pages: book.volumeInfo.pageCount?.toString() || "0",
        publication: book.volumeInfo.publisher || t("unknown_publisher"),
        review: "",
        rating: 0,
        status: t("to_read"),
        saveDate: new Date(),
      };

      books.push(newBook);
      await AsyncStorage.setItem("books", JSON.stringify(books));

      alert(t("book_added_to_library"));
    } catch (error) {
      alert(t("failed_to_add_book"));
    }
  };

  return (
    <Layout
      canGoBack={true}
      title={t("book_details")}
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
          <Text style={styles.addButtonText}>{t("add")}</Text>
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
              {book.volumeInfo.authors?.join(", ") || t("unknown_author")}
            </Text>
            {book.volumeInfo.publisher && (
              <Text style={styles.publisher}>
                {t("publisher")}: {book.volumeInfo.publisher}
              </Text>
            )}
            {book.volumeInfo.publishedDate && (
              <Text style={styles.publishDate}>
                {t("published")}: {book.volumeInfo.publishedDate}
              </Text>
            )}
            {book.volumeInfo.pageCount && (
              <Text style={styles.pages}>
                {t("pages")}: {book.volumeInfo.pageCount}
              </Text>
            )}
            {book.volumeInfo.status && (
              <View style={styles.statusContainer}>
                <DropDownPicker
                  open={open}
                  value={book.volumeInfo.status}
                  items={[]}
                  setOpen={setOpen}
                  setValue={() => {}}
                  multiple={false}
                  style={styles.status}
                  containerStyle={{ width: "100%" }}
                  dropDownContainerStyle={{
                    backgroundColor: colors.background,
                  }}
                />
              </View>
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
            <Text style={styles.sectionTitle}>{t("description")}</Text>
            <Text style={styles.description}>
              {book.volumeInfo.description}
            </Text>
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
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonContainer: {
    backgroundColor: colors.primary,
    borderRadius: sizes.borderRadius,
    paddingHorizontal: 12,
  },
  addButtonText: {
    color: "white",
    marginLeft: 4,
    fontSize: sizes.fontSizeSmall,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
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
    justifyContent: "center",
  },
  title: {
    fontSize: sizes.fontSizeLarge,
    fontWeight: "bold",
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
  status: {
    marginBottom: 5,
    borderRadius: sizes.borderRadius,
    textAlign: "center",
    fontSize: sizes.fontSizeSmall,
    color: colors.textPrimary,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  statusContainer: {
    marginBottom: 20,
    marginTop: 10,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
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
    color: "white",
    fontSize: sizes.fontSizeSmall,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: sizes.fontSizeMedium,
    fontWeight: "bold",
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
