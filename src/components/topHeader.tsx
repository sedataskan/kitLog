import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import React from "react";
import { useTranslation } from "react-i18next";

export const TopHeader = ({
  title,
  rightComponent,
  menuVisible,
  setMenuVisible,
  handleEdit,
  handleDelete,
  canGoBack = true,
}: {
  title: string;
  rightComponent?: React.ReactNode;
  menuVisible?: boolean;
  setMenuVisible?: (visible: boolean) => void;
  handleEdit?: () => void;
  handleDelete?: () => void;
  canGoBack?: boolean;
}) => {
  const navigation = useNavigation();
  const route = useRoute<{
    key: string;
    name: string;
    params: { book?: any };
  }>();
  const isAddBookPage = route.name === "AddBook";
  const isBookPreviewPage = route.name === "BookPreview";

  const { t } = useTranslation();

  const handleBackPress = () => {
    if (isAddBookPage && route.params?.book) {
      const book = route.params?.book;
      navigation.navigate("BookPreview" as never, { book });
    } else if (isBookPreviewPage) {
      navigation.navigate("Main" as never);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.headerContainer}>
        {canGoBack && (
          <TouchableOpacity onPress={handleBackPress}>
            <Text style={styles.backButton}>&larr;</Text>
          </TouchableOpacity>
        )}
        <Text style={[styles.title]}>{title}</Text>
        {isBookPreviewPage &&
          menuVisible !== undefined &&
          setMenuVisible &&
          handleEdit &&
          handleDelete && (
            <Menu
              visible={menuVisible}
              anchor={
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                  <Text style={styles.menuButton}>⋮</Text>
                </TouchableOpacity>
              }
              onRequestClose={() => setMenuVisible(false)}
            >
              <MenuItem onPress={handleEdit}>{t("edit")}</MenuItem>
              <MenuDivider />
              <MenuItem
                onPress={handleDelete}
                textStyle={{ color: colors.error }}
              >
                {t("delete")}
              </MenuItem>
            </Menu>
          )}
        {rightComponent && (
          <View style={styles.rightComponent}>{rightComponent}</View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingBottom: 10,
  },
  headerContainer: {
    height: sizes.headerHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    backgroundColor: colors.background,
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
  rightComponent: {
    marginLeft: "auto",
  },
  menuButton: {
    fontSize: sizes.fontSizeLarge,
    color: colors.textPrimary,
    padding: 10,
  },
});
