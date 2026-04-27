import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ListHeading = ({ title, href }: ListHeadingProps) => {
  const router = useRouter();
  return (
    <View className="list-head">
      <Text className="list-title">{title}</Text>

      {href && (
        <TouchableOpacity
          className="list-action"
          onPress={() => router.push(href as any)}
        >
          <Text className="list-action-text">View all</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ListHeading;
