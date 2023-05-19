import Link from "next/link";
import styled from "styled-components";

const Navbar = styled.nav`
  background-color: #f8f9fa;
  padding: 10px;
`;

const NavLink = styled.a`
  margin-right: 15px;
  cursor: pointer;
  color: #007bff;
  text-decoration: none;

  &:hover {
    color: #0056b3;
  }
`;

const Layout = ({ children }) => (
  <div>
    <Navbar>
      <Link href="/" passHref>
        <NavLink>Home</NavLink>
      </Link>
      <Link href="/gift_card" passHref>
        <NavLink>Buy a Gift Card</NavLink>
      </Link>
    </Navbar>
    <main>{children}</main>
  </div>
);

export default Layout;
