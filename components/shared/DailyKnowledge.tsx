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
    fact: "Methuselah lived 969 years, the longest lifespan recorded in Scripture. His name has been interpreted to mean 'his death shall bring,' and remarkably, the great flood came the very year he died.",
    source: "Genesis 5:27",
  },
  {
    title: "Left-Handed Warriors",
    fact: "God used 700 elite left-handed warriors from the tribe of Benjamin who could 'sling a stone at a hair and not miss.' Ironically, 'Benjamin' means 'son of my right hand.'",
    source: "Judges 20:16",
  },
  {
    title: "Jesus Wept",
    fact: "'Jesus wept' is the shortest verse in most English Bibles - just two words that reveal the depth of our Savior's compassion and His fully human nature as He grieved at Lazarus' tomb.",
    source: "John 11:35",
  },
  {
    title: "Dogs in Biblical Times",
    fact: "Dogs are mentioned over 40 times in Scripture. In ancient Israel, they were seen as unclean scavengers - which makes Jesus' willingness to help the Syrophoenician woman's daughter even more remarkable.",
    source: "Mark 7:27-29",
  },
  {
    title: "When God Opened a Donkey's Mouth",
    fact: "God opened the mouth of Balaam's donkey to speak, revealing that the animal could see the Angel of the Lord when the prophet could not. God can use anything - even a donkey - to accomplish His purposes.",
    source: "Numbers 22:28-30",
  },
  {
    title: "The Hidden Years",
    fact: "Scripture is silent about Jesus from age 12 to about 30. These 'hidden years' remind us that God's timing is perfect - Jesus spent decades in faithful preparation before His public ministry began.",
    source: "Luke 2:42, 3:23",
  },
  {
    title: "Grace in Weakness",
    fact: "Paul pleaded three times for God to remove his 'thorn in the flesh.' God's answer? 'My grace is sufficient for you, for My power is made perfect in weakness.' Paul learned to boast in his weaknesses.",
    source: "2 Corinthians 12:7-9",
  },
  {
    title: "No Cats in Scripture",
    fact: "Domestic cats are never mentioned in the Bible, though lions appear frequently as symbols of both danger and majesty - including Jesus Himself, the 'Lion of Judah.'",
    source: "Revelation 5:5",
  },
  {
    title: "The Faithful Wife",
    fact: "Noah's wife is never named in Scripture, yet she faithfully followed her husband onto the ark. She's one of only 8 people God saved from the flood - a testimony to her faith.",
    source: "Genesis 7:7, 1 Peter 3:20",
  },
  {
    title: "Creation's Two Views",
    fact: "Genesis 1 shows God's power in creating the universe; Genesis 2 zooms in on His intimate care in forming humanity. Together, they reveal a God who is both mighty and personal.",
    source: "Genesis 1-2",
  },
  {
    title: "The Ethiopian's Conversion",
    fact: "The Ethiopian eunuch was reading Isaiah 53 about the suffering servant when Philip was sent by God to explain the gospel. He believed immediately and was baptized - showing that God orchestrates divine appointments.",
    source: "Acts 8:26-39",
  },
  {
    title: "Jesus' Family",
    fact: "Jesus had four brothers (James, Joseph, Simon, and Judas) and at least two sisters. James later became a leader of the Jerusalem church and wrote the epistle of James.",
    source: "Matthew 13:55-56, Galatians 1:19",
  },
  {
    title: "Not an Apple",
    fact: "Scripture never identifies the forbidden fruit as an apple - it's simply called 'fruit.' The focus isn't on what type it was, but on humanity's choice to disobey God.",
    source: "Genesis 3:6",
  },
  {
    title: "Giants in the Land",
    fact: "Goliath wasn't alone - Scripture records four giants from Gath defeated by David and his mighty men. What seemed impossible to Israel, God made possible through faithful warriors.",
    source: "2 Samuel 21:15-22",
  },
  {
    title: "God the Healer",
    fact: "God caused Adam to fall into a deep sleep before creating Eve from his side. From the very beginning, God has been a gentle healer who cares for His creation.",
    source: "Genesis 2:21-22",
  },
  {
    title: "The Third Heaven",
    fact: "Paul was 'caught up to the third heaven' - Paradise itself, God's dwelling place. He heard things too sacred to tell, reminding us that heaven's glory exceeds all we can imagine.",
    source: "2 Corinthians 12:2-4",
  },
  {
    title: "Saul's Desperate Choice",
    fact: "King Saul, who had banned mediums, secretly consulted one in desperation. His tragic end shows what happens when we seek answers apart from God instead of repenting and returning to Him.",
    source: "1 Samuel 28:3-19",
  },
  {
    title: "Two Men Named Lazarus",
    fact: "Jesus used the name Lazarus in His parable about the rich man and the beggar. Later, He raised a real man named Lazarus from the dead - demonstrating His power over death itself.",
    source: "Luke 16:19-31, John 11:1-44",
  },
  {
    title: "God Cares About Details",
    fact: "Elisha made an iron ax head float to help a poor prophet. This 'small' miracle shows God cares about our everyday struggles - even a borrowed tool matters to Him.",
    source: "2 Kings 6:1-7",
  },
  {
    title: "The Ancient Enemy",
    fact: "Revelation calls Satan 'that ancient serpent... the great dragon,' connecting him to the serpent in Eden. But take heart - Revelation also declares his ultimate defeat by Christ.",
    source: "Revelation 12:9, 20:10",
  },
  {
    title: "153 Fish",
    fact: "After His resurrection, Jesus directed the disciples to cast their nets and they caught exactly 153 fish. The precise count emphasizes that this was a real, miraculous event witnessed by real people.",
    source: "John 21:11",
  },
  {
    title: "Rahab's Redemption",
    fact: "Rahab was a Canaanite prostitute who chose to trust in Israel's God. Her faith saved her family and placed her in the lineage of King David and Jesus Christ - a beautiful picture of grace.",
    source: "Matthew 1:5, Hebrews 11:31",
  },
  {
    title: "Referenced Books",
    fact: "Scripture references other historical books like the Book of Jasher and the Book of the Wars of the Lord. These were records of God's mighty acts that the original readers would have known.",
    source: "Joshua 10:13, Numbers 21:14",
  },
  {
    title: "The Mighty Re'em",
    fact: "The KJV translates 'reem' as 'unicorn,' but this was likely the aurochs - an extinct wild ox of immense strength. God used it as a picture of His unstoppable power.",
    source: "Numbers 23:22, Job 39:9-10",
  },
  {
    title: "Esau's Appearance",
    fact: "Esau was born 'red, all over like a hairy garment.' Despite his rough appearance, God still worked through his family line, showing He looks at the heart, not outward appearance.",
    source: "Genesis 25:25",
  },
  {
    title: "The Pale Horse",
    fact: "The fourth horseman rides a 'pale' horse - the Greek word 'chloros' suggests a sickly greenish color, the color of death. Yet even this rider is under God's sovereign control.",
    source: "Revelation 6:8",
  },
  {
    title: "Moses the Reluctant Leader",
    fact: "Moses made excuses about his speaking ability, but God didn't choose him for his eloquence - He chose him to display divine power. God still uses imperfect people for His perfect purposes.",
    source: "Exodus 4:10-16",
  },
  {
    title: "The Boy King Protected",
    fact: "Young Joash was hidden in God's temple for six years while his grandmother murdered the royal family. God preserved the line of David through faithful believers who risked everything.",
    source: "2 Kings 11:1-21",
  },
  {
    title: "Wrestling with God",
    fact: "Jacob wrestled with God all night and wouldn't let go until he received a blessing. His persistence was rewarded - and his limp became a lifelong reminder of that encounter with the Almighty.",
    source: "Genesis 32:22-32",
  },
  {
    title: "The Day the Sun Stood Still",
    fact: "Joshua prayed and the sun stood still for about a full day. Scripture says there has never been a day like it - when the Lord fought for Israel in such a dramatic, visible way.",
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
