import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function AddButton() {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("AddBook" as never);
  };

  return (
    <TouchableOpacity style={styles.floatingButton} onPress={handlePress}>
      <Ionicons name="add-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    top: 720,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#4B6E7C",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    zIndex: 1,
  },
});
