import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", },

  // Global Styles Start
  LoadingDimo: { width: 350, height: 220, },
  Dflex:{flexDirection: "row", justifyContent: "space-between", gap: 10, width: "auto",},
  Dblock:{flexDirection: "column", justifyContent: "space-between", width: "auto",},
  smallText:{textAlign: "center", paddingBottom: 10, fontWeight: 500, color: "#393B3E", fontSize: 15},
  // Global Styles End

  listContent:{ flexGrow: 1, padding: 16,}
});