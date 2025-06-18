import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "../../../constants";


const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: COLORS.lightGray,
        padding: SIZES.medium,
        borderRadius: SIZES.small,
        justifyContent: "center",
        marginTop: SIZES.xLarge
    },
}) ;

export default styles ;