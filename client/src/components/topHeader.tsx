import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export const TopHeader = ({
  title,
  avatarUrl,
}: {
  title: string;
  avatarUrl: string;
}) => {
  const navigation = useNavigation();
  const route = useRoute();

  const isAddBookPage = route.name === "AddBook";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {isAddBookPage && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>&larr;</Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.title]}>{title}</Text>

        {!isAddBookPage && (
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile" as never)}
          >
            <Image
              source={{
                uri: avatarUrl,
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#f0f0f0",
  },
  headerContainer: {
    height: 90,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    backgroundColor: "#D4DCDF",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  backButton: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4B6E7C",
    marginRight: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#4B6E7C",
    textAlign: "left",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: "#4B6E7C",
  },
});
