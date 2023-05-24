import Link from "next/link";
import React, { ReactNode } from "react";
import { useSession, signIn, signOut } from 'next-auth/react';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();

  return (
    <div>
      <nav className="navbar">
        <Link href="/" passHref>
          <span className="navlink">Home</span>
        </Link>
        <Link href="/gift_cards" passHref>
          <span className="navlink">Buy a Gift Card</span>
        </Link>
        {status !== "loading" && !session && (
          <span onClick={() => signIn()} className="navlink auth">
            Sign In
          </span>
        )}
        {status !== "loading" && session && (
          <span onClick={() => signOut()} className="navlink auth">
            Sign Out
          </span>
        )}
      </nav>
      <main>{children}</main>
      <footer>
        <Link href="/tos" passHref>
          <span className="footer-link">Terms of Service</span>
        </Link>
        <Link href="/privacy" passHref>
          <span className="footer-link">Privacy Policy</span>
        </Link>
      </footer>

      <style jsx>{`
        .navbar {
          background-color: #f8f9fa;
          padding: 10px;
          display: flex;
          justify-content: space-between;
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

        .auth {
          align-self: flex-end;
        }

        footer {
          background-color: #f8f9fa;
          padding: 10px;
          text-align: center;
          position: fixed;
          bottom: 0;
          width: 100%;
        }

        .footer-link {
          margin-right: 10px;
          color: #007bff;
          text-decoration: none;
        }

        .footer-link:hover {
          color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default Layout;