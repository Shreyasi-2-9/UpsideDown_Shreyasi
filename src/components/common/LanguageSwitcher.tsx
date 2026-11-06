import { useApp } from "../../context/AppContext";
import type { LanguageCode } from "../../types";

export function LanguageSwitcher() {
  const { language, setLanguage } = useApp();
  const languages: { code: LanguageCode; label: string }[] = [
    { code: "EN", label: "EN" },
    { code: "हिं", label: "हिं" },
    { code: "म", label: "म" },
  ];

  return (
    <div className="language" aria-label="Language switcher">
      {languages.map((l) => (
        <button
          key={l.code}
          type="button"
          className={language === l.code ? "active" : ""}
          onClick={() => setLanguage(l.code)}
          title={`Switch language to ${l.label}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
