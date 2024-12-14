import React from "react";
import { TextInput, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputBoxProps {
  placeholder: string;
  secureTextEntry?: boolean;
}

export default function InputBox({
  placeholder,
  secureTextEntry,
}: InputBoxProps) {
  const iconName =
    placeholder === "Username"
      ? "person"
      : placeholder === "Password"
      ? "lock-closed"
      : "home";
  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={20} color="#D4DCDF" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#D4DCDF"
        secureTextEntry={secureTextEntry}
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
    marginTop: 12,
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
    color: "#black",
  },
});
