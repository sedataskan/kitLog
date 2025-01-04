import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import InputBox from "../components/inputBox";
import { useNavigation } from "@react-navigation/native";

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/KITAPP.png")}
        style={styles.logo}
      />
      <InputBox placeholder="Email" secureTextEntry={false} />
      <View style={styles.button}>
        <Button
          color="#D4DCDF"
          title="Reset Password"
          onPress={() => navigation.navigate("Login" as never)}
        />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("Login" as never)}>
        <Text style={styles.loginText}>Remember? Back to Login! </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4B6E7C",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    width: 150,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#D4DCDF",
    backgroundColor: "#4B6E7C",
    marginBottom: 20,
  },
  loginText: {
    color: "#000",
    marginTop: 20,
    fontStyle: "italic",
  },
});
