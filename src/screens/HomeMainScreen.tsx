import { StyleSheet, Text } from "react-native";
import { Layout } from "../layout/layout";
import React from "react";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";

export default function HomeMainScreen() {
  return (
    <Layout
      title="Home"
      rightComponent={<></>}
      menuVisible={false}
      setMenuVisible={() => {}}
      handleEdit={() => {}}
      handleDelete={() => {}}
    >
      <Text> Home Screen </Text>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: 20,
    alignItems: "center",
  },
  welcomeMessage: {
    fontSize: sizes.fontSizeLarge,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    alignItems: "center",
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: sizes.fontSizeMedium,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: 20,
    marginBottom: 10,
  },
  sectionTitleTop: {
    fontSize: sizes.fontSizeMedium,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  bookContainer: {
    marginRight: 10,
  },
  reviewContainer: {
    backgroundColor: colors.backgroundSecondary,
    padding: 10,
    borderRadius: sizes.borderRadius,
    marginBottom: 10,
    elevation: 2,
    width: "90%",
  },
  reviewBook: {
    fontWeight: "bold",
    fontSize: sizes.fontSizeSmall,
  },
  reviewText: {
    marginTop: 5,
    fontSize: sizes.fontSizeSmall,
  },
  featuredBooksContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
