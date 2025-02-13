import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";

interface SearchBoxProps {
  placeholder: string;
  onChangeText: (text: string) => void;
}

export default function SearchBox({
  placeholder,
  onChangeText,
}: SearchBoxProps) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={sizes.fontSizeLarge}
        color={colors.primary}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.secondary}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: sizes.borderRadius,
    borderColor: colors.secondary,
    borderWidth: 2,
    marginTop: 4,
    marginLeft: 8,
    marginRight: 8,
  },
  icon: {
    marginLeft: 8,
  },
  input: {
    height: 40,
    flex: 1,
    marginLeft: 8,
    color: colors.primary,
    fontSize: sizes.fontSizeSmall,
  },
});
