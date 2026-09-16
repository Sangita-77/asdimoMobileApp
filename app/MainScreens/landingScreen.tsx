import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import Button from "@/components/ButtonCompo/Button";
import CompoLoginBack from '@/components/ui/CompoLoginBack';
import { styles as globalStyle } from '../../constants/globalStyle';

const { width } = Dimensions.get('window');

const DashboardIcon = require("../../assets/images/landingDashIcon.png");
const settingsIcon = require("../../assets/images/landingSettingIcon.png");
const LogoutIcon = require("../../assets/images/landingLogout.svg");

import { LinearGradient } from 'expo-linear-gradient';
const cards = [
  {
    title: 'PE',
    description: 'Test your knowledge and learn new things',
    image: require('../../assets/images/pe-img01.png'),
    cardbtn: require('../../assets/images/landingGreenArrow.svg'),
    colors: ['#61D889', '#4DBE82'] as const,
  },
  {
    title: 'Appointment',
    description: 'Test your knowledge and learn new things',
    image: require('../../assets/images/appointment-img01.png'),
    cardbtn: require('../../assets/images/landingPurpleArrow.svg'),
    colors: ['#9060ED', '#7344D7'] as const,
  },
  {
    title: 'Games',
    description: 'Play fun and\neducational games',
    image: require('../../assets/images/games-img01.png'),
    cardbtn: require('../../assets/images/landingBlueArrow.svg'),
    colors: ['#5285EF', '#4072DB'] as const,
  },
  {
    title: 'Shop',
    description: 'Explore and buy\nexciting items',
    image: require('../../assets/images/shop-img01.png'),
    cardbtn: require('../../assets/images/landingPinkArrow.svg'),
    colors: ['#EA4C9B', '#DC378B'] as const,
  },
];

function LandingScreen() {
  return (
    <CompoLoginBack
      dinoImage={require('@/assets/images/Diano_Run.gif')}
    >
      <View style={styles.topButtons}>
        <Button
          style={styles.topButton}
          text="Go to my dashboard"
          width="auto"
          textStyle={styles.buttonText}
          variant="white"
          icon={
            <Image
              source={DashboardIcon}
              style={styles.iconCircle}
            />
          }
        />

        <Button
          style={styles.topButton}
          text="Settings"
          width="auto"
          textStyle={styles.buttonText}
          variant="white"
          icon={
            <Image
              source={settingsIcon}
              style={styles.iconCircle}
            />
          }
        />
      </View>

      <View style={globalStyle.FormWrap}>
        <Text style={styles.title}>Hello there!</Text>

        <Text style={styles.subtitle}>
          What would you like to explore today?
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
        >
          {cards.map((card, index) => (
            <LinearGradient
              key={index}
              colors={card.colors}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>
                {card.title}
              </Text>
              <Text style={styles.cardDescription}>
                {card.description}
              </Text>
              <Image
                source={card.image}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <Button
                text=''
                style={styles.arrowButton}
                width="auto"
                icon={
                  <Image
                    source={card.cardbtn}
                    // style={styles.iconCircle}
                    style={{width: 30, height: 30}}
                  />
                }
              />
            </LinearGradient>
          ))}
        </ScrollView>
        
      </View>

      <View style={styles.bottomButtons}>
        <Button
          style={styles.bottomButton}
          text="Log out"
          width="auto"
          textStyle={styles.buttonText}
          variant="white"
          icon={
            <Image
              source={LogoutIcon}
              // style={styles.iconCircle}
              style={{ width: 13, height: 13, marginRight: 3,}}
            />
          }
        />
        </View>
    </CompoLoginBack>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, },
  title: { fontSize: 27, lineHeight: 27, fontWeight: '700', marginBottom: 5, color: '#272727', textAlign: 'center',},
  subtitle: { fontSize: 16, color: '#272727', marginBottom: 15, textAlign: 'center',},
  cardsContainer: { gap: 12, width: '100%', paddingBottom: 13, paddingLeft: 5, },
  card: {
    width: '23.6%', /*height: 222,*/ borderRadius: 16, padding: 15, overflow: 'hidden', shadowColor: '#707070',
  shadowOffset: { width: 0, height: 6, },
  shadowOpacity: 0.10, shadowRadius: 12, elevation: 6,
},
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 6, },
  cardDescription: { color: '#fff', fontSize: 12, lineHeight: 14, marginBottom: 10,},
  cardImage: { width: '100%', height: 120, },
  arrowButton: { left: -11, bottom: 15, width: 30, height: 30, padding: 0,  borderRadius: 16, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', },
  /* Top buttons */
  topButtons: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 15, marginBottom: 16, marginRight: width * 0.05, marginTop: 17, },
  topButton: {
    backgroundColor: '#fff', maxHeight: 40, paddingHorizontal: 10, paddingRight: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', shadowColor: '#000',
    shadowOffset: { width: 0, height: 5, },
    shadowOpacity: 0.12, shadowRadius: 8, elevation: 5,
  },
  iconCircle: { width: 22, height: 22, marginRight: 3, },
  buttonText: { fontSize: 15, lineHeight: 13, fontWeight: '500', color: '#272727', },

  bottomButtons: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 15, marginBottom: 10, marginRight: width * 0.05, marginTop: 0, },
  bottomButton: {
    backgroundColor: '#fff', maxHeight: 40, paddingHorizontal: 10, paddingRight: 16, borderRadius: 50, flexDirection: 'row', alignItems: 'center', shadowColor: '#000',
    shadowOffset: { width: 0, height: 5, },
    shadowOpacity: 0.12, shadowRadius: 8, elevation: 5,
  },
  
});

export default LandingScreen;