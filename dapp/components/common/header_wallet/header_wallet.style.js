import { StyleSheet } from "react-native";

import { COLORS, SIZES, FONTS } from "../../../constants";

const styles = StyleSheet.create({
    walletContainer: {
        width: 150,
        height: 40,
        justifyContent: "center",
        maxWidth: 200,
        alignItems: "flex-start",
        marginLeft: SIZES.medium,
    },

    walletText: {
        fontSize: FONTS.small,
        fontWeight: "bold",
    },
}) ;

export default styles;