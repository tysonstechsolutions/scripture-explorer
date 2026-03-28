// lib/story/glossary.ts
// Glossary of terms that may be unfamiliar to readers

export interface GlossaryTerm {
  term: string;
  definition: string;
  example?: string;
}

export const GLOSSARY: Record<string, GlossaryTerm> = {
  // Dating systems
  'BCE': {
    term: 'BCE',
    definition: 'Before Common Era. This is the same as "BC" (Before Christ). Scholars started using BCE/CE in the 1700s as a religiously neutral alternative, though the calendar itself is still based on Jesus\'s birth. The year 1000 BCE means 1000 years before year 1.',
    example: '3000 BCE = 3000 years before year 1 = about 5000 years ago',
  },
  'CE': {
    term: 'CE',
    definition: 'Common Era. This is the same as "AD" (Anno Domini). Adopted by academics for interfaith scholarship—Jewish, Muslim, and secular scholars can use it without referencing Christ directly, though the dating system itself was created by Christians.',
    example: '2024 CE = the year 2024 = now',
  },
  'BC': {
    term: 'BC',
    definition: 'Before Christ. Years counted backwards from Jesus\'s birth. A Christian monk named Dionysius Exiguus invented this system around 525 AD to calculate Easter dates. He accidentally miscalculated—Jesus was likely born around 4-6 BC!',
  },
  'AD': {
    term: 'AD',
    definition: 'Anno Domini (Latin for "Year of Our Lord"). Created by monk Dionysius Exiguus in 525 AD. Note: AD goes BEFORE the year (AD 2024), while BC goes AFTER (500 BC). This system replaced older Roman dating methods.',
  },

  // Geographic terms
  'Mesopotamia': {
    term: 'Mesopotamia',
    definition: 'The region between the Tigris and Euphrates rivers, in modern-day Iraq. Often called "the cradle of civilization" because the first cities developed here.',
  },
  'Canaan': {
    term: 'Canaan',
    definition: 'The ancient name for the land that includes modern Israel, Palestine, Lebanon, and parts of Syria and Jordan. This is the "Promised Land" in the Bible.',
  },
  'Fertile Crescent': {
    term: 'Fertile Crescent',
    definition: 'A crescent-shaped region of fertile land stretching from Egypt through Canaan to Mesopotamia. Called "fertile" because crops grew well there, unlike the surrounding deserts.',
  },
  'Near East': {
    term: 'Near East',
    definition: 'The ancient term for the Middle East region, including modern-day Israel, Jordan, Lebanon, Syria, Iraq, Iran, Turkey, and Egypt.',
  },
  'Levant': {
    term: 'Levant',
    definition: 'The eastern Mediterranean region, including modern-day Israel, Palestine, Lebanon, Syria, and Jordan.',
  },

  // Peoples and cultures
  'Sumerians': {
    term: 'Sumerians',
    definition: 'The people who built the first known civilization in southern Mesopotamia around 4000-2000 BCE. They invented writing, built the first cities, and created complex laws.',
  },
  'Akkadians': {
    term: 'Akkadians',
    definition: 'A Semitic people who conquered Sumer around 2300 BCE and created the first empire in history under Sargon the Great.',
  },
  'Babylonians': {
    term: 'Babylonians',
    definition: 'The people of Babylon, a powerful city in Mesopotamia. They ruled a great empire and later conquered Jerusalem in 586 BCE.',
  },
  'Assyrians': {
    term: 'Assyrians',
    definition: 'A powerful empire from northern Mesopotamia known for their military might. They conquered the northern kingdom of Israel in 722 BCE.',
  },
  'Canaanites': {
    term: 'Canaanites',
    definition: 'The various peoples who lived in Canaan before and during the Israelite settlement. They worshipped gods like Baal and Asherah.',
  },
  'Israelites': {
    term: 'Israelites',
    definition: 'The descendants of Jacob (also called Israel), who became the nation of Israel. The ancestors of modern Jews.',
  },
  'Hebrews': {
    term: 'Hebrews',
    definition: 'Another name for the Israelites, especially used for the period before they settled in Canaan. Abraham is called "the Hebrew."',
  },
  'Philistines': {
    term: 'Philistines',
    definition: 'A sea-faring people who settled on the coast of Canaan around 1200 BCE. Famous enemies of Israel, including Goliath.',
  },
  'Pharisees': {
    term: 'Pharisees',
    definition: 'A Jewish religious group in Jesus\'s time known for strict observance of the law and belief in resurrection. Jesus often debated with them.',
  },
  'Sadducees': {
    term: 'Sadducees',
    definition: 'A Jewish religious and political group connected to the Temple priesthood. They did not believe in resurrection.',
  },

  // Religious and cultural terms
  'Torah': {
    term: 'Torah',
    definition: 'The first five books of the Bible (Genesis, Exodus, Leviticus, Numbers, Deuteronomy). Also called the Pentateuch or the Law of Moses.',
  },
  'Pentateuch': {
    term: 'Pentateuch',
    definition: 'Greek for "five scrolls." Another name for the Torah—the first five books of the Bible.',
  },
  'Covenant': {
    term: 'Covenant',
    definition: 'A binding agreement or promise. In the Bible, God makes covenants with Noah, Abraham, Moses, and David, promising blessings in exchange for faithfulness.',
  },
  'Ziggurat': {
    term: 'Ziggurat',
    definition: 'A massive stepped pyramid-temple built in ancient Mesopotamia. Each city had one dedicated to their chief god.',
  },
  'Cuneiform': {
    term: 'Cuneiform',
    definition: 'The world\'s first writing system, invented by the Sumerians. Wedge-shaped marks pressed into wet clay tablets.',
  },
  'Hieroglyphs': {
    term: 'Hieroglyphs',
    definition: 'The ancient Egyptian writing system using pictures and symbols. "Hieroglyph" means "sacred carving."',
  },
  'Patriarch': {
    term: 'Patriarch',
    definition: 'The founding fathers of Israel: Abraham, Isaac, and Jacob. The "patriarchal period" refers to their time.',
  },
  'Matriarch': {
    term: 'Matriarch',
    definition: 'The founding mothers of Israel: Sarah, Rebekah, Rachel, and Leah.',
  },
  'Prophet': {
    term: 'Prophet',
    definition: 'Someone who speaks God\'s message to the people. Prophets warned Israel, predicted the future, and called people back to God.',
  },
  'Messiah': {
    term: 'Messiah',
    definition: 'Hebrew for "anointed one." Jews expected a coming king from David\'s line who would save Israel. Christians believe Jesus is the Messiah (Greek: "Christ").',
  },
  'Exile': {
    term: 'Exile',
    definition: 'When the Babylonians conquered Jerusalem in 586 BCE and forced many Jews to live in Babylon. This "Babylonian Exile" lasted about 70 years.',
  },
  'Diaspora': {
    term: 'Diaspora',
    definition: 'The scattering of Jews outside of Israel. After the exile, Jews lived throughout the ancient world.',
  },
  'Synagogue': {
    term: 'Synagogue',
    definition: 'A Jewish place of worship and study. Synagogues developed during the exile when Jews couldn\'t worship at the Temple.',
  },
  'Temple': {
    term: 'Temple',
    definition: 'The central place of Jewish worship in Jerusalem. Solomon built the first Temple; it was destroyed in 586 BCE. The second Temple was built after the exile and destroyed by Rome in 70 CE.',
  },
  'Tabernacle': {
    term: 'Tabernacle',
    definition: 'The portable tent-sanctuary the Israelites used during their wilderness wanderings. It housed the Ark of the Covenant.',
  },
  'Ark of the Covenant': {
    term: 'Ark of the Covenant',
    definition: 'A gold-covered wooden chest containing the Ten Commandments. It represented God\'s presence with Israel.',
  },
  'Passover': {
    term: 'Passover',
    definition: 'The Jewish festival celebrating the Exodus from Egypt, when the angel of death "passed over" Israelite homes.',
  },
  'Sabbath': {
    term: 'Sabbath',
    definition: 'The seventh day of the week (Saturday), a day of rest commanded in the Ten Commandments.',
  },

  // Biblical books and sections
  'Gospels': {
    term: 'Gospels',
    definition: 'The four books about Jesus\'s life: Matthew, Mark, Luke, and John. "Gospel" means "good news."',
  },
  'Epistles': {
    term: 'Epistles',
    definition: 'Letters written by early Christian leaders (Paul, Peter, James, John, Jude) to churches and individuals.',
  },
  'Apocalyptic': {
    term: 'Apocalyptic',
    definition: 'A type of literature about the end times, using vivid imagery and symbols. Daniel and Revelation are apocalyptic books.',
  },
  'Apocrypha': {
    term: 'Apocrypha',
    definition: 'Books included in some Bibles but not others. Catholics include them in the Old Testament; Protestants do not.',
  },
  'Canon': {
    term: 'Canon',
    definition: 'The official list of books accepted as Scripture. Different traditions (Jewish, Catholic, Protestant, Orthodox) have slightly different canons.',
  },
  'Septuagint': {
    term: 'Septuagint',
    definition: 'The Greek translation of the Hebrew Bible, made around 250 BCE. Often abbreviated as "LXX" (70).',
  },

  // Patriarchal terms
  'Birthright': {
    term: 'Birthright',
    definition: 'The special inheritance rights of the firstborn son, including a double portion of the family estate and leadership of the family after the father\'s death.',
  },
  'Blessing': {
    term: 'Blessing (Patriarchal)',
    definition: 'In the patriarchal period, a father\'s blessing was a prophetic declaration of a son\'s future. Once spoken, it was considered irrevocable—even if obtained by deception.',
  },
  'Suzerain': {
    term: 'Suzerain',
    definition: 'A powerful ruler who grants protection and benefits to lesser kings or peoples in exchange for loyalty. Ancient covenants often followed a "suzerain-vassal" pattern.',
  },
  'Hyksos': {
    term: 'Hyksos',
    definition: 'Semitic rulers who controlled northern Egypt during approximately 1650-1550 BCE. Their reign may provide historical context for Joseph\'s rise to power in Egypt.',
  },
  'Teraphim': {
    term: 'Teraphim',
    definition: 'Household idols or gods, often small figurines. When Rachel stole her father Laban\'s teraphim, she may have been claiming inheritance rights, as these objects often had legal significance.',
  },
  'Nuzi': {
    term: 'Nuzi',
    definition: 'An ancient Mesopotamian city where archaeologists found thousands of tablets describing customs that match patriarchal practices—adoption, marriage contracts, and inheritance laws.',
  },
  'Mari': {
    term: 'Mari',
    definition: 'An ancient city on the Euphrates River where tablets were found describing prophetic practices and social customs similar to those in Genesis.',
  },
  'Semitic': {
    term: 'Semitic',
    definition: 'Relating to the language family that includes Hebrew, Arabic, and Aramaic, or the peoples who spoke these languages. Abraham was a Semite; so are modern Jews and Arabs.',
  },
  'Twelve Tribes': {
    term: 'Twelve Tribes',
    definition: 'The twelve family groups descended from Jacob\'s twelve sons. Each tribe received territory in Canaan (except Levi, who served as priests). The tribes sometimes acted independently, sometimes unified.',
  },
  'Providence': {
    term: 'Providence',
    definition: 'God\'s ongoing care and direction of creation and history. The belief that God works through events—even human evil—to accomplish His purposes.',
  },
  'Supplanter': {
    term: 'Supplanter',
    definition: 'One who takes the place of another by force or scheming. Jacob\'s name sounds like the Hebrew word for "heel-grabber" or "supplanter" because of how he grasped Esau\'s heel at birth and later stole his blessing.',
  },
};

export function getGlossaryTerm(term: string): GlossaryTerm | undefined {
  // Try exact match first
  if (GLOSSARY[term]) {
    return GLOSSARY[term];
  }
  // Try case-insensitive match
  const lowerTerm = term.toLowerCase();
  for (const key of Object.keys(GLOSSARY)) {
    if (key.toLowerCase() === lowerTerm) {
      return GLOSSARY[key];
    }
  }
  return undefined;
}

// Terms that should be auto-detected and explained in content
export const AUTO_EXPLAIN_TERMS = [
  'BCE', 'CE', 'BC', 'AD',
  'Mesopotamia', 'Canaan', 'Fertile Crescent',
  'Sumerians', 'Babylonians', 'Assyrians',
  'Torah', 'Covenant', 'Ziggurat', 'Cuneiform',
  'Patriarch', 'Prophet', 'Messiah', 'Exile',
];
