import { View, StyleSheet, Text } from "react-native";
import { Layout } from "../layout/layout";

export default function RegisterScreen() {
  return (
    <Layout title={"Register"}>
      <View style={styles.container}>
        <Text>Register Screens</Text>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
  },
});
