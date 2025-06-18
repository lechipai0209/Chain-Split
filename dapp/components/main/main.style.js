import { StyleSheet } from "react-native";
import { SIZES, COLORS, FONTS } from "../../constants";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backGround,
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: "10%",
        paddingRight: "10%",
    },
    currencyContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: SIZES.small,
        marginTop: SIZES.small
    },
    balanceNumberContainer : {
        justifyContent: "center",
        alignItems: "center",
    },
    balanceNumber: {
        fontSize: FONTS.importance,
        fontWeight: "bold",  
    },
    titleContainer: {
        alignItems: "flex-start",
    },
    title : {
        fontSize: FONTS.small,
        fontWeight: "bold",
    },
    optionsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: SIZES.xLarge,
        width: "100%"
    },
})

export default styles ;