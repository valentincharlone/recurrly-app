import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { formatCurrency } from "@/lib/utils";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const { user } = useUser();
  const { subscriptions, addSubscription, deleteSubscription } =
    useSubscriptions();
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const [modalVisible, setModalVisible] = useState(false);

  const displayName =
    user?.firstName ||
    user?.fullName ||
    user?.emailAddresses[0]?.emailAddress ||
    "User";

  const totalMonthly = useMemo(
    () =>
      subscriptions
        .filter((s) => s.status !== "cancelled")
        .reduce(
          (sum, s) => sum + (s.billing === "Yearly" ? s.price / 12 : s.price),
          0,
        ),
    [subscriptions],
  );

  const nextRenewal = useMemo(
    () =>
      subscriptions
        .filter((s) => s.status !== "cancelled" && s.renewalDate)
        .map((s) => s.renewalDate!)
        .sort()[0],
    [subscriptions],
  );

  const upcomingSubscriptions = useMemo<UpcomingSubscription[]>(
    () =>
      subscriptions
        .filter((s) => s.status !== "cancelled" && s.renewalDate)
        .map((s) => ({
          id: s.id,
          icon: s.icon,
          name: s.name,
          price: s.price,
          currency: s.currency,
          daysLeft: dayjs(s.renewalDate).diff(dayjs(), "day"),
        }))
        .filter((s) => s.daysLeft >= 0 && s.daysLeft <= 30)
        .sort((a, b) => a.daysLeft - b.daysLeft),
    [subscriptions],
  );

  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image
                  source={
                    user?.imageUrl ? { uri: user.imageUrl } : images.avatar
                  }
                  className="home-avatar"
                />
                <Text className="home-user-name">{displayName}</Text>
              </View>
              <Pressable onPress={() => setModalVisible(true)}>
                <Image source={icons.add} className="home-add-icon" />
              </Pressable>
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Total mensual</Text>
              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(totalMonthly)}
                </Text>
                <Text className="home-balance-date">
                  {nextRenewal ? dayjs(nextRenewal).format("DD/MM/YYYY") : "—"}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading title="Próximas" />

              <FlatList
                data={upcomingSubscriptions}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard {...item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    Sin renovaciones próximas.
                  </Text>
                }
              />
            </View>
            <ListHeading
              title="Todas las suscripciones"
              href="/(tabs)/subscriptions"
            />
          </>
        )}
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((prev) =>
                prev === item.id ? null : item.id,
              )
            }
            onDeletePress={() => deleteSubscription(item.id)}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="home-empty-state">Sin suscripciones aún.</Text>
        }
        contentContainerClassName="pb-18"
      />

      <CreateSubscriptionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={addSubscription}
      />
    </SafeAreaView>
  );
}
