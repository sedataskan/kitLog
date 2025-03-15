import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CurrentPageSectionProps {
  book: any;
  setParsedBook: React.Dispatch<React.SetStateAction<any>>;
}

export const CurrentPageSection: React.FC<CurrentPageSectionProps> = ({
  book,
  setParsedBook,
}) => {
  const { t } = useTranslation();

  const handleCurrentPageChange = async (newCurPage: number) => {
    setParsedBook((prevBook: any) => ({
      ...prevBook,
      currentPage: newCurPage,
    }));
    try {
      const existingBooks = await AsyncStorage.getItem("books");
      const books = existingBooks ? JSON.parse(existingBooks) : [];
      const updatedBooks = books.map((b: any) => {
        return {
          ...b,
          currentPage: b.title === book.title ? newCurPage : b.currentPage,
        };
      });
      await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
    } catch (error) {
      console.error("Error updating favorite page", error);
    }
  };

  return (
    <>
      <Text style={styles.label}>{t("current_page")}</Text>
      <View style={styles.incrementContainer}>
        <TouchableOpacity
          style={styles.incrementButton}
          onPress={() => {
            const newCurPage = book.currentPage - 1;
            handleCurrentPageChange(newCurPage);
          }}
        >
          <Text style={styles.incrementButtonText}>-</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.incrementInput}
          value={String(book.currentPage)}
          keyboardType="numeric"
          onChangeText={(text) => {
            const newCurPage = parseInt(text, 10) || 0;
            handleCurrentPageChange(newCurPage);
          }}
        />
        <TouchableOpacity
          style={styles.incrementButton}
          onPress={() => {
            const newCurPage = book.currentPage + 1;
            handleCurrentPageChange(newCurPage);
          }}
        >
          <Text style={styles.incrementButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    fontWeight: "bold",
    color: colors.textPrimary,
    fontSize: sizes.fontSizeSmall,
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
    color: colors.white,
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
