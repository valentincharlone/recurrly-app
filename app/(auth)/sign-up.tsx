import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function SignUp() {
  return (
    <View>
      <Text>Sign Up</Text>
      <Link href="/(auth)/sign-in">Already have an account? Sign In</Link>
    </View>
  );
}
