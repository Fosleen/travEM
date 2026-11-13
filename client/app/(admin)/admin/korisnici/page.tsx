"use client";

import { useEffect, useState, type FormEvent } from "react";
import Button from "@/components/atoms/Button";
import { notifySuccess } from "@/components/atoms/Toast/Toast";
import { useDashboardUser } from "@/context/DashboardUserContext";
import { addAuthor, getUsers, type ManagedUser, type NewAuthor } from "@/utils/users";
import "./Users.scss";

const emptyAuthor: NewAuthor = { first_name: "", last_name: "", username: "", password: "" };
const errorMessage = (error: unknown) => error instanceof Error ? error.message : "Došlo je do pogreške. Pokušajte ponovno.";

export default function UsersPage() {
  const { isAdmin } = useDashboardUser();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [values, setValues] = useState<NewAuthor>(emptyAuthor);
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    void getUsers().then((data) => { if (active) setUsers(data); })
      .catch((error: unknown) => { if (active) setLoadError(errorMessage(error)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [isAdmin]);

  const reloadUsers = async () => {
    setLoading(true);
    setLoadError("");
    try { setUsers(await getUsers()); }
    catch (error) { setLoadError(errorMessage(error)); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    setSaveError("");
    if (values.password !== confirmation) { setSaveError("Lozinke se ne podudaraju."); return; }
    setSaving(true);
    try {
      const user = await addAuthor(values);
      setUsers((current) => [...current, user]);
      setValues(emptyAuthor);
      setConfirmation("");
      setShowPassword(false);
      notifySuccess(`Korisnik ${user.username} je uspješno dodan.`);
    } catch (error) { setSaveError(errorMessage(error)); }
    finally { setSaving(false); }
  };

  const update = (field: keyof NewAuthor, value: string) => setValues((current) => ({ ...current, [field]: value }));
  if (!isAdmin) return null;

  return <div className="users-page">
    <h2>Korisnici</h2>
    <section className="users-panel" aria-labelledby="add-author-heading">
      <h3 id="add-author-heading">Dodaj novog autora</h3>
      <p>Novi korisnik može pisati svoje članke i slati ih administratorima na pregled.</p>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={saving} className="users-fields">
          <label htmlFor="author-first-name">Ime
            <input id="author-first-name" name="first_name" value={values.first_name} onChange={(event) => update("first_name", event.target.value)} maxLength={100} autoComplete="off" required />
          </label>
          <label htmlFor="author-last-name">Prezime
            <input id="author-last-name" name="last_name" value={values.last_name} onChange={(event) => update("last_name", event.target.value)} maxLength={100} autoComplete="off" required />
          </label>
          <label htmlFor="author-username">Korisničko ime
            <input id="author-username" name="username" value={values.username} onChange={(event) => update("username", event.target.value)} maxLength={255} autoComplete="off" autoCapitalize="none" spellCheck={false} required />
          </label>
          <label htmlFor="author-password">Lozinka
            <input id="author-password" name="password" type={showPassword ? "text" : "password"} value={values.password} onChange={(event) => update("password", event.target.value)} minLength={8} maxLength={72} autoComplete="new-password" aria-describedby="author-password-help" required />
            <small id="author-password-help">Najmanje 8 znakova.</small>
          </label>
          <label htmlFor="author-password-confirmation">Ponovite lozinku
            <input id="author-password-confirmation" name="password_confirmation" type={showPassword ? "text" : "password"} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} minLength={8} maxLength={72} autoComplete="new-password" required />
          </label>
          <label className="users-show-password">
            <input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} /> Prikaži lozinku
          </label>
        </fieldset>
        <p>Korisničko ime i lozinku zatim prenesite autoru kako bi se mogao prijaviti.</p>
        {saveError && <p role="alert" className="users-error">{saveError}</p>}
        <Button type="submit" adminPrimary disabled={saving}>{saving ? "Spremanje..." : "Dodaj korisnika"}</Button>
      </form>
    </section>

    <section className="users-panel" aria-labelledby="existing-users-heading">
      <h3 id="existing-users-heading">Postojeći korisnici</h3>
      {loading ? <p role="status">Učitavanje korisnika...</p> : loadError ? <>
        <p role="alert" className="users-error">{loadError}</p><Button onClick={() => void reloadUsers()}>Pokušaj ponovno</Button>
      </> : <div className="users-table-wrapper"><table>
        <thead><tr><th scope="col">Ime i prezime</th><th scope="col">Korisničko ime</th><th scope="col">Uloga</th></tr></thead>
        <tbody>{users.map((user) => <tr key={user.id}><td>{user.first_name} {user.last_name}</td><td>{user.username}</td><td>{Number(user.is_admin) === 1 ? "Administrator" : "Autor"}</td></tr>)}</tbody>
      </table>{users.length === 0 && <p>Nema korisnika.</p>}</div>}
    </section>
  </div>;
}
