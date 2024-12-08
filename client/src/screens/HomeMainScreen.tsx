import { View, StyleSheet, Text } from "react-native";
import { Layout } from "../layout/layout";

export default function HomeMainScreen() {
  return (
    <Layout title={"Home"}>
      <View style={styles.container}>
        <Text>Home Screen</Text>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
  },
});
