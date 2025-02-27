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

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: { status: string; rating: number; name: string }) => void;
  filters: {
    status: string;
    rating: number;
    name: string;
  };
}

const FilterModal = ({ visible, onClose, onApplyFilters, filters }: FilterModalProps) => {
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const translateY = useSharedValue(0);
  const backgroundOpacity = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0);
      backgroundOpacity.value = withSpring(1);
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
      const opacity = Math.max(0, 1 - event.translationY / 400);
      backgroundOpacity.value = opacity;
    },
    onEnd: (event) => {
      if (event.translationY > 100) {
        translateY.value = withSpring(1000, {}, () => {
          runOnJS(onClose)();
        });
        backgroundOpacity.value = withSpring(0);
      } else {
        translateY.value = withSpring(0);
        backgroundOpacity.value = withSpring(1);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity.value * 0.5})`,
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
    <Modal visible={visible} animationType="none" transparent>
      <Animated.View style={[styles.modalBackground, animatedBackgroundStyle]}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.modalContainer, animatedStyle]}>
            <View style={styles.header}>
              <Text style={styles.title}>Filter Books</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
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
        </PanGestureHandler>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
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
  rating: {
    paddingVertical: 5,
  },
});

export default FilterModal;
