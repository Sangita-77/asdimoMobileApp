import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DataDeletionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/ParentsDashboard/ParentsLogin");
            }
          }}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Data Deletion</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Facebook User Data Deletion Instructions</Text>
        <Text style={styles.lastUpdated}>Last Updated: September 16, 2026</Text>

        <Text style={styles.paragraph}>
          AsDimo provides Facebook Login as a convenient way for users to create an account and authenticate. According to Facebook Platform rules and user privacy regulations, you have the full right to remove your activities and data associated with AsDimo.
        </Text>

        <Text style={styles.sectionHeading}>How to delete your Facebook login data from AsDimo:</Text>
        <Text style={styles.paragraph}>
          You can remove the connection between your Facebook account and AsDimo at any time by following these steps:
        </Text>

        <Text style={styles.step}>
          1. Go to your Facebook profile&apos;s <Text style={styles.bold}>Settings &amp; Privacy</Text> &gt; <Text style={styles.bold}>Settings</Text>.
        </Text>
        <Text style={styles.step}>
          2. Navigate to <Text style={styles.bold}>Apps and Websites</Text> where you will see all applications connected to your Facebook account.
        </Text>
        <Text style={styles.step}>
          3. Search for <Text style={styles.bold}>AsDimo</Text> in the list.
        </Text>
        <Text style={styles.step}>
          4. Click the <Text style={styles.bold}>Remove</Text> button next to AsDimo.
        </Text>
        <Text style={styles.step}>
          5. If you also want to delete all historical activity and data stored on AsDimo servers, click <Text style={styles.bold}>View Removed Apps and Websites</Text>, select AsDimo, and click <Text style={styles.bold}>Send Request</Text> to trigger an automated data deletion request.
        </Text>

        <Text style={styles.sectionHeading}>Direct Data Deletion Request</Text>
        <Text style={styles.paragraph}>
          If you would like us to manually purge all your account information, child profiles, and logs from our database immediately, please send an email from your registered email address with the subject &ldquo;Delete My Data&rdquo; to:
        </Text>
        <Text style={styles.contactText}>Email: support@asdimo.com</Text>

        <Text style={styles.paragraph}>
          We will process your data deletion request within 3 business days and send a confirmation email once completed.
        </Text>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#F0F4F8",
    borderRadius: 8,
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0288D1",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212121",
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 6,
  },
  lastUpdated: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: "#334155",
    marginBottom: 10,
  },
  step: {
    fontSize: 14,
    lineHeight: 22,
    color: "#334155",
    marginBottom: 8,
    paddingLeft: 4,
  },
  bold: {
    fontWeight: "700",
    color: "#0F172A",
  },
  contactText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0288D1",
    marginVertical: 8,
  },
  bottomSpacing: {
    height: 40,
  },
});
