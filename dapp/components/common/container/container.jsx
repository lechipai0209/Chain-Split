import { View } from "react-native";
import styles from "./container.style" ;

const Container = ({ children }) => {
    return (
        <View style={styles.container}>
            {children}
        </View>

    ) ;
}

export default Container ;