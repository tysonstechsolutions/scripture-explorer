export interface BibleTopic {
  id: string;
  name: string;
  description: string;
  verses: { reference: string; text: string }[];
  relatedTopics: string[];
}

export const BIBLE_TOPICS: BibleTopic[] = [
  {
    id: "salvation",
    name: "Salvation",
    description: "God's plan to rescue humanity from sin through faith in Jesus Christ",
    verses: [
      { reference: "John 3:16", text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
      { reference: "Romans 10:9", text: "That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved." },
      { reference: "Ephesians 2:8-9", text: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast." },
      { reference: "Acts 4:12", text: "Neither is there salvation in any other: for there is none other name under heaven given among men, whereby we must be saved." },
    ],
    relatedTopics: ["faith", "grace", "forgiveness"],
  },
  {
    id: "faith",
    name: "Faith",
    description: "Trusting in God and His promises, the foundation of our relationship with Him",
    verses: [
      { reference: "Hebrews 11:1", text: "Now faith is the substance of things hoped for, the evidence of things not seen." },
      { reference: "Hebrews 11:6", text: "But without faith it is impossible to please him: for he that cometh to God must believe that he is, and that he is a rewarder of them that diligently seek him." },
      { reference: "Romans 10:17", text: "So then faith cometh by hearing, and hearing by the word of God." },
      { reference: "James 2:17", text: "Even so faith, if it hath not works, is dead, being alone." },
    ],
    relatedTopics: ["salvation", "hope", "trust"],
  },
  {
    id: "love",
    name: "Love",
    description: "God's unconditional love for us and how we are called to love others",
    verses: [
      { reference: "1 Corinthians 13:4-7", text: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up, Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil; Rejoiceth not in iniquity, but rejoiceth in the truth; Beareth all things, believeth all things, hopeth all things, endureth all things." },
      { reference: "1 John 4:8", text: "He that loveth not knoweth not God; for God is love." },
      { reference: "John 13:34-35", text: "A new commandment I give unto you, That ye love one another; as I have loved you, that ye also love one another. By this shall all men know that ye are my disciples, if ye have love one to another." },
      { reference: "Romans 8:38-39", text: "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord." },
    ],
    relatedTopics: ["grace", "forgiveness", "kindness"],
  },
  {
    id: "hope",
    name: "Hope",
    description: "Confident expectation in God's promises for our future",
    verses: [
      { reference: "Romans 15:13", text: "Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost." },
      { reference: "Jeremiah 29:11", text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end." },
      { reference: "Romans 8:28", text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." },
      { reference: "1 Peter 1:3", text: "Blessed be the God and Father of our Lord Jesus Christ, which according to his abundant mercy hath begotten us again unto a lively hope by the resurrection of Jesus Christ from the dead." },
    ],
    relatedTopics: ["faith", "trust", "peace"],
  },
  {
    id: "forgiveness",
    name: "Forgiveness",
    description: "God's forgiveness of our sins and our call to forgive others",
    verses: [
      { reference: "1 John 1:9", text: "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness." },
      { reference: "Ephesians 4:32", text: "And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ's sake hath forgiven you." },
      { reference: "Colossians 3:13", text: "Forbearing one another, and forgiving one another, if any man have a quarrel against any: even as Christ forgave you, so also do ye." },
      { reference: "Matthew 6:14-15", text: "For if ye forgive men their trespasses, your heavenly Father will also forgive you: But if ye forgive not men their trespasses, neither will your Father forgive your trespasses." },
    ],
    relatedTopics: ["grace", "love", "mercy"],
  },
  {
    id: "prayer",
    name: "Prayer",
    description: "Communicating with God through praise, thanksgiving, confession, and petition",
    verses: [
      { reference: "Philippians 4:6-7", text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus." },
      { reference: "1 Thessalonians 5:17", text: "Pray without ceasing." },
      { reference: "Matthew 7:7", text: "Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you." },
      { reference: "James 5:16", text: "Confess your faults one to another, and pray one for another, that ye may be healed. The effectual fervent prayer of a righteous man availeth much." },
    ],
    relatedTopics: ["faith", "worship", "peace"],
  },
  {
    id: "peace",
    name: "Peace",
    description: "The tranquility that comes from trusting in God amid life's storms",
    verses: [
      { reference: "John 14:27", text: "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid." },
      { reference: "Isaiah 26:3", text: "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee." },
      { reference: "Philippians 4:7", text: "And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus." },
      { reference: "Romans 5:1", text: "Therefore being justified by faith, we have peace with God through our Lord Jesus Christ." },
    ],
    relatedTopics: ["hope", "trust", "rest"],
  },
  {
    id: "strength",
    name: "Strength",
    description: "Finding power through God when we face challenges and weakness",
    verses: [
      { reference: "Philippians 4:13", text: "I can do all things through Christ which strengtheneth me." },
      { reference: "Isaiah 40:31", text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint." },
      { reference: "2 Corinthians 12:9", text: "And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness." },
      { reference: "Psalm 46:1", text: "God is our refuge and strength, a very present help in trouble." },
    ],
    relatedTopics: ["courage", "trust", "faith"],
  },
  {
    id: "wisdom",
    name: "Wisdom",
    description: "Godly insight and understanding for making decisions",
    verses: [
      { reference: "James 1:5", text: "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him." },
      { reference: "Proverbs 9:10", text: "The fear of the LORD is the beginning of wisdom: and the knowledge of the holy is understanding." },
      { reference: "Proverbs 3:5-6", text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths." },
      { reference: "Colossians 2:3", text: "In whom are hid all the treasures of wisdom and knowledge." },
    ],
    relatedTopics: ["guidance", "truth", "understanding"],
  },
  {
    id: "grace",
    name: "Grace",
    description: "God's unmerited favor toward us, the foundation of our salvation",
    verses: [
      { reference: "Ephesians 2:8-9", text: "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast." },
      { reference: "2 Corinthians 12:9", text: "And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness." },
      { reference: "Romans 6:14", text: "For sin shall not have dominion over you: for ye are not under the law, but under grace." },
      { reference: "Titus 2:11", text: "For the grace of God that bringeth salvation hath appeared to all men." },
    ],
    relatedTopics: ["salvation", "mercy", "forgiveness"],
  },
];

export function getTopicById(id: string): BibleTopic | undefined {
  return BIBLE_TOPICS.find((t) => t.id === id);
}
