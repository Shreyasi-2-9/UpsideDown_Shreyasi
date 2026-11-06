from typing import Dict

# User-facing message translations
MESSAGES: Dict[str, Dict[str, str]] = {
    "booking_created": {
        "en": "Service request submitted successfully. Verified technicians are reviewing your issue.",
        "hi": "सेवा अनुरोध सफलतापूर्वक दर्ज किया गया। सत्यापित तकनीशियन आपकी समस्या की समीक्षा कर रहे हैं।",
        "mr": "सेवा विनंती यशस्वीरित्या नोंदवली गेली. पडताळलेले तंत्रज्ञ समस्येचे पुनरावलोकन करत आहेत."
    },
    "counter_offer_sent": {
        "en": "Counter-offer of ₹{amount} sent to technician.",
        "hi": "तकनीशियन को ₹{amount} का प्रति-प्रस्ताव भेजा गया।",
        "mr": "तंत्रज्ञांना ₹{amount} चा प्रति-प्रस्ताव पाठवला गेला."
    },
    "counter_invalid_range": {
        "en": "Counter-offer must be between fair civic limits: ₹{min} and ₹{max}.",
        "hi": "प्रति-प्रस्ताव उचित नागरिक सीमा के भीतर होना चाहिए: ₹{min} और ₹{max}।",
        "mr": "प्रति-प्रस्ताव योग्य नागरी मर्यादेत असावा: ₹{min} आणि ₹{max}."
    },
    "price_locked": {
        "en": "Price locked at ₹{amount}. Funds are secured in HomeCare Escrow.",
        "hi": "कीमत ₹{amount} पर लॉक की गई। राशि होमकेयर एस्क्रो में सुरक्षित है।",
        "mr": "किंमत ₹{amount} वर लॉक केली. रक्कम होमकेअर एस्क्रोमध्ये सुरक्षित आहे."
    },
    "escrow_released": {
        "en": "Escrow payment released to technician. Thank you for using HomeCare 360!",
        "hi": "एस्क्रो भुगतान तकनीशियन को जारी कर दिया गया। होमकेयर 360 का उपयोग करने के लिए धन्यवाद!",
        "mr": "एस्क्रो पेमेंट तंत्रज्ञांना दिले गेले. होमकेअर 360 वापरल्याबद्दल धन्यवाद!"
    },
    "escrow_release_unauthorized": {
        "en": "Only the citizen who booked the service can approve escrow release.",
        "hi": "केवल सेवा बुक करने वाला नागरिक ही एस्क्रो जारी करने की स्वीकृति दे सकता है।",
        "mr": "केवळ सेवा बुक केलेला नागरिकच एस्क्रो सोडण्यास मान्यता देऊ शकतो."
    },
    "work_not_completed": {
        "en": "Escrow can only be released after technician marks the job completed.",
        "hi": "तकनीशियन द्वारा काम पूरा करने के बाद ही एस्क्रो जारी किया जा सकता है।",
        "mr": "तंत्रज्ञाने काम पूर्ण केल्याची नोंद केल्यानंतरच एस्क्रो सोडला जाऊ शकतो."
    },
    "sos_dispatched": {
        "en": "EMERGENCY ALERT: Local civic response unit and nearby responders notified.",
        "hi": "आपातकालीन चेतावनी: स्थानीय नागरिक प्रतिक्रिया दल और नजदीकी सहायकों को सूचित किया गया।",
        "mr": "तातडीचा इशारा: स्थानिक नागरी प्रतिसाद पथक आणि जवळच्या सहाय्यकांना सूचित केले."
    }
}

def get_message(key: str, lang: str = "en", **kwargs) -> str:
    lang = lang.lower()
    if lang.startswith("hi"):
        l = "hi"
    elif lang.startswith("mr"):
        l = "mr"
    else:
        l = "en"
    
    msg_dict = MESSAGES.get(key, {})
    template = msg_dict.get(l, msg_dict.get("en", key))
    if kwargs:
        try:
            return template.format(**kwargs)
        except Exception:
            return template
    return template
