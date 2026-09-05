// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash } from "@phosphor-icons/react";
import AdvancedDropdown from "@/components/admin/atoms/AdvancedDropdown";
import Button from "@/components/atoms/Button";
import { getCountries, updateHitCountries } from "@/utils/countries";
import "./EditHitCountries.scss";

export default function EditHitCountries() {
  const router = useRouter();
  const [countries, setCountries] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getCountries(1, 1000, true).then((response) => {
      const data = Array.isArray(response?.data) ? response.data : [];
      setCountries(data.sort((a, b) => a.name.localeCompare(b.name, "hr")));
      setSelectedIds(data.filter((country) => country.is_hit).map((country) => country.id));
    });
  }, []);

  const addSelector = () => setSelectedIds((current) => [...current, null]);

  const updateSelector = (index, country) => {
    setSelectedIds((current) =>
      current.map((id, currentIndex) =>
        currentIndex === index ? country?.id ?? null : id
      )
    );
  };

  const removeSelector = (index) => {
    setSelectedIds((current) => current.filter((_, currentIndex) => currentIndex !== index));
  };

  const save = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      const ids = [...new Set(selectedIds.filter((id) => Number.isInteger(id)))];
      await updateHitCountries(ids);
      setSelectedIds(ids);
      setMessage('"Hit" države su spremljene.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Spremanje nije uspjelo.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="edit-hit-countries">
      <div className="edit-hit-countries-header">
        <div>
          <h2>&quot;Hit&quot; države</h2>
          <p>Preopručuje se odabrati tri države.</p>
        </div>
        <Button circle onClick={addSelector}>+</Button>
      </div>

      <div className="edit-hit-countries-list">
        {selectedIds.map((countryId, index) => (
          <div className="edit-hit-country-row" key={`${index}-${countryId ?? "empty"}`}>
            <AdvancedDropdown
              filter
              hardcodedValue="Odaberi državu..."
              options={countries.filter(
                (country) => country.id === countryId || !selectedIds.includes(country.id)
              )}
              selectedValue={countryId}
              defaultValue={countryId}
              onChange={(country) => updateSelector(index, country)}
            />
            <button type="button" className="edit-hit-country-remove" onClick={() => removeSelector(index)} aria-label="Ukloni državu">
              <Trash color="#AC2B2B" size={30} />
            </button>
          </div>
        ))}

        {selectedIds.length === 0 && (
          <p className="edit-hit-countries-empty">Trenutačno nije odabrana nijedna država.</p>
        )}
      </div>

      {message && <p className="edit-hit-countries-message">{message}</p>}

      <div className="edit-hit-countries-actions">
        <Button type="button" adminPrimary onClick={save} disabled={isSaving}>
          {isSaving ? "spremanje..." : "spremi"}
        </Button>
        <Button type="button" white onClick={() => router.push("/admin/sadrzaj")}>
          Odustani
        </Button>
      </div>
    </div>
  );
}
