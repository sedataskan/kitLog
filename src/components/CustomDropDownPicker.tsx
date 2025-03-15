import React from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { colors } from "../constants/colors";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

interface CustomDropDownPickerProps {
  open: boolean;
  value: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export const CustomDropDownPicker = ({
  open,
  value,
  setOpen,
  setValue,
}: CustomDropDownPickerProps) => {
  const { t } = useTranslation();

  const items = [
    { label: t("read"), value: "read" },
    { label: t("to_read"), value: "to_read" },
    { label: t("currently_reading"), value: "currently_reading" },
  ];
  const getStatusLabel = (statusKey: string) => {
    switch (statusKey) {
      case "read":
        return t("read");
      case "to_read":
        return t("to_read");
      case "currently_reading":
        return t("currently_reading");
    }
  };
  return (
    <View>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={() => {}}
        style={styles.statusDropdown}
        dropDownContainerStyle={{
          backgroundColor: colors.background,
          borderColor: colors.secondary,
        }}
        selectedItemContainerStyle={{
          backgroundColor: colors.backgroundSecondary,
        }}
        placeholder={getStatusLabel(value)}
      />
    </View>
  );
};
const styles = {
  statusDropdown: {
    backgroundColor: colors.background,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
};
