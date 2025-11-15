"""
Language definitions and metadata for 50+ supported languages
"""

# Supported languages with metadata
SUPPORTED_LANGUAGES = {
    # European Languages
    "en": {
        "name": "English",
        "native": "English",
        "rtl": False,
        "family": "Germanic"
    },
    "es": {
        "name": "Spanish",
        "native": "Español",
        "rtl": False,
        "family": "Romance"
    },
    "fr": {
        "name": "French",
        "native": "Français",
        "rtl": False,
        "family": "Romance"
    },
    "de": {
        "name": "German",
        "native": "Deutsch",
        "rtl": False,
        "family": "Germanic"
    },
    "it": {
        "name": "Italian",
        "native": "Italiano",
        "rtl": False,
        "family": "Romance"
    },
    "pt": {
        "name": "Portuguese",
        "native": "Português",
        "rtl": False,
        "family": "Romance"
    },
    "ru": {
        "name": "Russian",
        "native": "Русский",
        "rtl": False,
        "family": "Slavic"
    },
    "pl": {
        "name": "Polish",
        "native": "Polski",
        "rtl": False,
        "family": "Slavic"
    },
    "nl": {
        "name": "Dutch",
        "native": "Nederlands",
        "rtl": False,
        "family": "Germanic"
    },
    "sv": {
        "name": "Swedish",
        "native": "Svenska",
        "rtl": False,
        "family": "Germanic"
    },
    "no": {
        "name": "Norwegian",
        "native": "Norsk",
        "rtl": False,
        "family": "Germanic"
    },
    "da": {
        "name": "Danish",
        "native": "Dansk",
        "rtl": False,
        "family": "Germanic"
    },
    "fi": {
        "name": "Finnish",
        "native": "Suomi",
        "rtl": False,
        "family": "Uralic"
    },
    "el": {
        "name": "Greek",
        "native": "Ελληνικά",
        "rtl": False,
        "family": "Hellenic"
    },
    "cs": {
        "name": "Czech",
        "native": "Čeština",
        "rtl": False,
        "family": "Slavic"
    },
    "hu": {
        "name": "Hungarian",
        "native": "Magyar",
        "rtl": False,
        "family": "Uralic"
    },
    "ro": {
        "name": "Romanian",
        "native": "Română",
        "rtl": False,
        "family": "Romance"
    },
    "uk": {
        "name": "Ukrainian",
        "native": "Українська",
        "rtl": False,
        "family": "Slavic"
    },

    # Asian Languages
    "zh": {
        "name": "Chinese (Simplified)",
        "native": "简体中文",
        "rtl": False,
        "family": "Sino-Tibetan"
    },
    "zh-TW": {
        "name": "Chinese (Traditional)",
        "native": "繁體中文",
        "rtl": False,
        "family": "Sino-Tibetan"
    },
    "ja": {
        "name": "Japanese",
        "native": "日本語",
        "rtl": False,
        "family": "Japonic"
    },
    "ko": {
        "name": "Korean",
        "native": "한국어",
        "rtl": False,
        "family": "Koreanic"
    },
    "vi": {
        "name": "Vietnamese",
        "native": "Tiếng Việt",
        "rtl": False,
        "family": "Austroasiatic"
    },
    "th": {
        "name": "Thai",
        "native": "ไทย",
        "rtl": False,
        "family": "Tai-Kadai"
    },
    "hi": {
        "name": "Hindi",
        "native": "हिन्दी",
        "rtl": False,
        "family": "Indo-Aryan"
    },
    "bn": {
        "name": "Bengali",
        "native": "বাংলা",
        "rtl": False,
        "family": "Indo-Aryan"
    },
    "ta": {
        "name": "Tamil",
        "native": "தமிழ்",
        "rtl": False,
        "family": "Dravidian"
    },
    "te": {
        "name": "Telugu",
        "native": "తెలుగు",
        "rtl": False,
        "family": "Dravidian"
    },
    "mr": {
        "name": "Marathi",
        "native": "मराठी",
        "rtl": False,
        "family": "Indo-Aryan"
    },
    "ml": {
        "name": "Malayalam",
        "native": "മലയാളം",
        "rtl": False,
        "family": "Dravidian"
    },
    "kn": {
        "name": "Kannada",
        "native": "ಕನ್ನಡ",
        "rtl": False,
        "family": "Dravidian"
    },
    "pa": {
        "name": "Punjabi",
        "native": "ਪੰਜਾਬੀ",
        "rtl": False,
        "family": "Indo-Aryan"
    },
    "gu": {
        "name": "Gujarati",
        "native": "ગુજરાતી",
        "rtl": False,
        "family": "Indo-Aryan"
    },
    "id": {
        "name": "Indonesian",
        "native": "Bahasa Indonesia",
        "rtl": False,
        "family": "Austronesian"
    },
    "ms": {
        "name": "Malay",
        "native": "Bahasa Melayu",
        "rtl": False,
        "family": "Austronesian"
    },
    "tl": {
        "name": "Filipino/Tagalog",
        "native": "Filipino",
        "rtl": False,
        "family": "Austronesian"
    },

    # Middle Eastern & RTL Languages
    "ar": {
        "name": "Arabic",
        "native": "العربية",
        "rtl": True,
        "family": "Semitic"
    },
    "he": {
        "name": "Hebrew",
        "native": "עברית",
        "rtl": True,
        "family": "Semitic"
    },
    "fa": {
        "name": "Persian (Farsi)",
        "native": "فارسی",
        "rtl": True,
        "family": "Indo-Iranian"
    },
    "ur": {
        "name": "Urdu",
        "native": "اردو",
        "rtl": True,
        "family": "Indo-Aryan"
    },
    "tr": {
        "name": "Turkish",
        "native": "Türkçe",
        "rtl": False,
        "family": "Turkic"
    },

    # African Languages
    "sw": {
        "name": "Swahili",
        "native": "Kiswahili",
        "rtl": False,
        "family": "Niger-Congo"
    },
    "am": {
        "name": "Amharic",
        "native": "አማርኛ",
        "rtl": False,
        "family": "Semitic"
    },
    "zu": {
        "name": "Zulu",
        "native": "isiZulu",
        "rtl": False,
        "family": "Niger-Congo"
    },
    "xh": {
        "name": "Xhosa",
        "native": "isiXhosa",
        "rtl": False,
        "family": "Niger-Congo"
    },
    "af": {
        "name": "Afrikaans",
        "native": "Afrikaans",
        "rtl": False,
        "family": "Germanic"
    },

    # Other Languages
    "hr": {
        "name": "Croatian",
        "native": "Hrvatski",
        "rtl": False,
        "family": "Slavic"
    },
    "sr": {
        "name": "Serbian",
        "native": "Српски",
        "rtl": False,
        "family": "Slavic"
    },
    "bg": {
        "name": "Bulgarian",
        "native": "Български",
        "rtl": False,
        "family": "Slavic"
    },
    "lt": {
        "name": "Lithuanian",
        "native": "Lietuvių",
        "rtl": False,
        "family": "Baltic"
    },
    "lv": {
        "name": "Latvian",
        "native": "Latviešu",
        "rtl": False,
        "family": "Baltic"
    },
    "et": {
        "name": "Estonian",
        "native": "Eesti",
        "rtl": False,
        "family": "Uralic"
    },
    "is": {
        "name": "Icelandic",
        "native": "Íslenska",
        "rtl": False,
        "family": "Germanic"
    },
}

# RTL (Right-to-Left) languages
RTL_LANGUAGES = ["ar", "he", "fa", "ur"]

# Language families
LANGUAGE_FAMILIES = {
    "Germanic": ["en", "de", "nl", "sv", "no", "da", "af", "is"],
    "Romance": ["es", "fr", "it", "pt", "ro"],
    "Slavic": ["ru", "pl", "uk", "cs", "hr", "sr", "bg"],
    "Sino-Tibetan": ["zh", "zh-TW"],
    "Indo-Aryan": ["hi", "bn", "mr", "pa", "gu", "ur"],
    "Dravidian": ["ta", "te", "ml", "kn"],
    "Semitic": ["ar", "he", "am"],
    "Turkic": ["tr"],
    "Uralic": ["fi", "hu", "et"],
    "Austronesian": ["id", "ms", "tl"],
}

# Common language pairs for translation
COMMON_PAIRS = [
    ("en", "es"),  # English-Spanish
    ("en", "fr"),  # English-French
    ("en", "zh"),  # English-Chinese
    ("en", "ar"),  # English-Arabic
    ("en", "hi"),  # English-Hindi
    ("es", "en"),  # Spanish-English
]
