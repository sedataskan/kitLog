import React, { useState } from "react";
import { View, StyleSheet, Text, Image, ScrollView, Alert } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { getSecureImageUrl } from "../util/getSecureImageUrl";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";
import { Layout } from "../layout/layout";
import { CustomDropDownPicker } from "../components/CustomDropDownPicker";
import { StarRating } from "../components/StarRating";
import { CurrentPageSection } from "../components/CurrentPageSection";
import { FavImageSection } from "../components/FavImageSection";
import { StackNavigationProp } from "@react-navigation/stack";

type BookPreviewScreenRouteProp = RouteProp<
  {
    params: {
      book: {
        title: string;
        author: string;
        pages: string;
        publication: string;
        review: string;
        rating: number;
        image: string;
        status: string;
        favPage?: number;
        favPageImage?: string;
        currentPage?: number;
      };
    };
  },
  "params"
>;

type RootStackParamList = {
  BookPreview: { book: any };
  AddBook: { onBookAdded?: (book: any) => void; book?: any; isEdit?: boolean };
  book: { book: any };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export default function BookPreviewScreen() {
  const route = useRoute<BookPreviewScreenRouteProp>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();
  const { book } = route.params;
  const [menuVisible, setMenuVisible] = useState(false);
  const [bookStatus, setBookStatus] = useState(book.status);
  const [open, setOpen] = useState(false);
  const safeParseNumber = (value: any, defaultValue: number = 0) => {
    return !isNaN(Number(value)) && value !== null
      ? Number(value)
      : defaultValue;
  };

  const [parsedBook, setParsedBook] = useState({
    ...book,
    status: book.status ? book.status : t("to_read"),
    favPage: safeParseNumber(book.favPage, 1),
    currentPage: safeParseNumber(book.currentPage, 1),
    image: book.image ? book.image : "",
  });

  const handleEdit = () => {
    setMenuVisible(false);
    navigation.navigate("AddBook", {
      book: {
        ...parsedBook,
        status: bookStatus,
        rating: parsedBook.rating,
        favPage: parsedBook.favPage,
        currentPage: parsedBook.currentPage,
      },
      isEdit: true,
    });
  };

  const handleDelete = async () => {
    setMenuVisible(false);
    Alert.alert(t("delete_book"), t("delete_book_confirmation"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            const existingBooks = await AsyncStorage.getItem("books");
            const books = existingBooks ? JSON.parse(existingBooks) : [];
            const updatedBooks = books.filter(
              (b: any) => b.title !== book.title
            );
            await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
            navigation.goBack();
          } catch (error) {
            console.error("Error deleting book", error);
          }
        },
      },
    ]);
  };

  const handleStatusChange = async (newStatusKey: string) => {
    setBookStatus(newStatusKey);
    setParsedBook((prevBook) => ({
      ...prevBook,
      status: newStatusKey,
    }));
    try {
      const existingBooks = await AsyncStorage.getItem("books");
      const books = existingBooks ? JSON.parse(existingBooks) : [];
      const updatedBooks = books.map((b: any) => {
        return {
          ...b,
          currentPage: !isNaN(Number(b?.currentPage))
            ? Number(b?.currentPage)
            : 0,
          status: b.title === book.title ? newStatusKey : b.status,
        };
      });
      await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
    } catch (error) {
      console.error("Error updating book status", error);
    }
  };

  const handleRatingChange = async (newRating: number) => {
    setParsedBook((prevBook) => ({
      ...prevBook,
      rating: newRating,
    }));
    try {
      const existingBooks = await AsyncStorage.getItem("books");
      const books = existingBooks ? JSON.parse(existingBooks) : [];
      const updatedBooks = books.map((b: any) => {
        return {
          ...b,
          rating: b.title === book.title ? newRating : b.rating,
        };
      });
      await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
    } catch (error) {
      console.error("Error updating book rating", error);
    }
  };

  if (!book) {
    return (
      <Layout title={t("book_preview")}>
        <View style={styles.container}>
          <Text style={styles.errorText}>
            {t("book_details_not_available")}
          </Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout
      canGoBack={true}
      title={parsedBook.title}
      menuVisible={menuVisible}
      setMenuVisible={setMenuVisible}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        style={styles.scrollView}
      >
        <Image
          source={
            parsedBook.image && typeof parsedBook.image === "string"
              ? { uri: getSecureImageUrl(parsedBook.image) }
              : require("../../assets/images/noCover.jpg")
          }
          style={styles.image}
        />
        <Text style={styles.title}>{parsedBook.title}</Text>
        <Text style={styles.author}>{parsedBook.author}</Text>
        {bookStatus?.toLowerCase() === "read" && (
          <View style={styles.ratingContainer}>
            <StarRating
              rating={parsedBook.rating}
              onRatingChange={handleRatingChange}
              size={sizes.fontSizeLarge * 1.2}
            />
          </View>
        )}
        <View style={styles.statusContainer}>
          <CustomDropDownPicker
            open={open}
            value={bookStatus}
            setOpen={setOpen}
            setValue={(callback) => {
              const newStatusKey =
                typeof callback === "function"
                  ? callback(bookStatus)
                  : callback;
              setBookStatus(newStatusKey);
              handleStatusChange(newStatusKey);
            }}
          />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.detailsSection}>
            {parsedBook.publication && (
              <>
                <Text style={styles.label}>{t("publication")}</Text>
                <Text style={styles.value}>{parsedBook.publication}</Text>
              </>
            )}
            {parsedBook.review && (
              <>
                <Text style={styles.label}>{t("review")}</Text>
                <Text style={styles.value}>{parsedBook.review}</Text>
              </>
            )}
            {parsedBook.pages && (
              <>
                <Text style={styles.label}>{t("pages")}</Text>
                <Text style={styles.value}>{parsedBook.pages}</Text>
              </>
            )}
            {parsedBook.status === "currently_reading" && (
              <CurrentPageSection
                book={parsedBook}
                setParsedBook={setParsedBook}
              />
            )}
            {(parsedBook.status === "read" ||
              parsedBook.status === "currently_reading") && (
              <FavImageSection book={parsedBook} />
            )}
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  textContainer: {
    width: "100%",
    alignItems: "center",
  },
  detailsSection: {
    width: "90%",
    padding: 10,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: sizes.borderRadius,
  },
  label: {
    fontWeight: "bold",
    color: colors.textPrimary,
    fontSize: sizes.fontSizeSmall,
  },
  value: {
    marginBottom: 10,
    color: colors.textPrimary,
    fontSize: sizes.fontSizeSmall,
  },
  title: {
    marginBottom: 5,
    color: colors.textPrimary,
    fontSize: sizes.fontSizeLarge,
    fontFamily: "DancingScript",
  },
  author: {
    marginBottom: 5,
    color: colors.textPrimary,
    fontSize: sizes.fontSizeSmall,
    fontStyle: "italic",
  },
  image: {
    width: 150,
    height: 240,
    borderRadius: sizes.borderRadius,
    backgroundColor: colors.background,
    marginBottom: 10,
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
  statusDropdown: {
    width: "100%",
    backgroundColor: colors.background,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  errorText: {
    color: colors.error,
    fontSize: sizes.fontSizeMedium,
  },
  button: {
    marginTop: 20,
    width: 150,
    borderRadius: sizes.borderRadius,
    borderWidth: 2,
    borderColor: colors.error,
  },
  menuButton: {
    fontSize: sizes.fontSizeLarge,
    color: colors.textPrimary,
    padding: 10,
  },
  ratingContainer: {
    paddingVertical: 10,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  incrementContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  incrementButton: {
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: sizes.borderRadius,
  },
  incrementButtonText: {
    color: colors.textPrimary,
    fontSize: sizes.fontSizeMedium,
  },
  incrementInput: {
    width: 50,
    height: 40,
    textAlign: "center",
    borderColor: colors.secondary,
    borderWidth: 1,
    marginHorizontal: 10,
    borderRadius: sizes.borderRadius,
    color: colors.textPrimary,
    fontSize: sizes.fontSizeMedium,
  },
});
