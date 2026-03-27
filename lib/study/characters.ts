export interface BibleCharacter {
  id: string;
  name: string;
  title: string;
  description: string;
  keyVerses: string[];
  timeline: string;
  significance: string;
  lessons: string[];
  relatedCharacters: string[];
}

export const BIBLE_CHARACTERS: BibleCharacter[] = [
  {
    id: "abraham",
    name: "Abraham",
    title: "Father of Faith",
    description: "Originally named Abram, Abraham was called by God to leave his home in Ur and journey to a land God would show him. He became the father of the Hebrew nation and is considered the patriarch of three major world religions.",
    keyVerses: ["Genesis 12:1-3", "Genesis 15:6", "Genesis 22:1-18", "Hebrews 11:8-12"],
    timeline: "c. 2000-1825 BC",
    significance: "Abraham is the model of faith, believing God's promises even when they seemed impossible. God made a covenant with him that through his descendants all nations would be blessed - ultimately fulfilled in Jesus Christ.",
    lessons: [
      "Faith means trusting God even when we cannot see the outcome",
      "God keeps His promises, even when fulfillment seems impossible",
      "Obedience to God may require leaving our comfort zone",
    ],
    relatedCharacters: ["sarah", "isaac", "lot", "hagar"],
  },
  {
    id: "moses",
    name: "Moses",
    title: "The Lawgiver",
    description: "Born during a time of slavery, Moses was rescued as a baby and raised in Pharaoh's palace. God called him through a burning bush to lead the Israelites out of Egypt and gave him the Ten Commandments on Mount Sinai.",
    keyVerses: ["Exodus 3:1-14", "Exodus 20:1-17", "Deuteronomy 34:10-12", "Hebrews 11:24-28"],
    timeline: "c. 1525-1405 BC",
    significance: "Moses served as prophet, lawgiver, and leader. He wrote the first five books of the Bible and foreshadowed Christ as a mediator between God and His people.",
    lessons: [
      "God can use anyone, regardless of their past or perceived limitations",
      "True leadership requires humility and intercession for others",
      "God's law reflects His holy character and reveals our need for grace",
    ],
    relatedCharacters: ["aaron", "miriam", "joshua", "pharaoh"],
  },
  {
    id: "david",
    name: "David",
    title: "Man After God's Own Heart",
    description: "A shepherd boy who became Israel's greatest king. David was anointed by Samuel, defeated Goliath, wrote many Psalms, and established Jerusalem as the capital. Despite his failures, he remained devoted to God.",
    keyVerses: ["1 Samuel 16:7", "1 Samuel 17:45-47", "2 Samuel 7:12-16", "Acts 13:22"],
    timeline: "c. 1040-970 BC",
    significance: "David united Israel and established a dynasty through which Jesus (the 'Son of David') would come. His psalms express the full range of human emotion in worship.",
    lessons: [
      "God looks at the heart, not outward appearances",
      "Sin has consequences, but genuine repentance brings restoration",
      "Worship should involve our whole being - emotions, intellect, and will",
    ],
    relatedCharacters: ["samuel", "saul", "jonathan", "bathsheba", "solomon"],
  },
  {
    id: "mary",
    name: "Mary",
    title: "Mother of Jesus",
    description: "A young Jewish woman from Nazareth chosen by God to be the mother of the Messiah. Her faith and humility shine through her response to the angel Gabriel: 'I am the Lord's servant.'",
    keyVerses: ["Luke 1:26-38", "Luke 1:46-55", "John 2:1-11", "John 19:25-27"],
    timeline: "c. 18 BC - 1st century AD",
    significance: "Mary's 'yes' to God made her the vessel through which salvation entered the world. She models faithful obedience and is honored by all Christian traditions.",
    lessons: [
      "Humble availability to God's plan changes history",
      "Faith means trusting God even when we don't understand",
      "True blessing comes from obedience, not status",
    ],
    relatedCharacters: ["joseph", "jesus", "elizabeth", "john-apostle"],
  },
  {
    id: "peter",
    name: "Peter",
    title: "The Rock",
    description: "A fisherman who became the leading apostle. Known for his bold faith and equally bold failures, Peter's transformation from impulsive disciple to church leader demonstrates God's restoring grace.",
    keyVerses: ["Matthew 16:16-19", "Matthew 26:69-75", "John 21:15-19", "Acts 2:14-41"],
    timeline: "1st century AD",
    significance: "Peter preached the first Christian sermon at Pentecost and opened the door of faith to the Gentiles. He demonstrates that failure need not be final.",
    lessons: [
      "Jesus can transform our weaknesses into strengths",
      "Failure does not disqualify us from God's service",
      "Bold faith sometimes fails, but Jesus restores those who return to Him",
    ],
    relatedCharacters: ["jesus", "andrew", "john-apostle", "paul"],
  },
  {
    id: "paul",
    name: "Paul",
    title: "Apostle to the Gentiles",
    description: "Originally Saul of Tarsus, a persecutor of Christians, Paul was dramatically converted on the road to Damascus. He became the greatest missionary and theologian of the early church, writing much of the New Testament.",
    keyVerses: ["Acts 9:1-19", "Philippians 3:7-11", "Romans 8:28-39", "2 Timothy 4:7-8"],
    timeline: "c. 5-67 AD",
    significance: "Paul's letters explain the gospel's implications for daily life. His missionary journeys established churches throughout the Roman Empire and set the pattern for Christian mission.",
    lessons: [
      "No one is beyond God's reach for transformation",
      "Past sins do not define our future in Christ",
      "The gospel is for all people, regardless of background",
    ],
    relatedCharacters: ["barnabas", "timothy", "luke", "peter"],
  },
  {
    id: "joseph-ot",
    name: "Joseph",
    title: "The Dreamer",
    description: "Sold into slavery by his jealous brothers, Joseph rose from prisoner to second-in-command of Egypt. His story demonstrates God's sovereignty over human evil.",
    keyVerses: ["Genesis 37:5-11", "Genesis 39:2-4", "Genesis 45:4-8", "Genesis 50:20"],
    timeline: "c. 1915-1805 BC",
    significance: "Joseph's life prefigures Christ - rejected by his own, sold for silver, raised to save many. His story shows God working through adversity.",
    lessons: [
      "God can bring good out of evil circumstances",
      "Integrity matters, even when no one is watching",
      "Forgiveness breaks cycles of bitterness and revenge",
    ],
    relatedCharacters: ["jacob", "benjamin", "potiphar", "pharaoh"],
  },
  {
    id: "esther",
    name: "Esther",
    title: "Queen of Courage",
    description: "A Jewish orphan who became queen of Persia. When her people faced genocide, Esther risked her life to intercede before the king. Though God's name is not mentioned in her book, His providence is everywhere.",
    keyVerses: ["Esther 2:17", "Esther 4:14", "Esther 4:16", "Esther 8:11"],
    timeline: "c. 492-460 BC",
    significance: "Esther demonstrates that God places His people in positions of influence for His purposes. The Jewish festival of Purim celebrates her courage.",
    lessons: [
      "Perhaps you are where you are 'for such a time as this'",
      "Courage means doing right despite the cost",
      "God works through ordinary people in everyday circumstances",
    ],
    relatedCharacters: ["mordecai", "xerxes", "haman"],
  },
];

export function getCharacterById(id: string): BibleCharacter | undefined {
  return BIBLE_CHARACTERS.find((c) => c.id === id);
}
