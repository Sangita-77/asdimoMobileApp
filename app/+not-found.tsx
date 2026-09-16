import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { usePathname, useRouter } from "expo-router";

// Completes the OAuth session if a redirect hits this fallback route
WebBrowser.maybeCompleteAuthSession();

export default function NotFoundScreen() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Immediately attempt to complete any pending auth session
    WebBrowser.maybeCompleteAuthSession();

    // Gracefully redirect back to login or previous screen without showing 404
    const timer = setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/ParentsDashboard/ParentsLogin");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
  },
});
