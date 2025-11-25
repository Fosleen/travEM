import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>404 - Članak nije pronađen</h1>
      <p>Članak koji tražite ne postoji ili je uklonjen.</p>
      <Link href="/" style={{ color: "#2BAC82", textDecoration: "underline" }}>
        Povratak na početnu
      </Link>
    </div>
  );
}
