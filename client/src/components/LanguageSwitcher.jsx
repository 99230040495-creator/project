import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'Hindi (हिंदी)' },
        { code: 'mr', label: 'Marathi (मराठी)' },
        { code: 'ta', label: 'Tamil (தமிழ்)' },
        { code: 'ml', label: 'Malayalam (മലയാളം)' },
        { code: 'bn', label: 'Bengali (বাংলা)' },
        { code: 'te', label: 'Telugu (తెలుగు)' }
    ];

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
            >
                <Globe className="w-4 h-4 text-aqua" />
                <span className="text-sm font-bold uppercase tracking-wide">{i18n.language}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl ring-1 ring-black/5 overflow-hidden z-50 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                    <div className="py-1 max-h-[60vh] overflow-y-auto">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center justify-between
                                    ${i18n.language === lang.code
                                        ? 'bg-aqua/10 text-aqua border-l-4 border-aqua'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                                    }`}
                            >
                                {lang.label}
                                {i18n.language === lang.code && <div className="w-2 h-2 rounded-full bg-aqua"></div>}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
