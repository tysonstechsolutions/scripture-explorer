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
    fact: "Methuselah lived 969 years, making him the oldest person recorded in the Bible. Some scholars note his name can be interpreted as 'man of the dart' or 'his death shall bring.'",
    source: "Genesis 5:27",
  },
  {
    title: "Left-Handed Warriors",
    fact: "The tribe of Benjamin had 700 elite left-handed warriors who could 'sling a stone at a hair and not miss.' Ironically, 'Benjamin' means 'son of my right hand.'",
    source: "Judges 20:16",
  },
  {
    title: "The Shortest Verse",
    fact: "'Jesus wept' (John 11:35) is the shortest verse in most English Bibles at just two words, showing Jesus' deep compassion at Lazarus' tomb.",
    source: "John 11:35",
  },
  {
    title: "Dogs in the Bible",
    fact: "Dogs are mentioned over 40 times in Scripture, but unlike today, they were generally viewed as unclean scavengers rather than beloved pets.",
    source: "Exodus 22:31, 1 Kings 14:11",
  },
  {
    title: "Balaam's Donkey",
    fact: "A donkey spoke to the prophet Balaam after seeing an angel that Balaam couldn't see. It's one of only two animals that speak in the Bible (the other being the serpent in Eden).",
    source: "Numbers 22:28-30",
  },
  {
    title: "The Silent Years",
    fact: "The Gospels record nothing about Jesus between ages 12 and about 30 - roughly 18 years of silence. His next appearance is at his baptism by John.",
    source: "Luke 2:42, 3:23",
  },
  {
    title: "Paul's Thorn",
    fact: "Paul's 'thorn in the flesh' remains one of the Bible's enduring mysteries. He asked God three times to remove it, but God said 'My grace is sufficient for you.'",
    source: "2 Corinthians 12:7-9",
  },
  {
    title: "No Cats in Scripture",
    fact: "Domestic cats are never mentioned in the canonical Bible. Lions, leopards, and wildcats appear, but the common house cat is entirely absent from Scripture.",
    source: "Various",
  },
  {
    title: "Noah's Unnamed Wife",
    fact: "Noah's wife is never named in the Bible, despite being one of only 8 people to survive the flood. Later Jewish tradition gives her the name Naamah.",
    source: "Genesis 7:7",
  },
  {
    title: "Two Creation Narratives",
    fact: "Genesis 1 and 2 present creation from different perspectives. Chapter 1 gives an ordered overview; Chapter 2 focuses on humanity's relationship with God and creation.",
    source: "Genesis 1-2",
  },
  {
    title: "The Ethiopian Official",
    fact: "The Ethiopian eunuch in Acts 8 is one of the earliest recorded Gentile converts. He was a high official reading Isaiah when Philip explained the gospel to him.",
    source: "Acts 8:26-39",
  },
  {
    title: "Jesus' Siblings",
    fact: "The Gospels name four brothers of Jesus (James, Joseph, Simon, and Judas) and mention sisters (plural), indicating at least 6 siblings total.",
    source: "Matthew 13:55-56",
  },
  {
    title: "Not an Apple",
    fact: "The Bible never identifies the forbidden fruit as an apple - it's simply called 'fruit.' The apple tradition likely comes from Latin, where 'malum' means both 'apple' and 'evil.'",
    source: "Genesis 3:6",
  },
  {
    title: "Giants of Gath",
    fact: "Goliath wasn't the only giant from Gath. Second Samuel 21 records four Philistine giants killed by David's men, described as descendants of 'the giant.'",
    source: "2 Samuel 21:15-22",
  },
  {
    title: "The Divine Surgery",
    fact: "God caused Adam to fall into a deep sleep before removing his rib to create Eve - the first recorded surgery in Scripture. Adam felt no pain.",
    source: "Genesis 2:21-22",
  },
  {
    title: "The Third Heaven",
    fact: "Paul describes being 'caught up to the third heaven.' Jews understood three heavens: the atmosphere, outer space, and God's dwelling place.",
    source: "2 Corinthians 12:2",
  },
  {
    title: "The Medium of Endor",
    fact: "King Saul, who had banned mediums from Israel, secretly consulted one at Endor to summon Samuel's spirit - an act of desperation before his final battle.",
    source: "1 Samuel 28:3-19",
  },
  {
    title: "Two Men Named Lazarus",
    fact: "There are two Lazaruses in the New Testament - a beggar in Jesus' parable (Luke 16) and the real man Jesus raised from the dead (John 11). Different people, same name.",
    source: "Luke 16:19-31, John 11:1-44",
  },
  {
    title: "The Floating Ax Head",
    fact: "Elisha made an iron ax head float on water to retrieve it for a poor prophet. Iron was extremely valuable then - this miracle saved a man from debt.",
    source: "2 Kings 6:1-7",
  },
  {
    title: "The Great Dragon",
    fact: "In Revelation 12:9, Satan is called 'that ancient serpent... the great dragon.' The Greek word 'drakon' appears multiple times in Revelation's apocalyptic visions.",
    source: "Revelation 12:9",
  },
  {
    title: "Exactly 153 Fish",
    fact: "After Jesus' resurrection, the disciples caught exactly 153 fish in their net. The precise number is recorded, though scholars debate its significance.",
    source: "John 21:11",
  },
  {
    title: "Rahab in Jesus' Lineage",
    fact: "Rahab, the Canaanite woman who hid Israelite spies in Jericho, married an Israelite and became an ancestor of King David and Jesus Christ.",
    source: "Matthew 1:5, Joshua 2",
  },
  {
    title: "Lost Biblical Books",
    fact: "The Bible mentions books that no longer exist: the Book of Jasher, the Book of the Wars of the Lord, and various royal chronicles. Their contents are lost to history.",
    source: "Joshua 10:13, Numbers 21:14",
  },
  {
    title: "The Re'em",
    fact: "The KJV translates the Hebrew 're'em' as 'unicorn' (9 times). Modern scholars identify this animal as the now-extinct aurochs, a powerful wild ox.",
    source: "Numbers 23:22, Job 39:9-10",
  },
  {
    title: "Red and Hairy",
    fact: "Esau was born 'red, all over like a hairy garment.' His name means 'hairy,' and he later became known as Edom, meaning 'red.'",
    source: "Genesis 25:25",
  },
  {
    title: "The Pale Horse",
    fact: "The fourth horseman rides a 'pale' horse. The Greek word is 'chloros' (root of chlorophyll), suggesting a sickly yellowish-green color - the color of death.",
    source: "Revelation 6:8",
  },
  {
    title: "Moses the Reluctant",
    fact: "Moses told God he was 'slow of speech and tongue' when called to confront Pharaoh. God appointed his brother Aaron to speak for him.",
    source: "Exodus 4:10-16",
  },
  {
    title: "The Boy King",
    fact: "Joash became king of Judah at age 7 after being hidden in the temple for six years to protect him from his grandmother Athaliah, who had killed the royal family.",
    source: "2 Kings 11:1-21",
  },
  {
    title: "Wrestling at Peniel",
    fact: "Jacob wrestled all night with a mysterious figure (God or an angel). He refused to let go until blessed, and walked with a limp ever after.",
    source: "Genesis 32:22-32",
  },
  {
    title: "The Long Day",
    fact: "Joshua prayed for the sun to stand still during battle, and it stopped in the middle of the sky for about a full day. Scripture calls it a unique day in history.",
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
