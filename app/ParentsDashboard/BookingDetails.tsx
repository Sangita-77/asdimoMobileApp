import { useTransition } from "@/components/AnimationCompo/TransitionProvider";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import AppointmentActionModal from "@/components/ui/ActionModal";
import OrientationLock from "@/components/ui/ScreenOrientation";
import { API_BASE_URL } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import { doctorStyles, globalStyle } from "../../constants/globalStyle";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "@/components/ButtonCompo/Button";
import MyList, { ListItem } from "@/components/ui/IconTitleText";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Appointment, getAppointmentById } from "@/services/authService";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const parts = dateStr.trim().split("-").map(Number);
  if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
    const [day, month, year] = parts;
    return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  return dateStr;
}

function parseAppointmentDate(dateStr?: string, timeStr?: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.trim().split("-").map(Number);
  if (
    parts.length !== 3 ||
    isNaN(parts[0]) ||
    isNaN(parts[1]) ||
    isNaN(parts[2])
  ) {
    return null;
  }
  const [day, month, year] = parts;
  let hours = 0;
  let minutes = 0;
  if (timeStr) {
    const timeParts = timeStr.trim().split(":").map(Number);
    if (timeParts.length >= 2 && !isNaN(timeParts[0]) && !isNaN(timeParts[1])) {
      hours = timeParts[0];
      minutes = timeParts[1];
    }
  }
  return new Date(year, month - 1, day, hours, minutes);
}

function isPastAppointment(dateStr?: string, timeStr?: string): boolean {
  const d = parseAppointmentDate(dateStr, timeStr);
  if (!d) return false;
  return d.getTime() < Date.now();
}

function formatProfileImage(rawImg?: string | null) {
  if (!rawImg) return "";
  if (rawImg.startsWith("http://") || rawImg.startsWith("https://")) {
    return rawImg;
  }
  const cleanBase = API_BASE_URL.replace(/\/api$/, "");
  const cleanPath = rawImg.startsWith("/") ? rawImg : `/${rawImg}`;
  return `${cleanBase}${cleanPath}`;
}

function getStatusVariant(status?: string): "Neon" | "Red" | "Sky" {
  const s = (status || "").toLowerCase().trim();
  if (s === "approved" || s === "confirmed" || s === "completed") return "Neon";
  if (s === "cancelled" || s === "rejected" || s === "rescheduled") return "Red";
  return "Sky";
}

export default function BookingDetails() {
  const [actionModal, setActionModal] = useState<"reschedule" | "cancel" | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const transition = useTransition();

  const params = useLocalSearchParams<{
    appointmentId?: string;
    id?: string;
    _id?: string;
    from?: string;
    therapistId?: string;
    therapistName?: string;
    profileImg?: string;
    therapistCategory?: string;
    yearsOfExperience?: string;
    medium?: string;
    appointmentDate?: string;
    appointmentTime?: string;
  }>();

  const appointmentId = params.appointmentId || params.id || params._id;
  const isFromPastBooking = params.from === "PastBooking";

  const fetchAppointmentDetails = useCallback(async () => {
    if (!appointmentId) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAppointmentById(appointmentId);
      setAppointment(data);
    } catch (err: any) {
      console.error("Error fetching appointment details:", err);
      setError(err?.message || "Failed to load appointment details.");
    } finally {
      setIsLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    void fetchAppointmentDetails();
  }, [fetchAppointmentDetails]);

  // Extract display values from API response with fallback to route params
  const teacher = appointment?.teacher;
  const teacherUser = appointment?.teacherUser;
  const parentUser = appointment?.parentUser;
  const rawImage =
    teacherUser?.profileImg ||
    teacherUser?.googleProfile?.picture ||
    teacherUser?.facebookProfile?.picture ||
    params.profileImg;
  const imageUri = formatProfileImage(rawImage);

  const therapistName = teacherUser?.name || params.therapistName || "Therapist";
  const therapistCategory =
    teacher?.therapist_category || params.therapistCategory || "Specialist";
  const yearsOfExperience =
    teacher?.yearsOfExperience !== undefined
      ? String(teacher.yearsOfExperience)
      : params.yearsOfExperience;
  const appointmentDate = appointment?.date || params.appointmentDate || "";
  const appointmentTime = appointment?.time || params.appointmentTime || "";
  const appointmentStatus = appointment?.status || "Confirmed";
  const zoomLink = appointment?.zoomLink || appointment?.availability?.zoomLink;
  const medium =
    appointment?.availability?.medium?.toLowerCase().trim() ||
    params.medium?.toLowerCase().trim() ||
    (zoomLink ? "online" : "");

  const teacherUserId =
    teacherUser?.userId || teacher?.userId || appointment?.teacherId;

  const handleBookAgain = () => {
    const targetTherapistId =
      appointment?.teacherId ||
      teacher?.teacherId ||
      teacher?.userId ||
      teacherUser?.userId ||
      params.therapistId;

    router.push({
      pathname: ROUTES.AUTH.BOOKDOCTOR,
      params: {
        therapistId: targetTherapistId ? String(targetTherapistId) : "",
        therapistName: therapistName,
        profileImg: rawImage || "",
        therapistCategory: therapistCategory,
        yearsOfExperience: String(yearsOfExperience || 0),
        medium: medium || "online",
      },
    });
  };

  const appointmentItems: ListItem[] = [];

  if (appointmentDate) {
    appointmentItems.push({
      icon: "calendar-outline",
      title: "Date",
      text: formatDate(appointmentDate),
    });
  }

  if (appointmentTime) {
    appointmentItems.push({
      icon: "time-outline",
      title: "Time",
      text: appointmentTime,
    });
  }

  if (medium === "center" || medium === "clinic") {
    const clinicName = teacher?.cliniqueName || teacher?.clinicName;
    if (clinicName && typeof clinicName === "string" && clinicName.trim()) {
      appointmentItems.push({
        icon: "business-outline",
        title: "Clinic Name",
        text: clinicName.trim(),
      });
    }

    const clinicAddressParts = [
      teacherUser?.address,
      teacherUser?.city,
      teacherUser?.pincode,
    ].filter((p): p is string => Boolean(p && typeof p === "string" && p.trim()));

    const clinicAddress =
      clinicAddressParts.length > 0
        ? clinicAddressParts.join(", ")
        : "Address not available";

    appointmentItems.push({
      icon: "location-outline",
      title: "Clinic Location",
      text: clinicAddress,
    });
  } else if (medium === "home") {
    const homeAddressParts = [
      parentUser?.address,
      parentUser?.city,
      parentUser?.pincode,
    ].filter((p): p is string => Boolean(p && typeof p === "string" && p.trim()));

    const homeAddress =
      homeAddressParts.length > 0
        ? homeAddressParts.join(", ")
        : "Address not available";

    appointmentItems.push({
      icon: "location-outline",
      title: "Home Location",
      text: homeAddress,
    });
  } else if (medium === "online" || zoomLink) {
    appointmentItems.push({
      icon: "videocam-outline",
      title: "Mode",
      text: "Online Consultation",
    });
  }

  const bio: ListItem[] = [
    {
      icon: "school",
      title: "Experience",
      text: yearsOfExperience ? `${yearsOfExperience} years` : "Not available",
    },
  ];

  // if (Array.isArray(teacher?.languages) && teacher.languages.length > 0) {
  //   bio.push({
  //     icon: "language-outline",
  //     title: "Languages",
  //     text: teacher.languages.join(", "),
  //   });
  // }

  const statusNormalized = (appointmentStatus || "").toLowerCase().trim();
  const isPast =
    isPastAppointment(appointmentDate, appointmentTime) ||
    isFromPastBooking ||
    statusNormalized === "completed";
  const isCancelledOrRescheduled =
    statusNormalized === "cancelled" || statusNormalized === "rescheduled";
  const isWaitingApproval = !isPast && isCancelledOrRescheduled;
  const isRejected = !isPast && statusNormalized === "rejected";
  const isCompleted = statusNormalized === "completed";

  return (
    <>
      <OrientationLock variant="portrait" />
      <Header title="Appointment Details" />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.ProfileDetails}
          showsVerticalScrollIndicator={false}
        >
          <Text style={doctorStyles.heading}>Your Appointment</Text>
          <Text style={globalStyle.smallText2}>
            Here are the details of your scheduled appointment.
          </Text>

          {statusMessage && (
            <View
              style={[
                styles.statusBanner,
                statusMessage.type === "success"
                  ? styles.statusBannerSuccess
                  : styles.statusBannerError,
              ]}
            >
              <Ionicons
                name={
                  statusMessage.type === "success"
                    ? "checkmark-circle"
                    : "alert-circle"
                }
                size={18}
                color={statusMessage.type === "success" ? "#16A34A" : "#DC2626"}
              />
              <Text
                style={[
                  styles.statusBannerText,
                  statusMessage.type === "success"
                    ? styles.statusBannerTextSuccess
                    : styles.statusBannerTextError,
                ]}
              >
                {statusMessage.text}
              </Text>
              <TouchableOpacity
                onPress={() => setStatusMessage(null)}
                style={{ padding: 2 }}
              >
                <Ionicons name="close" size={16} color="#64748B" />
              </TouchableOpacity>
            </View>
          )}

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={styles.loadingText}>Loading appointment details...</Text>
            </View>
          ) : error && !appointment ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Button
                text="Retry"
                variant="solid"
                onPress={() => void fetchAppointmentDetails()}
                style={{ marginTop: 12 }}
              />
            </View>
          ) : (
            <View style={styles.profileWrap}>
              <View style={styles.profileContainer}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.avatar} />
                ) : (
                  <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>
                      {therapistName?.charAt(0)?.toUpperCase() || "D"}
                    </Text>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.doctorName}>{therapistName}</Text>
                  <Text style={globalStyle.smallText2}>{therapistCategory}</Text>
                  <MyList items={bio} variant="horizontal" />
                </View>
                <Button
                  text={
                    appointmentStatus.charAt(0).toUpperCase() +
                    appointmentStatus.slice(1)
                  }
                  style={styles.Status}
                  variant={getStatusVariant(appointmentStatus)}
                  textSize="xs"
                />
              </View>

              <MyList items={appointmentItems} variant="horizontal" />

              {isWaitingApproval && (
                <View style={styles.waitingApprovalCard}>
                  <Ionicons name="time-outline" size={18} color="#DC2626" />
                  <Text style={styles.waitingApprovalText}>
                    Your request is waiting for approval from admin
                  </Text>
                </View>
              )}

              {(medium === "online" || Boolean(zoomLink)) && !isWaitingApproval && !isRejected && !isPast ? (
                <View style={styles.zoomContainer}>
                  <Button
                    text="Join Video"
                    variant="green"
                    width="full"
                    textSize="md"
                    onPress={() => {
                      if (zoomLink) {
                        void Linking.openURL(zoomLink);
                      } else {
                        setStatusMessage({
                          type: "error",
                          text: "Video meeting link will be available prior to your consultation time.",
                        });
                      }
                    }}
                  />
                </View>
              ) : null}

              <View style={styles.InfoWrap}>
                <Text style={styles.InfoWrapTitle}>
                  {isPast
                    ? "Consultation Completed / Past"
                    : isWaitingApproval
                    ? "Request Waiting for Approval"
                    : medium === "online" || zoomLink
                    ? "Please join 5 minutes early"
                    : "Please arrive 15 minutes early"}
                </Text>
                <Text style={globalStyle.smallText2}>
                  {isPast
                    ? "This appointment took place on the scheduled date."
                    : isWaitingApproval
                    ? "Your request has been submitted and is currently awaiting approval from the admin."
                    : "Bring any previous reports or documents related to the consultation."}
                </Text>
              </View>

              {isPast ? (
                <View style={styles.profileContainer}>
                  <Button
                    text="Book Again"
                    variant="solid"
                    style={styles.AppointStatus}
                    width="full"
                    textSize="md"
                    onPress={handleBookAgain}
                  />
                </View>
              ) : isWaitingApproval ? null : isRejected ? (
                <View style={styles.profileContainer}>
                  <Button
                    text="Reschedule"
                    variant="Sky"
                    style={styles.AppointStatus}
                    width="full"
                    textSize="md"
                    onPress={() => {
                      setStatusMessage(null);
                      setActionModal("reschedule");
                    }}
                  />
                </View>
              ) : !isCompleted ? (
                <View style={styles.profileContainer}>
                  <Button
                    text="Reschedule"
                    variant="Sky"
                    style={styles.AppointStatus}
                    width="half"
                    textSize="md"
                    onPress={() => {
                      setStatusMessage(null);
                      setActionModal("reschedule");
                    }}
                  />

                  <Button
                    text="Cancel"
                    variant="Red"
                    style={styles.AppointStatus}
                    width="half"
                    textSize="md"
                    onPress={() => {
                      setStatusMessage(null);
                      setActionModal("cancel");
                    }}
                  />
                </View>
              ) : null}
            </View>
          )}

          <Pressable
            style={[styles.profileWrap, styles.BookingList]}
            onPress={() => {
              transition.current?.cover(() => {
                router.push(ROUTES.AUTH.DOCTORSLIST);
              });
            }}
          >
            <FontAwesome5 name="calendar-plus" size={54} color="#1386E7" />
            <View style={{ flex: 1 }}>
              <Text style={doctorStyles.heading}>Need to see another doctor?</Text>
              <Text style={globalStyle.smallText2}>Disorders & Autism Specialist</Text>
            </View>
            <FontAwesome5 name="angle-right" size={20} color="black" />
          </Pressable>
        </ScrollView>
      </View>

      <AppointmentActionModal
        visible={actionModal !== null}
        type={actionModal || "cancel"}
        appointmentId={appointment?._id || appointmentId}
        teacherUserId={teacherUserId}
        doctorName={therapistName}
        currentDate={appointmentDate}
        currentTime={appointmentTime}
        onClose={() => setActionModal(null)}
        onSuccess={(data) => {
          if (data.type === "cancel") {
            setAppointment((curr) =>
              curr ? { ...curr, status: data.status || "cancelled" } : curr
            );
            setStatusMessage({
              type: "success",
              text: "Appointment has been cancelled successfully.",
            });
          } else if (data.type === "reschedule") {
            setAppointment((curr) =>
              curr
                ? {
                    ...curr,
                    date: data.date || curr.date,
                    time: data.time || curr.time,
                    status: data.status || curr.status,
                  }
                : curr
            );
            setStatusMessage({
              type: "success",
              text: `Appointment rescheduled to ${data.date} at ${data.time} successfully.`,
            });
          }
        }}
      />
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 100, height: 115, borderRadius: 20 },
  BookingList: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  profileWrap: {
    padding: 20,
    borderRadius: 10,
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.17)",
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  AppointStatus: { paddingVertical: 13 },
  InfoWrap: {
    backgroundColor: "#EAF6FF",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    marginVertical: 20,
  },
  InfoWrapTitle: { color: "#1386E7", fontSize: 16, fontWeight: "700" },
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  Status: { position: "absolute", right: 0, top: 0 },
  ProfileDetails: { padding: 10, paddingBottom: 30 },
  doctorName: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  placeholderText: { color: "#FFF", fontSize: 34, fontWeight: "700" },
  profileContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 15,
  },
  placeholder: {
    width: 100,
    height: 115,
    borderRadius: 20,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 12,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    marginVertical: 20,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    textAlign: "center",
  },
  zoomContainer: {
    marginTop: 10,
    marginBottom: 6,
  },
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginVertical: 10,
    gap: 8,
    borderWidth: 1,
  },
  statusBannerSuccess: {
    backgroundColor: "#F0FDF4",
    borderColor: "#86EFAC",
  },
  statusBannerError: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
  },
  statusBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
  },
  statusBannerTextSuccess: {
    color: "#166534",
  },
  statusBannerTextError: {
    color: "#991B1B",
  },
  waitingApprovalCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginTop: 14,
    marginBottom: 6,
  },
  waitingApprovalText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
});

