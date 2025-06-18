import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.small,
    backgroundColor: COLORS.gold,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
});

export default styles;
