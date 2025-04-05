
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' }
];

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  
  // Force re-render when language changes to ensure UI updates
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng).then(() => {
      setCurrentLanguage(lng);
      // Force a re-render of the entire app
      window.location.reload();
    });
    setIsOpen(false);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-ocean-dark">
            <Globe className="h-5 w-5" />
            <span className="sr-only">Toggle language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`cursor-pointer ${
                currentLanguage === language.code ? "bg-ocean/10 text-ocean-dark" : ""
              }`}
            >
              {language.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};

export default LanguageSwitcher;
