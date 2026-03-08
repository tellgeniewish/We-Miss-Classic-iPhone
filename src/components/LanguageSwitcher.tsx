import { useLocale } from "@/hooks/useLocale";
import type { Locale } from "@/i18n/translations";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

const labels: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
};

const LanguageSwitcher = () => {
  const { locale, setLocale } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-full hover:bg-secondary transition-colors">
          <Globe className="w-4 h-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32 rounded-xl">
        {(Object.keys(labels) as Locale[]).map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => setLocale(l)}
            className={`cursor-pointer text-sm ${l === locale ? "font-semibold" : ""}`}
          >
            {labels[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
