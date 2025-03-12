import React, { useState } from "react";
import { View, StyleSheet, Text, Image, ScrollView, Alert } from "react-native";
import { Layout } from "../layout/layout";
import DropDownPicker from "react-native-dropdown-picker";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { StarRating } from "../components/StarRating";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";
import { useTranslation } from "react-i18next";

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
        saveDate: Date;
        status: string;
        favPage?: number;
        favPageImage?: string;
      };
    };
  },
  "params"
>;

export default function BookPreviewScreen() {
  const route = useRoute<BookPreviewScreenRouteProp>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { book } = route.params;
  const [menuVisible, setMenuVisible] = useState(false);
  const [bookStatus, setBookStatus] = useState(book.status);
  const [open, setOpen] = useState(false);

  const getSecureImageUrl = (url: string | undefined) => {
    if (!url) return "https://via.placeholder.com/128x192?text=No+Cover";
    return url.replace("http://", "https://").replace("&edge=curl", "");
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

  const parsedBook = {
    ...book,
    saveDate: new Date(book.saveDate),
    status: book.status ? book.status : t("to_read"),
    favPage: book.favPage ? book.favPage : 0,
  };

  const handleEdit = () => {
    setMenuVisible(false);
    navigation.navigate("AddBook", {
      book: {
        ...parsedBook,
        status: bookStatus,
        saveDate: parsedBook.saveDate.toISOString(),
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

  const handleStatusChange = async (newStatus: string) => {
    setBookStatus(newStatus);
    try {
      const existingBooks = await AsyncStorage.getItem("books");
      const books = existingBooks ? JSON.parse(existingBooks) : [];
      const updatedBooks = books.map((b: any) =>
        b.title === book.title ? { ...b, status: newStatus } : b
      );
      await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
    } catch (error) {
      console.error("Error updating book status", error);
    }
  };

  const [items, setItems] = useState([
    { label: t("read"), value: t("read") },
    { label: t("to_read"), value: t("to_read") },
    { label: t("currently_reading"), value: t("currently_reading") },
  ]);
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
            parsedBook.image
              ? { uri: getSecureImageUrl(parsedBook.image) }
              : require("../../assets/images/unknownBook.jpg")
          }
          style={styles.image}
        />
        <Text style={styles.title}>{parsedBook.title}</Text>
        <Text style={styles.author}>{parsedBook.author}</Text>
        <Text style={styles.date}>
          {parsedBook.saveDate
            ? new Date(parsedBook.saveDate).toLocaleDateString()
            : "-"}
        </Text>
        {(bookStatus.toLowerCase() === "read" ||
          bookStatus.toLowerCase() === "okudum") && (
          <View style={styles.ratingContainer}>
            <StarRating
              rating={parsedBook.rating}
              onRatingChange={() => {}}
              size={sizes.fontSizeLarge * 1.2}
            />
          </View>
        )}
        <View style={styles.statusContainer}>
          <DropDownPicker
            open={open}
            value={bookStatus}
            items={items}
            setOpen={setOpen}
            setValue={(callback) => {
              const newStatus = callback(bookStatus);
              setBookStatus(newStatus);
              handleStatusChange(newStatus);
            }}
            setItems={setItems}
            style={styles.status}
            containerStyle={{ width: "100%" }}
            dropDownContainerStyle={{ backgroundColor: colors.background }}
          />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.detailsSection}>
            {parsedBook.pages && (
              <>
                <Text style={styles.label}>{t("pages")}</Text>
                <Text style={styles.value}>{parsedBook.pages}</Text>
              </>
            )}
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
            {parsedBook.favPageImage && (
              <>
                <Text style={styles.label}>
                  {t("favPage") + " | "}
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: sizes.fontSizeSmall,
                      fontStyle: "italic",
                    }}
                  >
                    {parsedBook.favPage ? parsedBook.favPage : "-"}
                  </Text>
                </Text>
                <Image
                  source={{ uri: getSecureImageUrl(parsedBook.favPageImage) }}
                  style={styles.favPageImage}
                />
              </>
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
  date: {
    marginBottom: 5,
    color: colors.textSecondary,
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
  favPageImage: {
    width: 200,
    height: 200,
    borderRadius: sizes.borderRadius,
    backgroundColor: colors.background,
    margin: 10,
    marginLeft: "20%",
    marginRight: "20%",
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
});
