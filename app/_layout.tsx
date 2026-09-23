import TransitionProvider from "@/components/AnimationCompo/TransitionProvider";
import { ROUTES } from "@/constants/routes";
import { isAuthenticated } from "@/services/authService";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { Redirect, Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";


WebBrowser.maybeCompleteAuthSession();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    GroBold: require("../assets/fonts/GROBOLD.ttf"),
  });

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    // Listen for incoming deep link URLs (OAuth redirects)
    const subscription = Linking.addEventListener("url", (event) => {
      if (event.url) {
        WebBrowser.maybeCompleteAuthSession({ skipStateChecksum: true } as any);
      }
    });

    async function prepare() {
      try {
        if (Platform.OS === "android") {
          await NavigationBar.setVisibilityAsync("hidden");
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

    return () => {
      subscription.remove();
    };
  }, []);

  if (!fontsLoaded || !appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <TransitionProvider>
        <View style={{ flex: 1, backgroundColor: "#1e1e1e", overflow: "visible" }}>
          <StatusBar hidden />
          <RouteGuard />
        </View>
      </TransitionProvider>
    </SafeAreaProvider>
  );
}

function RouteGuard() {
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [checkedPath, setCheckedPath] = useState<string | null>(null);
  const isPublicRoute =
    pathname === ROUTES.LANDING.LOADING ||
    pathname === ROUTES.AUTH.LOGIN ||
    pathname === "/+not-found" ||
    pathname?.startsWith("/[...unmatched]") ||
    pathname?.startsWith("/oauthredirect") ||
    pathname?.startsWith("/authorize") ||
    pathname?.startsWith("/privacy-policy") ||
    pathname?.startsWith("/data-deletion");

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

  const shouldRedirect =
    !isPublicRoute &&
    !checkingAuth &&
    checkedPath === pathname &&
    !authenticated;

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
          contentStyle: {
            backgroundColor: "transparent",
          },
        }}
      >
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="[...unmatched]" />
        <Stack.Screen name="oauthredirect" />
        <Stack.Screen name="authorize" />
        <Stack.Screen name="privacy-policy" />
        <Stack.Screen name="data-deletion" />
      </Stack>
      {shouldRedirect && <Redirect href={ROUTES.AUTH.LOGIN} />}
    </>
  );
}
