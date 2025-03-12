import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import Constants from "expo-constants";
import { colors } from "../constants/colors";
import * as Updates from "expo-updates";
import { useTranslation } from "react-i18next";

export default function VersionScreen() {
  const [clickCount, setClickCount] = useState(0);
  const [updateStatus, setUpdateStatus] = useState("");
  const { t } = useTranslation();

  const checkForUpdates = async (noDialog: boolean = false) => {
    try {
      setUpdateStatus(t("update_checking"));
      console.log("Update URL:", Updates.updateUrl);
      console.log("Runtime Version:", Updates.runtimeVersion);
      console.log("SDK Version:", Constants.expoConfig?.sdkVersion);

      const update = await Updates.checkForUpdateAsync();
      console.log("Update check result:", update);

      if (update.isAvailable) {
        setUpdateStatus(t("update_available"));
        await Updates.fetchUpdateAsync();
        Alert.alert(t("update_ready"), t("update_restart"), [
          { text: t("no") },
          {
            text: t("yes"),
            onPress: async () => {
              setUpdateStatus(t("update_restart"));
              await Updates.reloadAsync();
            },
          },
        ]);
      } else {
        setUpdateStatus(t("update_not_found"));
        if (!noDialog) {
          Alert.alert(t("info"), t("update_not_found"));
        }
      }
    } catch (error) {
      console.log("Update check error:", error);
      setUpdateStatus(t("update_error") + ": " + error.message);
      if (!noDialog) {
        Alert.alert(t("error"), t("update_error") + ": " + error.message);
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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity onPress={handlePress}>
        <Text style={{ fontSize: 18, color: colors.primary }}>
          {t("app_version")}: {Constants?.expoConfig?.version}
        </Text>
        <Text style={{ fontSize: 14, color: colors.secondary }}>
          {updateStatus}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
