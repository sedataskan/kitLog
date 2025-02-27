import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
}

export const StarRating = ({ rating, onRatingChange, size = 30 }: StarRatingProps) => {
  const handlePress = (position: number) => {
    if (position === rating) {
      onRatingChange(0);
    } else {
      onRatingChange(position);
    }
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const difference = rating - index;
    
    return (
      <View key={index} style={styles.starContainer}>
        <View style={styles.starIconContainer}>
          {difference >= 1 ? (
            <Ionicons name="star" size={size} color={colors.primary} />
          ) : difference >= 0.5 ? (
            <Ionicons name="star-half" size={size} color={colors.primary} />
          ) : (
            <Ionicons name="star-outline" size={size} color={colors.primary} />
          )}
        </View>
        <View style={styles.touchableContainer}>
          <TouchableOpacity
            style={[styles.halfStar, { width: size / 2 }]}
            onPress={() => handlePress(starValue - 0.5)}
          />
          <TouchableOpacity
            style={[styles.halfStar, { width: size / 2 }]}
            onPress={() => handlePress(starValue)}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4].map(renderStar)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starContainer: {
    padding: 5,
    position: 'relative',
  },
  starIconContainer: {
    zIndex: 0,
  },
  touchableContainer: {
    position: 'absolute',
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
    flexDirection: 'row',
    zIndex: 1,
  },
  halfStar: {
    height: '100%',
  },
}); 