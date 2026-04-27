import { posthog } from "@/config/posthog";
import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import clsx from "clsx";
import dayjs from "dayjs";
import { useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const CATEGORIES = [
  "Entretenimiento",
  "Herramientas IA",
  "Herramientas Dev",
  "Diseño",
  "Productividad",
  "Nube",
  "Música",
  "Otro",
] as const;

type Category = (typeof CATEGORIES)[number];
type Frequency = "Mensual" | "Anual";

const CURRENCIES = ["ARS", "USD", "BRL", "MXN", "CLP", "COP", "UYU"] as const;
type Currency = (typeof CURRENCIES)[number];

const CATEGORY_COLORS: Record<Category, string> = {
  Entretenimiento: "#fdd5b1",
  "Herramientas IA": "#b8d4e3",
  "Herramientas Dev": "#e8def8",
  Diseño: "#f5c542",
  Productividad: "#b8e8d0",
  Nube: "#c8e6f5",
  Música: "#f9d4e8",
  Otro: "#e8e8e8",
};

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
}

const SERVICE_ICONS: Record<string, (typeof icons)[keyof typeof icons]> = {
  adobe: icons.adobe,
  canva: icons.canva,
  claude: icons.claude,
  dropbox: icons.dropbox,
  figma: icons.figma,
  github: icons.github,
  medium: icons.medium,
  netflix: icons.netflix,
  notion: icons.notion,
  openai: icons.openai,
  spotify: icons.spotify,
};

function resolveIcon(name: string) {
  const key = name.toLowerCase().trim();
  for (const [service, icon] of Object.entries(SERVICE_ICONS)) {
    if (key.includes(service)) return icon;
  }
  return icons.wallet;
}

const SHEET_HEIGHT = Dimensions.get("window").height * 0.85;

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onSubmit,
}: CreateSubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("Mensual");
  const [currency, setCurrency] = useState<Currency>("ARS");
  const [category, setCategory] = useState<Category>("Otro");

  const priceNum = parseFloat(price);
  const isValid = name.trim().length > 0 && !isNaN(priceNum) && priceNum > 0;

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Mensual");
    setCurrency("ARS");
    setCategory("Otro");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!isValid) return;

    const now = dayjs();
    onSubmit({
      id: `sub-${Date.now()}`,
      name: name.trim(),
      price: priceNum,
      currency,
      billing: frequency,
      category,
      status: "active",
      startDate: now.toISOString(),
      renewalDate:
        frequency === "Mensual"
          ? now.add(1, "month").toISOString()
          : now.add(1, "year").toISOString(),
      icon: resolveIcon(name),
      color: CATEGORY_COLORS[category],
    });

    posthog.capture("subscription_created", {
      subscription_name: name.trim(),
      subscription_price: priceNum,
      subscription_frequency: frequency,
      subscription_category: category,
    });

    resetForm();
    onClose();
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* Backdrop — tap to close */}
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={handleClose}
        />

        {/* Sheet — absorbs touches so the backdrop doesn't close it */}
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.background }]}
          onPress={() => {}}
        >
          <View className="modal-header">
            <Text className="modal-title">Nueva suscripción</Text>
            <Pressable className="modal-close" onPress={handleClose}>
              <Text className="modal-close-text">✕</Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets
            showsVerticalScrollIndicator={false}
          >
            <View className="modal-body">
              {/* Name */}
              <View className="gap-2">
                <Text className="auth-label">Nombre</Text>
                <TextInput
                  className="auth-input"
                  value={name}
                  onChangeText={setName}
                  placeholder="ej. Netflix"
                  placeholderTextColor="rgba(0,0,0,0.35)"
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>

              {/* Price */}
              <View className="gap-2">
                <Text className="auth-label">Precio</Text>
                <TextInput
                  className="auth-input"
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  placeholderTextColor="rgba(0,0,0,0.35)"
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                />
              </View>

              {/* Currency */}
              <View className="gap-2">
                <Text className="auth-label">Moneda</Text>
                <View className="picker-row flex-wrap">
                  {CURRENCIES.map((c) => (
                    <Pressable
                      key={c}
                      className={clsx(
                        "picker-option",
                        currency === c && "picker-option-active",
                      )}
                      onPress={() => setCurrency(c)}
                    >
                      <Text
                        className={clsx(
                          "picker-option-text",
                          currency === c && "picker-option-text-active",
                        )}
                      >
                        {c}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Frequency */}
              <View className="gap-2">
                <Text className="auth-label">Frecuencia</Text>
                <View className="picker-row">
                  {(["Mensual", "Anual"] as const).map((f) => (
                    <Pressable
                      key={f}
                      className={clsx(
                        "picker-option",
                        frequency === f && "picker-option-active",
                      )}
                      onPress={() => setFrequency(f)}
                    >
                      <Text
                        className={clsx(
                          "picker-option-text",
                          frequency === f && "picker-option-text-active",
                        )}
                      >
                        {f}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Category */}
              <View className="gap-2">
                <Text className="auth-label">Categoría</Text>
                <View className="category-scroll">
                  {CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat}
                      className={clsx(
                        "category-chip",
                        category === cat && "category-chip-active",
                      )}
                      onPress={() => setCategory(cat)}
                    >
                      <Text
                        className={clsx(
                          "category-chip-text",
                          category === cat && "category-chip-text-active",
                        )}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Submit */}
              <Pressable
                className={clsx(
                  "auth-button",
                  !isValid && "auth-button-disabled",
                )}
                onPress={handleSubmit}
                disabled={!isValid}
              >
                <Text className="auth-button-text">Agregar suscripción</Text>
              </Pressable>
            </View>
          </ScrollView>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    height: SHEET_HEIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  scroll: {
    flex: 1,
  },
});

export default CreateSubscriptionModal;
