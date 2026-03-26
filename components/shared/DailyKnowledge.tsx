"use client";

import { useState, useEffect } from "react";
import { X, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KnowledgeFact {
  title: string;
  fact: string;
  source?: string;
}

const BIBLE_FACTS: KnowledgeFact[] = [
  {
    title: "The Oldest Man",
    fact: "Methuselah lived 969 years, making him the oldest person in the Bible. Interestingly, his name means 'when he dies, it shall come' - and the flood came the year he died.",
    source: "Genesis 5:27",
  },
  {
    title: "Left-Handed Warriors",
    fact: "The tribe of Benjamin had 700 elite left-handed warriors who could 'sling a stone at a hair and not miss.' Ironically, 'Benjamin' means 'son of my right hand.'",
    source: "Judges 20:16",
  },
  {
    title: "The Shortest Verse",
    fact: "In English, 'Jesus wept' (John 11:35) is the shortest verse. But in Greek, 1 Thessalonians 5:16 ('Rejoice always') is actually shorter at just 14 letters.",
    source: "John 11:35",
  },
  {
    title: "Dogs in the Bible",
    fact: "Dogs are mentioned 40 times in the Bible, but unlike today, they were generally viewed negatively as scavengers. The only positive reference is in the book of Tobit.",
    source: "Various",
  },
  {
    title: "The Bible's Only Joke?",
    fact: "Some scholars consider Balaam's talking donkey the Bible's only intentional humor - the prophet who couldn't see an angel was outsmarted by his own donkey.",
    source: "Numbers 22:28-30",
  },
  {
    title: "The Missing Years",
    fact: "The Bible says nothing about Jesus between ages 12 and 30 - an 18-year gap. His next recorded appearance is at his baptism by John.",
    source: "Luke 2:42, 3:23",
  },
  {
    title: "Paul's Thorn",
    fact: "Paul's 'thorn in the flesh' remains one of the Bible's biggest mysteries. Theories include poor eyesight, epilepsy, malaria, or even a speech impediment.",
    source: "2 Corinthians 12:7",
  },
  {
    title: "No Cats Allowed",
    fact: "Domestic cats are never mentioned in the Bible. Lions appear over 150 times, but the common house cat is completely absent from Scripture.",
    source: "Various",
  },
  {
    title: "The Unnamed Wife",
    fact: "Noah's wife is never named in the Bible, despite being one of only 8 people to survive the flood. Jewish tradition calls her Naamah.",
    source: "Genesis 7:7",
  },
  {
    title: "Two Creation Accounts",
    fact: "Genesis contains two creation narratives. In chapter 1, humans are created last. In chapter 2, Adam is created before the animals. Scholars debate whether these are complementary or separate traditions.",
    source: "Genesis 1-2",
  },
  {
    title: "The Ethiopian Official",
    fact: "The Ethiopian eunuch in Acts 8 was likely the first African convert to Christianity. He was reading Isaiah and couldn't understand it until Philip explained it.",
    source: "Acts 8:26-39",
  },
  {
    title: "Jesus' Siblings",
    fact: "Jesus had at least 6 siblings - 4 brothers (James, Joseph, Simon, Judas) and at least 2 sisters who remain unnamed in Scripture.",
    source: "Matthew 13:55-56",
  },
  {
    title: "The Forbidden Fruit",
    fact: "The Bible never says the forbidden fruit was an apple. It's simply called 'fruit.' The apple association came from Latin, where 'malum' means both 'apple' and 'evil.'",
    source: "Genesis 3:6",
  },
  {
    title: "Goliath's Brothers",
    fact: "Goliath had at least one brother who was also a giant. In 2 Samuel 21, we learn there were four giants from Gath, all descendants of Rapha.",
    source: "2 Samuel 21:15-22",
  },
  {
    title: "The First Surgery",
    fact: "God performed the first surgery when He removed Adam's rib to create Eve. Interestingly, ribs are one of the few bones that can regenerate.",
    source: "Genesis 2:21-22",
  },
  {
    title: "Three Heavens",
    fact: "Paul speaks of being caught up to the 'third heaven.' Ancient Jews believed in three: the sky (birds), space (stars), and God's dwelling place.",
    source: "2 Corinthians 12:2",
  },
  {
    title: "The Witch of Endor",
    fact: "King Saul, who banned mediums, secretly consulted the Witch of Endor to summon Samuel's spirit. It's the Bible's only seance, and it worked.",
    source: "1 Samuel 28",
  },
  {
    title: "Lazarus Twice",
    fact: "There are two different Lazaruses in the New Testament - the beggar in Jesus' parable (Luke 16) and the real man Jesus raised from the dead (John 11).",
    source: "Luke 16, John 11",
  },
  {
    title: "The Ax Head Miracle",
    fact: "Elisha made an iron ax head float on water. This seemingly minor miracle was actually significant - iron tools were extremely expensive and often borrowed.",
    source: "2 Kings 6:1-7",
  },
  {
    title: "Dragon in the Bible",
    fact: "The word 'dragon' appears 35 times in the King James Bible. In Revelation, Satan is explicitly called 'that old serpent, the dragon.'",
    source: "Revelation 12:9",
  },
  {
    title: "The 153 Fish",
    fact: "When Jesus helped disciples catch 153 fish, the number wasn't random. Ancient Greeks believed there were exactly 153 species of fish in the sea.",
    source: "John 21:11",
  },
  {
    title: "Rahab the Ancestor",
    fact: "Rahab, the prostitute who helped Israelite spies, became an ancestor of both King David and Jesus Christ. She's one of only 5 women named in Jesus' genealogy.",
    source: "Matthew 1:5",
  },
  {
    title: "The Lost Books",
    fact: "The Bible references at least 20 books that no longer exist, including the Book of Jasher, the Book of the Wars of the Lord, and the Chronicles of the Kings of Israel.",
    source: "Joshua 10:13, Numbers 21:14",
  },
  {
    title: "Unicorns in the Bible",
    fact: "The King James Bible mentions unicorns 9 times. Modern translations use 'wild ox' - the Hebrew word 're'em' was mistranslated from the Greek 'monokeros.'",
    source: "Numbers 23:22 (KJV)",
  },
  {
    title: "The First Redhead",
    fact: "Esau is described as red and hairy at birth. His name means 'hairy' and his nickname Edom means 'red.' He may be the Bible's first described redhead.",
    source: "Genesis 25:25",
  },
  {
    title: "Four Horsemen's Horses",
    fact: "The Four Horsemen ride white, red, black, and pale horses. 'Pale' in Greek is 'chloros' - the same root as chlorophyll - suggesting a sickly green color.",
    source: "Revelation 6:1-8",
  },
  {
    title: "Moses' Speech Problem",
    fact: "Moses claimed to be 'slow of speech and tongue.' Some scholars believe he had a stutter. God's solution? His brother Aaron became his spokesman.",
    source: "Exodus 4:10",
  },
  {
    title: "The Youngest King",
    fact: "Joash became king of Judah at age 7 and reigned for 40 years. He was hidden in the temple as a baby to escape his murderous grandmother Athaliah.",
    source: "2 Kings 11:21",
  },
  {
    title: "Wrestling with God",
    fact: "Jacob literally wrestled with God (or an angel) all night and won. But he walked with a limp for the rest of his life after his hip was dislocated.",
    source: "Genesis 32:22-32",
  },
  {
    title: "The Sun Stood Still",
    fact: "Joshua commanded the sun to stand still for a full day during battle. This is the only time in Scripture someone commanded celestial bodies.",
    source: "Joshua 10:12-14",
  },
];

const STORAGE_KEY = "daily-knowledge-date";

export function DailyKnowledge() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem(STORAGE_KEY);

    // Show if never shown or shown on a different day
    if (lastShown !== today) {
      // Use day of year to pick a consistent fact for the day
      const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
      );
      setCurrentFact(dayOfYear % BIBLE_FACTS.length);
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toDateString());
    setIsVisible(false);
  };

  const handleNext = () => {
    setCurrentFact((prev) => (prev + 1) % BIBLE_FACTS.length);
  };

  const handlePrev = () => {
    setCurrentFact((prev) => (prev === 0 ? BIBLE_FACTS.length - 1 : prev - 1));
  };

  if (!isVisible) return null;

  const fact = BIBLE_FACTS[currentFact];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 flex items-center gap-3">
          <div className="bg-white/20 rounded-full p-2">
            <Lightbulb className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white/80 text-xs font-medium">Did You Know?</p>
            <p className="text-white font-semibold">Daily Bible Fact</p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white p-1"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-amber-700 dark:text-amber-400 mb-3">
            {fact.title}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {fact.fact}
          </p>
          {fact.source && (
            <p className="text-sm text-muted-foreground italic">
              {fact.source}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex items-center justify-between">
          <div className="flex gap-1">
            <button
              onClick={handlePrev}
              className="p-2 text-muted-foreground hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              aria-label="Previous fact"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 text-muted-foreground hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              aria-label="Next fact"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <Button onClick={handleDismiss} className="bg-amber-500 hover:bg-amber-600">
            Got it!
          </Button>
        </div>
      </div>
    </div>
  );
}
