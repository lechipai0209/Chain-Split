import { Text, View, TouchableOpacity } from "react-native" ; 
import styles from "./main.style" ;
import Container from "../common/container/container" ;
import MiniContainer from "../common/mini_container/mini_container";
import ExpenseConfirmCard from "../common/card/expense_confirm/expense_confirm";
import CashConfirmCard from "../common/card/cash_confirm/cash_confirm" ;
import ExpenseCreateCard from "../common/card/expense_create/expense_create" ;  

const Main = () => {


    const expenseConfirmData = {
        payer: "Yuan",
        debtor: "You",
        group: "Japan trip",
        date: "12/04",
        time: "10:00",
        amount: "43.53",
        msg: "A&M  Burger. Me: 5, Jas: 6+ice, Hamor: 6+ big ch"  
    } ;

    const cashConfirmData = {
        payer: "You",
        debtor: "CHiCHi",
        group: "Japan trip",
        date: "12/04",
        time: "10:00",
        amount: "12.17",
        msg: "Pay for Tocho"  
    } ;

    const createExpenseData = {
        payer: "You",
        debtors: ["Danson", "Donyan", "Sonwhon", "Gorge"],
        group: "Japan trip",
        date: "12/04",
        time: "10:00",
        amount: "538.6",
        msg: "Air BNB 2 nights",
        confirmNumber: 2,
        expenseState: "pending"
    }



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

                <ExpenseConfirmCard
                    info={expenseConfirmData}
                />

                <CashConfirmCard
                    info={cashConfirmData}
                />

                <ExpenseCreateCard
                    info={createExpenseData}
                />


                
            </Container>
            
            <View style={{height: 100}} />


        </View>
    ) ;
} ;

export default Main ;