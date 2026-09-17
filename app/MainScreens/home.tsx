import { useTransition } from "@/components/AnimationCompo/TransitionProvider";
import Button from "@/components/ButtonCompo/Button";
import { playClickSound } from "@/components/SoundCompo/ButtonSound";
import CompoLoginBack from '@/components/ui/CompoLoginBack';
import { ROUTES } from "@/constants/routes";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View, } from 'react-native';
import { getDynamicStyles, globalStyle } from '../../constants/globalStyle';
import { useEffect} from "react";
import { Asset } from "expo-asset";
import AsyncStorage from "@react-native-async-storage/async-storage";


const DashboardIcon = require("../../assets/images/landingDashIcon.png");
const settingsIcon = require("../../assets/images/landingSettingIcon.png");
const LogoutIcon = require("../../assets/images/SignOut.png");
const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem("authSession");
    await AsyncStorage.removeItem("authUser");

    router.replace(ROUTES.AUTH.LOGIN);
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

const cards = [
  {
    title: 'PE',
    description: 'Test your knowledge and learn new things',
    image: require('../../assets/images/pe-img01.webp'),
    cardbtn: require('../../assets/images/landingGreenArrow.webp'),
    colors: ['#61D889', '#4DBE82'] as const,
    route: ROUTES.APP.HOME,
  },
  {
    title: 'Appointment',
    description: 'Test your knowledge and learn new things',
    image: require('../../assets/images/appointment-img01.png'),
    cardbtn: require('../../assets/images/landingGreenArrow.webp'),
    colors: ['#9060ED', '#7344D7'] as const,
    route: ROUTES.AUTH.DOCTORSLIST,
  },
  {
    title: 'Games',
    description: 'Play fun and\neducational games',
    image: require('../../assets/images/games-img01.png'),
    cardbtn: require('../../assets/images/landingGreenArrow.webp'),
    colors: ['#5285EF', '#4072DB'] as const,
    route: ROUTES.APP.LANDING,
  },
  {
    title: 'Shop',
    description: 'Explore and buy\nexciting items',
    image: require('../../assets/images/shop-img01.png'),
    cardbtn: require('../../assets/images/landingGreenArrow.webp'),
    colors: ['#EA4C9B', '#DC378B'] as const,
    route: ROUTES.APP.HOME,
  },
];


function LandingScreen() {
  useEffect(() => {
    Asset.loadAsync([
      DashboardIcon,
      settingsIcon,
      LogoutIcon,
    ]).catch((error) => {
      console.error("Failed to load assets:", error);
    });
  }, []);
  const transition = useTransition();
  const { width } = useWindowDimensions();
  const dynamicStyles = getDynamicStyles(width);

  return (
    <CompoLoginBack
      dinoImage={require('@/assets/images/Diano_Run.gif')}
    >
      <View style={dynamicStyles.FormWrap} >
        <View style={[ styles.topButtons ]} >
          <Button
            text="Go to my dashboard"
            width="auto"
            variant="white"
            icon={
              <Image
                source={DashboardIcon}
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

        <Text style={[globalStyle.signinText, {textAlign: "left", fontSize: Math.max(15, Math.min(width * 0.035, 24)), textShadowColor: "rgba(255, 255, 255, 0.85)", textShadowOffset: { width: -2, height: -1 }, textShadowRadius: 4, }, ]} >
          Hello there!
        </Text>

        <Text style={[globalStyle.signinText, { textAlign: "left" }, ]}>
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
                styles.card, { width: width * 0.175, paddingLeft: width * 0.02, },
              ]}
            >
              <Text style={[styles.cardTitle, { fontSize: width * 0.018, }, ]}>
                {card.title}
              </Text>

              <Text style={[styles.cardDescription, { fontSize: width * 0.010, lineHeight: width * 0.015}, ]}>
                {card.description}
              </Text>

              <Image
                source={card.image}
                style={{
                  width: width * 0.110,
                  height: width * 0.110,
                }}
                resizeMode="contain"
              />
              <View style={{ paddingLeft: width * 0.02, paddingBottom: width * 0.02 }}>
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
                  resizeMode="contain"
                />
              }
              onPress={() => {
                playClickSound();

                transition.current?.cover(() => {
                  router.push(card.route);
                });
              }}
            />
              </View>
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
          onPress={async () => {
          playClickSound();
          await handleLogout();
        }}
        />
      </View>
    </CompoLoginBack>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 27, lineHeight: 27, fontWeight: '700', marginBottom: 5, color: '#272727', textAlign: 'center', },

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
    marginBottom: -38,
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