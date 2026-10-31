import type { RelationshipContent } from "@/types";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CENTRAL CONTENT CONFIGURATION — "If You Could Hear My Heart"
 * ═══════════════════════════════════════════════════════════════════════════
 * Every personal word of this experience lives here, deliberately separated
 * from the UI components so it can be edited without touching any layout,
 * animation or logic code.
 *
 * GUIDELINES FOR MOHAN:
 *  • Replace / add memories in `story.memories` — only real ones, never invent.
 *  • Song titles, artists and file paths live in `music.tracks`. Drop the
 *    actual audio files into /public/music (see public/music/README.md).
 *  • The letter below is the complete, unabridged letter. Edit it gently —
 *    every paragraph has its own reveal animation, so additions are safe.
 *  • The final question options are all equally valid; keep their tone.
 */

export const relationship: RelationshipContent = {
  meta: {
    title: "If You Could Hear My Heart ❤️",
    description: "A personal letter, written with love, honesty and hope.",
  },

  sender: {
    name: "Mohan",
  },

  recipient: {
    name: "Bacha",
  },

  // 18 September 2023 — interpreted as local midnight in the visitor's timezone.
  relationshipStartDateISO: "2023-09-18",

  opening: {
    heading: "Hey, Bacha...",
    lines: [
      "I don't know if I will ever find the perfect words to explain everything that is in my heart.",
      "But today, I wanted to try.",
    ],
    ctaLabel: "Open my heart ❤️",
    skipLabel: "or skip straight to the letter",
  },

  story: {
    heading: "Before everything became complicated, there was us.",
    subheading: "Since the day our story began, every second has counted.",
    categories: [
      { id: "beginning", title: "The Beginning", blurb: "Where our story started — 18 September 2023." },
      { id: "memories", title: "Beautiful Memories", blurb: "The moments I would never trade for anything." },
      { id: "little-moments", title: "Little Moments", blurb: "Small things that quietly became everything." },
      { id: "laughter", title: "Laughter", blurb: "The silly reasons we couldn't stop smiling." },
      { id: "conversations", title: "Conversations", blurb: "Talks that ran longer than the night." },
      { id: "dreams", title: "Dreams & Plans", blurb: "The future we pictured together." },
    ],
    memories: [
      // ───────────────────────────────────────────────────────────────────
      // MOHAN: add your real memories here. Example shape:
      // {
      //   id: "first-day",
      //   date: "18 September 2023",
      //   title: "The day it all began",
      //   description: "Write here what actually happened, in your words.",
      //   category: "beginning",
      //   photo: { src: "/images/first-day.jpg", alt: "Us", caption: "Optional caption" },
      // },
      // Only add memories that are real. Leave the array empty to keep the
      // elegant "still being written" placeholders for each chapter.
      // ───────────────────────────────────────────────────────────────────
    ],
    emptyState: {
      title: "This chapter is still being written…",
      line: "Some stories refuse to end — they are simply waiting to be told properly.",
    },
  },

  apology: {
    heading: "I know I haven't always loved you the way you deserved.",
    paragraphs: [
      "I am sorry for the moments when I didn't understand your feelings the way I should have.",
      "For the times when I reacted instead of listening, when I let my emotions get in the way of understanding yours, and for every moment when my words or actions may have hurt you.",
      "I know that saying sorry doesn't erase anything.",
      "I know that just because I love you doesn't mean I haven't made mistakes.",
      "You deserved to feel heard. You deserved patience. You deserved someone who could understand that sometimes you don't need an explanation, an argument or a solution. Sometimes you just need to be understood.",
      "And I wish I had understood that better, every single time.",
    ],
  },

  absence: {
    heading: "I never understood how much the little things meant until they became silent.",
    paragraphs: [
      "It's strange how someone can become part of so many little moments of your day.",
      "A random thought makes you want to tell them something.",
      "Something funny happens, and your first instinct is to share it.",
      "You see something beautiful, and you wish they were there to see it too.",
      "And then there is silence.",
      "I miss those little things more than I know how to explain.",
      "I miss having you in my everyday world.",
      "I miss us.",
    ],
  },

  letter: {
    heading: "If my heart could speak without interruption...",
    readFullyLabel: "Read the whole letter",
    parts: [
      { kind: "salutation", text: "Bacha…" },
      { kind: "body", text: "If my heart could speak without interruption." },
      { kind: "salutation", text: "Bacha," },
      {
        kind: "body",
        text: "I don't know where to begin, because there are so many things I have wanted to tell you, and somehow I haven't always known how to express them in the right way.",
      },
      { kind: "body", text: "Maybe I should begin with one simple thing." },
      { kind: "emphasis", text: "I am sorry." },
      {
        kind: "body",
        text: "I am sorry for the moments when I didn't understand your feelings the way I should have. For the times when I reacted instead of listening, when I let my emotions get in the way of understanding yours, and for every moment when my words or actions may have hurt you.",
      },
      {
        kind: "body",
        text: "I know that saying sorry doesn't erase anything. I know that just because I love you doesn't mean I haven't made mistakes. And I don't want to use my love as an excuse for the things I should have done differently.",
      },
      {
        kind: "body",
        text: "You deserved to feel heard. You deserved patience. You deserved someone who could understand that sometimes you don't need an explanation, an argument or a solution. Sometimes you just need to be understood.",
      },
      { kind: "body", text: "And I wish I had understood that better, every single time." },
      { kind: "body", text: "Bacha, do you know what I miss?" },
      { kind: "emphasis", text: "I miss the little things." },
      {
        kind: "body",
        text: "The random conversations, the silly moments, the excitement of sharing something with you, the comfort of knowing that there was someone with whom I could share even the smallest details of my day.",
      },
      {
        kind: "body",
        text: "I miss those moments when nothing special was happening, but somehow everything felt special because you were a part of it.",
      },
      { kind: "body", text: "I miss the version of us that could laugh over the smallest things." },
      {
        kind: "body",
        text: "And sometimes, in the middle of an ordinary day, something reminds me of you, and my first instinct is still to tell you about it.",
      },
      { kind: "body", text: "That's when I realize how deeply you have become a part of my everyday life." },
      {
        kind: "body",
        text: "Your absence has made me notice the value of things I might not have appreciated enough when they were right in front of me.",
      },
      { kind: "body", text: "I don't want to lose our story." },
      {
        kind: "body",
        text: "Not because I am afraid of being alone, and not because I want you to feel responsible for my happiness.",
      },
      { kind: "body", text: "But because what we have shared means something incredibly important to me." },
      {
        kind: "body",
        text: "Since 18 September 2023, we have had a story. A story made of conversations, memories, feelings, little moments and experiences that I will always value.",
      },
      {
        kind: "body",
        text: "I know that a relationship cannot survive on memories alone. It needs understanding, respect, trust, communication and effort from both people.",
      },
      { kind: "body", text: "And I want to become better at giving those things." },
      { kind: "body", text: "I don't want to be someone who makes beautiful promises today and forgets them tomorrow." },
      { kind: "body", text: "I want to listen when you're upset instead of immediately defending myself." },
      { kind: "body", text: "I want to understand your silence instead of making assumptions." },
      { kind: "body", text: "I want to communicate instead of allowing misunderstandings to grow." },
      { kind: "body", text: "I want to respect your feelings even when I see things differently." },
      { kind: "body", text: "And most importantly, I want my actions to make you feel that you matter." },
      { kind: "emphasis", text: "Bacha, I still choose you in my heart." },
      {
        kind: "body",
        text: "I still want to share silly conversations, random updates, little celebrations, dreams, plans and all those ordinary moments that become extraordinary when shared with the right person.",
      },
      { kind: "body", text: "I still want to see us grow, learn and become better together." },
      { kind: "body", text: "I cannot promise that I will never make another mistake. That wouldn't be honest." },
      {
        kind: "body",
        text: "But I can promise that I will take responsibility, keep learning, listen more carefully and make a genuine effort not to repeat the things that have hurt you.",
      },
      { kind: "body", text: "I don't expect everything to become normal in one day." },
      { kind: "body", text: "I don't expect you to forget everything after reading this." },
      { kind: "body", text: "I don't even expect an immediate answer." },
      { kind: "body", text: "I am only asking you one thing." },
      {
        kind: "emphasis",
        text: "If there is still a little space in your heart for us, would you consider giving our relationship one more chance?",
      },
      { kind: "body", text: "A chance to talk honestly." },
      { kind: "body", text: "A chance to understand each other again." },
      { kind: "body", text: "A chance to rebuild what has been hurt, slowly, patiently and with genuine effort." },
      {
        kind: "body",
        text: "I don't want a relationship where one person keeps asking and the other keeps hurting.",
      },
      {
        kind: "body",
        text: "I want a relationship where both of us feel loved, respected, understood and safe enough to be ourselves.",
      },
      { kind: "body", text: "I want to earn back your trust rather than simply ask you to give it to me." },
      { kind: "body", text: "And if you need time, I will respect that." },
      { kind: "body", text: "If you want to tell me everything that hurt you, I will listen." },
      { kind: "body", text: "If you have questions, I will answer honestly." },
      {
        kind: "body",
        text: "If you need space, I won't turn that into another reason to pressure you.",
      },
      {
        kind: "body",
        text: "You are my Bacha. And you mean so much more to me than I have sometimes managed to show.",
      },
      {
        kind: "body",
        text: "Thank you for every beautiful memory, every smile, every conversation and every moment you have shared with me.",
      },
      { kind: "body", text: "Whatever happens next, I hope you never doubt that I genuinely valued our story." },
      { kind: "body", text: "But if you are willing, I would love for this not to be the end of it." },
      { kind: "body", text: "I would love for us to write a better chapter." },
      {
        kind: "body",
        text: "One with fewer assumptions, more understanding, less ego, more patience, fewer hurtful reactions and a whole lot more genuine love.",
      },
      { kind: "emphasis", text: "I love you, Bacha." },
      {
        kind: "body",
        text: "And I am truly sorry for the ways I haven't always shown that love the way you deserved.",
      },
      { kind: "signoff", text: "With all my heart," },
      { kind: "signature", text: "Mohan ❤️" },
      {
        kind: "dedication",
        text: "18 September 2023 — and every beautiful possibility that may still lie ahead.",
      },
    ],
  },

  commitments: {
    heading: "Love deserves more than promises.",
    items: [
      {
        number: "01",
        title: "Listen before reacting.",
        description: "Your feelings deserve to be heard before I defend my own.",
      },
      {
        number: "02",
        title: "Understand instead of assuming.",
        description: "I want to ask, listen and understand rather than jump to conclusions.",
      },
      {
        number: "03",
        title: "Communicate honestly.",
        description: "No unnecessary silence or allowing misunderstandings to grow.",
      },
      {
        number: "04",
        title: "Respect your feelings.",
        description: "Even when we disagree, your feelings matter.",
      },
      {
        number: "05",
        title: "Take responsibility.",
        description: "No excuses when I get something wrong.",
      },
      {
        number: "06",
        title: "Show consistency.",
        description: "Let my everyday actions support the promises I make.",
      },
    ],
    closing: [
      "I don't expect you to believe every word just because I wrote it beautifully.",
      "I want my actions to become the reason you can trust my words again.",
    ],
  },

  music: {
    heading: "Our Songs",
    subtitle: "Three songs that live in this story. Press play only if you want to.",
    defaultVolume: 0.35,
    tracks: [
      {
        id: "khat",
        title: "Khat",
        artist: "Navjot Ahuja",
        src: "https://ik.imagekit.io/Myimage/Navjot%20Ahuja%20-%20Khat%20(Official%20Audio).mp3",
      },
      {
        id: "faasle",
        title: "Faasle",
        artist: "Kaavish & Quratulain Balouch — Coke Studio Season 10",
        src: "https://ik.imagekit.io/Myimage/Coke%20Studio%20Season%2010%20Faasle%20Kaavish%20&%20Quratulain%20Balouch.mp3",
      },
      {
        id: "alfaaz",
        title: "Alfaaz",
        artist: "Hamza Malik, Zain Ali",
        src: "https://ik.imagekit.io/Myimage/Alfaaz%20-%20Hamza%20Malik,%20Zain%20Ali%20Lyrics.mp3",
      },
    ],
  },

  final: {
    heading: "One question from my heart...",
    paragraphs: [
      "I know I cannot ask you to forget everything.",
      "I cannot change the past.",
      "But if there is still a part of you that believes we could do things differently, I would love the opportunity to try again.",
      "Not by repeating the same mistakes.",
      "Not by expecting you to carry everything.",
      "But by learning, listening, understanding and choosing each other with more care.",
    ],
    question: "Would you be open to giving us another chance to rebuild, slowly and honestly?",
    options: [
      {
        value: "yes",
        label: "Yes, I want us to try again ❤️",
        helper: "We rebuild together, slowly.",
      },
      {
        value: "time",
        label: "I need some time to think.",
        helper: "I will respect the space you need.",
      },
      {
        value: "talk",
        label: "I want to talk to you first.",
        helper: "We can speak whenever you're ready.",
      },
      {
        value: "no",
        label: "I don't think I can continue this relationship.",
        helper: "I will hear you and respect it fully.",
      },
    ],
    messagePrompt: "Whatever is in your heart, you can tell me here. I will listen.",
    messageMaxLength: 3000,
    sendLabel: "Send my response",
    skipMessageLabel: "Skip writing a message",
    thankYou: [
      "Thank you for being honest with me.",
      "I will respect what you have shared.",
      "Your feelings matter, and I appreciate you taking the time to read this.",
    ],
    writeMoreLabel: "I would like to share something more",
    acknowledgementByResponse: {
      yes: "Thank you for being honest with me. I will respect what you have shared. Your feelings matter, and I appreciate you taking the time to read this.",
      time: "Thank you for being honest with me. I will respect what you have shared. Your feelings matter, and I appreciate you taking the time to read this. Take all the time you need — I will be here, patiently.",
      talk: "Thank you for being honest with me. I will respect what you have shared. Your feelings matter, and I appreciate you taking the time to read this. Whenever you're ready to talk, I will listen.",
      no: "Thank you for being honest with me. I will respect what you have shared, completely. Your feelings matter, and I appreciate you taking the time to read this. I will not pressure you — your decision is heard, and it is respected.",
    },
  },

  notification: {
    subject: "Bacha has responded to your letter ❤️",
    ownerDashboardPath: "/owner",
  },
};
