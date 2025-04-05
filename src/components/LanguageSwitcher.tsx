
import { useState } from "react";
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
import { useLanguage } from "@/contexts/LanguageContext";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' }
];

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, changeLanguage } = useLanguage();
  
  const handleLanguageChange = (lng: string) => {
    changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-ocean-dark relative">
            <Globe className="h-5 w-5" />
            <span className="sr-only">Toggle language</span>
            <span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-ocean text-white rounded-full w-4 h-4 flex items-center justify-center">
              {currentLanguage === 'en' ? 'EN' : 'ES'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
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
