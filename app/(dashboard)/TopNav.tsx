import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

const TopNav = () => (
  <nav
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.75rem 1.5rem",
      borderBottom: "1px solid #27272a",
      background: "#18181b",
      minHeight: 56,
    }}
  >
    <Link href="/">
      <span style={{ fontWeight: 600, fontSize: 20, color: "#fff" }}>
        T3 Cloneathon
      </span>
    </Link>
    <UserButton
      appearance={{
        elements: { userButtonAvatarBox: { borderColor: "#fff" } },
      }}
    />
  </nav>
);

export default TopNav;
