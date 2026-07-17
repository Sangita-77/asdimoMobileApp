import { StyleSheet,Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0f0f0d0",},

  // Global Styles Start
  LoadingDimo: { width: 350, height: 220, },
  Dflex:{flexDirection: "row", justifyContent: "space-between", width: "auto",},
  Dblock:{flexDirection: "column", justifyContent: "space-between", width: "auto",},
  smallText:{textAlign: "center", paddingBottom: 10, fontWeight: 500, color: "#393B3E", fontSize: 15},
  // Global Styles End
  safeArea: { flex: 1, },
  listContent:{ flexGrow: 1, padding: 16,},
  signinText: { color: "#000", textAlign: "center", fontWeight: "bold", fontSize: width * 0.035, marginBottom: 10, },
});