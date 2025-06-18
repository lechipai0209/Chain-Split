import { View, Text, TouchableOpacity } from "react-native";
import styles from "./payment_confirm.style" ;
import { COLORS } from "../../../../constants";
import {  useState } from "react";

const PaymentConfirmCard = ({ info }) => {

    const [isExpensePending, setIsExpensePending] = useState(false) ;
    const [isExpenseFinalized, setIsExpenseFinalized] = useState(true) ;
    const [isExpenseReacted, setIsExpenseReacted] = useState(true) ;

    const { payer, debtor, group, date, time, amount, msg } = info ;
    return (
        <View style={styles.container}>

            {/* header */}
            <View style={styles.header}>
                <Text style={styles.groupFont}>{group}</Text>
                <Text style={styles.timeFont}>{date} {time}</Text>

            </View>

            <View style={styles.transLayout}>
                
                {/* debtor */}
                <View style={styles.sideBlock}>
                    <Text>Debtor</Text>
                    <Text style={styles.nameFont}>{debtor}</Text>
                </View>

                {/* amount */}
                <View style={styles.arrowBlock}>
                    <Text style={styles.transactionMovement}>owe</Text>
                    <Text style={styles.amountFont}>{amount}</Text>
                </View>

                {/* payer */}
                <View style={styles.sideBlock}>
                    <Text>Payer</Text>
                    <Text style={styles.nameFont}>{payer}</Text>
                </View>

            </View>

            <View style={styles.msgContainer}>
                <Text 
                    numberOfLines={2}
                    style={styles.msgFont}
                >{msg}</Text>
            </View>

            { !isExpenseReacted ? (
            <View style={styles.btnsContainer}>
                <TouchableOpacity 
                    style={styles.btn(COLORS.green, "40%")}
                >
                    <Text style={styles.btnText("black")}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn(COLORS.red, "40%")}>
                    <Text style={styles.btnText("black")}>Reject</Text>
                </TouchableOpacity>
            </View>
            ) : isExpensePending ? (
                <View style={styles.btnsContainer}>
                    <View 
                        style={styles.btn(COLORS.transparent, "80%")}
                        disabled={true}
                    >
                        <Text style={styles.btnText("black")}>Pending</Text>
                    </View>

                </View>
            ) : isExpenseFinalized ? (
                <View style={styles.btnsContainer}>
                    <View 
                        style={styles.btn(COLORS.transparent, "80%")}
                        disabled={true}
                    >
                        <Text style={styles.btnText(COLORS.green)}>Finalized</Text>
                    </View>

                </View>
            ) : (
                <View style={styles.btnsContainer}>
                    <View 
                        style={styles.btn(COLORS.transparent, "80%")}
                        disabled={true}
                    >
                        <Text style={styles.btnText(COLORS.red)}>Droped</Text>
                    </View>

                </View>                

            )
            }


        </View>

    ) ;
}

export default PaymentConfirmCard ;