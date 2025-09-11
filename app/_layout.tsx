import { AuthProvider } from "@/context/AuthContext";
import "./../global.css";
import { Slot } from "expo-router";

const RootLayout = () => {
  return (
    <>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </>
  );
};

export default RootLayout;
