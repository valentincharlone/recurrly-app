import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="text-5xl font-sans-mediumextrabold ">Home</Text>
      <Link
        href="/onboarding"
        className="font-sans-bold mt-4 rounded bg-primary text-white p-4"
      >
        Go to Onboarding
      </Link>
      <Link
        href="/(auth)/sign-in"
        className="font-sans-bold mt-4 rounded bg-primary text-white p-4"
      >
        Go to SignIn
      </Link>
      <Link
        href="/(auth)/sign-up"
        className="font-sans-bold mt-4 rounded bg-primary text-white p-4"
      >
        Go to SignUp
      </Link>
    </SafeAreaView>
  );
}
