import { TouchableOpacity, Text } from "react-native";

import styles from "./header_wallet.style.js";

const HeaderWallet = ({publicKey}) => {
    return (
        <TouchableOpacity style={styles.walletContainer}>
            <Text style={styles.walletText}>Wallet</Text>
            <Text 
                numberOfLines={1} 
                ellipsizeMode="middle"
                style={styles.walletText}
            >
                {publicKey}
            </Text>
        </TouchableOpacity>
    ) ;
}

export default HeaderWallet ;