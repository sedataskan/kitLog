import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, TouchableOpacity, Modal, FlexAlignType } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, Image } from "react-native";
import { colors } from "../constants/colors";
import { sizes } from "../constants/sizes";
import { getSecureImageUrl } from "../util/getSecureImageUrl";

export const FavImageSection = ({ book }: { book: any }) => {
  const { t } = useTranslation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [favPageImages, setFavPageImages] = useState<string[]>(
    book.favPageImage ? [book.favPageImage] : []
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const loadFavPageImages = async () => {
      try {
        const storedFavPageImages = await AsyncStorage.getItem(
          `favPageImages_${book.title}`
        );
        if (storedFavPageImages) {
          setFavPageImages(JSON.parse(storedFavPageImages));
        }
      } catch (error) {
        console.error("Error loading favorite page images", error);
      }
    };

    loadFavPageImages();
  }, [book.title]);

  const pickFavPageImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.status !== "granted") {
        alert(t("permission_required"));
        return;
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 3],
        quality: 0.5,
      });
      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        if (selectedAsset?.uri) {
          const updatedFavPageImages = [...favPageImages, selectedAsset.uri];
          setFavPageImages(updatedFavPageImages);
          await AsyncStorage.setItem(
            `favPageImages_${book.title}`,
            JSON.stringify(updatedFavPageImages)
          );
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert(t("error_picking_image"));
    }
  };

  return (
    <>
      <View style={styles.favPageImageContainer}>
        <Text style={styles.label}>{t("favPage")}</Text>
        <View>
          <TouchableOpacity
            style={[styles.addButton, styles.addButtonContainer]}
            onPress={pickFavPageImage}
          >
            <Ionicons name="add-circle" size={24} color="white" />
            <Text style={styles.addButtonText}>{t("add")}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.favPageImagesGrid}>
        {favPageImages.map((imageUri, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelectedImageIndex(index);
              setIsModalVisible(true);
            }}
            style={styles.favPageImageWrapper}
          >
            <Image
              source={{ uri: getSecureImageUrl(imageUri) }}
              style={styles.favPageImage}
            />
          </TouchableOpacity>
        ))}
      </View>
      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setIsModalVisible(false)}
          >
            {selectedImageIndex !== null && (
              <Image
                source={{
                  uri: getSecureImageUrl(favPageImages[selectedImageIndex]),
                }}
                style={styles.modalImage}
              />
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};
const styles = {
  label: {
    fontWeight: "bold",
    color: colors.textPrimary,
    fontSize: sizes.fontSizeSmall,
    marginRight: 140,
  },
  favPageImage: {
    width: "100%",
    height: 200,
    borderRadius: sizes.borderRadius,
    backgroundColor: colors.background,
    marginTop: 10,
  },
  favPageImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  addButton: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonContainer: {
    backgroundColor: colors.primary,
    borderRadius: sizes.borderRadius,
    paddingHorizontal: 12,
  },
  addButtonText: {
    color: "white",
    marginLeft: 4,
    fontSize: sizes.fontSizeSmall,
    fontWeight: "bold",
  },
  favPageImagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  favPageImageWrapper: {
    width: "48%",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.blur,
  },
  modalBackground: {
    width: "100%",
    height: "100%",
  },
  modalImage: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
    alignSelf: "center",
  },
};
