export type Tier = 'mortal' | 'hero' | 'demigod' | 'olympian' | 'primordial'

export interface AchievementDef {
  id: string
  name: string
  description: string
  tier: Tier
  hint: string
  icon: string
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // Tier I — Mortal
  {
    id: 'curious_mind',
    name: 'Curious Mind',
    description: 'Opened DevTools and peeked behind the curtain.',
    tier: 'mortal', hint: 'The first door is the one beneath your fingers. Three keys, top row, right side.',
    icon: '🔍',
  },
  {
    id: 'konami',
    name: 'Old Cheat Codes Never Die',
    description: 'Entered the sacred sequence of a bygone era.',
    tier: 'mortal', hint: 'An ancient rhythm known only to those who grew up with arrows and buttons.',
    icon: '🎮',
  },
  {
    id: 'persistent_mortal',
    name: 'Persistent Mortal',
    description: 'Clicked the logo 7 times in 3 seconds. Dedication.',
    tier: 'mortal', hint: 'The centerpiece bears watching. Seven touches, three heartbeats.',
    icon: '👆',
  },
  {
    id: 'mouse_tracker',
    name: 'The Long Way Around',
    description: 'Moved your cursor over 5000 pixels on the page.',
    tier: 'mortal', hint: 'Every inch of this place leaves a trace. Five thousand of them, to be precise.',
    icon: '🖱️',
  },
  {
    id: 'double_tap',
    name: 'Double Tap',
    description: 'Tapped the same key twice in rapid succession.',
    tier: 'mortal', hint: 'Impatience has its virtues. Strike twice before the echo fades.',
    icon: '⚡',
  },
  {
    id: 'bat_signal',
    name: 'Bat Signal',
    description: 'Clicked the safety beacon 5 times. Someone answered.',
    tier: 'mortal', hint: 'The golden dot pulses for a reason. It\'s waiting to be acknowledged.',
    icon: '🚨',
  },
  {
    id: 'sleeper_agent',
    name: 'Sleeper Agent',
    description: 'Stayed on the page for over 60 seconds without interacting.',
    tier: 'mortal', hint: 'Stillness is its own kind of action. Wait long enough and the walls speak.',
    icon: '💤',
  },
  {
    id: 'seeker_of_titles',
    name: 'Seeker of Titles',
    description: 'Held your gaze on the hero name long enough to earn an epithet.',
    tier: 'mortal', hint: 'Some names reveal themselves only to those patient enough to stare.',
    icon: '🏛️',
  },
  {
    id: 'descent_to_hades',
    name: 'Descent to Hades',
    description: 'Scrolled past the end of the world into the void.',
    tier: 'mortal', hint: 'The story doesn\'t end at the footer. Keep falling.',
    icon: '💀',
  },
  {
    id: 'heeded_the_call',
    name: 'Heeded the Call',
    description: 'Left the site, then returned. The Oracle noticed.',
    tier: 'mortal', hint: 'The Oracle notices when you come and go. Try leaving.',
    icon: '🔮',
  },

  // Tier II — Hero
  {
    id: 'trespasser',
    name: 'Trespasser of Olympus',
    description: 'Found the unlisted path to Olympus.',
    tier: 'hero', hint: 'Mountains have paths not marked on any map.',
    icon: '⚡',
  },
  {
    id: 'invoke_zeus',
    name: 'Invoke Zeus',
    description: 'Defied the mortal law of context menus.',
    tier: 'hero', hint: 'The gods punish those who defy sacred traditions.',
    icon: '🌩️',
  },
  {
    id: 'word_of_power',
    name: 'Word of Power',
    description: 'Spoke the forbidden word: olympus.',
    tier: 'hero', hint: 'Speak the name of the mountain where gods dwell.',
    icon: '📜',
  },
  {
    id: 'full_circle',
    name: 'Full Circle',
    description: 'Rotated a 3D object a full 360 degrees in one drag.',
    tier: 'hero', hint: 'A gesture of completion. Close the loop with your finger.',
    icon: '🔄',
  },
  {
    id: 'athenas_owl',
    name: 'Athena\'s Owl',
    description: 'Found the hidden owl in the 3D scene.',
    tier: 'hero', hint: 'A wise companion hides in plain sight, waiting to be acknowledged.',
    icon: '🦉',
  },
  {
    id: 'between_worlds',
    name: 'Between Worlds',
    description: 'Resized to the sacred width — exactly 999px.',
    tier: 'hero', hint: 'Windows to other dimensions open at very specific widths.',
    icon: '📐',
  },
  {
    id: 'child_of_night',
    name: 'Child of Night',
    description: 'Visited between midnight and 1am.',
    tier: 'hero', hint: 'The deepest secrets come out when the witching hour strikes.',
    icon: '🌙',
  },
  {
    id: 'inscribed_in_stone',
    name: 'Inscribed in Stone',
    description: 'Printed the page to reveal a hidden inscription.',
    tier: 'hero', hint: 'What the screen shows is temporary. The paper remembers.',
    icon: '🗿',
  },
  {
    id: 'red_pill',
    name: 'Red Pill',
    description: 'Followed the rabbit hole into The Matrix.',
    tier: 'hero', hint: 'The truth is out there. A certain rabbit hole awaits.',
    icon: '🟡',
  },
  {
    id: 'echo_chamber',
    name: 'Echo Chamber',
    description: 'Found the reflection chamber at /echo.',
    tier: 'hero', hint: 'Your voice bounces back if you know where to listen.',
    icon: '🔁',
  },
  {
    id: 'code_master',
    name: 'Code Master',
    description: 'Spoke the secret incantation in the developer console.',
    tier: 'hero', hint: 'The console hears everything. Greet it properly.',
    icon: '💻',
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Visited between 2am and 3am.',
    tier: 'hero', hint: 'The hour between wolf and dog holds ancient power.',
    icon: '🦉',
  },
  {
    id: 'pixel_perfect',
    name: 'Pixel Perfect',
    description: 'Resized your window to exactly 1440 pixels wide.',
    tier: 'hero', hint: 'Designers worship a sacred width. The perfect canvas awaits.',
    icon: '📏',
  },
  {
    id: 'lighthouse',
    name: 'The Lighthouse',
    description: 'Found the guiding light at /lighthouse.',
    tier: 'hero', hint: 'A beacon guides lost souls. Follow the light.',
    icon: '🗼',
  },
  {
    id: 'into_the_abyss',
    name: 'Into the Abyss',
    description: 'Stared into the void at /abyss and it stared back.',
    tier: 'hero', hint: 'The void awaits those brave enough to face it.',
    icon: '🕳️',
  },

  // Tier III — Demigod
  {
    id: 'riddle_of_the_sphinx',
    name: 'Riddle of the Sphinx',
    description: 'Solved the riddle hidden in the source.',
    tier: 'demigod', hint: 'What speaks without a mouth? The answer lies in the bones of this page.',
    icon: '🐉',
  },
  {
    id: 'whispers_in_the_wire',
    name: 'Whispers in the Wire',
    description: 'Noticed a blessing hidden in the network response.',
    tier: 'demigod', hint: 'The gods send blessings through invisible channels. Watch the wires.',
    icon: '📡',
  },
  {
    id: 'forbidden_knowledge',
    name: 'Forbidden Knowledge',
    description: 'Read robots.txt and visited what was disallowed.',
    tier: 'demigod', hint: 'A file tells crawlers where not to go. You are no crawler.',
    icon: '📖',
  },
  {
    id: 'codebreaker',
    name: 'Codebreaker',
    description: 'Decoded a hidden message in localStorage.',
    tier: 'demigod', hint: 'The browser keeps whispered secrets in a hidden vault. Decode what is stored.',
    icon: '🔐',
  },
  {
    id: 'delta_of_the_gods',
    name: 'Delta of the Gods',
    description: 'Drew a perfect triangle with your cursor.',
    tier: 'demigod', hint: 'Three points, three lines, one sacred shape. Draw it with intent.',
    icon: '📐',
  },
  {
    id: 'stargazer',
    name: 'Stargazer',
    description: 'Arranged the floating points into a constellation.',
    tier: 'demigod', hint: 'Three stars drift across the void. Collect what shines.',
    icon: '⭐',
  },
  {
    id: 'fire_bringer',
    name: 'The Fire Bringer',
    description: 'Whispered the titan\'s name into the contact form.',
    tier: 'demigod', hint: 'A titan\'s name, whispered in the first field, awakens ancient fire.',
    icon: '🔥',
  },
  {
    id: 'wanderers_path',
    name: 'The Wanderer\'s Path',
    description: 'Visited every page on the site.',
    tier: 'demigod', hint: 'Every corner of this realm holds a piece of the map. Leave no path untaken.',
    icon: '🗺️',
  },
  {
    id: 'sigil_gate',
    name: 'Sigil Gate',
    description: 'Activated all four hidden sigils in the correct order.',
    tier: 'demigod', hint: 'Four pages hide a mark. Creation, Wisdom, Craft, Communion — in that sacred order.',
    icon: '🚪',
  },
  {
    id: 'panta_rhei',
    name: 'Panta Rhei',
    description: 'Scrolled to the exact midpoint of the page.',
    tier: 'demigod', hint: 'Everything flows. Find the still point at the center of the stream.',
    icon: '🌊',
  },
  {
    id: 'hermetic_message',
    name: 'Hermetic Message',
    description: 'Whispered a sacred word through the contact form.',
    tier: 'demigod', hint: 'What is above is like what is below. The ancient axiom unlocks the gate.',
    icon: '🪶',
  },
  {
    id: 'golden_touch',
    name: 'Golden Touch',
    description: 'Clicked 100 times on the page.',
    tier: 'demigod', hint: 'One hundred affirmations. Everything you touch turns to gold.',
    icon: '✨',
  },
  {
    id: 'triple_threat',
    name: 'Triple Threat',
    description: 'Entered the Konami code three times in one session.',
    tier: 'demigod', hint: 'Thrice the charm. Old habits die hard, die hard, die hard.',
    icon: '🎯',
  },
  {
    id: 'silent_type',
    name: 'Silent Type',
    description: 'Typed "silence" anywhere on the page.',
    tier: 'demigod', hint: 'The loudest message is one never spoken. Type the absence of noise.',
    icon: '🤫',
  },

  // Tier IV — Olympian
  {
    id: 'pantheon_key',
    name: 'The Pantheon Key',
    description: 'Found and activated 4 hidden sigils in the correct order.',
    tier: 'olympian', hint: 'Four sigils await activation in an order dictated by the builder\'s path. The pattern reveals itself to the patient.',
    icon: '🔱',
  },
  {
    id: 'devotee',
    name: 'Devotee',
    description: 'Returned on 3 different days.',
    tier: 'olympian', hint: 'The gods reward those who return. Three dawns must witness your presence.',
    icon: '🙏',
  },
  {
    id: 'double_invocation',
    name: 'Double Invocation',
    description: 'Triggered both the Konami code and the Word of Power in one session.',
    tier: 'olympian', hint: 'Two ancient rituals in one breath. The arrow dance and the mountain\'s name must share the same dawn.',
    icon: '⚡',
  },
  {
    id: 'trojan_horse',
    name: 'Beware of Greeks Bearing Gifts',
    description: 'Found the hidden horse in the 3D scene.',
    tier: 'olympian', hint: 'A gift hides within the form. Find what should not be there.',
    icon: '🐴',
  },
  {
    id: 'blessed_by_machines',
    name: 'Blessed by the Machines',
    description: 'Got audited by Lighthouse.',
    tier: 'olympian', hint: 'Let the automated eye judge this realm. Its blessing is mechanical.',
    icon: '🤖',
  },
  {
    id: 'slayer_of_minotaur',
    name: 'Slayer of the Minotaur',
    description: 'Navigated the console labyrinth and escaped.',
    tier: 'olympian', hint: 'A labyrinth lives in the console. Navigate it. Survive it. Conquer it.',
    icon: '🗡️',
  },
  {
    id: 'polymath',
    name: 'Polymath',
    description: 'Opened all three secret chambers in one session.',
    tier: 'olympian', hint: 'Three secret chambers, one pilgrimage. The Echo, the Signal, and the Codex must share a single journey.',
    icon: '🎭',
  },
  {
    id: 'mnemosyne',
    name: 'Mnemosyne',
    description: 'Remembered and re-entered the answer to the riddle.',
    tier: 'olympian', hint: 'Memory is the key. The answer to the riddle, revisited as a path.',
    icon: '🧠',
  },

  // Tier V — Primordial
  {
    id: 'ascension',
    name: 'Ascension',
    description: 'Unlocked every other achievement.',
    tier: 'primordial', hint: 'Collect all that came before. The final door opens only when nothing else remains.',
    icon: '👑',
  },
  {
    id: 'eye_of_providence',
    name: 'Eye of Providence',
    description: 'Decoded the steganographic message in the OG image.',
    tier: 'primordial', hint: 'The preview image holds a secret. Read between the pixels, decode the hex.',
    icon: '🕱',
  },
  {
    id: 'apotheosis',
    name: 'Apotheosis',
    description: 'Unlocked 45 or more achievements.',
    tier: 'primordial', hint: 'Forty-five feats recorded. Near-divinity awaits the devoted.',
    icon: '🌟',
  },
  {
    id: 'omega',
    name: 'Omega',
    description: 'Found the final secret. The end is the beginning.',
    tier: 'primordial', hint: 'When you have collected everything, look again at the beginning.',
    icon: '☯️',
  },
]

export const TIER_ORDER: Tier[] = ['mortal', 'hero', 'demigod', 'olympian', 'primordial']

export const TIER_LABELS: Record<Tier, string> = {
  mortal: 'Mortal',
  hero: 'Hero',
  demigod: 'Demigod',
  olympian: 'Olympian',
  primordial: 'Primordial',
}

export const TIER_COLORS: Record<Tier, string> = {
  mortal: 'text-zinc-500',
  hero: 'text-blue-400',
  demigod: 'text-purple-400',
  olympian: 'text-amber-400',
  primordial: 'text-rose-400',
}

export const TIER_BG: Record<Tier, string> = {
  mortal: 'border-zinc-800 bg-zinc-900/40',
  hero: 'border-blue-900/50 bg-blue-950/30',
  demigod: 'border-purple-900/50 bg-purple-950/30',
  olympian: 'border-amber-900/50 bg-amber-950/30',
  primordial: 'border-rose-900/50 bg-rose-950/30',
}

export function rankFromCount(count: number): { title: string; tier: Tier } {
  if (count >= 48) return { title: 'Transcendent', tier: 'primordial' }
  if (count >= 42) return { title: 'Primordial', tier: 'primordial' }
  if (count >= 35) return { title: 'Olympian', tier: 'olympian' }
  if (count >= 25) return { title: 'Demigod', tier: 'demigod' }
  if (count >= 12) return { title: 'Hero', tier: 'hero' }
  return { title: 'Mortal', tier: 'mortal' }
}

export const ACHIEVEMENT_MAP = new Map<string, AchievementDef>(
  ACHIEVEMENTS.map(a => [a.id, a])
)

export const STORAGE_KEY = 'myths-portfolio:achievements'
export const WHISPER_KEY = 'myths-portfolio:whisper'
export const VISITED_PAGES_KEY = 'myths-portfolio:visited'
export const DEVOTEE_KEY = 'myths-portfolio:devotee'
export const SIGIL_KEY = 'myths-portfolio:sigils'
export const FINGERPRINT_KEY = 'myths-portfolio:visitor'
