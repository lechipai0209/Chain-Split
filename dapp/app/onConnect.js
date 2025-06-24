import { useState, useEffect , useRef } from 'react' ;
import { View, Text, ScrollView, SafeAreaView, Button, Alert, Platform } from 'react-native' ;
import { Stack, useRouter } from 'expo-router' ;
import { icons, COLORS, FONTS, SIZES  } from '../constants' ;
import HeaderWallet  from '../components/common/header_wallet/header_wallet' ;
import Footer from '../components/common/footer/footer' ;
import Main from '../components/main/main' ;
import registerNNPushToken from 'native-notify';
import { registerIndieID } from 'native-notify';

import 'react-native-get-random-values';
import "react-native-url-polyfill/auto";
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { buildUrl } from '../constants';
import { decryptPayload, encryptPayload } from '../utils';  

const connection = new Connection(clusterApiUrl("devnet"));


const Test = () => {

    return (
        <SafeAreaView                             // make sure screen would not be covered by status bar or 瀏海 
            style={{
                flex: 1, 
                backgroundColor: COLORS.backGround
            }}
        >
            <Stack.Screen 

                options={{
                    headerStyle: { backgroundColor: COLORS.gold},
                    headerShadowVisible: false,   
                    headerLeft: () => (          
                        <HeaderWallet publicKey="Fuck fkakaka"/>
                    ),

                    headerTitle: "ggggg",            
                }}    
            />

          
            {/* <ScrollView showsVerticalScrollIndicator={false}>   
                <Main />

            </ScrollView> 

            <Footer/> */}

            

        </SafeAreaView>
    )
}



export default Test ;