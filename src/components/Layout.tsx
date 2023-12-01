import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-stretch",
          backgroundColor: "white",
        }}
      >
        <aside className="h-screen sticky top-0">
          <Navbar />
        </aside>
        <main style={{ margin: "0", width: "100%", paddingRight: "0" }}>
          <div>{children}</div>
        </main>
      </div>
      <footer className="w-full h-24 border-t">
        <Footer links={[{ link: "/", label: "Home" }]} />
      </footer>
    </>
  );
}
