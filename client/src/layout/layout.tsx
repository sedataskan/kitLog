import { StyleSheet, View } from "react-native";
import { TopHeader } from "../components/topHeader";
import { colors } from "../constants/colors";

export function Layout({ children, title }: any) {
  return (
    <View style={styles.container}>
      <TopHeader title={title} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
