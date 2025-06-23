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


const onConnectRedirectLink = Linking.createURL("onConnect");
// build a route【"scheme"://onConnect】route, you don't have to write a page for this callback url
const onDisconnectRedirectLink = Linking.createURL("onDisconnect");
const onSignAndSendTransactionRedirectLink = Linking.createURL("onSignAndSendTransaction")

const connection = new Connection(clusterApiUrl("devnet"));


const Home = () => {

  /**
   * this is for push notification
   * registerNNPushToken: let native-notify know which group the app belongs to
   * registerIndieID: let native-notify know who this device are in this group(otherwise, no persional notification)
   * 
   * We also have to ask permission of sending notification from user.
   *  */ 
  registerNNPushToken(30818, 'ZmwQ5lOc1tV4oM9jyMuU9J');
  registerIndieID('testdambitch', 30818, 'ZmwQ5lOc1tV4oM9jyMuU9J');

  useEffect(() => {
    const setupNotifications = async () => {
      if (Platform.OS !== 'web') {      
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Error', 'Notification permissions not granted');
          return;
        }
      }
    };
    setupNotifications();
  }, []);


  // phantom response deeplink
  const [deepLink, setDeepLink] = useState(""); 
  // wallet public key
  const [phantomWalletPublicKey, setPhantomWalletPublicKey] = useState(null);
  const [sharedSecret, setSharedSecret] = useState();// share secret key
  const [session, setSession] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [dappKeyPair] = useState(nacl.box.keyPair());



  /**
   * all of these before jsx are about how to jump to phantom and jump back
   * so here is the basic idea: deeplink is a special internet link that can 
   * let our mobile opens some spicific pages in our app(on only main page).
   * 
   * What I want to do is that I want to jump(by deeplink) to phantom,  
   * and get some authentications, which is can let us sign transactions 
   * in our dapp. And then, we jump back(by deeplink) to our dapp. 
   * 
   * And for security reason, we need use Diffie‑Hellman algorithm to let 
   * both our dapp and phantom know a shared secret key. 
   * 
   * So, by following code, we will see these steps:
   * 1. using deeplink to jump to phantom(three types)
   * 2. listening phantom's callback response(three types, too)
   * 3. analysis the response parameters
   * 4. do conresponding actions
  */



  /**
   * 1. using deeplink to jump to phantom(connect, disconnect, sign transaction)
   * phantom's deeplink is an universal link, which starts with https,
   *  but still a deeplink
   * 
   * connect:
   * 1. cluster: "devnet" which net we want phantam to connect
   * 2. dapp_encryption_public_key: we send our dapp's temp public key to phantom,
   *    so it can generate it's shared secret
   * 3. app_url: phantom would follow this url and expect an json data. It's just 
   *    frond showing usage. 
   * 4. redirect_link: We have to tell phontam : after having it's job done, where 
   *    it should jump back to(this would be a deeplink).
   * 
   * disconnect, sign transaction: just read the code by youself
   * 
   * 簡單說這一part就是主動傳訊息給phantom，告訴他我要幹嘛
  */ 

  const connect = async () => { 
    try {
      const params = new URLSearchParams ({ 
        cluster: "devnet", 
        dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey), 
        app_url: "https://phantom.app",  
        redirect_link: onConnectRedirectLink, 
      }); 
      const url = buildUrl("connect", params);
      await Linking.openURL(url);
    } catch (err) {
      Alert.alert('Error', `Unable to open Phantom: ${err.message}`);
    }
  };

  const disconnect = async () => {
    const payload = {session};
    const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      nonce: bs58.encode(nonce),
      redirect_link: onDisconnectRedirectLink,
      payload: bs58.encode(encryptedPayload),
    });
    const url = buildUrl("disconnect", params);
    Linking.openURL(url);
  };



  const signAndSendTransaction = async (transaction) => {
    if (!phantomWalletPublicKey) return;
    setSubmitting(true);
    transaction.feePayer = phantomWalletPublicKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
    });
    const payload = {
      session,
      transaction: bs58.encode(serializedTransaction),
    };
    const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      nonce: bs58.encode(nonce),
      redirect_link: onSignAndSendTransactionRedirectLink,
      payload: bs58.encode(encryptedPayload),
    });
    const url = buildUrl("signAndSendTransaction", params);
    Linking.openURL(url);
  };





/**
 * 2. listening phantom's callback response
 * 
 * We have to find a way to catch the response from phantom.
 * here are two condititons:
 * Q1: how if our dapp is just awaken by deeplink from phantom?
 * Q2: how if our dapp is already open?
 * 
 *  for Q1 answer, we can use Linking.getInitialURL();
 *  this is a special function that it records which 
 *  deeplink activated our itself. If awaken by phantom's callback,
 *  it would be  onConnectRedirectLink, if awaken by expo, it would be 
 *  exp://...., if awaken by our hand, it would be null. Also, if 
 * it has already open, it would be null, too.
 * 
 * for Q2 answer, we can use Linking.addEventListener("url", handleDeepLink) 
 * to listen the deeplink.
 */
useEffect(() => {
  //senario 1: cold activate
  const initializeDeeplinks = async () => {
    const initialUrl = await Linking.getInitialURL();
    if (initialUrl) {
      console.log(initialUrl) ;
      setDeepLink(initialUrl);
    }
  };
  initializeDeeplinks();
  
  //senario 1: hat activate
  const listener = Linking.addEventListener("url", handleDeepLink);
  return () => listener.remove();
}, []);

const handleDeepLink = ({ url }) => {
  setDeepLink(url);
  console.log("something come back!!!!!!!!!!!!!!!!!!!!!", url) ;
};


/**
 * 3. analysis the response parameters  
 * 4. do conresponding actions 
 * be aware: this useEffect is binding with deepLink variable
 * 這邊就是被動等phantom的回應
*/
useEffect(() => {

  if(!deepLink) return ;
  const url = new URL(deepLink) ;
  const params = url.searchParams ;

  // simple error handling
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

  if(/onDisconnect/.test(url.pathname)) {
    setPhantomWalletPublicKey(null) ;
    console.log("disconnected") ;
  }

  if (/onSignAndSendTransaction/.test(url.pathname)) {
    const signAndSendTransactionData = decryptPayload(
      params.get("data"),
      params.get("nonce"),
      sharedSecret
    );
    console.log("transaction submitted: ", signAndSendTransactionData);
  }

}, [deepLink]) ;

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


