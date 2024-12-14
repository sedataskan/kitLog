import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Layout } from "../layout/layout";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("Login" as never);
  };
  return (
    <Layout title="Profile">
      <View style={styles.container}>
        <Text>Profile Screen</Text>
      </View>
      <TouchableOpacity style={styles.floatingButton} onPress={handlePress}>
        <Ionicons name="log-out" size={24} color="#fff" />
      </TouchableOpacity>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
  },
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
