export interface AyahData {
  id: number;
  arabic: string;
  translation: string;
  surah: string;
  surahNumber: number;
  ayahNumber: number;
  theme: string;
}

export const AYAH_COLLECTION: AyahData[] = [
  {
    id: 1,
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    translation: "In the name of Allah, the Most Gracious, the Most Merciful.",
    surah: "Al-Fatiha",
    surahNumber: 1,
    ayahNumber: 1,
    theme: "Mercy"
  },
  {
    id: 2,
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    translation: "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.",
    surah: "Al-Baqarah",
    surahNumber: 2,
    ayahNumber: 153,
    theme: "Patience"
  },
  {
    id: 3,
    arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    translation: "And when My servants ask you, [O Muhammad], concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.",
    surah: "Al-Baqarah",
    surahNumber: 2,
    ayahNumber: 186,
    theme: "Prayer"
  },
  {
    id: 4,
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ",
    translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth.",
    surah: "Al-Baqarah",
    surahNumber: 2,
    ayahNumber: 255,
    theme: "Faith"
  },
  {
    id: 5,
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation: "Allah does not burden a soul beyond that it can bear.",
    surah: "Al-Baqarah",
    surahNumber: 2,
    ayahNumber: 286,
    theme: "Hope"
  },
  {
    id: 6,
    arabic: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
    translation: "So do not weaken and do not grieve, and you will be superior if you are [true] believers.",
    surah: "Ali 'Imran",
    surahNumber: 3,
    ayahNumber: 139,
    theme: "Strength"
  },
  {
    id: 7,
    arabic: "فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ ۚ إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ",
    translation: "Then when you have taken a decision, put your trust in Allah. For Allah loves those who put their trust [in Him].",
    surah: "Ali 'Imran",
    surahNumber: 3,
    ayahNumber: 159,
    theme: "Trust in Allah"
  },
  {
    id: 8,
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُونُوا قَوَّامِينَ بِالْقِسْطِ شُهَدَاءَ لِلَّهِ",
    translation: "O you who have believed, be persistently standing firm in justice, witnesses for Allah.",
    surah: "An-Nisa",
    surahNumber: 4,
    ayahNumber: 135,
    theme: "Justice"
  },
  {
    id: 9,
    arabic: "وَلَا يَجْرِمَنَّكُمْ شَنَآنُ قَوْمٍ عَلَىٰ أَلَّا تَعْدِلُوا ۚ اعْدِلُوا هُوَ أَقْرَبُ لِلتَّقْوَىٰ",
    translation: "And do not let the hatred of a people prevent you from being just. Be just; that is nearer to righteousness.",
    surah: "Al-Ma'idah",
    surahNumber: 5,
    ayahNumber: 8,
    theme: "Justice"
  },
  {
    id: 10,
    arabic: "إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ مِّنَ الْمُحْسِنِينَ",
    translation: "Indeed, the mercy of Allah is near to the doers of good.",
    surah: "Al-A'raf",
    surahNumber: 7,
    ayahNumber: 56,
    theme: "Mercy"
  },
  {
    id: 11,
    arabic: "قَالَ عَذَابِي أُصِيبُ بِهِ مَنْ أَشَاءُ ۖ وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ",
    translation: "He said, 'My punishment - I afflict with it whom I will, but My mercy encompasses all things.'",
    surah: "Al-A'raf",
    surahNumber: 7,
    ayahNumber: 156,
    theme: "Mercy"
  },
  {
    id: 12,
    arabic: "إِنَّمَا الْمُؤْمِنُونَ الَّذِينَ إِذَا ذُكِرَ اللَّهُ وَجِلَتْ قُلُوبُهُمْ وَإِذَا تُلِيَتْ عَلَيْهِمْ آيَاتُهُ زَادَتْهُمْ إِيمَانًا وَعَلَىٰ رَبِّهِمْ يَتَوَكَّلُونَ",
    translation: "The believers are only those who, when Allah is mentioned, their hearts feel fear, and when His verses are recited to them, they increase them in faith; and upon their Lord they rely.",
    surah: "Al-Anfal",
    surahNumber: 8,
    ayahNumber: 2,
    theme: "Faith"
  },
  {
    id: 13,
    arabic: "يَا أَيُّهَا النَّاسُ قَدْ جَاءَتْكُم مَّوْعِظَةٌ مِّن رَّبِّكُمْ وَشِفَاءٌ لِّمَا فِي الصُّدُورِ وَهُدًى وَرَحْمَةٌ لِّلْمُؤْمِنِينَ",
    translation: "O mankind, there has to come to you instruction from your Lord and healing for what is in the breasts and guidance and mercy for the believers.",
    surah: "Yunus",
    surahNumber: 10,
    ayahNumber: 57,
    theme: "Guidance"
  },
  {
    id: 14,
    arabic: "وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ",
    translation: "And be patient, for indeed, Allah does not allow to be lost the reward of those who do good.",
    surah: "Hud",
    surahNumber: 11,
    ayahNumber: 115,
    theme: "Patience"
  },
  {
    id: 15,
    arabic: "وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    translation: "And [remember] when your Lord proclaimed, 'If you are grateful, I will surely increase you [in favor].'",
    surah: "Ibrahim",
    surahNumber: 14,
    ayahNumber: 7,
    theme: "Gratitude"
  },
  {
    id: 16,
    arabic: "نَبِّئْ عِبَادِي أَنِّي أَنَا الْغَفُورُ الرَّحِيمُ",
    translation: "Declare [O Muhammad] unto My servants that it is I who am the Forgiving, the Merciful.",
    surah: "Al-Hijr",
    surahNumber: 15,
    ayahNumber: 49,
    theme: "Forgiveness"
  },
  {
    id: 17,
    arabic: "إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوا وَّالَّذِينَ هُم مُّحْسِنُونَ",
    translation: "Indeed, Allah is with those who fear Him and those who are doers of good.",
    surah: "An-Nahl",
    surahNumber: 16,
    ayahNumber: 128,
    theme: "Compassion"
  },
  {
    id: 18,
    arabic: "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ",
    translation: "And We send down of the Quran that which is a healing and a mercy for the believers.",
    surah: "Al-Isra",
    surahNumber: 17,
    ayahNumber: 82,
    theme: "Guidance"
  },
  {
    id: 19,
    arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    translation: "...and say, 'My Lord, increase me in knowledge.'",
    surah: "Taha",
    surahNumber: 20,
    ayahNumber: 114,
    theme: "Knowledge"
  },
  {
    id: 20,
    arabic: "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    translation: "...'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.'",
    surah: "Al-Anbiya",
    surahNumber: 21,
    ayahNumber: 87,
    theme: "Forgiveness"
  },
  {
    id: 21,
    arabic: "وَعِبَادُ الرَّحْمَٰنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا وَإِذَا خَاطَبَهُمُ الْجَاهِلُونَ قَالُوا سَلَامًا",
    translation: "And the servants of the Most Merciful are those who walk upon the earth easily, and when the ignorant address them [harshly], they say [words of] peace.",
    surah: "Al-Furqan",
    surahNumber: 25,
    ayahNumber: 63,
    theme: "Peace"
  },
  {
    id: 22,
    arabic: "وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ",
    translation: "And when I am ill, it is He who cures me.",
    surah: "Ash-Shu'ara",
    surahNumber: 26,
    ayahNumber: 80,
    theme: "Hope"
  },
  {
    id: 23,
    arabic: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا ۚ وَإِنَّ اللَّهَ لَمَعَ الْمُحْسِنِينَ",
    translation: "And those who strive for Us - We will surely guide them to Our ways. And indeed, Allah is with the doers of good.",
    surah: "Al-Ankabut",
    surahNumber: 29,
    ayahNumber: 69,
    theme: "Strength"
  },
  {
    id: 24,
    arabic: "وَاصْبِرْ عَلَىٰ مَا أَصَابَكَ ۖ إِنَّ ذَٰلِكَ مِنْ عَزْمِ الْأُمُورِ",
    translation: "...and be patient over what befalls you. Indeed, [all] that is of the matters [requiring] determination.",
    surah: "Luqman",
    surahNumber: 31,
    ayahNumber: 17,
    theme: "Patience"
  },
  {
    id: 25,
    arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
    translation: "Say, 'O My servants who have transgressed against themselves [by sinning], do not despair of the mercy of Allah. Indeed, Allah forgives all sins.'",
    surah: "Az-Zumar",
    surahNumber: 39,
    ayahNumber: 53,
    theme: "Forgiveness"
  },
  {
    id: 26,
    arabic: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ",
    translation: "And your Lord says, 'Call upon Me; I will respond to you.'",
    surah: "Ghafir",
    surahNumber: 40,
    ayahNumber: 60,
    theme: "Prayer"
  },
  {
    id: 27,
    arabic: "وَمَا أَصَابَكُم مِّن مُّصِيبَةٍ فَبِمَا كَسَبَتْ أَيْدِيكُمْ وَيَعْفُو عَن كَثِيرٍ",
    translation: "And whatever of misfortune befalls you, it is because of what your hands have earned. And He pardons much.",
    surah: "Ash-Shura",
    surahNumber: 42,
    ayahNumber: 30,
    theme: "Forgiveness"
  },
  {
    id: 28,
    arabic: "إِلَّا مَن رَّحِمَ اللَّهُ ۚ إِنَّهُ هُوَ الْعَزِيزُ الرَّحِيمُ",
    translation: "Except those on whom Allah has mercy. Indeed, He is the Exalted in Might, the Merciful.",
    surah: "Ad-Dukhan",
    surahNumber: 44,
    ayahNumber: 42,
    theme: "Mercy"
  },
  {
    id: 29,
    arabic: "إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ فَأَصْلِحُوا بَيْنَ أَخَوَيْكُمْ ۚ وَاتَّقُوا اللَّهَ لَعَلَّكُمْ تُرْحَمُونَ",
    translation: "The believers are but brothers, so make settlement between your brothers. And fear Allah that you may receive mercy.",
    surah: "Al-Hujurat",
    surahNumber: 49,
    ayahNumber: 10,
    theme: "Compassion"
  },
  {
    id: 30,
    arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ ۚ وَاللَّهُ بِمَا تَعْمَلُونَ بَصِيرٌ",
    translation: "And He is with you wherever you are. And Allah, of what you do, is Seeing.",
    surah: "Al-Hadid",
    surahNumber: 57,
    ayahNumber: 4,
    theme: "Faith"
  },
  {
    id: 31,
    arabic: "وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    translation: "And He will provide for him from where he does not expect. And whoever relies upon Allah - then He is sufficient for him.",
    surah: "At-Talaq",
    surahNumber: 65,
    ayahNumber: 3,
    theme: "Trust in Allah"
  },
  {
    id: 32,
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا  إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.",
    surah: "Al-Inshirah",
    surahNumber: 94,
    ayahNumber: 5, // combined 5 and 6
    theme: "Hope"
  },
  {
    id: 33,
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ  اللَّهُ الصَّمَدُ  لَمْ يَلِدْ وَلَمْ يُولَدْ  وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    translation: "Say, 'He is Allah, [who is] One. Allah, the Eternal Refuge. He neither begets nor is born, Nor is there to Him any equivalent.'",
    surah: "Al-Ikhlas",
    surahNumber: 112,
    ayahNumber: 1, // entire Surah
    theme: "Faith"
  }
];

export function getAyahOfTheDay(): AyahData {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return AYAH_COLLECTION[dayOfYear % AYAH_COLLECTION.length];
}
