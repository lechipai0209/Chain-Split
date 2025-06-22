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
import { Buffer } from 'buffer';
import { toUnicode } from 'punycode';
global.Buffer = global.Buffer || Buffer;

const onConnectRedirectLink = Linking.createURL("onConnect");
// build a route "scheme://onConnect" route, you don't have to write a page for 
// this callback url
const connection = new Connection(clusterApiUrl("devnet"));

console.log("onConnectRedirectLink", onConnectRedirectLink) ;

const decryptPayload = (data, nonce, sharedSecret) => {
  if (!sharedSecret) throw new Error("missing shared secret");
   
  const decryptedData = nacl.box.open.after(
    bs58.decode(data),
    bs58.decode(nonce),
    sharedSecret
  );
  if (!decryptedData) {
    throw new Error("Unable to decrypt data");
  }
  return JSON.parse(Buffer.from(decryptedData).toString("utf8"));
  
}; 


const Home = () => {

  
  //   registerNNPushToken(30818, 'ZmwQ5lOc1tV4oM9jyMuU9J');
  //   registerIndieID('testdambitch', 30818, 'ZmwQ5lOc1tV4oM9jyMuU9J');
  
  const [deepLink, setDeepLink] = useState("");
  const [phantomWalletPublicKey, setPhantomWalletPublicKey] = useState(null);
  const [sharedSecret, setSharedSecret] = useState();
  const [session, setSession] = useState();
  const [dappKeyPair] = useState(nacl.box.keyPair());



  // 設置推送通知
  useEffect(() => {
  const setupNotifications = async () => {
    if (Platform.OS !== 'web') {
  
      // 一開始的彈出式權限通知
      
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Notification permissions not granted');
        return;
      }
    }
  };
  
  setupNotifications();
}, []);

// 連接到 Phantom
const connect = async () => {
  try {
    const params = new URLSearchParams ({
      cluster: "devnet",
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),// phantom和dapp溝通的加密通道
      app_url: "https://phantom.app", // 單純的前端顯示資訊而已
      redirect_link: onConnectRedirectLink, //回調路由(回到這裡)
    });


    const url = `https://phantom.app/ul/v1/connect?${params.toString()}`;
    await Linking.openURL(url);
  } catch (err) {
    Alert.alert('Error', `Unable to open Phantom: ${err.message}`);
  }
};

useEffect(() => {
  //senario 1: cold activate
  const initializeDeeplinks = async () => {
    const initialUrl = await Linking.getInitialURL();
    // 只會抓剛啟動時的URL，如果已經打開過，一定是null
    // 所以下面這個if 條件只有「剛啟動」才會做馬上的替換
    // btw，手動點開的行為一樣抓不到url
    if (initialUrl) {
      console.log(initialUrl) ;
      setDeepLink(initialUrl);
    }
  };
  initializeDeeplinks();
  
  // senario2: app aleady open
  // url is an keyword meaning an event that got some url back
  const listener = Linking.addEventListener("url", handleDeepLink);
  return () => listener.remove();
}, []);

const handleDeepLink = ({ url }) => {
  setDeepLink(url);
  console.log("something come back!!!!!!!!!!!!!!!!!!!!!", url) ;
};


// analysis public key
useEffect(() => {
  if(!deepLink) return ;
  const url = new URL(deepLink) ;
  const params = url.searchParams ;


  if (params.get("errorCode")) {
    const error = Object.fromEntries([...params]);
    const message =
      error?.errorMessage ??
      JSON.stringify(Object.fromEntries([...params]), null, 2);
    console.log("error: ", message);
    return;
  }

  if (/onConnect/.test(url.pathname)) {
    console.log("we received a connect response from Phantom: ", url);
    const sharedSecretDapp = nacl.box.before(
      bs58.decode(params.get("phantom_encryption_public_key")),
      dappKeyPair.secretKey
    ) ;
    
    const connectData = decryptPayload(
      params.get("data"),
      params.get("nonce"),
      sharedSecretDapp
    );

    setSharedSecret(sharedSecretDapp);
    setSession(connectData.session);
    setPhantomWalletPublicKey(new PublicKey(connectData.public_key));
    console.log(`connected to ${connectData.public_key.toString()}`);
  }

  // if(/onDisconnect/.test(url.pathname)) {
  //   setPhantomWalletPublicKey(null) ;
  //   console.log("disconnected") ;
  // }

  // if(/onSignAndSendTransaction/.test(url.pathname)) {
  //   const signAndSendTransactionData = decryptPayload(
  //     params.get("data"),
  //     params.get("nonce"),
  //     sharedSecret
  //   );
  //   console.log("transaction submitted: ", signAndSendTransactionData);
  //   Toast.show({
  //     type: "success",
  //     text1: "Review submitted 🎥",
  //     text2: signAndSendTransactionData.signature,
  //   });
  // }





}, [deepLink]) ;


const disconnect = async () => {
  console.log("disconnect");
};

const signAndSendTransaction = async (transaction) => {
  console.log("signAndSendTransaction");
};



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
                        <HeaderWallet publicKey="0x1444467891je6kjetkektekekejtktejrtkr"/>
                    ),
                    headerRight: () => (
                        <Button title="Connect Phantom" onPress={connect} />
                    ),
                    headerTitle: "",            
                }}    
            />

          
            {/* <ScrollView showsVerticalScrollIndicator={false}>   
                <Main />

            </ScrollView> 

            <Footer/> */}

            

        </SafeAreaView>
    )
}



export default Home ;


