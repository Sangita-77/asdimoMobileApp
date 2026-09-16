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

export default function PrivacyPolicyScreen() {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>AsDimo Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last Updated: September 16, 2026</Text>

        <Text style={styles.paragraph}>
          Welcome to AsDimo (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and disclose your personal information when you use our mobile application and related services.
        </Text>

        <Text style={styles.sectionHeading}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          When you use AsDimo, we may collect the following information:
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Account Information:</Text> Name, email address, password, phone number, and profile details provided during registration or login.
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Social Login Information:</Text> If you choose to log in using Google or Facebook (Meta), we receive basic profile information such as your name, email address, and public profile picture according to your authorization permissions.
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Child & Assessment Data:</Text> Information you voluntarily provide regarding child profiles, assessments, milestones, and therapist bookings to personalize care and services.
        </Text>

        <Text style={styles.sectionHeading}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the information we collect for the following purposes:
        </Text>
        <Text style={styles.bulletPoint}>• To create, authenticate, and manage your account.</Text>
        <Text style={styles.bulletPoint}>• To provide educational games, assessments, and therapist consultation features.</Text>
        <Text style={styles.bulletPoint}>• To communicate important service notifications and updates.</Text>
        <Text style={styles.bulletPoint}>• To ensure platform security and prevent fraudulent activities.</Text>

        <Text style={styles.sectionHeading}>3. Sharing of Information</Text>
        <Text style={styles.paragraph}>
          We do not sell, rent, or trade your personal data. We only share information with authorized healthcare/therapy professionals you connect with, and third-party service providers (such as secure authentication and database providers) solely to operate the platform.
        </Text>

        <Text style={styles.sectionHeading}>4. Data Security</Text>
        <Text style={styles.paragraph}>
          We implement industry-standard encryption, access controls, and security practices to protect your data against unauthorized access, alteration, or disclosure.
        </Text>

        <Text style={styles.sectionHeading}>5. Your Rights and Data Deletion</Text>
        <Text style={styles.paragraph}>
          You have the right to access, update, or request the deletion of your personal data at any time. If you wish to delete your account or any personal data associated with Facebook Login, please visit our Data Deletion Request instructions or contact us directly at support@asdimo.com.
        </Text>

        <Text style={styles.sectionHeading}>6. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions or concerns regarding this Privacy Policy, please reach out to us at:
        </Text>
        <Text style={styles.contactText}>Email: support@asdimo.com</Text>
        <Text style={styles.contactText}>Website: https://dreamgroupsindia.com</Text>

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
    fontSize: 22,
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
  bulletPoint: {
    fontSize: 14,
    lineHeight: 22,
    color: "#334155",
    marginLeft: 8,
    marginBottom: 6,
  },
  bold: {
    fontWeight: "700",
    color: "#0F172A",
  },
  contactText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0288D1",
    marginTop: 4,
  },
  bottomSpacing: {
    height: 40,
  },
});
