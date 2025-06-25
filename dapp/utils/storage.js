import { toByteArray } from 'base64-js';
import AsyncStorage from '@react-native-async-storage/async-storage';


const setWallet = async (wallet) => {
    await AsyncStorage.setItem('saveWalletAddress', wallet.toString());
};

const getWallet = async () => {
    const wallet = await AsyncStorage.getItem('saveWalletAddress');
    return wallet ;
};

const setSharedSecret = async (secret) => {
    await AsyncStorage.setItem('sharedSecret', secret);
};

const getSharedSecret = async () => {
    const secret = await AsyncStorage.getItem('sharedSecret');
    return secret ;
};

const setSession = async (session) => {
    await AsyncStorage.setItem('session', session);
};

const getSession = async () => {
    const session = await AsyncStorage.getItem('session');
    return session ;
};

// be careful : if input is invalid, then 
// asyncStorage won't change, orginal data remain 
// the same. For example, null is useless. 

export default{
  setWallet,
  getWallet,
  setSharedSecret,
  getSharedSecret,
  setSession,
  getSession,
};