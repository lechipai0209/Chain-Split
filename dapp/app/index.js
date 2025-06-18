import { useState } from 'react' ;
import { View, Text, ScrollView, SafeAreaView } from 'react-native' ;
import { Stack, useRouter } from 'expo-router' ;
import { icons, COLORS, FONTS, SIZES  } from '../constants' ;

import HeaderWallet  from '../components/common/header_wallet/header_wallet' ;
import Footer from '../components/common/footer/footer' ;
import Main from '../components/main/main' ;

const Home = () => {
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
                    headerTitle: "",            
                }}    
            />

          
            <ScrollView showsVerticalScrollIndicator={false}>   
                <Main />

            </ScrollView> 

            <Footer/>

            

        </SafeAreaView>
    )
}

export default Home ;