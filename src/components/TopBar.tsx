import { ArrowLeft, Calendar, Globe } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopBarProps {
  title: string;
  showBack?: boolean;
  showCalendar?: boolean;
}

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "hi", name: "हिन्दी" },
  { code: "ja", name: "日本語" },
  { code: "zh", name: "中文" },
  { code: "ko", name: "한국어" },
  { code: "ru", name: "Русский" },
  { code: "it", name: "Italiano" },
];

const TopBar = ({ title, showBack = false, showCalendar = false }: TopBarProps) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);

    // Update URL parameter
    const newParams = new URLSearchParams(searchParams);
    newParams.set("lang", lang);
    setSearchParams(newParams);
  };

  return (
    <header className="flex items-center justify-between px-5 py-4">
      <div className="flex w-24 items-center gap-2">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
      </div>

      <h1 className="flex-1 text-center text-lg font-bold text-foreground line-clamp-1">{title}</h1>

      <div className="flex w-24 items-center justify-end gap-2">
        {showCalendar && (
          <button
            onClick={() => navigate("/weekly")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-secondary"
          >
            <Calendar className="h-5 w-5" />
          </button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-secondary">
              <Globe className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={i18n.language === lang.code ? "bg-accent" : ""}
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;
