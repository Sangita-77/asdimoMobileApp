import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0f0f0d0",},
  container2: { flex: 1, justifyContent: "center", alignItems: "center",},

  // Global Styles Start
  LoadingDimo: { width: 350, height: 220, },
  Dflex:{flexDirection: "row", justifyContent: "space-between", width: "auto",},
  Dblock:{flexDirection: "column", justifyContent: "space-between", width: "auto",},
  smallText:{textAlign: "center", paddingBottom: 10, fontWeight: 500, color: "#393B3E", fontSize: 15},
  // Global Styles End
  safeArea: { flex: 1, },
  listContent:{ flexGrow: 1, padding: 16,},
  signinText: { color: "#000", textAlign: "center", fontWeight: "bold", marginBottom: 10, },
  FormWrap: { zIndex: 100, justifyContent: "center", flex: 1, marginLeft: width * 0.25, marginRight: width * 0.05, },
});

export const commonStyles = StyleSheet.create({
  absoluteFill: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, },
});