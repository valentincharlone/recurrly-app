import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const SUBS_KEY = "subscriptions";

interface SubscriptionsContextValue {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
  deleteSubscription: (id: string) => void;
}

const SubscriptionsContext = createContext<SubscriptionsContextValue | null>(
  null,
);

export const SubscriptionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(SUBS_KEY);
        if (stored) {
          const parsed: Subscription[] = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSubscriptions(parsed);
          }
        }
      } catch {
        // datos corruptos — se usan los defaults
      }
    };
    load();
  }, []);

  const addSubscription = async (subscription: Subscription) => {
    const updated = [subscription, ...subscriptions];
    setSubscriptions(updated);
    try {
      await AsyncStorage.setItem(SUBS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist subscriptions:", e);
    }
  };

  const deleteSubscription = async (id: string) => {
    const updated = subscriptions.filter((s) => s.id !== id);
    setSubscriptions(updated);
    try {
      await AsyncStorage.setItem(SUBS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist subscriptions:", e);
    }
  };

  return (
    <SubscriptionsContext.Provider value={{ subscriptions, addSubscription, deleteSubscription }}>
      {children}
    </SubscriptionsContext.Provider>
  );
};

export const useSubscriptions = () => {
  const ctx = useContext(SubscriptionsContext);
  if (!ctx)
    throw new Error(
      "useSubscriptions must be used within SubscriptionsProvider",
    );
  return ctx;
};
