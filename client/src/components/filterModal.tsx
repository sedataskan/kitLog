import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/colors";
import { Rating } from "react-native-ratings";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const FilterModal = ({ visible, onClose, onApplyFilters, filters }) => {
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      setStatus(filters.status);
      setRating(filters.rating);
      setName(filters.name);
    }
  }, [visible]);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
      if (event.translationY > 100) {
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const applyFilters = () => {
    onApplyFilters({ status, rating, name });
    onClose();
  };

  const clearFilters = () => {
    setStatus("");
    setRating(0);
    setName("");
    onApplyFilters({ status: "", rating: 0, name: "" });
    onClose();
  };

  const hasFilters = status || rating || name;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBackground}>
        <Animated.View style={[styles.modalContainer, animatedStyle]}>
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={styles.header}>
              <Text style={styles.title}>Filter Books</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </Animated.View>
          </PanGestureHandler>
          <View style={styles.headerBorder} />
          <View style={styles.contentContainer}>
            <TextInput
              placeholder="Name"
              placeholderTextColor={Platform.OS === "ios" ? "gray" : undefined}
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Status (Disabled)"
              placeholderTextColor={Platform.OS === "ios" ? "gray" : undefined}
              value={status}
              onChangeText={setStatus}
              style={styles.input}
              editable={false}
            />
            <View
              style={[
                styles.ratingContainer,
                rating > 0 && styles.ratingApplied,
              ]}
            >
              <Rating
                type="star"
                ratingColor={colors.primary}
                ratingBackgroundColor="transparent"
                ratingCount={5}
                imageSize={24}
                fractions={1}
                jumpValue={0.5}
                onFinishRating={setRating}
                style={styles.rating}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
              {hasFilters && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearFilters}
                >
                  <Text style={styles.clearButtonText}>Clear Filters</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    height: "90%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 15,
    paddingBottom: 5,
  },
  contentContainer: {
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  headerBorder: {
    height: 1,
    backgroundColor: colors.primary,
    opacity: 0.5,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "black",
  },
  ratingContainer: {
    paddingVertical: 10,
    marginBottom: 20,
  },
  ratingApplied: {
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  applyButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  applyButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  clearButton: {
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    flex: 1,
  },
  clearButtonText: {
    color: colors.textSecondary,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default FilterModal;
