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

export default function LoginScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/KITAPP.png")}
        style={styles.logo}
      />
      <InputBox placeholder="Username" secureTextEntry={false} />
      <InputBox placeholder="Password" secureTextEntry={true} />
      <View style={styles.button}>
        <Button
          color="#D4DCDF"
          title="Login"
          onPress={() => navigation.navigate("Main" as never)}
        />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("ForgotMyPassword" as never)}
      >
        <Text style={styles.forgotPasswordText}>Forgot Your Password?</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>───── OR ─────</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Register" as never)}
      >
        <Text style={styles.registerText}>Register Now!</Text>
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
  forgotPasswordText: {
    color: "#000",
    marginTop: 20,
    fontStyle: "italic",
  },
  registerText: {
    color: "#000",
    marginTop: 20,
    fontStyle: "italic",
  },
  orText: {
    color: "#000",
    marginTop: 20,
    textAlign: "center",
  },
});
