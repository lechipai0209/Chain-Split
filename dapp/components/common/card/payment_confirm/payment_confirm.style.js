import { StyleSheet } from "react-native";
import { COLORS, FONTS, SIZES } from "../../../../constants";

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: COLORS.gray,
        padding: SIZES.small,
        borderRadius: SIZES.small,
        justifyContent: "center",
        marginTop: SIZES.small
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    transLayout: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        marginTop: SIZES.small,
        peddingTop: SIZES.small,
        peddingBottom: SIZES.small,
    }, 
    groupFont: {
        fontSize: FONTS.regular,
        fontWeight: "bold",
    },
    timeFont: {
        fontSize: SIZES.small,
    },
    nameFont: {
        fontSize: SIZES.medium,
        fontWeight: "bold",
    },
    transactionMovement: {
        fontWeight: "bold",
    },
    amountFont: {
        fontSize: SIZES.large,
        fontWeight: "bold",
    },
    msgFont: {
        fontSize: SIZES.small,
    },
    sideBlock: {
        alignItems: "center",
    },
    arrowBlock: {
        alignItems: "center",
        marginHorizontal: 10,
    },
    msgContainer: {
        alignItems: "flex-start",
        marginTop: SIZES.small,
    },
    btnsContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        marginTop: SIZES.small,
        marginButtom: SIZES.small,
    },

    btn: (color, dimension) => ({
        width: dimension,
        backgroundColor: color,
        padding: SIZES.small,
        borderRadius: SIZES.small,
        justifyContent: "center",
        alignItems: "center",
    }),
    
    btnText: (color) => ({
        fontSize: FONTS.small,
        fontWeight: "bold",
        color: color,
    }),

}) ;

export default styles ;