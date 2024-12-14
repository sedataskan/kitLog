import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
      <Ionicons name="search" size={20} color="#4B6E7C" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#D4DCDF"
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderColor: "#D4DCDF",
    borderWidth: 2,
    marginTop: 2,
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
    color: "#4B6E7C",
  },
});
