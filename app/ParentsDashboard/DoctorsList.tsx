import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import DoctorListCard from "@/components/ui/ListComponents";
import OrientationLock from "@/components/ui/ScreenOrientation";
import React from "react";
import { FlatList } from "react-native";


const doctors = [
  {
    id: "1",
    name: "Dr. John Smith",
    availableTime: "09:00 AM - 05:00 PM",
  },
  {
    id: "2",
    name: "Dr. Emily Watson",
    availableTime: "10:30 AM - 07:00 PM",
  },
];

export default function DoctorList() {
  return (
    <>
    <OrientationLock variant="portrait" />
    <Header/>
    <FlatList
      data={doctors}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <DoctorListCard
        //   image={item.image}
          name={item.name}
        //   availableTime={item.availableTime}
          onBookNow={() => console.log(`Book ${item.name}`)}
     />
      )}
      showsVerticalScrollIndicator={false}
    />
    <Footer/>
    </>
  );
}