import Link from "next/link";
import React, { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div>
    <nav className="navbar">
      <Link href="/" passHref>
        <span className="navlink">Home</span>
      </Link>
      <Link href="/gift_cards" passHref>
        <span className="navlink">Buy a Gift Card</span>
      </Link>
    </nav>
    <main>{children}</main>

    <style jsx>{`
      .navbar {
        background-color: #f8f9fa;
        padding: 10px;
      }

      .navlink {
        margin-right: 15px;
        cursor: pointer;
        color: #007bff;
        text-decoration: none;
      }

      .navlink:hover {
        color: #0056b3;
      }
    `}</style>
  </div>
);

export default Layout;
