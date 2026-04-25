import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import * as FileSystem from "expo-file-system";
import { createContext, useContext, useEffect, useState } from "react";

const SUBS_FILE = FileSystem.documentDirectory + "subscriptions.json";

interface SubscriptionsContextValue {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
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
    useState<Subscription[]>(HOME_SUBSCRIPTIONS);

  // Load persisted subscriptions on mount
  useEffect(() => {
    const load = async () => {
      try {
        const info = await FileSystem.getInfoAsync(SUBS_FILE);
        if (info.exists) {
          const content = await FileSystem.readAsStringAsync(SUBS_FILE);
          const parsed: Subscription[] = JSON.parse(content);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSubscriptions(parsed);
          }
        }
      } catch {
        // file corrupt or missing — keep HOME_SUBSCRIPTIONS default
      }
    };
    load();
  }, []);

  const addSubscription = async (subscription: Subscription) => {
    const updated = [subscription, ...subscriptions];
    setSubscriptions(updated);
    try {
      await FileSystem.writeAsStringAsync(SUBS_FILE, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist subscriptions:", e);
    }
  };

  return (
    <SubscriptionsContext.Provider value={{ subscriptions, addSubscription }}>
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
