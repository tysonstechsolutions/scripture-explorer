import type { BibleBook } from "./types";

// KJV book IDs from API.Bible
export const BIBLE_BOOKS: BibleBook[] = [
  { id: "GEN", name: "Genesis", nameLong: "The First Book of Moses, called Genesis", abbreviation: "Gen", chapters: 50 },
  { id: "EXO", name: "Exodus", nameLong: "The Second Book of Moses, called Exodus", abbreviation: "Exod", chapters: 40 },
  { id: "LEV", name: "Leviticus", nameLong: "The Third Book of Moses, called Leviticus", abbreviation: "Lev", chapters: 27 },
  { id: "NUM", name: "Numbers", nameLong: "The Fourth Book of Moses, called Numbers", abbreviation: "Num", chapters: 36 },
  { id: "DEU", name: "Deuteronomy", nameLong: "The Fifth Book of Moses, called Deuteronomy", abbreviation: "Deut", chapters: 34 },
  { id: "JOS", name: "Joshua", nameLong: "The Book of Joshua", abbreviation: "Josh", chapters: 24 },
  { id: "JDG", name: "Judges", nameLong: "The Book of Judges", abbreviation: "Judg", chapters: 21 },
  { id: "RUT", name: "Ruth", nameLong: "The Book of Ruth", abbreviation: "Ruth", chapters: 4 },
  { id: "1SA", name: "1 Samuel", nameLong: "The First Book of Samuel", abbreviation: "1 Sam", chapters: 31 },
  { id: "2SA", name: "2 Samuel", nameLong: "The Second Book of Samuel", abbreviation: "2 Sam", chapters: 24 },
  { id: "1KI", name: "1 Kings", nameLong: "The First Book of the Kings", abbreviation: "1 Kgs", chapters: 22 },
  { id: "2KI", name: "2 Kings", nameLong: "The Second Book of the Kings", abbreviation: "2 Kgs", chapters: 25 },
  { id: "1CH", name: "1 Chronicles", nameLong: "The First Book of the Chronicles", abbreviation: "1 Chr", chapters: 29 },
  { id: "2CH", name: "2 Chronicles", nameLong: "The Second Book of the Chronicles", abbreviation: "2 Chr", chapters: 36 },
  { id: "EZR", name: "Ezra", nameLong: "The Book of Ezra", abbreviation: "Ezra", chapters: 10 },
  { id: "NEH", name: "Nehemiah", nameLong: "The Book of Nehemiah", abbreviation: "Neh", chapters: 13 },
  { id: "EST", name: "Esther", nameLong: "The Book of Esther", abbreviation: "Esth", chapters: 10 },
  { id: "JOB", name: "Job", nameLong: "The Book of Job", abbreviation: "Job", chapters: 42 },
  { id: "PSA", name: "Psalms", nameLong: "The Book of Psalms", abbreviation: "Ps", chapters: 150 },
  { id: "PRO", name: "Proverbs", nameLong: "The Proverbs", abbreviation: "Prov", chapters: 31 },
  { id: "ECC", name: "Ecclesiastes", nameLong: "Ecclesiastes or, the Preacher", abbreviation: "Eccl", chapters: 12 },
  { id: "SNG", name: "Song of Solomon", nameLong: "The Song of Solomon", abbreviation: "Song", chapters: 8 },
  { id: "ISA", name: "Isaiah", nameLong: "The Book of the Prophet Isaiah", abbreviation: "Isa", chapters: 66 },
  { id: "JER", name: "Jeremiah", nameLong: "The Book of the Prophet Jeremiah", abbreviation: "Jer", chapters: 52 },
  { id: "LAM", name: "Lamentations", nameLong: "The Lamentations of Jeremiah", abbreviation: "Lam", chapters: 5 },
  { id: "EZK", name: "Ezekiel", nameLong: "The Book of the Prophet Ezekiel", abbreviation: "Ezek", chapters: 48 },
  { id: "DAN", name: "Daniel", nameLong: "The Book of Daniel", abbreviation: "Dan", chapters: 12 },
  { id: "HOS", name: "Hosea", nameLong: "Hosea", abbreviation: "Hos", chapters: 14 },
  { id: "JOL", name: "Joel", nameLong: "Joel", abbreviation: "Joel", chapters: 3 },
  { id: "AMO", name: "Amos", nameLong: "Amos", abbreviation: "Amos", chapters: 9 },
  { id: "OBA", name: "Obadiah", nameLong: "Obadiah", abbreviation: "Obad", chapters: 1 },
  { id: "JON", name: "Jonah", nameLong: "Jonah", abbreviation: "Jonah", chapters: 4 },
  { id: "MIC", name: "Micah", nameLong: "Micah", abbreviation: "Mic", chapters: 7 },
  { id: "NAM", name: "Nahum", nameLong: "Nahum", abbreviation: "Nah", chapters: 3 },
  { id: "HAB", name: "Habakkuk", nameLong: "Habakkuk", abbreviation: "Hab", chapters: 3 },
  { id: "ZEP", name: "Zephaniah", nameLong: "Zephaniah", abbreviation: "Zeph", chapters: 3 },
  { id: "HAG", name: "Haggai", nameLong: "Haggai", abbreviation: "Hag", chapters: 2 },
  { id: "ZEC", name: "Zechariah", nameLong: "Zechariah", abbreviation: "Zech", chapters: 14 },
  { id: "MAL", name: "Malachi", nameLong: "Malachi", abbreviation: "Mal", chapters: 4 },
  { id: "MAT", name: "Matthew", nameLong: "The Gospel According to Matthew", abbreviation: "Matt", chapters: 28 },
  { id: "MRK", name: "Mark", nameLong: "The Gospel According to Mark", abbreviation: "Mark", chapters: 16 },
  { id: "LUK", name: "Luke", nameLong: "The Gospel According to Luke", abbreviation: "Luke", chapters: 24 },
  { id: "JHN", name: "John", nameLong: "The Gospel According to John", abbreviation: "John", chapters: 21 },
  { id: "ACT", name: "Acts", nameLong: "The Acts of the Apostles", abbreviation: "Acts", chapters: 28 },
  { id: "ROM", name: "Romans", nameLong: "The Epistle of Paul the Apostle to the Romans", abbreviation: "Rom", chapters: 16 },
  { id: "1CO", name: "1 Corinthians", nameLong: "The First Epistle of Paul the Apostle to the Corinthians", abbreviation: "1 Cor", chapters: 16 },
  { id: "2CO", name: "2 Corinthians", nameLong: "The Second Epistle of Paul the Apostle to the Corinthians", abbreviation: "2 Cor", chapters: 13 },
  { id: "GAL", name: "Galatians", nameLong: "The Epistle of Paul the Apostle to the Galatians", abbreviation: "Gal", chapters: 6 },
  { id: "EPH", name: "Ephesians", nameLong: "The Epistle of Paul the Apostle to the Ephesians", abbreviation: "Eph", chapters: 6 },
  { id: "PHP", name: "Philippians", nameLong: "The Epistle of Paul the Apostle to the Philippians", abbreviation: "Phil", chapters: 4 },
  { id: "COL", name: "Colossians", nameLong: "The Epistle of Paul the Apostle to the Colossians", abbreviation: "Col", chapters: 4 },
  { id: "1TH", name: "1 Thessalonians", nameLong: "The First Epistle of Paul the Apostle to the Thessalonians", abbreviation: "1 Thess", chapters: 5 },
  { id: "2TH", name: "2 Thessalonians", nameLong: "The Second Epistle of Paul the Apostle to the Thessalonians", abbreviation: "2 Thess", chapters: 3 },
  { id: "1TI", name: "1 Timothy", nameLong: "The First Epistle of Paul the Apostle to Timothy", abbreviation: "1 Tim", chapters: 6 },
  { id: "2TI", name: "2 Timothy", nameLong: "The Second Epistle of Paul the Apostle to Timothy", abbreviation: "2 Tim", chapters: 4 },
  { id: "TIT", name: "Titus", nameLong: "The Epistle of Paul the Apostle to Titus", abbreviation: "Titus", chapters: 3 },
  { id: "PHM", name: "Philemon", nameLong: "The Epistle of Paul the Apostle to Philemon", abbreviation: "Phlm", chapters: 1 },
  { id: "HEB", name: "Hebrews", nameLong: "The Epistle of Paul the Apostle to the Hebrews", abbreviation: "Heb", chapters: 13 },
  { id: "JAS", name: "James", nameLong: "The General Epistle of James", abbreviation: "Jas", chapters: 5 },
  { id: "1PE", name: "1 Peter", nameLong: "The First Epistle General of Peter", abbreviation: "1 Pet", chapters: 5 },
  { id: "2PE", name: "2 Peter", nameLong: "The Second Epistle General of Peter", abbreviation: "2 Pet", chapters: 3 },
  { id: "1JN", name: "1 John", nameLong: "The First Epistle General of John", abbreviation: "1 John", chapters: 5 },
  { id: "2JN", name: "2 John", nameLong: "The Second Epistle of John", abbreviation: "2 John", chapters: 1 },
  { id: "3JN", name: "3 John", nameLong: "The Third Epistle of John", abbreviation: "3 John", chapters: 1 },
  { id: "JUD", name: "Jude", nameLong: "The General Epistle of Jude", abbreviation: "Jude", chapters: 1 },
  { id: "REV", name: "Revelation", nameLong: "The Revelation of Jesus Christ", abbreviation: "Rev", chapters: 22 },
];

export function getBookBySlug(slug: string): BibleBook | undefined {
  const normalized = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
  return BIBLE_BOOKS.find(
    (book) =>
      book.name.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized ||
      book.abbreviation.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized ||
      book.id.toLowerCase() === normalized
  );
}

export function getBookById(id: string): BibleBook | undefined {
  return BIBLE_BOOKS.find((book) => book.id === id);
}
