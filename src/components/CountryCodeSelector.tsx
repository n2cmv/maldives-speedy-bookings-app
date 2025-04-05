import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CountryCode {
  code: string;
  name: string;
  dial_code: string;
  flag: string;
}

interface CountryCodeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

// List of all country codes
const countryCodes: CountryCode[] = [
  { code: "AF", name: "Afghanistan", dial_code: "+93", flag: "🇦🇫" },
  { code: "AL", name: "Albania", dial_code: "+355", flag: "🇦🇱" },
  { code: "DZ", name: "Algeria", dial_code: "+213", flag: "🇩🇿" },
  { code: "AS", name: "American Samoa", dial_code: "+1684", flag: "🇦🇸" },
  { code: "AD", name: "Andorra", dial_code: "+376", flag: "🇦🇩" },
  { code: "AO", name: "Angola", dial_code: "+244", flag: "🇦🇴" },
  { code: "AI", name: "Anguilla", dial_code: "+1264", flag: "🇦🇮" },
  { code: "AQ", name: "Antarctica", dial_code: "+672", flag: "🇦🇶" },
  { code: "AG", name: "Antigua and Barbuda", dial_code: "+1268", flag: "🇦🇬" },
  { code: "AR", name: "Argentina", dial_code: "+54", flag: "🇦🇷" },
  { code: "AM", name: "Armenia", dial_code: "+374", flag: "🇦🇲" },
  { code: "AW", name: "Aruba", dial_code: "+297", flag: "🇦🇼" },
  { code: "AU", name: "Australia", dial_code: "+61", flag: "🇦🇺" },
  { code: "AT", name: "Austria", dial_code: "+43", flag: "🇦🇹" },
  { code: "AZ", name: "Azerbaijan", dial_code: "+994", flag: "🇦🇿" },
  { code: "BS", name: "Bahamas", dial_code: "+1242", flag: "🇧🇸" },
  { code: "BH", name: "Bahrain", dial_code: "+973", flag: "🇧🇭" },
  { code: "BD", name: "Bangladesh", dial_code: "+880", flag: "🇧🇩" },
  { code: "BB", name: "Barbados", dial_code: "+1246", flag: "🇧🇧" },
  { code: "BY", name: "Belarus", dial_code: "+375", flag: "🇧🇾" },
  { code: "BE", name: "Belgium", dial_code: "+32", flag: "🇧🇪" },
  { code: "BZ", name: "Belize", dial_code: "+501", flag: "🇧🇿" },
  { code: "BJ", name: "Benin", dial_code: "+229", flag: "🇧🇯" },
  { code: "BM", name: "Bermuda", dial_code: "+1441", flag: "🇧🇲" },
  { code: "BT", name: "Bhutan", dial_code: "+975", flag: "🇧🇹" },
  { code: "BO", name: "Bolivia", dial_code: "+591", flag: "🇧🇴" },
  { code: "BA", name: "Bosnia and Herzegovina", dial_code: "+387", flag: "🇧🇦" },
  { code: "BW", name: "Botswana", dial_code: "+267", flag: "🇧🇼" },
  { code: "BR", name: "Brazil", dial_code: "+55", flag: "🇧🇷" },
  { code: "IO", name: "British Indian Ocean Territory", dial_code: "+246", flag: "🇮🇴" },
  { code: "BN", name: "Brunei Darussalam", dial_code: "+673", flag: "🇧🇳" },
  { code: "BG", name: "Bulgaria", dial_code: "+359", flag: "🇧🇬" },
  { code: "BF", name: "Burkina Faso", dial_code: "+226", flag: "🇧🇫" },
  { code: "BI", name: "Burundi", dial_code: "+257", flag: "🇧🇮" },
  { code: "KH", name: "Cambodia", dial_code: "+855", flag: "🇰🇭" },
  { code: "CM", name: "Cameroon", dial_code: "+237", flag: "🇨🇲" },
  { code: "CA", name: "Canada", dial_code: "+1", flag: "🇨🇦" },
  { code: "CV", name: "Cape Verde", dial_code: "+238", flag: "🇨🇻" },
  { code: "KY", name: "Cayman Islands", dial_code: "+1345", flag: "🇰🇾" },
  { code: "CF", name: "Central African Republic", dial_code: "+236", flag: "🇨🇫" },
  { code: "TD", name: "Chad", dial_code: "+235", flag: "🇹🇩" },
  { code: "CL", name: "Chile", dial_code: "+56", flag: "🇨🇱" },
  { code: "CN", name: "China", dial_code: "+86", flag: "🇨🇳" },
  { code: "CX", name: "Christmas Island", dial_code: "+61", flag: "🇨🇽" },
  { code: "CC", name: "Cocos (Keeling) Islands", dial_code: "+61", flag: "🇨🇨" },
  { code: "CO", name: "Colombia", dial_code: "+57", flag: "🇨🇴" },
  { code: "KM", name: "Comoros", dial_code: "+269", flag: "🇰🇲" },
  { code: "CG", name: "Congo", dial_code: "+242", flag: "🇨🇬" },
  { code: "CD", name: "Congo, The Democratic Republic of the", dial_code: "+243", flag: "🇨🇩" },
  { code: "CK", name: "Cook Islands", dial_code: "+682", flag: "🇨🇰" },
  { code: "CR", name: "Costa Rica", dial_code: "+506", flag: "🇨🇷" },
  { code: "CI", name: "Cote d'Ivoire", dial_code: "+225", flag: "🇨🇮" },
  { code: "HR", name: "Croatia", dial_code: "+385", flag: "🇭🇷" },
  { code: "CU", name: "Cuba", dial_code: "+53", flag: "🇨🇺" },
  { code: "CY", name: "Cyprus", dial_code: "+357", flag: "🇨🇾" },
  { code: "CZ", name: "Czech Republic", dial_code: "+420", flag: "🇨🇿" },
  { code: "DK", name: "Denmark", dial_code: "+45", flag: "🇩🇰" },
  { code: "DJ", name: "Djibouti", dial_code: "+253", flag: "🇩🇯" },
  { code: "DM", name: "Dominica", dial_code: "+1767", flag: "🇩🇲" },
  { code: "DO", name: "Dominican Republic", dial_code: "+1849", flag: "🇩🇴" },
  { code: "EC", name: "Ecuador", dial_code: "+593", flag: "🇪🇨" },
  { code: "EG", name: "Egypt", dial_code: "+20", flag: "🇪🇬" },
  { code: "SV", name: "El Salvador", dial_code: "+503", flag: "🇸🇻" },
  { code: "GQ", name: "Equatorial Guinea", dial_code: "+240", flag: "🇬🇶" },
  { code: "ER", name: "Eritrea", dial_code: "+291", flag: "🇪🇷" },
  { code: "EE", name: "Estonia", dial_code: "+372", flag: "🇪🇪" },
  { code: "ET", name: "Ethiopia", dial_code: "+251", flag: "🇪🇹" },
  { code: "FK", name: "Falkland Islands (Malvinas)", dial_code: "+500", flag: "🇫🇰" },
  { code: "FO", name: "Faroe Islands", dial_code: "+298", flag: "🇫🇴" },
  { code: "FJ", name: "Fiji", dial_code: "+679", flag: "🇫🇯" },
  { code: "FI", name: "Finland", dial_code: "+358", flag: "🇫🇮" },
  { code: "FR", name: "France", dial_code: "+33", flag: "🇫🇷" },
  { code: "GF", name: "French Guiana", dial_code: "+594", flag: "🇬🇫" },
  { code: "PF", name: "French Polynesia", dial_code: "+689", flag: "🇵🇫" },
  { code: "TF", name: "French Southern Territories", dial_code: "+262", flag: "🇹🇫" },
  { code: "GA", name: "Gabon", dial_code: "+241", flag: "🇬🇦" },
  { code: "GM", name: "Gambia", dial_code: "+220", flag: "🇬🇲" },
  { code: "GE", name: "Georgia", dial_code: "+995", flag: "🇬🇪" },
  { code: "DE", name: "Germany", dial_code: "+49", flag: "🇩🇪" },
  { code: "GH", name: "Ghana", dial_code: "+233", flag: "🇬🇭" },
  { code: "GI", name: "Gibraltar", dial_code: "+350", flag: "🇬🇮" },
  { code: "GR", name: "Greece", dial_code: "+30", flag: "🇬🇷" },
  { code: "GL", name: "Greenland", dial_code: "+299", flag: "🇬🇱" },
  { code: "GD", name: "Grenada", dial_code: "+1473", flag: "🇬🇩" },
  { code: "GP", name: "Guadeloupe", dial_code: "+590", flag: "🇬🇵" },
  { code: "GU", name: "Guam", dial_code: "+1671", flag: "🇬🇺" },
  { code: "GT", name: "Guatemala", dial_code: "+502", flag: "🇬🇹" },
  { code: "GG", name: "Guernsey", dial_code: "+44", flag: "🇬🇬" },
  { code: "GN", name: "Guinea", dial_code: "+224", flag: "🇬🇳" },
  { code: "GW", name: "Guinea-Bissau", dial_code: "+245", flag: "🇬🇼" },
  { code: "GY", name: "Guyana", dial_code: "+592", flag: "🇬🇾" },
  { code: "HT", name: "Haiti", dial_code: "+509", flag: "🇭🇹" },
  { code: "VA", name: "Holy See (Vatican City State)", dial_code: "+379", flag: "🇻🇦" },
  { code: "HN", name: "Honduras", dial_code: "+504", flag: "🇭🇳" },
  { code: "HK", name: "Hong Kong", dial_code: "+852", flag: "🇭🇰" },
  { code: "HU", name: "Hungary", dial_code: "+36", flag: "🇭🇺" },
  { code: "IS", name: "Iceland", dial_code: "+354", flag: "🇮🇸" },
  { code: "IN", name: "India", dial_code: "+91", flag: "🇮🇳" },
  { code: "ID", name: "Indonesia", dial_code: "+62", flag: "🇮🇩" },
  { code: "IR", name: "Iran", dial_code: "+98", flag: "🇮🇷" },
  { code: "IQ", name: "Iraq", dial_code: "+964", flag: "🇮🇶" },
  { code: "IE", name: "Ireland", dial_code: "+353", flag: "🇮🇪" },
  { code: "IM", name: "Isle of Man", dial_code: "+44", flag: "🇮🇲" },
  { code: "IL", name: "Israel", dial_code: "+972", flag: "🇮🇱" },
  { code: "IT", name: "Italy", dial_code: "+39", flag: "🇮🇹" },
  { code: "JM", name: "Jamaica", dial_code: "+1876", flag: "🇯🇲" },
  { code: "JP", name: "Japan", dial_code: "+81", flag: "🇯🇵" },
  { code: "JE", name: "Jersey", dial_code: "+44", flag: "🇯🇪" },
  { code: "JO", name: "Jordan", dial_code: "+962", flag: "🇯🇴" },
  { code: "KZ", name: "Kazakhstan", dial_code: "+7", flag: "🇰🇿" },
  { code: "KE", name: "Kenya", dial_code: "+254", flag: "🇰🇪" },
  { code: "KI", name: "Kiribati", dial_code: "+686", flag: "🇰🇮" },
  { code: "KP", name: "Korea, Democratic People's Republic of", dial_code: "+850", flag: "🇰🇵" },
  { code: "KR", name: "Korea, Republic of", dial_code: "+82", flag: "🇰🇷" },
  { code: "XK", name: "Kosovo", dial_code: "+383", flag: "🇽🇰" },
  { code: "KW", name: "Kuwait", dial_code: "+965", flag: "🇰🇼" },
  { code: "KG", name: "Kyrgyzstan", dial_code: "+996", flag: "🇰🇬" },
  { code: "LA", name: "Lao People's Democratic Republic", dial_code: "+856", flag: "🇱🇦" },
  { code: "LV", name: "Latvia", dial_code: "+371", flag: "🇱🇻" },
  { code: "LB", name: "Lebanon", dial_code: "+961", flag: "🇱🇧" },
  { code: "LS", name: "Lesotho", dial_code: "+266", flag: "🇱🇸" },
  { code: "LR", name: "Liberia", dial_code: "+231", flag: "🇱🇷" },
  { code: "LY", name: "Libyan Arab Jamahiriya", dial_code: "+218", flag: "🇱🇾" },
  { code: "LI", name: "Liechtenstein", dial_code: "+423", flag: "🇱🇮" },
  { code: "LT", name: "Lithuania", dial_code: "+370", flag: "🇱🇹" },
  { code: "LU", name: "Luxembourg", dial_code: "+352", flag: "🇱🇺" },
  { code: "MO", name: "Macao", dial_code: "+853", flag: "🇲🇴" },
  { code: "MK", name: "Macedonia", dial_code: "+389", flag: "🇲🇰" },
  { code: "MG", name: "Madagascar", dial_code: "+261", flag: "🇲🇬" },
  { code: "MW", name: "Malawi", dial_code: "+265", flag: "🇲🇼" },
  { code: "MY", name: "Malaysia", dial_code: "+60", flag: "🇲🇾" },
  { code: "MV", name: "Maldives", dial_code: "+960", flag: "🇲🇻" },
  { code: "ML", name: "Mali", dial_code: "+223", flag: "🇲🇱" },
  { code: "MT", name: "Malta", dial_code: "+356", flag: "🇲🇹" },
  { code: "MH", name: "Marshall Islands", dial_code: "+692", flag: "🇲🇭" },
  { code: "MQ", name: "Martinique", dial_code: "+596", flag: "🇲🇶" },
  { code: "MR", name: "Mauritania", dial_code: "+222", flag: "🇲🇷" },
  { code: "MU", name: "Mauritius", dial_code: "+230", flag: "🇲🇺" },
  { code: "YT", name: "Mayotte", dial_code: "+262", flag: "🇾🇹" },
  { code: "MX", name: "Mexico", dial_code: "+52", flag: "🇲🇽" },
  { code: "FM", name: "Micronesia", dial_code: "+691", flag: "🇫🇲" },
  { code: "MD", name: "Moldova", dial_code: "+373", flag: "🇲🇩" },
  { code: "MC", name: "Monaco", dial_code: "+377", flag: "🇲🇨" },
  { code: "MN", name: "Mongolia", dial_code: "+976", flag: "🇲🇳" },
  { code: "ME", name: "Montenegro", dial_code: "+382", flag: "🇲🇪" },
  { code: "MS", name: "Montserrat", dial_code: "+1664", flag: "🇲🇸" },
  { code: "MA", name: "Morocco", dial_code: "+212", flag: "🇲🇦" },
  { code: "MZ", name: "Mozambique", dial_code: "+258", flag: "🇲🇿" },
  { code: "MM", name: "Myanmar", dial_code: "+95", flag: "🇲🇲" },
  { code: "NA", name: "Namibia", dial_code: "+264", flag: "🇳🇦" },
  { code: "NR", name: "Nauru", dial_code: "+674", flag: "🇳🇷" },
  { code: "NP", name: "Nepal", dial_code: "+977", flag: "🇳🇵" },
  { code: "NL", name: "Netherlands", dial_code: "+31", flag: "🇳🇱" },
  { code: "NC", name: "New Caledonia", dial_code: "+687", flag: "🇳🇨" },
  { code: "NZ", name: "New Zealand", dial_code: "+64", flag: "🇳🇿" },
  { code: "NI", name: "Nicaragua", dial_code: "+505", flag: "🇳🇮" },
  { code: "NE", name: "Niger", dial_code: "+227", flag: "🇳🇪" },
  { code: "NG", name: "Nigeria", dial_code: "+234", flag: "🇳🇬" },
  { code: "NU", name: "Niue", dial_code: "+683", flag: "🇳🇺" },
  { code: "NF", name: "Norfolk Island", dial_code: "+672", flag: "🇳🇫" },
  { code: "MP", name: "Northern Mariana Islands", dial_code: "+1670", flag: "🇲🇵" },
  { code: "NO", name: "Norway", dial_code: "+47", flag: "🇳🇴" },
  { code: "OM", name: "Oman", dial_code: "+968", flag: "🇴🇲" },
  { code: "PK", name: "Pakistan", dial_code: "+92", flag: "🇵🇰" },
  { code: "PW", name: "Palau", dial_code: "+680", flag: "🇵🇼" },
  { code: "PS", name: "Palestine", dial_code: "+970", flag: "🇵🇸" },
  { code: "PA", name: "Panama", dial_code: "+507", flag: "🇵🇦" },
  { code: "PG", name: "Papua New Guinea", dial_code: "+675", flag: "🇵🇬" },
  { code: "PY", name: "Paraguay", dial_code: "+595", flag: "🇵🇾" },
  { code: "PE", name: "Peru", dial_code: "+51", flag: "🇵🇪" },
  { code: "PH", name: "Philippines", dial_code: "+63", flag: "🇵🇭" },
  { code: "PN", name: "Pitcairn", dial_code: "+64", flag: "🇵🇳" },
  { code: "PL", name: "Poland", dial_code: "+48", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", dial_code: "+351", flag: "🇵🇹" },
  { code: "PR", name: "Puerto Rico", dial_code: "+1939", flag: "🇵🇷" },
  { code: "QA", name: "Qatar", dial_code: "+974", flag: "🇶🇦" },
  { code: "RE", name: "Reunion", dial_code: "+262", flag: "🇷🇪" },
  { code: "RO", name: "Romania", dial_code: "+40", flag: "🇷🇴" },
  { code: "RU", name: "Russia", dial_code: "+7", flag: "🇷🇺" },
  { code: "RW", name: "Rwanda", dial_code: "+250", flag: "🇷🇼" },
  { code: "BL", name: "Saint Barthelemy", dial_code: "+590", flag: "🇧🇱" },
  { code: "SH", name: "Saint Helena", dial_code: "+290", flag: "🇸🇭" },
  { code: "KN", name: "Saint Kitts and Nevis", dial_code: "+1869", flag: "🇰🇳" },
  { code: "LC", name: "Saint Lucia", dial_code: "+1758", flag: "🇱🇨" },
  { code: "MF", name: "Saint Martin", dial_code: "+590", flag: "🇲🇫" },
  { code: "PM", name: "Saint Pierre and Miquelon", dial_code: "+508", flag: "🇵🇲" },
  { code: "VC", name: "Saint Vincent and the Grenadines", dial_code: "+1784", flag: "🇻🇨" },
  { code: "WS", name: "Samoa", dial_code: "+685", flag: "🇼🇸" },
  { code: "SM", name: "San Marino", dial_code: "+378", flag: "🇸🇲" },
  { code: "ST", name: "Sao Tome and Principe", dial_code: "+239", flag: "🇸🇹" },
  { code: "SA", name: "Saudi Arabia", dial_code: "+966", flag: "🇸🇦" },
  { code: "SN", name: "Senegal", dial_code: "+221", flag: "🇸🇳" },
  { code: "RS", name: "Serbia", dial_code: "+381", flag: "🇷🇸" },
  { code: "SC", name: "Seychelles", dial_code: "+248", flag: "🇸🇨" },
  { code: "SL", name: "Sierra Leone", dial_code: "+232", flag: "🇸🇱" },
  { code: "SG", name: "Singapore", dial_code: "+65", flag: "🇸🇬" },
  { code: "SK", name: "Slovakia", dial_code: "+421", flag: "🇸🇰" },
  { code: "SI", name: "Slovenia", dial_code: "+386", flag: "🇸🇮" },
  { code: "SB", name: "Solomon Islands", dial_code: "+677", flag: "🇸🇧" },
  { code: "SO", name: "Somalia", dial_code: "+252", flag: "🇸🇴" },
  { code: "ZA", name: "South Africa", dial_code: "+27", flag: "🇿🇦" },
  { code: "SS", name: "South Sudan", dial_code: "+211", flag: "🇸🇸" },
  { code: "GS", name: "South Georgia and the South Sandwich Islands", dial_code: "+500", flag: "🇬🇸" },
  { code: "ES", name: "Spain", dial_code: "+34", flag: "🇪🇸" },
  { code: "LK", name: "Sri Lanka", dial_code: "+94", flag: "🇱🇰" },
  { code: "SD", name: "Sudan", dial_code: "+249", flag: "🇸🇩" },
  { code: "SR", name: "Suriname", dial_code: "+597", flag: "🇸🇷" },
  { code: "SJ", name: "Svalbard and Jan Mayen", dial_code: "+47", flag: "🇸🇯" },
  { code: "SZ", name: "Eswatini", dial_code: "+268", flag: "🇸🇿" },
  { code: "SE", name: "Sweden", dial_code: "+46", flag: "🇸🇪" },
  { code: "CH", name: "Switzerland", dial_code: "+41", flag: "🇨🇭" },
  { code: "SY", name: "Syria", dial_code: "+963", flag: "🇸🇾" },
  { code: "TW", name: "Taiwan", dial_code: "+886", flag: "🇹🇼" },
  { code: "TJ", name: "Tajikistan", dial_code: "+992", flag: "🇹🇯" },
  { code: "TZ", name: "Tanzania", dial_code: "+255", flag: "🇹🇿" },
  { code: "TH", name: "Thailand", dial_code: "+66", flag: "🇹🇭" },
  { code: "TL", name: "Timor-Leste", dial_code: "+670", flag: "🇹🇱" },
  { code: "TG", name: "Togo", dial_code: "+228", flag: "🇹🇬" },
  { code: "TK", name: "Tokelau", dial_code: "+690", flag: "🇹🇰" },
  { code: "TO", name: "Tonga", dial_code: "+676", flag: "🇹🇴" },
  { code: "TT", name: "Trinidad and Tobago", dial_code: "+1868", flag: "🇹🇹" },
  { code: "TN", name: "Tunisia", dial_code: "+216", flag: "🇹🇳" },
  { code: "TR", name: "Turkey", dial_code: "+90", flag: "🇹🇷" },
  { code: "TM", name: "Turkmenistan", dial_code: "+993", flag: "🇹🇲" },
  { code: "TC", name: "Turks and Caicos Islands", dial_code: "+1649", flag: "🇹🇨" },
  { code: "TV", name: "Tuvalu", dial_code: "+688", flag: "🇹🇻" },
  { code: "UG", name: "Uganda", dial_code: "+256", flag: "🇺🇬" },
  { code: "UA", name: "Ukraine", dial_code: "+380", flag: "🇺🇦" },
  { code: "AE", name: "United Arab Emirates", dial_code: "+971", flag: "🇦🇪" },
  { code: "GB", name: "United Kingdom", dial_code: "+44", flag: "🇬🇧" },
  { code: "US", name: "United States", dial_code: "+1", flag: "🇺🇸" },
  { code: "UY", name: "Uruguay", dial_code: "+598", flag: "🇺🇾" },
  { code: "UZ", name: "Uzbekistan", dial_code: "+998", flag: "🇺🇿" },
  { code: "VU", name: "Vanuatu", dial_code: "+678", flag: "🇻🇺" },
  { code: "VE", name: "Venezuela", dial_code: "+58", flag: "🇻🇪" },
  { code: "VN", name: "Vietnam", dial_code: "+84", flag: "🇻🇳" },
  { code: "VG", name: "Virgin Islands, British", dial_code: "+1284", flag: "🇻🇬" },
  { code: "VI", name: "Virgin Islands, U.S.", dial_code: "+1340", flag: "🇻🇮" },
  { code: "WF", name: "Wallis and Futuna", dial_code: "+681", flag: "🇼🇫" },
  { code: "EH", name: "Western Sahara", dial_code: "+212", flag: "🇪🇭" },
  { code: "YE", name: "Yemen", dial_code: "+967", flag: "🇾🇪" },
  { code: "ZM", name: "Zambia", dial_code: "+260", flag: "🇿🇲" },
  { code: "ZW", name: "Zimbabwe", dial_code: "+263", flag: "🇿🇼" }
];

const CountryCodeSelector = ({ value, onChange }: CountryCodeSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);
  
  const selectedCountry = countryCodes.find(country => country.dial_code === value);
  
  const filteredCountries = countryCodes.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dial_code.includes(searchTerm)
  );
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[110px] justify-between"
        >
          {selectedCountry ? (
            <span>
              {selectedCountry.flag} {selectedCountry.dial_code}
            </span>
          ) : (
            <span>
              🏳️ Select
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" ref={popoverRef}>
        {mounted && open ? (
          <div className="relative">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Search country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <ScrollArea className="h-[300px]">
              <div className="p-1">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <div
                      key={country.code}
                      className={cn(
                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected='true']:text-accent-foreground data-[disabled=true]:opacity-50",
                        value === country.dial_code ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={() => {
                        onChange(country.dial_code);
                        setOpen(false);
                        setSearchTerm("");
                      }}
                    >
                      <span className="mr-2">{country.flag}</span>
                      <span>{country.name}</span>
                      <span className="ml-2 text-gray-500">{country.dial_code}</span>
                      {value === country.dial_code && (
                        <Check className="ml-auto h-4 w-4 opacity-100" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-sm text-gray-500">
                    No country found
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
};

export default CountryCodeSelector;
