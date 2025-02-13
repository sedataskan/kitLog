import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";

export const TopHeader = ({ title }: { title: string }) => {
  const navigation = useNavigation();
  const route = useRoute();

  const isAddBookPage = route.name === "AddBook";
  const isBookPreviewPage = route.name === "BookPreview";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {(isAddBookPage || isBookPreviewPage) && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>&larr;</Text>
          </TouchableOpacity>
        )}
        <Text style={[styles.title]}>{title}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.secondary,
    paddingTop: 0,
  },
  headerContainer: {
    height: sizes.headerHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    backgroundColor: colors.secondary,
    borderBottomLeftRadius: sizes.borderRadius,
    borderBottomRightRadius: sizes.borderRadius,
    width: "100%",
  },
  backButton: {
    fontSize: sizes.fontSizeLarge,
    fontWeight: "bold",
    color: colors.primary,
    marginRight: 10,
  },
  title: {
    fontSize: sizes.fontSizeLarge,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "left",
    flex: 1,
  },
});
