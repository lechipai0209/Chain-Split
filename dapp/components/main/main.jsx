import { Text, View, TouchableOpacity } from "react-native" ; 
import styles from "./main.style" ;
import Container from "../common/container/container" ;
import MiniContainer from "../common/mini_container/mini_container";
import PaymentConfirmCard from "../common/card/payment_confirm/payment_confirm";

const Main = () => {


    const paymentConfirmData = {
        payer: "Yuan",
        debtor: "John",
        group: "Japan trip",
        date: "12/04",
        time: "10:00",
        amount: "43.53",
        msg: "A&M  Burger. Me: 5, Jas: 6+ice, Hamor: 6+ big ch"  
    } ;



    return (
        <View style={styles.container}>
            <Container>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Balance</Text>
                </View>
                <View style={styles.balanceNumberContainer}>
                    <Text style={styles.balanceNumber}>46.66</Text>
                </View>
                <View style={styles.currencyContainer}>
                    <Text>USDT</Text>
                    <Text>SOL</Text>
                </View>
            </Container>



            <View style={styles.optionsRow}>
                <MiniContainer/>
                <MiniContainer/>
                <MiniContainer/>
            </View>

            <Container>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Your Recent Activity</Text>
                </View>

                <PaymentConfirmCard
                    info={paymentConfirmData}
                />


                
            </Container>
            
            <View style={{height: 100}} />


        </View>
    ) ;
} ;

export default Main ;