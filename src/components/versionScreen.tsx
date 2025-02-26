import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import Constants from 'expo-constants';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { colors } from '../constants/colors';

export default function VersionScreen() {
  const [clickCount, setClickCount] = useState(0);

  const handlePress = () => {
    setClickCount((prev) => prev + 1);

    if (clickCount + 1 === 3) {
      setClickCount(0); // Sayaç sıfırlansın ki tekrar deneyebil

      // Alert göster
    //   Alert.alert("Extra Version", Constants?.expoConfig?.extra?.version);
      Alert.alert("Extra Version", "1.0.6");
    }

    // Eğer belirli bir süre içinde 3 kere basılmazsa sayaç sıfırla
    setTimeout(() => setClickCount(0), 1000);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={handlePress}>
        <Text style={{ fontSize: 18, color: colors.primary }}>App Version: {Constants?.expoConfig?.version}</Text>
      </TouchableOpacity>
    </View>
  );
}
