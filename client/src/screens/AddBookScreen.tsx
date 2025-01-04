import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, Button, Image } from "react-native";
import { Layout } from "../layout/layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Rating } from "react-native-ratings";
import { useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import { ScrollView } from "react-native-gesture-handler";

type AddBookScreenRouteProp = RouteProp<
  { params: { onBookAdded: (book: any) => void } },
  "params"
>;

export default function AddBookScreen({
  route,
}: {
  route: AddBookScreenRouteProp;
}) {
  const { onBookAdded } = route.params;
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState("");
  const [publication, setPublication] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!title || !author || !pages) {
      setError("Title, Author, and Number of Pages are mandatory.");
      return;
    }

    const book = {
      title,
      author,
      pages,
      publication,
      review,
      rating: rating || 2.5,
      image,
      saveDate: new Date().toISOString(),
    };

    try {
      const existingBooks = await AsyncStorage.getItem("books");
      const books = existingBooks ? JSON.parse(existingBooks) : [];
      books.push(book);
      await AsyncStorage.setItem("books", JSON.stringify(books));
      alert("Book saved successfully!");
      setError("");
      setTitle("");
      setAuthor("");
      setPages("");
      setPublication("");
      setReview("");
      setRating(0);
      setImage("");
      onBookAdded(book);
      navigation.navigate("BookPreview" as never, { book });
    } catch (error) {
      console.error("Error saving book", error);
    }
  };

  return (
    <Layout title="Add Book">
      <ScrollView>
        <KeyboardAvoidingScrollView contentContainerStyle={styles.container}>
          <View style={styles.topSection}>
            <Image
              source={
                image
                  ? { uri: image }
                  : require("../../assets/images/unknownBook.jpg")
              }
              style={styles.image}
            />
            <View style={styles.inputSection}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Book Title <Text style={styles.mandatory}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Author <Text style={styles.mandatory}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={author}
                  onChangeText={setAuthor}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Number of Pages <Text style={styles.mandatory}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={pages}
                  onChangeText={setPages}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Publication</Text>
                <TextInput
                  style={styles.input}
                  value={publication}
                  onChangeText={setPublication}
                />
              </View>
            </View>
          </View>
          <Rating
            type="heart"
            ratingColor="#3498db"
            ratingBackgroundColor="transparent"
            ratingCount={5}
            imageSize={40}
            fractions={1}
            jumpValue={0.5}
            onFinishRating={setRating}
            style={{
              paddingVertical: 10,
              marginBottom: 10,
              backgroundColor: "transparent",
            }}
          />
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              value={image}
              onChangeText={setImage}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Review</Text>
            <TextInput
              style={styles.input}
              value={review}
              onChangeText={setReview}
            />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.button}>
            <Button color="#4B6E7C" title="Save Book" onPress={handleSave} />
          </View>
        </KeyboardAvoidingScrollView>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
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
    color: "#000",
  },
  mandatory: {
    color: "#4B6E7C",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "#000",
  },
  image: {
    width: 120,
    height: 180,
    borderRadius: 10,
    backgroundColor: "#D3D3D3",
  },
  button: {
    marginTop: 20,
    width: 150,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#D4DCDF",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
