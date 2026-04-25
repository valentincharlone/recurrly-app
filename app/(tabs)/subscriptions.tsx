import SubscriptionCard from "@/components/SubscriptionCard";
import { icons } from "@/constants/icons";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { styled } from "nativewind";
import { useMemo, useState } from "react";
import { FlatList, Image, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const { subscriptions } = useSubscriptions();
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return subscriptions;
    return subscriptions.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q) ||
        s.plan?.toLowerCase().includes(q),
    );
  }, [query, subscriptions]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-5 pt-5 pb-3">
        <Text className="text-3xl font-sans-bold text-primary mb-5">
          Subscriptions
        </Text>
        <View className="flex-row items-center rounded-2xl border border-border bg-card px-4">
          <Image source={icons.menu} className="size-5 opacity-40 mr-3" />
          <TextInput
            className="flex-1 py-4 text-base font-sans-medium text-primary"
            placeholder="Search by name, category or plan..."
            placeholderTextColor="rgba(0,0,0,0.35)"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedId === item.id}
            onPress={() =>
              setExpandedId((prev) => (prev === item.id ? null : item.id))
            }
          />
        )}
        extraData={expandedId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-18"
        ListEmptyComponent={
          <View className="items-center pt-16">
            <Text className="text-base font-sans-semibold text-muted-foreground">
              No subscriptions match &quot;{query}&quot;
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Subscriptions;
