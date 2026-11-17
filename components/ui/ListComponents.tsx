
import { AvailabilitySlot, TherapistRoleData } from "@/services/authService";
import { Ionicons, Fontisto, SimpleLineIcons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Button, { ButtonVariant } from "../ButtonCompo/Button";
import { globalStyle } from "../../constants/globalStyle";

type SlotVariant = "default" | "compact";
type IconName = React.ComponentProps<typeof Ionicons>["name"];

interface DoctorListCardProps {
  image?: ImageSourcePropType;
  therapist?: TherapistRoleData;
  name?: string;
  ClinicName?: string;
  category?: string;
  experience?: number | string;
  Status?: boolean;
  languages?: string[];
  availability?: AvailabilitySlot[];
  isAvailable?: boolean;
  onBookNow?: (slot: AvailabilitySlot) => void;
  appointmentBooking?: () => void;
  slotVariant?: SlotVariant;
  AppointDate?: string;
  AppointStatus?: string;
  Zoomlink?: () => void;
  ViewDetails?: () => void;
  AppoinStatusVar?: ButtonVariant;
  actionButtonText?: string;
  Iconmedium?: IconName;
  actionButtonVariant?: ButtonVariant;
  onActionButtonPress?: () => void;
  showViewDetails?: boolean;
  onViewDetails?: () => void;
  noticeText?: string;
}

const parseDate = (date: string) => {
  const [day, month, year] = date.split("-").map(Number);
  return day && month && year ? new Date(year, month - 1, day) : null;
};

const isFutureSlot = (slot: AvailabilitySlot) => {
  const date = slot?.date && parseDate(slot.date);
  if (!date) return false;

  const [hours = 0, minutes = 0] = (slot.time || "00:00").split(":").map(Number);
  date.setHours(hours, minutes, 0, 0);

  return date.getTime() > Date.now();
};

export default function DoctorListCard({
  image,
  therapist,
  name = "Doctor",
  category = "Therapist",
  ClinicName,
  experience,
  Status = false,
  languages = [],
  availability = [],
  isAvailable: propIsAvailable,
  slotVariant = "default",
  AppointDate,
  AppointStatus,
  Zoomlink,
  ViewDetails,
  Iconmedium = "calendar-outline",
  actionButtonText,
  actionButtonVariant = "green",
  onActionButtonPress,
  showViewDetails = true,
  onViewDetails,
  noticeText,
}: DoctorListCardProps) {
  const { width } = useWindowDimensions();

  const availableSlots = useMemo(
    () => availability.filter((slot) => !slot.isBooked && isFutureSlot(slot)),
    [availability]
  );

  const dates = useMemo(
    () =>
      [...new Set(availableSlots.map((slot) => slot.date))].sort(
        (a, b) => parseDate(a)!.getTime() - parseDate(b)!.getTime()
      ),
    [availableSlots]
  );
  
const medium = availability.find(
  (slot) => !slot.isBooked && isFutureSlot(slot)
)?.medium;

  const isAvailable = propIsAvailable ?? availableSlots.length > 0;
  const clinicName = ClinicName || therapist?.cliniqueName;


  return (
    <View style={styles.card}>
      <View style={styles.topSection}>
        <View>
          {image ? (
            <Image source={image} style={styles.image} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarLetter}>
                {name.trim().charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <View style={styles.availabilityStatus}>
            <View
              style={[
                styles.statusDot,
                !isAvailable && styles.unavailableDot,
              ]}
            />
            <Text
              style={[
                styles.statusText,
                !isAvailable && styles.unavailableText,
              ]}
            >
              {isAvailable ? "Available" : "Unavailable"}
            </Text>
          </View>
        </View>

        <View style={styles.details}>
          
            {Status === false ? (
              <Text style={styles.experience}>
                <Text style={styles.experienceSpan}>
                  {experience !== "" ? `${experience ?? 0}+ Years` : "0+ Years"}
                </Text>{" "}
                Experience

              </Text>
            ) : (
              <Text style={styles.status}>
              <Text style={styles.experienceSpan}>
                {AppointStatus ?? "Pending"}
              </Text>
              </Text>
            )}
          

          <Text style={styles.name}>{name}</Text>

          <Text style={styles.specialty}>
            <Fontisto name="stethoscope" color="#74798B" /> {category}
          </Text>
           {clinicName && (
            <Text style={styles.specialty}> 
              <SimpleLineIcons name="organization" color="#74798B" /> Attached with - {clinicName} 
            </Text>
            )}
          {slotVariant === "default" ? (
            <>
              {!!languages.length && (
                <Text style={styles.specialty} numberOfLines={1}>
                  <Ionicons name="location-outline" color="#74798B" /> Locality (8km)
                </Text>
              )}
             
                <Text style={styles.specialty} numberOfLines={1}>
                <Ionicons name="calendar-outline" color="#74798B" /> Available for - { medium || "Not specified"}
                </Text>
              
              <View style={globalStyle.Dflex}>
                <Button textSize="md" text="Call Now" width="half"  variant="Sky"
                icon={<MaterialIcons name="add-call" color="#1386E7"/>}/>
                <Button textSize="md" text="Book Now" width="half" variant="green" onPress={onViewDetails || ViewDetails}/>
              </View>
            </>
          ) : (
            <>
              <View style={globalStyle.Dflex}>
                <View style={styles.appointDateBar}>
                  <Ionicons name={Iconmedium} size={15} color="#1386E7" />
                  <Text style={styles.dateText}>{AppointDate}</Text>
                </View>

                {/* <Button
                  style={{ width: width * 0.3, height: width * 0.09 }}
                  text={AppointStatus ?? "Pending"}
                  variant={AppoinStatusVar}
                  textSize="xs"
                /> */}
              </View>

              {!!noticeText && (
                <View style={styles.noticeRow}>
                  <Ionicons name="alert-circle-outline" size={13} color="#DC2626" />
                  <Text style={styles.noticeText}>{noticeText}</Text>
                </View>
              )}

              <View style={globalStyle.Dflex}>
                {actionButtonText && onActionButtonPress ? (
                  <Button
                    textSize="md"
                    width="half"
                    text={actionButtonText}
                    variant={actionButtonVariant}
                    onPress={onActionButtonPress}
                  />
                ) : Zoomlink ? (
                  <Button textSize="md" text="Join Meeting" variant="green" onPress={Zoomlink} />
                ) : null}

                {showViewDetails && (onViewDetails || ViewDetails) && (
                  <Button
                    textSize="md"
                    width="half"
                    text="View Details"
                    variant="transparent"
                    onPress={onViewDetails || ViewDetails}
                  />
                )}
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 12,
    marginVertical: 15,
    elevation: 4,
    boxShadow: "0px 0px 14px rgb(0 0 0 / 35%)",
    minHeight: 160,
  },
  topSection: { flexDirection: "row" },
  image: { width: 70, height: 70, borderRadius: 10 },
  avatarPlaceholder: {
    width: 95,
    height: 95,
    borderRadius: 10,
    backgroundColor: "#1682E7",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: { color: "#FFF", fontSize: 40, fontWeight: "700" },
  availabilityStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 7,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 6,
    backgroundColor: "#49AD3D",
    marginRight: 4,
  },
  statusText: { color: "#49AD3D", fontSize: 11 },
  unavailableDot: { backgroundColor: "#E53935" },
  unavailableText: { color: "#E53935" },
  details: { flex: 1, paddingLeft: 11, paddingTop: 4 },
  experience: {
    backgroundColor: "#abd8ff",
    width: 140,
    borderRadius: 4,
    color: "#042846",
    fontSize: 10,
    textAlign: "center",
    position: "absolute",
    right: 0,
    top: -23,
    padding: 2,
  },
  experienceSpan: { fontSize: 15, fontWeight: "600", color: "#054375", },
  status:{backgroundColor: "#FFC107", width: 140, textTransform: "capitalize",
    borderRadius: 24,
    color: "#054375",
    fontSize: 10,
    textAlign: "center",
    position: "absolute",
    right: 0,
    top: -23,
    paddingTop: 2,
    paddingBottom: 3,
  },
  name: { color: "#000", fontSize: 18, fontWeight: "600", lineHeight: 20, marginTop: -5 },
  specialty: { color: "#74798B", fontSize: 12, lineHeight: 17, paddingVertical: 4, textTransform: "capitalize"},
  appointDateBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF7FE",
    borderRadius: 4,
    minHeight: 20,
    paddingHorizontal: 3,
    paddingVertical: 2,
    width: "100%",
  },
  dateText: {
    flex: 1,
    color: "#1682E7",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
    paddingVertical: 10,
    paddingRight: 10,
  },
  // compactSlotsRow: {
  //   flexDirection: "row",
  //   flexWrap: "wrap",
  //   gap: 8,
  //   marginTop: 8,
  //   alignItems: "center",
  // },
  noticeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  noticeText: { color: "#DC2626", fontSize: 9, fontWeight: "600", flex: 1 },
});
