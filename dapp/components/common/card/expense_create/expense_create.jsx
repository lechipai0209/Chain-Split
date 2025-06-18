import { View, Text, TouchableOpacity } from "react-native";
import styles from "./expense_create.style.js" ;
import { COLORS } from "../../../../constants";
import {  useState } from "react";



// this is for debtor !!!!! 
// for payer is expense_create !!!!!!!!
const ExpenseCreateCard = ({ info }) => {

    const [isExpenseFinalized, setIsExpenseFinalized] = useState(true) ; 

    const { 
        payer, 
        debtors, 
        group, 
        date, 
        time, 
        amount, 
        msg, 
        confirmNumber,
        expenseState,
    } = info ;
    return (
        <View style={styles.container}>


            <View style={styles.titleContainer}>
                <Text style={styles.title}>Expense creation</Text>
            </View>

            <View style={styles.divider} />


            {/* header */}
            <View style={styles.header}>
                <Text style={styles.groupFont}>{group}</Text>
                <Text style={styles.timeFont}>{date} {time}</Text>

            </View>

            <View style={styles.transLayout}>
                
                {/* debtor */}
                <View style={styles.sideBlock}>
                    <Text>Debtor</Text>
                    <Text style={styles.nameMinierFont} >
                       {debtors.length} Members
                    </Text>
                </View>

                {/* amount */}
                <View style={styles.arrowBlock}>
                    <Text style={styles.transactionMovement}> -> </Text>
                    <Text style={styles.amountFont}>{amount}</Text>
                </View>

                {/* payer */}
                <View style={styles.sideBlock}>
                    <Text>Payer</Text>
                    <Text 
                        style={payer.length > 5 ? styles.nameSmallerFont : styles.nameFont}
                    >
                        {payer}
                    </Text>
                </View>

            </View>

            <View style={styles.msgContainer}>
                <Text 
                    numberOfLines={2}
                    style={styles.msgFont}
                >{msg}</Text>
            </View>

            {
                expenseState == "pending" ? (
                    <View style={styles.confirmNumberContainer}>
                        <Text style={styles.confirmNumberFont(COLORS.blue)}>Confirm Number : {confirmNumber}</Text>
                    </View>
                ): expenseState == "finished" ? (
                    <View style={styles.confirmNumberContainer}>
                        <Text style={styles.confirmNumberFont(COLORS.blue)}>Confirmed by All Members!</Text>
                    </View>
                )
                :(
                    <View style={styles.confirmNumberContainer}>
                        <Text style={styles.confirmNumberFont(COLORS.red)}>Rejected by Members!</Text>
                    </View>
                )
            }



            {/* {expenseState == "pending" ? ( //confirmed but haven't finalized yet
                <View style={styles.btnsContainer}>
                    <View 
                        style={styles.btn(COLORS.transparent, "80%")}
                        disabled={true}
                    >
                        <Text style={styles.btnText("black")}>Pending...</Text>
                    </View>

                </View>
            ) : isExpenseFinalized ? (   // confirmed and finalized 
                <View style={styles.btnsContainer}>
                    <View 
                        style={styles.btn(COLORS.transparent, "80%")}
                        disabled={true}
                    >
                        <Text style={styles.btnText(COLORS.green)}>Finalized</Text>
                    </View>

                </View>
            ) : (                     // confirmed but dropped
                <View style={styles.btnsContainer}>
                    <View 
                        style={styles.btn(COLORS.transparent, "80%")}
                        disabled={true}
                    >
                        <Text style={styles.btnText(COLORS.red)}>Dropped</Text>
                    </View>

                </View>                

            )
            } */}


        </View>

    ) ;
}

export default ExpenseCreateCard ;