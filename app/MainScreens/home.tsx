import { useTransition } from "@/components/AnimationCompo/TransitionProvider";
import Button from "@/components/ButtonCompo/Button";
import { playClickSound } from "@/components/SoundCompo/ButtonSound";
import CompoLoginBack from '@/components/ui/CompoLoginBack';
import { ROUTES } from "@/constants/routes";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View, } from 'react-native';
import { getDynamicStyles } from '../../constants/globalStyle'

const DashboardIcon = require("../../assets/images/landingDashIcon.png");
const settingsIcon = require("../../assets/images/landingSettingIcon.png");
const LogoutIcon = require("../../assets/images/SignOut.png");

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
  const transition = useTransition();
  const { width } = useWindowDimensions();
  const dynamicStyles = getDynamicStyles(width);

  return (
    <CompoLoginBack
      dinoImage={require('@/assets/images/Diano_Run.gif')}
    >
      <View
        style={dynamicStyles.FormWrap}
      >
        <View
          style={[
            styles.topButtons,
            {
              marginRight: width * 0.05,
            },
          ]}
        >
          <Button
            text="Go to my dashboard"
            width="auto"
            variant="white"
            icon={
              <Image
                source={DashboardIcon}
                style={styles.iconCircle}
              />
            }
          />

          <Button
            text="Settings"
            width="auto"
            variant="white"
            textSize="md"
            icon={
              <Image
                source={settingsIcon}
                style={styles.iconCircle}
              />
            }
            onPress={() => {
              playClickSound();

              transition.current?.cover(() => {
                router.push(ROUTES.APP.SETTINGS);
              });
            }}
          />
        </View>

        <Text style={styles.title}>
          Hello there!
        </Text>

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
              style={[
                styles.card,
                {
                  width: width * 0.236,
                },
              ]}
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
                text=""
                style={styles.arrowButton}
                width="auto"
                icon={
                  <Image
                    source={card.cardbtn}
                    style={{
                      width: 30,
                      height: 30,
                    }}
                  />
                }
              />
            </LinearGradient>
          ))}
        </ScrollView>
      </View>

      <View style={styles.logoutContainer}>
        <Button
          text="Log out"
          variant="white"
          textSize="md"
          icon={<Image source={LogoutIcon} />}
        />
      </View>
    </CompoLoginBack>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 27, lineHeight: 27, fontWeight: '700', marginBottom: 5, color: '#272727', textAlign: 'center', },

  subtitle: {
    fontSize: 16,
    color: '#272727',
    marginBottom: 15,
    textAlign: 'center',
  },

  cardsContainer: {
    gap: 12,
    width: '100%',
    paddingBottom: 13,
    paddingLeft: 5,
  },

  card: {
    borderRadius: 16,
    padding: 15,
    overflow: 'hidden',

    shadowColor: '#707070',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
  },

  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },

  cardDescription: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 14,
    marginBottom: 10,
  },

  cardImage: {
    width: '100%',
    height: 120,
  },

  arrowButton: {
    left: -11,
    bottom: 15,
    width: 30,
    height: 30,
    padding: 0,
    borderRadius: 16,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },

  topButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 15,
    marginBottom: 16,
    marginTop: 17,
  },

  iconCircle: {
    width: 22,
    height: 22,
    marginRight: 3,
  },

  FormWrap: {
    zIndex: 100,
    justifyContent: 'center',
    flex: 1,
  },

  logoutContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 30,
    marginBottom: 20,
  },
});

export default LandingScreen;