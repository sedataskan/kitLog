import { View, StyleSheet, Text } from "react-native";
import { Layout } from "../layout/layout";

export default function ProfileScreen() {
  return (
    <Layout title="Profile">
      <View style={styles.container}>
        <Text>Profile Screen</Text>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
  },
});
