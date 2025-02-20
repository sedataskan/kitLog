import { StyleSheet, View } from "react-native";
import { TopHeader } from "../components/topHeader";
import { colors } from "../constants/colors";
import React from "react";

export function Layout({
  children,
  title,
  rightComponent,
  menuVisible,
  setMenuVisible,
  handleEdit,
  handleDelete,
}: any) {
  return (
    <View style={styles.container}>
      <TopHeader
        title={title}
        rightComponent={rightComponent}
        menuVisible={menuVisible}
        setMenuVisible={setMenuVisible}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
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
