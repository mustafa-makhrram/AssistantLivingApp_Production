import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import Header from '../../../Components/Header/Header'
import { useTheme } from '../../../../Theme'
import createStyles from './styles'
const PrivacyPolicy = ({navigation}) => {
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme ,AppName} =
        useTheme();
    const styles = createStyles({
        Tcolor,
        primary,
        secondary,
        background,
        theme,
        logo,
        toggleTheme,
    });

  return (
    <SafeAreaView style={styles.container}>
        <Header Heading={'Privacy Policy'} navigation={navigation}/>
<ScrollView showsVerticalScrollIndicator={false} style={{flex:1,}} contentContainerStyle={{paddingBottom:20}}>
         <Text style={styles.section1}>
        🛡️ Privacy Policy
        </Text>
          <Text style={styles.section2}>
        Last updated: [May 18, 2025]
        </Text>

          <Text style={styles.section3}>
      Welcome to our application {AppName},  built to support elderly and disabled individuals with the help of caregivers. We deeply value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and protect data related to our services.
        </Text>
        

              <Text style={styles.section1}>
       📌 1. Information We Collect
        </Text>
        <Text style={styles.section3}>
            We may collect the following types of information:

Personal Information
Name, email address, contact number, caregiver–user relationships, and other profile information you voluntarily provide.

Health & Activity Data
Information related to reminders, medication schedules, movement alerts, or sleep patterns to assist caregivers in monitoring users.

Device & Sensor Data
Data from connected devices (e.g., Raspberry Pi sensors, motion detectors) used to ensure safety.

Usage Data
App usage logs, interaction patterns, and technical details (e.g., device type, operating system, crash logs).
        </Text>

               <Text style={styles.section1}>
       🔒 4. Data Security
        </Text>
        <Text style={styles.section3}>
            We implement industry-standard security measures to protect your data. However, no digital platform is 100% secure. We encourage you to use strong passwords and keep your account confidential.
            Data is kept for as long as necessary to fulfill the purposes outlined in this policy like in the app functionality , the data is retained for 1 days only.
        </Text>

          </ScrollView>
        </SafeAreaView>
        
  
  )
}

export default PrivacyPolicy