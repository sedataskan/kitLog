import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import { Layout } from "../layout/layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import { ScrollView } from "react-native-gesture-handler";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { StarRating } from "../components/StarRating";
import { useTranslation } from "react-i18next";
import DropDownPicker from "react-native-dropdown-picker";

type AddBookScreenRouteProp = RouteProp<
  {
    params: { onBookAdded: (book: any) => void; book?: any; isEdit?: boolean };
  },
  "params"
>;

export default function AddBookScreen({
  route,
}: {
  route: AddBookScreenRouteProp;
}) {
  const { onBookAdded = () => {}, book, isEdit } = route.params;
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState("");
  const [publication, setPublication] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(2.5);
  const [image, setImage] = useState("");
  const [favPageImage, setFavPageImage] = useState("");
  const [favPage, setFavPage] = useState(0);
  const [error, setError] = useState("");
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (isEdit && book) {
      setTitle(book.title);
      setAuthor(book.author);
      setPages(book.pages);
      setPublication(book.publication);
      setReview(book.review);
      setRating(book.rating);
      setImage(book.image);
      setStatus(book.status);
      setFavPageImage(book.favPageImage);
      setFavPage(book.favPage);
      setCurrentPage(book.currentPage);
    }
  }, [isEdit, book]);

  const handleSave = async () => {
    const missingFields = [];
    if (!title) missingFields.push(t("title"));
    if (!status) missingFields.push(t("status"));

    if (missingFields.length > 0) {
      setError(`${t("mandatory_fields")}: ${missingFields.join(", ")}`);
      setErrorFields(missingFields);
      return;
    }

    const newBook = {
      title,
      author,
      pages,
      publication,
      review,
      rating: rating || 2.5,
      image,
      favPageImage,
      favPage,
      saveDate: new Date(),
      status,
      currentPage: currentPage ?? 0,
    };

    try {
      const existingBooks = await AsyncStorage.getItem("books");
      let books = existingBooks ? JSON.parse(existingBooks) : [];

      books = books.map((b: any) => ({
        ...b,
        currentPage: Number(b.currentPage),
      }));
      if (isEdit) {
        const updatedBooks = books.map((b: any) =>
          b.title === book.title ? newBook : b
        );
        await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
        alert(t("book_updated_successfully"));
      } else {
        newBook.currentPage = Number(newBook.currentPage);
        books.push(newBook);
        await AsyncStorage.setItem("books", JSON.stringify(books));
        alert(t("book_saved_successfully"));
      }
      setError("");
      setErrorFields([]);
      setTitle("");
      setAuthor("");
      setPages("");
      setPublication("");
      setReview("");
      setRating(2.5);
      setImage("");
      setStatus("");
      setFavPageImage("");
      setFavPage(0);
      setCurrentPage(0);
      onBookAdded(newBook);
      navigation.navigate("BookPreview" as never, {
        book: newBook,
      });
    } catch (error) {
      console.error("Error saving book", error);
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.status !== "granted") {
        alert(t("permission_required"));
        return;
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 3],
        quality: 0.5,
      });
      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        if (selectedAsset?.uri) {
          setImage(selectedAsset.uri);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert(t("error_picking_image"));
    }
  };

  const pickFavPageImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.status !== "granted") {
        alert(t("permission_required"));
        return;
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 3],
        quality: 0.5,
      });
      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        if (selectedAsset?.uri) {
          setFavPageImage(selectedAsset.uri);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert(t("error_picking_image"));
    }
  };

  const getStatusLabel = (statusKey: string) => {
    switch (statusKey) {
      case "read":
        return t("read");
      case "to_read":
        return t("to_read");
      case "currently_reading":
        return t("currently_reading");
    }
  };

  const handleStatusChange = async (newStatusKey: string) => {
    setStatus(newStatusKey);
    if (book) {
      try {
        const existingBooks = await AsyncStorage.getItem("books");
        const books = existingBooks ? JSON.parse(existingBooks) : [];
        const updatedBooks = books.map((b: any) =>
          b.title === book.title ? { ...b, status: newStatusKey } : b
        );
        await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
      } catch (error) {
        console.error("Error updating book status", error);
      }
    }
  };

  const items = [
    { label: t("read"), value: "read" },
    { label: t("to_read"), value: "to_read" },
    { label: t("currently_reading"), value: "currently_reading" },
  ];

  return (
    <Layout title={isEdit ? t("edit_book") : t("add_book")} canGoBack={true}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <KeyboardAvoidingScrollView contentContainerStyle={styles.container}>
          <View style={styles.topSection}>
            <TouchableOpacity
              onPress={pickImage}
              style={styles.imageContainer}
              activeOpacity={0.7}
            >
              <Image
                source={
                  image
                    ? { uri: image }
                    : require("../../assets/images/unknownBook.jpg")
                }
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay}>
                <Text style={styles.imageOverlayText}>
                  {t("tap_to_change_image")}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.inputSection}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  {t("title")} <Text style={styles.mandatory}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    errorFields.includes(t("title")) && styles.inputError,
                  ]}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  {t("status")} <Text style={styles.mandatory}>*</Text>
                </Text>
                <DropDownPicker
                  open={open}
                  value={status}
                  items={items}
                  setOpen={setOpen}
                  setValue={(callback) => {
                    const newStatusKey = callback(status);
                    setStatus(newStatusKey);
                    handleStatusChange(newStatusKey);
                  }}
                  setItems={() => {}}
                  style={styles.statusDropdown}
                  dropDownContainerStyle={{
                    backgroundColor: colors.background,
                    borderColor: colors.secondary,
                  }}
                  selectedItemContainerStyle={{
                    backgroundColor: colors.backgroundSecondary,
                  }}
                  placeholder={getStatusLabel(status)}
                />
              </View>
              {status === "read" && (
                <View style={[styles.inputContainer, styles.ratingContainer]}>
                  <StarRating
                    rating={rating}
                    onRatingChange={(value) => setRating(value)}
                    size={sizes.fontSizeLarge * 1.3}
                  />
                </View>
              )}
              {status === "currently_reading" && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>{t("current_page")}</Text>
                  <TextInput
                    style={styles.input}
                    value={currentPage.toString()}
                    onChangeText={(text) => {
                      setCurrentPage(text);
                    }}
                    keyboardType="numeric"
                  />
                </View>
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("review")}</Text>
            <TextInput
              style={[styles.input, styles.reviewInput]}
              value={review}
              onChangeText={setReview}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity
            style={styles.additionalFieldsButton}
            onPress={() => setShowAdditionalFields(!showAdditionalFields)}
          >
            <Text style={styles.additionalFieldsText}>
              {t("additional_fields")}
            </Text>
            <Ionicons
              name={showAdditionalFields ? "chevron-up" : "chevron-down"}
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>

          {showAdditionalFields && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("author")}</Text>
                <TextInput
                  style={[
                    styles.input,
                    errorFields.includes(t("author")) && styles.inputError,
                  ]}
                  value={author}
                  onChangeText={setAuthor}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("number_of_pages")}</Text>
                <TextInput
                  style={[
                    styles.input,
                    errorFields.includes(t("number_of_pages")) &&
                      styles.inputError,
                  ]}
                  value={pages}
                  onChangeText={setPages}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("publication")}</Text>
                <TextInput
                  style={styles.input}
                  value={publication}
                  onChangeText={setPublication}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t("favPageNumber")}</Text>
                <TextInput
                  style={styles.input}
                  value={favPage.toString()}
                  onChangeText={(text) => setFavPage(Number(text))}
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity
                onPress={pickFavPageImage}
                style={styles.favPageImage}
                activeOpacity={0.7}
              >
                <Image
                  source={
                    favPageImage
                      ? { uri: favPageImage }
                      : require("../../assets/images/unknownBook.jpg")
                  }
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay}>
                  <Text style={styles.imageOverlayText}>
                    {t("tap_to_change_fav_page_image")}
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.button}>
            <Button
              color={colors.primary}
              title={t("save")}
              onPress={handleSave}
            />
          </View>
        </KeyboardAvoidingScrollView>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  topSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  inputSection: {
    flex: 1,
    marginLeft: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    color: colors.textPrimary,
    fontSize: sizes.fontSizeSmall,
  },
  mandatory: {
    color: colors.primary,
    fontSize: sizes.fontSizeSmall,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 5,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: sizes.borderRadius,
    backgroundColor: colors.backgroundSecondary,
  },
  button: {
    marginTop: 20,
    width: 150,
    borderRadius: sizes.borderRadius,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  error: {
    color: colors.error,
    marginBottom: 10,
    fontSize: sizes.fontSizeSmall,
  },
  statusDropdown: {
    width: "100%",
    backgroundColor: colors.background,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  backButton: {
    fontSize: sizes.fontSizeLarge,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  imageContainer: {
    position: "relative",
    width: 120,
    height: 180,
    borderRadius: sizes.borderRadius,
    overflow: "hidden",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 5,
    alignItems: "center",
  },
  imageOverlayText: {
    color: "white",
    fontSize: sizes.fontSizeSmall,
  },
  ratingContainer: {
    paddingVertical: 10,
    alignItems: "center",
  },
  additionalFieldsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 5,
    marginVertical: 10,
    width: "100%",
  },
  additionalFieldsText: {
    color: colors.primary,
    fontSize: sizes.fontSizeMedium,
    fontWeight: "bold",
  },
  reviewInput: {
    height: 100,
    textAlignVertical: "top",
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
});
