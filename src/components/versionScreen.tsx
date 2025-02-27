import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import Constants from 'expo-constants';
import { colors } from '../constants/colors';
import * as Updates from 'expo-updates';

export default function VersionScreen() {
  const [clickCount, setClickCount] = useState(0);
  const [updateStatus, setUpdateStatus] = useState('');

  const checkForUpdates = async (noDialog: boolean = false) => {
    try {
      setUpdateStatus('Güncellemeler kontrol ediliyor...');
      console.log('Update URL:', Updates.updateUrl);
      console.log('Runtime Version:', Updates.runtimeVersion);
      console.log('SDK Version:', Constants.expoConfig?.sdkVersion);

      const update = await Updates.checkForUpdateAsync();
      console.log('Update check result:', update);

      if (update.isAvailable) {
        setUpdateStatus('Güncelleme indiriliyor...');
        await Updates.fetchUpdateAsync();
        Alert.alert(
          "Güncelleme hazır",
          "Yeni bir güncelleme yüklendi. Uygulamayı yeniden başlatmak ister misiniz?",
          [
            { text: "Hayır" },
            { 
              text: "Evet", 
              onPress: async () => {
                setUpdateStatus('Uygulama yeniden başlatılıyor...');
                await Updates.reloadAsync();
              }
            }
          ]
        );
      } else {
        setUpdateStatus('Güncelleme bulunamadı');
        if (!noDialog) {
          Alert.alert("Bilgi", "Şu anda mevcut bir güncelleme bulunmuyor.");
        }
      }
    } catch (error) {
      console.log('Güncelleme kontrol hatası:', error);
      setUpdateStatus('Hata: ' + error.message);
      if (!noDialog) {
        Alert.alert("Hata", "Güncelleme kontrol edilirken bir hata oluştu: " + error.message);
      }
    }
  };

  const handlePress = () => {
    setClickCount((prev) => prev + 1);

    if (clickCount + 1 === 3) {
      setClickCount(0);
      checkForUpdates();
    }

    setTimeout(() => setClickCount(0), 1000);
  };

  useEffect(() => {
    checkForUpdates(true);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={handlePress}>
        <Text style={{ fontSize: 18, color: colors.primary }}>
          App Version: {Constants?.expoConfig?.version}
        </Text>
        <Text style={{ fontSize: 14, color: colors.secondary }}>
          {updateStatus}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
