import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Button,
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
import { StarRating } from './StarRating';
import { Picker } from '@react-native-picker/picker';

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
  const translateY = useSharedValue(1000);
  const backgroundOpacity = useSharedValue(0);
  const [isPickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });
      backgroundOpacity.value = withSpring(1);
    } else {
      translateY.value = 1000;
      backgroundOpacity.value = 0;
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

  const handleRatingChange = (value: number) => {
    if (value === 0) {
      setRating(0);
    } else {
      const roundedValue = Math.round(value * 2) / 2;
      setRating(roundedValue);
    }
  };

  return (
    <Modal visible={visible} animationType="none" transparent>
      <Animated.View style={[styles.modalBackground, animatedBackgroundStyle]}>
        <PanGestureHandler onGestureEvent={gestureHandler} minDist={10}>
          <Animated.View style={[styles.modalContainer, animatedStyle]}>
            <View style={styles.header}>
              <Text style={styles.title}>Filter Books</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  placeholder="Enter name"
                  placeholderTextColor={colors.textSecondary}
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Status</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setPickerVisible(true)}
                >
                  <Text style={[
                    styles.dropdownText,
                    !status && styles.placeholderText
                  ]}>
                    {status || "Select Status"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.ratingContainer, rating > 0 && styles.ratingApplied]}>
                <View style={styles.ratingHeader}>
                  <Text style={styles.ratingLabel}>Minimum Rating</Text>
                  {rating > 0 && (
                    <Text style={styles.ratingValue}>{rating.toFixed(1)}★</Text>
                  )}
                </View>
                <StarRating
                  rating={rating}
                  onRatingChange={handleRatingChange}
                  size={30}
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

      <Modal
        visible={isPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
      >
        <View style={styles.bottomPickerContainer}>
          <View style={styles.pickerHeader}>
            <Button
              title="Done"
              onPress={() => setPickerVisible(false)}
            />
          </View>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => {
              setStatus(itemValue);
              if (Platform.OS === 'android') {
                setPickerVisible(false);
              }
            }}
            style={styles.picker}
          >
            <Picker.Item label="All Status" value="" />
            <Picker.Item label="To Read" value="To Read" />
            <Picker.Item label="Read" value="Read" />
            <Picker.Item label="Reading" value="Reading" />
          </Picker>
        </View>
      </Modal>
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
    transform: [{ translateY: 0 }],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 5,
    gap: 24,
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
  inputContainer: {
    width: "100%",
  },
  label: {
    marginBottom: 8,
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: colors.secondary,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    justifyContent: "center",
    backgroundColor: "white",
  },
  dropdownText: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  ratingContainer: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  ratingApplied: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  ratingValue: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
  rating: {
    paddingVertical: 5,
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
  bottomPickerContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: colors.background,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  picker: {
    width: "100%",
    backgroundColor: colors.background,
  },
});

export default FilterModal;
