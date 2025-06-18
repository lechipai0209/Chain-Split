import { StyleSheet } from "react-native";
import { COLORS, FONT, SIZES } from "../../../constants";


const styles = StyleSheet.create({
    container: {
        width: "25%",
        aspectRatio: 1,
        backgroundColor: COLORS.lightGray,
        padding: SIZES.medium,
        borderRadius: SIZES.small,
        justifyContent: "center",
    },
}) ;

export default styles ;