"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import LoginModal from "@/components/LoginModal";
import UsernameModal from "@/components/UsernameModal";
import FrontPage from "@/components/FrontPage";
import { cinzelDecorative } from "@/lib/fonts";
import { inter } from "@/lib/fonts";

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [email, setEmail] = useState("");

  const handleLoginSuccess = (email: string) => {
    setEmail(email);
    setIsLoginModalOpen(false);
    setIsUsernameModalOpen(true);
  };

  const handleUsernameSet = (username: string) => {
    console.log(`Username set: ${username}`);
    setIsUsernameModalOpen(false);
    // Here you would typically update the user's state or send the username to your backend
  };

  return (
    <main
      className={`${inter.className} ${cinzelDecorative.variable} min-h-screen bg-gray-900 text-gray-100`}
    >
      <Navbar onLoginClick={() => setIsLoginModalOpen(true)} />
      <FrontPage />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <UsernameModal
        isOpen={isUsernameModalOpen}
        onClose={() => setIsUsernameModalOpen(false)}
        onUsernameSet={handleUsernameSet}
        email={email}
      />
    </main>
  );
}
