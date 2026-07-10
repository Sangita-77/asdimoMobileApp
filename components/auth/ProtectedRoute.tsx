import { isAuthenticated } from "@/services/authService";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      const auth = await isAuthenticated();
      if (mounted) {
        setAuthenticated(auth);
        setChecking(false);
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#763DFF" />
      </View>
    );
  }

  if (!authenticated) {
    return <Redirect href="/ParentsDashboard/ParentsLogin" />;
  }

  return <>{children}</>;
}
