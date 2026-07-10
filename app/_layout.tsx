import * as NavigationBar from "expo-navigation-bar";
import { Redirect, Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { ROUTES } from "@/constants/routes";
import { isAuthenticated } from "@/services/authService";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    GroBold: require("../assets/fonts/GROBOLD.ttf"),
  });

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        if (Platform.OS === "android") {
          await NavigationBar.setVisibilityAsync("hidden");
          await NavigationBar.setBehaviorAsync("overlay-swipe");
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!fontsLoaded || !appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: "#1e1e1e" }}>
        <StatusBar hidden={true} />
        <RouteGuard />
      </View>
    </SafeAreaProvider>
  );
}

function RouteGuard() {
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [checkedPath, setCheckedPath] = useState<string | null>(null);
  const isLoginRoute = pathname === ROUTES.AUTH.LOGIN;

  useEffect(() => {
    let mounted = true;

    isAuthenticated().then((auth) => {
      if (mounted) {
        setAuthenticated(auth);
        setCheckedPath(pathname);
        setCheckingAuth(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [pathname]);

  if (checkingAuth || checkedPath !== pathname) {
    return null;
  }

  if (!authenticated && !isLoginRoute) {
    return <Redirect href={ROUTES.AUTH.LOGIN} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    />
  );
}
