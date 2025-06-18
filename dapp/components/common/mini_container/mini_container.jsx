import { View, TouchableOpacity } from "react-native";
import styles from "./mini_container.style" ;

const MiniContainer = ({ children }) => {
    return (
        <TouchableOpacity style={styles.container}>
            {children}
        </TouchableOpacity>

    ) ;
}

export default MiniContainer ;