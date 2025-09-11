import { Link } from "expo-router";
import { View, Text, Button, StyleSheet } from "react-native";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👋 Welcome to Raydius</Text>
      <Link href="/login" asChild>
        <Button title="Login" />
      </Link>
      <Link href="/signup" asChild>
        <Button title="Signup" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20 },
});
