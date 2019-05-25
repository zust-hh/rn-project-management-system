import React from "react";
import { Text } from "react-native";

const iconMap = {
  home: "首页",
  search: "搜索",
  favorites: "♧",
  profile: "我的"
};

const Icon = ({ name, color, style, ...props }) => {
  const icon = iconMap[name];

  return <Text style={[{ fontSize: 12, color }, style]}>{icon}</Text>;
};

export default Icon;