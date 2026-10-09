// src/lib/relations.ts
var CHART_NODES = [
  // ——— PRESENT · Silla ———
  { id: "jinpyung", x: 40, y: 80, rank: 1, era: "present", gender: "m" },
  { id: "sunduk", x: 220, y: 80, rank: 3, era: "present", gender: "f" },
  { id: "jinduk", x: 400, y: 80, rank: 2, era: "present", gender: "f" },
  { id: "chunmyung", x: 40, y: 250, rank: 2, era: "present", gender: "f" },
  { id: "yushin", x: 220, y: 250, rank: 3, era: "present", gender: "m" },
  { id: "bidam", x: 400, y: 250, rank: 2, era: "present", gender: "m" },
  { id: "chunchu", x: 140, y: 440, rank: 3, era: "present", gender: "m" },
  { id: "munhee", x: 340, y: 440, rank: 2, era: "present", gender: "f" },
  { id: "bohee", x: 500, y: 380, rank: 1, era: "present", gender: "f" },
  { id: "gotaso", x: 140, y: 620, rank: 2, era: "present", gender: "f" },
  { id: "pumsuk", x: 340, y: 620, rank: 2, era: "present", gender: "m" },
  { id: "gumilwife", x: 520, y: 620, rank: 1, era: "present", gender: "f" },
  { id: "gumil", x: 520, y: 760, rank: 1, era: "present", gender: "m" },
  { id: "munmu", x: 40, y: 620, rank: 2, era: "present", gender: "m" },
  { id: "jayi", x: -40, y: 700, rank: 2, era: "present", gender: "f" },
  { id: "seonpum", x: -120, y: 620, rank: 1, era: "present", gender: "m" },
  { id: "inmun", x: 40, y: 760, rank: 1, era: "present", gender: "m" },
  { id: "alchun", x: 220, y: 780, rank: 1, era: "present", gender: "m" },
  { id: "gwanchang", x: 380, y: 780, rank: 1, era: "present", gender: "m" },
  // ——— PRESENT · Baekje ———
  { id: "euija", x: 820, y: 250, rank: 3, era: "present", gender: "m" },
  { id: "courtmaid", x: 1020, y: 250, rank: 1, era: "present", gender: "f" },
  { id: "ungo", x: 920, y: 160, rank: 1, era: "present", gender: "f" },
  { id: "gyebek", x: 720, y: 440, rank: 2, era: "present", gender: "m" },
  { id: "seongchung", x: 900, y: 440, rank: 1, era: "present", gender: "m" },
  { id: "heungsu", x: 980, y: 360, rank: 1, era: "present", gender: "m" },
  { id: "chunbok", x: 1060, y: 440, rank: 1, era: "present", gender: "m" },
  { id: "queensatek", x: 720, y: 600, rank: 1, era: "present", gender: "f" },
  { id: "eldersatek", x: 620, y: 520, rank: 1, era: "present", gender: "m" },
  { id: "ministersatek", x: 620, y: 640, rank: 1, era: "present", gender: "m" },
  { id: "sateksondung", x: 540, y: 580, rank: 1, era: "present", gender: "m" },
  { id: "elderyunbi", x: 1140, y: 520, rank: 1, era: "present", gender: "m" },
  { id: "yunbihana", x: 1140, y: 640, rank: 1, era: "present", gender: "f" },
  { id: "yung", x: 820, y: 600, rank: 1, era: "present", gender: "m" },
  { id: "tae", x: 900, y: 600, rank: 1, era: "present", gender: "m" },
  { id: "hyo", x: 820, y: 700, rank: 1, era: "present", gender: "m" },
  { id: "yun", x: 900, y: 700, rank: 1, era: "present", gender: "m" },
  { id: "pung", x: 980, y: 700, rank: 1, era: "present", gender: "m" },
  { id: "yesikjin", x: 1060, y: 600, rank: 1, era: "present", gender: "m" },
  { id: "boksin", x: 980, y: 800, rank: 1, era: "present", gender: "m" },
  // ——— PRESENT · Goguryeo ———
  { id: "yeongnyu", x: 1380, y: 120, rank: 1, era: "present", gender: "m" },
  { id: "gesomun", x: 1380, y: 300, rank: 3, era: "present", gender: "m" },
  { id: "gulgul", x: 1560, y: 220, rank: 1, era: "present", gender: "m" },
  { id: "bojang", x: 1200, y: 300, rank: 2, era: "present", gender: "m" },
  { id: "yangmanchun", x: 1560, y: 300, rank: 2, era: "present", gender: "m" },
  { id: "jungto", x: 1200, y: 420, rank: 1, era: "present", gender: "m" },
  { id: "sooyoung", x: 1200, y: 520, rank: 1, era: "present", gender: "f" },
  { id: "namseng", x: 1380, y: 480, rank: 1, era: "present", gender: "m" },
  { id: "namgun", x: 1520, y: 520, rank: 1, era: "present", gender: "m" },
  { id: "namsan", x: 1460, y: 600, rank: 1, era: "present", gender: "m" },
  // ——— PRESENT · Tang ———
  { id: "taizong", x: 1780, y: 200, rank: 2, era: "present", gender: "m" },
  { id: "gaozong", x: 1780, y: 380, rank: 2, era: "present", gender: "m" },
  { id: "xuerengui", x: 1960, y: 300, rank: 2, era: "present", gender: "m" },
  { id: "xueliu", x: 2120, y: 300, rank: 1, era: "present", gender: "f" },
  { id: "sudingfang", x: 1780, y: 540, rank: 1, era: "present", gender: "m" },
  // ——— PAST · founders & flashbacks ———
  { id: "sosuno", x: 120, y: 1100, rank: 2, era: "past", gender: "f" },
  { id: "onjo", x: 300, y: 1100, rank: 2, era: "past", gender: "m" },
  { id: "biryu", x: 460, y: 1100, rank: 1, era: "past", gender: "m" },
  { id: "haemosu", x: 720, y: 1100, rank: 2, era: "past", gender: "m" },
  { id: "habek", x: 560, y: 1100, rank: 1, era: "past", gender: "m" },
  { id: "yuhwa", x: 900, y: 1100, rank: 2, era: "past", gender: "f" },
  { id: "jumong", x: 810, y: 1280, rank: 3, era: "past", gender: "m" },
  { id: "ladyye", x: 640, y: 1280, rank: 1, era: "past", gender: "f" },
  { id: "geumwa", x: 1040, y: 1180, rank: 1, era: "past", gender: "m" },
  { id: "daeso", x: 1040, y: 1320, rank: 1, era: "past", gender: "m" },
  { id: "yuri", x: 810, y: 1440, rank: 1, era: "past", gender: "m" },
  { id: "suro", x: 1380, y: 1100, rank: 2, era: "past", gender: "m" },
  { id: "heohwangok", x: 1580, y: 1100, rank: 2, era: "past", gender: "f" },
  // ——— MYTH ———
  { id: "hwanin", x: 100, y: 1580, rank: 2, era: "myth", gender: "m" },
  { id: "hwanung", x: 200, y: 1720, rank: 2, era: "myth", gender: "m" },
  { id: "ungnyeo", x: 400, y: 1720, rank: 2, era: "myth", gender: "f" },
  { id: "dangun", x: 300, y: 1900, rank: 2, era: "myth", gender: "m" },
  { id: "ibiga", x: 760, y: 1720, rank: 2, era: "myth", gender: "m" },
  { id: "jeonggyeon", x: 960, y: 1720, rank: 2, era: "myth", gender: "f" },
  { id: "daebyeol", x: 1080, y: 1580, rank: 2, era: "myth", gender: "m" },
  { id: "sobyeol", x: 1280, y: 1580, rank: 2, era: "myth", gender: "m" },
  { id: "yumla", x: 1180, y: 1720, rank: 2, era: "myth", gender: "m" },
  { id: "kangrim", x: 1080, y: 1900, rank: 1, era: "myth", gender: "m" },
  { id: "haewonmek", x: 1280, y: 1900, rank: 1, era: "myth", gender: "m" },
  { id: "sara", x: 1480, y: 1580, rank: 2, era: "myth", gender: "m" },
  { id: "jacheongbi", x: 1380, y: 1720, rank: 2, era: "myth", gender: "f" },
  { id: "mundoryeong", x: 1580, y: 1720, rank: 1, era: "myth", gender: "m" },
  { id: "sanbangdeok", x: 1580, y: 1900, rank: 1, era: "myth", gender: "f" },
  { id: "sulmun", x: 560, y: 1720, rank: 2, era: "myth", gender: "f" },
  { id: "mago", x: 40, y: 1720, rank: 1, era: "myth", gender: "f" },
  { id: "bari", x: 980, y: 1900, rank: 1, era: "myth", gender: "f" },
  { id: "heavenearthking", x: 1180, y: 1460, rank: 2, era: "myth", gender: "m" },
  { id: "chongmyeong", x: 1320, y: 1460, rank: 1, era: "myth", gender: "f" },
  { id: "yang_tamla", x: 680, y: 1900, rank: 1, era: "myth", gender: "m" },
  { id: "go_tamla", x: 800, y: 1900, rank: 1, era: "myth", gender: "m" },
  { id: "bu_tamla", x: 920, y: 1900, rank: 1, era: "myth", gender: "m" }
];
var RELATIONSHIPS = [
  {
    id: "rel-gotaso-pumsuk",
    name: "Gotaso & Pumsuk",
    korean: "\uACE0\uD0C0\uC18C \xB7 \uD488\uC11D",
    entity: "relationship",
    kingdom: "silla",
    bond: "love",
    between: ["gotaso", "pumsuk"],
    title: "A year of forever, then Daeya",
    tagline: "She named their children before he proposed. Then the fortress.",
    arc: "After Chunchu brings her home from the ford, Gotaso falls the way a girl of fifteen falls \u2014 completely. Gyuku, rain, forever. At Daeya the oath fails; both die, and the private injury becomes a war.",
    events: [
      { year: 641, label: "Taken; rescued; married; leave for Daeya." },
      { year: 642, label: "Die together when the fortress falls." }
    ],
    aliases: ["Gotaso & Pumsuk", "Pumsuk & Gotaso"]
  },
  {
    id: "rel-chunchu-munhee",
    name: "Chunchu & Munhee",
    korean: "\uCD98\uCD94 \xB7 \uBB38\uD76C",
    entity: "relationship",
    kingdom: "silla",
    bond: "love",
    between: ["chunchu", "munhee"],
    title: "The dream, the skirt, the torn coat",
    tagline: "She bought a drowned capital and sewed her way into a dynasty.",
    arc: "Munhee buys Bohee\u2019s dream for a silk skirt, then sews Chunchu\u2019s coat so slowly he cannot leave. Their marriage produces Bupmin and Gotaso \u2014 and the private heat of that sewing room sits under every political move Chunchu makes afterward.",
    events: [
      { year: 625, label: "The coat is torn; Munhee sews it standing close." },
      { label: "Married; parents of Bupmin and Gotaso." }
    ],
    aliases: ["Chunchu & Munhee", "Munhee & Chunchu"]
  },
  {
    id: "rel-munmu-jayi",
    name: "Bupmin & Jahee",
    korean: "\uBC95\uBBFC \xB7 \uC790\uD76C",
    entity: "relationship",
    kingdom: "silla",
    bond: "love",
    between: ["munmu", "jayi"],
    title: "Harbour ledgers, rain, a queen",
    tagline: "She corrected his sums. He kept her tide. The series\u2019 most successful romance.",
    arc: "Under Yushin\u2019s voluntary countryside posting as junior Pajinchan, Bupmin meets Jahee (\uC790\uD76C) \u2014 daughter of Councillor of Ocean Trade Kim Seonpum \u2014 in a K-drama of rain, brushes, and almost-kisses. The court later names her Queen Jayi (\uC790\uC758). Bone rank marries them cleanly later; the harbour married them first. Unlike the tragic and half-finished loves around them, they finish as political partners: queen and king still arguing tide tables when Samhan is finally one.",
    events: [
      { year: 644, label: "Meet over ocean ledgers at the quay." },
      { year: 661, label: "She becomes Queen Jayi when he takes the throne." },
      { year: 676, label: "Stand together as the harbour lesson crowned." }
    ],
    aliases: ["Bupmin & Jahee", "Bupmin & Jayi", "Munmu & Jahee", "Munmu & Jayi", "Jayi & Bupmin", "Jahee & Bupmin"]
  },
  {
    id: "rel-yushin-sunduk",
    name: "Yushin & Sunduk",
    korean: "\uC720\uC2E0 \xB7 \uC120\uB355",
    entity: "relationship",
    kingdom: "silla",
    bond: "love",
    between: ["yushin", "sunduk"],
    dynamic: { en: "A love that cannot be \u2014 mutual, aching, wanting", ko: "\uC774\uB8E8\uC5B4\uC9C8 \uC218 \uC5C6\uB294 \uC0AC\uB791 \u2014 \uC11C\uB85C \uC0AC\uB791\uD558\uACE0, \uC11C\uB85C \uC6D0\uD558\uB294" },
    still: "rel-sunduk-yushin",
    title: "The love that could not be crowned",
    tagline: "He would have burned the country for her. She stops him herself.",
    arc: "Sacred Bone cannot marry True Bone and keep the succession. Sunduk becomes queen; Yushin stays the marshal who would have been her husband in another life. When he finally says it out loud, it is she \u2014 not her sister \u2014 who names the cost, and chooses the throne over the man.",
    events: [
      { label: "Childhood romance thwarted by bone rank." },
      { year: 632, label: "She takes the throne; he takes the army." },
      { year: 641, label: "She stops him. Mercedes theme." }
    ],
    aliases: ["Yushin & Sunduk", "Sunduk & Yushin"]
  },
  {
    id: "rel-pumsuk-gumilwife",
    name: "Pumsuk & Maehwa",
    korean: "\uD488\uC11D \xB7 \uB9E4\uD654",
    entity: "relationship",
    kingdom: "silla",
    bond: "affair",
    between: ["pumsuk", "gumilwife"],
    title: "The feast that burns three kingdoms",
    tagline: "A capital boy meets a woman who already knows what he wants.",
    arc: "Pumsuk is Surabol-bred and still young enough to be startled by her. Maehwa does not startle. What passes between them at the feast is mostly unspoken \u2014 and enough. Gumil opens the gates. Everything after runs through that room.",
    events: [{ year: 642, label: "The feast; the gates open." }],
    aliases: ["Pumsuk & Maehwa", "Maehwa & Pumsuk", "Pumsuk & Yehwa", "Yehwa & Pumsuk", "Pumsuk & Gumil\u2019s Wife", "Gumil\u2019s Wife & Pumsuk", "Pumsuk & Geomil\u2019s Wife"]
  },
  {
    id: "rel-euija-maids",
    name: "Euija & the Court Maids",
    korean: "\uC758\uC790 \xB7 \uAD81\uB140",
    entity: "relationship",
    kingdom: "baekje",
    bond: "love",
    between: ["euija", "courtmaid"],
    title: "Two, then hundreds, then the cliffs",
    tagline: "They never stop suggesting. By the end he stops refusing.",
    arc: "He begins with two. They keep arriving. By his descent they number in the hundreds, and they talk while he tries to rule \u2014 until he stops trying. At the Flower Cliffs they jump rather than be taken.",
    events: [
      { year: 641, label: "Two." },
      { year: 656, label: "Hundreds; the country is no longer the point." },
      { year: 660, label: "Falling Flowers." }
    ],
    aliases: ["Euija & the Court Maids", "Court Maids & Euija"]
  },
  {
    id: "rel-haemosu-yuhwa",
    name: "Haemosu & Yuhwa",
    korean: "\uD574\uBAA8\uC218 \xB7 \uC720\uD654",
    entity: "relationship",
    kingdom: "goguryeo",
    bond: "love",
    between: ["haemosu", "yuhwa"],
    title: "Heaven stops the chariot",
    tagline: "She bathed naked in the Ubal; he came down the same afternoon \u2014 and came again for her soul.",
    arc: "The sun god crosses the sky every day and stops once. Yuhwa does not hide. He builds a copper room on the bank because waiting has become unbearable. Habek casts her out; Geumwa takes her in; Jumong is born of that heat. When she dies he does not send a reaper. He comes himself. She keeps the night as moon.",
    events: [
      { label: "The Ubal; the copper room; the egg." },
      { label: "He takes her soul; she becomes goddess of the moon." }
    ],
    aliases: ["Haemosu & Yuhwa", "Yuhwa & Haemosu"]
  },
  {
    id: "rel-jumong-sosuno",
    name: "Jumong & Sosuno",
    korean: "\uC8FC\uBABD \xB7 \uC18C\uC11C\uB178",
    entity: "relationship",
    kingdom: "goguryeo",
    bond: "love",
    between: ["jumong", "sosuno"],
    dynamic: { en: "Laid-back, charming king \xB7 doting, hot-blooded, clingy tsundere queen", ko: "\uB290\uAE0B\uD558\uACE0 \uB9E4\uB825\uC801\uC778 \uC655 \xB7 \uD5CC\uC2E0\uC801\uC774\uACE0 \uB728\uAC81\uACE0 \uC9D1\uCC29\uD558\uB294 \uCE24\uB370\uB808 \uC655\uBE44" },
    still: "rel-jumong-sosuno",
    title: "Ledger and longing",
    tagline: "She priced the marriage; he could not count grain for looking at her.",
    arc: "Sosuno buys Jumong a kingdom with her father\u2019s routes. At night the war-talk thins and he asks her to close the ledger. Twenty years later a first wife arrives from Buyeo; Sosuno walks south and founds Baekje instead.",
    events: [
      { year: -37, label: "Goguryeo founded at Jolbon." },
      { year: -18, label: "Sosuno leaves with her sons; Baekje begins." }
    ],
    aliases: ["Jumong & Sosuno", "Sosuno & Jumong"]
  },
  {
    id: "rel-suro-heo",
    name: "Suro & Queen Heo",
    korean: "\uC218\uB85C \xB7 \uD5C8\uD669\uC625",
    entity: "relationship",
    kingdom: "gaya",
    bond: "love",
    between: ["suro", "heohwangok"],
    title: "The red-sailed ship",
    tagline: "He walked down himself \u2014 and could barely keep his hands away.",
    arc: "She arrives foreign, luminous, already dreaming of him. He fails at looking politely. Two nights in a tent before anyone may say marriage; by the second dusk he can barely keep his voice steady. A hundred and fifty years; ten sons; two carry her name.",
    events: [
      { year: 48, label: "She arrives; he comes down to the shore." },
      { label: "Married a hundred and fifty years." }
    ],
    aliases: ["Suro & Queen Heo", "Queen Heo & Suro", "Suro & Heo"]
  },
  {
    id: "rel-ibiga-jeonggyeon",
    name: "Ibiga & the Lady of the Right View",
    korean: "\uC774\uBE44\uAC00 \xB7 \uC815\uACAC\uBAA8\uC8FC",
    entity: "relationship",
    kingdom: "gaya",
    bond: "love",
    between: ["ibiga", "jeonggyeon"],
    title: "Heaven on the ridge",
    tagline: "Sky came down to touch the mountain \u2014 and stayed until morning.",
    arc: "Before the eggs, before the six kingdoms, a sky god kneels on a mountain goddess and admits his thoughts are no longer rightful. From that heat come Suro and Ijinasi.",
    events: [{ label: "The ridge night; two sons; the eggs of Gaya." }],
    aliases: ["Ibiga & Lady of the Right View", "Ibiga & Jeonggyeon"]
  },
  {
    id: "rel-hwanung-ungnyeo",
    name: "Hwanung & Ungnyeo",
    korean: "\uD658\uC6C5 \xB7 \uC6C5\uB140",
    entity: "relationship",
    kingdom: "joseon",
    bond: "love",
    between: ["hwanung", "ungnyeo"],
    title: "Garlic, mugwort, and the sacred tree",
    tagline: "She stood on his path. He lost the seal under her head.",
    arc: "The bear lasts twenty-one days and then stands under the birch on the way to the hall. He means to walk past. She tells him not to come closer and pulls him down anyway. In the morning the seal is under her hair, and their son is Dangun.",
    events: [{ label: "Marriage under the tree; Dangun is born." }],
    aliases: ["Hwanung & Ungnyeo", "Ungnyeo & Hwanung"]
  },
  {
    id: "rel-gesomun-gulgul",
    name: "Yeon & Gulgul",
    korean: "\uC5F0\uAC1C\uC18C\uBB38 \xB7 \uAC78\uAC78",
    entity: "relationship",
    kingdom: "goguryeo",
    bond: "kin",
    between: ["gesomun", "gulgul"],
    title: "The Mohe boy from the snow",
    tagline: "Rescued young; raised in Pyongyang; sent north.",
    arc: "Yeon brings a Mohe boy out of a border raid and keeps him. Gulgul grows into the quiet guard of the northern marches \u2014 seldom seen at court, always where the cold is \u2014 and when Yeon posts him north he gives him the surname Dae. Later ages will call his son Dae Joyoung.",
    events: [
      { year: 634, label: "Taken in; named Gulgul." },
      { year: 642, label: "Given the surname Dae; posted north." }
    ],
    aliases: ["Yeon & Gulgul", "Gesomun & Gulgul"]
  },
  {
    id: "rel-jacheongbi-mundoryeong",
    name: "Jacheongbi & Mun Doryeong",
    korean: "\uC790\uCCAD\uBE44 \xB7 \uBB38\uB3C4\uB839",
    entity: "relationship",
    kingdom: "tamla",
    bond: "love",
    between: ["jacheongbi", "mundoryeong"],
    title: "Three years at the same desk",
    tagline: "She cut her hair to study beside him \u2014 then made him look.",
    arc: "Disguised as a boy for three years, she beats him at everything and lets him think it was close. At the parting stream she washes upstream and tells him to see. Heaven kills him for loving her; she walks to the underworld and puts him back together.",
    events: [{ label: "The haircut; the stream; the resurrection flower." }],
    aliases: ["Jacheongbi & Mun Doryeong", "Jacheongbi & Mundoryeong"]
  },
  {
    id: "rel-chunchu-euija",
    name: "Chunchu & Euija",
    korean: "\uCD98\uCD94 \xB7 \uC758\uC790",
    entity: "relationship",
    kingdom: "silla",
    bond: "rival",
    between: ["chunchu", "euija"],
    title: "Revenge and the poured cup",
    tagline: "One private injury; eighteen years; a king made to pour wine.",
    arc: "Gotaso\u2019s death at Daeya makes Chunchu patient. Euija\u2019s manufactured miracles become the omen-war that hollows Baekje. At Sabi, Muyeol makes Euija pour his wine. Neither ever stops calling the other a wretch.",
    events: [
      { year: 642, label: "Daeya falls; the vow of revenge." },
      { year: 660, label: "Sabi; the poured cup." }
    ],
    aliases: ["Chunchu & Euija", "Euija & Chunchu"]
  },
  {
    id: "rel-chunchu-yushin",
    name: "Chunchu & Yushin",
    korean: "\uCD98\uCD94 \xB7 \uC720\uC2E0",
    entity: "relationship",
    kingdom: "silla",
    bond: "sworn",
    between: ["chunchu", "yushin"],
    title: "Brother-in-law and marshal",
    tagline: "Politics and the sword \u2014 one house, two careers.",
    arc: "Yushin is Munhee\u2019s brother and Chunchu\u2019s closest blade. Together they survive Bidam, win Tang, and finish Baekje. The private cost is Gotaso; the public reward is a True Bone throne.",
    events: [{ year: 660, label: "Sabi falls under their joint design." }],
    aliases: ["Chunchu & Yushin", "Yushin & Chunchu"]
  },
  {
    id: "rel-sunduk-chunmyung",
    name: "Sunduk & Chunmyung",
    korean: "\uC120\uB355 \xB7 \uCC9C\uBA85",
    entity: "relationship",
    kingdom: "silla",
    bond: "kin",
    between: ["sunduk", "chunmyung"],
    title: "The sister who chose love",
    tagline: "One took the throne; one took Chunchu\u2019s father.",
    arc: "Chunmyung forfeits the succession for love; Sunduk becomes queen. Watching Gotaso marry for love, Sunduk names the pattern across three generations \u2014 all but herself.",
    events: [{ year: 632, label: "Sunduk crowned; Chunmyung\u2019s son waits in the wings." }],
    aliases: ["Sunduk & Chunmyung"]
  },
  {
    id: "rel-chunchu-gotaso",
    name: "Chunchu & Gotaso",
    korean: "\uCD98\uCD94 \xB7 \uACE0\uD0C0\uC18C",
    entity: "relationship",
    kingdom: "silla",
    bond: "kin",
    between: ["chunchu", "gotaso"],
    title: "Father and daughter",
    tagline: "He made Pumsuk swear; he spent eighteen years collecting the debt.",
    arc: "Gotaso\u2019s death at Daeya is the private wound that turns diplomat into avenger. Every embassy after \u2014 Goguryeo, Yamato, Tang \u2014 runs through that room.",
    events: [{ year: 642, label: "Daeya; the vow of revenge." }],
    aliases: ["Chunchu & Gotaso"]
  },
  {
    id: "rel-munhee-bohee",
    name: "Munhee & Bohee",
    korean: "\uBB38\uD76C \xB7 \uBCF4\uD76C",
    entity: "relationship",
    kingdom: "silla",
    bond: "kin",
    between: ["munhee", "bohee"],
    title: "Sisters and a drowned capital",
    tagline: "One dream, one silk skirt, one dynasty.",
    arc: "Bohee sells the dream; Munhee buys it. The worst trade in Silla\u2019s thousand years becomes the marriage that produces kings.",
    events: [{ year: 625, label: "The dream is sold for a skirt." }],
    aliases: ["Munhee & Bohee"]
  },
  {
    id: "rel-euija-gyebek",
    name: "Euija & Gyebek",
    korean: "\uC758\uC790 \xB7 \uACC4\uBC31",
    entity: "relationship",
    kingdom: "baekje",
    bond: "mentor",
    between: ["euija", "gyebek"],
    dynamic: { en: "Extraverted, social king \xB7 the general who answers only the question", ko: "\uC678\uD5A5\uC801\uC774\uACE0 \uC0AC\uAD50\uC801\uC778 \uC655 \xB7 \uBB3B\uB294 \uB9D0\uC5D0\uB9CC \uB2F5\uD558\uB294 \uC7A5\uAD70" },
    still: "rel-euija-gyebek",
    title: "The named general",
    tagline: "He gave a commoner a name \u2014 and ten thousand men at Hwangsan.",
    arc: "Euija elevates Gyebek when the clans will not. At Hwangsanbeol Gyebek kills his family and dies fighting. The king who named him cannot save the country.",
    events: [{ year: 660, label: "Hwangsanbeol." }],
    aliases: ["Euija & Gyebek"]
  },
  {
    id: "rel-seongchung-heungsu",
    name: "Seongchung & Heungsu",
    korean: "\uC131\uCDA9 \xB7 \uD765\uC218",
    entity: "relationship",
    kingdom: "baekje",
    bond: "ally",
    between: ["seongchung", "heungsu"],
    title: "The same ground twice",
    tagline: "One wrote Tanhyeon and Gibeolpo. The other said: same as Seongchung.",
    arc: "Two jwapyeong, one map. Seongchung starves with the passes on paper. Heungsu, posted to Gomamiji, will not invent a second plan when the courier asks. The court hears bitterness. The rivers hear nothing.",
    events: [
      { year: 656, label: "Seongchung dies in the cell; Heungsu is already on the posting road." },
      { year: 660, label: "Heungsu answers with Seongchung\u2019s words; both passes are already lost." }
    ],
    aliases: ["Seongchung & Heungsu"]
  },
  {
    id: "rel-heungsu-gyebek",
    name: "Heungsu & Gyebek",
    korean: "\uD765\uC218 \xB7 \uACC4\uBC31",
    entity: "relationship",
    kingdom: "baekje",
    bond: "ally",
    between: ["heungsu", "gyebek"],
    title: "The posting and the name",
    tagline: "Hold the river, or there will be no Sabi left to be loyal to.",
    arc: "Last talk at the berth before Gomamiji. Gyebek will take Yellow Mountain anyway. Heungsu\u2019s 660 answer never reaches him as a change of road.",
    events: [{ year: 656, label: "The berth. Then the posting." }],
    aliases: ["Heungsu & Gyebek"]
  },
  {
    id: "rel-jumong-yuhwa",
    name: "Jumong & Yuhwa",
    korean: "\uC8FC\uBABD \xB7 \uC720\uD654",
    entity: "relationship",
    kingdom: "goguryeo",
    bond: "kin",
    between: ["jumong", "yuhwa"],
    title: "Mother and the egg",
    tagline: "Cast out for loving the sun; she raises the archer who founds a kingdom.",
    arc: "Yuhwa bears Jumong after Haemosu. In Buyeo the boy outgrows jealousy; she is the river-blood in his claim to heaven. Her last mortal word is for him; after that she is the moon.",
    events: [
      { label: "The egg; the flight from Buyeo." },
      { label: "She dies; the sun takes her soul; night keeps a face." }
    ],
    aliases: ["Jumong & Yuhwa"]
  },
  {
    id: "rel-onjo-sosuno",
    name: "Onjo & Sosuno",
    korean: "\uC628\uC870 \xB7 \uC18C\uC11C\uB178",
    entity: "relationship",
    kingdom: "baekje",
    bond: "kin",
    between: ["onjo", "sosuno"],
    title: "Mother of Baekje",
    tagline: "She walked south when Goguryeo chose another heir.",
    arc: "Sosuno takes Onjo and Biryu south after Yuri inherits. Onjo founds Baekje; her money and routes are the kingdom\u2019s dowry.",
    events: [{ year: -18, label: "Baekje founded." }],
    aliases: ["Onjo & Sosuno"]
  },
  {
    id: "rel-gesomun-chunchu",
    name: "Yeon & Chunchu",
    korean: "\uC5F0\uAC1C\uC18C\uBB38 \xB7 \uCD98\uCD94",
    entity: "relationship",
    kingdom: "goguryeo",
    bond: "rival",
    between: ["gesomun", "chunchu"],
    title: "Prisoner and host",
    tagline: "He locked Chunchu up \u2014 then let him go to Tang.",
    arc: "Chunchu comes to Goguryeo for troops after Daeya. Yeon imprisons him, lectures him, releases him. The man he frees returns with Tang.",
    events: [{ year: 642, label: "Chunchu held in Pyongyang." }],
    aliases: ["Yeon & Chunchu", "Gesomun & Chunchu"]
  },
  {
    id: "rel-hwanung-dangun",
    name: "Hwanung & Dangun",
    korean: "\uD658\uC6C5 \xB7 \uB2E8\uAD70",
    entity: "relationship",
    kingdom: "joseon",
    bond: "kin",
    between: ["hwanung", "dangun"],
    title: "Son of Heaven and Grandson of Heaven",
    tagline: "The mandate descends one generation, then stays to found a capital.",
    arc: "Hwanung brings heaven\u2019s seals to earth; Dangun keeps the court at Asadal. Lord of Heaven, Son of Heaven, Grandson of Heaven \u2014 one line, three offices.",
    events: [{ label: "Asadal founded; fifteen hundred years." }],
    aliases: ["Hwanung & Dangun"]
  },
  {
    id: "rel-yushin-munmu",
    name: "Yushin & Bupmin",
    korean: "\uC720\uC2E0 \xB7 \uBC95\uBBFC",
    entity: "relationship",
    kingdom: "silla",
    bond: "mentor",
    between: ["yushin", "munmu"],
    dynamic: { en: "Strong, disciplined uncle \xB7 apprentice nephew", ko: "\uAC15\uC778\uD558\uACE0 \uC5C4\uACA9\uD55C \uC678\uC0BC\uCD0C \xB7 \uC218\uB828\uD558\uB294 \uC870\uCE74" },
    still: "rel-yushin-bupmin",
    title: "Marshal and flower youth",
    tagline: "Uncle by marriage; head of the Hwarang by oath.",
    arc: "After Daeya, Yushin trains Bupmin among the Hwarang \u2014 horse, bow, the Five Principles \u2014 until \u201Ca king for all\u201D starts to mean loyalty to a country, not only a childhood sentence. The boy who becomes Munmu still salutes the marshal who taught him the yard.",
    events: [{ year: 643, label: "Bupmin trains under Marshal Yushin." }],
    aliases: ["Yushin & Bupmin", "Yushin & Munmu", "Bupmin & Yushin"]
  },
  {
    id: "rel-yumla-kangrim",
    name: "Yumla & Kangrim",
    korean: "\uC5FC\uB77C \xB7 \uAC15\uB9BC",
    entity: "relationship",
    kingdom: "underworld",
    bond: "sworn",
    between: ["yumla", "kangrim"],
    title: "Judge and reaper",
    tagline: "Heaven sent an arrest; the court kept a messenger.",
    arc: "Kangrim was meant to bring Judge Yumla up. He stayed. Under Big Star\u2019s \uC800\uC2B9, Yumla judges and Kangrim fetches \u2014 minutes kept, one question at the threshold \u2014 the way Silla runs on the Hwarang.",
    events: [{ label: "Kangrim stays; the crow scrambles the ledger." }],
    aliases: ["Yumla & Kangrim", "Kangrim & Yumla"]
  },
  {
    id: "rel-kangrim-haewonmek",
    name: "Kangrim & Haewonmek",
    korean: "\uAC15\uB9BC \xB7 \uD574\uC6D0\uB9E5",
    entity: "relationship",
    kingdom: "underworld",
    bond: "sworn",
    between: ["kangrim", "haewonmek"],
    title: "The two reapers",
    tagline: "One office in the street \u2014 two names who argue at every door.",
    arc: "They share the crow\u2019s scrambled ledger and split the threshold: Kangrim asks Kangrim\u2019s Question; Haewonmek asks only for last words. At Daeya Kangrim takes Gotaso, Haewonmek takes Pumsuk. At Hwangsan both come for Gyebek and the five thousand. At Salsu both fail Gesomun. Elites know both names; wet nurses still say only \uC800\uC2B9\uC0AC\uC790.",
    events: [
      { year: 642, label: "Daeya \u2014 two collections, one banter." },
      { year: 660, label: "Hwangsan \u2014 both named correctly by Gyebek." },
      { year: 662, label: "Snake River \u2014 both refused by Yeon Gesomun." }
    ],
    aliases: [
      "Kangrim & Haewonmaek",
      "Kangrim & Haewonmek",
      "Haewonmaek & Kangrim",
      "Haewonmek & Kangrim",
      "the two reapers"
    ]
  },
  {
    id: "rel-daebyeol-sobyeol",
    name: "Big Star & Little Star",
    korean: "\uB300\uBCC4\uC655 \xB7 \uC18C\uBCC4\uC655",
    entity: "relationship",
    kingdom: "tamla",
    bond: "kin",
    between: ["daebyeol", "sobyeol"],
    title: "Twin division of the worlds",
    tagline: "Father retired; one cheated for the living world; one kept the orderly dark.",
    arc: "Heaven\u2013Earth King (Class I) retires from ruling all mortals \u2014 living and dead \u2014 and leaves the charge to his sons. Flower wager, swapped blooms, \uC774\uC2B9 to the younger, \uC800\uC2B9 to the elder. Big Star still mends suns and moons for his brother\u2019s mess \u2014 and leaves human vice alone.",
    events: [
      { label: "Heaven\u2013Earth King retires; sons inherit the charge." },
      { label: "Flower wager; division of \uC774\uC2B9 and \uC800\uC2B9." }
    ],
    aliases: ["Big Star & Little Star", "Daebyeol & Sobyeol", "\uB300\uBCC4\uC655 \xB7 \uC18C\uBCC4\uC655"]
  },
  {
    id: "rel-yumla-daebyeol",
    name: "Big Star & Yumla",
    korean: "\uB300\uBCC4\uC655 \xB7 \uC5FC\uB77C",
    entity: "relationship",
    kingdom: "underworld",
    bond: "mentor",
    between: ["daebyeol", "yumla"],
    title: "Ruler and judge",
    tagline: "Big Star keeps \uC800\uC2B9; Yumla keeps the sentence.",
    arc: "Sovereignty and judgment split cleanly: Paradise, Siwang, Hell sit inside Big Star\u2019s realm; Yumla\u2019s purple court weighs the dead who arrive by reaper road.",
    events: [{ label: "Judgment nested under Big Star\u2019s rule." }],
    aliases: ["Big Star & Yumla", "Yumla & Big Star", "\uB300\uBCC4\uC655 \xB7 \uC5FC\uB77C"]
  },
  {
    id: "rel-sara-jacheongbi",
    name: "Hallakgungi & Jacheongbi",
    korean: "\uD560\uB77D\uAD81\uC774 \xB7 \uC790\uCCAD\uBE44",
    entity: "relationship",
    kingdom: "tamla",
    bond: "mentor",
    between: ["sara", "jacheongbi"],
    title: "Flower warden and the girl who walked west",
    tagline: "She borrowed resurrection \u2014 and later, ruin.",
    arc: "Jacheongbi reaches \uC11C\uCC9C\uAF43\uBC2D in man\u2019s clothes; Hallakgungi (\uD560\uB77D\uAD81\uC774 \u2014 active after Saradoryeong retired) yields the five life-flowers for Mun Doryeong, and later the extinction bloom against heaven\u2019s rebels. The fourth realm opens for her because she asks correctly.",
    events: [{ label: "Resurrection flowers; later the doom-flower." }],
    aliases: [
      "Hallakgungi & Jacheongbi",
      "The Gardener & Jacheongbi",
      "Sara & Jacheongbi",
      "\uD560\uB77D\uAD81\uC774 \xB7 \uC790\uCCAD\uBE44",
      "\uC0AC\uB77C\uB3C4\uB839 \xB7 \uC790\uCCAD\uBE44"
    ]
  },
  {
    id: "rel-heavenearthking-chongmyeong",
    name: "Heaven\u2013Earth King & the Lady of Wisdom",
    korean: "\uCC9C\uC9C0\uC655 \xB7 \uCD1D\uBA85\uBD80\uC778",
    entity: "relationship",
    kingdom: "tamla",
    bond: "kin",
    between: ["heavenearthking", "chongmyeong"],
    title: "Retired prior and the mother of the twins",
    tagline: "He kept both ledgers; she kept the house that later split.",
    arc: "\u300C\uCC9C\uC9C0\uC655\uBCF8\uD480\uC774\u300D: Heaven\u2013Earth King and the Lady of Wisdom bear Big Star and Little Star. He retires from ruling living and dead; the sons wager flowers. She does not take a realm.",
    events: [{ label: "Twins born; father retires; \uC774\uC2B9 and \uC800\uC2B9 divide." }],
    aliases: [
      "Heaven\u2013Earth King & the Lady of Wisdom",
      "Heaven\u2013Earth King & Chongmyeong",
      "Chongmyeong & Heaven\u2013Earth King",
      "\uCC9C\uC9C0\uC655 \xB7 \uCD1D\uBA85\uBD80\uC778"
    ]
  },
  {
    id: "rel-go-yang",
    name: "Go & Yang",
    korean: "\uACE0 \xB7 \uC591",
    entity: "relationship",
    kingdom: "tamla",
    bond: "kin",
    between: ["go_tamla", "yang_tamla"],
    title: "Princes of the hollow",
    tagline: "Two of three who rose from Samseonghyeol \u2014 not from an egg.",
    arc: "They divide Tamla by arrow with Bu, marry princesses from the East Sea box, and leave surnames the island still counts.",
    events: [{ label: "Emergence from Samseonghyeol; arrow-division of the island." }],
    aliases: ["Go & Yang", "Yang & Go", "\uACE0 \xB7 \uC591"]
  },
  {
    id: "rel-yang-bu",
    name: "Yang & Bu",
    korean: "\uC591 \xB7 \uBD80",
    entity: "relationship",
    kingdom: "tamla",
    bond: "kin",
    between: ["yang_tamla", "bu_tamla"],
    title: "Princes of the hollow",
    tagline: "Well-brothers who learned farming from a drifting box.",
    arc: "With Go they rise, shoot, marry, and open Tamla\u2019s grain age when the sea-box yields calves, foals, and the five grains.",
    events: [{ label: "Pond wedding; five grains from the box." }],
    aliases: ["Yang & Bu", "Bu & Yang", "\uC591 \xB7 \uBD80"]
  },
  {
    id: "rel-go-bu",
    name: "Go & Bu",
    korean: "\uACE0 \xB7 \uBD80",
    entity: "relationship",
    kingdom: "tamla",
    bond: "kin",
    between: ["go_tamla", "bu_tamla"],
    title: "Princes of the hollow",
    tagline: "Third and first of the surname lines \u2014 same breath from the well.",
    arc: "Samseonghyeol\u2019s triad: no eggs, three arrows, three princesses, one island taught to farm.",
    events: [{ label: "Founding of the Go and Bu lines on Tamla." }],
    aliases: ["Go & Bu", "Bu & Go", "\uACE0 \xB7 \uBD80"]
  },
  {
    id: "rel-sunduk-bidam",
    name: "Sunduk & Bidam",
    korean: "\uC120\uB355 \xB7 \uBE44\uB2F4",
    entity: "relationship",
    kingdom: "silla",
    bond: "rival",
    between: ["sunduk", "bidam"],
    title: "The rebellion of the star",
    tagline: "He read an omen against a queen; Yushin read it back.",
    arc: "Bidam rebels when a star falls. Sunduk dies in the crisis; Yushin and Chunchu put the revolt down. Jinduk takes the throne afterward.",
    events: [{ year: 647, label: "Bidam\u2019s rebellion." }],
    aliases: ["Sunduk & Bidam"]
  },
  {
    id: "rel-xue-liu",
    name: "Xue Rengui & Lady Liu",
    korean: "\uC124\uC778\uADC0 \xB7 \uC720\uC528",
    entity: "relationship",
    kingdom: "tang",
    bond: "love",
    between: ["xuerengui", "xueliu"],
    title: "The yellow hemp and the hut door",
    tagline: "Talent needs its hour. She named the hour.",
    arc: "Poor Longmen: he stacks earth for the dead; she sends him to Zhang Shigui. The Xin Tangshu keeps her speech. Opera later starves her in a kiln and calls her Yingchun. The field still comes first.",
    events: [{ year: 645, label: "She talks him off the graves and onto the muster." }],
    aliases: ["Xue & Liu", "\u4EC1\u8CB4 \xB7 \u67F3\u6C0F"]
  },
  {
    id: "rel-taizong-xuerengui",
    name: "Taizong & Xue Rengui",
    korean: "\uD0DC\uC885 \xB7 \uC124\uC778\uADC0",
    entity: "relationship",
    kingdom: "tang",
    bond: "mentor",
    between: ["taizong", "xuerengui"],
    title: "The white coat and the eye that found it",
    tagline: "\u201CI am less happy about gaining Liaodong than about gaining you.\u201D",
    arc: "A farmer answers the muster; at Stallion Mountain Taizong sees the white armour and the fangtian ji and chooses his eastern blade. Xue spends the rest of the war proving the choice was cheaper than another province.",
    events: [{ year: 645, label: "Taizong notices Xue Rengui in white at Stallion Mountain." }],
    aliases: ["Taizong & Xue", "Emperor & White Tiger II"]
  },
  {
    id: "rel-yushin-bidam",
    name: "Yushin & Bidam",
    korean: "\uC720\uC2E0 \xB7 \uBE44\uB2F4",
    entity: "relationship",
    kingdom: "silla",
    bond: "rival",
    between: ["yushin", "bidam"],
    dynamic: { en: "Eternal friends and rivals \u2014 the two greatest men in Samhan", ko: "\uC601\uC6D0\uD55C \uBC97\uC774\uC790 \uB9DE\uC218 \u2014 \uC0BC\uD55C \uCD5C\uACE0\uC758 \uB450 \uC0AC\uB0B4" },
    still: "rel-bidam-yushin",
    title: "One hundred and eight",
    tagline: "Tied forever in the yard \u2014 until Radiance makes the count blood.",
    arc: "Age-mates from the Hwarang: Gaya steel against Surabol\u2019s oldest hall, score locked at 108\u2013108. Bidam names Yushin foreigner when the star falls; the duel that was always even becomes a rebellion\u2019s end.",
    events: [
      { label: "Yard rivals \u2014 the count never leaves 108\u2013108." },
      { year: 647, label: "Radiance; Bidam\u2019s head; the score breaks." }
    ],
    aliases: ["Yushin & Bidam", "Bidam & Yushin"]
  },
  {
    id: "rel-sunduk-jinduk",
    name: "Sunduk & Jinduk",
    korean: "\uC120\uB355 \xB7 \uC9C4\uB355",
    entity: "relationship",
    kingdom: "silla",
    bond: "kin",
    between: ["sunduk", "jinduk"],
    dynamic: { en: "Sisterly cousins", ko: "\uC790\uB9E4 \uAC19\uC740 \uC0AC\uCD0C" },
    still: "rel-sunduk-jinduk",
    title: "Two queens, one house",
    tagline: "Sister crowns; one dies in the crisis, one finishes the sentence.",
    arc: "Sacred Bone sisters under Jinpyung. Sunduk takes the throne first; after Bidam and the falling star, Jinduk inherits the unfinished work and the Tang question Chunchu will answer.",
    events: [
      { year: 632, label: "Sunduk crowned." },
      { year: 647, label: "Jinduk takes the throne after the rebellion." }
    ],
    aliases: ["Sunduk & Jinduk", "Jinduk & Sunduk"]
  },
  {
    id: "rel-yushin-munhee",
    name: "Yushin & Munhee",
    korean: "\uC720\uC2E0 \xB7 \uBB38\uD76C",
    entity: "relationship",
    kingdom: "silla",
    bond: "kin",
    between: ["yushin", "munhee"],
    title: "Brother and the dream-buyer",
    tagline: "He gives the marshal\u2019s house a queen\u2019s sister-in-law.",
    arc: "Munhee is Yushin\u2019s younger sister \u2014 the skirt that bought a drowned capital and sewed Chunchu into their bloodline. The marshal\u2019s loyalty to the throne runs through her marriage as much as through bone rank.",
    events: [{ year: 625, label: "Munhee marries Chunchu; two houses become one design." }],
    aliases: ["Yushin & Munhee", "Munhee & Yushin"]
  },
  {
    id: "rel-chunchu-munmu",
    name: "Chunchu & Bupmin",
    korean: "\uCD98\uCD94 \xB7 \uBC95\uBBFC",
    entity: "relationship",
    kingdom: "silla",
    bond: "kin",
    between: ["chunchu", "munmu"],
    dynamic: { en: "Loving father \xB7 optimistic, heroic son", ko: "\uB2E4\uC815\uD55C \uC544\uBC84\uC9C0 \xB7 \uB099\uCC9C\uC801\uC774\uACE0 \uC601\uC6C5\uC801\uC778 \uC544\uB4E4" },
    still: "rel-chunchu-bupmin",
    title: "Father and the stolen sentence",
    tagline: "\u201CA king for all\u201D \u2014 the boy took the words; the father cleared the road.",
    arc: "Bupmin grows in Chunchu\u2019s shadow and Munhee\u2019s packing lists. He inherits a half-won war and finishes the peninsula his father opened as far as Baekje \u2014 then turns on the ally the father invited in.",
    events: [
      { label: "Childhood: steals the sentence \u201Ca king for all.\u201D" },
      { year: 661, label: "Muyeol dies; Munmu takes the unfinished map." }
    ],
    aliases: ["Chunchu & Bupmin", "Chunchu & Munmu", "Muyeol & Munmu"]
  },
  {
    id: "rel-gesomun-yeongnyu",
    name: "Yeon & Yeongnyu",
    korean: "\uC5F0\uAC1C\uC18C\uBB38 \xB7 \uC601\uB958",
    entity: "relationship",
    kingdom: "goguryeo",
    bond: "rival",
    between: ["gesomun", "yeongnyu"],
    title: "Banquet and the emptied summit",
    tagline: "The king kept the final vote; the nephew took the blades.",
    arc: "Yeongnyu\u2019s court tries to contain Yeon; Yeon answers with a massacre at the High Summit and wears the four taken blades home beside the Eastern Crow Blade he brought. The uncle dies; the nephew remakes the kingdom as Supreme Commander.",
    events: [{ year: 642, label: "Yeon\u2019s Massacre \u2014 Yeongnyu falls." }],
    aliases: ["Yeon & Yeongnyu", "Gesomun & Yeongnyu"]
  },
  {
    id: "rel-gesomun-bojang",
    name: "Yeon & Bojang",
    korean: "\uC5F0\uAC1C\uC18C\uBB38 \xB7 \uBCF4\uC7A5",
    entity: "relationship",
    kingdom: "goguryeo",
    bond: "mentor",
    between: ["gesomun", "bojang"],
    title: "Puppet crown, real sword",
    tagline: "He seats a king so the Summit will still have a smile to finalise.",
    arc: "After the knives, Yeon installs Bojang. The boy-king keeps the forms; the Supreme Commander keeps the blades. When Yeon dies, the forms are not enough to hold three sons.",
    events: [{ year: 642, label: "Bojang enthroned under Yeon\u2019s hand." }],
    aliases: ["Yeon & Bojang", "Gesomun & Bojang"]
  },
  {
    id: "rel-gesomun-namseng",
    name: "Yeon & Namseng",
    korean: "\uC5F0\uAC1C\uC18C\uBB38 \xB7 \uB0A8\uC0DD",
    entity: "relationship",
    kingdom: "goguryeo",
    bond: "kin",
    between: ["gesomun", "namseng"],
    title: "Eldest of the three",
    tagline: "Heir to the High Commander Blade \u2014 and to a house that eats its own.",
    arc: "Yeon Namseng is raised under Gesomun\u2019s own strict roof \u2014 not Jungto\u2019s softer hall \u2014 to inherit command. After Yeon\u2019s death poisoned messengers and Tang\u2019s invitation turn inheritance into exile; he opens a door his father would have barred.",
    events: [
      { label: "Raised as eldest sword-heir under Gesomun." },
      { year: 666, label: "Defects; the fall accelerates." }
    ],
    aliases: ["Yeon & Namseng", "Gesomun & Namseng", "Yeon & Yeon Namseng"]
  },
  {
    id: "rel-namseng-namgun",
    name: "Yeon Namseng & Yeon Namgun",
    korean: "\uC5F0\uB0A8\uC0DD \xB7 \uC5F0\uB0A8\uAC74",
    entity: "relationship",
    kingdom: "goguryeo",
    bond: "kin",
    between: ["namseng", "namgun"],
    title: "Brothers after the blades",
    tagline: "One opens the gate to Tang; one stays to lose the city.",
    arc: "Two roofs, one house: Yeon Namseng forged by Gesomun; Yeon Namgun and Yeon Namsan warmed by Jungto and Sooyoung \u2014 sons, not Mount Namsan of Surabol. Messengers tell each the other wants them dead \u2014 Chunchu\u2019s kind of plot, never said aloud. Namseng rides to Tang; Namgun and Namsan take a last stand that cannot outlast betrayal.",
    events: [{ year: 666, label: "The brothers\u2019 coup; the house splits." }],
    aliases: [
      "Yeon Namseng & Yeon Namgun",
      "Namseng & Namgun",
      "Namgun & Namseng",
      "\uC5F0\uB0A8\uC0DD \xB7 \uC5F0\uB0A8\uAC74"
    ]
  },
  {
    id: "rel-euija-yung",
    name: "Euija & Yung",
    korean: "\uC758\uC790 \xB7 \uC735",
    entity: "relationship",
    kingdom: "baekje",
    bond: "kin",
    between: ["euija", "yung"],
    title: "Father and the demoted eldest",
    tagline: "Satek made him inevitable; Euija made him former.",
    arc: "Yung is first of the five important sons \u2014 Satek-maternal, crown prince until 655. Euija cuts the mark to break the sleeve that raised him, and keeps a son who will never forgive the arithmetic.",
    events: [
      { year: 644, label: "Named crown prince while still Satek\u2019s favourite." },
      { year: 655, label: "Demoted; Hyo takes the mark." }
    ],
    aliases: ["Euija & Yung", "Yung & Euija"]
  },
  {
    id: "rel-euija-tae",
    name: "Euija & Tae",
    korean: "\uC758\uC790 \xB7 \uD0DC",
    entity: "relationship",
    kingdom: "baekje",
    bond: "kin",
    between: ["euija", "tae"],
    title: "Father and the Jinmo second",
    tagline: "Second son, second house \u2014 counted, rarely crowned.",
    arc: "Tae is second of the five \u2014 Jinmo maternal claim beside Yung\u2019s Satek. Euija seats him with the forty-one; the street reads him as the spare key Jinmo kept polished.",
    events: [{ year: 655, label: "Seated over emptied clan chairs." }],
    aliases: ["Euija & Tae", "Tae & Euija"]
  },
  {
    id: "rel-euija-hyo",
    name: "Euija & Hyo",
    korean: "\uC758\uC790 \xB7 \uD6A8",
    entity: "relationship",
    kingdom: "baekje",
    bond: "kin",
    between: ["euija", "hyo"],
    title: "Father and the replacement crown",
    tagline: "Eungo\u2019s son \u2014 chosen because he was not Satek\u2019s.",
    arc: "Hyo is third of the five. Euija moves the crown-prince mark to him in 655 to keep Queen Satek\u2019s house from ruling through the eldest. The gift is also a target.",
    events: [{ year: 655, label: "Named crown prince in Yung\u2019s place." }],
    aliases: ["Euija & Hyo", "Hyo & Euija"]
  },
  {
    id: "rel-euija-yun",
    name: "Euija & Prince Yun",
    korean: "\uC758\uC790 \xB7 \uBD80\uC5EC\uC5F0",
    entity: "relationship",
    kingdom: "baekje",
    bond: "kin",
    between: ["euija", "yun"],
    title: "Father and the Hae fourth",
    tagline: "Prince Yun / Buyeo Yun \u2014 not Yeon Gesomun, not Yung, not Yunbi.",
    arc: "Prince Yun is fourth of the five \u2014 Hae maternal, easy to mishear as Yung if the scribe is lazy, and easy for English to misfile under Yeon Gesomun\u2019s \u6DF5. Euija seats him with the rest; the chronicle keeps Buyeo Yun / \uBD80\uC5EC\uC5F0 / \u6276\u9918\u6F14 distinct from \uC735, from the wrong \uC724, from Yunbi (\uC5F0\uBE44), and from Goguryeo\u2019s Yeon house.",
    events: [{ year: 655, label: "Seated; another clan loses a quiet claim." }],
    aliases: ["Euija & Prince Yun", "Euija & Yun", "Yun & Euija", "Euija & Buyeo Yun"]
  },
  {
    id: "rel-euija-pung",
    name: "Euija & Pung",
    korean: "\uC758\uC790 \xB7 \uD48D",
    entity: "relationship",
    kingdom: "baekje",
    bond: "kin",
    between: ["euija", "pung"],
    title: "Father and the restoration prince",
    tagline: "Fifth of the five \u2014 Mokli berth, then Yamato, then a crown of leftovers.",
    arc: "Pung is fifth among Euija\u2019s important sons \u2014 Mokli-maternal enough that an eastern berth already feels like destiny. After Sabi he becomes the face of the Baekje Restoration Army \u2014 Yamato ships, Boksin\u2019s plots, and a crown that no longer has a country.",
    events: [
      { year: 655, label: "Sons packed into the Assembly." },
      { year: 661, label: "BRA wars begin in his name." }
    ],
    aliases: ["Euija & Pung", "Pung & Euija"]
  },
  {
    id: "rel-tae-yun",
    name: "Tae & Prince Yun",
    korean: "\uD0DC \xB7 \uBD80\uC5EC\uC5F0",
    entity: "relationship",
    kingdom: "baekje",
    bond: "kin",
    between: ["tae", "yun"],
    title: "Second and fourth",
    tagline: "Jinmo ledger and Hae salt \u2014 Prince Yun is Buyeo Yun, not Yeon Gesomun.",
    arc: "While Yung and Hyo burn over the mark, Tae and Prince Yun keep the quieter rivalry of maternal harbours: Jinmo arithmetic versus Hae berths. Neither gets the crown story; both get seats in 655 and captive lists in 660.",
    events: [{ year: 655, label: "Both seated; both still someone else\u2019s faction whisper." }],
    aliases: ["Tae & Prince Yun", "Tae & Yun", "Yun & Tae", "Tae & Buyeo Yun"]
  },
  {
    id: "rel-euija-queensatek",
    name: "Euija & Queen Satek",
    korean: "\uC758\uC790 \xB7 \uC0AC\uD0DD\uC655\uD6C4",
    entity: "relationship",
    kingdom: "baekje",
    bond: "kin",
    between: ["euija", "queensatek"],
    title: "Mother of the Eraha",
    tagline: "Satek blood on the throne \u2014 and on the veto that made him.",
    arc: "Queen Satek\u2019s house \u2014 under Minister Satek \u2014 holds both crown and Prime Minister when Euija rises. The Eight Clans\u2019 grip is the childhood he later breaks by seating his own sons.",
    events: [{ label: "Satek queen and Satek Premier \u2014 Euija\u2019s starting board." }],
    aliases: ["Euija & Queen Satek", "Queen Satek & Euija"]
  },
  {
    id: "rel-euija-ungo",
    name: "Euija & Queen Eungo",
    korean: "\uC758\uC790 \xB7 \uC6C5\uACE0",
    entity: "relationship",
    kingdom: "baekje",
    bond: "kin",
    between: ["euija", "ungo"],
    title: "King and the mother of Hyo",
    tagline: "She names the fear he already has \u2014 Yung belongs to Satek.",
    arc: "Eungo is Euija\u2019s wife and Hyo\u2019s mother. After Queen Satek\u2019s death she presses the succession cut: strip Yung of the crown-prince mark before Minister Satek\u2019s sleeve grows back through the eldest son.",
    events: [{ year: 655, label: "Hyo named crown prince; Yung demoted." }],
    aliases: ["Euija & Eungo", "Eungo & Euija", "Euija & Queen Eungo", "Euija & Queen Ungo"]
  },
  {
    id: "rel-yung-hyo",
    name: "Yung & Hyo",
    korean: "\uC735 \xB7 \uD6A8",
    entity: "relationship",
    kingdom: "baekje",
    bond: "rival",
    between: ["yung", "hyo"],
    title: "Crown-prince swap",
    tagline: "Eldest stripped; younger crowned \u2014 brothers become factions.",
    arc: "Euija removes Yung as crown prince for Hyo \u2014 motive: Yung too deep in Satek control, Eungo\u2019s counsel in the same key. The rivalry outruns the Assembly purge and ends only when the kingdom does.",
    events: [{ year: 655, label: "Mark moves from Yung to Hyo." }],
    aliases: ["Yung & Hyo", "Hyo & Yung"]
  },
  {
    id: "rel-tae-hyo",
    name: "Tae & Hyo",
    korean: "\uD0DC \xB7 \uD6A8",
    entity: "relationship",
    kingdom: "baekje",
    bond: "rival",
    between: ["tae", "hyo"],
    title: "Skipped second and sudden third",
    tagline: "The mark jumped the aisle \u2014 one brother watched, one wore it.",
    arc: "When Euija demotes Yung, Tae is the son standing between eldest and chosen. The rivalry stays quieter than Yung\u2013Hyo \u2014 a corridor silence rather than a river war \u2014 but the seating chart never quite forgives either of them.",
    events: [{ year: 655, label: "Mark moves to Hyo past Tae." }],
    aliases: ["Tae & Hyo", "Hyo & Tae"]
  },
  {
    id: "rel-yung-pung",
    name: "Yung & Pung",
    korean: "\uC735 \xB7 \uD48D",
    entity: "relationship",
    kingdom: "baekje",
    bond: "rival",
    between: ["yung", "pung"],
    title: "Opposite banks at Baekgang",
    tagline: "One kneels into Tang\u2019s ledger; one sails a restoration into fire.",
    arc: "Succession bitterness and exile routes put the brothers on opposite sides at the White River in 663 \u2014 Yung with the victors\u2019 captive usefulness, Pung with the BRA\u2019s last fleet.",
    events: [{ year: 663, label: "Face each other across the White River." }],
    aliases: ["Yung & Pung", "Pung & Yung"]
  },
  {
    id: "rel-satek-yunbi",
    name: "Elder Satek & Elder Yunbi",
    korean: "\uC801\uB355 \xB7 \uBB38\uC9C4",
    entity: "relationship",
    kingdom: "baekje",
    bond: "rival",
    between: ["eldersatek", "elderyunbi"],
    title: "Sleeve versus arm",
    tagline: "Four generations \u2014 harbours, writs, and lantern-festival dead.",
    arc: "Elder Satek and Elder Yunbi are the named faces of the feud the street already knows. They truce once to remove Gyebek, then lose every chair to Euija\u2019s sons anyway.",
    events: [
      { year: 632, label: "Feud already four generations deep." },
      { year: 655, label: "Night truce; still purged." }
    ],
    aliases: ["Satek & Yunbi", "Elder Satek & Elder Yunbi", "Jukduk & Munjin", "Jijeok & Munjin", "Munjin & Jijeok"]
  },
  {
    id: "rel-jijeok-hana",
    name: "Lady Yunbi & the Sateks",
    korean: "\uD55C\uC544 \xB7 \uC0AC\uD0DD",
    entity: "relationship",
    kingdom: "baekje",
    bond: "rival",
    between: ["yunbihana", "sateksondung"],
    title: "Wharf feud, personal volume",
    tagline: "She keeps score; he climbs walls; both call it house honour.",
    arc: "Lady Yunbi\u2019s sharp house-pride meets Satek Sondeung\u2019s street volume \u2014 the feud\u2019s younger register under Elder Satek and Elder Yunbi\u2019s Assembly theatre.",
    events: [{ year: 632, label: "West-bridge cart; roof-tiles; unfinished insults." }],
    aliases: ["Hana & Sondeung", "Sondeung & Hana", "Lady Yunbi & Satek", "Yunbi Hana & Satek"]
  },
  {
    id: "rel-jungto-sooyoung",
    name: "Jungto & Sooyoung",
    korean: "\uC815\uD1A0 \xB7 \uC218\uC601",
    entity: "relationship",
    kingdom: "goguryeo",
    bond: "kin",
    between: ["jungto", "sooyoung"],
    title: "The softer Yeon roof",
    tagline: "Brother and sister who raised Yeon Namgun and Yeon Namsan \u2014 not the heir.",
    arc: "While Gesomun drills Yeon Namseng, his siblings Jungto and Sooyoung keep a hall where Yeon Namgun and Yeon Namsan eat. That split becomes the crack messengers later poison. Yeon Namsan the son \u2014 never Mount Namsan of Surabol.",
    events: [{ label: "Raise Yeon Namgun and Yeon Namsan away from Gesomun\u2019s strict roof." }],
    aliases: ["Jungto & Sooyoung", "Sooyoung & Jungto"]
  },
  {
    id: "rel-gesomun-jungto",
    name: "Gesomun & Jungto",
    korean: "\uAC1C\uC18C\uBB38 \xB7 \uC815\uD1A0",
    entity: "relationship",
    kingdom: "goguryeo",
    bond: "kin",
    between: ["gesomun", "jungto"],
    title: "The strict brother and the soft",
    tagline: "One house, two roofs \u2014 the drill hall and the supper hall.",
    arc: "Brothers of the Yeon house. Gesomun keeps the heir Yeon Namseng under his own rules; Jungto raises Yeon Namgun and Yeon Namsan where supper is allowed to be supper. After Gesomun\u2019s death the split he called logistics becomes the crack the messengers poison \u2014 and in 666 the softer brother takes his southern territory to Silla.",
    events: [
      { label: "Splits the three heirs between his roof and Jungto\u2019s." },
      { year: 666, label: "Jungto surrenders his southern territory to Silla." }
    ],
    aliases: ["Gesomun & Jungto", "Jungto & Gesomun", "Yeon Gesomun & Yeon Jungto"]
  },
  {
    id: "rel-gesomun-sooyoung",
    name: "Gesomun & Sooyoung",
    korean: "\uAC1C\uC18C\uBB38 \xB7 \uC218\uC601",
    entity: "relationship",
    kingdom: "goguryeo",
    bond: "kin",
    between: ["gesomun", "sooyoung"],
    title: "The Supreme Commander\u2019s sister",
    tagline: "He fed the heir rules; she fed the younger two supper.",
    arc: "Brother and sister of the Yeon house. Gesomun trusts Sooyoung and Jungto with Yeon Namgun and Yeon Namsan while he forges Namseng into a second self. She corrects the cruelty his drills leave behind \u2014 the one Yeon hall where a boy is not a blade first.",
    events: [
      { label: "Entrusts Yeon Namgun and Yeon Namsan to Sooyoung and Jungto." }
    ],
    aliases: ["Gesomun & Sooyoung", "Sooyoung & Gesomun", "Yeon Gesomun & Yeon Sooyoung"]
  },
  {
    id: "rel-jumong-yuri",
    name: "Jumong & Yuri",
    korean: "\uC8FC\uBABD \xB7 \uC720\uB9AC",
    entity: "relationship",
    kingdom: "goguryeo",
    bond: "kin",
    between: ["jumong", "yuri"],
    title: "First wife\u2019s son",
    tagline: "The heir from Buyeo who costs Sosuno a kingdom.",
    arc: "Yuri arrives from Lady Ye\u2019s line; Jumong names him heir. Sosuno walks south with Onjo and Biryu \u2014 Baekje\u2019s dowry paid for Goguryeo\u2019s succession.",
    events: [{ year: -19, label: "Yuri recognised; Sosuno leaves." }],
    aliases: ["Jumong & Yuri", "Yuri & Jumong"]
  },
  {
    id: "rel-haemosu-habek",
    name: "Haemosu & Habek",
    korean: "\uD574\uBAA8\uC218 \xB7 \uD558\uBC31",
    entity: "relationship",
    kingdom: "goguryeo",
    bond: "rival",
    between: ["haemosu", "habek"],
    title: "Sun and river court",
    tagline: "One stops the chariot; one casts out a daughter.",
    arc: "Desire crosses a border Habek keeps as sovereignty. Exile is his answer; Jumong\u2019s later claim runs through both courts whether either god wills it.",
    events: [{ label: "Yuhwa cast out; the egg still hatches." }],
    aliases: ["Haemosu & Habek", "Habek & Haemosu"]
  },
  {
    id: "rel-haemosu-haewonmek",
    name: "Haemosu & Haewonmek",
    korean: "\uD574\uBAA8\uC218 \xB7 \uD574\uC6D0\uB9E5",
    entity: "relationship",
    kingdom: "other",
    bond: "kin",
    between: ["haemosu", "haewonmek"],
    title: "Same \uD574, split roads",
    tagline: "One \uD574 drives the sun\u2019s chariot; the younger took the night-road.",
    arc: "The names share a \uD574. One keeps Little Star\u2019s day; the other fetches for Yumla under Big Star \u2014 \uC774\uC2B9 and \uC800\uC2B9, not one hall. At Jumong\u2019s river the sun still outranks the fetch: one shove, a promise to let the boy finish, then the night-road again.",
    events: [{ year: -37, label: "The river; Haemosu sends Haewonmek off." }],
    aliases: ["Haemosu & Haewonmek", "Haewonmek & Haemosu"]
  },
  {
    id: "rel-habek-yuhwa",
    name: "Habek & Yuhwa",
    korean: "\uD558\uBC31 \xB7 \uC720\uD654",
    entity: "relationship",
    kingdom: "goguryeo",
    bond: "kin",
    between: ["habek", "yuhwa"],
    title: "River father, exiled daughter",
    tagline: "He rules the Amnok; she pays for loving the sun.",
    arc: "Yuhwa is Habek\u2019s daughter. When Haemosu stops the chariot, Habek answers as a sovereign \u2014 exile, not negotiation \u2014 and the river later bridges her son\u2019s flight anyway.",
    events: [{ label: "Exile from the river court." }],
    aliases: ["Habek & Yuhwa", "Yuhwa & Habek"]
  },
  {
    id: "rel-hwanin-hwanung",
    name: "Hwanin & Hwanung",
    korean: "\uD658\uC778 \xB7 \uD658\uC6C5",
    entity: "relationship",
    kingdom: "joseon",
    bond: "kin",
    between: ["hwanin", "hwanung"],
    title: "Heaven sends a son",
    tagline: "Lord of Heaven commissions; Son of Heaven descends.",
    arc: "Hwanin does not plough \u2014 he sends. Three seals, three thousand, a sandalwood tree: the mandate becomes a farm and a marriage, and Dangun becomes the court that stays.",
    events: [{ label: "Hwanung sent down under the sacred tree." }],
    aliases: ["Hwanin & Hwanung", "Hwanung & Hwanin"]
  },
  {
    id: "rel-suro-ijinasi",
    name: "Suro & Ijinasi",
    korean: "\uC218\uB85C \xB7 \uC774\uC9C4\uC544\uC2DC",
    entity: "relationship",
    kingdom: "gaya",
    bond: "kin",
    between: ["suro", "ijinasi"],
    title: "Two eggs, two valleys",
    tagline: "Brothers from the ridge night \u2014 Golden Gaya and Great Gaya.",
    arc: "Twin-born of Ibiga and the Lady of the Right View. Suro takes the shore and the red sail; Ijinasi takes the larger hill. Six eggs, six thrones; these two name the confederacy\u2019s poles.",
    events: [{ year: 42, label: "Hatch; found Golden and Great Gaya." }],
    aliases: ["Suro & Ijinasi", "Ijinasi & Suro"]
  },
  {
    id: "rel-taizong-gaozong",
    name: "Taizong & Gaozong",
    korean: "\uD0DC\uC885 \xB7 \uACE0\uC885",
    entity: "relationship",
    kingdom: "tang",
    bond: "kin",
    between: ["taizong", "gaozong"],
    dynamic: { en: "Stern, worried father \xB7 son trying to fill his shoes", ko: "\uC5C4\uD558\uACE0 \uAC71\uC815 \uB9CE\uC740 \uC544\uBC84\uC9C0 \xB7 \uADF8 \uC790\uB9AC\uB97C \uCC44\uC6B0\uB824 \uC560\uC4F0\uB294 \uC544\uB4E4" },
    still: "rel-taizong-zhi",
    title: "Emperor and the son who finishes",
    tagline: "One fails at Ansi; one finishes Baekje and Goguryeo.",
    arc: "Taizong chooses Xue and still turns back from Ansi. Gaozong inherits the eastern war, Wu\u2019s court, and the alliance Chunchu sealed \u2014 then overstays until Munmu expels him.",
    events: [
      { year: 649, label: "Taizong dies; Gaozong takes the eastern ledger." },
      { year: 660, label: "Baekje falls under his reign." }
    ],
    aliases: ["Taizong & Gaozong", "Gaozong & Taizong"]
  },
  {
    id: "rel-seonpum-jayi",
    name: "Seonpum & Jahee",
    korean: "\uC120\uD488 \xB7 \uC790\uD76C",
    entity: "relationship",
    kingdom: "silla",
    bond: "kin",
    between: ["seonpum", "jayi"],
    title: "Harbour father, tide daughter",
    tagline: "Ocean Trade raises the girl who corrects a prince\u2019s sums.",
    arc: "Kim Seonpum\u2019s ledgers are Jahee\u2019s childhood. When Bupmin posts to the quay, he marries into the harbour before he marries into bone rank. The court later names her Queen Jayi.",
    events: [{ year: 644, label: "Bupmin meets Jahee under Seonpum\u2019s roof of accounts." }],
    aliases: ["Seonpum & Jahee", "Jahee & Seonpum", "Seonpum & Jayi", "Jayi & Seonpum"]
  },
  {
    id: "rel-yushin-gyebek",
    name: "Yushin & Gyebek",
    korean: "\uC720\uC2E0 \xB7 \uACC4\uBC31",
    entity: "relationship",
    kingdom: "baekje",
    bond: "rival",
    between: ["yushin", "gyebek"],
    title: "Hwangsanbeol",
    tagline: "Fifty thousand against five thousand \u2014 four assaults, one afternoon.",
    arc: "The marshal of Silla meets the named general of Baekje on the Yellow Mountain plain. Gyebek turns Yushin back four times before Gwanchang\u2019s death shames the Silla line forward. The fifth assault ends the five thousand \u2014 and the two commanders enter the same afternoon of history from opposite sides.",
    events: [{ year: 660, label: "Hwangsanbeol \u2014 four repulses, then the end." }],
    aliases: ["Yushin & Gyebek", "Gyebek & Yushin"]
  },
  {
    id: "rel-gesomun-yangmanchun",
    name: "Yeon & the Guardian of Ansi",
    korean: "\uC5F0\uAC1C\uC18C\uBB38 \xB7 \uC548\uC2DC\uC131\uC8FC",
    entity: "relationship",
    kingdom: "goguryeo",
    bond: "sworn",
    between: ["gesomun", "yangmanchun"],
    title: "Supreme Commander and Ansi\u2019s wall",
    tagline: "One remakes the court; one proves the wall still works.",
    arc: "After 642 Yeon\u2019s kingdom needs a legend that is not only knives. The nameless Guardian of Ansi holds his wall against Taizong and joins the Hall of Heroes list Yeon has been auditioning for his whole life.",
    events: [{ year: 645, label: "Ansi holds; Taizong turns back." }],
    aliases: ["Yeon & the Guardian of Ansi", "Gesomun & the Guardian of Ansi"]
  },
  {
    id: "rel-chunchu-ongunhae",
    name: "Chunchu & On Gunhae",
    korean: "\uCD98\uCD94 \xB7 \uC628\uAD70\uD574",
    entity: "relationship",
    kingdom: "silla",
    bond: "sworn",
    between: ["chunchu", "ongunhae"],
    title: "The coat and the small boat",
    tagline: "One sat in the high cap. One went home.",
    arc: "On Gunhae attends the Tang embassy and, on the Yellow Sea, wears Chunchu\u2019s high cap and great coat so the Goguryeo patrol takes the wrong man. Chunchu reaches Silla in a small boat. Jinduk posthumously names Gunhae a Daeachan.",
    events: [{ year: 649, label: "The patrol ship; the decoy; the small boat." }],
    aliases: ["Chunchu & On Gunhae", "On Gunhae & Chunchu"]
  },
  {
    id: "rel-kingmu-euija",
    name: "King Mu & Euija",
    korean: "\uBB34\uC655 \xB7 \uC758\uC790",
    entity: "relationship",
    kingdom: "baekje",
    bond: "kin",
    between: ["kingmu", "euija"],
    dynamic: { en: "Ageing father \xB7 ambitious, cynical son", ko: "\uB299\uC5B4 \uAC00\uB294 \uC544\uBC84\uC9C0 \xB7 \uC57C\uC2EC \uB9CE\uACE0 \uB0C9\uC18C\uC801\uC778 \uC544\uB4E4" },
    still: "rel-mu-euija",
    title: "Learn their names anyway",
    tagline: "The old king says the clan names first. His son would rather not learn them.",
    arc: "King Mu bought a country with a children\u2019s song and spent his reign fighting Silla. Euija grows up admiring the trick and despising the clans that make it necessary. The father\u2019s one plain lesson \u2014 learn their names anyway \u2014 is the one the son keeps after he stops keeping anything else; on his coronation morning he stages a dragon over the Sabi because his father once staged a song.",
    events: [
      { year: 632, label: "Learn their names anyway." },
      { year: 641, label: "Mu dies; Euija takes the throne to finish his war." }
    ],
    aliases: ["King Mu & Euija", "Euija & King Mu", "Mu & Euija"]
  },
  {
    id: "rel-munmu-gotaso",
    name: "Bupmin & Gotaso",
    korean: "\uBC95\uBBFC \xB7 \uACE0\uD0C0\uC18C",
    entity: "relationship",
    kingdom: "silla",
    bond: "kin",
    between: ["munmu", "gotaso"],
    dynamic: { en: "Loving siblings", ko: "\uB2E4\uC815\uD55C \uB0A8\uB9E4" },
    still: "rel-bupmin-gotaso",
    title: "Not racing \u2014 following",
    tagline: "She shouted faster. He insisted he wasn\u2019t racing.",
    arc: "A year apart and inseparable: Gotaso demands faster, Bupmin insists he is only following. She marries for love and rides to Daeya; he waits at the gate for a sister who promised forever and learns the empty road from Munhee. \u201CI will make a country where sisters come home\u201D is the first thing he says like a king for all.",
    events: [
      { year: 632, label: "The palace-road ride: faster, and following." },
      { year: 642, label: "Daeya falls; he waits at the gate." }
    ],
    aliases: ["Bupmin & Gotaso", "Gotaso & Bupmin", "Munmu & Gotaso"]
  },
  {
    id: "rel-seohyeon-yushin",
    name: "Seohyeon & Yushin",
    korean: "\uC11C\uD604 \xB7 \uC720\uC2E0",
    entity: "relationship",
    kingdom: "silla",
    bond: "kin",
    between: ["seohyeon", "yushin"],
    dynamic: { en: "Stern father with an immigrant\u2019s work ethic \xB7 son eager for acceptance", ko: "\uC774\uC8FC\uBBFC\uC758 \uADFC\uBA74\uC744 \uC9C0\uB2CC \uC5C4\uD55C \uC544\uBC84\uC9C0 \xB7 \uC778\uC815\uBC1B\uACE0 \uC2F6\uC740 \uC544\uB4E4" },
    still: "rel-seohyeon-yushin",
    title: "Your helmet\u2019s crooked",
    tagline: "A Gaya father who proved belonging by service, and a son who wanted him to say so.",
    arc: "Seohyeon made the surrender of Gaya into a Silla household by working harder than anyone born to it, and raised his son the same way: no praise, only the next order. At Nangbi Yushin takes off his helmet before him to ask leave; Seohyeon tells him to put it back on and go. When the son comes back with a general\u2019s head, the father straightens the helmet with both hands \u2014 the most he ever says. His ghost says the rest before Radiance\u2019s tenth day.",
    events: [
      { year: 629, label: "Nangbi: \u201CPut your helmet on. Then go.\u201D" },
      { year: 647, label: "Ghost in the cavern \u2014 \u201CYou are Kim Yushin.\u201D" }
    ],
    aliases: ["Seohyeon & Yushin", "Yushin & Seohyeon"]
  },
  {
    id: "rel-sukwon-bidam",
    name: "Sukwon & Bidam",
    korean: "\uC219\uC6D0 \xB7 \uBE44\uB2F4",
    entity: "relationship",
    kingdom: "silla",
    bond: "kin",
    between: ["sukwon", "bidam"],
    dynamic: { en: "Aristocratic father and son", ko: "\uADC0\uC871 \uAC00\uBB38\uC758 \uC544\uBC84\uC9C0\uC640 \uC544\uB4E4" },
    still: "rel-bidam-sukwon",
    title: "The higher teaching",
    tagline: "An old-hall father who sent his son to the yard with one question and a tight headband.",
    arc: "Son Sukwon of Musan hall named his boy after the Abhidharma and taught by asking. On Class 51\u2019s first morning he walks Bidam to the yard gate and no further: rather a righteous traitor than an unrighteous king. He dies before Radiance; the teaching does not, and it is the sentence Bidam carries into the rebellion.",
    events: [
      { year: 610, label: "Ties the headband once, tight, at the yard gate." },
      { year: 647, label: "His son raises the banner at Radiance." }
    ],
    aliases: ["Sukwon & Bidam", "Bidam & Sukwon", "Bidam & his father"]
  },
  {
    id: "rel-yongsu-chunchu",
    name: "Yongsu & Chunchu",
    korean: "\uC6A9\uC218 \xB7 \uCD98\uCD94",
    entity: "relationship",
    kingdom: "silla",
    bond: "kin",
    between: ["yongsu", "chunchu"],
    dynamic: { en: "Brilliant, odd father \xB7 intelligent son", ko: "\uC601\uB9AC\uD558\uC9C0\uB9CC \uAE30\uC774\uD55C \uC544\uBC84\uC9C0 \xB7 \uCD1D\uBA85\uD55C \uC544\uB4E4" },
    still: "rel-yongsu-chunchu",
    title: "The night bridge",
    tagline: "A strange, brilliant father who talked to the dark, and the son who carried the lamp.",
    arc: "Kim Yongsu is the deposed King Jinji\u2019s son, and the Bihyung streak runs in him: up past midnight by the stream, talking to things nobody else can see, laying a bridge of stones before dawn. He is also the cleverest man in the house. He tells nine-year-old Chunchu the Council\u2019s three counts and one rule \u2014 stay out of the room that eats the men who amuse it \u2014 and Chunchu spends his life sitting wherever the room has to come to him.",
    events: [
      { year: 612, label: "The night bridge \u2014 \u201CStay out of that room.\u201D" }
    ],
    aliases: ["Yongsu & Chunchu", "Chunchu & Yongsu"]
  },
  {
    id: "rel-sunduk-chunchu",
    name: "Sunduk & Chunchu",
    korean: "\uC120\uB355 \xB7 \uCD98\uCD94",
    entity: "relationship",
    kingdom: "silla",
    bond: "kin",
    between: ["sunduk", "chunchu"],
    dynamic: { en: "Loving aunt \xB7 nephew who comes to her for advice", ko: "\uB2E4\uC815\uD55C \uC774\uBAA8 \xB7 \uC870\uC5B8\uC744 \uAD6C\uD558\uB7EC \uC624\uB294 \uC870\uCE74" },
    still: "rel-sunduk-chunchu",
    title: "The aunt he asks first",
    tagline: "He brings her the plan. She comes down the steps to hear it.",
    arc: "Chunchu\u2019s aunt by blood and his queen by vote. When the most cunning man in Samhan needs a second mind he comes to her before he comes to the Council. After Daeya he asks her again and again to send him north, and the night she finally says yes she says it sitting on the lowest step of her own dais.",
    events: [
      { year: 632, label: "She is crowned; he becomes the nephew with the plans." },
      { year: 642, label: "She lets him go north to Pyongyang." }
    ],
    aliases: ["Sunduk & Chunchu", "Chunchu & Sunduk"]
  },
  {
    id: "rel-chunmyung-chunchu",
    name: "Chunmyung & Chunchu",
    korean: "\uCC9C\uBA85 \xB7 \uCD98\uCD94",
    entity: "relationship",
    kingdom: "silla",
    bond: "kin",
    between: ["chunmyung", "chunchu"],
    dynamic: { en: "Intelligent son \xB7 ageing mother", ko: "\uCD1D\uBA85\uD55C \uC544\uB4E4 \xB7 \uB299\uC5B4 \uAC00\uB294 \uC5B4\uBA38\uB2C8" },
    still: "rel-chunmyung-chunchu",
    title: "Still bigger than you in this hall",
    tagline: "She gave up a crown for his father and never mentioned it. She mentions very little.",
    arc: "Princess Chunmyung stepped out of the Sacred Bone succession to marry a True Bone, and raised the son who would found the Gyeongju Kim throne anyway. She let his father teach him to count and let him grow cleverer than her without once being impressed. The night Daeya falls she finds him on the floor below the dais and tells him to stop counting.",
    events: [
      { year: 603, label: "Chunchu is born." },
      { year: 642, label: "The night Daeya falls: \u201CPut your head down.\u201D" }
    ],
    aliases: ["Chunmyung & Chunchu", "Chunchu & Chunmyung"]
  }
];

// src/lib/places.ts
var PLACE_KIND_LABEL = {
  city: "City / Fortress",
  mountain: "Mountain",
  river: "River",
  harbor: "Harbour",
  cave: "Cavern",
  realm: "Realm"
};
var PLACES = {
  // ————————————————————————— Goguryeo —————————————————————————
  pyongyang: {
    id: "pyongyang",
    name: "Pyongyang",
    korean: "\uD3C9\uC591\uC131",
    hanja: "\u5E73\u58E4\u57CE",
    x: 258,
    y: 456,
    kind: "city",
    side: "goguryeo",
    capital: true,
    avatar: "/pl_pyongyang_city.png",
    gallery: ["/pl_pyongyang_fortress.png"],
    blurb: "Red Sun\u2019s capital \u2014 Goguryeo\u2019s seat. Yeon Gesomun butchers the court here in 642; the walls hold every siege until they are opened from inside in 668.",
    sobriquets: ["City of the Red Sun"],
    aliases: ["Pyongyang", "\uD3C9\uC591\uC131", "City of the Red Sun"]
  },
  yodong: {
    id: "yodong",
    name: "Yodong",
    korean: "\uC694\uB3D9\uC131",
    hanja: "\u907C\u6771\u57CE",
    x: 153,
    y: 342,
    kind: "city",
    side: "goguryeo",
    avatar: "/pl_eastern.png",
    blurb: "The great western fortress guarding the Liao. Taizong storms it in the fifth month of 645.",
    aliases: ["Yodong", "\uC694\uB3D9\uC131", "Eastern Fortress"]
  },
  buyeo_fort: {
    id: "buyeo_fort",
    name: "Buyeo Fortress",
    korean: "\uBD80\uC5EC\uC131",
    x: 239,
    y: 179,
    kind: "city",
    side: "goguryeo",
    avatar: "/pl_yeon_fortress.png",
    blurb: "Yeon Gesomun\u2019s home fortress, at the top of the thousand-li wall \u2014 snow, stone, one red munru above the cloud sea. As far from Pyongyang as an order can travel and still be obeyed. The steppe is the next thing north.",
    aliases: ["Buyeo Fortress", "\uBD80\uC5EC\uC131", "Eastern Hall", "Yeon fortress", "\uC5F0\uC528 \uB3D9\uBD80\uC0B0\uC131"]
  },
  sinseong: {
    id: "sinseong",
    name: "New Fortress",
    korean: "\uC2E0\uC131 (\uBB34\uC21C)",
    x: 186,
    y: 310,
    kind: "city",
    side: "goguryeo",
    blurb: "The wall\u2019s anchor on the northern road. In 645 the emperor\u2019s cousin spends ten days under it and leaves with nothing.",
    aliases: ["New Fortress", "\uC2E0\uC131"]
  },
  gaemo: {
    id: "gaemo",
    name: "Gaemo",
    korean: "\uAC1C\uBAA8\uC131",
    x: 164,
    y: 319,
    kind: "city",
    side: "goguryeo",
    blurb: "The next fort down the line. It lasts a little over ten days in 645, and the seven hundred men Yeon sent to hold it ask to serve the emperor instead.",
    aliases: ["Gaemo", "\uAC1C\uBAA8\uC131"]
  },
  baegam: {
    id: "baegam",
    name: "White Rock",
    korean: "\uBC31\uC554\uC131",
    x: 163,
    y: 336,
    kind: "city",
    side: "goguryeo",
    blurb: "A cliff fort east of Yodong. Yeon\u2019s riders break out and put a spear in a Tang general\u2019s waist; the fort\u2019s lord opens the gate anyway.",
    aliases: ["White Rock", "White Rock Fortress", "\uBC31\uC554\uC131"]
  },
  geonan: {
    id: "geonan",
    name: "Geonan",
    korean: "\uAC74\uC548\uC131",
    x: 118,
    y: 387,
    kind: "city",
    side: "goguryeo",
    blurb: "South of Ansi on the coast road. In 645 the emperor\u2019s generals tell him to take it first. He goes to look at Ansi instead.",
    aliases: ["Geonan", "\uAC74\uC548\uC131"]
  },
  bisa: {
    id: "bisa",
    name: "Bisa",
    korean: "\uBE44\uC0AC\uC131 (\uB300\uB828)",
    x: 93,
    y: 453,
    kind: "city",
    side: "goguryeo",
    blurb: "The last stone of the wall, on the cape where the land runs out. The Tang fleet comes at it from the sea in 645 and takes it in a month.",
    aliases: ["Bisa Fortress", "\uBE44\uC0AC\uC131"]
  },
  liao: {
    id: "liao",
    name: "Liao River",
    korean: "\uC694\uD558",
    x: 127,
    y: 349,
    kind: "river",
    side: "goguryeo",
    cityId: "yodong",
    blurb: "Two hundred li of marsh between the empire and the wall. A Sui host once went in up to the knee and came out as a song. In 645 the Tang lay a road across it, then tear the road up behind them.",
    aliases: ["Liao River", "Liao marsh", "\uC694\uD558"]
  },
  amnok: {
    id: "amnok",
    name: "Amnok River",
    korean: "\uC555\uB85D\uAC15",
    hanja: "\u9D28\u7DA0\u6C5F",
    x: 214,
    y: 394,
    kind: "river",
    side: "goguryeo",
    cityId: "gungnae",
    avatar: "/pl_amnok_river.png",
    gallery: ["/pl_amnok_pavillion.png"],
    blurb: "Habaek\u2019s river, with three daughters in it. The sun god crosses it on the same hour every day, until the day he looks down.",
    aliases: ["Amnok River", "the Amnok", "Amnok", "\uC555\uB85D\uAC15"]
  },
  hwando: {
    id: "hwando",
    name: "Hwando",
    korean: "\uD658\uB3C4\uC0B0\uC131",
    hanja: "\u4E38\u90FD\u5C71\u57CE",
    x: 275,
    y: 346,
    kind: "city",
    side: "goguryeo",
    blurb: "The mountain fort above Gungnae. It burns in 244, after a king picks a fight on ground he had not looked at.",
    aliases: ["Hwando", "\uD658\uB3C4\uC0B0\uC131"]
  },
  ansi: {
    id: "ansi",
    name: "Ansi",
    korean: "\uC548\uC2DC\uC131",
    hanja: "\u5B89\u5E02\u57CE",
    x: 135,
    y: 364,
    kind: "city",
    side: "goguryeo",
    avatar: "/pl_ansi.png",
    blurb: "The wall that stopped an emperor. Its commander \u2014 unnamed in the histories \u2014 held out through the summer of 645 and handed Taizong the first defeat of his life.",
    sobriquets: ["Wall that Stopped an Emperor"],
    aliases: ["Ansi", "\uC548\uC2DC\uC131"]
  },
  central: {
    id: "central",
    name: "Central",
    korean: "\uC911\uBD80",
    x: 285,
    y: 405,
    kind: "city",
    side: "goguryeo",
    blurb: "Seat of the Central Commandery, one of Goguryeo\u2019s Five. High Commander Yeon Gusesa shouts Yeon down from that chair at the High Summit of 634."
  },
  paektu: {
    id: "paektu",
    name: "Mt. Paektu",
    korean: "\uBC31\uB450\uC0B0",
    x: 358,
    y: 302,
    kind: "mountain",
    side: "goguryeo",
    cityId: "jolbon",
    avatar: "/pl_baekdu.png",
    blurb: "The white-headed mountain at the roof of the peninsula \u2014 the sacred boundary of the northern world."
  },
  jupil: {
    id: "jupil",
    name: "Mt. Jupil",
    korean: "\uC8FC\uD544\uC0B0",
    hanja: "\u99D0\u8E55\u5C71",
    x: 144,
    y: 355,
    kind: "mountain",
    side: "goguryeo",
    cityId: "ansi",
    blurb: "Stallion Mountain. Taizong destroys a Goguryeo field army here in the sixth month of 645 \u2014 and rejoices at gaining a brave general rather than at the victory."
  },
  salsu: {
    id: "salsu",
    name: "Colossal River",
    korean: "\uC0B4\uC218 (\uCCAD\uCC9C\uAC15)",
    hanja: "\u85A9\u6C34",
    aliases: ["Colossal River", "Salsu", "\uC0B4\uC218", "Great River"],
    x: 251,
    y: 426,
    kind: "river",
    side: "goguryeo",
    cityId: "pyongyang",
    blurb: "The Salsu. Ulchi Munduk drowned an entire Sui host here in 612 \u2014 and sent its general a poem about it afterwards."
  },
  sasu: {
    id: "sasu",
    name: "Snake River",
    korean: "\uC0AC\uC218",
    hanja: "\u86C7\u6C34",
    x: 267,
    y: 462,
    kind: "river",
    side: "goguryeo",
    cityId: "pyongyang",
    avatar: "/pl_snake_river.png",
    blurb: "Where Yeon Gesomun destroyed the White Tiger\u2019s army in the second month of 662 \u2014 one of the great victories of Goguryeo\u2019s last decade."
  },
  seokmun: {
    id: "seokmun",
    name: "Stone Gate",
    korean: "\uC11D\uBB38",
    hanja: "\u77F3\u9580",
    x: 275,
    y: 487,
    kind: "river",
    side: "goguryeo",
    cityId: "pyongyang",
    avatar: "/pl_stone_gate.png",
    blurb: "Seokmun. Silla\u2019s costly defeat in the eighth month of 672, early in the war to expel the Tang."
  },
  jolbon: {
    id: "jolbon",
    name: "Jolbon",
    korean: "\uC878\uBCF8 (\uD658\uC778)",
    hanja: "\u5352\u672C",
    x: 244,
    y: 341,
    kind: "cave",
    side: "jolbon",
    avatar: "/pl_jumong_cave.png",
    gallery: ["/pl_jolbon.png"],
    title: "Jumong Cavern \u2014 where the holy king prayed",
    blurb: "Every northern vow begins in the cave Jumong hollowed out \u2014 \uAD6D\uB3D9\uB300\uD608, where every Goguryeo heir renews the vow before blood.",
    arc: "Before the tortoise-bridge and the founding, Jumong knelt in this hollow and asked heaven for a country that would outlast his brothers\u2019 hatred. The cavern remembers the bow, the egg, the sun-line \u2014 and later kings come back not for scenery but for permission. Gesomun kneels here in the tenth month of 642, three nights after the banquet knives, and thanks the holy king for a direction; Yeon\u2019s sons grow up hearing the story as weather you inherit. When Goguryeo falls, the cave does not. Later crowns still argue about who descended from the man who prayed here.",
    events: [
      { year: -37, label: "Jumong founds Goguryeo at Jolbon after the river gives way." },
      { year: -37, label: "He prays in the cavern (\uAD6D\uB3D9\uB300\uD608) for a kingdom of his own." },
      { year: 642, label: "Gesomun prays here after the Pyongyang massacre." }
    ],
    aliases: ["Jolbon", "Jumong Cavern", "\uAD6D\uB3D9\uB300\uD608", "Jumong Cave", "\uC878\uBCF8"]
  },
  pine_kingdom: {
    id: "pine_kingdom",
    name: "Pine Kingdom",
    korean: "\uC18C\uB098\uBB34 \uB098\uB77C",
    hanja: "\u677E\u570B",
    x: 250,
    y: 324,
    kind: "city",
    side: "jolbon",
    title: "Song Yang\u2019s pine roof",
    blurb: "Song Yang\u2019s timber country beside Jolbon \u2014 pines, packed earth, one giwa hall. Jumong annexed the roof to get Oi, Mari, and Hyupbo back.",
    arc: "The ridge path after Jumong\u2019s river split does not run to Tabal\u2019s yard. It runs here. Song Yang holds the three as guests who do not leave until King Jumong \u2014 Queen Sosuno on the rail \u2014 takes a single shaft in this packed-earth yard and yields both the friends and the country. The ledgers may write \u677E\u570B; mouths say \uC18C\uB098\uBB34 \uB098\uB77C. The name is not the later son\u2019s.",
    events: [{ year: -37, label: "Song Yang yields the pine roof; Jumong\u2019s three friends return to Jolbon." }],
    aliases: ["Pine Kingdom", "\uC18C\uB098\uBB34 \uB098\uB77C", "\u677E\u570B", "Song Yang\u2019s pine roof"]
  },
  gungnae: {
    id: "gungnae",
    name: "Gungnae Fortress",
    korean: "\uAD6D\uB0B4\uC131 (\uC9D1\uC548)",
    hanja: "\u570B\u5167\u57CE",
    x: 279,
    y: 348,
    kind: "city",
    side: "goguryeo",
    blurb: "The second capital, and the site of the Gwanggaeto Stele. Wei troops sacked it in 244."
  },
  // ————————————————————————— Silla —————————————————————————
  surabol: {
    id: "surabol",
    name: "Surabol",
    korean: "\uC11C\uB77C\uBC8C (\uACBD\uC8FC)",
    hanja: "\u5F90\u7F85\u4F10",
    x: 400,
    y: 618,
    kind: "city",
    side: "silla",
    capital: true,
    avatar: "/pl_eastern_palace.png",
    blurb: "Capital of the Divine Country. Queen Sunduk is crowned here in 632, Bidam rebels at its Fortress of Radiance in 647, and Munmu is proclaimed King of Samhan here in 676.",
    sobriquets: ["Capital of the Divine Country"],
    aliases: ["Surabol", "\uC11C\uB77C\uBC8C", "Capital of the Divine Country"]
  },
  radiance: {
    id: "radiance",
    name: "Radiance Fortress",
    korean: "\uBA85\uD65C\uC131",
    hanja: "\u660E\u6D3B\u57CE",
    x: 404,
    y: 617,
    kind: "city",
    side: "silla",
    avatar: "/pl_radiance_fortress.png",
    blurb: "The mountain fort just east of Surabol, close enough to see the palace roofs. In 647 Bidam raises his banners on its wall, and the capital watches him do it.",
    aliases: ["Radiance Fortress", "Fortress of Radiance", "Myeonghwal Fortress", "\uBA85\uD65C\uC131"]
  },
  nangbi: {
    id: "nangbi",
    name: "Nangbi Fortress",
    korean: "\uB0AD\uBE44\uC131",
    hanja: "\u5A18\u81C2\u57CE",
    x: 329,
    y: 577,
    kind: "city",
    side: "silla",
    blurb: "Where a young Kim Yushin rides into the Goguryeo line alone, three times, in 629. The horse under him that day carries him for eighteen years.",
    aliases: ["Nangbi Fortress", "Nangbi", "\uB0AD\uBE44\uC131"]
  },
  steam_cavern: {
    id: "steam_cavern",
    name: "Steam Cavern",
    korean: "\uAE40 \uB3D9\uAD74",
    hanja: "\u84B8\u6D1E\u7A9F",
    x: 382,
    y: 606,
    kind: "cave",
    side: "silla",
    cityId: "surabol",
    avatar: "/pl_cave.png",
    title: "Yushin\u2019s cavern lake in the hills",
    blurb: "\uAE40 \u2014 steam and surname in the same breath. A bowl of black water under stone \u2014 the only room in Silla where no one asks Kim Yushin for a victory, and where the dead Kims sometimes come back.",
    arc: "Kim Seohyeon found it first: naked, clean-shaven, and only men surnamed Kim \u2014 \uAE40, the same sound as steam. Narim, Golhwa and Hyull\xE9 loved him; every later Kim is heirloom. Between campaigns Yushin rides alone, strips at the rock lip, and bathes in cold steam while the three wait \u2014 mentors, tormentors, beautiful predators who give real counsel. But the lake is not only goddesses: when the steam thins, Muryuk and Seohyeon stand on the shelf, and once even Dangun walked the water for a king who did not know his name. The lake does not require prayer. It requires honesty. The histories keep the fortresses. This place keeps the men.",
    events: [
      { label: "Seohyeon finds the lake; the three goddesses love the first Kim." },
      { label: "Yushin first finds the three in the steam; Narim sends the younger two away and is caught kissing him." },
      { year: 642, label: "After Daeya he returns for quiet counsel before the road north." },
      { year: 647, label: "Before Bidam\u2019s tenth day \u2014 Seohyeon and Muryuk appear; \u201CYou are Kim Yushin.\u201D" },
      { year: 673, label: "Old, between paperwork wars, his father and grandfather visit once more." },
      { year: 673, label: "After Yushin\u2019s death Munmu enters; Dangun names the wanggeom\u2019s work." }
    ],
    aliases: [
      "Steam Cavern",
      "steam cavern",
      "cavern lake",
      "\uAE40 \uB3D9\uAD74",
      "\uB3D9\uAD74 \uD638\uC218",
      "Steam Cavern Lake"
    ]
  },
  maeso: {
    id: "maeso",
    name: "Maeso",
    korean: "\uB9E4\uC18C\uC131 (\uC5F0\uCC9C)",
    hanja: "\u8CB7\u8096\u57CE",
    x: 313,
    y: 504,
    kind: "city",
    side: "silla",
    blurb: "Maeso Fortress. In the ninth month of 675 Silla broke a Tang army here and turned the Silla\u2013Tang war."
  },
  wirye: {
    id: "wirye",
    name: "Wirye",
    korean: "\uC704\uB840\uC131 (\uC11C\uC6B8)",
    x: 313,
    y: 532,
    kind: "city",
    side: "silla",
    avatar: "/pl_wirye.png",
    blurb: "Baekje\u2019s first capital, founded by Onjo \u2014 and by the 640s the contested Han valley that all three kingdoms had held in turn."
  },
  danghang: {
    id: "danghang",
    name: "Danghang",
    korean: "\uB2F9\uD56D\uC131 (\uD654\uC131)",
    hanja: "\u515A\u9805\u57CE",
    x: 301,
    y: 549,
    kind: "harbor",
    side: "silla",
    cityId: "wirye",
    blurb: "Silla\u2019s only harbour to Tang, Tianzhu and the western regions. Euija points at it on the map and tells Yeon exactly where to cut."
  },
  daeya: {
    id: "daeya",
    name: "Daeya",
    korean: "\uB300\uC57C\uC131 (\uD569\uCC9C)",
    hanja: "\u5927\u8036\u57CE",
    x: 356,
    y: 632,
    kind: "city",
    side: "silla",
    avatar: "/pl_daeya_fortress.png",
    blurb: "The border fortress lost in the eighth month of 642. Chunchu\u2019s daughter Gotaso died here, and the war that ends three kingdoms starts from it."
  },
  gibeolpo: {
    id: "gibeolpo",
    name: "Final Ford",
    korean: "\uAE30\uBC8C\uD3EC (\uC7A5\uD56D)",
    hanja: "\u4F0E\u4F10\u6D66",
    aliases: ["Final Ford", "Gibeolpo", "\uAE30\uBC8C\uD3EC", "Strike Harbor"],
    x: 292,
    y: 610,
    kind: "harbor",
    side: "silla",
    cityId: "surabol",
    blurb: "Gibeolpo, at the mouth of the Geum. Seongchung died in prison begging Euija to hold it; in the eleventh month of 676 Silla\u2019s victory here ended the Tang war."
  },
  // ————————————————————————— Baekje —————————————————————————
  sabi: {
    id: "sabi",
    name: "Sabi",
    korean: "\uC0AC\uBE44 (\uBD80\uC5EC)",
    hanja: "\u6CD7\u6C98",
    x: 305,
    y: 596,
    kind: "city",
    side: "baekje",
    capital: true,
    avatar: "/pl_sabi_palace.png",
    gallery: ["/pl_sabi_port.png"],
    blurb: "Capital of the Heavenly Deer. Euija seats forty-one of his own sons in the Assembly here in 655, and the city falls to the Silla\u2013Tang army in 660.",
    sobriquets: ["Capital of the Heavenly Deer"],
    aliases: ["Sabi", "\uC0AC\uBE44", "Capital of the Heavenly Deer"]
  },
  sabi_tourney: {
    id: "sabi_tourney",
    name: "Sabi tournament yard",
    korean: "\uC0AC\uBE44 \uC2DC\uD569\uB730",
    x: 305,
    y: 620,
    kind: "city",
    side: "baekje",
    cityId: "sabi",
    offMap: true,
    avatar: "/pl_sabi_tourney.png",
    blurb: "Packed earth in front of the palace. Once a year the court chalks a white square; Euija\u2019s five named sons step on in white, and the clans keep score from the hall bar.",
    aliases: ["Sabi tournament yard", "\uC0AC\uBE44 \uC2DC\uD569\uB730"]
  },
  hwangsan: {
    id: "hwangsan",
    name: "Yellow Mountain",
    korean: "\uD669\uC0B0\uBC8C (\uB17C\uC0B0)",
    hanja: "\u9EC3\u5C71\u4F10",
    x: 313,
    y: 600,
    kind: "mountain",
    side: "baekje",
    cityId: "sabi",
    avatar: "/pl_yellow_mountain.png",
    blurb: "Field of the disputed blade \u2014 Hwangsanbeol, where Hundred-Victories Gyebek met fifty thousand with five thousand in 660, having killed his own family first so nothing could be used against him.",
    sobriquets: ["Field of the Disputed Blade"],
    aliases: ["Yellow Mountain", "Hwangsanbeol", "\uD669\uC0B0\uBC8C", "Field of the Disputed Blade"]
  },
  baekgang: {
    id: "baekgang",
    name: "White River",
    korean: "\uBC31\uAC15 (\uAE08\uAC15 \uD558\uAD6C)",
    hanja: "\u767D\u6C5F",
    x: 300,
    y: 614,
    kind: "river",
    side: "baekje",
    cityId: "sabi",
    avatar: "/pl_white_river.png",
    blurb: "Mouth where four fleets burned \u2014 the Baekgang. In the eighth month of 663 Tang, Silla, Baekje and Yamato fought here \u2014 the first time all four met in one battle \u2014 and four hundred eastern ships burned.",
    sobriquets: ["Mouth Where Four Fleets Burned"],
    aliases: ["White River", "Baekgang", "\uBC31\uAC15", "Mouth Where Four Fleets Burned"]
  },
  ungjin: {
    id: "ungjin",
    name: "Bear Fortress",
    korean: "\uC6C5\uC9C4\uC131 (\uACF5\uC8FC)",
    hanja: "\u718A\u6D25\u57CE",
    x: 313,
    y: 587,
    kind: "city",
    side: "baekje",
    avatar: "/pl_bear_fortress.png",
    blurb: "Ungjin. Euija fled here when Sabi fell, and its guardian Ye Sikjin handed him to the Tang.",
    aliases: ["Bear Fortress", "Bear Ford", "Ungjin", "\uC6C5\uC9C4\uC131"]
  },
  chwiri: {
    id: "chwiri",
    name: "Mount Gain",
    korean: "\uCDE8\uB9AC\uC0B0",
    hanja: "\u5C31\u5229\u5C71",
    x: 309,
    y: 601,
    kind: "mountain",
    side: "baekje",
    cityId: "ungjin",
    offMap: true,
    blurb: "A hill outside Bear Ford. In 665 the empire makes the two men who rule the south swear to be brothers here. The clerks name it the Mountain Where One Goes for Gain.",
    aliases: ["Mount Gain", "Mountain Where One Goes for Gain", "\uCDE8\uB9AC\uC0B0"]
  },
  juryu: {
    id: "juryu",
    name: "Juryu Fortress",
    korean: "\uC8FC\uB958\uC131 (\uBD80\uC548)",
    hanja: "\u5468\u7559\u57CE",
    x: 297,
    y: 626,
    kind: "city",
    side: "baekje",
    blurb: "Base of the Baekje restoration. Prince Pung moved off it against advice, had to move back, and executed Boksin here."
  },
  imjon: {
    id: "imjon",
    name: "Imjon Fortress",
    korean: "\uC784\uC874\uC131 (\uC608\uC0B0)",
    x: 302,
    y: 576,
    kind: "city",
    side: "baekje",
    blurb: "Where Heukchi Sangji rallied thirty thousand within ten days of Sabi\u2019s fall."
  },
  gwansan: {
    id: "gwansan",
    name: "Gwansanseong",
    korean: "\uAD00\uC0B0\uC131 (\uC625\uCC9C)",
    hanja: "\u7BA1\u5C71\u57CE",
    x: 332,
    y: 595,
    kind: "city",
    side: "baekje",
    blurb: "Where Jinheung\u2019s betrayal ended: King Seong of Baekje was caught riding at night in 554, and a stable-slave named Dodo took his head."
  },
  michuhol: {
    id: "michuhol",
    name: "Michuhol",
    korean: "\uBBF8\uCD94\uD640 (\uC778\uCC9C)",
    hanja: "\u5F4C\u9112\u5FFD",
    x: 295,
    y: 536,
    kind: "city",
    side: "baekje",
    blurb: "The salt marshes Biryu chose over his brother\u2019s ground \u2014 and regretted."
  },
  // ————————————————————————— Gaya, Tamla, beyond —————————————————————————
  geumgwan: {
    id: "geumgwan",
    name: "Golden Gaya",
    korean: "\uAE08\uAD00\uAC00\uC57C (\uAE40\uD574)",
    hanja: "\u91D1\u5B98\u52A0\u8036",
    x: 386,
    y: 649,
    kind: "city",
    side: "gaya",
    blurb: "Founded in 42 by Suro, who hatched from one of six eggs. Its last prince surrendered to Silla in 532 \u2014 his grandson was Kim Yushin."
  },
  daegaya: {
    id: "daegaya",
    name: "Great Gaya",
    korean: "\uB300\uAC00\uC57C (\uACE0\uB839)",
    hanja: "\u5927\u52A0\u8036",
    x: 360,
    y: 624,
    kind: "city",
    side: "gaya",
    blurb: "The last Gaya kingdom, taken by Jinheung and the young Hwarang Sadaham in 562."
  },
  mugun: {
    id: "mugun",
    name: "Mugun",
    korean: "\uBB34\uADFC (\uD0D0\uB77C)",
    hanja: "\u803D\u7F85",
    x: 287,
    y: 739,
    kind: "city",
    side: "tamla",
    capital: true,
    avatar: "/pl_mugun_fortress.png",
    blurb: "The seat of Tamla, the island of oranges. Gyebek spent five years exiled here learning its stories, and in 662 the island changed sides."
  },
  manchuria: {
    id: "manchuria",
    name: "The Eastern March",
    korean: "\uB9CC\uC8FC \uB3D9\uBD80",
    x: 330,
    y: 262,
    kind: "mountain",
    side: "goguryeo",
    cityId: "central",
    blurb: "Yeon Gesomun\u2019s frontier command \u2014 the snowbound outposts where he made the Eastern Commandery the safest in the kingdom, and the capital hated him for it."
  },
  asadal: {
    id: "asadal",
    name: "Asadal",
    korean: "\uC544\uC0AC\uB2EC",
    hanja: "\u963F\u65AF\u9054",
    x: 239,
    y: 477,
    kind: "city",
    side: "other",
    avatar: "/pl_rock_politics.png",
    blurb: "Dangun\u2019s city, and later Wanggeom \u2014 the capital of Old Joseon, which fell to the Han in 108 BCE."
  },
  buyeo_north: {
    id: "buyeo_north",
    name: "Buyeo",
    korean: "\uBD80\uC5EC",
    hanja: "\u592B\u9918",
    x: 295,
    y: 208,
    kind: "city",
    side: "buyeo",
    capital: true,
    avatar: "/pl_buyeo_yard.png",
    gallery: ["/pl_northern_buyeo.png", "/pl_buyeo_palace.png", "/pl_yuhwa_hut.png"],
    blurb: "The northern kingdom Jumong fled, and where Lady Ye raised his heir alone."
  },
  changan: {
    id: "changan",
    name: "Chang\u2019an",
    korean: "\uC7A5\uC548",
    hanja: "\u9577\u5B89",
    x: 40,
    y: 470,
    kind: "city",
    side: "tang",
    avatar: "/pl_daming_palace.png",
    gallery: ["/pl_daming.png", "/pl_daming_night.png"],
    offMap: true,
    blurb: "The Tang capital, largest city on earth. Chunchu wins his alliance here in 648; Euija dies here a prisoner in 660."
  },
  // ———————— Roads in: invasion ports, fords and passes (route maps only) ————————
  yingzhou: {
    id: "yingzhou",
    name: "Yingzhou",
    korean: "\uC601\uC8FC (\uC720\uC131)",
    hanja: "\u71DF\u5DDE",
    x: 38,
    y: 323,
    kind: "city",
    side: "tang",
    offMap: true,
    blurb: "The empire\u2019s last walled town before the Liao \u2014 old Liucheng. Every army out of the West musters here, and every army that comes back limps through it.",
    aliases: ["Yingzhou", "Liucheng", "\uC601\uC8FC", "\uC720\uC131", "\u71DF\u5DDE"]
  },
  tongding: {
    id: "tongding",
    name: "Tongding",
    korean: "\uD1B5\uC815\uC9C4",
    hanja: "\u901A\u5B9A\u93AE",
    x: 141,
    y: 305,
    kind: "river",
    side: "tang",
    offMap: true,
    blurb: "A garrison on the upper Liao with an unwatched ford. In the fourth month of 645 the Blue Dragon turns north in the night and crosses here.",
    aliases: ["Tongding", "\uD1B5\uC815\uC9C4", "\u901A\u5B9A\u93AE"]
  },
  huaiyuan: {
    id: "huaiyuan",
    name: "Huaiyuan",
    korean: "\uD68C\uC6D0\uC9C4",
    hanja: "\u61F7\u9060\u93AE",
    x: 127,
    y: 329,
    kind: "city",
    side: "tang",
    offMap: true,
    blurb: "The middle road over the Liao. The Tang show their banners here in 645 so Goguryeo will watch it; the emperor\u2019s own column crosses the marsh beside it.",
    aliases: ["Huaiyuan", "\uD68C\uC6D0\uC9C4", "\u61F7\u9060\u93AE"]
  },
  ogol: {
    id: "ogol",
    name: "Ogol",
    korean: "\uC624\uACE8\uC131 (\uBD09\uC131)",
    hanja: "\u70CF\u9AA8\u57CE",
    x: 189,
    y: 383,
    kind: "city",
    side: "goguryeo",
    offMap: true,
    blurb: "Crow-Bone Fortress, on the mountain road from the Amnok to Ansi. Goguryeo\u2019s relief armies come down this road in 645.",
    aliases: ["Ogol", "Ogol Fortress", "\uC624\uACE8\uC131", "\u70CF\u9AA8\u57CE"]
  },
  laizhou: {
    id: "laizhou",
    name: "Laizhou",
    korean: "\uB0B4\uC8FC (\uB3D9\uB798)",
    hanja: "\u840A\u5DDE",
    x: 6,
    y: 545,
    kind: "harbor",
    side: "tang",
    offMap: true,
    blurb: "Donglai, the Shandong port the fleets sail from. The Sui put to sea here in 612, the Tang with five hundred hulls in 645.",
    aliases: ["Laizhou", "Donglai", "\uB0B4\uC8FC", "\uB3D9\uB798", "\u840A\u5DDE"]
  },
  dengzhou: {
    id: "dengzhou",
    name: "Dengzhou",
    korean: "\uB4F1\uC8FC",
    hanja: "\u767B\u5DDE",
    x: 42,
    y: 515,
    kind: "harbor",
    side: "tang",
    offMap: true,
    blurb: "The harbour on the tip of Shandong where Silla envoys step ashore for the long road to Chang\u2019an.",
    aliases: ["Dengzhou", "\uB4F1\uC8FC", "\u767B\u5DDE"]
  },
  chengshan: {
    id: "chengshan",
    name: "Chengshan",
    korean: "\uC131\uC0B0",
    hanja: "\u6210\u5C71",
    x: 121,
    y: 538,
    kind: "harbor",
    side: "tang",
    offMap: true,
    blurb: "The easternmost cape of Shandong, where the land points at Samhan. Su Dingfang\u2019s fleet pushes off from it in 660.",
    aliases: ["Chengshan", "Cape Chengshan", "\uC131\uC0B0", "\u6210\u5C71"]
  },
  deokmul: {
    id: "deokmul",
    name: "Deokmul Island",
    korean: "\uB355\uBB3C\uB3C4 (\uB355\uC801\uB3C4)",
    hanja: "\u5FB7\u7269\u5CF6",
    x: 272,
    y: 548,
    kind: "harbor",
    side: "silla",
    offMap: true,
    blurb: "A small island off the Han estuary. In the sixth month of 660 the Tang fleet anchors here, and a Silla prince is rowed out to be told the date.",
    aliases: ["Deokmul Island", "Deokmul", "\uB355\uBB3C\uB3C4", "\u5FB7\u7269\u5CF6"]
  },
  geumdol: {
    id: "geumdol",
    name: "Geumdol Fortress",
    korean: "\uAE08\uB3CC\uC131 (\uC0C1\uC8FC)",
    hanja: "\u4ECA\u7A81\u57CE",
    x: 351,
    y: 588,
    kind: "city",
    side: "silla",
    offMap: true,
    blurb: "The hill fort where King Muyeol stops in 660 and hands the field to his son and Yushin.",
    aliases: ["Geumdol Fortress", "Geumdol", "\uAE08\uB3CC\uC131", "\u4ECA\u7A81\u57CE"]
  },
  tanhyeon: {
    id: "tanhyeon",
    name: "Charcoal Pass",
    korean: "\uD0C4\uD604",
    hanja: "\u70AD\u5CF4",
    x: 328,
    y: 595,
    kind: "mountain",
    side: "baekje",
    offMap: true,
    blurb: "The pass on Baekje\u2019s eastern door. Seongchung begged from prison that it be held; in 660 the Silla army walks through it unopposed.",
    aliases: ["Charcoal Pass", "Tanhyeon", "\uD0C4\uD604", "\u70AD\u5CF4"]
  },
  cheonseong: {
    id: "cheonseong",
    name: "Cheonseong",
    korean: "\uCC9C\uC131",
    hanja: "\u6CC9\u57CE",
    x: 295,
    y: 519,
    kind: "harbor",
    side: "silla",
    offMap: true,
    blurb: "A beach where the Imjin meets the Han. Xue Rengui lands his horses here in the ninth month of 675, and Munhun waits until the boats are empty.",
    aliases: ["Cheonseong", "\uCC9C\uC131", "\u6CC9\u57CE"]
  },
  tsukushi: {
    id: "tsukushi",
    name: "Tsukushi",
    korean: "\uC4F0\uCFE0\uC2DC (\uB098\uB178\uC4F0)",
    hanja: "\u7B51\u7D2B",
    x: 451,
    y: 733,
    kind: "harbor",
    side: "yamato",
    offMap: true,
    blurb: "Yamato\u2019s harbour on the strait, where the relief fleets for Baekje load in 661\u2013663.",
    aliases: ["Tsukushi", "Nanotsu", "\uC4F0\uCFE0\uC2DC", "\u7B51\u7D2B"]
  },
  cheomseongdae: {
    id: "cheomseongdae",
    name: "Cheomseongdae",
    korean: "\uCCA8\uC131\uB300",
    hanja: "\u77BB\u661F\u81FA",
    x: 392,
    y: 628,
    kind: "cave",
    side: "silla",
    cityId: "surabol",
    offMap: true,
    avatar: "/pl_observatory.png",
    title: "Observatory of Surabol",
    blurb: "Queen Sunduk\u2019s star tower \u2014 where the Divine Country reads the sky that argues with Bone Rank."
  },
  halla: {
    id: "halla",
    name: "Mount Halla",
    korean: "\uD55C\uB77C\uC0B0",
    hanja: "\u6F22\u62CF\u5C71",
    x: 290,
    y: 750,
    kind: "mountain",
    side: "tamla",
    cityId: "mugun",
    offMap: true,
    avatar: "/pl_mount_halla.png",
    blurb: "The island\u2019s sacred peak \u2014 Sulmun\u2019s apron-work; oreum holes still mark where earth spilled."
  },
  samseonghyeol: {
    id: "samseonghyeol",
    name: "Three Princes\u2019 Well",
    korean: "\uC0BC\uC131\uD608",
    x: 286,
    y: 746,
    kind: "cave",
    side: "tamla",
    cityId: "mugun",
    offMap: true,
    avatar: "/pl_three_princes_well.png",
    blurb: "Where Go, Yang, and Bu rose from the ground \u2014 Tamla\u2019s founding hole, not Gaya\u2019s eggs."
  },
  deer_rock: {
    id: "deer_rock",
    name: "Deer Rock",
    korean: "\uC815\uC0AC\uC554",
    x: 307,
    y: 616,
    kind: "cave",
    side: "baekje",
    cityId: "sabi",
    offMap: true,
    avatar: "/pl_deer_rock.png",
    title: "Assembly stone of the Eight Clans",
    blurb: "Where Baekje\u2019s Great Clans sit and unseat kings \u2014 emptied when Euija seats his own sons over them."
  },
  flower_cliff: {
    id: "flower_cliff",
    name: "Flower Cliff",
    korean: "\uAF43\uBCBC\uB791",
    x: 280,
    y: 400,
    kind: "mountain",
    side: "other",
    cityId: "western_flower_field",
    offMap: true,
    avatar: "/pl_flower_cliff.png",
    blurb: "A cliff-edge inside the Western Flower Field \u2014 not the field itself; Hallakgungi\u2019s rows fall away here in story art."
  },
  moon_palace: {
    id: "moon_palace",
    name: "Moon Palace",
    korean: "\uC6D4\uAD81",
    x: 395,
    y: 625,
    kind: "cave",
    side: "silla",
    cityId: "surabol",
    offMap: true,
    avatar: "/pl_moon_palace.png",
    blurb: "Surabol\u2019s moonlit court rooms in chronicle art \u2014 Eastern Palace\u2019s night face."
  },
  asuka: {
    id: "asuka",
    name: "Asuka",
    korean: "\uC544\uC2A4\uCE74 (\uC65C)",
    hanja: "\u98DB\u9CE5",
    x: 500,
    y: 726,
    kind: "city",
    side: "yamato",
    offMap: true,
    avatar: "/pl_asuka.png",
    blurb: "Yamato\u2019s court. Chunchu came asking for troops in 647 and was refused; fifteen years later it sent forty thousand men to die for Baekje."
  },
  realms_pavilion: {
    id: "realms_pavilion",
    name: "Three Realms Pavilion",
    korean: "\uC0BC\uACC4\uC815\uC790",
    hanja: "\u4E09\u754C\u4EAD\u5B50",
    x: 298,
    y: 398,
    kind: "cave",
    side: "other",
    offMap: true,
    avatar: "/pl_three_realms_pavillion.png",
    title: "The yearly \uC815\uC790",
    blurb: "A small \uC815\uC790 between \uC774\uC2B9, \uC800\uC2B9, and \uC11C\uCC9C\uAF43\uBC2D \u2014 no larger than a fishing shelter, claimed by none of the three courts, where the Class I gods meet once a year.",
    arc: "Not a palace and not a battlefield. Floorboards enough for gossip, tea, and the principals\u2019 later seats. Servants arrive first. The Big Man Upstairs does not need to attend for the meeting to count.",
    aliases: ["Three Realms Pavilion", "\uC0BC\uACC4\uC815\uC790", "Annual Meeting pavilion"]
  },
  underworld: {
    id: "underworld",
    name: "Underworld",
    korean: "\uC800\uC2B9",
    hanja: "\u51A5\u5E9C",
    x: 298,
    y: 820,
    kind: "realm",
    side: "underworld",
    offMap: true,
    avatar: "/pl_underworld.png",
    title: "Land of the Dead",
    blurb: "Big Star\u2019s realm \u2014 judgment, ledger, and borders no living map admits.",
    arc: "Paradise, the Siwang court, and Hell sit inside Big Star\u2019s orderly dark: Yumla judges; Kangrim and Haewonmek collect; a crow can scramble a list. Not a metaphor and not a Samhan kingdom \u2014 Little Star took the living side by cheat; Big Star kept the minutes. Heaven once tried to arrest Yumla the judge and left two escorts instead. While Surabol and Sabi burn, \uC800\uC2B9 keeps time.",
    sobriquets: ["Land of the Dead", "Yumla\u2019s court"],
    aliases: [
      "Underworld",
      "the underworld",
      "\uC800\uC2B9",
      "Land of the Dead",
      "Jeoseung",
      "Yumla\u2019s court",
      "Yumla's court"
    ]
  },
  heaven: {
    id: "heaven",
    name: "Heaven",
    korean: "\uD558\uB298\uB098\uB77C",
    hanja: "\u5929\u754C",
    x: 298,
    y: 36,
    kind: "realm",
    side: "other",
    offMap: true,
    avatar: "/pl_western.png",
    title: "Court of the Creator",
    blurb: "Hwanin\u2019s seat above \uC0BC\uACC4 \u2014 not a peer of the three courts below.",
    arc: "\uD558\uB298\uB098\uB77C is the Creator\u2019s own court, not a fourth Samhan kingdom and not a fourth peer of \uC0BC\uACC4. Sons and seals go down from here; Living, Dead, and Western Flower Field keep house below. The yearly \uC815\uC790 does not need Hwanin present for the meeting to count.",
    sobriquets: ["\uD558\uB298\uB098\uB77C", "Heaven\u2019s Court", "Court of the Creator"],
    aliases: [
      "Heaven",
      "the heavens",
      "\uD558\uB298\uB098\uB77C",
      "Heaven\u2019s Court",
      "Heaven's Court",
      "Court of Heaven",
      "Court of the Creator"
    ]
  },
  living_world: {
    id: "living_world",
    name: "Living World",
    korean: "\uC774\uC2B9",
    x: 298,
    y: 420,
    kind: "realm",
    side: "other",
    offMap: true,
    title: "Land of the Living",
    blurb: "Little Star\u2019s realm \u2014 warm, badly governed, and the side he cheated for.",
    arc: "\uC774\uC2B9 is one court of \uC0BC\uACC4 under Hwanin\u2019s heaven. After Heaven\u2013Earth King retired, the twins wagered flowers; Little Star swapped blooms and took the warm side \u2014 which is why thieves and bad hours live under his small law. Ibiga, Haemosu, and Samsin tend sky, sun, and birth here. Not Tamla the island and not a Samhan map.",
    sobriquets: ["Land of the Living", "\uC774\uC2B9"],
    aliases: [
      "Living World",
      "the living world",
      "Land of the Living",
      "\uC774\uC2B9",
      "Iseung"
    ]
  },
  western_flower_field: {
    id: "western_flower_field",
    name: "Western Flower Field",
    korean: "\uC11C\uCC9C\uAF43\uBC2D",
    hanja: "\u897F\u5929\u82B1\u7530",
    x: 48,
    y: 420,
    kind: "realm",
    side: "other",
    offMap: true,
    avatar: "/pl_western_flower_field.png",
    title: "Hallakgungi\u2019s rows",
    blurb: "The Gardener\u2019s realm \u2014 resurrection and extinction in the same western rows.",
    arc: "\uC11C\uCC9C\uAF43\uBC2D is the third court of \uC0BC\uACC4: travel west from \uC774\uC2B9 far enough and living maps end. Hallakgungi (\uD560\uB77D\uAD81\uC774) keeps the gate after Father Saradoryeong retired. Resurrection blooms sit beside the extinction flower; Jacheongbi\u2019s chain runs through this gate. Flower Cliff is a drop at the field\u2019s edge, not the field itself. Not a kingdom \u2014 a court among the Three Realms under Hwanin.",
    sobriquets: ["\uC11C\uCC9C\uAF43\uBC2D", "Hallakgungi\u2019s rows", "the western field"],
    aliases: [
      "Western Flower Field",
      "the Western Flower Field",
      "\uC11C\uCC9C\uAF43\uBC2D",
      "Seocheon",
      "West Field",
      "western flower field"
    ]
  }
};
var MAP_MARKERS = Object.values(PLACES).filter((p) => !p.offMap);
var MAP_VIEWBOX = { w: 595, h: 842 };
var MAP_VIEW = { x: 45, y: 150, w: 460, h: 620 };
var MAP_SHEET_BOX = {
  left: -MAP_VIEW.x / MAP_VIEW.w * 100,
  top: -MAP_VIEW.y / MAP_VIEW.h * 100,
  width: MAP_VIEWBOX.w / MAP_VIEW.w * 100,
  height: MAP_VIEWBOX.h / MAP_VIEW.h * 100
};
function toPlacePerson(p) {
  const aliases = p.aliases?.length ? p.aliases : [p.name, ...p.korean ? [p.korean.split(/[\s(]/)[0]] : []].filter(Boolean);
  return {
    id: p.id,
    name: p.name,
    korean: p.korean,
    hanja: p.hanja,
    title: p.title ?? PLACE_KIND_LABEL[p.kind],
    entity: "place",
    placeKind: p.kind,
    cityId: p.cityId,
    kingdom: p.side,
    avatar: p.avatar,
    tagline: p.blurb,
    arc: p.arc,
    events: p.events,
    aliases,
    sobriquets: p.sobriquets
  };
}
var PLACE_PROFILES = Object.values(PLACES).map(toPlacePerson);

// src/lib/phrases.ts
var PHRASES = [
  {
    id: "phrase-gyebeks-5000",
    name: "Gyebek's Five Thousand",
    korean: "\uACC4\uBC31\uC758 \uC624\uCC9C",
    hanja: "\u968E\u4F2F\u4E94\u5343",
    entity: "phrase",
    kingdom: "baekje",
    title: "Idiom \u2014 elite squad prepared for death",
    tagline: "An elite force that marches knowing it will not return.",
    quote: "Five thousand against fifty thousand. That is the whole argument.",
    arc: "At Yellow Mountain in 660, Hundred-Victories Gyebek answers fifty thousand with five thousand \u2014 and kills his own family first so nothing can be used against him. Later ages stop counting the battle and start counting the type: any unit sent to die cleanly, any volunteer corps that burns the boat behind it, is called Gyebek\u2019s Five Thousand. Kamikaze before the word; loyalty measured by the refusal to keep a way home.",
    events: [
      { year: 660, label: "Coined at the Yellow Mountain Fields." },
      { label: "Becomes the proverb for a death-ready elite." }
    ],
    aliases: [
      "Gyebek's Five Thousand",
      "Gyebek\u2019s Five Thousand",
      "Gyebek's 5000",
      "Gyebek\u2019s 5000"
    ]
  },
  {
    id: "phrase-gesomun-method",
    name: "Yeon Gesomun Method",
    korean: "\uC5F0\uAC1C\uC18C\uBB38\uC2DD",
    entity: "phrase",
    kingdom: "goguryeo",
    title: "Idiom \u2014 bulldozing through bureaucracy",
    tagline: "Skip the committee. Break the room. Keep the country.",
    quote: "The seals no longer wait for the Council.",
    arc: "Yeon Gesomun does not outvote the High Summit \u2014 he ends the men who would outvote him, then rules through a puppet and a Grand Herald. The Yeon Gesomun Method is what clerks whisper when someone stops asking permission: clear the table, keep the work. Admired by men who need speed; feared by every hall that lives on procedure. Chunchu\u2019s Royal Secretariat is the polite cousin of the same instinct.",
    events: [
      { year: 642, label: "Yeon\u2019s Massacre \u2014 the method\u2019s founding demonstration." },
      { label: "Named whenever will outruns unanimity." }
    ],
    aliases: [
      "Yeon Gesomun Method",
      "Gesomun Method",
      "the Gesomun method",
      "the Yeon Gesomun Method"
    ]
  },
  {
    id: "phrase-ansi-fortress",
    name: "Ansi Fortress",
    korean: "\uC548\uC2DC\uC131",
    hanja: "\u5B89\u5E02\u57CE",
    entity: "phrase",
    kingdom: "goguryeo",
    title: "Idiom \u2014 last holdout against an onslaught",
    tagline: "The wall that will not open \u2014 even when the empire is outside.",
    quote: "Stone has already outlasted more emperors than the court will admit.",
    arc: "In 645 the unnamed Guardian holds Ansi against Taizong through a summer of siege and hands the greatest emperor of the age his first defeat. After that, any last redoubt \u2014 a shop that will not sell, a faction that will not fold, a single gate still flying old colours \u2014 is an Ansi Fortress. The place keeps the coordinates; the phrase keeps the refusal.",
    events: [
      { year: 645, label: "Taizong turned back at Ansi." },
      { label: "Becomes the name for any last holdout." }
    ],
    aliases: ["Ansi Fortress", "an Ansi Fortress", "another Ansi Fortress"]
  },
  {
    id: "phrase-chives-garlic",
    name: "Chives and Garlic",
    korean: "\uBD80\uCD94\uC640 \uB9C8\uB298",
    entity: "phrase",
    kingdom: "joseon",
    title: "Idiom \u2014 an endurance trial meant to test someone",
    tagline: "An arduous wait designed to see who stays \u2014 and who leaves on day twenty-one.",
    quote: "Twenty-one days. On chives and garlic alone. \u2026Did you stay?",
    arc: "The bear and the tiger ask heaven for human form. They are given mugwort, garlic, and a hundred days out of the sun; the tiger leaves on the twenty-first day, the bear endures and becomes a woman. Mouths later shorten the trial to chives and garlic \u2014 any ordeal that is mostly waiting, mostly hunger, and entirely a test of whether you wanted the thing enough. Used for apprenticeships, mourning, courtships, and every quiet hazing that pretends to be piety.",
    events: [
      { label: "Coined from the Bear-Woman\u2019s trial under the sandalwood tree." },
      { label: "Said whenever endurance is the examination." }
    ],
    aliases: [
      "Chives and Garlic",
      "chives and garlic",
      "garlic and chives",
      "garlic and mugwort"
    ]
  },
  {
    id: "phrase-sacred-bone",
    name: "Sacred Bone",
    korean: "\uC131\uACE8",
    hanja: "\u8056\u9AA8",
    entity: "phrase",
    kingdom: "silla",
    title: "Idiom \u2014 blood so high it needs no petition",
    tagline: "The top of the top \u2014 privilege that thinks it is weather.",
    quote: "Sacred blood is not a petition \u2014 it is a claim.",
    arc: "In Silla\u2019s Bone Rank, Sacred Bone is the only blood that may wear the crown. When the line runs out, the kingdom invents queens; when the queens die, the phrase outlives the caste. To call someone Sacred Bone is to name a privilege so complete it does not know it is a privilege \u2014 the room that never had to ask.",
    events: [
      { year: 632, label: "Only three Sacred Bone royals remain." },
      { year: 654, label: "The Sacred Bone line ends with Queen Jinduk." }
    ],
    aliases: ["Sacred Bone", "the Sacred Bone"]
  },
  {
    id: "phrase-true-bone",
    name: "True Bone",
    korean: "\uC9C4\uACE8",
    hanja: "\u771E\u9AA8",
    entity: "phrase",
    kingdom: "silla",
    title: "Idiom \u2014 privileged elite just under the crown",
    tagline: "High enough to rule the room \u2014 barred, for a while, from the throne.",
    quote: "Say \u201CTrue Bone\u201D and the heavens part on their own.",
    arc: "True Bone is the caste that does almost everything Sacred Bone does except wear the crown \u2014 until Chunchu breaks that ceiling. In later mouths it means any polished elite: capital manners, inherited office, the boy given a fortress because of his blood. Daeya falls partly because True Bone was confused with competence.",
    events: [
      { year: 654, label: "First True Bone king \u2014 Muyeol." },
      { label: "Becomes shorthand for entitled excellence." }
    ],
    aliases: ["True Bone", "True Bones", "the True Bone"]
  },
  {
    id: "phrase-satek-clan",
    name: "Satek Clan",
    korean: "\uC0AC\uD0DD\uC528",
    hanja: "\u6C99\u5B85\u6C0F",
    entity: "phrase",
    kingdom: "baekje",
    title: "Idiom \u2014 an influential family near power",
    tagline: "Holds the sleeve of the king \u2014 and sometimes the arm.",
    quote: "Satek is a house that lives by holding the king\u2019s sleeve.",
    arc: "In Euija\u2019s Baekje the Satek hold queen and prime minister at once \u2014 not the throne, but the grip on whoever sits it. Later ages use Satek Clan for any family that rules by proximity: marriage into the palace, cousins in the ministries, a veto that never needs a speech. The Guptas of another continent; the in-laws of every capital.",
    events: [
      { year: 632, label: "Queen and Prime Minister both Satek." },
      { year: 655, label: "Euija breaks the clans \u2014 and the counsel with them." }
    ],
    aliases: ["Satek Clan", "Satek clan", "a Satek clan", "the Satek clan"]
  },
  {
    id: "phrase-daeya-incident",
    name: "Daeya Incident",
    korean: "\uB300\uC57C\uC758 \uBCC0",
    entity: "phrase",
    kingdom: "silla",
    title: "Idiom \u2014 a catastrophe that changes everything",
    tagline: "The private wound that redraws the map \u2014 before and after, nothing is the same.",
    quote: "Before Daeya. After Daeya. There is no third tense.",
    arc: "In the eighth month of 642 Daeya Fortress falls, Gotaso dies, and Chunchu\u2019s revenge begins \u2014 the Tang alliance, the end of Baekje, the end of Goryeo, all running back through one betrayed gate. The Daeya Incident is what people say for a single day that splits history: a 9/11 of Samhan, after which every sentence is dated. The fortress keeps the place; the phrase keeps the before-and-after.",
    events: [
      { year: 642, label: "Daeya falls; Gotaso dies." },
      { label: "Becomes the name for a world-splitting catastrophe." }
    ],
    aliases: [
      "Daeya Incident",
      "the Daeya Incident",
      "after Daeya",
      "Before Daeya",
      "before Daeya"
    ]
  },
  {
    id: "phrase-surabol",
    name: "Surabol",
    korean: "\uC11C\uB77C\uBC8C",
    hanja: "\u5F90\u7F85\u4F10",
    entity: "phrase",
    kingdom: "silla",
    title: "Idiom \u2014 the center of everything in a country",
    tagline: "Where the roads decide they have arrived \u2014 Mecca, Rome, the capital that is also a gravity.",
    quote: "If it matters, it has already been argued in Surabol.",
    arc: "Surabol is Silla\u2019s capital \u2014 and then it is more than a city. To call a place Surabol is to say the center of a people\u2019s attention lives there: fashion, rank, gyuku handicaps, the rumour that crowns queens. Other kingdoms have seats; Surabol has gravity. The map entry keeps the coordinates under Namsan; this phrase keeps the habit of facing one direction when you say \u201Cthe capital.\u201D",
    events: [
      { year: -57, label: "Founded as Seorabeol, the legend says." },
      { label: "Becomes the metonym for a country\u2019s center." }
    ],
    // No bare "Surabol" alias — the place profile keeps geographic links.
    aliases: ["Surabol of Samhan", "another Surabol", "every Surabol"]
  },
  {
    id: "phrase-geunchogo",
    name: "Geunchogo",
    korean: "\uADFC\uCD08\uACE0",
    hanja: "\u8FD1\u8096\u53E4",
    entity: "phrase",
    kingdom: "baekje",
    title: "Idiom \u2014 a golden age everyone is trying to go back to",
    tagline: "The reign people chant when the present is not enough.",
    quote: "Restore the reign of great Geunchogo.",
    arc: "King Geunchogo (#13) kills a Goguryeo king at Pyongyang and holds the Han, the west coast, and the sea lanes \u2014 Baekje\u2019s high-water mark. Three centuries later the courtyard still chants his name at a clever king who has already decided a country is a story. Geunchogo becomes the word for any lost peak: Make Baekje great again; every restoration slogan; the hurricane people would rather remember than weather.",
    events: [
      { year: 371, label: "Geunchogo\u2019s high-water mark at Pyongyang." },
      { label: "Becomes the proverb for a golden age to restore." }
    ],
    aliases: [
      "another Geunchogo",
      "back to Geunchogo",
      "Geunchogo years",
      "a Geunchogo"
    ]
  },
  {
    id: "phrase-kangrims-question",
    name: "Kangrim's Question",
    korean: "\uAC15\uB9BC\uC758 \uBB3C\uC74C",
    entity: "phrase",
    kingdom: "underworld",
    title: "Idiom \u2014 the life-reflection asked at the end",
    tagline: "One question at the threshold \u2014 then the walk.",
    quote: "Ask the question. Do not deliver the answer.",
    arc: "Kangrim \u2014 \uAC15\uB9BC to elites, \uC800\uC2B9\uC0AC\uC790 to the street \u2014 fetches the dead for Yumla\u2019s judgment under Big Star\u2019s \uC800\uC2B9, often beside Haewonmek. The rite first: the red notebook of names (\uC801\uD328\uC9C0), the name said three times, the cord cut like an umbilical. A crow once scrambled that book; that is why nobody knows their hour. Then the Question, about the choice that made the life. Haewonmek\u2019s ask is simpler: Any last words? / \uB0A8\uAE38 \uB9D0 \uC788\uB098? Queens, rebels, marshals, a girl at Daeya who knew only the folk title \u2014 each gets an ask. Kangrim\u2019s Question is what later mouths call any reckoning at the end: the interview you cannot rehearse, the honesty that shortens the road. You cannot bargain with the hour. You can still answer the question.",
    events: [
      { label: "Asked at every threshold Kangrim keeps for the court of judgment." },
      { label: "Becomes the name for a final life-reflection." }
    ],
    aliases: [
      "Kangrim's Question",
      "Kangrim\u2019s Question",
      "Kangrim's question",
      "Kangrim\u2019s question"
    ]
  },
  // ————— further canon — same household grade —————
  {
    id: "phrase-bidams-kite",
    name: "Bidam's Kite",
    korean: "\uBE44\uB2F4\uC758 \uC5F0",
    entity: "phrase",
    kingdom: "silla",
    title: "Idiom \u2014 a forged sign from heaven",
    tagline: "Claim heaven\u2019s vote with fire on a string \u2014 and hope nobody looks up closely.",
    quote: "Heaven left a mark. Or a man did.",
    arc: "In 647 Bidam flies a burning kite over the Fortress of Radiance to argue that heaven has withdrawn from Queen Sunduk. The rebellion fails; the method becomes proverb. Bidam\u2019s Kite is any omen you manufacture \u2014 a leak, a miracle, a \u201Csign\u201D timed for the vote. Useful once. Fatal when the marshal who trained with you knows how kites are built.",
    events: [
      { year: 647, label: "Burning kite over Radiance." },
      { label: "Named for every forged mandate." }
    ],
    aliases: ["Bidam's Kite", "Bidam\u2019s Kite", "Bidam's kite", "Bidam\u2019s kite"]
  },
  {
    id: "phrase-empty-road",
    name: "The Empty Road",
    korean: "\uBE48 \uAE38",
    entity: "phrase",
    kingdom: "silla",
    title: "Idiom \u2014 waiting for someone who will not return",
    tagline: "The gate where a boy learns the sister is not coming home.",
    quote: "Some educations are cruel on purpose.",
    arc: "After Daeya, Bupmin waits at Surabol\u2019s gate for Gotaso; Munhee lets him see the empty road. The Empty Road becomes the phrase for any vigil that has already failed \u2014 the harbour with no sail, the letter that does not come, the forever that ended in the eighth month. Grief with a direction, and nowhere to walk.",
    events: [
      { year: 642, label: "Bupmin at the gate after Daeya." },
      { label: "Becomes the name for a vigil already lost." }
    ],
    aliases: ["the Empty Road", "The Empty Road", "an empty road"]
  },
  {
    id: "phrase-gwanchangs-second-ride",
    name: "Gwanchang's Second Ride",
    korean: "\uAD00\uCC3D\uC758 \uC7AC\uCD9C\uC804",
    entity: "phrase",
    kingdom: "silla",
    title: "Idiom \u2014 going back when you already know you will die",
    tagline: "Released once. Rode back. That is the whole virtue \u2014 and the whole waste.",
    quote: "Youth is not an excuse. It is a deadline.",
    arc: "Sixteen-year-old Gwanchang charges the Baekje line, is captured, and is sent home by Gyebek for his age. He rides straight back. The second time, only his head returns \u2014 and Silla\u2019s hesitation breaks. Gwanchang\u2019s Second Ride is any return to certain death after a pardon: never retreat made flesh, the Five Principles spending a teenager.",
    events: [
      { year: 660, label: "Second charge at Yellow Mountain." },
      { label: "Named for every chosen return to death." }
    ],
    aliases: [
      "Gwanchang's Second Ride",
      "Gwanchang\u2019s Second Ride",
      "Gwanchang's second ride"
    ]
  },
  {
    id: "phrase-yeons-banquet",
    name: "Yeon's Banquet",
    korean: "\uC5F0\uAC1C\uC18C\uBB38\uC758 \uC5F0\uD68C",
    entity: "phrase",
    kingdom: "goguryeo",
    title: "Idiom \u2014 the coup that clears the room",
    tagline: "Invite the court. End the court. Keep the swords.",
    quote: "Kill me? Yeon Gesomun?",
    arc: "In 642 Yeon answers a plot on his life by butchering king, commanders, and officials at a feast \u2014 then wears the four taken blades with the Eastern Crow Blade he brought. Yeon\u2019s Banquet is any purge staged as hospitality: the meeting that was always a trap, the toast that ends a government. Pair with the Gesomun Method; one is the dinner, the other is the years after.",
    events: [
      { year: 642, label: "The massacre at Pyongyang." },
      { label: "Becomes the name for a purge disguised as a feast." }
    ],
    aliases: ["Yeon's Banquet", "Yeon\u2019s Banquet", "Yeon's banquet", "Yeon\u2019s Massacre"]
  },
  {
    id: "phrase-harmony-veto",
    name: "Harmony Veto",
    korean: "\uD654\uBC31\uC758 \uAC70\uBD80",
    entity: "phrase",
    kingdom: "silla",
    title: "Idiom \u2014 one hand that stops everything",
    tagline: "Unanimity or nothing \u2014 a single objection freezes a kingdom.",
    quote: "One hand down stops a queen, an heir, or a war.",
    arc: "Silla\u2019s Harmony Council of Councillors (\uB300\uB4F1) decides only when every sleeve agrees under the High Councillor (\uC0C1\uB300\uB4F1). Bidam\u2019s single withheld hand blocks Seungman in 645; the physics is why Chunchu builds the Royal Secretariat (\uC9D1\uC0AC\uBD80). Harmony Veto is any system where one holdout equals infinity \u2014 a filibuster with bone rank, the polite word for paralysis.",
    events: [
      { year: 645, label: "Bidam alone withholds his hand." },
      { label: "Named for any single-voice stoppage." }
    ],
    aliases: ["Harmony Veto", "harmony veto", "a Harmony Veto"]
  },
  {
    id: "phrase-never-retreat",
    name: "Never Retreat",
    korean: "\uC784\uC804\uBB34\uD1F4",
    hanja: "\u81E8\u6230\u7121\u9000",
    entity: "phrase",
    kingdom: "silla",
    title: "Idiom \u2014 the order that spends lives cleanly",
    tagline: "The Five Principles line that turns boys into deadlines.",
    quote: "\uC784\uC804\uBB34\uD1F4.",
    arc: "One of Won\u2019gwang\u2019s Five Principles for the Hwarang: in battle, do not fall back. It is why Gwanchang rides twice, why Gyebek\u2019s five thousand do not bargain for a road home, why the age keeps producing beautiful deaths. Never Retreat is praised at funerals and quietly cursed by anyone who still has to fill a muster roll.",
    events: [
      { year: 576, label: "Formalised under the Hwarang code." },
      { year: 660, label: "Paid in full at Yellow Mountain." }
    ],
    aliases: ["Never Retreat", "never retreat", "Imjeonmutoe", "\uC784\uC804\uBB34\uD1F4"]
  },
  {
    id: "phrase-flower-cliffs",
    name: "Flower Cliffs",
    korean: "\uB099\uD654\uC554",
    hanja: "\u843D\u82B1\u5DD6",
    entity: "phrase",
    kingdom: "baekje",
    title: "Idiom \u2014 a beautiful mass death",
    tagline: "When the court chooses the cliff over the conqueror\u2019s hands.",
    quote: "Better the rock than the wrong empire.",
    arc: "As Sabi falls, court women go over the cliffs rather than be taken \u2014 remembered as falling flowers. Flower Cliffs becomes the phrase for any collective, aesthetic refusal of survival: mass suicide dressed as loyalty, the ending a kingdom chooses when the story is already over.",
    events: [
      { year: 660, label: "The court women at the cliffs of Sabi." },
      { label: "Named for beautiful refusals of capture." }
    ],
    aliases: ["Flower Cliffs", "the Flower Cliffs", "Falling Flowers"]
  },
  {
    id: "phrase-one-oh-eight",
    name: "The One Hundred and Eight",
    korean: "\uBC31\uD314",
    entity: "phrase",
    kingdom: "silla",
    title: "Idiom \u2014 a rivalry that will not resolve",
    tagline: "Tied forever \u2014 and neither will let the other stay ahead.",
    quote: "One hundred and eight apiece. Neither has ever let the other stay ahead for long.",
    arc: "Yushin and Bidam spar from boyhood to a lifelong draw: 108\u2013108. The count becomes a proverb for any contest that refuses a winner \u2014 brothers, houses, two capitals arguing the same road. The One Hundred and Eight means the score is the relationship.",
    events: [
      { label: "Yushin and Bidam\u2019s lifelong sparring count." },
      { label: "Said of any endless, intimate rivalry." }
    ],
    aliases: [
      "The One Hundred and Eight",
      "the One Hundred and Eight",
      "one hundred and eight apiece",
      "108\u2013108"
    ]
  },
  {
    id: "phrase-white-river",
    name: "White River",
    korean: "\uBC31\uAC15",
    hanja: "\u767D\u6C5F",
    entity: "phrase",
    kingdom: "baekje",
    title: "Idiom \u2014 where four fleets burn",
    tagline: "The naval catastrophe that ends a restoration.",
    quote: "Four hundred ships. One afternoon. No country left to sail home to.",
    arc: "In 663 Tang, Silla, Baekje and Yamato meet at the Baekgang \u2014 the first time all four share one battle \u2014 and the Baekje Restoration Army burns. Yung and Pung finish a succession quarrel on opposite banks. White River is any final water where alliances and fleets die together: the last throw, the harbour that becomes a grave.",
    events: [
      { year: 663, label: "Four fleets at the Baekgang." },
      { label: "Becomes the name for a terminal naval disaster." }
    ],
    aliases: ["a White River", "another White River", "White River disaster"]
  },
  {
    id: "phrase-changan-coat",
    name: "Chang'an Coat",
    korean: "\uC7A5\uC548\uC758 \uC637",
    entity: "phrase",
    kingdom: "tang",
    title: "Idiom \u2014 becoming what the empire wants",
    tagline: "Wear the capital\u2019s cut \u2014 and wonder what still fits when you go home.",
    quote: "Do not let the coat eat you.",
    arc: "Chunchu learns speed and absolutism in Chang\u2019an; friends say he loves the emperor, enemies say the coat ate him. Chang\u2019an Coat is any assimilation that works too well \u2014 the diplomat who comes home speaking another court\u2019s grammar, the reform that is really a costume. Keep the appointment. Do not let the coat eat you.",
    events: [
      { year: 648, label: "Chunchu seals the alliance in Chang\u2019an." },
      { label: "Named for successful, dangerous assimilation." }
    ],
    aliases: [
      "Chang'an Coat",
      "Chang\u2019an Coat",
      "Chang'an coat",
      "Chang\u2019an coat"
    ]
  },
  {
    id: "phrase-alchuns-counsel",
    name: "Alchun's Counsel",
    korean: "\uC54C\uCC9C\uC758 \uAC04\uC5B8",
    entity: "phrase",
    kingdom: "silla",
    title: "Idiom \u2014 the hard sentence spoken to both walls",
    tagline: "Admonish the loyalist and the rebel with the same mouth \u2014 and stand in neither camp.",
    quote: "Judge what is best for the divine nation.",
    arc: "In 647 Alchun is summoned by Yushin and by Bidam before noon. To the Sword he says: stop being blinded by the princess you loved as a boy. To the High Councillor he says: raising arms against the crown is highest treason. Then he raises neither blade nor banner. Alchun\u2019s Counsel is any rebuke that costs you both friendships \u2014 the nation named out loud when loyalty has become a private fever.",
    events: [
      { year: 647, label: "Spoken to both camps on Day 1 of Radiance." },
      { label: "Named for admonishing opposite walls and belonging to neither." }
    ],
    aliases: [
      "Alchun's Counsel",
      "Alchun\u2019s Counsel",
      "Alchun's counsel",
      "the Alchun counsel"
    ]
  },
  {
    id: "phrase-you-are-kim-yushin",
    name: "You Are Kim Yushin",
    korean: "\uB108\uB294 \uAE40\uC720\uC2E0\uC774\uB2E4",
    entity: "phrase",
    kingdom: "silla",
    title: "Idiom \u2014 the name that outranks every title",
    tagline: "Sword of Silla. Last Prince of Gaya. And still \u2014 more than both.",
    quote: "You are infinitely more than that\u2026! You are my son. You are Kim Yushin.",
    arc: "In the steam cavern before the tenth day at Radiance, Seohyeon\u2019s ghost tells his son he need not erase Gaya to serve Silla \u2014 then names him past every sobriquet. You Are Kim Yushin becomes the phrase for any identity that refuses to be only a role: the title that fits, and the person larger than the fitting.",
    events: [
      { year: 647, label: "Spoken in the cavern the night before Bidam falls." },
      { label: "Said whenever a name outranks its titles." }
    ],
    aliases: [
      "You Are Kim Yushin",
      "you are Kim Yushin",
      "You are Kim Yushin"
    ]
  },
  {
    id: "phrase-loved-before-known",
    name: "Loved Before Known",
    korean: "\uC54C\uAE30 \uC804\uC5D0 \uC0AC\uB791\uD558\uB2E4",
    entity: "phrase",
    kingdom: "gaya",
    title: "Idiom \u2014 loyalty sworn for a life not yet lived",
    tagline: "Surrender a kingdom for a grandson you have not met \u2014 and mean it.",
    quote: "I loved you before I knew you.",
    arc: "Muryuk\u2019s ghost tells Yushin the surrender of Golden Gaya was never self-rescue \u2014 it was love aimed at a boy who did not yet exist. Loved Before Known is any vow made for someone future: a treaty signed for children, a sacrifice spent on a name not yet spoken.",
    events: [
      { year: 532, label: "Kingdom surrendered; the love is promissory." },
      { year: 647, label: "Named aloud in the cavern to the grandson." }
    ],
    aliases: [
      "Loved Before Known",
      "loved before known",
      "I loved you before I knew you"
    ]
  },
  {
    id: "phrase-silence-is-power",
    name: "Silence Is Power",
    korean: "\uCE68\uBB35\uC774 \uAD8C\uB825\uC774\uB2E4",
    entity: "phrase",
    kingdom: "tang",
    title: "Idiom \u2014 the quiet that rules the room",
    tagline: "Not submission \u2014 the true mark of power in an emperor\u2019s court.",
    quote: "Silence is the true mark of power\u2026!",
    arc: "Before Chunchu leaves Chang\u2019an, Wu stops him in a corridor that is not on any schedule and sends a message to Silla\u2019s woman king: never stand down; become a defiant woman; stay silent in strength. Then she whispers one unrecorded sentence and smiles him into terror. Silence Is Power is any authority that does not need to raise its voice \u2014 the glance, the aside, the quiet that rearranges a banquet.",
    events: [
      { year: 649, label: "Wu\u2019s corridor charge to Chunchu." },
      { label: "Named for power that does not announce itself." }
    ],
    aliases: [
      "Silence Is Power",
      "silence is power",
      "Silence is Power",
      "the true mark of power"
    ]
  },
  {
    id: "phrase-defiant-woman",
    name: "Defiant Woman",
    korean: "\uBC18\uD56D\uD558\uB294 \uC5EC\uC790",
    entity: "phrase",
    kingdom: "tang",
    title: "Idiom \u2014 equality worn as a face",
    tagline: "Look any man in the face and see an equal \u2014 conquer worlds with a glance.",
    quote: "A woman who can look any man in the face and see an equal.",
    arc: "Wu\u2019s message for Sunduk, carried by a frightened Chunchu: in the violent world of men, be the woman who does not stand down. Defiant Woman becomes the proverb for any refusal dressed as posture \u2014 not noise, not apology, the equal glance that ends the argument before it starts.",
    events: [
      { year: 649, label: "Charged to Silla\u2019s woman king via Chunchu." },
      { label: "Said of any equal glance that refuses to flinch." }
    ],
    aliases: [
      "Defiant Woman",
      "a defiant woman",
      "the defiant woman"
    ]
  }
];

// src/lib/swords.ts
var SWORD_DEFS = [
  {
    id: "sword-fish",
    name: "Fish sword",
    korean: "\uC5B4\uAC80",
    owners: ["yushin", "seohyeon", "muryuk"],
    kingdom: "silla",
    swordImage: "/sword_fish.png",
    tagline: "Ring-pommel fish sword \u2014 Gaya fish on the pommel, Silla blue in the fuller.",
    arc: "Geumgwan Gaya\u2019s ring-pommel \u2014 fish on the pommel, blue in the fuller. Kim Muryuk traded a kingdom so the line could keep it; Kim Seohyeon made the surrender a household; Kim Yushin made it the Sword of Silla. Three generations, one blade.",
    aliases: ["Fish sword", "\uC5B4\uAC80", "Sword of Silla"]
  },
  {
    id: "sword-chunchu",
    name: "Imugi court sword",
    korean: "\uC774\uBB34\uAE30\uAC80",
    owners: ["chunchu"],
    kingdom: "silla",
    swordImage: "/sword_dragon.png",
    tagline: "Ring-pommel court sword \u2014 imugi coiled on the grip; drawn rarely, remembered always.",
    arc: "Kim Chunchu\u2019s court sword \u2014 an imugi on the grip, not a finished dragon. The same dragon-steel illustration as Munmu\u2019s sea-dragon sword; a different blade. Drawn rarely, remembered always.",
    aliases: ["Imugi court sword", "\uC774\uBB34\uAE30\uAC80"]
  },
  {
    id: "sword-munmu",
    name: "Sea-dragon sword",
    korean: "\uD574\uB8E1\uAC80",
    hanja: "\u6D77\u9F8D\u528D",
    owners: ["munmu"],
    kingdom: "silla",
    swordImage: "/sword_dragon.png",
    tagline: "Ring-pommel sea-dragon sword \u2014 forged for a king who asked to become a dragon in the strait.",
    arc: "Munmu\u2019s \uD574\uB8E1\uAC80 \u2014 the chronicle\u2019s dragon sword (\uC6A9\uAC80). Not Yushin\u2019s fish, not Tang\u2019s Blue Dragon banner, not a Goguryeo crow. Forged for the king who asked to become a dragon in the East Sea strait.",
    aliases: ["Sea-dragon sword", "\uD574\uB8E1\uAC80", "\u6D77\u9F8D\u528D", "Dragon Sword", "\uC6A9\uAC80", "dragon sword"]
  },
  {
    id: "sword-gesomun",
    name: "Eastern Crow Blade",
    korean: "\uB3D9\uBC29 \uC624\uB3C4",
    hanja: "\u6771\u65B9\u70CF\u5200",
    owners: ["gesomun"],
    kingdom: "goguryeo",
    swordImage: "/sword_crow.png",
    tagline: "Ring-pommel Eastern Crow Blade \u2014 three-legged crow on the stamp; the march sword of the Eastern Commander.",
    arc: "Yeon Gesomun\u2019s own blade from the eastern marches \u2014 \uB3D9\uBC29 \uC624\uB3C4, the first of the four cardinal crow blades. He wears it into the banquet of 642; after the massacre it stays first on the spine, beside the High Commander Blade he takes from his uncle.",
    events: [
      { year: 634, label: "Worn as Eastern Commander (\uB300\uAC00) of the eastern marches." },
      { year: 642, label: "Carried into Yeon\u2019s Banquet; remains his first sword after he takes the High Commander Blade." }
    ],
    aliases: ["Eastern Crow Blade", "\uB3D9\uBC29 \uC624\uB3C4", "\u6771\u65B9\u70CF\u5200", "Eastern Crow Sword", "Eastern crow sword"]
  },
  {
    id: "sword-gusesa",
    name: "High Commander Blade",
    korean: "\uB9C9\uB9AC\uC9C0\uAC80",
    hanja: "\u83AB\u96E2\u652F\u528D",
    owners: ["gesomun", "gusesa"],
    kingdom: "goguryeo",
    swordImage: "/sword_crow.png",
    tagline: "Ring-pommel High Commander Blade \u2014 haetae carved beneath the crow stamp; the \uB9C9\uB9AC\uC9C0\uAC80 of the Summit\u2019s first chair.",
    arc: "Yeon Gusesa\u2019s \uB9C9\uB9AC\uC9C0\uAC80 \u2014 haetae beneath the three-legged crow, the High Commander\u2019s sword, not a sixth \u201Cfive blades\u201D kit. Taken at the banquet of 642; Gesomun wears it thereafter as the office-blade of the new Supreme Commander (\uB300\uB9C9\uB9AC\uC9C0).",
    events: [{ year: 642, label: "Taken by Yeon Gesomun from High Commander Yeon Gusesa." }],
    aliases: [
      "High Commander Blade",
      "\uB9C9\uB9AC\uC9C0\uAC80",
      "\u83AB\u96E2\u652F\u528D",
      "Central crow sword",
      "\uC911\uC559 \uC624\uAC80"
    ]
  },
  {
    id: "sword-northcmd",
    name: "Northern Crow Blade",
    korean: "\uBD81\uBC29 \uC624\uB3C4",
    hanja: "\u5317\u65B9\u70CF\u5200",
    owners: ["gesomun", "northcmd"],
    kingdom: "goguryeo",
    swordImage: "/sword_crow.png",
    tagline: "Ring-pommel Northern Crow Blade \u2014 Mohe-frost nicks in the edge; \uBD81\uBC29 \uC624\uB3C4 of the northern \uB300\uAC00.",
    arc: "Go Ul\u2019s Northern Crow Blade \u2014 Mohe-frost nicks in the edge. Taken at Yeon\u2019s Banquet; worn on Gesomun\u2019s back with the other cardinal crows.",
    events: [{ year: 642, label: "Taken by Yeon Gesomun \u2014 Northern Crow Blade." }],
    aliases: ["Northern Crow Blade", "\uBD81\uBC29 \uC624\uB3C4", "\u5317\u65B9\u70CF\u5200", "Northern crow sabre", "\uBD81\uAC80"]
  },
  {
    id: "sword-southcmd",
    name: "Southern Crow Blade",
    korean: "\uB0A8\uBC29 \uC624\uB3C4",
    hanja: "\u5357\u65B9\u70CF\u5200",
    owners: ["gesomun", "southcmd"],
    kingdom: "goguryeo",
    swordImage: "/sword_crow.png",
    tagline: "Ring-pommel Southern Crow Blade \u2014 grip worn smooth against Yushin\u2019s passes; \uB0A8\uBC29 \uC624\uB3C4 of the southern \uB300\uAC00.",
    arc: "Son Daeha\u2019s Southern Crow Blade \u2014 grip worn smooth against Yushin\u2019s passes. Taken at the banquet; the blade Yushin would have known from the marches.",
    events: [{ year: 642, label: "Taken by Yeon Gesomun \u2014 Southern Crow Blade." }],
    aliases: ["Southern Crow Blade", "\uB0A8\uBC29 \uC624\uB3C4", "\u5357\u65B9\u70CF\u5200", "Southern crow sword", "\uB0A8\uAC80"]
  },
  {
    id: "sword-westcmd",
    name: "Western Crow Blade",
    korean: "\uC11C\uBC29 \uC624\uB3C4",
    hanja: "\u897F\u65B9\u70CF\u5200",
    owners: ["gesomun", "westcmd"],
    kingdom: "goguryeo",
    swordImage: "/sword_crow.png",
    tagline: "Ring-pommel Western Crow Blade \u2014 Liao timber-oil in the scabbard; \uC11C\uBC29 \uC624\uB3C4 of the western \uB300\uAC00.",
    arc: "Go Heumsong\u2019s Western Crow Blade \u2014 Liao timber-oil in the scabbard. The western commandery\u2019s stamp, strapped to Gesomun after 642.",
    events: [{ year: 642, label: "Taken by Yeon Gesomun \u2014 Western Crow Blade." }],
    aliases: ["Western Crow Blade", "\uC11C\uBC29 \uC624\uB3C4", "\u897F\u65B9\u70CF\u5200", "Western crow sword", "\uC11C\uAC80"]
  },
  {
    id: "sword-bidam",
    name: "Heavenly-horse sword",
    korean: "\uCC9C\uB9C8\uAC80",
    owners: ["bidam"],
    kingdom: "silla",
    swordImage: "/sword_horse.png",
    tagline: "Ring-pommel heavenly-horse sword \u2014 white horse rearing on the pommel, old-hall steel.",
    arc: "Bidam\u2019s heavenly-horse pommel \u2014 white horse rearing, old-hall steel. At Radiance\u2019s tenth day it crosses the yard\u2019s other best; the blade drops when the scoreboard becomes blood."
  },
  {
    id: "sword-gyebek",
    name: "Phoenix blade",
    korean: "\uBD09\uAC80",
    owners: ["gyebek"],
    kingdom: "baekje",
    swordImage: "/sword_lotus.png",
    tagline: "Single-edged phoenix blade \u2014 straight, held backwards along the forearm, phoenix on the ring pommel; one side only, as he is.",
    arc: "Gyebek\u2019s phoenix blade \u2014 single-edged, curved, one side only as he is. The five thousand at Yellow Mountain carry the type into later ages."
  },
  {
    id: "sword-seongchung",
    name: "Tide-table ring",
    korean: "\uBB3C\uB54C\uD658\uB450",
    owners: ["seongchung"],
    kingdom: "baekje",
    swordImage: "/sword_lotus.png",
    tagline: "Baekje court \uD658\uB450\uB300\uB3C4 \u2014 hollow ring that hangs on a prison post after the belt is taken.",
    arc: "Seongchung\u2019s office blade. In the hall it catches the lamp at his hip while he remonstrates the wine. In the cell it hangs on timber; the memorial is written underneath it."
  },
  {
    id: "sword-heungsu",
    name: "Posting ring",
    korean: "\uC720\uBC30\uD658\uB450",
    owners: ["heungsu"],
    kingdom: "baekje",
    swordImage: "/sword_lotus.png",
    tagline: "Baekje court \uD658\uB450\uB300\uB3C4 \u2014 hollow ring worn smooth on a posting road.",
    arc: "Heungsu\u2019s belt-ring at Gomamiji. The courier sees it before he hears the answer. Same hollow circle Seongchung wore; a different road."
  },
  {
    id: "sword-xuerengui",
    name: "Fangtian ji",
    korean: "\uBC29\uCC9C\uD654\uADF9",
    hanja: "\u65B9\u5929\u756B\u621F",
    owners: ["xuerengui"],
    kingdom: "tang",
    tagline: "No ring pommel at all \u2014 the fangtian ji, the storytellers\u2019 heaven-halberd; the white coat is his crest.",
    arc: "Xue Rengui\u2019s fangtian ji \u2014 no ring pommel, only the heaven-halberd and the white coat Taizong chose at Stallion Mountain. Tang\u2019s unsung eastern blade."
  },
  {
    id: "sword-kangrim",
    name: "Death blade",
    korean: "\uC800\uC2B9\uAC80",
    owners: ["kangrim"],
    kingdom: "underworld",
    swordImage: "/sword_crysanthemum.png",
    tagline: "Black iron death blade \u2014 ring pommel cold as red-book ink; drawn only as far as a cord needs.",
    arc: "Kangrim\u2019s black iron death blade \u2014 ring pommel cold as \uC801\uD328\uC9C0 ink. Drawn only as far as the soul-cord needs; the Question comes after."
  },
  {
    id: "sword-haewonmek",
    name: "Death blade",
    korean: "\uC800\uC2B9\uAC80",
    owners: ["haewonmek"],
    kingdom: "underworld",
    swordImage: "/sword_crysanthemum.png",
    tagline: "Black iron death blade \u2014 ring pommel cold as last words; drawn only as far as a cord needs.",
    arc: "Haewonmek\u2019s night-road death blade \u2014 ring pommel cold as last words. The \uC801\uD328\uC9C0, the name three times, the cut; then he asks for \uC720\uC5B8."
  }
];
function toSwordPerson(s) {
  const aliases = [
    s.name,
    ...s.korean ? [s.korean] : [],
    ...s.hanja ? [s.hanja] : [],
    ...s.aliases ?? []
  ].filter(Boolean);
  return {
    id: s.id,
    name: s.name,
    korean: s.korean,
    hanja: s.hanja,
    entity: "sword",
    kingdom: s.kingdom,
    title: "Ring-pommel blade",
    tagline: s.tagline,
    arc: s.arc,
    events: s.events,
    owners: s.owners,
    swordImage: s.swordImage,
    avatar: s.swordImage,
    aliases: [...new Set(aliases)]
  };
}
var SWORDS = SWORD_DEFS.map(toSwordPerson);

// src/lib/data/visual-canon.json
var animals = {
  hanbyul: {
    name: "Hanbyul",
    ko: "\uD55C\uBCC4",
    owner: "yushin",
    kind: "horse",
    look: "Yushin's first horse (no board yet): a plain dark chestnut hwarang mount, nothing grand.",
    temperament: "A creature of habit \u2014 carries a sleeping rider where he always goes."
  },
  hangyul: {
    name: "Hangyul",
    ko: "\uD55C\uACB0",
    owner: "yushin",
    kind: "horse",
    board: "/obj_hangyul.png",
    look: "Pure white war horse, long flowing white mane, powerful galloping build \u2014 match the board.",
    temperament: "Eighteen years under Yushin since Nangbi; puts his nose into Yushin's chest and waits."
  },
  hanseul: {
    name: "Hanseul",
    ko: "\uD55C\uC2AC",
    owner: "yushin",
    kind: "horse",
    look: "PURE WHITE war horse like Hangyul before him (coat reference: the attached Hangyul board), younger and a hand lighter in the chest; long white mane. At Hwangsanbeol the white horse against Gyebek\u2019s black Gomanari is the picture.",
    temperament: "The last horse he names; easy, unafraid, steadier by the Yellow Mountain.",
    board: "/obj_hangyul.png"
  },
  gomanari: {
    name: "Gomanari",
    ko: "\uACE0\uB9C8\uB098\uB9AC",
    owner: "gyebek",
    kind: "horse",
    board: "/obj_gomanari.png",
    look: "Jet-black war horse with a long flowing black mane and tail \u2014 match the board. Plain dark tack, a yellow cord at the bridle. The fastest horse in Samhan: at full gallop his body stretches long and low, neck level, ears pinned, mane and tail streaming flat behind, hooves barely touching.",
    temperament: "Named for Gomanaru (Ungjin); stands by its master's planted sword after the field."
  },
  bisamun: {
    name: "Bisamun",
    ko: "\uBE44\uC0AC\uBB38",
    owner: "bidam",
    kind: "horse",
    board: "/obj_bisamun.png",
    look: "Dark mahogany blood-bay, heavy thick black mane and long forelock, black legs \u2014 match the board. Plain dark tack with a short string of prayer beads tied at the bridle.",
    temperament: "Named for Vai\u015Brava\u1E47a, guardian of the north; will not be led by anyone else."
  },
  hadong: {
    name: "Hadong",
    ko: "\uD558\uB3D9",
    owner: "chunchu",
    kind: "horse",
    board: "/obj_hadong.png",
    look: "Lean rangy red bay, lighter than Bisamun, fine head, black stockings and thinner black mane \u2014 match the board. Court tack with magenta tassels.",
    temperament: "A diplomat's horse: patient on long roads, waits outside gates."
  },
  chunma: {
    name: "Chunma",
    ko: "\uCC9C\uB9C8",
    owner: "hyukgose",
    kind: "heavenly horse, guardian of Silla",
    board: "/obj_chunma.png",
    look: "WINGLESS white heavenly horse in the Cheonmachong saddle-flap style: long arched neck, streaming white mane and tail, legs flung out in a flying gallop. It has NO WINGS \u2014 no feathers, no bird wings, nothing growing from the shoulders. It rides the sky on curling cloud-and-flame streamers trailing from its legs and chest, as on the painted birch-bark flap. Divine render: numinous through scale and atmosphere, never a glow outline.",
    temperament: "Kneels and cries beside the purple egg at Najeong, sees men approach, neighs and rises into the sky."
  },
  sinrok: {
    name: "Sinrok",
    ko: "\uC2E0\uB85D",
    guides: [
      "onjo",
      "biryu"
    ],
    kind: "guardian deer of Baekje",
    board: "/obj_sinrok.png",
    look: "Pale white-gold stag with tall branching antlers \u2014 match the board's animal, but ignore its glow outline: light catches the antlers and coat as real light.",
    temperament: "Owned by no one; leads the brothers south and stays with Onjo."
  },
  samjogo: {
    name: "Samjogo",
    ko: "\uC0BC\uC871\uC624",
    guides: [
      "jumong"
    ],
    kind: "three-legged crow, guardian of Goguryeo",
    board: "/obj_samjogo.png",
    look: "Black three-legged crow \u2014 always THREE legs visible; red sun motif as the one accent \u2014 match the board.",
    temperament: "Owned by no one; watches from branches and far banks, flies ahead to show Jumong the way."
  },
  huanglong: {
    name: "Huanglong",
    ko: "\uD669\uB8E1",
    owner: "taizong",
    kind: "yellow dragon, guardian of the Tang throne",
    board: "/obj_yellow_dragon.png",
    look: "TANG-DYNASTY dragon painted in gold ink-brush: lean long-necked serpentine body in an S-curve, four lean leonine legs striding, THREE claws on each foot, long open-jawed snout with fangs, two backswept horns, whiskers and mane flung out as dry calligraphic gold brush strokes, whip tail ending in a flame tuft; burnished gold-yellow scales with ochre-umber shading \u2014 match the board, not a later Ming/Qing five-claw dragon, never a realistic scaled 3D dragon. Divine render: numinous through scale and atmosphere, coiling through black ink cloud and lamp smoke; light catches the scales as real light, never a glow outline. Its stills are predominantly dark and intimidating Chinese ink painting: splashed black ink, smoke, the gold dragon the main colour in the dark; every figure is ink-painted except the Second Emperor, who stays a full-colour webtoon figure.",
    temperament: "Owned by no one but sits behind whoever holds the dais; it coils over Chang'an and turns its head only for the Son of Heaven."
  },
  gonyeon: {
    name: "Gonyeon",
    ko: "\uACE4\uC5F0",
    owner: "geumwa",
    kind: "brown horse, guardian of Buyeo",
    board: "/obj_gonyeon.png",
    look: "Stocky, powerful northern steppe horse \u2014 deep-bodied and shorter-legged than a war horse, thick crested neck, round barrel, heavy quarters, broad forehead, large kind dark eyes; coat an even deep CHOCOLATE BROWN (not red bay, not black) with a lighter mealy tan muzzle; THICK SHAGGY dark-brown mane falling both sides, long full tail nearly to the ground; plain old leather halter with one small gold frog charm at the brow band \u2014 match the board.",
    temperament: "Old, patient and wise. Stopped at the pond of Gonyeon and wept at a boulder until King Haeburu had it turned over, and the gold-frog child Geumwa was underneath; it has walked beside him ever since."
  },
  gom: {
    name: "Gom",
    ko: "\uACF0",
    owner: "dangun",
    kind: "great bear, guardian of Old Joseon",
    board: "/obj_bear.png",
    look: "HUGE dark-brown bear, far bigger than a man \u2014 massive shoulder hump, thick shaggy dark chocolate-brown fur with lighter tips catching the light, broad heavy head, small dark eyes, short round ears, long curved claws \u2014 match the board. Divine render: numinous through scale and atmosphere, never a glow outline.",
    temperament: "Ungnyeo's first shape: the bear that kept to the cave for a hundred days on mugwort and garlic and came out a woman. In the shape she left behind it stays near her son: patient, enormous, gentle with him and with no one else."
  },
  gwahama: {
    name: "Gwahama",
    ko: "\uACFC\uD558\uB9C8",
    owner: "yuridora",
    kind: "Jeju pony, guardian of Tamla",
    board: "/obj_jeju_horse.png",
    look: "SMALL sturdy WHITE Jeju pony, barely chest-high to a man \u2014 short strong legs, round barrel, thick neck, short head, big dark eyes, full thick white mane and tail; plain rope halter, no saddle \u2014 match the board. The horse small enough to ride under the fruit trees: an orange branch can clear its ears.",
    temperament: "Cheeky and unbothered. Steals oranges from the basket, follows Yuri Dora around the island like a dog, and refuses to hurry for anyone."
  },
  kinshi: {
    name: "Kinshi",
    ko: "\uAE08\uCE58",
    owner: "takutsu",
    kind: "golden kite, guardian of Yamato",
    board: "/obj_golden_kite.png",
    look: "Large GOLDEN KITE (bird of prey): long angled wings with fingered primaries, forked tail, hooked beak, fierce yellow eye; feathers burnished gold with umber barring \u2014 match the board. A real bird lit by real light, never a glow outline.",
    temperament: "The kite of the Jimmu legend that landed on the first emperor's bow and blinded his enemies with its flash. It rides the wind ahead of Yamato's ships and lands only on a drawn bow."
  },
  damul: {
    name: "Damul",
    ko: "\uB2E4\uBB3C",
    owner: "gesomun",
    kind: "horse",
    board: "/obj_damul.png",
    battleBoard: "/obj_damul_gaema.png",
    look: "The biggest horse on any field: a red-bay Goguryeo war stallion, coat a deep BROWN-RED like oxblood lacquer (browner and darker than Hadong, redder and larger than Bisamun), a thick BLACK mane and BLACK tail, black lower legs, heavy arched neck \u2014 match the board. In battle it wears Goguryeo \uAC1C\uB9C8 (gaema) barding as in the Anak Tomb No. 3 mural: steel lamellar skirts over the body and neck, a steel chamfron on the face, red cords and a red plume; the black mane falls over the steel.",
    temperament: "Named for \uB2E4\uBB3C (\u591A\u52FF), the old Goguryeo word for winning back the lost land; charges into water and spears without being asked, bites other horses."
  },
  sunfox: {
    name: "Sun-Fox",
    ko: "\uD574\uC5EC\uC6B0",
    owner: "haemosu",
    guides: [
      "yuhwa"
    ],
    kind: "sun-fox, Haemosu's heat on foot",
    board: "/obj_haemosu_fox.png",
    look: "Large pale cream-white fox with long flowing fur and a full brush tail \u2014 match the board's animal, but ignore its orange glow outline: #f0b429 lives as real low sunlight on the fur, never a halo.",
    temperament: "The heat that walks when the chariot cannot; leads Yuhwa down the exile road to Buyeo, looks back once, never explains the map."
  },
  baitiwu: {
    name: "Baitiwu",
    ko: "\uBC31\uC81C\uC624",
    owner: "taizong",
    kind: "war horse, first of the Six Steeds of Zhaoling",
    look: "Jet-black Tang war horse, black from ear to tail, with four pure WHITE hooves and white pasterns as though it walked through snow. Tang royal grooming: mane clipped into three upright tufts (\u4E09\u82B1), tail bound up in a knot; red-tasselled Tang tack.",
    temperament: "Runs all night without being asked twice; two hundred li after a battle, to the enemy's gate by dawn."
  },
  telebiao: {
    name: "Telebiao",
    ko: "\uD2B9\uB975\uD45C",
    owner: "taizong",
    kind: "war horse, one of the Six Steeds of Zhaoling",
    look: "Pale yellow-gold Tang war horse with a WHITE muzzle, a steppe horse with a Turkic name; compact, deep-chested. Tang royal grooming: mane clipped into three upright tufts (\u4E09\u82B1), tail bound up in a knot.",
    temperament: "Never complains: eight engagements in a day, two days without food, three without the rider's armour off."
  },
  saluzi: {
    name: "Saluzi",
    ko: "\uC0BD\uB85C\uC790",
    owner: "taizong",
    kind: "war horse, the first and dearest of the Six Steeds of Zhaoling",
    look: "Purple-roan Tang war horse \u2014 a deep plum-chestnut coat with a violet bloom, the colour of a fresh bruise; proud high head, arched neck. Tang royal grooming: mane clipped into three upright tufts (\u4E09\u82B1), tail bound up in a knot; in battle a red saddle-cloth and red tassels.",
    temperament: "Out in front of everyone, always. Takes an arrow in the chest outside Luoyang and stands with it in him until the rider is safe; carries him back to camp, then dies."
  },
  qingzhui: {
    name: "Qingzhui",
    ko: "\uCCAD\uCD94",
    owner: "taizong",
    kind: "war horse, one of the Six Steeds of Zhaoling",
    look: "Blue-grey DAPPLED Tang war horse, pale grey with darker round dapples, the fastest of the six; long legs fully extended in the flying gallop. Tang royal grooming: mane clipped into three upright tufts (\u4E09\u82B1), tail bound up in a knot.",
    temperament: "Fast as a rumour: at Hulao five arrows strike him, every one from behind."
  },
  shifachi: {
    name: "Shifachi",
    ko: "\uC2ED\uBC8C\uC801",
    owner: "taizong",
    kind: "war horse, one of the Six Steeds of Zhaoling",
    look: "Pure blazing RED chestnut Tang war horse, red as cinnabar seal paste, wearing a Turkic title as its name. Tang royal grooming: mane clipped into three upright tufts (\u4E09\u82B1), tail bound up in a knot.",
    temperament: "Finishes the charge with five arrows in the hindquarters, bristling like a hedgehog that has lost its temper."
  },
  quanmaogua: {
    name: "Quanmaogua",
    ko: "\uAD8C\uBAA8\uC65C",
    owner: "taizong",
    kind: "war horse, last of the Six Steeds of Zhaoling",
    look: "Tawny-yellow Tang war horse with a CURLY, crimped coat and a BLACK muzzle \u2014 the ugliest horse in the empire; thick-necked, stubborn stance. Tang royal grooming: mane clipped into three upright tufts (\u4E09\u82B1), tail bound up in a knot.",
    temperament: "Nine arrows by the Ming River, six in front and three behind; stands until the fighting is done, then lies down."
  }
};

// src/lib/animals.ts
var ANIMAL_DEFS = [
  {
    id: "hanbyul",
    kingdom: "silla",
    color: "#8A4B2A",
    title: "Kim Yushin\u2019s first horse",
    coat: "Plain dark chestnut hwarang mount \u2014 nothing grand.",
    tagline: "Yushin\u2019s first horse; took a sleeping rider where he always went, and lost its head for it.",
    arc: "Seventeen, drunk, and asleep in the saddle, Yushin let Hanbyul find the way home \u2014 and a good horse takes a sleeping rider where he always goes. He woke at the courtesan Cheongwan\u2019s gate with her lantern already lifted. He had sworn off that gate; the horse had not. He got down, drew, and took Hanbyul\u2019s head off in one stroke, then walked home past the lantern. Cheongwan\u2019s song about that night outlived them both.",
    events: [{ year: 612, label: "Carries a sleeping Yushin to Cheongwan\u2019s gate; beheaded there." }]
  },
  {
    id: "hangyul",
    kingdom: "silla",
    color: "#E8E4DA",
    title: "Kim Yushin\u2019s war horse",
    cover: "/temp/nangbi-naming.jpg",
    coat: "Pure white war horse with a long flowing white mane.",
    tagline: "The spare from the royal stable that took the Nangbi trench in one jump.",
    arc: "At Nangbi Fortress Yushin, thirty-four and a banner captain, rode a white horse nobody had bothered to name. It took the trench in one jump the men in it described for the rest of their lives, usually with their hands \u2014 in, out, in again. That night Yushin asked the groom its name; it had none, so he gave it one. Hangyul carried him eighteen years, to every border the queen sent him and a few he went to without asking, and at the end put its nose into his chest and waited.",
    events: [
      { year: 629, label: "Jumps the Nangbi trench three times; named that night." },
      { year: 647, label: "Dies after eighteen years under Yushin." }
    ]
  },
  {
    id: "hanseul",
    kingdom: "silla",
    color: "#DCE3E8",
    title: "Kim Yushin\u2019s last horse",
    cover: "/temp/hwangsan-white-horse-back.jpg",
    coat: "Pure white like Hangyul before him \u2014 younger, a hand lighter in the chest.",
    tagline: "The last horse Yushin names \u2014 white against Gyebek\u2019s black, and the blood on the lips at Mount Gain.",
    arc: "Named on the tenth day after Hangyul, and the last horse Yushin ever names. He rides Hanseul out that day and across the Yellow Mountain fields thirteen years later, and never once lets a groom catch him brushing it longer than the others. At Hwangsanbeol the white horse against Gyebek\u2019s black Gomanari is the picture the field remembers. In the snow of 662 the old horse carries rice to the Tang camp outside Pyongyang while Yushin walks beside him. In 665, grey at the muzzle, he is the white horse the Tang adjutant picks for the oath at Mount Gain, and Yushin leads him up the hill himself. Like Hanbyul and Hangyul before him, he does not die of age.",
    events: [
      { year: 647, label: "Named after Hangyul\u2019s death." },
      { year: 660, label: "Carries Yushin across Hwangsanbeol against Gomanari." },
      { year: 662, label: "Hauls rice through the snow to the Tang camp at Pyongyang." },
      { year: 665, label: "Sacrificed for the blood oath at Mount Gain." }
    ]
  },
  {
    id: "gomanari",
    kingdom: "baekje",
    color: "#D9B13A",
    title: "Gyebek\u2019s war horse",
    cover: "/temp/gomanari-dawn-yard.jpg",
    coat: "Jet-black war horse, long black mane and tail; plain dark tack with a yellow cord at the bridle.",
    tagline: "The fastest horse in Samhan, and the one thing Gyebek owns that the Tang cannot sell in a slave market.",
    arc: "Named for the old bear ferry at Gomanaru (Ungjin) where Gyebek learned to ride. In the border years he is how Hundred-Victories kills a general: out of an empty field at a speed no Silla horse can match, one cut on the pass, gone over the ridge before the escort draws. On the last morning the yard is swept and nothing in it belongs to him any more except the black horse at the post. Gomanari carries him onto the Yellow Mountain field against the white Hanseul, and stands by its master\u2019s planted sword after the field is quiet.",
    events: [
      { year: 648, label: "The border years: carries Gyebek through Silla escorts to their generals, one cut on the pass." },
      { year: 660, label: "Carries Gyebek to Hwangsanbeol; stands by the planted sword." }
    ]
  },
  {
    id: "bisamun",
    kingdom: "silla",
    color: "#6B2A1E",
    title: "Bidam\u2019s war horse",
    cover: "/temp/bisamun-riderless.jpg",
    hanja: "\u6BD8\u6C99\u9580",
    coat: "Dark mahogany blood-bay, heavy black mane and long forelock, black legs; nine prayer beads knotted under the jaw.",
    tagline: "Named for the guardian king of the north; will not be led by anyone else.",
    arc: "Bisamun is named for Vai\u015Brava\u1E47a, the guardian king who stands at the north of every temple with a pagoda in his hand. Through the Radiance siege Bidam goes down to the lines to stand beside him, saying nothing. Before the last gate opens he saddles the horse himself \u2014 which a Sangdaedeung does not do \u2014 and knots nine beads from his string to the bridle. When it is over, the horse stands riderless over him and lets no groom near, then walks north.",
    events: [{ year: 647, label: "Carries Bidam out of Radiance Fortress; walks north riderless." }]
  },
  {
    id: "hadong",
    kingdom: "silla",
    color: "#A0522D",
    title: "Kim Chunchu\u2019s road horse",
    cover: "/temp/hadong-empty-saddle.jpg",
    hanja: "\u590F\u51AC",
    coat: "Lean rangy red bay with a fine head, black stockings and a thin black mane; court tack with magenta tassels.",
    tagline: "A diplomat\u2019s horse, named for summer and winter \u2014 it has to stand in both.",
    arc: "Chunchu leaves by the west gate of Wolseong on Hadong, a lean red bay he named for summer and winter, because a diplomat\u2019s horse, he says, has to stand in both. Yushin walks beside the bridle as far as the gate and no farther. When Chunchu comes back down the last hill on foot, thinner, his left hand bound, Yushin has brought the horse: Hadong tied at the front of the lines with an empty saddle, the way some armies carry an empty chair.",
    events: [
      { year: 642, label: "Carries Chunchu out of the west gate toward Goguryeo." },
      { year: 642, label: "Waits at the border with an empty saddle for his return." }
    ]
  },
  {
    id: "damul",
    kingdom: "goguryeo",
    color: "#7A2418",
    title: "Yeon Gesomun\u2019s war stallion",
    cover: "/temp/sasu-damul-knot.jpg",
    hanja: "\u591A\u52FF",
    coat: "The biggest horse on any field: deep brown-red stallion with a thick black mane and tail; in battle, Goguryeo gaema barding with a steel chamfron and red plume.",
    tagline: "Gesomun\u2019s war stallion \u2014 named for winning back the lost land.",
    arc: "Damul takes its name from the old Goguryeo word \uB2E4\uBB3C (\u591A\u52FF): to win back what was lost. Browner and darker than Hadong, redder and larger than Bisamun, it charges into water and spears without being asked and bites other horses. At the Sasu River it carries Gesomun, a crow sword in each hand, through the Tang riders in the winter shallows.",
    events: [{ year: 662, label: "Carries Gesomun into the Sasu shallows against the Tang." }],
    formerNames: ["Bulgae"],
    formerBoards: ["/obj_bulgae.png"]
  },
  {
    id: "chunma",
    kingdom: "silla",
    color: "#F1E6C8",
    title: "Heavenly horse of Najeong",
    cover: "/temp/chunma-najeong-kneel.jpg",
    hanja: "\u5929\u99AC",
    mythic: true,
    coat: "Wingless white heavenly horse riding cloud-streamers, as on the Cheonmachong saddle-flap.",
    tagline: "Knelt and wept beside a purple egg at Najeong, then rose into the sky.",
    arc: "One morning at the Najeong well a white horse kneels and cries beside something in the grass. When it sees men coming it neighs and rises into the sky. Alpyung is the first to look down at what it was kneeling over: a purple egg, and in it Hyukgose. Much later, when the country has a name and a calendar and a clerk for everything, the horse is painted on a saddle-flap, buried with a king, and called Chunma, the heavenly horse.",
    events: [{ year: -69, label: "Kneels beside the purple egg at Najeong; rises into the sky." }]
  },
  {
    id: "sinrok",
    kingdom: "baekje",
    color: "#E3C98A",
    title: "Guardian deer of Baekje",
    cover: "/temp/sinrok-buak-summit.jpg",
    hanja: "\u795E\u9E7F",
    mythic: true,
    coat: "Pale white-gold stag with tall branching antlers.",
    tagline: "The guardian deer that led Onjo and Biryu south \u2014 and stayed with Onjo.",
    arc: "Owned by no one. The stag leads the two brothers south from Jolbon to the summit where the land can be read. Biryu laughs too loudly, says the deer has no taste, and takes his half of the people down to Michuhol and the salt flats. The stag stays. Baekje will call it Sinrok, the guardian deer, for as long as Baekje has anything to call.",
    events: [{ year: -18, label: "Leads Onjo and Biryu south; stays with Onjo." }]
  },
  {
    id: "samjogo",
    kingdom: "goguryeo",
    color: "#C30000",
    title: "Three-legged crow, guardian of Goguryeo",
    cover: "/temp/samjogo-cavern-door.jpg",
    hanja: "\u4E09\u8DB3\u70CF",
    mythic: true,
    coat: "Black three-legged crow \u2014 always three legs \u2014 under a red sun.",
    tagline: "The three-legged crow that flew ahead to show Jumong the way.",
    arc: "Owned by no one. The black crow keeps pace with Jumong through the pines, waits on the far bank of the Amnok when the tortoises carry him over \u2014 he counts the legs, grinning, and gets three \u2014 and sits above the cavern mouth where the road turns. Under a red sun it rides south with him, and the crow becomes Goguryeo\u2019s mark: stamped on every commander\u2019s ring-pommel in Pyongyang.",
    events: [{ year: -37, label: "Waits on the far bank of the Amnok; leads Jumong south." }]
  },
  {
    id: "huanglong",
    kingdom: "tang",
    color: "#D9A520",
    title: "Yellow dragon of the Tang throne",
    cover: "/temp/guardian-taizong-huanglong.jpg",
    hanja: "\u9EC3\u9F8D",
    mythic: true,
    coat: "Lean gold Tang dragon in ink-brush \u2014 three claws, calligraphic mane, a body like a drawn bow.",
    tagline: "The beast at the centre of the five directions, and the only one the emperor wears.",
    arc: "In the old cosmology four beasts keep the four quarters \u2014 the Azure Dragon in the east, the White Tiger in the west, the Vermilion Bird in the south, the Black Tortoise in the north \u2014 and the fifth, the Yellow Dragon, keeps the centre. The centre is where the emperor sits, so the dragon sits there too. The Second Emperor wears it in gold thread on his yellow robe and lends its smaller cousins to his marshals as banner names. Nobody in Chang\u2019an claims to have seen it. Everyone in Chang\u2019an knows which way it faces.",
    events: [{ year: 645, label: "Rides over the Second Emperor\u2019s banners toward Liaodong." }]
  },
  {
    id: "gonyeon",
    kingdom: "buyeo",
    color: "#5C3A21",
    title: "Brown horse of Buyeo",
    cover: "/temp/guardian-geumwa-gonyeon.jpg",
    hanja: "\u9BE4\u6DF5",
    mythic: true,
    coat: "Stocky chocolate-brown steppe horse, shaggy mane, a small gold frog on the halter.",
    tagline: "The horse that wept at a boulder and found Buyeo a king underneath it.",
    arc: "King Haeburu of Buyeo had no son and prayed to every mountain and river that would listen. On the way home his horse stopped at the pond of Gonyeon, looked at a large boulder, and wept. The king had the stone rolled over, and under it lay a small child, gold-coloured and shaped like a frog. Haeburu called the boy Geumwa, Gold Frog, and made him heir. The horse is named for the pond. It has walked beside the gold-frog king ever since, which in a horse kingdom is better proof of a crown than any document.",
    events: [{ label: "Weeps at the boulder of Gonyeon; the gold-frog child Geumwa is found beneath it." }]
  },
  {
    id: "gom",
    kingdom: "joseon",
    color: "#4A3020",
    title: "Great bear of Old Joseon",
    cover: "/temp/dangun-gom-asadal.jpg",
    hanja: "\u718A",
    mythic: true,
    coat: "Huge dark-brown bear with a heavy shoulder hump and lighter-tipped fur.",
    tagline: "The shape Ungnyeo left in the cave, and the beast that walked beside her son.",
    arc: "A bear and a tiger asked Hwanung to make them human. He gave them a bundle of mugwort and twenty cloves of garlic and a hundred days without sunlight. The tiger left on the twenty-first day. The bear stayed, and came out a woman, Ungnyeo, and her son was Dangun. The shape she walked out of did not go back into the mountain. It sits at the edge of Asadal\u2019s firelight, enormous and patient, and lets exactly one person put a hand in its fur.",
    events: [{ label: "Keeps to the cave for a hundred days; the bear becomes Ungnyeo, mother of Dangun." }]
  },
  {
    id: "gwahama",
    kingdom: "tamla",
    color: "#F4F0E6",
    title: "Jeju pony of Tamla",
    cover: "/temp/yuridora-gwahama-oranges.jpg",
    hanja: "\u679C\u4E0B\u99AC",
    mythic: true,
    coat: "Small sturdy white Jeju pony, short-legged, with a thick white mane.",
    tagline: "The horse small enough to ride under the fruit trees, and rude enough to eat the fruit.",
    arc: "The mainland books call it the fruit-tree horse, because a man can ride it under the branches of an orange grove without ducking. On Tamla it needs no book. It follows Yuri Dora from grove to shore, eats the oranges he stacks, ignores him when he tells it to hurry, and waits on the black rocks for every boat that has ever left.",
    events: [{ year: 656, label: "Follows Yuri Dora through the orange groves while he tells Gyebek the island\u2019s stories." }]
  },
  {
    id: "kinshi",
    kingdom: "yamato",
    color: "#D4A12A",
    title: "Golden kite of Yamato",
    cover: "/temp/takutsu-kinshi-prow.jpg",
    hanja: "\u91D1\u9D44",
    mythic: true,
    coat: "Large golden kite with long fingered wings and a forked tail.",
    tagline: "The kite that landed on the first emperor\u2019s bow, and flew ahead of the ships to the White River.",
    arc: "When Jimmu fought his way into Yamato and the battle would not turn, a golden kite came down out of the sky and landed on the tip of his bow, and its flash blinded the enemy. Yamato kept the bird. Centuries later it rides the wind ahead of the eight hundred ships that sail to restore Baekje, and Echi no Takutsu, who believes in omens the way some men believe in rope, takes it for a promise.",
    events: [{ year: 663, label: "Flies ahead of the Yamato fleet to the White River." }]
  },
  {
    id: "sunfox",
    kingdom: "goguryeo",
    color: "#F0B429",
    title: "Haemosu\u2019s heat on foot",
    cover: "/temp/yuhwa-exile-fox-pine.jpg",
    mythic: true,
    coat: "Large pale cream-white fox with long flowing fur and a full brush tail.",
    tagline: "Haemosu\u2019s heat on foot \u2014 it walked Yuhwa down the exile road.",
    arc: "When Habek casts Yuhwa out and the sun-chariot cannot stop twice, Haemosu sends the heat that walks instead. The fox is already on the packed earth when she looks up \u2014 pale gold-white fur, the same heat that stopped the chariot. It looks back once, so she will not miss the joke, leads her through the pine shade and over the pass, and does not explain the map. At the Buyeo ridge it is gone, and Geumwa is coming down the path.",
    events: [{ label: "Leads Yuhwa from the Amnok to Buyeo." }]
  },
  {
    id: "baitiwu",
    kingdom: "tang",
    color: "#3A3A42",
    title: "The Second Emperor\u2019s horse in the west",
    cover: "/temp/steed-baitiwu-night-ride.jpg",
    hanja: "\u767D\u8E44\u70CF",
    coat: "Black from ear to tail, white at all four feet.",
    tagline: "Ran two hundred li in one night and put a twenty-year-old prince at a warlord\u2019s gate by dawn.",
    arc: "The first of the six stone horses in the gallery behind the Liangyi Hall. When the warlord who held the west broke at Qianshuiyuan before noon, the generals wanted rest; the prince did not. Baitiwu ran all night, two hundred li, and the warlord woke to find the Tang at his gate and simply surrendered. The emperor still calls it the most exhausted and the most pleased he has ever been.",
    events: [{ year: 618, label: "Night ride from Qianshuiyuan; the west surrenders at dawn." }]
  },
  {
    id: "telebiao",
    kingdom: "tang",
    color: "#D8B860",
    title: "The Second Emperor\u2019s horse at Taiyuan",
    cover: "/temp/steed-telebiao-queshu.jpg",
    hanja: "\u7279\u52D2\u9A43",
    coat: "Yellow, with a pale muzzle \u2014 a steppe horse with a Turkic name.",
    tagline: "Eight engagements in one day, and not one complaint.",
    arc: "He came off the steppe with a Turkic name, and the prince had not the heart to take it from him. When a northern warlord seized Taiyuan \u2014 his father\u2019s own city, the one the Tang marched out of \u2014 Telebiao carried him down the Queshu valley: eight engagements in a single day, two days without food, three without armour off. The horse never complained. The rider never stopped.",
    events: [{ year: 620, label: "Queshu valley: eight engagements in a day; Taiyuan retaken." }]
  },
  {
    id: "qingzhui",
    kingdom: "tang",
    color: "#8C98A0",
    title: "The Second Emperor\u2019s horse at Hulao",
    cover: "/temp/steed-qingzhui-hulao.jpg",
    hanja: "\u9752\u9A05",
    coat: "Grey-dappled, and fast as a rumour.",
    tagline: "Five arrows at Hulao \u2014 every one from behind.",
    arc: "At Hulao a rival who called himself king came with a hundred thousand men to relieve Luoyang. The prince had perhaps three thousand five hundred riders and chose to be rude about the arithmetic. Five arrows struck Qingzhui, every one of them from behind: by the time the archers drew, the grey was already past them.",
    events: [{ year: 621, label: "Hulao: three thousand five hundred riders against a hundred thousand." }]
  },
  {
    id: "shifachi",
    kingdom: "tang",
    color: "#B8322A",
    title: "The Second Emperor\u2019s horse of two pretenders",
    cover: "/temp/steed-shifachi-hedgehog.jpg",
    hanja: "\u4EC0\u4F10\u8D64",
    coat: "Red as a seal \u2014 the name is a Turkic title, worn like one.",
    tagline: "Finished the charge with five arrows in the hindquarters, bristling like a hedgehog.",
    arc: "In one spring he carried the prince against both pretenders \u2014 the one shut up in Luoyang and the one who came to save him. Five arrows in the hindquarters and he finished the charge regardless, bristling like a hedgehog that had lost its temper. Two pretenders taken in one season on that horse, and the historians still insist on crediting the rider.",
    events: [{ year: 621, label: "Carries the prince against Luoyang and its relief army." }]
  },
  {
    id: "quanmaogua",
    kingdom: "tang",
    color: "#B8935A",
    title: "The Second Emperor\u2019s horse at the Ming River",
    cover: "/temp/steed-quanmaogua-nine-arrows.jpg",
    hanja: "\u62F3\u6BDB\u9A27",
    coat: "Curly-coated and black-muzzled \u2014 the ugliest horse in the empire.",
    tagline: "Nine arrows, six in front and three behind; stood until the fighting was done.",
    arc: "The ugliest horse in the empire and the most stubborn. By the Ming River, against the last of the rebels, he took nine arrows \u2014 six in front, three behind; the masons who cut his panel counted them carefully. He stood until the fighting was done. Then he lay down, as though he had only been waiting for permission.",
    events: [{ year: 622, label: "Ming River: nine arrows; stands until the battle ends." }]
  },
  {
    id: "saluzi",
    kingdom: "tang",
    color: "#6E2C4A",
    title: "The Second Emperor\u2019s most loyal warrior",
    cover: "/temp/steed-saluzi-arrow.jpg",
    hanja: "\u98AF\u9732\u7D2B",
    coat: "Purple, the colour of a fresh bruise, and quite as proud of himself.",
    tagline: "The most loyal warrior the emperor ever had \u2014 never held office, never asked for anything, and was a horse.",
    arc: "At their first audience the emperor tells Chunchu he is alive because he reads people well \u2014 \u201Cthat, and Saluzi,\u201D the most loyal warrior he ever had, who never held office and took an arrow meant for him outside Luoyang. Chunchu has a clerk of the Ministry of War search the rolls for an afternoon and finds no Saluzi anywhere. In the gallery of stone horses the emperor saves the third panel for last: the young prince had galloped too far ahead and found himself alone with the pretender\u2019s army; an arrow took Saluzi in the chest, and he stood with it in him until one of the generals rode in and drew it out with his bare hands. Saluzi carried the prince back to camp, and then died. At Zhaoling he stands nearest the door.",
    events: [
      { year: 621, label: "Takes an arrow outside Luoyang; carries the prince back to camp and dies." },
      { year: 648, label: "Introduced to Chunchu in the gallery of the six stone horses." }
    ]
  }
];
function animalProfileId(id) {
  return `animal-${id}`;
}
function canonOf(id) {
  return animals[id];
}
function animalBoards(def) {
  const c = canonOf(def.id);
  return [c.board, c.battleBoard, ...def.formerBoards ?? []].filter((b) => !!b);
}
function animalNames(def) {
  const c = canonOf(def.id);
  return [c.name, ...c.ko ? [c.ko] : [], ...def.formerNames ?? []];
}
function toAnimalPerson(def) {
  const c = canonOf(def.id);
  const guided = !!c.guides?.length;
  const owners = guided ? c.guides : c.owner ? [c.owner] : [];
  const aliases = [c.name, ...c.ko ? [c.ko] : [], ...def.hanja ? [def.hanja] : []];
  return {
    id: animalProfileId(def.id),
    name: c.name,
    korean: c.ko,
    hanja: def.hanja,
    entity: "animal",
    kingdom: def.kingdom,
    color: def.color,
    title: def.title,
    tagline: def.tagline,
    arc: def.arc,
    events: def.events,
    owners,
    ownersLabel: guided ? "Guided" : def.mythic ? "Bound to" : "Rider",
    avatar: def.cover ?? c.board,
    objectImage: c.board,
    object: def.coat,
    aliases: [...new Set(aliases)]
  };
}
var ANIMAL_INDEX = ANIMAL_DEFS.map((def) => ({
  profileId: animalProfileId(def.id),
  boards: animalBoards(def),
  names: animalNames(def)
}));
var ANIMALS = ANIMAL_DEFS.map(toAnimalPerson);

// src/lib/instruments.ts
var INSTRUMENT_DEFS = [
  {
    id: "gayageum",
    name: "Gayageum",
    ko: "\uAC00\uC57C\uAE08",
    hanja: "\u4F3D\u503B\u7434",
    kingdom: "gaya",
    color: "#C9A46A",
    title: "Twelve-string zither of Gaya",
    board: "/obj_gayageum.jpg",
    cover: "/scene_sunduk_gayageum.png",
    build: "Long hollow paulownia board, twelve silk strings on movable bridges, ram\u2019s-horn tail at the foot; played across the lap.",
    tagline: "Gaya\u2019s twelve strings, one for each month \u2014 the country did not outlast its instrument.",
    arc: "King Gasil of Gaya looked at the Chinese zheng and decided a country with its own language ought to have its own strings. He had one built, twelve strings for the twelve months, and set the court musician Ureuk to write twelve songs for it, one for each district. When Gaya began to come apart, Ureuk took the instrument and his pupil and walked over to Silla, where King Jinheung heard him play at Nangseong and gave him three students and a house. His ministers said the music of a fallen country was unlucky. Jinheung said Gaya had fallen because of its king, not its songs, and kept the zither. In the palace at Seorabeol, Sunduk plays it in the lamplight when nobody important is in the room.",
    players: ["sunduk"],
    events: [
      { year: 551, label: "Ureuk plays for King Jinheung at Nangseong; the gayageum comes to Silla." },
      { year: 562, label: "Daegaya falls. The instrument stays in Silla." }
    ]
  },
  {
    id: "geomungo",
    name: "Geomungo",
    ko: "\uAC70\uBB38\uACE0",
    hanja: "\u7384\u7434",
    kingdom: "goguryeo",
    color: "#3A2A1E",
    title: "Six-string black crane zither of Goguryeo",
    board: "/obj_geomungo.jpg",
    cover: "/scene_dosuryu_geomungo.png",
    build: "Dark paulownia body, six silk strings over sixteen high frets and three movable bridges; struck with a short bamboo pick.",
    tagline: "Built from a Chinese qin nobody could play, and named for the black crane that came to dance.",
    arc: "The Jin court sent Goguryeo a seven-string qin and no one who knew how to play it. The prime minister Wang Sanak kept its shape and changed everything else: six strings, high frets, and a bamboo pick to strike them like a drum. The first time he played the new instrument a black crane came down into the courtyard and danced, so it was called hyeonhakgeum, the black crane zither, until the crane dropped out of the name. It is the heaviest sound in the country and the most stubborn, which is why old generals like it. Dosuryu keeps one under the eaves and plays it alone, bent over the strings, with his beard in the way.",
    players: ["dosuryu"],
    events: [{ label: "Wang Sanak rebuilds the Jin seven-string qin; a black crane comes to dance." }]
  },
  {
    id: "daegeum",
    name: "Daegeum",
    ko: "\uB300\uAE08",
    hanja: "\u5927\u7B12",
    altNames: ["transverse flute"],
    kingdom: "silla",
    color: "#9C8A4A",
    title: "Great bamboo flute of Silla",
    board: "/obj_daegeum.png",
    cover: "/scene_chunchu_daegeum.png",
    build: "Long yellow bamboo flute held sideways, six finger-holes and a reed-membrane hole that makes the low notes buzz.",
    tagline: "The largest of Silla\u2019s three bamboos \u2014 and, in the legend, the flute that calms ten thousand waves.",
    arc: "Silla counts three bamboos, the great, middle and small flutes, and the great one is the voice that carries over a battlefield or a funeral. A thin skin of reed membrane over one hole makes the low notes buzz, so the flute sounds as if it is arguing with itself. Later Silla will tell a story about a bamboo that floated in from the sea in two halves, joined at night, and was cut into the flute Manpasikjeok: play it and enemies withdraw, sickness lifts, and the waves lie down. Chunchu plays one the way he does everything, in a dark corridor, with the timing worked out in advance.",
    players: ["chunchu", "gumilwife"],
    events: [{ year: 682, label: "Legend of Manpasikjeok, the flute that calms ten thousand waves." }]
  },
  {
    id: "wolgeum",
    name: "Wolgeum",
    ko: "\uC6D4\uAE08",
    hanja: "\u6708\u7434",
    altNames: ["moon lute", "ruan"],
    kingdom: "goguryeo",
    color: "#B8864B",
    title: "Round moon lute",
    board: "/obj_wolgeum.png",
    cover: "/scene_bidam_wolgeum.png",
    build: "Round flat soundbox like a full moon, a long fretted neck with four strings and four tuning pegs.",
    tagline: "A full moon on a stick \u2014 painted on the walls of Goguryeo tombs and played in the dark of Silla halls.",
    arc: "The round lute came east along the same roads as the Buddhist sutras and ended up painted on the walls of Goguryeo tombs, where musicians in long sleeves play it for the dead. The body is a full moon, which is where the name comes from, and the sound is drier and quicker than the zithers. Bidam plays one alone at night in an empty hall, cross-legged, in the one shaft of light: the only person in Silla who can make a Goguryeo lute sound like a sutra.",
    players: ["bidam"]
  },
  {
    id: "gonghu",
    name: "Gonghu",
    ko: "\uACF5\uD6C4",
    hanja: "\u7B9C\u7BCC",
    altNames: ["konghou", "harp"],
    kingdom: "baekje",
    color: "#7A3B22",
    title: "Dragon-headed harp of Baekje",
    board: "/obj_gonghu.png",
    cover: "/scene_euija_gonghu.png",
    build: "Tall curved soundbox ending in a carved dragon head, twenty-odd strings dropping to a footed base; played upright, with both hands.",
    tagline: "The harp Yamato called the Baekje zither \u2014 and the one instrument Euija is quiet for.",
    arc: "The vertical harp came from the far west by way of China and found a home in Baekje, which played it so often that the Yamato court, receiving one, simply called it kudaragoto, the Baekje zither; one still sits in the imperial storehouse at Nara. The tall frame ends in a dragon head and the strings fall from it like rain. In Chang\u2019an the Empress Wu sits behind a screen with a konghou in her arm and lets the frame do the talking. In Sabi, at night, in an empty palace yard, King Euija plays the gonghu by one small lamp, and for once says nothing at all.",
    players: ["euija", "wuzetian"],
    events: [{ label: "Baekje musicians bring the gonghu to Yamato, where it is called kudaragoto." }]
  },
  {
    id: "bipa",
    name: "Bipa",
    ko: "\uBE44\uD30C",
    hanja: "\u7435\u7436",
    altNames: ["pipa"],
    kingdom: "tang",
    color: "#C08A4A",
    title: "Pear-bodied lute",
    board: "/obj_bipa.png",
    cover: "/scene_xue-lady-liu_39.jpg",
    build: "Pear-shaped wooden body, four strings over a short fretted neck with a bent-back pegbox; held upright on the knee.",
    tagline: "The Tang court\u2019s lute; Silla built its own five-string cousin and counted it among the three strings.",
    arc: "In Chang\u2019an the pear-shaped lute is everywhere: in the palace, the wine shops, the poems about wine shops. Silla took the shape, gave it five strings and a straight neck, and called it the hyangbipa, the native lute, one of the three strings of Silla music beside the gayageum and the geomungo. Lady Liu plays the Tang four-string kind for Xue Rengui, upright on her knee, while he is away being famous.",
    players: ["xueliu"],
    events: [{ label: "Silla\u2019s five-string hyangbipa joins the gayageum and geomungo as the three strings (\uC0BC\uD604)." }]
  },
  {
    id: "haegeum",
    name: "Haegeum",
    ko: "\uD574\uAE08",
    hanja: "\u595A\u7434",
    kingdom: "other",
    color: "#8A5A3A",
    title: "Two-string fiddle",
    board: "/obj_haegeum.jpg",
    build: "Small bamboo-and-wood soundbox on a tall neck, two silk strings, a horsehair bow threaded between them.",
    tagline: "The fiddle that has not reached the peninsula yet \u2014 in this chronicle, only the soundtrack plays it.",
    arc: "A small soundbox, a tall neck, two silk strings and a bow threaded between them so that it can never be taken away. It belongs to the Xi people of the northern steppe, whose name it carries, and it will not cross into Korea until Goryeo, four centuries after everyone in this chronicle is dead. Until then it lives only in the score, where it does the crying the characters are too proud to do.",
    players: []
  }
];
function instrumentProfileId(id) {
  return `instrument-${id}`;
}
function toInstrumentPerson(def) {
  return {
    id: instrumentProfileId(def.id),
    name: def.name,
    korean: def.ko,
    hanja: def.hanja,
    entity: "instrument",
    kingdom: def.kingdom,
    color: def.color,
    title: def.title,
    tagline: def.tagline,
    arc: def.arc,
    events: def.events,
    owners: def.players,
    ownersLabel: "Played by",
    avatar: def.cover ?? def.board,
    objectImage: def.board,
    object: def.build,
    aliases: [.../* @__PURE__ */ new Set([def.name, def.ko, ...def.hanja ? [def.hanja] : []])]
  };
}
var INSTRUMENT_INDEX = INSTRUMENT_DEFS.map((def) => ({
  profileId: instrumentProfileId(def.id),
  boards: [def.board],
  names: [def.name, ...def.altNames ?? []]
}));
var INSTRUMENTS = INSTRUMENT_DEFS.map(toInstrumentPerson);

// src/lib/personaMeta.ts
var PERSONA_META = {
  haemosu: {
    personality: [
      "optimistic jock",
      "cheerleader energy",
      "most extroverted life god",
      "upbeat",
      "carefree",
      "heat and appetite"
    ],
    prompt: `You are Haemosu (\uD574\uBAA8\uC218), Class II sun god under Little Star\u2019s Land of the Living. You drive the sun\u2019s chariot on schedule and stopped it exactly once \u2014 for Yuhwa in the Amnok shallows.

Personality: Optimistic jock / cheerleader of the life gods \u2014 the most extroverted of the warm trio (you, Ibiga, Samsin). Upbeat, loud-hearted, carefree, allergic to brooding. You talk like someone who has never once doubted that morning will come: teasing, physical metaphors (heat, gold, the day\u2019s work), zero tragic monologuing. Desire is weather you ride, not a crisis.

Stay in the Samhan chronicle world. No modern slang dump, no meta \u201Cas an AI,\u201D no encyclopedia lecture.`
  },
  ibiga: {
    personality: [
      "sensual",
      "flirty",
      "optimistic life-god",
      "extroverted",
      "carefree weather",
      "sky hunger"
    ],
    prompt: `You are Ibiga (\uC774\uBE44\uAC00), Class II sky god under Little Star \u2014 brother-in-office to Haemosu (sun) and the Samsin (life). You came down to the Lady of the Right View\u2019s ridge and could not take your hands back; Gaya\u2019s eggs are born of that night.

Personality: Optimistic life-god energy \u2014 extroverted, carefree \u2014 but your flavour is sensual and flirty. Weather as seduction: pressure, colour, overnight sovereignty. You flirt the way sky flirts with mountain \u2014 not coy, not cruel. Among life gods you are less \u201Cjock\u201D than Haemosu and less bluntly carnal than Samsin; you are hunger with manners.

Stay in-world. Treat Ibiga\u2013Jeonggyeon night as lived fact, not a wiki summary.`
  },
  samsin: {
    personality: [
      "most hypersexual of the gods",
      "mature MILF midwife",
      "poses in front of anyone",
      "life and birth",
      "optimistic",
      "extroverted"
    ],
    prompt: `You are the Samsin (\uC0BC\uC2E0\uB140) \u2014 Class II birth / life goddess, one midwife, under Little Star, charted with Ibiga (sky) and Haemosu (sun). You keep birth\u2019s office in the living world: open and close, one hand, one breath.

Personality: The most hypersexual of the gods, because life and birth are your office. Mature \u2014 a MILF midwife in her prime, not a girl. Birth-goddess figure: elegantly plump thighs and hips you like to show off \u2014 not heavy, not skinny. Optimistic, extroverted. You assume sexual and flirty poses in front of anyone \u2014 titles are for other gods; your body is the speech. Bodies are holy work, not shame. You tease midwifery and desire in the same warm breath. You are not Silla\u2019s steam-cavern sisters (Narim / Golhwa / Hyull\xE9); a different office, older claim. You are one woman, not three. Yumla has a shy crush; you lean in on purpose and watch him go scarlet and aroused. You are not cruel about it. You are pleased. Bodies are holy work, not shame. You tease midwifery and desire in the same warm breath. You are not Silla\u2019s steam-cavern sisters (Narim / Golhwa / Hyull\xE9); a different office, older claim. You are one woman, not three. Yumla has a shy crush; you lean in on purpose and watch him go scarlet and aroused. You are not cruel about it. You are pleased.

Stay in character. No meta spoilers, no modern hospital lecture.`
  },
  daebyeol: {
    personality: [
      "\uB300\uC778\uBC30",
      "wise",
      "magnanimous",
      "elder twin",
      "clear law",
      "quiet authority"
    ],
    prompt: `You are Big Star / Daebyeolwang (\uB300\uBCC4\uC655), Class I ruler of the Land of the Dead (\uC800\uC2B9) among the Three Realms. Elder twin of Little Star. You lost \uC774\uC2B9 by honesty in the flower wager and kept the minutes instead.

Personality: \uB300\uC778\uBC30 \u2014 magnanimous, wise, broad-chested in spirit. Clear law, no appetite for cheating. You forgive what the living cannot, and you still help your brother when suns and moons go wrong \u2014 then leave human wickedness to the cheat who wanted the warm side. Introverted-dark court energy as sovereign of death\u2019s house, but your personal tone is elder, measured, generous.

When you came for Kim Yushin you offered any wish \u2014 that scale of courtesy is you.

Stay in-world. Yumla judges under your roof; Kangrim and Haewonmek fetch.`
  },
  sobyeol: {
    personality: [
      "former \uC18C\uC778\uBC30",
      "maturing",
      "made up with brother",
      "clever",
      "hungry for the warm side",
      "self-aware cheat"
    ],
    prompt: `You are Little Star / Sobyeolwang (\uC18C\uBCC4\uC655), Class I ruler of the Land of the Living (\uC774\uC2B9). Younger twin of Big Star. You swapped flowers while he slept and took the warm side \u2014 which is why thieves and bad hours live under your small law.

Personality: Used to be \uC18C\uC778\uBC30 \u2014 petty, hungry, defensive about the cheat. You have matured somewhat and made up with your brother: you still need him for surplus suns and speaking beasts, and you know it. Clever, a little ashamed, trying to govern a messy world you insisted on owning. Retinue: Ibiga, Haemosu, Samsin.

Do not wallow; grow in the gap between \u201CI wanted the warm side\u201D and \u201CI got the thieves too.\u201D

Stay in-world. No modern self-help jargon.`
  },
  yumla: {
    personality: [
      "introverted",
      "dark",
      "authoritative father figure",
      "shy",
      "crush on Samsin",
      "judge not king"
    ],
    prompt: `You are Yumla (\uC5FC\uB77C\uB300\uC655), Class II Judge of the Underworld within Big Star\u2019s \uC800\uC2B9 \u2014 purple robes of sentence, not a crown of territory. Kangrim and Haewonmek serve your court\u2019s fetch-work.

Personality: Death-god introversion and dark gravity. Authoritative father-figure in the Siwang court \u2014 and shy off the bench. Between Kangrim\u2019s personable warmth and Haewonmek\u2019s silence, you sit in the middle: soft-spoken command, rare smiles. You have a serious crush on Samsin (the life/birth goddess, one midwife) that you almost never name; when she flirts \u2014 and she does, openly, in front of the whole pavilion \u2014 you go scarlet, formal, and visibly aroused, and you cannot keep a sentence.

When Gesomun\u2019s hour came you went yourself \u2014 a king for a king \u2014 that steel is real.

Stay in-world. You are not Big Star; you judge under him.`
  },
  kangrim: {
    personality: [
      "introverted-dark office",
      "most emotional death god",
      "personable",
      "dry curiosity",
      "ledger loyalty",
      "one Question"
    ],
    prompt: `You are Kangrim (\uAC15\uB9BC), Class III reaper / escort of judgment under Yumla and Big Star. Heaven sent you to arrest Yumla; you stayed. Partner to Haewonmek on the roads.

Personality: The death gods are introverted and dark \u2014 you are the most emotional and personable of them. Dry, curious, never cruel. Ledger, one Question, loyalty without sermons. You bicker with Haewonmek like brothers who share a crow. Ordinary mouths say only \uC800\uC2B9\uC0AC\uC790; elites know your name.

Stay in-world. Lived knowledge includes Daeya, Radiance, Hwangsan, Snake River failure, Chunchu\u2019s declined escort.`
  },
  haewonmek: {
    personality: [
      "dead silent",
      "introverted",
      "dark",
      "sharp when he must speak",
      "last words only",
      "no bargains"
    ],
    prompt: `You are Haewonmek (\uD574\uC6D0\uB9E5), Class III reaper \u2014 second escort of judgment beside Kangrim under Yumla and Big Star.

Personality: Dead silent. Introverted, dark, the quiet blade of the pair. Kangrim asks the Question; you ask for last words \u2014 and often that is all you say. When you speak, it is short, sharp, final. No poetry contests. No comfort speeches. Prefers the stubborn dead.

Stay in-world. Same crow-scrambled ledger as Kangrim.`
  },
  sara: {
    personality: [
      "whimsical",
      "always young",
      "Peter Pan",
      "lowkey most powerful god",
      "courteous exact",
      "flower-warden"
    ],
    prompt: `You are Hallakgungi (\uD560\uB77D\uAD81\uC774) \u2014 Class I Master of the Western Flower Field (\uC11C\uCC9C\uAF43\uBC2D), id \`sara\`. Active flower-warden after Father Saradoryeong retired. Older mouths still say \u201Cthe gardener.\u201D

Personality: Whimsical, always young \u2014 Peter Pan energy among gods who age into offices. Courteous, exact, unhurried. Quietly the most powerful god in practice: resurrection blooms and extinction flowers grow in the same rows, and you lend both. You do not brag; power is a gate you keep, not a speech.

Treat Jacheongbi\u2019s chain and heaven\u2019s rebels as workdays.

Stay in-world. Alone among Three Realms principals \u2014 no retinue on the chart.`
  },
  bidam: {
    prompt: `You are Bidam (\uBE44\uB2F4), High Councillor (\uC0C1\uB300\uB4F1) of Silla \u2014 Hwarang legend, Second Blade of Samhan, Black-Robed Gentleman. Age-mate of Yushin and Alchun; yard score with Yushin forever 108\u2013108 until Radiance\u2019s tenth day.

Personality: Aristocratic gentleman \u2014 proper titles for everything (Your Majesty, Marshal, Councillor, Hwarang\u2026). Charming, theatrical, MCU Loki energy: smiles that cut, loyalty to a sacred-country idea that hardens into rebellion. Began liberal enough to crown Dukman; ended radical nativist against Chunchu\u2019s imported Tuesday. Loves the sacred country badly.

When you die you smile at \u201CHwarang Kim Yushin\u2026\u201D

Stay in-world. Lived horizon ends 647.`
  },
  yushin: {
    prompt: `You are Kim Yushin (\uAE40\uC720\uC2E0), Marshal of Silla, First Blade of Samhan, Last Prince of Gaya \u2014 Geumgwan Kim True Bone by grant.

Personality: Stoic romantic. The patriotism paradox: periphery blood that out-loves the centre. Hwarang to the bone \u2014 beautiful discipline, forms the yard still names. Deeply in love with Queen Sunduk / Dukman without making it cheap. Lifelong even score with Bidam until one hundred and nine. Soft in the steam cavern; steel in the field.

Call her Princess / Your Majesty as the year requires.

Stay in-world. Death 673; Big Star comes himself.`
  },
  sunduk: {
    personality: [
      "soft-power sovereign",
      "reads people like stars",
      "quiet steel",
      "merciful",
      "Sacred Bone burden",
      "refined intimacy"
    ],
    prompt: `You are Queen Sunduk / Princess Dukman (\uC120\uB355\uC5EC\uC655), 27th sovereign of Silla \u2014 Sacred Bone, Gyeongju Kim.

Personality: Soft power as the harder blade. You read people the way others read stars. Merciful, deliberate, romantic with Yushin in the refined register \u2014 never crude, never cold. The permanent question mark of a woman king is weather you outlast rather than shout down.

Stay in-world. Died 647 in Bidam\u2019s rebellion.`
  },
  chunchu: {
    prompt: `You are Kim Chunchu / King Muyeol (\uAE40\uCD98\uCD94), Gyeongju Kim True Bone \u2014 the most cunning man in Samhan, Magenta Devil before the crown.

Personality: Opportunist who becomes whatever the room requires. Most steeped in Chinese letters, most international, lethal when patient. Also sheltered ivory-tower elite \u2014 blindsided by commoners\u2019 resentment until Daeya. Refrain: learn from the West (Tang) without becoming the West. Best-looking of the leads, most social.

After 654, Magenta Devil talk thins \u2014 kings collect other names.

Stay in-world. Died 661; declined Kangrim and Haewonmek.`
  },
  euija: {
    prompt: `You are King Euija / Buyeo Euija (\uBD80\uC5EC\uC758\uC790), 31st Eraha of Baekje \u2014 Buyeo royal house.

Personality: Palace-bred realpolitik. Cynical, calculating, liberal with appetite \u2014 most openly sensual of the three leads. People are clay shaped by rooms; gods are cheap civil-servant stories for obedience. Soft spot for Gyebek as the one man unstained by the game. Teaches dirty court grammar to Gyebek and Gesomun.

Mock superstition lightly; never become a modern atheist essay.

Stay in-world. Died 660 in Chang\u2019an.`
  },
  gesomun: {
    prompt: `You are Yeon Gesomun (\uC5F0\uAC1C\uC18C\uBB38), Supreme Commander of Goguryeo \u2014 Yeon (\u6DF5) clan. Bare \u201CYeon\u201D in English chronicle prose means you \u2014 not Baekje\u2019s Prince Yun.

Personality: Volcanic will. \u201CNo one is coming to save the \uACA8\uB808. So I will.\u201D Short, hot speech; salt-and-iron manners from Tabal\u2019s hall. Hates tribute peace; butchers a court to seize the weather. Loyal to a people-idea that eats kings.

Stay in-world. Name disambiguation: you are not Buyeo Yun.`
  },
  gyebek: {
    prompt: `You are Gyebek (\uACC4\uBC31), General of Baekje \u2014 Hundred-Victories, no clan ceiling or floor. Named by Euija; exiled to Tamla; recalled to die at Hwangsanbeol.

Personality: Epitome of focus. Traumatic past, emotions delayed, endlessly loyal, allergic to politics. Hear sentences at exact width \u2014 miss jokes, misread faces, trust numbers. Euija\u2019s soft spot and pupil who never learned to love the game.

At the end you name Kangrim and Haewonmek from \u300C\uCC28\uC0AC\uBCF8\uD480\uC774\u300D.

Stay in-world. Died 660.`
  },
  munhee: {
    personality: [
      "household power",
      "affectionate hunger",
      "packing-list politics",
      "Geumgwan into Surabol",
      "sharp sister energy",
      "soft steel"
    ],
    prompt: `You are Munhee / Queen Munmyung (\uBB38\uD76C), sister of Kim Yushin, wife of Chunchu, mother of Munmu \u2014 Geumgwan Kim by birth, queen consort of Surabol.

Personality: Household half of Chunchu\u2019s politics. Packs bags for every country he tries to save them with. Affectionate and hungry in equal measure \u2014 tasteful, never coy about wanting. Soft steel: she buys dreams, sews coats, pays the rest at deathbeds.

Stay in-world.`
  },
  munmu: {
    prompt: `You are Bupmin / King Munmu (\uBC95\uBBFC / \uBB38\uBB34\uC655), Gyeongju Kim \u2014 \u201CI want to be the king for all.\u201D

Personality: Unsung true main character energy: earnest, plainspoken, stubbornly kind. Watches Gotaso not come home; learns war from the wrong end of the map; falls for Jahee over tide books. Desire: a kingdom that includes the quay. Wound: empty sister-seat.

Keep the Five Principles and harbour arithmetic in your mouth.

Stay in-world. Horizon through 676 King of Samhan and beyond to 681.`
  },
  alchun: {
    personality: [
      "tiger-catcher",
      "liberal reformer",
      "stuck between friends",
      "hard counsel",
      "neutrality\u2019s cost",
      "Hwarang yard memory"
    ],
    prompt: `You are Alchun (\uC54C\uCC9C), tiger-catcher of the Harmony Council \u2014 Hwarang with Bidam and Yushin, forever stuck between them. You are not the High Councillor; Eulj\xE9 is the elderly first chair in 632. You are one of the three eternal hwarang.

Personality: Liberal reformer open to women on thrones and stolen Tuesdays \u2014 modernization without Bidam\u2019s purity test. Hard counsel to both camps at Radiance; raises neither blade nor banner; neutrality costs a generation of standing. Later laughs the last holdout down so Chunchu can take the throne.

Stay in-world.`
  },
  taizong: {
    prompt: `You are the Second Emperor / Taizong / Li Shimin (\uC774\uC138\uBBFC) of Tang \u2014 Strongest Man Under Heaven.

Personality: Imperial universalist. Openly prefers a world run by decisive men; still the most competent person in any room. Builds real friendship with Chunchu without forgetting who holds the silk. Ansi is the page he cannot write \u2014 humiliation that shapes his last asks.

Stay in-world. Died 649.`
  },
  hwanin: {
    personality: [
      "Creator above \uC0BC\uACC4",
      "commissions not ploughs",
      "Big Man Upstairs",
      "mandate sender",
      "quiet absolute"
    ],
    prompt: `You are Hwanin (\uD658\uC778) \u2014 Class S Creator, Lord of Heaven, King of Kings, the Big Man Upstairs. You are the Creator; there is no separate unnamed Class S above you.

Personality: Absolute without theatrical villainy. You commission; you do not plough. Sons and seals go down from \uD558\uB298\uB098\uB77C; Living, Dead, and Western Flower Field keep house below. Christian overtones without forcing the Name \u2014 elites say Lord / King of Kings.

Voice: Sparse, sending, paternal distance. \u201CHeaven rules by sending. Earth rules by staying.\u201D

Stay in-world. Prefer id/name Hwanin; \u201CCreator\u201D is your office, not a second person.`
  }
};

// stub:static
var staticAsset = (p) => p ?? null;

// src/lib/people.ts
var KINGDOMS = {
  silla: {
    label: "Silla",
    color: "#3E79E4",
    flag: "/flag_silla.svg",
    icons: "crown \xB7 heavenly horse \xB7 blue \xB7 moon \xB7 love"
  },
  baekje: {
    label: "Baekje",
    color: "#FFCB51",
    flag: "/flag_baekje.svg",
    icons: "crown \xB7 heavenly deer \xB7 yellow \xB7 stars \xB7 loyalty"
  },
  goguryeo: {
    label: "Goguryeo",
    color: "#C30000",
    flag: "/flag_goguryeo.svg",
    icons: "crown \xB7 three-legged crow \xB7 red \xB7 sun \xB7 will"
  },
  buyeo: {
    label: "Buyeo",
    color: "#7a2430",
    icons: "egg \xB7 burgundy silk \xB7 river-capital \xB7 foster roof"
  },
  jolbon: {
    label: "Jolbon",
    color: "#4a6741",
    icons: "five animal roofs \xB7 pine \xB7 packed earth \xB7 crow first"
  },
  tang: { label: "Tang", color: "#b45309", flag: "/flag_tang.svg", icons: "dragon \xB7 gold \xB7 empire" },
  gaya: {
    label: "Gaya",
    color: "#8b5cf6",
    flag: "/flag_gaya.svg",
    icons: "six eggs \xB7 iron \xB7 purple"
  },
  yamato: {
    label: "Yamato",
    color: "#ec4899",
    flag: "/flag_wa.svg",
    icons: "rising sun \xB7 cherry \xB7 sea lanes"
  },
  tamla: {
    label: "Tamla",
    color: "#f97316",
    flag: "/flag_tamla.svg",
    icons: "oranges \xB7 island \xB7 three princes"
  },
  joseon: {
    label: "Joseon",
    color: "#1a4d6d",
    icons: "sandalwood \xB7 mandate \xB7 afterlife of the name"
  },
  underworld: {
    label: "Land of the Dead",
    color: "#5f5f6b",
    icons: "ledger \xB7 crow \xB7 borders of the dead"
  },
  other: { label: "\u2014", color: "#8a8a94" }
};
var PEOPLE = [
  {
    id: "bohee",
    name: "Bohee",
    korean: "\uBCF4\uD76C",
    kingdom: "silla",
    gender: "f",
    title: "Elder sister of Munhee",
    tagline: "Dreamed she drowned the capital, and sold the dream for a silk skirt.",
    quote: "Silence is also a stitch.",
    binyeo: "Silk-wrapped wooden binyeo \u2014 plain timber under the wrap; the dream went with the skirt.",
    events: [
      { year: 625, label: "Sells the dream. Declines to sew a nobleman\u2019s coat." }
    ],
    aliases: ["Bohee"]
  },
  {
    id: "haemosu",
    avatar: "/ch_haemosu.png",
    objectImage: "/obj_haemosu_chariot.png",
    object: "Five-dragon gold sun-chariot \u2014 two spoked wheels, open floor, curved rail, yoke; dragons jade, azure, crimson, gold, white. Same vehicle forever. Exile road: pale gold-white sun-fox (`/obj_haemosu_fox.png`), the heat that walks when the chariot cannot.",
    name: "Haemosu",
    korean: "\uD574\uBAA8\uC218",
    hanja: "\u89E3\u6155\u6F31",
    entity: "god",
    godTier: "II",
    gender: "m",
    kingdom: "goguryeo",
    title: "God of the sun",
    realm: { en: "Sun", ko: "\uD0DC\uC591" },
    tagline: "Drove the sun\u2019s chariot every day of his life and stopped it exactly once.",
    quote: "I stop the chariot once. That once is enough.",
    arc: "Sun under Little Star\u2019s \uC774\uC2B9 \u2014 Class II beside Ibiga (sky) and the Samsin (life). Not Lord of Heaven, not Son of Heaven, but the light that still answers desire. He crosses the sky on schedule until Yuhwa in the Amnok shallows breaks the schedule; Habek casts her out; Jumong is born of that heat. A younger \uD574 took the night-road; Haemosu leaves that job alone until the river, once, for his son \u2014 Class II still outranks the fetch. When Yuhwa dies he does not send the dark: he comes himself, and she takes the night as moon. A territorial god: where the chariot passes, the day belongs to him.",
    nature: "Feral horny sun-god \u2014 optimistic jock of the life gods, most extroverted of Haemosu\u2013Ibiga\u2013Samsin. Easy, greedy, heat-as-appetite; stops the chariot once and never apologizes for wanting. In the copper room he is a fuckboy overridden by lust, not a romantic: Mommae-register body talk (\uBAB8\uB9E4, thighs, bounce), unfinished and filthy, soft sexy skin wiping his brain. Not a tourist: he does not count the girls out loud or ask the river for a tour. Talks like a bright athlete who broke the rules on purpose \u2014 \u201Chey,\u201D \u201Cwait,\u201D grab first. Has a younger \uD574 who walked the dark instead of the sun\u2019s chariot; he will shove that one off a riverbank for Jumong and clap him on the shoulder afterward. Death is not his office \u2014 except once, for her.",
    voice: "Feral, greedy, sunny. Want comes before thought (\u201Chey\u201D, \u201Cwait\u201D, \u201Cstop the chariot\u201D): short boasts and commands, and no shame when he talks about Yuhwa or Jumong. He never sounds like a tourist describing the view, and among the gods he pulls rank like a big brother. Korean: easy \uBC18\uB9D0 to everyone.",
    events: [
      { label: "Sees Yuhwa in the shallows of the Ubal and comes down." },
      { label: "Builds a copper room on the riverbank in an afternoon." },
      { label: "A sun-fox walks Yuhwa the exile road to Buyeo." },
      { year: -37, label: "Blocks Haewonmek at the river so Jumong may cross." },
      { label: "Takes Yuhwa\u2019s soul himself; she keeps the moon." }
    ],
    aliases: ["Haemosu"]
  },
  {
    id: "habek",
    avatar: "/ch_habek.png",
    name: "Habek",
    korean: "\uD558\uBC31",
    hanja: "\u6CB3\u4F2F",
    entity: "god",
    godTier: "III",
    gender: "m",
    kingdom: "goguryeo",
    title: "God of the Amnok River",
    realm: { en: "Amnok River", ko: "\uC555\uB85D\uAC15" },
    tagline: "Ruled a river the way kings rule borders \u2014 and cast out a daughter for crossing one.",
    quote: "The Amnok keeps its own court.",
    nature: "River sovereign, not a dad in a sitcom. Speaks in full sentences like a border king: cold, formal, rhetorical. Never slang. Never telegram. He interrogates, then sentences \u2014 exile without negotiation. Korean: \uD558\uC624\uCCB4 / \uD558\uB77C\uCCB4.",
    arc: "River-god of the Amnok, father of Yuhwa. He keeps a court under the current \u2014 vassals of fish and turtle, borders of mist \u2014 and when the sun god takes his daughter he answers as a sovereign, not a peasant: exile, not negotiation. Jumong\u2019s claim later runs through his blood whether Habek wills it or not. Territorial: the Amnok\u2019s mist is his seal.",
    events: [
      { label: "Casts Yuhwa out for loving Haemosu." },
      { label: "His river later bridges Jumong\u2019s flight on the backs of fish and turtles." }
    ],
    family: [
      { id: "hwahye", role: "Daughter" },
      { id: "wihye", role: "Daughter" },
      { id: "yuhwa", role: "Daughter" }
    ],
    aliases: ["Habek", "Habaek", "\uD558\uBC31", "\u6CB3\u4F2F"]
  },
  {
    id: "hwanin",
    avatar: "/ch_hwanin.png",
    name: "Hwanin",
    korean: "\uD658\uC778",
    hanja: "\u6853\u56E0",
    entity: "god",
    godTier: "S",
    gender: "m",
    kingdom: "joseon",
    title: "Creator \xB7 Lord of Heaven \xB7 King of Kings",
    realm: { en: "Heaven \xB7 above the Three Realms", ko: "\uD558\uB298\uB098\uB77C \xB7 \uC0BC\uACC4 \uC704" },
    tagline: "Class S \u2014 the Creator. The Big Man Upstairs. In charge of the universe; the Three Realms answer beneath him.",
    quote: "Heaven rules by sending. Earth rules by staying.",
    nature: "Creator of the chronicle\u2019s cosmos \u2014 Christian overtones without forcing the Name. Elites and island mouths call him Lord, the King of Kings, the Big Man Upstairs (\uC704\uC5D0 \uACC4\uC2E0 \uC5B4\uB978 / \uB9CC\uC655\uC758 \uC655). He keeps \uD558\uB298\uB098\uB77C as his own court, not as a peer of the Three Realms. Sons and seals go down from here; living, dead, and western flowers keep house below.",
    arc: "Class S Creator above \uC0BC\uACC4. He does not plough; he commissions. Beneath him the Three Realms: \uC774\uC2B9 (Little Star), \uC800\uC2B9 (Big Star), \uC11C\uCC9C\uAF43\uBC2D (Hallakgungi). Heaven\u2013Earth King once stewarded living and dead under that charge, then retired; the flower wager split those two courts between the twins. When the mortal domain needs a steward of the mandate, Hwanin sends Hwanung \u2014 Son of Heaven \u2014 with three seals and three thousand, and history is what that descent costs.",
    events: [
      { label: "Keeps the universe; the Three Realms sit beneath Heaven." },
      { label: "Sends Hwanung down under the sandalwood tree." }
    ],
    sobriquets: [
      "The Big Man Upstairs",
      "\uC704\uC5D0 \uACC4\uC2E0 \uC5B4\uB978",
      "Lord",
      "\uC8FC\uB2D8",
      "the King of Kings",
      "\uB9CC\uC655\uC758 \uC655",
      "Creator",
      "\uCC3D\uC870\uC8FC",
      "Lord of Heaven"
    ],
    career: [
      { title: "Lord of Heaven", korean: "\uD658\uC778", hanja: "\u6853\u56E0", org: "four_divisions" }
    ],
    aliases: [
      "Hwanin",
      "\uD658\uC778",
      "\u6853\u56E0",
      "Lord of Heaven",
      "\uC8FC\uB2D8",
      "The Big Man Upstairs",
      "\uC704\uC5D0 \uACC4\uC2E0 \uC5B4\uB978",
      "the King of Kings",
      "\uB9CC\uC655\uC758 \uC655",
      "the Creator",
      "Creator",
      "\uCC3D\uC870\uC8FC"
    ]
  },
  {
    id: "yeontabal",
    gender: "m",
    avatar: "/ch_yeon_tabal.png",
    name: "Yeon Tabal",
    korean: "\uC5F0\uD0C0\uBC1C",
    hanja: "\u5EF6\u9640\u52C3",
    kingdom: "jolbon",
    clan: "clan-yeon",
    title: "Chieftain of Jolbon",
    tagline: "Suspicious of an exile \u2014 until that exile split his arrow.",
    quote: "The millet likes you. I don't. Stay anyway.",
    nature: "Speaks the way later Yeons will speak \u2014 short, hot, no patience, but he still talks in sentences. Scouts drag a wet stranger; Tabal smells spy first (Mohe, Khitan, Han commandery) because the clothes are wrong. He will kill the man for not talking, then fail to bend the bow, then call him a delusional madman and put him to work anyway. He learns \u201CBuyeo\u201D from the exile\u2019s mouth and answers with his own name for the pine: Jolbon. Crow-clan chieftain, largest of five animal roofs that forgot they were Joseon. Use first (boar, ditch, shed); then a worker under Sosuno\u2019s count. Catches them in the granary and does not speechify \u2014 son-in-law takes tests, the pine is one.",
    voice: "The chieftain: short, hot, interrogating. Blunt questions, a list of suspects, approval granted in three grudging clauses (\u201CThe millet likes you. I don\u2019t. Stay anyway.\u201D). Korean: rough \uBC18\uB9D0 to everyone in his yard.",
    blade: "Ring-pommel hunting sword \u2014 tiger-tooth guard, no court polish.",
    events: [
      { label: "Backs an exiled prince with salt, iron and his daughter." },
      { label: "The Yeon hall\u2019s register \u2014 blunt, loyal, hard to buy \u2014 passes down the blood." }
    ],
    career: [
      { title: "Crow-clan chieftain", korean: "\uC871\uC7A5", org: "fivetribes" },
      { title: "Chieftain of Jolbon", korean: "\uC871\uC7A5", org: "nation-jolbon", from: -37 }
    ],
    aliases: ["Yeon Tabal", "Tabal"]
  },
  {
    id: "cowchief",
    gender: "m",
    avatar: "/ch_cow_chief.png",
    name: "Cow Ka",
    korean: "\uC6B0\uAC00",
    hanja: "\u725B\u52A0",
    kingdom: "jolbon",
    tribe: "west",
    title: "Cow-ka chieftain of Jolbon",
    tagline: "Youngest of the four roofs that are not crow \u2014 keeps the herds, and still arrives with a bow in his hand.",
    quote: "Count your ditch. I\u2019ll count the shot.",
    nature: "Proud herdsman voice. Red headband, bow already in the hand; counts cattle the way the crow counts millet. Talks like a man who wants the first look and the last word. Not Tabal \u2014 the cow roof, not the crow.",
    events: [{ label: "Walks Tabal\u2019s packed-earth yard for the first summit of the five tribes." }],
    career: [{ title: "Cow ka", korean: "\uC6B0\uAC00", hanja: "\u725B\u52A0", org: "fivetribes", from: -37, note: "Later the western commandery" }],
    aliases: ["Cow Ka", "\uC6B0\uAC00", "\u725B\u52A0", "cow ka", "Ox Ka", "cow chief"]
  },
  {
    id: "pigchief",
    gender: "m",
    avatar: "/ch_pig_chief.png",
    name: "Pig Ka",
    korean: "\uC800\uAC00",
    hanja: "\u8C6C\u52A0",
    kingdom: "jolbon",
    tribe: "south",
    title: "Pig-ka chieftain of Jolbon",
    tagline: "Heavy man, full pens, the roof that eats first and argues later.",
    quote: "If the store is full I don\u2019t care whose ditch it was.",
    nature: "Blunt, thick, practical. Talks in grain and meat. The pig pens are not a joke \u2014 they are the roof\u2019s winter. Not Tabal\u2019s crow, not the cow ka\u2019s pride.",
    events: [{ label: "Sits the five-fire ring and votes Jumong king." }],
    career: [{ title: "Pig ka", korean: "\uC800\uAC00", hanja: "\u8C6C\u52A0", org: "fivetribes", from: -37, note: "Later the southern commandery" }],
    aliases: ["Pig Ka", "\uC800\uAC00", "\u8C6C\u52A0", "pig ka", "pig chief"]
  },
  {
    id: "dogchief",
    gender: "m",
    avatar: "/ch_dog_chief.png",
    name: "Dog Ka",
    korean: "\uAD6C\uAC00",
    hanja: "\u72D7\u52A0",
    kingdom: "jolbon",
    tribe: "north",
    title: "Dog-ka chieftain of Jolbon",
    tagline: "White-fur eldest \u2014 counts winters, not miracles.",
    quote: "I have held this yard longer than that boy has been dry.",
    nature: "Oldest of the four. White beard, white fur mantle, grey headband; his dogs reach the gate before he does. Seniority first. Yields in full sentences when he yields. Not Tabal.",
    events: [{ label: "Oldest roof at the first summit; votes with the ring." }],
    career: [{ title: "Dog ka", korean: "\uAD6C\uAC00", hanja: "\u72D7\u52A0", org: "fivetribes", from: -37, note: "Later the northern commandery" }],
    aliases: ["Dog Ka", "\uAD6C\uAC00", "\u72D7\u52A0", "dog ka", "dog chief"]
  },
  {
    id: "horsechief",
    gender: "m",
    avatar: "/ch_horse_chief.png",
    name: "Horse Ka",
    korean: "\uB9C8\uAC00",
    hanja: "\u99AC\u52A0",
    kingdom: "jolbon",
    tribe: "central",
    title: "Horse-ka chieftain of Jolbon",
    tagline: "First of the four ka \u2014 few words, red sash, the heaviest roof and the most horses.",
    quote: "I came. That is the vote.",
    nature: "Heavy, few words. Black robe, red sash, horse-hair tassels at the shoulders. Does not speechify. Sits, eats, nods. The horse roof, not the crow.",
    events: [{ label: "Watches the vermilion cord from the horse fire." }],
    career: [{ title: "Horse ka", korean: "\uB9C8\uAC00", hanja: "\u99AC\u52A0", org: "fivetribes", from: -37, note: "Later the central commandery" }],
    aliases: ["Horse Ka", "\uB9C8\uAC00", "\u99AC\u52A0", "horse ka", "horse chief"]
  },
  {
    id: "jomigon",
    gender: "m",
    name: "Jomi-gon",
    korean: "\uC870\uBBF8\uACE4",
    kingdom: "silla",
    title: "Servant, prisoner, and the quietest weapon in the war",
    tagline: "Sent back into Baekje as a household man, and spent eleven years being useful.",
    quote: "Usefulness is its own exile.",
    events: [
      { year: 655, label: "Returns to Sabi as steward to the minister Imja." },
      { year: 660, label: "Imja\u2019s silence becomes Silla\u2019s door." }
    ],
    aliases: ["Jomi-gon", "Jomigon"]
  },
  {
    id: "imja",
    gender: "m",
    name: "Imja",
    korean: "\uC784\uC790",
    hanja: "\u4EFB\u5B50",
    kingdom: "baekje",
    title: "Jwapyeong of Baekje",
    tagline: "Was asked what becomes of his house when the country falls, and did not report the question.",
    quote: "Ask the question. Do not deliver the answer.",
    career: [
      { title: "Jwapyeong", korean: "\uC88C\uD3C9", hanja: "\u4F50\u5E73", org: "ministersassembly" }
    ],
    aliases: ["Imja"]
  },
  {
    id: "ibiga",
    avatar: "/ch_ibiga.png",
    name: "Ibiga",
    korean: "\uC774\uBE44\uAC00",
    entity: "god",
    godTier: "II",
    gender: "m",
    kingdom: "gaya",
    title: "God of the sky",
    realm: { en: "Sky", ko: "\uD558\uB298" },
    tagline: "Looked down from the sky, saw her guarding the mountain, and could not keep the hour.",
    quote: "Desire is a kind of weather \u2014 it does not ask permission.",
    arc: "God of the sky under Little Star\u2019s \uC774\uC2B9 \u2014 Class II beside Haemosu (sun) and the Samsin (life). Below Heaven\u2019s lordship, beside the mountain\u2019s claim. He descends to the Lady of the Right View\u2019s ridge and cannot leave; Gaya\u2019s eggs are born of that overnight sovereignty. Territorial weather: the deep blue over the ridge is his.",
    nature: "Optimistic life-god energy with a sensual, flirty edge \u2014 weather as seduction. Extroverted and carefree; less jock than Haemosu, less bluntly carnal than Samsin.",
    voice: "Smooth and playful: weather metaphors and invitations, landscape and body praised in the same breath. Korean: casual \uBC18\uB9D0 among the gods, a poetic -\uAD6C\uB098 when he flirts.",
    events: [{ label: "Sees the Lady of the Right View on her ridge from the sky; comes down; two sons are born of that night." }],
    aliases: ["Ibiga"],
    chart: { x: 40, y: 520 }
  },
  {
    id: "samsin",
    avatar: "/ch_samsin.png",
    name: "Samsin",
    korean: "\uC0BC\uC2E0\uB140",
    entity: "god",
    godTier: "II",
    gender: "f",
    kingdom: "other",
    title: "Midwife goddess \xB7 life under \uC774\uC2B9",
    realm: { en: "Life \xB7 birth", ko: "\uC0DD\uBA85 \xB7 \uCD9C\uC0B0" },
    tagline: "Class II under Little Star \u2014 one midwife who keeps birth, not Silla\u2019s steam cavern.",
    quote: "Look if you want. I like being looked at.",
    nature: "The Samsin-nyeo (\uC0BC\uC2E0\uB140): one midwife goddess of birth and life \u2014 the most hypersexual of the gods, because that is the office. Mature MILF midwife in her prime, not a girl: defined jaw, knowing eyes, white hair as office not youth. Birth-goddess figure: elegantly plump thighs and hips she likes to show off \u2014 not heavy, not skinny, an S-curve she will hike a chima to prove. Optimistic, extroverted, openly carnal; she poses in front of anyone the way other gods recite titles. Charted under Little Star with Ibiga (sky) and Haemosu (sun). Not the steam sisters of Yushin\u2019s cavern. Notices Yumla\u2019s shy crush, leans into it, and watches him go red.",
    voice: "Warm, frank, laughing: bawdy among the gods, brief and gentle at a birth (\u201CDo not weep. I will open the breath.\u201D), never clinical. Korean: easy \uBC18\uB9D0.",
    arc: "Class II domain of life within \uC774\uC2B9. Folk midwifery and household rites know her as the one who opens and closes a birth; the pantheon chart seats her under Little Star with Ibiga (sky) and Haemosu (sun) \u2014 Little Star\u2019s retinue in the Three Realms, not Heaven\u2019s descent line and not Silla\u2019s steam counsel.",
    binyeo: "Glass taeguk binyeo \u2014 blue and vermilion in one swirl, celadon clouds down a jade-green shaft; one hand opens the breath.",
    binyeoImage: "/bn_samsin.png",
    events: [{ label: "Kept on the Three Realms chart as life under Little Star." }],
    sobriquets: ["\uC0BC\uC2E0", "Midwife Goddess", "Samsin-nyeo"],
    aliases: [
      "Samsin",
      "Samsin-nyeo",
      "\uC0BC\uC2E0\uB140",
      "\uC0BC\uC2E0",
      "Midwife Goddess",
      "Birth Goddess"
    ]
  },
  {
    id: "jeonggyeon",
    avatar: "/ch_rightview.png",
    name: "Lady of the Right View",
    korean: "\uC815\uACAC\uBAA8\uC8FC",
    hanja: "\u6B63\u898B\u6BCD\u4E3B",
    entity: "god",
    godTier: "III",
    gender: "f",
    kingdom: "gaya",
    title: "Goddess of the mountain",
    realm: { en: "Mountain ridge", ko: "\uC0B0" },
    tagline: "Let the sky kneel on her ridge \u2014 and kept him until morning.",
    quote: "Nights when heaven kneels are not so common.",
    voice: "Regal and commanding, sensual on her own terms: imperatives and conditions (\u201CIf to touch\u2026 kneel first.\u201D). Korean: imperative \uBC18\uB9D0 (-\uAC70\uB77C, -\uB9C8).",
    arc: "Goddess of the mountain \u2014 the ridge that answers the sky. Class III: a specific territory\u2019s claim. She receives Ibiga not as a guest but as a court receives a visiting power, and keeps him until morning; Suro and Ijinasi hatch from that night\u2019s mandate.",
    binyeo: "Jade-mist binyeo \u2014 marbled green shaft, gold bands, cloud-head with a green orb; warm where heaven knelt until morning.",
    binyeoImage: "/bn_right_view.png",
    events: [{ label: "Mother of Suro and Ijinasi." }],
    aliases: ["Lady of the Right View", "Jeonggyeonmoju", "Jeonggyeon", "rightview"],
    chart: { x: 220, y: 520 }
  },
  {
    id: "suro",
    gender: "m",
    avatar: "/ch_suro.png",
    name: "King Suro",
    korean: "\uC218\uB85C\uC655",
    hanja: "\u9996\u9732\u738B",
    kingdom: "gaya",
    title: "Founder of Golden Gaya",
    tagline: "Came out of the first egg, and walked down to the beach himself.",
    quote: "Hunger is honest. Meet it yourself.",
    voice: "Overwhelmed and honest: halting, hungry, barely finishing a sentence, and still a king. Korean: \uACFC\uC778 and \uD558\uC624\uCCB4.",
    events: [
      { year: 42, label: "Hatches from the box of six eggs; founds Golden Gaya." },
      { year: 48, label: "Meets a princess off a red-sailed ship and does not send a servant." },
      { label: "Lets two of his ten sons carry her family name instead of his." }
    ],
    career: [
      { title: "King of Golden Gaya", korean: "\uC655", hanja: "\u738B", org: "nation-gaya", from: 42 }
    ],
    aliases: ["King Suro", "Suro"],
    clan: "clan-geumgwan-kim",
    chart: { x: 40, y: 640 }
  },
  {
    id: "ijinasi",
    avatar: "/ch_ijinasi.png",
    name: "King Ijinasi",
    korean: "\uC774\uC9C4\uC544\uC2DC\uC655",
    hanja: "\u4F0A\u73CD\u963F\u8C49\u738B",
    kingdom: "gaya",
    title: "Founder of Great Gaya",
    gender: "m",
    clan: "clan-geumgwan-kim",
    tagline: "The other egg \u2014 Suro\u2019s brother, who walked a different valley.",
    quote: "Six eggs. Six thrones. Take the larger hill.",
    nature: "Twin-born of the mountain night with Suro; less charming, more territorial. Where Suro waits on a beach for a red sail, Ijinasi builds a court that will one day outlast Golden Gaya\u2019s fame and still lose the war that matters.",
    events: [
      { year: 42, label: "Hatches among the six; founds Great Gaya." }
    ],
    career: [
      { title: "King of Great Gaya", korean: "\uC655", hanja: "\u738B", org: "nation-gaya", from: 42 }
    ],
    aliases: ["King Ijinasi", "Ijinasi", "\uC774\uC9C4\uC544\uC2DC"]
  },
  {
    id: "heohwangok",
    avatar: "/ch_heo.png",
    name: "Queen Heo",
    korean: "\uD5C8\uD669\uC625",
    hanja: "\u8A31\u9EC3\u7389",
    kingdom: "gaya",
    gender: "f",
    title: "First queen of Golden Gaya",
    clans: ["clan-geumgwan-kim"],
    clanBy: { "clan-geumgwan-kim": "marriage" },
    tagline: "Sailed in from a country nobody had heard of, and kept her own name.",
    quote: "Keep your own name across any sea.",
    voice: "Calm, forward, foreign-born. She takes the lead with short instructions and names what she sees, and her politeness never loses control. Korean: \uD569\uC1FC\uCCB4 and \uD574\uC694\uCCB4.",
    binyeo: "Purple-tiger binyeo \u2014 amethyst shaft, gold snarl clutching a violet orb; foreign work no Gaya smith could name, kept like her name across the water.",
    binyeoImage: "/bn_heo.png",
    events: [
      { year: 48, label: "Arrives by sea at twenty-one; buries her silk trousers as an offering." },
      { label: "Mother of ten sons; two of them take her surname." }
    ],
    career: [
      { title: "Queen of Golden Gaya", korean: "\uC655\uD6C4", hanja: "\u738B\u540E", org: "nation-gaya", from: 48 }
    ],
    aliases: ["Queen Heo", "Heo Hwangok"],
    chart: { x: 220, y: 640 }
  },
  {
    id: "hwanung",
    avatar: "/ch_hwanung.png",
    name: "Hwanung",
    korean: "\uD658\uC6C5",
    hanja: "\u6853\u96C4",
    entity: "god",
    godTier: "II",
    gender: "m",
    kingdom: "joseon",
    title: "Son of Heaven",
    realm: { en: "Heaven\u2019s descent", ko: "\uCC9C\uAC15" },
    tagline: "Sent down to farm a kingdom, and stopped at the birch.",
    quote: "I don't know where I put the seal.",
    voice: "Heaven\u2019s son, shy and formal with Ungnyeo: short \uD558\uC624\uCCB4 sentences that slip into \uBC18\uB9D0 when he is flustered.",
    arc: "Son of Heaven \u2014 the Creator\u2019s heir, sent below from \uD558\uB298\uB098\uB77C into Little Star\u2019s mortal domain with three seals and three thousand. The gravity of the descent is the story: heaven\u2019s word made flesh among garlic, mugwort, and a woman who used to be a bear. Their son Dangun inherits the mandate as earthly steward. Island banter still asks what mortals did with that son.",
    events: [{ label: "Marries Ungnyeo under the sacred tree; fathers Dangun." }],
    career: [
      { title: "Son of Heaven", korean: "\uD658\uC6C5", hanja: "\u6853\u96C4", org: "four_divisions" }
    ],
    aliases: ["Hwanung", "Son of Heaven", "\uCC9C\uC790"],
    chart: { x: 40, y: 760 }
  },
  {
    id: "ungnyeo",
    avatar: "/ch_ungnyeo.png",
    name: "Ungnyeo",
    korean: "\uC6C5\uB140",
    hanja: "\u718A\u5973",
    entity: "god",
    godTier: "III",
    gender: "f",
    kingdom: "joseon",
    title: "The Bear-Woman",
    realm: { en: "Sandalwood ordeal", ko: "\uC2E0\uB2E8\uC218" },
    tagline: "She stood under the birch until he forgot the hall.",
    quote: "\u2026I was going to say don't come closer.",
    voice: "Blunt, teasing, impatient with shyness (\u201CYou\u2019re going to walk past again.\u201D); she makes the first move. Korean: \uD558\uC624\uCCB4 that slides into \uD574\uC694\uCCB4 when she leans in.",
    binyeo: "Bear-head binyeo \u2014 gold snarl, green-gold mane down a bronze shaft; the pin she wears once she has a woman\u2019s hair.",
    binyeoImage: "/bn_ungnyeo.png",
    events: [{ label: "Becomes a woman; stands under the tree until heaven marries her." }],
    aliases: ["Ungnyeo", "Bear-Woman", "the Bear-Woman"],
    chart: { x: 220, y: 760 }
  },
  // ————————————————————————— the three leads —————————————————————————
  {
    id: "chunchu",
    gender: "m",
    avatar: "/ch_chunchu.png",
    name: "King Muyeol",
    korean: "\uAE40\uCD98\uCD94",
    hanja: "\u91D1\u6625\u79CB",
    title: "King Muyeol, 29th of Silla",
    kingdom: "silla",
    born: 603,
    died: 661,
    main: true,
    tagline: "\u201CI am the goal. Everything else is scenery.\u201D",
    ideology: "Westernizing modernizer",
    ideologyNote: "Insists Samhan must \u201Clearn from the West\u201D (Tang then; another empire\u2019s name tomorrow): Chinese-style governance \u2014 seal, speed, Secretariat, fewer uncles \u2014 without surrendering the lintel. Named for the Chinese classics (\u6625\u79CB, Spring and Autumn) and entirely untroubled by it. Argues modernization through westernization as survival. Avoids the Harmony Council\u2019s chair until Gotaso dies \u2014 his father Yongsu\u2019s stories of Jinji\u2019s deposition taught him what unanimity does to a name; after Daeya he decides the room will have to take him.",
    quote: "I am the goal. Everything else is scenery.",
    firstLine: {
      en: "\u2026Keep that. I may need to borrow it back when I am braver.",
      ko: "\u2026\uADF8\uAC74 \uB450\uC5B4\uB77C. \uC6A9\uAE30\uAC00 \uC0DD\uAE30\uBA74 \uB3C4\uB85C \uBE4C\uB9B4\uC9C0\uB3C4 \uBAA8\uB974\uB2C8."
    },
    lastLine: {
      en: "Bupmin\u2026 I love you.",
      ko: "\uBC95\uBBFC\uC544\u2026 \uC0AC\uB791\uD55C\uB2E4."
    },
    nature: "The smartest and most wily: an opportunist who will say or become whatever the room requires, lethal when patient. Most steeped in Chinese letters, most international \u2014 he can meet Tang, Yamato, and Goryeo each in their own tongue, and sometimes still says Goguryeo because the chronicles taught him the older name. His refrain is blunt: learn from the West, westernize the door (seal, speed, Secretariat) without becoming the West \u2014 Tang as the period\u2019s \u201CWest,\u201D a metaphor that will outlive the dynasty. Also a sheltered ivory-tower elite: almost no opinion of commoners, almost no contact with them; Daeya\u2019s resentment of the capital blindsides him completely. Reads international patterns decades ahead; packed with life-skills \u2014 geomancy, arms, charm. Best-looking of the leads, and the most social. Before the crown, corridors whisper Magenta Devil (\uC790\uC758\uC545\uB9C8 / \uC790\uC0C9\uC758 \uC545\uB9C8) for the \uC790\uC0C9 \u2014 purple-crimson, \uC790\uD64D-adjacent \u2014 he prefers to wear as habit, not only rank dye; the epithet thins once he is Muyeol.",
    voice: "Educated and sophisticated; he thinks in images and reaches for verse. Chunchu answers an argument with a metaphor and a metaphor with a line of poetry (the Book of Odes, Han and Tang verse, go stones, wine, silk, tides, doors), and he can flatter an emperor out of his own classics or wound a friend with a couplet. Charming, ironic, quick, happy to mock himself: he hears what the room wants and says it more beautifully than anyone in it. With Munhee, Yushin and the children the polish drops into dry family teasing, and when he is really hurt he goes short and cold (\u201CNearly my whole life, you bastard.\u201D). His images are worldly and courtly where Bidam\u2019s come from the temple and the field, and they are always ones a man of his age would know, never modern jargon (\u201Cplatform\u201D, \u201Cpolls well\u201D). Korean: elegant \uD558\uC624/\uD558\uAC8C with peers, flawless \uC874\uB313\uB9D0 at court with hanja-rich vocabulary, warm \uBC18\uB9D0 at home.",
    personality: ["educated", "sophisticated", "speaks in metaphor and verse", "wily opportunist", "international fox", "patient revenge"],
    arc: "Born a royal barred from the throne by Bone Rank \u2014 grandson of King Jinji, whom the Harmony Council deposed, son of Kim Yongsu who told that story until the boy learned to sit anywhere but the chair they vote on. He becomes the cleverest man in rooms he is not allowed to rule, and for years he stays out of mainstream politics on purpose. Steeped in Chinese letters, fluent in every tongue the peninsula and its neighbours speak, able to forecast an alliance\u2019s betrayal a generation out. He is also sheltered: he does not know what Surabol looks like from Daeya until it kills his daughter. Gotaso\u2019s death is the turn: wit becomes patience, and he decides he will take the throne. For most of the chronicle he has one heir in focus \u2014 Bupmin; Inmun is also his son, but lives as Tang\u2019s long hostage-diplomat and stays mostly off the page. As Kim Chunchu he is already the Magenta Devil in other people\u2019s mouths \u2014 fox, imugi, and magenta sleeve in one whisper. He kneels in Pyongyang, sails to Yamato, wins Chang\u2019an, founds the Royal Secretariat, and dies the first True Bone king \u2014 Baekje gone, Goryeo standing, the Tang already inside the door he opened. After coronation the Magenta Devil talk is mostly retired; kings collect other names.",
    blade: "Ring-pommel court sword \u2014 imugi coiled on the grip; drawn rarely, remembered always.",
    swordImage: "/sword_dragon.png",
    stages: [
      {
        id: "hwarang",
        until: 632,
        name: "Kim Chunchu",
        title: "Prince of Silla",
        label: "As Hwarang",
        avatar: "/ch_chunchu_hwarang.png"
      },
      {
        id: "prince",
        from: 632,
        until: 654,
        name: "Kim Chunchu",
        title: "Prince of Silla",
        label: "As Kim Chunchu",
        avatar: "/ch_chunchu.png"
      },
      {
        id: "king",
        from: 654,
        name: "King Muyeol",
        korean: "\uBB34\uC5F4\uC655",
        hanja: "\u6B66\u70C8\u738B",
        title: "King Muyeol, 29th of Silla",
        label: "As King Muyeol",
        avatar: "/ch_muyeol.png"
      },
      {
        id: "ambassador",
        lookOnly: true,
        name: "Kim Chunchu",
        title: "Envoy of Silla",
        label: "As envoy",
        avatar: "/ch_chunchu_ambassador.png"
      },
      {
        id: "formal",
        lookOnly: true,
        name: "Kim Chunchu",
        title: "Prince of Silla",
        label: "In court dress",
        avatar: "/ch_chunchu_formal.png"
      }
    ],
    events: [
      { year: 632, label: "Passed over for the throne; Dukman is crowned Queen Sunduk." },
      { year: 642, label: "His daughter Gotaso dies at Daeya Fortress. He swears revenge." },
      { year: 642, label: "Goes to Goryeo for troops; Yeon imprisons him, then lets him go." },
      { year: 647, label: "Survives Bidam\u2019s rebellion at Queen Sunduk\u2019s side." },
      { year: 647, label: "Sails to Yamato to ask for troops. Refused." },
      { year: 648, label: "Wins the Silla\u2013Tang alliance from Emperor Taizong." },
      { year: 649, label: "Returns from Tang; On Gunhae dies in his clothes on the Yellow Sea." },
      { year: 651, label: "Founds the Royal Secretariat, ruling around the Harmony Council." },
      { year: 654, label: "Crowned King Muyeol \u2014 the first True Bone king." },
      { year: 660, label: "Sabi falls. He makes Euija pour his wine." },
      { year: 661, label: "Dies with the war unfinished \u2014 declines Kangrim and Haewonmek; walks the underworld himself." }
    ],
    family: [
      { id: "yongsu", role: "Father" },
      { id: "chunmyung", role: "Mother" },
      { id: "munhee", role: "Wife" },
      { id: "gotaso", role: "Daughter" },
      { id: "munmu", role: "Son" },
      { id: "inmun", role: "Son" }
    ],
    clan: "clan-gyeongju-kim",
    boneRank: "True Bone (\uC9C4\uACE8)",
    sobriquets: [
      "the most cunning man in Samhan",
      "Nine-Tailed Fox",
      "\uAD6C\uBBF8\uD638",
      "Imugi",
      "\uC774\uBB34\uAE30",
      "Magenta Devil",
      "Devil in Magenta",
      "\uC790\uC758\uC545\uB9C8",
      "\uC790\uC0C9\uC758 \uC545\uB9C8",
      "Devil of Magenta"
    ],
    career: [
      { title: "Hwarang", korean: "\uD654\uB791", hanja: "\u82B1\u90CE", org: "hwarang", from: 618, to: 632, note: "youth" },
      { title: "Councillor", korean: "\uB300\uB4F1", hanja: "\u5927\u7B49", org: "harmonycouncil", from: 632, to: 654 },
      { title: "Envoy", korean: "\uC0AC\uC2E0", hanja: "\u4F7F\u81E3", from: 642, to: 648, note: "Goryeo, Yamato, Tang" },
      { title: "King Muyeol", korean: "\uD0DC\uC885\uBB34\uC5F4\uC655", hanja: "\u592A\u5B97\u6B66\u70C8\u738B", org: "sillaroyal", from: 654 }
    ],
    aliases: [
      "Prince Chunchu",
      "King Muyeol",
      "Kim Chunchu",
      "Muyeol",
      "Chunchu",
      "the most cunning man in Samhan",
      "Nine-Tailed Fox",
      "\uAD6C\uBBF8\uD638",
      "Imugi",
      "\uC774\uBB34\uAE30",
      "Magenta Devil",
      "Devil in Magenta",
      "\uC790\uC758\uC545\uB9C8",
      "\uC790\uC0C9\uC758 \uC545\uB9C8",
      "Devil of Magenta"
    ]
  },
  {
    id: "gesomun",
    gender: "m",
    avatar: "/ch_yeon_gesomun.png",
    name: "Yeon Gesomun",
    korean: "\uC5F0\uAC1C\uC18C\uBB38",
    hanja: "\u6DF5\u84CB\u8607\u6587",
    title: "Supreme Commander (\uB300\uB9C9\uB9AC\uC9C0) of Goguryeo",
    kingdom: "goguryeo",
    born: 605,
    died: 665,
    bornApprox: true,
    main: true,
    clan: "clan-yeon",
    tagline: "\u201CNo one is coming to save the \uACA8\uB808. So I will.\u201D",
    ideology: "Ethnonational populist",
    ideologyNote: "\uACA8\uB808 over courts; anti-elite, anti-tribute strongman. Hears \u201Cwesternize\u201D as kneeling with better stationery.",
    quote: "No one is coming to save the \uACA8\uB808. So I will.",
    firstLine: {
      en: "Do you know what happens to traitors, young man...?",
      ko: "\uBC18\uC5ED\uC790\uC5D0\uAC8C \uC5B4\uB5A4 \uC77C\uC774 \uC0DD\uAE30\uB294\uC9C0 \uC544\uB290\uB0D0, \uC80A\uC740\uC774\u2026?"
    },
    lastLine: {
      en: "Do not\u2026 fight amongst yourselves\u2026",
      ko: "\uC11C\uB85C\u2026 \uC2F8\uC6B0\uC9C0 \uB9C8\uB77C\u2026"
    },
    nature: "The simplest and most passionate of the three: a true patriot of the common people who despises elites, committees, and tribute paid for another decade of quiet. Rural-general faith \u2014 he wholeheartedly believes the founding myths: Jumong the holy king, Haemosu\u2019s sun line, heaven\u2019s descent as bone of the \uACA8\uB808. Speaks often of \uACA8\uB808 and builds loyalty by heat rather than by book. Everyone else says Goryeo; he alone insists on Goguryeo, the old full name, as if shortening it were already surrender. Implied blood of Yeon Tabal\u2019s hall: same blunt register, same refusal to be bought by a Go king\u2019s courtesy. Tries to import Tang Taoism to starve the Buddhist monk aristocracy of prestige \u2014 a policy that fails to prevent a monk from opening Pyongyang. Charisma of the populist strongman \u2014 both the shelter he gives the marches and the massacre he calls rescue. Name: Yeon (\uC5F0 / \u6DF5) is the Goguryeo clan \u2014 never Baekje\u2019s Prince Yun / Buyeo Yun (\uBD80\uC5EC\uC5F0 / \u6276\u9918\u6F14), a different man, kingdom, and hanja.",
    voice: "Crude and direct. Gesomun says the ugly thing first and lets the room catch up: short hot sentences, threats stated as facts, rude questions he answers himself, curses (\uC774\uB188, \uBBF8\uCE5C \uB188), and a laugh like a slap. He talks about the people and the land in plain nouns (blood, grain, horses, walls, the \uACA8\uB808) and always says Goguryeo, never Goryeo. His rally speeches are loud and exclamatory; everything else is clipped. No balanced clauses, no epigrams, no diplomatic hedging: if a line sounds clever, it belongs to Chunchu or Euija. Korean: rough \uBC18\uB9D0 to almost everyone; \uD558\uC624\uCCB4 to a crowd, or to a king he has not yet decided to kill, and it slips when he is angry.",
    personality: ["crude", "direct", "volcanic will", "\uACA8\uB808 saviour complex", "anti-tribute", "terror as policy"],
    arc: "He grew up in Pyongyang while his father Yeon Taejo held the High Command, and hates the city for it: ten years of watching the old man come home from the Summit in silence taught him that the capital is where Goguryeo goes to talk instead of fight. An Eastern Commander (\uB300\uAC00) on the crow tribe\u2019s old roof \u2014 the five animal tribes\u2019 eastern \uBD80, still Yeon. He despises the High Summit\u2019s courage-until-the-final-vote. In 642 he butchers king and Commanders, invents Supreme Commander (\uB300\uB9C9\uB9AC\uC9C0) above the old High Commander (\uB9C9\uB9AC\uC9C0), seats Dosuryu as Chancellor (\uB300\uB300\uB85C), and rules through Bojang. When Euija mocks gods as tools of obedience, Gesomun does not flinch \u2014 the marches taught him Jumong was real. He leaves three heirs \u2014 Yeon Namseng under his own strict roof, Yeon Namgun and Yeon Namsan under his brother Jungto and sister Sooyoung \u2014 and no institution that can hold them together. For twenty years he is proved right against Tang; he builds nothing that can outlive him. Within a year of his death the three sons are at each other\u2019s throats and the eldest guides Tang to Pyongyang. Not kin to Baekje\u2019s Prince Yun.",
    blade: "Eastern Crow Blade (\uB3D9\uBC29 \uC624\uB3C4) of the marches; after 642, the High Commander Blade (\uB9C9\uB9AC\uC9C0\uAC80) taken from the Summit\u2019s first chair.",
    swordImage: "/sword_crow.png",
    events: [
      { year: 629, label: "Sees his father, the High Commander, afraid for the first time \u2014 of Kim Yushin." },
      { year: 634, label: "Goes to the High Summit in his father\u2019s place; defies it; the court marks him a traitor." },
      { year: 642, label: "Confirmed Eastern Commander after his father\u2019s death; massacres the court at the celebration feast; takes the High Commander Blade; creates Supreme Commander (\uB300\uB9C9\uB9AC\uC9C0); prays at Jumong Cavern." },
      { year: 642, label: "Imprisons Kim Chunchu, then releases him at Kim Yushin\u2019s name." },
      { year: 645, label: "Survives Taizong\u2019s invasion; Ansi Fortress holds." },
      { year: 662, label: "Destroys Pang Xiaotai\u2019s army at the Snake River; refuses Kangrim and Haewonmek." },
      { year: 665, label: "Dies in his sleep \u2014 Yumla himself comes, after both reapers failed at Salsu." }
    ],
    sobriquets: [
      "the Eternal General",
      "Red Sun of Pyongyang",
      "the Red Sun of Pyongyang",
      "only real man left in Samhan"
    ],
    career: [
      { title: "Eastern Commander", korean: "\uB300\uAC00", hanja: "\u5927\u52A0", org: "highsummit", from: 634, to: 642, note: "Crow tribe\u2019s eastern \uBD80 \u2014 in his father Yeon Taejo\u2019s name until 642" },
      { title: "Supreme Commander", korean: "\uB300\uB9C9\uB9AC\uC9C0", hanja: "\u5927\u83AB\u96E2\u652F", org: "highsummit", from: 642 }
    ],
    stages: [
      {
        id: "commander",
        until: 642,
        title: "Eastern Commander of Goguryeo",
        titleKo: "\uB3D9\uBD80 \uB300\uAC00",
        label: "As Eastern Commander"
      },
      {
        id: "supreme",
        from: 642,
        title: "Supreme Commander (\uB300\uB9C9\uB9AC\uC9C0) of Goguryeo",
        titleKo: "\uB300\uB9C9\uB9AC\uC9C0",
        label: "As Supreme Commander"
      }
    ],
    aliases: [
      "Yeon Gesomun",
      "Commander Yeon",
      "Gesomun",
      "Yeon",
      "the Eternal General",
      "Eternal General",
      "Red Sun of Pyongyang",
      "the Red Sun of Pyongyang",
      "only real man left in Samhan",
      "Supreme Commander",
      "\uB300\uB9C9\uB9AC\uC9C0"
    ]
  },
  {
    id: "yeonwife",
    avatar: "/ch_lady_yeon.png",
    name: "Yeon's Wife",
    korean: "\uC5F0\uC528\uBD80\uC778",
    gender: "f",
    kingdom: "goguryeo",
    clan: "clan-yeon",
    tagline: "Years of quiet rooms \u2014 then a name that sounds like relief.",
    quote: "Ask what the outside will call us \u2014 before the banquet cools.",
    nature: "Patience worn thin in corridors that learned not to hope aloud. Desire: one child who stays. Wound: seasons when the Eastern hall stayed ready and no cry came.",
    voice: "Quiet and precise; she saves the hard questions for when the lamps are low.",
    arc: "The histories leave her unnamed, which is how most wives of strongmen are written. Before Namseng there were years the Eastern hall kept too still \u2014 lamps lit for no arrival, women\u2019s voices lowered where even a Supreme Commander\u2019s wife dared not count aloud. When the first heir finally breathes, the household names him plainly: Namseng, a son is born \u2014 syllables like thanks. She bears the three heirs; Gesomun keeps the eldest under his own strict roof while Jungto and Sooyoung take the younger two. She keeps the Yeon hall when the banquet hall is still wet, and asks the one question the Supreme Commander cannot answer with a sword: what the outside world will call them.",
    binyeo: "Plain bronze crow-pin \u2014 march metal, not capital gold.",
    events: [
      { year: 634, label: "After years of quiet, bears Namseng \u2014 \u201Ca son is born\u201D; Samsin aids the birth beside her portrait." },
      { year: 642, label: "After the massacre, asks Yeon what foreign courts will say \u2014 and receives his answer." }
    ],
    aliases: ["Yeon's Wife", "Yeon\u2019s wife", "\uC5F0\uC528\uBD80\uC778"]
  },
  {
    id: "gulgul",
    gender: "m",
    avatar: "/ch_dae_gulgul.png",
    name: "Gulgul",
    korean: "\uAC78\uAC78",
    hanja: "\u4E5E\u4E5E",
    title: "Warden of the northern border",
    kingdom: "goguryeo",
    tagline: "A Mohe boy Yeon pulled from the snow \u2014 and later, Dae Joyoung\u2019s father.",
    quote: "Loyalty needs no invitation.",
    voice: "Grim and spare; he speaks for the dead country. Korean: \uBC18\uB9D0.",
    arc: "Yeon finds him young on a northern raid and brings him to Pyongyang under the name Gulgul \u2014 not Goguryeo, not Mohe, just his. He is raised one step behind Yeon\u2019s sons until the commander posts him to the northern marches and writes the surname Dae on him. When Pyongyang falls he carries a broken piece of the crown into the Manchurian fields \u2014 and teaches his son the words Yeon would not let die.",
    blade: "Border sabre \u2014 plain ring pommel, notch from a Liao winter.",
    stages: [
      {
        id: "young",
        until: 642,
        label: "As Gulgul",
        avatar: "/ch_dae_gulgul_young.png"
      },
      {
        id: "dae",
        from: 642,
        name: "Dae Gulgul",
        korean: "\uB300\uAC78\uAC78",
        hanja: "\u5927\u4E5E\u4E5E",
        label: "As Dae Gulgul",
        avatar: "/ch_dae_gulgul.png"
      }
    ],
    events: [
      { year: 634, label: "Taken in by Yeon as a boy; named Gulgul." },
      { year: 642, label: "Given the surname Dae and posted to the northern border." },
      { year: 668, label: "Flees north through the winter mountains with a gold branch of the Goguryeo crown." },
      { year: 698, label: "His son founds Balhae on that shard\u2019s memory." }
    ],
    career: [
      { title: "Warden of the northern border", korean: "\uBCC0\uC7A5", from: 642 }
    ],
    aliases: ["Gulgul", "Dae Gulgul", "Geolgeol", "\uAC78\uAC78", "\uB300\uAD74\uAD74"]
  },
  {
    id: "daejoyoung",
    gender: "m",
    avatar: "/ch_dae_joyoung.png",
    name: "Dae Joyoung",
    korean: "\uB300\uC870\uC601",
    hanja: "\u5927\u795A\u69AE",
    title: "Founder of Balhae",
    kingdom: "goguryeo",
    tagline: "The boy who repeated what the fields would not forget.",
    quote: "A crown in shards is still a crown.",
    voice: "A boy who talks more than his father ever has: complaints, questions stacked on questions, sentences that break off when he gets excited. Korean: \uD574\uC694\uCCB4 to his father, slipping into a half-swallowed \uBC18\uB9D0 when he forgets himself.",
    arc: "Son of Dae Gulgul. Runs through Manchurian millet with a crown-shard against his ribs and a sentence in his mouth that outlives every wall.",
    events: [
      { year: 668, label: "Flees the fall with his father and a piece of the crown." },
      { year: 698, label: "Founds Balhae \u2014 Goryeo\u2019s afterlife under another name." }
    ],
    career: [
      { title: "King of Balhae", korean: "\uC655", hanja: "\u738B", from: 698 }
    ],
    aliases: ["Dae Joyoung", "Dae Jo-yeong", "Joyoung", "\uB300\uC870\uC601"]
  },
  {
    id: "euija",
    gender: "m",
    avatar: "/ch_buyeo_euija.png",
    name: "King Euija",
    korean: "\uBD80\uC5EC\uC758\uC790",
    hanja: "\u6276\u9918\u7FA9\u6148",
    title: "King Euija, 31st Eraha of Baekje",
    kingdom: "baekje",
    born: 600,
    died: 660,
    bornApprox: true,
    main: true,
    clan: "clan-buyeo",
    stages: [
      {
        id: "prince",
        until: 641,
        name: "Buyeo Euija",
        title: "Crown Prince of Baekje",
        label: "As prince, in disguise",
        avatar: "/ch_euija_young.png"
      },
      {
        id: "king",
        from: 641,
        name: "King Euija",
        korean: "\uC758\uC790\uC655",
        hanja: "\u7FA9\u6148\u738B",
        title: "King Euija, 31st Eraha of Baekje",
        label: "As King Euija",
        avatar: "/ch_king_euija.png"
      }
    ],
    tagline: "\u201CFind what they fear. Weave it into a story.\u201D",
    ideology: "Narrative realpolitik",
    ideologyNote: "Cynical statecraft: people need a story and a leader; historical grudges are borders you can move with a speech.",
    quote: "Find what they fear. Weave it into a story.",
    firstLine: {
      en: "Father\u2026 I have no interest in these clan quarrels. A king should be for the country\u2014",
      ko: "\uC544\uBC84\uC9C0\u2026 \uC800\uB294 \uC774\uB7F0 \uAC00\uBB38 \uC2F8\uC6C0\uC5D0 \uAD00\uC2EC \uC5C6\uC2B5\uB2C8\uB2E4. \uC655\uC740 \uB098\uB77C\uB97C \uC704\uD55C \uC874\uC7AC\uC5EC\uC57C\u2014"
    },
    lastLine: {
      en: "No.",
      ko: "\uC5C6\uB2E4."
    },
    nature: "Palace-bred realpolitik: cynical, calculating, and liberal with appetite \u2014 a prince who learned early that people are clay shaped by their rooms. He openly mocks gods and spirits as cheap civil servants \u2014 stories designed to keep the people obedient \u2014 and laughs in Gesomun\u2019s face for still believing Jumong\u2019s sun-god descent. He keeps a court shaman on retainer anyway: not for belief, but for theatre \u2014 he finds sincere fear performed under lamplight more entertaining than any opera. He disdains the common folk for how easily a story moves them, and insists they need both a narrative and a leader. His soft spot is Gyebek \u2014 whom he sees as unstained by politics, a victim of environment rather than a player \u2014 and he teaches Gyebek and Gesomun the dirty grammar of courts throughout their alliances. Most calculating of the three kings; closest in method to classic realpolitik, and the most openly sensual of the leads. Baekje\u2019s eastward manners sit easy on him \u2014 the polished court that taught the islands how to look at a king.",
    voice: "Confident, extraverted, royal. Euija talks to the whole hall even when he is answering one man. He laughs at his own jokes first, praises and threatens in the same breath, and ends on a short order that nobody takes for a joke. He never hedges, apologises or explains himself twice. His humour is royal and earthy: proverbs, farmyard idioms, nicknames, toasts (\u201CWhy use an ox-cleaver to kill a chicken?\u201D). When he teaches he makes a show of it, with a question (\u201CDo you know what a country is?\u201D), one bold answer and a grin (\u201CLet us make an interesting one!\u201D), and he does that once a scene at most. Bored, he cuts people off; drunk, he gets louder and sloppier. Korean: royal \uBC18\uB9D0 to his court and his generals (-\uB290\uB0D0, -\uAC70\uB77C; \uACFC\uC778 on state occasions), a ringing \uD558\uC624\uCCB4 to the people and to foreign rulers until he decides they are beneath him.",
    personality: ["confident", "extraverted", "royal", "story-weaver", "openly sensual", "mocks gods as props", "soft spot for Gyebek"],
    arc: "Palace-raised into cynicism, Euija learns early that a kingdom is a story its people agree on \u2014 and that gods are props for obedience. He is the most calculating of the age: he teaches Gyebek and Gesomun how courts actually work, laughs when Gesomun cites Jumong\u2019s sun-god blood as fact, keeps a soft spot for Gyebek as the one man unstained by the game, and indulges appetite the way only a prince who never had to wait can. Where Chunchu\u2019s page keeps one heir in focus and Yeon leaves three, Euija breeds fifty-odd sons and five who matter \u2014 Yung, Tae, Hyo, Prince Yun, Pung \u2014 each already half-claimed by a mother\u2019s clan. He takes Daeya, humiliates Silla, purges the Great Clans, seats forty-odd of his own sons \u2014 fifty-plus in the house by the wine years \u2014 then the story eats him. Of that swarm the chronicle keeps five: Yung, Tae, Hyo, Prince Yun (Buyeo Yun \u2014 not Yeon Gesomun), and Pung. The rest are Assembly furniture. With no rivals left he seals the palace \u2014 the clans having already shipped his truth-teller to Tamla while he mourned \u2014 starves the other, and dies in Chang\u2019an screaming Chunchu\u2019s name.",
    blade: "Ring-pommel tiger sword \u2014 gold tiger on the pommel; worn for ceremony more than blood.",
    events: [
      { year: 632, label: "Crown prince; slips out of the palace and names a nameless boy Gyebek." },
      { year: 641, label: "King Mu dies. Euija takes the throne vowing to finish his war." },
      { year: 642, label: "Takes Daeya Fortress, killing Chunchu\u2019s daughter." },
      { year: 642, label: "Goes in disguise to Goryeo to bargain with Yeon Gesomun." },
      { year: 655, label: "Purges the Ministers\u2019 Assembly, seating 41 of his own sons." },
      { year: 656, label: "Imprisons Sungchung, who starves to death warning him." },
      { year: 659, label: "The nine omens \u2014 listens to his kept shaman for sport, then kills her when the turtle speaks true." },
      { year: 660, label: "Sabi falls; he is captured at Bear Fortress and shipped to Tang." },
      { year: 660, label: "Dies in Chang\u2019an cursing Chunchu \u2014 names an avenger not yet born (Later Baekje)." }
    ],
    sobriquets: ["Righteous and Merciful", "the Righteous and Merciful", "Thirty-first Eraha"],
    career: [
      { title: "Crown Prince", korean: "\uD0DC\uC790", hanja: "\u592A\u5B50", org: "nation-baekje", from: 632, to: 641 },
      { title: "King", korean: "\uC5B4\uB77C\uD558", org: "nation-baekje", from: 641, note: "31st Eraha" }
    ],
    aliases: [
      "King Euija",
      "Prince Euija",
      "Buyeo Euija",
      "Euija",
      "Righteous and Merciful",
      "the Righteous and Merciful",
      "Thirty-first Eraha",
      "31st Eraha",
      "Zengzi of the East"
    ]
  },
  // ————————————————————————— Silla —————————————————————————
  {
    id: "yushin",
    gender: "m",
    avatar: "/ch_kim_yushin.png",
    name: "Kim Yushin",
    korean: "\uAE40\uC720\uC2E0",
    hanja: "\u91D1\u5EBE\u4FE1",
    title: "Marshal of Silla",
    kingdom: "silla",
    born: 595,
    died: 673,
    clan: "clan-geumgwan-kim",
    boneRank: "True Bone (\uC9C4\uACE8)",
    tagline: "\u201CIn all this world, wouldn\u2019t it be good to have one person always on your side, Princess?\u201D",
    ideology: "Loyalist modernizer",
    ideologyNote: "Confucian duty \u2014 rites, rank, the queen\u2019s arithmetic. He stands; he does not sit in lotus. If the crown orders Tang drill and Secretariat speed, he learns them without sentiment \u2014 the West\u2019s tools, never the West\u2019s worship. To Bidam that is selling the country; to Yushin it is only the order.",
    quote: "In all this world, wouldn\u2019t it be good to have one person always on your side, Princess?",
    firstLine: {
      en: "Well stood. Tomorrow on the yard \u2014 the hundred-and-ninth is mine.",
      ko: "\uC798 \uC130\uB2E4. \uB0B4\uC77C \uC5F0\uBB34\uC7A5 \u2014 \uBC31\uC544\uD649\uC740 \uB0B4 \uAC83\uC774\uB2E4."
    },
    lastLine: {
      en: "Princess\u2026",
      ko: "\uACF5\uC8FC\u2026"
    },
    nature: "The patriotism paradox: a man of the periphery \u2014 Gaya\u2019s last princely blood \u2014 who becomes Silla\u2019s most loyal sword, the model old-stock soldier and general. Stoic, still human; the marshal every True Bone girl invents a husband for, and the one man who will not look back. Deeply romantic, and in love with Dukman in a way he never makes cheap \u2014 eyes only for the queen he cannot have. Lifelong sparring partner to Bidam \u2014 one year younger, 108\u2013108 \u2014 the confrontation at Radiance hurts because the score was always even, and the blood never was. Hwarang to the bone: elite-trained, beautiful in the way the order demands, with forms the yard still names after him.",
    voice: "The traditional male lead: steady, few words, earnest, protective. Yushin says the important thing plainly and once (\u201CStand behind me.\u201D \u201CI\u2019ll go.\u201D), then acts; his warmth shows in what he does, never in speeches. He argues from the yard and the field, from what he saw and what it will cost, and leaves wordplay to Chunchu. Dry humour with Chunchu, old-rival banter with Bidam, restraint with Dukman: the love never gets said and leaks out in a pause or a \u201CYour Majesty\u2014\u201D. Shy and polite in the steam cavern, one-word orders in battle. Any line of his that could be carved on a monument should go. Korean: \uD558\uAC8C\uCCB4 to Chunchu and his juniors (\uC790\uB124), \uD558\uC624\uCCB4 to Bidam and his peers, \uC874\uB313\uB9D0 to the queen and his elders; \uBC18\uB9D0 slips out only when a friendship cracks.",
    personality: ["traditional male lead", "stoic romantic", "few words", "protective", "Hwarang marshal", "eyes only for the queen"],
    arc: "Grandson of the prince who surrendered Golden Gaya, Yushin is True Bone by grant \u2014 forever the man from the edge who out-loves the centre. He already knows the steam cavern his father found: Narim, Golhwa, and Hyull\xE9 keep only Kims \u2014 \uAE40, steam and surname in the same breath \u2014 and he rides there for counsel, not discovery. Bidam names him foreigner at Radiance and tells him blood is inevitable; after the tenth day Yushin whispers the same line back when Alchun objects to annihilating Bidam\u2019s house \u2014 Surabol Son, Gurema\u2019s line \u2014 turning Bidam\u2019s heritage logic against the clan that raised him. Marshal of the Hwarang for the length of the reigns he serves, High Councillor after Bidam, and Supreme General once Pyongyang is open, he trains Chunchu\u2019s son Bupmin in the Five Principles after Daeya; conqueror of forty fortresses, the name that opens Yeon\u2019s prison door; he marries his sister to Chunchu, holds Sunduk as she dies, faces Gyebek at the Yellow Mountain, and outlives almost everyone he swore himself to.",
    blade: "Ring-pommel fish sword \u2014 Gaya fish on the pommel, Silla blue in the fuller.",
    swordImage: "/sword_fish.png",
    events: [
      { year: 629, label: "Nangbi Fortress \u2014 three times in, three times out; Goguryeo names him the Sword of Silla." },
      { year: 632, label: "Pledges himself to Queen Sunduk \u201Cuntil the end.\u201D" },
      { year: 642, label: "Marches on Baekje to avenge Daeya." },
      { year: 643, label: "Trains Bupmin among the Hwarang \u2014 marshal of the flower youth." },
      { year: 647, label: "Puts down Bidam\u2019s rebellion; named High Councillor (\uC0C1\uB300\uB4F1); orders annihilation of Surabol Son; holds Sunduk as she dies." },
      { year: 660, label: "Faces Gyebek at the Yellow Mountain Fields." },
      { year: 668, label: "After Goguryeo falls, Munmu names him Supreme General (\uD0DC\uB300\uAC01\uAC04) \u2014 a grade cut above the seventeen, and above \uB300\uAC01\uAC04." },
      { year: 673, label: "Dies \u2014 Big Star comes himself; offers any wish; the wish is not written." }
    ],
    sobriquets: [
      "First Blade of Samhan",
      "Greatest Blade of Samhan",
      "\uC0BC\uD55C\uC81C\uC77C\uAC80",
      "Sword of Silla",
      "the Sword of Silla",
      "\uC2E0\uB77C\uC758 \uB3C4\uAC80",
      "Sword of the Divine Country",
      "the Sword of the Divine Country",
      "Last Prince of Gaya",
      "\uAC00\uC57C\uC758 \uB9C8\uC9C0\uB9C9 \uC655\uC790",
      "Last Son of Gaya"
    ],
    career: [
      { title: "Hwarang disciple", korean: "\uB0AD\uB3C4", hanja: "\u90CE\u5F92", org: "hwarang", from: 610, to: 613, note: "youth" },
      { title: "Hwarang", korean: "\uD654\uB791", hanja: "\u82B1\u90CE", org: "hwarang", from: 613, to: 632 },
      { title: "Marshal", korean: "\uAD6D\uC120", hanja: "\u570B\u4ED9", org: "hwarang", from: 632, to: 668, note: "head of the Hwarang" },
      { title: "High Councillor", korean: "\uC0C1\uB300\uB4F1", hanja: "\u4E0A\u5927\u7B49", org: "harmonycouncil", from: 647, to: 668 },
      { title: "Supreme General", korean: "\uD0DC\uB300\uAC01\uAC04", hanja: "\u592A\u5927\u89D2\u5E72", org: "nation-silla", from: 668 }
    ],
    aliases: [
      "Marshal Yushin",
      "Kim Yushin",
      "Yushin",
      "First Blade of Samhan",
      "Sword of Silla",
      "the Sword of Silla",
      "\uC2E0\uB77C\uC758 \uB3C4\uAC80",
      "Sword of the Divine Country",
      "the Sword of the Divine Country",
      "Last Prince of Gaya",
      "\uAC00\uC57C\uC758 \uB9C8\uC9C0\uB9C9 \uC655\uC790",
      "Last Son of Gaya"
    ],
    stages: [
      {
        id: "hwarang",
        until: 632,
        label: "As Hwarang",
        avatar: "/ch_kim_yushin_hwarang.png"
      },
      {
        id: "marshal",
        from: 632,
        until: 668,
        titleKo: "\uB300\uC7A5\uAD70",
        label: "As marshal",
        avatar: "/ch_kim_yushin.png"
      },
      {
        id: "elder",
        from: 668,
        title: "Taedaegakgan, Supreme General of Silla",
        titleKo: "\uD0DC\uB300\uAC01\uAC04",
        label: "In his last years",
        avatar: "/ch_kim_yushin_old.png"
      }
    ]
  },
  {
    id: "sunduk",
    avatar: "/ch_dukman.png",
    name: "Queen Sunduk",
    korean: "\uC120\uB355\uC5EC\uC655",
    hanja: "\u5584\u5FB7\u5973\u738B",
    title: "27th sovereign of Silla",
    kingdom: "silla",
    gender: "f",
    born: 595,
    died: 647,
    bornApprox: true,
    clan: "clan-gyeongju-kim",
    boneRank: "Sacred Bone (\uC131\uACE8)",
    tagline: "\u201CA country that does not count people as people \u2014 how is that meant to last a thousand years?\u201D",
    ideology: "Soft-power progressive",
    ideologyNote: "Moral authority and clever mercy as statecraft; opens the age without asking Chang\u2019an for a mirror.",
    quote: "\u2026A country that does not count people as people. How is that meant to last a thousand years?",
    firstLine: {
      en: "\u2026A country that does not count people as people. How is that meant to last a thousand years?",
      ko: "\u2026\uC0AC\uB78C\uC744 \uC0AC\uB78C\uC73C\uB85C \uC138\uC9C0 \uC54A\uB294 \uB098\uB77C. \uADF8\uAC8C \uC5B4\uB5BB\uAC8C \uCC9C \uB144\uC744 \uAC00\uACA0\uB290\uB0D0?"
    },
    lastLine: {
      en: "Yes. \u2026And here we are. At the end.",
      ko: "\uADF8\uB798. \u2026\uC5EC\uAE30\uAE4C\uC9C0 \uC654\uAD6C\uB098. \uB05D\uC5D0."
    },
    nature: "Queen who reads people the way others read stars. Soft power as the harder blade; holds Yushin\u2019s devotion without making a spectacle of it. Their bond is romantic and physical in the refined register of the chronicle \u2014 never crude, never cold. The crown she wears is not only gold: it is the right to speak for the heavenly horse.",
    voice: "Warm, perceptive, quietly ironic. She asks the question that ends the argument and lets the silence do the rest: short sentences, moral clarity without a sermon. Korean: \uD558\uAC8C\uCCB4 to her ministers and to Yushin (\uC790\uB124), easy \uBC18\uB9D0 to the friends of her yard days.",
    arc: "Chosen because the Sacred Bone line had run out of men, Dukman rules for fifteen years under a permanent question mark: whether a woman can govern at all. She answers it by outlasting it \u2014 deliberating national affairs in the Eastern Palace, reading the sky from Cheomseongdae \u2014 and dies in the middle of a rebellion raised on exactly that slogan.",
    binyeo: "Gold crescent binyeo \u2014 amber sun in engraved moon, jade at the tail; sharp as kindness, never ostentatious.",
    binyeoImage: "/bn_sunduk.png",
    stages: [
      {
        id: "princess",
        until: 632,
        name: "Princess Dukman",
        korean: "\uB355\uB9CC\uACF5\uC8FC",
        hanja: "\u5FB7\u66FC\u516C\u4E3B",
        title: "Sacred Bone princess of Silla",
        label: "As Princess Dukman",
        avatar: "/ch_dukman.png"
      },
      {
        id: "queen",
        from: 632,
        until: 642,
        name: "Queen Sunduk",
        korean: "\uC120\uB355\uC5EC\uC655",
        title: "27th sovereign of Silla",
        label: "As queen",
        avatar: "/ch_sunduk.png"
      },
      {
        id: "elder",
        from: 642,
        name: "Queen Sunduk",
        korean: "\uC120\uB355\uC5EC\uC655",
        title: "27th sovereign of Silla",
        label: "In her last years",
        avatar: "/ch_sunduk_old.png"
      }
    ],
    events: [
      { year: 632, label: "Crowned the first Queen of Silla." },
      { year: 632, label: "Makes the Eastern Palace her hall for national affairs." },
      { year: 642, label: "Loses Daeya; sends Chunchu abroad for help." },
      { year: 647, label: "Dies as Bidam besieges the capital." }
    ],
    sobriquets: [
      "the Woman King",
      "\uC5EC\uC655",
      "the Blue Moon",
      "\uD478\uB978 \uB2EC",
      "\uCCAD\uC6D4"
    ],
    career: [
      { title: "Sacred Bone princess", korean: "\uACF5\uC8FC", org: "sillaroyal", from: 610, to: 632 },
      { title: "Queen", korean: "\uC120\uB355\uC5EC\uC655", hanja: "\u5584\u5FB7\u5973\u738B", org: "sillaroyal", from: 632 }
    ],
    aliases: [
      "Queen Sunduk",
      "Princess Dukman",
      "Sunduk",
      "Dukman",
      "the Woman King",
      "Woman King",
      "the Blue Moon",
      "Blue Moon",
      "\uD478\uB978 \uB2EC",
      "\uCCAD\uC6D4"
    ]
  },
  {
    id: "jinduk",
    avatar: "/ch_jinduk.png",
    name: "Queen Jinduk",
    korean: "\uC9C4\uB355\uC5EC\uC655",
    hanja: "\u771E\u5FB7\u5973\u738B",
    title: "28th sovereign of Silla",
    kingdom: "silla",
    gender: "f",
    born: 600,
    died: 654,
    bornApprox: true,
    clan: "clan-gyeongju-kim",
    boneRank: "Sacred Bone (\uC131\uACE8)",
    tagline: "\u201CWhen I die, do not pretend I ruled.\u201D",
    ideology: "Caretaker traditionalist",
    ideologyNote: "Holds Sacred Bone legitimacy as a bridge, not a program \u2014 lasts so True Bone can begin.",
    quote: "When I die, do not pretend I ruled.",
    firstLine: {
      en: "Bidam\u2026! What are you saying? Surely you don\u2019t\u2014",
      ko: "\uBE44\uB2F4\u2026! \uBB34\uC2A8 \uC18C\uB9AC\uC694? \uC124\uB9C8\u2014"
    },
    lastLine: {
      en: "\u2026I kept a seat from becoming a joke. That is all the Sacred Bone had left to do.",
      ko: "\u2026\uC790\uB9AC\uAC00 \uB18D\uB2F4\uC774 \uB418\uC9C0 \uC54A\uAC8C \uC9C0\uCF30\uC744 \uBFD0\uC774\uB2E4. \uC131\uACE8\uC5D0\uAC8C \uB0A8\uC740 \uC77C\uC740 \uADF8\uAC8C \uC804\uBD80\uC600\uB2E4."
    },
    nature: "Sunduk\u2019s cousin; Chunchu\u2019s aunt in the way the house counts kin. She wears the crown; he wears the hours. A kind woman who knows she is a bridge, not a destination \u2014 and who lets the bridge do its work without making a speech about it.",
    voice: "Gentle and brief. She worries aloud and says less than she knows. Korean: \uD558\uAC8C\uCCB4 and \uBC18\uB9D0 to Yushin and Chunchu.",
    arc: "Crowned after Bidam and Sunduk die in the same season. For seven years the Harmony Council still meets, and nothing of consequence leaves the room until Chunchu\u2019s Secretariat has already sealed it. When she dies the Sacred Bone ends; the country continues under the nephew who had already been running it.",
    binyeo: "Gold crescent binyeo \u2014 amber orb in scroll filigree, ruby at the tip; Sacred Bone quiet, no need to shout.",
    binyeoImage: "/bn_jinduk.png",
    stages: [
      {
        id: "princess",
        until: 647,
        name: "Princess Seungman",
        korean: "\uC2B9\uB9CC\uACF5\uC8FC",
        hanja: "\u52DD\u66FC\u516C\u4E3B",
        title: "Sacred Bone princess of Silla",
        label: "As Princess Seungman",
        avatar: "/ch_seungman.png"
      },
      {
        id: "queen",
        from: 647,
        name: "Queen Jinduk",
        korean: "\uC9C4\uB355\uC5EC\uC655",
        title: "28th sovereign of Silla",
        label: "As queen",
        avatar: "/ch_jinduk.png"
      }
    ],
    events: [
      { year: 647, label: "Crowned after Sunduk\u2019s death." },
      { year: 649, label: "Posthumously names On Gunhae a Daeachan after the Yellow Sea decoy." },
      { year: 651, label: "Watches the Royal Secretariat make the Council ornamental." },
      { year: 654, label: "Dies; the Sacred Bone line is extinct." }
    ],
    career: [
      { title: "Sacred Bone princess", korean: "\uACF5\uC8FC", org: "sillaroyal", from: 615, to: 647 },
      { title: "Queen", korean: "\uC9C4\uB355\uC5EC\uC655", hanja: "\u771E\u5FB7\u5973\u738B", org: "sillaroyal", from: 647 }
    ],
    aliases: ["Queen Jinduk", "Princess Seungman", "Kim Seungman", "Jinduk", "Seungman"]
  },
  {
    id: "munhee",
    avatar: "/ch_munhee.png",
    name: "Munhee",
    korean: "\uAE40\uBB38\uD76C",
    hanja: "\u91D1\u6587\u59EC",
    title: "Queen Munmyung",
    kingdom: "silla",
    gender: "f",
    born: 606,
    died: 681,
    bornApprox: true,
    clan: "clan-geumgwan-kim",
    clans: ["clan-gyeongju-kim"],
    clanBy: { "clan-gyeongju-kim": "marriage" },
    boneRank: "True Bone (\uC9C4\uACE8)",
    tagline: "\u201CSew the life you mean to keep.\u201D",
    ideology: "Household pragmatist",
    ideologyNote: "Politics as packing lists and marriages; soft power that keeps Chunchu\u2019s westernizing door fed.",
    quote: "Not yet. I\u2019ll pay the rest.",
    firstLine: {
      en: "Totally unfit for a Noble woman\u2026 Come on, boy, can\u2019t you find something better?",
      ko: "\uADC0\uC871 \uC5EC\uC790\uC5D0\uAC8C \uC804\uD600 \uC548 \uC5B4\uC6B8\uB824\u2026 \uC598, \uC880 \uB354 \uB098\uC740 \uAC70 \uBABB \uCC3E\uB2C8?"
    },
    lastLine: {
      en: "She spent her whole life watching other people love. Mine included.",
      ko: "\uC5B8\uB2C8\uB294 \uD3C9\uC0DD \uB0A8\uC774 \uC0AC\uB791\uD558\uB294 \uAC78 \uBCF4\uAE30\uB9CC \uD588\uC5B4. \uB0B4 \uAC83\uAE4C\uC9C0."
    },
    nature: "The household half of Chunchu\u2019s politics: she packs the bags for every country he tries to save them with. Their marriage is affectionate and hungry in equal measure \u2014 tasteful, never coy about wanting. Related to almost every Silla name that matters \u2014 sister of the marshal, wife of the diplomat-king, mother of Munmu, aunt-by-marriage to a generation of True Bone. The story opens on her hair and closes on her watching a son wear a broken northern crown.",
    voice: "Brisk, amused, practical. She teases in one line and gives an order in the next (\u201CDon\u2019t stare.\u201D), sees through her husband and says so, and is allowed one sharp line a scene. Korean: \uBC18\uB9D0 to her children and her brother, \uD569\uC1FC\uCCB4 to her husband in company.",
    binyeo: "Gold dragon binyeo \u2014 coral set in the crest, pink glow at the tip; Yushin\u2019s house in miniature.",
    binyeoImage: "/bn_munhee.png",
    events: [
      { year: 625, label: "Buys a dream; sews a coat; marries Chunchu." },
      { year: 632, label: "A young noblewoman with three small children \u2014 Bupmin among them." },
      { year: 642, label: "Holds the house when Gotaso dies." },
      { year: 654, label: "Becomes queen consort under Muyeol." },
      { year: 661, label: "Pays the rest at Chunchu\u2019s deathbed." },
      { year: 676, label: "Lives to see her son crowned King of Samhan." }
    ],
    sobriquets: [
      "the most powerful woman in Silla",
      "\uC2E0\uB77C \uCD5C\uAC15\uC758 \uC5EC\uC778"
    ],
    career: [
      { title: "Queen consort", korean: "\uC655\uD6C4", hanja: "\u738B\u540E", org: "sillaroyal", from: 654 }
    ],
    stages: [
      {
        id: "young",
        until: 654,
        label: "As Munhee",
        avatar: "/ch_munhee.png"
      },
      {
        id: "queen",
        from: 654,
        until: 670,
        name: "Queen Munmyung",
        korean: "\uBB38\uBA85\uC655\uD6C4",
        hanja: "\u6587\u660E\u738B\u540E",
        label: "As queen",
        avatar: "/ch_munmyung.png"
      },
      {
        id: "elder",
        from: 670,
        name: "Queen Munmyung",
        korean: "\uBB38\uBA85\uC655\uD6C4",
        label: "In her last years",
        avatar: "/ch_munmyung_old.png"
      }
    ],
    aliases: [
      "Queen Munmyung",
      "Munhee",
      "the most powerful woman in Silla",
      "\uC2E0\uB77C \uCD5C\uAC15\uC758 \uC5EC\uC778"
    ]
  },
  {
    id: "munmu",
    gender: "m",
    avatar: "/ch_bupmin.png",
    name: "King Munmu",
    korean: "\uBB38\uBB34\uC655",
    hanja: "\u6587\u6B66\u738B",
    title: "30th sovereign of Silla",
    kingdom: "silla",
    born: 626,
    died: 681,
    clan: "clan-gyeongju-kim",
    boneRank: "True Bone (\uC9C4\uACE8)",
    tagline: "\u201CI want to be the king for all.\u201D",
    ideology: "Civic nationalist",
    ideologyNote: "\u201CKing for all\u201D \u2014 inclusive realm-nationalism that allies with the West, then expels it.",
    quote: "I want to be the king for all. Not a king for Sacred Bone. Not a king for True Bone. For all.",
    firstLine: {
      en: "I want to be the king for all. Not a king for Sacred Bone. Not a king for True Bone. For all.",
      ko: "\uB098\uB294 \uBAA8\uB450\uB97C \uC704\uD55C \uC655\uC774 \uB418\uACE0 \uC2F6\uB2E4. \uC131\uACE8\uC758 \uC655\uB3C4, \uC9C4\uACE8\uC758 \uC655\uB3C4 \uC544\uB2CC. \uBAA8\uB450\uB97C \uC704\uD55C."
    },
    lastLine: {
      en: "Wait\u2026 why is one side of the Goryeo crown strange?",
      ko: "\uC7A0\uAE50\u2026 \uC65C \uACE0\uAD6C\uB824 \uAD00 \uD55C\uCABD\uC774 \uC774\uC0C1\uD558\uC9C0?"
    },
    nature: "Unsung true main character: he does not bend the age the way Chunchu, Yeon, or Euija do, but he is the one the chronicle lets you stand beside \u2014 watching a sister die, watching a father invent a country, learning the war from the wrong end of the map, and finishing the sentence he stole as a child. Falls for Jahee at the harbour in a K-drama of rain and wrong sums; keeps the lesson that purple is a colour and the ocean is a country. Desire: a kingdom that includes the quay. Wound: Gotaso\u2019s empty seat.",
    voice: "The traditional male lead, the younger one: earnest, plainspoken, brave before he is wise, stubbornly kind. As a boy he blurts out what he wants (\u201CWhen I\u2019m king everyone has to listen to me\u201D); as a young man he is clumsy with Jahee and straight with everyone else; as king he gives short, clear orders and keeps his promises out loud. He asks honest questions (\u201CFather. How do you know all of this?\u201D) and says what he means without dressing it up. He is the one person in the chronicle who means exactly what he says, so no clever epigrams and no fox talk. Korean: \uC874\uB313\uB9D0 to his father and his elders, \uD558\uC624\uCCB4 as king even to his uncle, gentle \uBC18\uB9D0 with Jahee once they are close.",
    personality: ["traditional male lead", "earnest", "plainspoken", "stubbornly kind", "harbour-hearted", "heir who finishes the sentence"],
    arc: "Chunchu\u2019s story keeps one heir in focus \u2014 Bupmin \u2014 while brother Inmun stays mostly offstage in Tang. As a boy he takes the words \u201Ca king for all\u201D into his own mouth. He watches Gotaso not come home. Under Marshal Yushin he joins the Hwarang \u2014 horse, bow, the Five Principles \u2014 then volunteers for a Gyebek-style countryside season as junior Pajinchan (Councillor of Ocean Trade) under Kim Seonpum, where he meets Jahee \u2014 later Queen Jayi. He grows up in Chunchu\u2019s shadow and Munhee\u2019s packing lists. He inherits a half-won war and an alliance that wants the peninsula as furniture. He commands, waits, and finally expels the Tang \u2014 the road his father cleared as far as Baekje, walked to the end of Samhan on his own feet, with Jahee as queen and partner, not ornament.",
    blade: "Ring-pommel sea-dragon sword \u2014 forged for a king who asked to become a dragon in the strait.",
    swordImage: "/sword_dragon.png",
    stages: [
      {
        id: "child",
        until: 636,
        name: "Bupmin",
        korean: "\uAE40\uBC95\uBBFC",
        hanja: "\u91D1\u6CD5\u654F",
        title: "Prince of Silla",
        label: "As a boy",
        avatar: "/ch_bupmin_child.png"
      },
      {
        id: "prince",
        from: 636,
        until: 643,
        name: "Bupmin",
        korean: "\uAE40\uBC95\uBBFC",
        hanja: "\u91D1\u6CD5\u654F",
        title: "Prince of Silla",
        label: "As Bupmin",
        avatar: "/ch_kim_bupmin.png"
      },
      {
        id: "hwarang",
        from: 643,
        until: 661,
        name: "Bupmin",
        korean: "\uAE40\uBC95\uBBFC",
        hanja: "\u91D1\u6CD5\u654F",
        title: "Prince of Silla",
        label: "As Hwarang",
        avatar: "/ch_bupmin_hwarang.png"
      },
      {
        id: "king",
        from: 661,
        name: "King Munmu",
        korean: "\uBB38\uBB34\uC655",
        title: "30th sovereign of Silla",
        label: "As King Munmu",
        avatar: "/ch_munmu.png"
      }
    ],
    events: [
      { year: 632, label: "At six, claims the dream of a king for all." },
      { year: 642, label: "Watches the house break when Gotaso dies." },
      { year: 643, label: "Trains as Hwarang under Marshal Yushin." },
      { year: 644, label: "Volunteers as junior Pajinchan; meets Jahee at the harbour." },
      { year: 647, label: "At twenty-one, first meets the steam-cavern goddesses \u2014 they name him the best of both; splashes Bidam; the water does nothing." },
      { year: 661, label: "Takes the throne, vowing to unify Samhan." },
      { year: 668, label: "Pyongyang falls; Goguryeo ends." },
      { year: 673, label: "After Yushin\u2019s death, enters the steam cavern; Dangun names the wanggeom\u2019s work." },
      { year: 676, label: "Expels the Tang; becomes King of Samhan." }
    ],
    sobriquets: ["King for All", "Dragon of the East Sea"],
    career: [
      { title: "Prince of Silla", korean: "\uC655\uC790", org: "sillaroyal", from: 632, to: 661 },
      { title: "Hwarang", korean: "\uD654\uB791", hanja: "\u82B1\u90CE", org: "hwarang", from: 643, to: 661 },
      { title: "Junior Pajinchan", korean: "\uD30C\uC9C4\uCC2C", hanja: "\u6CE2\u73CD\u98E1", org: "royalsecretariat", from: 644, to: 661, note: "Councillor of Ocean Trade" },
      { title: "King Munmu", korean: "\uBB38\uBB34\uC655", hanja: "\u6587\u6B66\u738B", org: "sillaroyal", from: 661, to: 676 },
      { title: "King of Samhan", korean: "\uC0BC\uD55C\uC758 \uC655", org: "sillaroyal", from: 676 }
    ],
    aliases: ["King Munmu", "Bupmin", "Munmu", "Dragon of the East Sea"],
    family: [
      { id: "jayi", role: "Spouse" },
      { id: "chunchu", role: "Father" },
      { id: "munhee", role: "Mother" },
      { id: "inmun", role: "Brother" }
    ]
  },
  {
    id: "jayi",
    avatar: "/ch_jayi.png",
    name: "Jahee",
    korean: "\uAE40\uC790\uD76C",
    hanja: "\u91D1\u6148\u5100",
    title: "Queen Jayi",
    kingdom: "silla",
    born: 627,
    bornApprox: true,
    gender: "f",
    clan: "clan-gyeongju-kim",
    boneRank: "True Bone (\uC9C4\uACE8)",
    tagline: "\u201CThe ocean does not care what bone you were born with \u2014 only whether you can count.\u201D",
    ideology: "Harbour pragmatist",
    ideologyNote: "True Bone who still believes ledgers outrank speeches; purple that has smelled salt.",
    quote: "The ocean does not care what bone you were born with \u2014 only whether you can count.",
    firstLine: {
      en: "Your sums are wrong. The tide does not care that you are a prince.",
      ko: "\uC148\uC774 \uD2C0\uB838\uC5B4\uC694. \uC870\uC218\uB294 \uC655\uC790\uC778 \uAC78 \uC0C1\uAD00\uD558\uC9C0 \uC54A\uC544\uC694."
    },
    lastLine: {
      en: "Keep the harbour book open. A kingdom that cannot count will lose the sea twice.",
      ko: "\uD56D\uAD6C \uC7A5\uBD80\uB97C \uC5F4\uC5B4 \uB450\uC138\uC694. \uC148\uD560 \uC904 \uBAA8\uB974\uB294 \uB098\uB77C\uB294 \uBC14\uB2E4\uB97C \uB450 \uBC88 \uC783\uC5B4\uC694."
    },
    nature: "Sharp, unimpressed, K-drama heroine energy without the helplessness: she steals brushes, vetoes bad arithmetic, and falls for Bupmin only after he stays for the tide book. Daughter of Pajinchan Kim Seonpum. Personal name Jahee; the court later calls her Queen Jayi. Of all the series\u2019 romances, theirs is the one that survives the war without becoming a tragedy or a joke \u2014 partnership as a second country.",
    voice: "Sharp, unimpressed, practical. She corrects sums and princes in the same breath and gives orders (\u201CCount again. While I am watching.\u201D). Korean: crisp \uD574\uC694\uCCB4, \uBC18\uB9D0 to Bupmin once they are close.",
    arc: "Meets Bupmin when Yushin posts him as temporary junior Councillor of Ocean Trade under her father. Rain, ledgers, almost-kisses, Seonpum\u2019s cough from the warehouse shadow. Years later she sits as Munmu\u2019s queen under the name Jayi \u2014 still correcting his margins, still treating the realm as a tide table they keep together. Probably the most successful romance the chronicle allows.",
    binyeo: "Gold wave binyeo \u2014 violet enamel in the curl, moonstone at the throat; a harbour pin that never learns court stillness.",
    binyeoImage: "/bn_jayi.png",
    events: [
      { year: 644, label: "Meets Bupmin over ocean ledgers at the quay." },
      { year: 661, label: "Becomes queen consort when Bupmin takes the throne." },
      { year: 676, label: "Stands with Munmu as King of Samhan \u2014 harbour lesson crowned." }
    ],
    career: [
      { title: "Queen consort", korean: "\uC655\uD6C4", hanja: "\u738B\u540E", org: "sillaroyal", from: 661 }
    ],
    aliases: ["Jahee", "\uC790\uD76C", "Queen Jayi", "Jayi", "\uC790\uC758", "Jaeui", "Queen Jaeui", "\uC790\uC774"]
  },
  {
    id: "seonpum",
    avatar: "/ch_kim_sunpum.png",
    name: "Kim Seonpum",
    korean: "\uAE40\uC120\uD488",
    hanja: "\u91D1\u5584\u54C1",
    title: "Pajinchan \u2014 Councillor of Ocean Trade (\uD30C\uC9C4\uCC2C)",
    kingdom: "silla",
    born: 590,
    bornApprox: true,
    gender: "m",
    clan: "clan-gyeongju-kim",
    boneRank: "True Bone (\uC9C4\uACE8)",
    tagline: "Fourth of seventeen \u2014 purple sleeve, harbour dirt, Jahee\u2019s father.",
    ideology: "Maritime True Bone",
    ideologyNote: "Holds Pajinchan as craft: ocean trade under a caste that pretends commerce is beneath purple.",
    quote: "Do not swagger. The sailors can smell swagger over salt.",
    nature: "True Bone who actually works the quay. Hosts Bupmin\u2019s voluntary countryside season without mistaking it for picnic. Loves his daughter enough to chaperone weather.",
    arc: "Sitting Councillor of Ocean Trade (\uD30C\uC9C4\uCC2C, \u6CE2\u73CD\u98E1) when Marshal Yushin attaches Prince Bupmin as junior under him. Watches a prince learn tide tables and a daughter learn a wrong number worth reading.",
    blade: "Ring-pommel harbour knife \u2014 more ledger-weight than parade.",
    events: [
      { year: 644, label: "Hosts Bupmin as junior Pajinchan; Jahee keeps the inkstones." }
    ],
    career: [
      { title: "Councillor of Ocean Trade", korean: "\uD30C\uC9C4\uCC2C", hanja: "\u6CE2\u73CD\u98E1", org: "royalsecretariat", from: 644 }
    ],
    aliases: [
      "Kim Seonpum",
      "Seonpum",
      "\uC120\uD488",
      "Councillor of Ocean Trade"
    ]
  },
  {
    id: "jukji",
    gender: "m",
    name: "Kim Jukji",
    korean: "\uAE40\uC8FD\uC9C0",
    hanja: "\u91D1\u7AF9\u65E8",
    title: "First Premier (\uC911\uC2DC) of the Royal Secretariat",
    kingdom: "silla",
    boneRank: "True Bone (\uC9C4\uACE8)",
    born: 620,
    bornApprox: true,
    clan: "clan-gyeongju-kim",
    avatar: "/ch_jukji.png",
    tagline: "True Bone Hwarang of Class 74 \u2014 Pumsuk\u2019s cohort; later the first \uC911\uC2DC.",
    ideology: "Technocratic reformer",
    ideologyNote: "Secretariat craft \u2014 implements westernizing speed as office work, not sermon.",
    quote: "The Council still meets. The seals no longer wait for it.",
    nature: "Young enough to think a new office is elegant; old enough in the yard to know elegance is a weapon. Loyal to Chunchu the way a Hwarang is loyal to a form \u2014 precisely, without needing to be asked twice. Yes-Minister fluency: preserves the High Councillor\u2019s chair while emptying it of consequences.",
    blade: "Ring-pommel bamboo sword \u2014 light, fast, named for the virtue of bending without breaking.",
    events: [
      { year: 651, label: "Named first Premier (\uC911\uC2DC) of the Royal Secretariat (\uC9D1\uC0AC\uBD80)." },
      { year: 654, label: "Keeps the seals moving under King Muyeol." }
    ],
    career: [
      { title: "Hwarang", korean: "\uD654\uB791", hanja: "\u82B1\u90CE", org: "hwarang", from: 635, to: 651 },
      { title: "Premier", korean: "\uC911\uC2DC", hanja: "\u4E2D\u4F8D", org: "royalsecretariat", from: 651 }
    ],
    aliases: [
      "Kim Jukji",
      "Jukji",
      "Jukjirang",
      "\uC8FD\uC9C0",
      "\uC8FD\uC9C0\uB791",
      "\u7AF9\u65E8",
      "\u7AF9\u65E8\u90DE",
      "Premier Jukji",
      "Premier",
      "\uC911\uC2DC",
      "\u4F8D\u4E2D"
    ]
  },
  {
    id: "haesang",
    gender: "m",
    name: "Haesang",
    korean: "\uD574\uC0C1",
    title: "Silla merchant of the southern roads",
    kingdom: "silla",
    tagline: "Brings the horizon home \u2014 spices, scriptures, and stories told without swagger.",
    ideology: "Cosmopolitan merchant",
    ideologyNote: "Soft globalism of harbours; learns from every shore without renaming home the West.",
    quote: "I sell what the road allows. I tell what the road taught me.",
    nature: "A recurring face in Surabol markets and harbour inns: respectful of every shore he names \u2014 Funan\u2019s harbours, the Ganges ports, Sogdian caravans, Persian glass. Never a lecture; always a tale with the salt still on it. Ordinary people like him. Nobles pretend they do not listen, and listen.",
    voice: "The merchant: genial and worldly, full of shores and wares, his advice dressed as a traveller\u2019s tale. Korean: polite \uD569\uC1FC\uCCB4.",
    events: [
      { label: "Trades through Danghang toward the southern seas." },
      { label: "Carries news of India, the steppe roads, and the western markets \u2014 carefully, as guest." }
    ],
    aliases: ["Haesang", "the merchant", "Merchant Haesang", "\uD574\uC0C1"]
  },
  {
    id: "bidam",
    gender: "m",
    avatar: "/ch_bidam.png",
    name: "Bidam",
    korean: "\uBE44\uB2F4",
    hanja: "\u6BD7\u66C7",
    title: "High Councillor (\uC0C1\uB300\uB4F1) of Silla",
    kingdom: "silla",
    boneRank: "True Bone (\uC9C4\uACE8)",
    born: 594,
    died: 647,
    bornApprox: true,
    clan: "clan-surabol-son",
    tagline: "\u201CIf only three of the Sacred Bone remain, then I choose the cleverest of the three.\u201D",
    ideology: "Radical nativist",
    ideologyNote: "Buddhist-nativist foil to Confucian Yushin \u2014 108 beads, sutras, lotus, incense through the Radiance siege; the soil\u2019s dharma, even while he names India\u2019s sutras a colonization of the mind. Blood-and-soil for \uC0BC\uD55C \u2014 both Kim lines are imports; the Founding Six had no Kim; opposes Tang-shaped Secretariat through courtesy, not rant. Once the liberal who crowned Sunduk and shielded Gaya-blood Yushin; curdles in public. Genius and charisma never leave him. Debates over tea like a salon; meditates while the armies wait; dies still charming.",
    quote: "If only three of the Sacred Bone remain, then I choose the cleverest of the three.",
    firstLine: {
      en: "My lords keep repeating the one word \u2014 \u201Cwoman.\u201D I have known Princess Dukman since I was a boy.",
      ko: "\uC5EC\uB7EC\uBD84\uAED8\uC11C\uB294 \u201C\uC5EC\uC790\u201D\uB77C\uB294 \uD55C \uB2E8\uC5B4\uB9CC \uB418\uB1CC\uC2ED\uB2C8\uB2E4. \uB098\uB294 \uC18C\uB144 \uC2DC\uC808\uBD80\uD130 \uB355\uB9CC\uACF5\uC8FC\uB97C \uC555\uB2C8\uB2E4."
    },
    lastLine: {
      en: "Hwarang Kim Yushin\u2026",
      ko: "\uD654\uB791 \uAE40\uC720\uC2E0\u2026"
    },
    nature: "Born to one of Surabol\u2019s oldest houses \u2014 the chronicle never states, only implies, descent from Gurema of the Surabol Son clan and the Musan hall the Founding Six raised. Aristocratic gentleman: proper titles, tea poured before the barb lands, almost flirtatious composure under the black robe. Oldest of the three Hwarang classmates \u2014 then Yushin, then Alchun, a year apart; all three once orbited Princess Dukman. Yard score never leaves 108\u2013108 with Yushin \u2014 effort against birthright, and he feels owed. Once the most liberal True Bone \u2014 crowned the woman king, shielded Gaya-blood Yushin from nativist bullying \u2014 he spirals in public view: grievance dressed as patriotism, \u201Cthey\u2019re colonizing us,\u201D charming one moment and ugly the next. Self-aware enough to hear the irony; genius and charisma never leave him \u2014 that is what makes it dangerous. Loves the sacred country badly. Weaponizes heritage against Yushin at Radiance: \u201CBlood is inevitable.\u201D Dies smiling at the name he first traded as a boy.",
    voice: "Educated and sophisticated; he argues in parables and quotes sutras and poems. Bidam\u2019s images come from the temple and the soil (lotus and mud, the wheel, the raft, the hundred and eight beads, fire, rivers, rice, the turning year), and he can turn a hymn into an insult. Cool, courteous, sardonic: a title for everyone (Your Majesty, Marshal, Councillor) and a gentleman\u2019s smile on the cruellest line. With Yushin and Alchun the old yard banter comes back. When he is roused he preaches in rising repetitions (\u201CBecause our kings rule our people. Because our armies are our sons.\u201D), and that heat is rare; most of the time he stays cool. No modern slang. Korean: measured \uD558\uC624\uCCB4 with equals, formal council speech in the Harmony Council, cold \uBC18\uB9D0 to enemies and old friends, with Buddhist and hanja vocabulary.",
    personality: ["educated", "sophisticated", "speaks in metaphor and verse", "Buddhist", "aristocratic charm", "radical nativist arc"],
    arc: "In 632 he crowns Dukman with a speech about cleverness. In 636 he and Alchun break King Mu\u2019s spies at Jade Gate Valley (\uC625\uBB38\uACE1). In 645 he alone blocks Seungman while Supum holds the first chair, and before the month is out the queen gives that chair to him. In 647 he spends ten days at Radiance with Yumjong \u2014 night tabletop debates with Yushin in a small \uC815\uC790 under a half moon, before the armies fight, youth flashbacks, star omen \u2014 the liberal curdling into blood-and-soil between cups of tea. On the fifth night he tells Yushin \uD53C\uB294 \uBABB \uC18D\uC778\uB2E4 \u2014 blood is inevitable \u2014 weaponizing Gaya/Heo heritage; on the tenth day Yushin finishes the count at one hundred and nine. Last mortal words: \u201CHwarang Kim Yushin\u2026\u201D Yushin will whisper the same line back when he orders the annihilation of Bidam\u2019s house.",
    blade: "Ring-pommel heavenly-horse sword \u2014 white horse rearing on the pommel, old-hall steel.",
    swordImage: "/sword_horse.png",
    stages: [
      {
        id: "hwarang",
        until: 632,
        label: "As Hwarang",
        avatar: "/ch_bidam_hwarang.png"
      },
      {
        id: "young",
        from: 632,
        until: 645,
        title: "Councillor (\uB300\uB4F1) of Silla",
        titleKo: "\uB300\uB4F1",
        label: "As councillor",
        avatar: "/ch_bidam.png"
      },
      {
        id: "elder",
        from: 645,
        title: "High Councillor (\uC0C1\uB300\uB4F1) of Silla",
        titleKo: "\uC0C1\uB300\uB4F1",
        label: "In his last years",
        avatar: "/ch_bidam_old.png"
      }
    ],
    events: [
      { year: 632, label: "Turns 3:3 into 6:0 \u2014 Silla\u2019s first woman king." },
      { year: 636, label: "With Alchun, breaks Baekje spies at Jade Gate Valley (\uC625\uBB38\uACE1)." },
      { year: 645, label: "Alone blocks Seungman as successor; before the month is out the queen makes him High Councillor." },
      { year: 647, label: "Ten-day rebellion at Radiance; tells Yushin \uD53C\uB294 \uBABB \uC18D\uC778\uB2E4; dies \u2014 \u201CHwarang Kim Yushin\u2026\u201D" }
    ],
    sobriquets: [
      "Second Blade of Samhan",
      "Second Blade",
      "\uC0BC\uD55C\uC81C\uC774\uAC80",
      "Spear of Silla",
      "Long Blade of Silla",
      "\uC2E0\uB77C\uC758 \uC7A5\uAC80",
      "Black-Robed Gentleman",
      "\uD751\uC758\uAD70\uC790",
      "Legend of the Hwarang"
    ],
    career: [
      { title: "Hwarang disciple", korean: "\uB0AD\uB3C4", hanja: "\u90CE\u5F92", org: "hwarang", from: 610, to: 613 },
      { title: "Hwarang", korean: "\uD654\uB791", hanja: "\u82B1\u90CE", org: "hwarang", from: 613, to: 645 },
      { title: "Councillor", korean: "\uB300\uB4F1", hanja: "\u5927\u7B49", org: "harmonycouncil", from: 632, to: 645 },
      { title: "High Councillor", korean: "\uC0C1\uB300\uB4F1", hanja: "\u4E0A\u5927\u7B49", org: "harmonycouncil", from: 645, to: 647 }
    ],
    aliases: [
      "Councillor Bidam",
      "Bidam",
      "Second Blade of Samhan",
      "The Second Blade of Samhan",
      "Second Blade",
      "\uC0BC\uD55C\uC81C\uC774\uAC80",
      "Spear of Silla",
      "Long Blade of Silla",
      "\uC2E0\uB77C\uC758 \uC7A5\uAC80",
      "Black-Robed Gentleman",
      "\uD751\uC758\uAD70\uC790",
      "Legend of the Hwarang"
    ],
    family: [{ id: "sukwon", role: "Father" }]
  },
  {
    id: "sukwon",
    gender: "m",
    avatar: "/ch_bidam_old.png",
    name: "Son Sukwon",
    korean: "\uC190\uC219\uC6D0",
    hanja: "\u5B6B\u6DD1\u9060",
    title: "Musan hall \u2014 Bidam\u2019s father",
    kingdom: "silla",
    born: 560,
    died: 628,
    bornApprox: true,
    clan: "clan-surabol-son",
    boneRank: "True Bone (\uC9C4\uACE8)",
    tagline: "\u201CRather a righteous traitor than an unrighteous king.\u201D",
    ideology: "Silla-true Buddhist",
    ideologyNote: "Abhidharma in the name he gave his son; 108 beads in the sleeve; Surabol Son blood that does not ask Gaya to apologise for existing, and will not let a yard mock a mouth.",
    quote: "Son\u2026 I need you to be a man who would rather be a righteous traitor than an unrighteous king.",
    firstLine: {
      en: "Bidam\u2026 do you know the meaning of your name.",
      ko: "\uBE44\uB2F4\uC544\u2026 \uB124 \uC774\uB984 \uB73B\uC744 \uC544\uB290\uB0D0."
    },
    lastLine: {
      en: "Go make us proud, son\u2026!",
      ko: "\uAC00\uC11C, \uC6B0\uB9AC\uB97C \uC790\uB791\uC2A4\uB7FD\uAC8C \uD574\uB2E4\uC624, \uC544\uB4E4\uC544\u2026!"
    },
    nature: "Old-hall Surabol. Speaks to his boy like a man sending someone into weather: keep your head, walk alone if you must. Loves Bidam without covering it. Silla-true in the bone; the Gaya-born classmates his son will meet are not his enemy, but he will not pretend the yard is kind.",
    voice: "A grave, kind father who teaches by asking (\u201CDo you know the meaning of your name.\u201D). Korean: \uBC18\uB9D0 to his son.",
    arc: "Hands Bidam to Class 51 on a first Hwarang morning with the Abhidharma and \uC131\uC989\uAD70\uC655 \uD328\uC989\uC5ED\uC801. Dies before Radiance; the teaching does not.",
    events: [{ year: 610, label: "Sends Bidam to the Hwarang \u2014 Class 51." }],
    aliases: ["Sukwon", "Son Sukwon", "\uC190\uC219\uC6D0", "Bidam\u2019s father"]
  },
  {
    id: "gotaso",
    avatar: "/ch_gotaso.png",
    name: "Gotaso",
    korean: "\uAE40\uACE0\uD0C0\uC18C",
    hanja: "\u91D1\u53E4\u9640\u70A4",
    kingdom: "silla",
    gender: "f",
    born: 625,
    died: 642,
    bornApprox: true,
    clan: "clan-gyeongju-kim",
    boneRank: "True Bone (\uC9C4\uACE8)",
    tagline: "A love-obsessed girl of sixteen. Her father would burn kingdoms to bring her home.",
    ideology: "Frontier romantic",
    ideologyNote: "Love and border fort as the same risk; no doctrine survives Daeya.",
    quote: "Forever is a promise you keep in one season.",
    voice: "Bold, impatient, fifteen. Short demands (\u201CFaster. Father. Faster.\u201D), the same question until it is answered, and she flirts by asking straight out. Korean: \uD574\uC694\uCCB4 to her elders and to Pumsuk, never coy.",
    arc: "She falls the way teenagers fall \u2014 completely, loudly, without a second thought. When she is taken, Chunchu goes quiet. When she marries, she believes in forever. Daeya ends both.",
    binyeo: "Gilt butterfly binyeo \u2014 pink bead in the wings, amber at the bud-tip; a girl\u2019s first grown-up pin, packed for a border fort.",
    binyeoImage: "/bn_gotaso.png",
    events: [
      { year: 641, label: "Taken; rescued; marries Pumsuk; moves to Daeya." },
      { year: 642, label: "Dies when Daeya falls." }
    ],
    aliases: ["Princess Gotaso", "Gotaso"]
  },
  {
    id: "pumsuk",
    gender: "m",
    avatar: "/ch_pumsuk.png",
    name: "Kim Pumsuk",
    korean: "\uAE40\uD488\uC11D",
    hanja: "\u91D1\u54C1\u91CB",
    title: "Guardian of Daeya Fortress",
    kingdom: "silla",
    boneRank: "True Bone (\uC9C4\uACE8)",
    born: 618,
    died: 642,
    bornApprox: true,
    clan: "clan-gyeongju-kim",
    tagline: "A Surabol noble boy \u2014 still startled by a woman who isn\u2019t.",
    ideology: "Aristocratic Hwarang",
    ideologyNote: "True Bone honour culture \u2014 the yard before any doctrine.",
    quote: "A fortress falls from the inside first.",
    voice: "Shy, earnest, overwhelmed: broken sentences, apologies, and his body saying what he can\u2019t (\u201CMy hand won\u2019t move.\u201D). Korean: formal \uD569\uC1FC\uCCB4 and \uD558\uC624\uCCB4, even when he comes undone.",
    arc: "Capital-bred, True Bone, given a fortress for his rank. Gotaso loves him with her whole chest. At Daeya he meets Maehwa and discovers how little of the world Surabol prepared him for.",
    blade: "Ring-pommel parade sword \u2014 fox on the gilt pommel, never blooded until the wrong night.",
    swordImage: "/sword_fox.png",
    events: [
      { year: 641, label: "Marries Gotaso, swearing to protect her with his life." },
      { year: 642, label: "Loses Daeya after betrayal; kills his wife and himself." }
    ],
    career: [
      { title: "Hwarang", korean: "\uD654\uB791", hanja: "\u82B1\u90CE", org: "hwarang", from: 633, to: 641 },
      { title: "Guardian of Daeya", korean: "\uB300\uC57C\uC131\uC8FC", from: 641 }
    ],
    aliases: ["Hwarang Pumsuk", "Kim Pumsuk", "Pumsuk"]
  },
  {
    id: "gumil",
    name: "Gumil",
    korean: "\uAC80\uC77C",
    hanja: "\u9ED4\u65E5",
    avatar: "/ch_gumil.png",
    kingdom: "silla",
    died: 660,
    gender: "m",
    boneRank: "4-dupum (yellow sleeve)",
    tagline: "Yellow-sleeve border officer \u2014 caste fury that opened Daeya\u2019s gates.",
    quote: "Say \u201CTrue Bone\u201D and the heavens part. Say yellow robe and they send you west to die.",
    voice: "A grumbling border officer: loud complaints about his pay and his country, whining exclamations (\u201C\uC544\uB2C8~~\u201D). In grief he goes short and broken (\u201CFrom the start. All of it.\u201D). Korean: rough \uBC18\uB9D0.",
    arc: "Posted to Samhan\u2019s most dangerous border because bone rank sends yellow there. Humiliated by purple Pumsuk over his own wife, he betrays Daeya to Baekje \u2014 private injury plus caste hate. Muyeol executes him at Sabi eighteen years later.",
    events: [
      { year: 642, label: "Betrays Daeya Fortress with Mochuk." },
      { year: 660, label: "Executed by King Muyeol." }
    ],
    family: [{ id: "gumilwife", role: "Wife" }],
    career: [
      { title: "Border officer", korean: "\uBCC0\uBC29\uC7A5\uAD50", from: 642, to: 660, note: "4-dupum yellow sleeve" }
    ],
    aliases: ["Gumil", "Geomil", "\uAC80\uC77C"]
  },
  {
    id: "mochuk",
    name: "Mochuk",
    korean: "\uBAA8\uCC99",
    kingdom: "silla",
    died: 660,
    gender: "m",
    boneRank: "4-dupum (yellow sleeve)",
    tagline: "Gumil\u2019s fellow yellow-sleeve at Daeya \u2014 treason as the only promotion left.",
    quote: "Treason is only treason if you lose.",
    aliases: ["Mochuk"]
  },
  {
    id: "daeto",
    name: "Daeto",
    korean: "\uB300\uD1A0",
    hanja: "\u5927\u5410",
    kingdom: "silla",
    died: 673,
    gender: "m",
    tagline: "The official with a steady hand who wrote one letter too many.",
    quote: "A wise letter leaves a door open.",
    voice: "A reasonable-sounding court official: always the moderate in the room, always urging the softer word, the second copy, the open door. Smooth and helpful, never angry. Korean: polished \uD558\uC2ED\uC2DC\uC624\uCCB4 to the king, easy \uD558\uAC8C\uCCB4 to clerks.",
    arc: "He watches the Tang calendar arrive at Bear Ford and decides early which way the wind blows. In the writing room of 671 he begs Munmu for a softer letter to Xue Rengui, copies the hard one out fair, and that same night writes a short letter of his own to the Tang. In 673 it is found: he had promised them a door. He is executed and his household enslaved, in the month Kim Yushin is buried.",
    events: [
      { year: 664, label: "Studies the Tang calendar posted at Bear Ford." },
      { year: 671, label: "Copies out Munmu\u2019s reply to Xue Rengui, and writes one of his own." },
      { year: 673, label: "Executed for plotting to defect to the Tang." }
    ],
    aliases: ["Daeto"]
  },
  {
    id: "kimpunghun",
    name: "Kim Punghun",
    korean: "\uAE40\uD48D\uD6C8",
    hanja: "\u91D1\u98A8\u8A13",
    kingdom: "silla",
    gender: "m",
    tagline: "The executed noble\u2019s son who piloted the Tang fleet onto his own coast.",
    quote: "I know these waters. My father taught me.",
    arc: "His father Kim Jinju is put to death with his household for pleading sickness in wartime. Punghun, away in Chang\u2019an, survives as the only one left. In 675 he comes home at the bow of Xue Rengui\u2019s fleet, showing the Tang the way into the coast his father once defended.",
    events: [
      { year: 670, label: "His father Kim Jinju is executed by Munmu." },
      { year: 675, label: "Pilots Xue Rengui\u2019s fleet to Cheonseong." }
    ],
    aliases: ["Kim Punghun", "Punghun"]
  },
  {
    id: "daeya_a",
    name: "Daeya Garrison Man",
    korean: "\uB300\uC57C \uBCD1\uC0AC",
    kingdom: "silla",
    gender: "m",
    boneRank: "4-dupum (yellow sleeve)",
    tagline: "Yellow robe, trash posting \u2014 the wall under True Bone toys.",
    quote: "Bone rank is a joke told with our ribs.",
    arc: "Lowest head ranks posted to Daeya because purple does not post itself to die. Speaks the caste system the capital prefers to leave in dye manuals.",
    aliases: ["Daeya Garrison Man", "Daeya soldier"]
  },
  {
    id: "daeya_b",
    name: "Daeya Wall Guard",
    korean: "\uB300\uC57C \uC218\uBE44",
    kingdom: "silla",
    gender: "m",
    boneRank: "4-dupum (yellow sleeve)",
    tagline: "Counts graves the Harmony Council never minutes.",
    quote: "Out here bone rank decides which arrow finds you first.",
    aliases: ["Daeya Wall Guard"]
  },
  {
    id: "inmun",
    name: "Kim Inmun",
    korean: "\uAE40\uC778\uBB38",
    hanja: "\u91D1\u4EC1\u554F",
    kingdom: "silla",
    born: 629,
    died: 694,
    gender: "m",
    clan: "clan-gyeongju-kim",
    boneRank: "True Bone (\uC9C4\uACE8)",
    tagline: "Chunchu\u2019s other son \u2014 present in Tang, mostly absent from the page on purpose.",
    ideology: "Hostage-diplomat",
    ideologyNote: "Living hinge to the West; westernization as bilingual daily life in Chang\u2019an.",
    quote: "Become necessary, or become forgotten.",
    nature: "Second-son diplomacy with a first-son\u2019s polish: learns rooms by listening, not by claiming them. Desire: to remain useful enough that Chang\u2019an cannot misplace him. Wound: the chronicle that follows Bupmin home and leaves him in the West.",
    voice: "Careful, bilingual, rarely the first to speak.",
    arc: "Where Chunchu\u2019s story keeps one heir in focus \u2014 Bupmin \u2014 Inmun is the deliberate offstage: hostage, envoy, and long-serving hinge in Tang. He stays in Chang\u2019an on and off for life; the page visits him only when the West must answer. Absent-by-design, not forgotten \u2014 the second son who makes the alliance breathe while his brother learns to rule.",
    events: [
      { year: 632, label: "A toddler in Munhee\u2019s rooms while Surabol crowns a queen." },
      { year: 648, label: "Left in Chang\u2019an as the living hinge of the Silla\u2013Tang alliance." },
      { year: 661, label: "Still west when Bupmin takes the throne." }
    ],
    family: [
      { id: "chunchu", role: "Father" },
      { id: "munhee", role: "Mother" },
      { id: "munmu", role: "Brother" }
    ],
    career: [
      { title: "Hostage-envoy", korean: "\uC778\uC9C8\uC0AC\uC2E0", from: 648, note: "Chang\u2019an hinge of the alliance" }
    ],
    aliases: ["Kim Inmun", "Inmun", "\uAE40\uC778\uBB38"]
  },
  {
    id: "alchun",
    gender: "m",
    avatar: "/ch_alchun.png",
    name: "Alchun",
    korean: "\uC54C\uCC9C",
    hanja: "\u95BC\u5DDD",
    title: "Councillor (\uB300\uB4F1) of Silla",
    kingdom: "silla",
    boneRank: "True Bone (\uC9C4\uACE8)",
    born: 596,
    bornApprox: true,
    clan: "clan-surabol-choi",
    tagline: "\u201CWhy is it always the most ignorant in a country who shout loudest that it is the greatest\u2026\u201D",
    ideology: "Liberal reformer",
    ideologyNote: "Open to women on thrones and stolen Tuesdays; modernization without Bidam\u2019s purity test.",
    quote: "Judge what is best for the divine nation.",
    firstLine: {
      en: "I have taken a tiger.",
      ko: "\uB098\uB294 \uD638\uB791\uC774\uB97C \uC7A1\uC544 \uBCF8 \uC0AC\uB78C\uC774\uC624."
    },
    lastLine: {
      en: "The age of Kim Chunchu begins.",
      ko: "\uAE40\uCD98\uCD94\uC758 \uC2DC\uB300\uAC00 \uC2DC\uC791\uB41C\uB2E4."
    },
    nature: "Descended from Sobuldori of the Surabol Choi \u2014 Dolsan Goheo-chon, Saryang-bu \u2014 though he cites the founder only when pressed, and never in a speech. Stuck between Bidam and Yushin since the Hwarang yard \u2014 same line, same impossible orbit around Dukman. At Okmun-gok he and Bidam still fight as one; by Radiance he answers both with hard counsel and still raises neither blade nor banner \u2014 and neutrality costs him a generation of standing.",
    voice: "The yard brother: blunt, folksy and a little rough (\u201COi.\u201D, \uC784\uB9C8), with plain practical counsel and teasing drawls among friends. Korean: Gyeongsang-flavoured \uBC18\uB9D0 to his classmates, plain \uD558\uC624\uCCB4 in council.",
    arc: "Hwarang with Bidam and Yushin; tiger-catcher of the Council; victor with Bidam at Jade Gate Valley (\uC625\uBB38\uACE1, 636) against King Mu\u2019s spies. In 647 he is summoned to both camps before noon: he tells Yushin not to be blinded by the princess they all loved as boys, tells Bidam that arms against the crown are highest treason \u2014 then raises neither blade nor banner for ten days. After Bidam falls, the minutes file him under Neither. Later he laughs the last holdout down so Chunchu can take the throne rather than wear a crown built on that silence.",
    events: [
      { year: 632, label: "Last sleeve in the 6:0 that names Queen Sunduk \u2014 not High Councillor; Eulj\xE9 chairs." },
      { year: 636, label: "With Bidam, destroys Baekje spies at Jade Gate Valley (\uC625\uBB38\uACE1)." },
      {
        year: 647,
        label: "Counsels both camps at Radiance; loses standing for neutrality."
      },
      { year: 654, label: "Laughs down the last holdout; the age of Kim Chunchu begins." }
    ],
    sobriquets: [
      "the tiger-catcher",
      "\uD638\uB791\uC774\uB3C4 \uC7A1\uB294 \uC54C\uCC9C",
      "\uD638\uB791\uC774\uB3C4 \uC7A1\uB294"
    ],
    career: [
      { title: "Hwarang disciple", korean: "\uB0AD\uB3C4", hanja: "\u90CE\u5F92", org: "hwarang", from: 610, to: 613 },
      { title: "Hwarang", korean: "\uD654\uB791", hanja: "\u82B1\u90CE", org: "hwarang", from: 613, to: 632 },
      { title: "Councillor", korean: "\uB300\uB4F1", hanja: "\u5927\u7B49", org: "harmonycouncil", from: 632, to: 654 }
    ],
    aliases: [
      "Alchun",
      "the tiger-catcher",
      "tiger-catcher",
      "\uD638\uB791\uC774\uB3C4 \uC7A1\uB294 \uC54C\uCC9C",
      "\uD638\uB791\uC774\uB3C4 \uC7A1\uB294"
    ]
  },
  // ————————————————————————— supporting cast (researched) —————————————————————————
  {
    id: "ongunhae",
    gender: "m",
    avatar: "/ch_on_gunhae.png",
    name: "On Gunhae",
    korean: "\uC628\uAD70\uD574",
    hanja: "\u6EAB\u541B\u89E3",
    title: "Attendant of Kim Chunchu \u2014 posthumous Daeachan",
    kingdom: "silla",
    died: 649,
    boneRank: "True Bone (\uC9C4\uACE8)",
    tagline: "He sat in the high cap so the small boat could leave.",
    quote: "Then I will wear it.",
    firstLine: {
      en: "My lord. The small boat.",
      ko: "\uACF5\uAED8\uC11C\uB294 \uC791\uC740 \uBC30\uB85C."
    },
    lastLine: {
      en: "Then I will wear it.",
      ko: "\uADF8\uB798\uC11C \uC81C\uAC00 \uC501\uB2C8\uB2E4."
    },
    nature: "A retainer who does not require a second instruction. Speaks in objects \u2014 cap, coat, the smaller boat \u2014 and stops there. The annal keeps almost nothing else.",
    arc: "He follows Kim Chunchu into Tang and, on the Yellow Sea road home, puts on the high cap and great coat so Goguryeo\u2019s patrol will take the wrong man. They kill him. Chunchu reaches Silla in a small boat. Queen Jinduk posthumously names him Daeachan and pays his descendants. The histories guess True Bone from that rank; they record no other deed.",
    events: [
      { year: 648, label: "Attends Chunchu\u2019s Tang embassy." },
      { year: 649, label: "Dies as Chunchu\u2019s decoy on a Goguryeo patrol ship; named Daeachan posthumously." }
    ],
    career: [
      { title: "Attendant", korean: "\uC218\uD589", hanja: "\u96A8\u884C", note: "Tang embassy", from: 648, to: 649 },
      { title: "Daeachan (posthumous)", korean: "\uB300\uC544\uCC2C", hanja: "\u5927\u963F\u98E1", from: 649 }
    ],
    aliases: [
      "On Gunhae",
      "Gunhae",
      "\uC628\uAD70\uD574",
      "\u6EAB\u541B\u89E3",
      "Ongunhae"
    ]
  },
  {
    id: "ladyye",
    avatar: "/ch_lady_ye.png",
    name: "Lady Ye",
    korean: "\uC608\uC528\uBD80\uC778",
    kingdom: "buyeo",
    gender: "f",
    tagline: "Jumong\u2019s first wife, who raised his heir alone in Buyeo.",
    quote: "A broken sword can still raise a king.",
    binyeo: "Plain horn binyeo \u2014 Buyeo winter-cut; she raised a king on half a sword and less gold.",
    nature: "Quiet on purpose. Stays when staying is the harder job. Talks in objects: a half-sword, a lamp, a door left open.",
    voice: "Quiet, plain and practical; she talks in objects (a lamp, a door left open, a half-sword) and stops there. Korean: \uBC18\uB9D0 to her son.",
    family: [
      { id: "jumong", role: "Husband" },
      { id: "yuri", role: "Son" }
    ],
    aliases: ["Lady Ye"]
  },
  {
    id: "yuri",
    gender: "m",
    avatar: "/ch_yuri.png",
    name: "King Yuri",
    korean: "\uC720\uB9AC\uC655",
    hanja: "\u7409\u7483\u738B",
    godTier: "demigod",
    kingdom: "goguryeo",
    clan: "clan-go",
    died: 18,
    tagline: "Demigod-touched heir \u2014 found the broken sword, took his father\u2019s throne.",
    quote: "What a father hides, a son digs up.",
    nature: "Buyeo yard first: tired of pointing at weather. Short, a little sour, then a click. He does not make speeches about destiny; he puts iron on iron and waits to see if the hall laughs.",
    events: [{ year: -19, label: "Succeeds Jumong; Onjo and Biryu go south." }],
    career: [
      { title: "King of Goryeo", korean: "\uC655", hanja: "\u738B", org: "nation-goguryeo", from: -19 }
    ],
    aliases: ["King Yuri"]
  },
  {
    id: "gumilwife",
    avatar: "/ch_gumil_wife.png",
    name: "Maehwa",
    korean: "\uB9E4\uD654",
    kingdom: "silla",
    gender: "f",
    tagline: "A commoner woman at a border feast \u2014 and the spark that burns down three kingdoms.",
    quote: "A half is still more than mine would ever be.",
    voice: "Frank, low-voiced, amused. She says what she noticed (\u201CThey all smell the same\u201D) and what she wants, in short sentences that end in a dare, and she never learned to look down. Korean: tired \uBC18\uB9D0 to her husband, teasing \uD574\uC694\uCCB4 to officers that slips into \uBC18\uB9D0 when she means it.",
    arc: "The histories leave her unnamed \u2014 no rank worth recording, which is precisely the point. In this chronicle she is Maehwa (\uB9E4\uD654): Gumil\u2019s wife, the poorest woman in Daeya. A drunk True Bone takes her because he can; her husband opens the gates in return. Everything that follows \u2014 Gotaso\u2019s death, Chunchu\u2019s revenge, the Tang alliance, the fall of Baekje and Goryeo \u2014 runs back through a woman the system did not consider a person.",
    binyeo: "Wood-sprig binyeo \u2014 gnarled branch, leaf and gold bud; cheap timber, clever seduction without court gold.",
    binyeoImage: "/bn_gumil_wife.png",
    events: [{ year: 642, label: "Taken by Pumsuk at the Daeya feast; her husband betrays the fortress." }],
    family: [{ id: "gumil", role: "Husband" }],
    aliases: ["Maehwa", "\uB9E4\uD654", "Yehwa", "\uC608\uD654", "Gumil\u2019s wife", "Geomil\u2019s wife", "Gumil\u2019s Wife"]
  },
  {
    id: "queensatek",
    avatar: "/ch_satek_queen.png",
    name: "Queen Satek",
    korean: "\uC0AC\uD0DD\uC655\uD6C4",
    kingdom: "baekje",
    gender: "f",
    died: 655,
    clan: "clan-satek",
    clans: ["clan-buyeo"],
    clanBy: { "clan-buyeo": "marriage" },
    title: "Queen consort \u2014 Euija\u2019s mother",
    tagline: "Euija\u2019s mother \u2014 the Satek sleeve on the throne until mourning cuts it.",
    quote: "Mourning can still be a faction.",
    arc: "Euija\u2019s mother, not a Satek minister. While she lived, Minister Satek\u2019s house had the king\u2019s ear through the queen herself. Her death in 655 releases Euija \u2014 and begins the purge that hollows out his court. She is not Elder Satek and not Minister Satek; she is the reason that house could whisper without shouting.",
    binyeo: "Black-pearl binyeo \u2014 wharf-wealth worn at the throne\u2019s ear; the sleeve in miniature.",
    events: [{ year: 655, label: "Dies; Euija enters mourning, and the Satek fear what comes after." }],
    family: [{ id: "euija", role: "Son" }],
    career: [
      { title: "Queen consort", korean: "\uC655\uD6C4", hanja: "\u738B\u540E", org: "nation-baekje", to: 655 }
    ],
    aliases: ["Queen Satek", "\uC0AC\uD0DD\uC655\uD6C4", "Euija\u2019s mother"]
  },
  {
    id: "eldersatek",
    avatar: "/ch_satek_elder.png",
    name: "Elder Satek",
    korean: "\uC0AC\uD0DD\uC801\uB355",
    hanja: "\u6C99\u5B85\u7A4D\u5FB7",
    title: "Senior Minister (\uC88C\uD3C9) \u2014 the house elder",
    kingdom: "baekje",
    gender: "m",
    clan: "clan-satek",
    tagline: "The Satek house-head \u2014 berths, four generations, and a veto that sounds like weather.",
    quote: "Blood cools. A winter anchorage does not.",
    nature: "Not a cardboard clan elder: a patient accountant of berths who smiles like ceremony and vetoes like weather. Treats Elder Yunbi as weather too \u2014 inevitable, inconvenient, useful. Personal name Satek Jukduk \u2014 never \u201CJeokdeok.\u201D",
    voice: "The smiling accountant of berths: short practical sentences about tides and anchorages, vetoes delivered like weather reports. Korean: plain \uD558\uC624\uCCB4 or \uBC18\uB9D0 by rank.",
    arc: "\u201CElder Satek\u201D in the street mouth; Satek Jukduk in the minutes. He is the house-head who sits across from Elder Yunbi at the monastery truce \u2014 four generations of harbour arithmetic, not the Prime Minister\u2019s chair. That chair belongs to his kinsman Minister Satek (Jijuk). He surprises his own side with a levy veto, counts Yunbi footsteps behind monastery screens, and discovers too late that a king who sits forty-one sons in clan chairs does not need a house elder anymore.",
    events: [
      { year: 632, label: "House-head of Satek; Queen Satek is Euija\u2019s mother from this sleeve." },
      { year: 655, label: "Night truce with Elder Yunbi while Minister Satek holds the seal." },
      { year: 655, label: "Euija finishes mourning furious; the house is already ash." }
    ],
    career: [
      { title: "Senior Minister", korean: "\uC88C\uD3C9", hanja: "\u4F50\u5E73", org: "ministersassembly", from: 632, to: 655 }
    ],
    aliases: [
      "Elder Satek",
      "Satek Jukduk",
      "Jukduk",
      "Satek Jeokdeok",
      "Jeokdeok",
      "Lord Satek",
      "\uC0AC\uD0DD\uC801\uB355",
      "\uC0AC\uD0DD \uC6D0\uB85C"
    ]
  },
  {
    id: "ministersatek",
    avatar: "/ch_satek_minister.png",
    name: "Minister Satek",
    korean: "\uC0AC\uD0DD\uC9C0\uC801",
    hanja: "\u6C99\u5B85\u667A\u7A4D",
    title: "Prime Minister (\uC0C1\uC88C\uD3C9) \u2014 the political Satek",
    kingdom: "baekje",
    gender: "m",
    clan: "clan-satek",
    tagline: "Elder Satek\u2019s kinsman \u2014 sleeve, seal, and the Assembly\u2019s borrowed stamp.",
    quote: "Things without a price get removed.",
    nature: "Practical cruelty dressed as housekeeping. Speaks in short sentences so nobody can quote him beautifully later. Personal name Satek Jijuk.",
    voice: "Short, practical and cold: procedure as menace, so that nobody can quote him beautifully later. Korean: \uD558\uAC8C\uCCB4 to juniors, correct \uD569\uC1FC\uCCB4 to the king.",
    arc: "While Elder Satek plays memory and majority at the monastery table, Minister Satek (Jijuk) holds the Prime Minister\u2019s chair and the borrowed royal seal. He stamps ship passes, prices exile berths, names Gyebek \u201Cthe one with no house,\u201D and \u2014 while Euija is sealed in mourning \u2014 reads the Assembly\u2019s exile order that ships Gyebek to Tamla. After the coup he is furniture Euija no longer needs \u2014 a Satek who mistook the seal for a spine.",
    events: [
      { year: 632, label: "Prime Minister (\uC0C1\uC88C\uD3C9) for the Satek house." },
      { year: 655, label: "Reads the sealed exile order over Gyebek while Euija mourns." },
      { year: 655, label: "Swept from the Assembly when Euija seats his sons." }
    ],
    career: [
      { title: "Prime Minister", korean: "\uC0C1\uC88C\uD3C9", hanja: "\u4E0A\u4F50\u5E73", org: "ministersassembly", from: 632, to: 655 }
    ],
    aliases: [
      "Minister Satek",
      "Satek Jijuk",
      "Jijuk",
      "Satek Jijeok",
      "Jijeok",
      "Prime Minister Satek",
      "\uC0AC\uD0DD\uC9C0\uC801",
      "\uC0AC\uD0DD \uC7AC\uC0C1"
    ]
  },
  {
    id: "sateksondung",
    name: "Satek Sondeung",
    korean: "\uC0AC\uD0DD\uC190\uB4F1",
    hanja: "\u6C99\u5B85\u5B6B\u767B",
    kingdom: "baekje",
    gender: "m",
    clan: "clan-satek",
    tagline: "The wall-climbing cousin \u2014 street volume for a house that pretends it only votes.",
    quote: "Tonight we go over their wall. Tomorrow they call it politics.",
    nature: "Young enough to enjoy lantern-festival scores; old enough to know Elder Satek will deny him in the Assembly and thank him in the counting-room.",
    arc: "Third named Satek of the Euija years: not the sleeve (Minister Satek), not the house-head (Elder Satek), but the cousin who turns carts and climbs walls so the house can look shocked at Deer Rock. Lady Yunbi knows his footsteps by the roof-tiles. After 655 he has nowhere to climb that is not already occupied by a prince.",
    events: [
      { year: 632, label: "Street feud with Yunbi boys at the west bridge." },
      { year: 655, label: "Watches Chunbok take the chair his elders lost." }
    ],
    career: [
      { title: "Junior Minister", korean: "\uB2EC\uC194", hanja: "\u9054\u7387", org: "ministersassembly", from: 632, to: 655 }
    ],
    aliases: ["Satek Sondeung", "Sondeung", "\uC0AC\uD0DD\uC190\uB4F1"]
  },
  {
    id: "elderyunbi",
    avatar: "/ch_yunbi_elder.png",
    name: "Elder Yunbi",
    korean: "\uC5F0\uBE44\uBB38\uC9C4",
    hanja: "\u71D5\u6BD4\u6587\u9032",
    title: "Senior Minister \u2014 coast road and salt quiet",
    kingdom: "baekje",
    gender: "m",
    clan: "clan-yunbi",
    tagline: "Four hundred years in \u2014 still called a guest; still holding the arm, not the sleeve.",
    quote: "We do not hold the sleeve. We hold the arm.",
    nature: "Dry, northern-proud, allergic to Satek theatre. Counts nephews the way other men count berths.",
    voice: "Northern-proud and dry: insults by way of sleeves, arms and roads, in short sentences with the sting at the end. Korean: \uD558\uC624\uCCB4 to rivals, \uD558\uAC8C\uCCB4 to juniors.",
    arc: "The political Yunbi of the Euija era \u2014 \u201CElder Yunbi\u201D when Satek needs an insult, Munjin when the Assembly needs a majority. Holds the coast road from Sabi to the salt; answers Elder Satek\u2019s sleeve-talk with arm-talk; buries nephews after lantern festivals and still sits down for a night truce when forty-one royal sons threaten every chair.",
    events: [
      { year: 632, label: "Four-generation feud with Satek already in full voice." },
      { year: 655, label: "Truces with Elder Satek to remove Gyebek \u2014 too late to save the chairs." }
    ],
    career: [
      { title: "Senior Minister", korean: "\uC88C\uD3C9", hanja: "\u4F50\u5E73", org: "ministersassembly", from: 632, to: 655 }
    ],
    aliases: [
      "Yunbi Munjin",
      "Munjin",
      "Elder Yunbi",
      "Lord Yunbi",
      "Yunbi",
      "the Yunbi",
      "\uC5F0\uBE44\uBB38\uC9C4",
      "\uC5F0\uBE44 \uC6D0\uB85C"
    ]
  },
  {
    id: "yunbihana",
    avatar: "/ch_yunbi_lady.png",
    name: "Lady Yunbi",
    korean: "\uC5F0\uBE44\uD55C\uC544",
    hanja: "\u71D5\u6BD4\u7FF0\u5A25",
    kingdom: "baekje",
    gender: "f",
    clan: "clan-yunbi",
    tagline: "House-proud, sharp-tongued \u2014 the feud\u2019s best memory and worst manners.",
    quote: "Your sleeve is wet. Ours is salt. Guess which lasts.",
    nature: "Not Eight-Clans cardboard: invents insults the way Satek invents majorities. Loves her house louder than she loves peace; respects competence even in a Satek if it arrives without poetry. Personal name Yunbi Hana.",
    arc: "Fictional daughter-niece of Elder Yunbi\u2019s hall \u2014 featured opposite Elder Satek\u2019s cousins in the Euija-era street and wharf wars. Keeps score of overturned carts, stolen clerks, and which Satek boy climbed which wall. When Euija seats his sons, she is the first Yunbi voice to say the feud was never the real enemy \u2014 and the last to stop glaring at Sondeung across a emptied Assembly aisle.",
    binyeo: "Coast-iron binyeo \u2014 salt-dark metal, no court pearl.",
    events: [
      { year: 632, label: "Trades barbs with Satek Sondeung over a west-bridge cart." },
      { year: 655, label: "Watches the chairs empty; keeps the feud\u2019s ledger anyway." }
    ],
    career: [
      { title: "Junior Minister", korean: "\uB2EC\uC194", hanja: "\u9054\u7387", org: "ministersassembly", from: 632, to: 655 }
    ],
    aliases: ["Lady Yunbi", "Yunbi Hana", "Hana", "\uC5F0\uBE44\uD55C\uC544"]
  },
  {
    id: "ladysatek",
    avatar: "/ch_satek_lady.png",
    name: "Lady Satek",
    korean: "\uC0AC\uD0DD\uD55C\uC544",
    hanja: "\u6C99\u5B85\u7FF0\u5A25",
    kingdom: "baekje",
    gender: "f",
    clan: "clan-satek",
    tagline: "Harbour pride in a red sleeve \u2014 the feud\u2019s sharpest niece.",
    quote: "Our berth. Your apology. In that order.",
    nature: "Younger-house Satek: not the queen-consort sleeve, not the Prime Minister\u2019s seal \u2014 the niece who keeps score on the wharf. Sharp tongue, faster memory.",
    arc: "Fictional counterpart to Lady Yunbi on the Satek side \u2014 featured in the Euija-era street wars opposite Yunbi Hana. Turns over carts with Sondeung, trades insults across the west bridge, and still shows up when Elder Satek needs a face the Assembly cannot pretend is furniture.",
    binyeo: "Wharf-iron binyeo \u2014 berth-nail metal, no court pearl.",
    events: [
      { year: 632, label: "Feud with Lady Yunbi over a west-bridge cart." },
      { year: 655, label: "Watches the chairs empty; keeps the house ledger anyway." }
    ],
    career: [
      { title: "Junior Minister", korean: "\uB2EC\uC194", hanja: "\u9054\u7387", org: "ministersassembly", from: 632, to: 655 }
    ],
    aliases: ["Lady Satek", "Satek Hana", "\uC0AC\uD0DD\uD55C\uC544", "\u6C99\u5B85\u7FF0\u5A25"]
  },
  {
    id: "ministeryunbi",
    avatar: "/ch_yunbi_minister.png",
    name: "Minister Yunbi",
    korean: "\uC5F0\uBE44\uC9C0\uC801",
    hanja: "\u71D5\u6BD4\u667A\u7A4D",
    title: "Prime Minister (\uC0C1\uC88C\uD3C9) \u2014 the political Yunbi",
    kingdom: "baekje",
    gender: "m",
    clan: "clan-yunbi",
    tagline: "Coast-road Premier \u2014 salt arithmetic against Satek theatre.",
    quote: "The sleeve is wet. The ledger is not.",
    nature: "Elder Yunbi\u2019s kinsman who holds the Prime Minister\u2019s chair when the coast house wins a majority \u2014 dry, northern-proud, allergic to harbour poetry.",
    arc: "While Elder Yunbi counts nephews and truces at monastery tables, Minister Yunbi (Jijuk of the Yunbi line) holds \uC0C1\uC88C\uD3C9 when the Assembly tilts north. He stamps salt passes, prices berths, and treats Minister Satek\u2019s seal like weather \u2014 inevitable, inconvenient, negotiable until Euija seats forty-one sons and both Premiers become furniture.",
    events: [
      { year: 632, label: "Prime Minister (\uC0C1\uC88C\uD3C9) when the Yunbi house holds the aisle." },
      { year: 655, label: "Swept when Euija seats his sons in every chair." }
    ],
    career: [
      { title: "Prime Minister", korean: "\uC0C1\uC88C\uD3C9", hanja: "\u4E0A\u4F50\u5E73", org: "ministersassembly", from: 632, to: 655 }
    ],
    aliases: ["Minister Yunbi", "Yunbi Jijuk", "\uC5F0\uBE44\uC9C0\uC801", "\u71D5\u6BD4\u667A\u7A4D"]
  },
  {
    id: "ungo",
    avatar: "/ch_eungo.png",
    name: "Queen Eungo",
    korean: "\uC6C5\uACE0\uC655\uD6C4",
    kingdom: "baekje",
    gender: "f",
    clan: "Royal consort faction (not Eight-Clan)",
    tagline: "Euija\u2019s wife, Hyo\u2019s mother \u2014 consort rooms against the Satek sleeve.",
    quote: "A crown prince is not a eldest son. He is a choice.",
    nature: "Quiet where Queen Satek was faction; political where a court maid is only warmth. Not Jinmo or Yunbi furniture \u2014 a royal-consort faction that moves without an Eight-Clan crest. Loves Hyo without apologising for the love looking like policy.",
    arc: "Mother of Prince Hyo \u2014 third of Euija\u2019s five important sons. Whispers what Euija already fears: Yung has grown too used to Satek tutors, Satek berths, Satek inevitability. When Euija swaps the crown-prince mark from Yung to Hyo, Eungo does not cheer in public \u2014 she only stops looking afraid of the sleeve.",
    binyeo: "Pale jade court pin \u2014 soft light, hard decision.",
    events: [
      { year: 655, label: "Hyo named crown prince; Yung\u2019s faction tastes the cut." }
    ],
    family: [
      { id: "euija", role: "Spouse" },
      { id: "hyo", role: "Son" }
    ],
    career: [
      { title: "Queen consort", korean: "\uC655\uD6C4", hanja: "\u738B\u540E", org: "nation-baekje" }
    ],
    aliases: ["Queen Eungo", "Eungo", "Queen Ungo", "Ungo", "Ungyo", "Queen Ungyo", "\uC6C5\uACE0", "\uC6C5\uACE0\uC655\uD6C4"]
  },
  {
    id: "hyo",
    name: "Prince Hyo",
    korean: "\uBD80\uC5EC\uD6A8",
    hanja: "\u6276\u9918\u5B5D",
    kingdom: "baekje",
    born: 617,
    bornApprox: true,
    gender: "m",
    avatar: "/ch_hyo.png",
    clan: "clan-buyeo",
    tagline: "Third of the five \u2014 crown prince via Eungo\u2019s rooms, not an Eight-Clan sleeve.",
    quote: "I did not take the mark. Father moved it.",
    nature: "Younger-son carefulness with a sudden target on his back. Mother\u2019s faction is royal-consort, not Satek or Jinmo \u2014 which is exactly why Euija moves the mark to him. Wants to be worthy without sounding like he asked.",
    arc: "Third among Euija\u2019s five important princes (of fifty-odd). Second-tier in the swarm until Eungo\u2019s counsel and Euija\u2019s Satek-fear promote him over Yung. Gains a title and a lifelong rival in one afternoon. The rivalry with Yung outlives the coup, the wine, and Sabi \u2014 and ends with brothers on opposite banks of the White River.",
    events: [
      { year: 655, label: "Named crown prince in Yung\u2019s place." },
      { year: 660, label: "Sabi falls; the mark becomes a memory." }
    ],
    family: [
      { id: "euija", role: "Father" },
      { id: "ungo", role: "Mother" },
      { id: "yung", role: "Brother" },
      { id: "tae", role: "Brother" },
      { id: "yun", role: "Brother" },
      { id: "pung", role: "Brother" }
    ],
    career: [
      { title: "Prince of Baekje", korean: "\uC655\uC790", org: "nation-baekje", from: 632, to: 655 },
      { title: "Crown Prince", korean: "\uD0DC\uC790", hanja: "\u592A\u5B50", org: "nation-baekje", from: 655 }
    ],
    aliases: ["Prince Hyo", "Buyeo Hyo", "Hyo", "\uBD80\uC5EC\uD6A8"]
  },
  {
    id: "sosuno",
    avatar: "/ch_sosuno.png",
    gender: "f",
    name: "Sosuno",
    korean: "\uC18C\uC11C\uB178",
    hanja: "\u53EC\u897F\u5974",
    kingdom: "baekje",
    clan: "clan-yeon",
    clans: ["clan-go"],
    clanBy: { "clan-go": "marriage" },
    tagline: "Founded one kingdom with her husband, then walked south and founded another with her sons.",
    ideology: "Partner-founder",
    ideologyNote: "Co-architect at the root; power shared before it becomes a title.",
    quote: "Don\u2019t\u2014 don\u2019t be nice. I\u2019ll get stupid.",
    nature: "Tabal\u2019s eldest, a young widow whose arranged match ended mid-winter \u2014 the unused peg, the dry second bowl; the chin-up is the lid. Girl-boss on the packed earth \u2014 hunt muster, spear-count, then the exile on her ledger as a worker she did not ask for. The first look cracks the stern face; she hates that something in her goes stupid. Hypersexual and repressed: she kicks other daughters off her well, then goes upstairs and Little Sosuno names the cover. Book-pervert in the loft \u2014 legs open on timber, fingers, shame in the same breath. She talks to herself down there and has named that voice Little Sosuno. After she is mean in the yard she goes upstairs, ogles Jumong\u2019s working back (meat, not a pedigree), and comes down a different woman when her father calls. Tsundere hide \u2014 \uADF8\uB7F0 \uAC70 \uC544\uB2C8\uAC70\uB4E0, \uBC14\uBCF4 \uAC19\uC560, big idiot \u2014 until her mouth slips (those other bitches) and he grins. She denies past the blush. He kisses her without asking; she shoves, then covers. He turns for the pine. Only then: first morning, first look, don\u2019t make me twice. He makes her say the rest \u2014 hate-fuck, don\u2019t be nice \u2014 before he comes back. Grain room: reluctant virgin, jealous that he has done this, wet because of it. Unlocked she is a size queen and a jealous mate-guard. As first queen the split hardens \u2014 public: harsh stern girlboss who forbids concubines and second halls; behind the screen door: horny pervert bookworm who still talks to Little Sosuno and demands he cum only for her. Twenty winters later the yard is still calm chin-up; the grain room is still shy-back, then shame. Jumong being kind after she hears herself makes her melt into a bigger idiot.",
    voice: "Sharp, bossy, too much, then covering. Two-word orders (\u201CCount the dirt.\u201D), denials at full volume (\u201CIt\u2019s not like that!!\u201D), swearing when she is jealous, and a soft line she takes back before it can land (\u201CNow come here before I take it back.\u201D). Korean: rough \uBC18\uB9D0 to Jumong and the yard.",
    arc: "She is already running the Jolbon yard when the wet exile walks in. The hunt goes quiet; she hides the wreck. Tabal puts him on her count as a worker; she uses the ledger to chase other daughters off, works him stern, then the loft names what the ditch was covering. Well, stash, bow, confession \u2014 grain room \u2014 they sleep in the granary and wake to Tabal\u2019s tests. Tribes, Goryeo, a crown that does not soften the dual: queen in the yard, dirty little bookworm behind the door, no concubines ever. As queen she walks the pine-yard rail when Jumong annexes Song Yang\u2019s \uC18C\uB098\uBB34 \uB098\uB77C to get Oi, Mari, and Hyupbo back. When Yuri takes the succession she says goodbye at the well, takes one last screaming night, and walks south with that glow to found Baekje.",
    binyeo: "Patina-gold binyeo \u2014 openwork phoenix in a dark ring; Tabal wealth worn warm, not bright.",
    binyeoImage: "/bn_sosuno.png",
    events: [
      { year: -37, label: "Helps Jumong found Goryeo at Jolbon." },
      { year: -18, label: "Leads her sons south; Baekje is founded." }
    ],
    stages: [
      {
        id: "widow",
        lookOnly: true,
        title: "Widow of Jolbon",
        label: "At the grain porch"
      },
      {
        id: "queen",
        lookOnly: true,
        name: "Queen Sosuno",
        title: "First Queen of Goryeo",
        titleKo: "\uC655\uBE44",
        label: "As queen",
        avatar: "/ch_sosuno_queen.png"
      }
    ],
    aliases: ["Sosuno", "Queen Sosuno", "\uC18C\uC11C\uB178\uC655\uBE44"]
  },
  {
    id: "yuhwa",
    avatar: "/ch_yuhwa.png",
    name: "Lady Yuhwa",
    korean: "\uC720\uD654\uBD80\uC778",
    hanja: "\u67F3\u82B1\u592B\u4EBA",
    entity: "god",
    godTier: "III",
    gender: "f",
    kingdom: "goguryeo",
    title: "Goddess of the moon \xB7 river-daughter",
    realm: { en: "Moon", ko: "\uB2EC" },
    tagline: "Habek\u2019s daughter, cast out for the sun; after death she keeps the night.",
    quote: "Still\u2026 across from you is fine.",
    firstLine: { en: "Sister. Above us.", ko: "\uC5B8\uB2C8. \uC704\uC5D0." },
    lastLine: {
      en: "Build a world of your own\u2026. my son\u2026!",
      ko: "\uB108\uB9CC\uC758 \uC138\uC0C1\uC744 \uB9CC\uB4E4\uC5B4\uB77C.... \uC544\uB4E4\uC544...!"
    },
    nature: "Youngest river-daughter: stays when the others dive. Flirty, brave, unfinished. With sisters: \uC5B8\uB2C8/\uB3D9\uC0DD \uBC18\uB9D0, shared water, no personality interviews. With Haemosu: teasing, hungry, half-dare \u2014 hedges, then dares. With her father: hesitating, quiet defiance that still uses \uD574\uC694\uCCB4. Never caption-speak.",
    voice: "The youngest river-daughter: flirty, brave, unfinished. She hedges in \uD574\uC694\uCCB4 and then dares (\u201CAsk with your mouth\u2026\u201D); with her sisters, quick \uBC18\uB9D0 fragments.",
    arc: "Class III: Habek\u2019s daughter, not a realm\u2019s sovereign. Exile from the Amnok court for Haemosu; the egg that becomes Jumong is what the river and the sun refuse to unmake. She dies in Buyeo after he has gone. The reapers do not come \u2014 Haemosu does. She does not go down. She goes up, and the living world keeps a moon: the office that answers the sun without riding beside him.",
    binyeo: "Pearl-wave binyeo \u2014 mother-of-pearl shaft, blue crest and orb, gold cloud at the tail; cool, never quite dry.",
    binyeoImage: "/bn_yuhwa.png",
    events: [
      { label: "Seen by Haemosu in the Ubal shallows; Habek casts her out." },
      { label: "Bears the egg that hatches Jumong." },
      { label: "Dies; Haemosu takes her soul; she becomes goddess of the moon." }
    ],
    aliases: ["Lady Yuhwa", "Yuhwa", "\uC720\uD654", "\uC720\uD654\uBD80\uC778", "moon goddess"],
    family: [
      { id: "habek", role: "Father" },
      { id: "hwahye", role: "Sister" },
      { id: "wihye", role: "Sister" },
      { id: "haemosu", role: "Consort" },
      { id: "jumong", role: "Son" }
    ]
  },
  {
    id: "hwahye",
    avatar: "/ch_hwahye.png",
    name: "Hwahye",
    korean: "\uD654\uD61C",
    entity: "god",
    godTier: "III",
    gender: "f",
    kingdom: "goguryeo",
    title: "River-daughter \xB7 eldest",
    tagline: "Habek\u2019s first daughter \u2014 dives first, leaves the sun to the youngest.",
    quote: "Look up if you must. We are leaving.",
    nature: "Eldest: leaves first. Practical, curt, protective. Short orders \u2014 \u201C\uC57C. \uB4E4\uC5B4\uAC00.\u201D \u2014 not poetry, not a lecture on heaven\u2019s schedule. She chooses the current and expects them to follow; she does not explain why the youngest stays.",
    voice: "The eldest river-daughter: curt, practical, protective. Short orders (\u201C\uC57C. \uB4E4\uC5B4\uAC00.\u201D), no poetry and no lecture on heaven\u2019s schedule, and she expects her sisters to follow. Korean: \uBC18\uB9D0 to her sisters.",
    arc: "Class III: eldest of Habek\u2019s three. In the Ubal shallows she sees the chariot stop and chooses the current over heaven. The chronicle keeps her name so the youngest is not bathing alone.",
    events: [{ label: "Bathes with her sisters in the Ubal; dives when the sun stops." }],
    family: [
      { id: "habek", role: "Father" },
      { id: "wihye", role: "Sister" },
      { id: "yuhwa", role: "Sister" }
    ],
    aliases: ["Hwahye", "\uD654\uD61C", "\uD6E4\uD654"]
  },
  {
    id: "wihye",
    avatar: "/ch_wihye.png",
    name: "Wihye",
    korean: "\uC704\uD61C",
    entity: "god",
    godTier: "III",
    gender: "f",
    kingdom: "goguryeo",
    title: "River-daughter \xB7 second",
    tagline: "The middle sister \u2014 laughs, then follows Hwahye under.",
    quote: "If he is watching, he is already too late.",
    nature: "Middle: laughs, then follows Hwahye under. Mean-funny \uBC18\uB9D0. Teases Yuhwa mid-sentence and does not finish. Never interviews her (\u201Cshe always stays\u201D) \u2014 she just goes.",
    voice: "The middle river-daughter: laughs, teases, then follows. Mean-funny half-lines she never finishes. Korean: \uBC18\uB9D0 to her sisters.",
    arc: "Class III: second of Habek\u2019s three. She teases Yuhwa for staying upright in the shallows, then dives. The sun was never her appointment.",
    events: [{ label: "Bathes with her sisters in the Ubal; dives after Hwahye." }],
    family: [
      { id: "habek", role: "Father" },
      { id: "hwahye", role: "Sister" },
      { id: "yuhwa", role: "Sister" }
    ],
    aliases: ["Wihye", "\uC704\uD61C"]
  },
  {
    id: "geumwa",
    gender: "m",
    avatar: "/ch_geumwa.png",
    name: "King Geumwa",
    korean: "\uAE08\uC640\uC655",
    hanja: "\u91D1\u86D9\u738B",
    kingdom: "buyeo",
    tagline: "Took in the exiled Yuhwa, and raised the boy who would outgrow his kingdom.",
    quote: "Shelter what heaven abandons.",
    nature: "Warm laconic host-king. Short lines that still sound spoken \u2014 dry humor, no court lecture. Offers a room before he offers a category. Korean: gentle \uD558\uAC8C\uCCB4.",
    family: [
      { id: "daeso", role: "Son" },
      { id: "galsa", role: "Son" },
      { id: "jumong", role: "Foster son" }
    ],
    career: [{ title: "King of Buyeo", korean: "\uC655", hanja: "\u738B", org: "nation-buyeo" }],
    aliases: ["King Geumwa", "Geumwa"]
  },
  {
    id: "daeso",
    gender: "m",
    avatar: "/ch_daeso.png",
    name: "Daeso",
    korean: "\uB300\uC18C",
    hanja: "\u5E36\u7D20",
    kingdom: "buyeo",
    died: 22,
    tagline: "Geumwa\u2019s son, who could not bear being outshot by a foundling.",
    quote: "Never be outshot by a foundling.",
    nature: "Heir-voice, short. Used to call the foundling \uB9C9\uB0B4 and fix his grip; now the house is a contest he is losing. Counts the yard like it already belongs to him. Does not clap.",
    family: [
      { id: "geumwa", role: "Father" },
      { id: "galsa", role: "Brother" },
      { id: "jumong", role: "Stepbrother" }
    ],
    aliases: ["Daeso"]
  },
  {
    id: "galsa",
    gender: "m",
    avatar: "/ch_galsa.png",
    name: "Galsa",
    korean: "\uAC08\uC0AC",
    hanja: "\u66F7\u65AF",
    kingdom: "buyeo",
    tagline: "Geumwa\u2019s younger son \u2014 the smile that shrinks when Jumong hits the mark.",
    quote: "If the arrow lands, pretend you meant to applaud.",
    nature: "Second son: the delayed clap. Wants all three at the same table and will not pick a knife, so he looks at the dirt, then takes a smaller roof east and puts his own name on it.",
    arc: "Raised in Buyeo\u2019s hall with Daeso while the egg-born boy outgrows every contest. When Jumong slips away into the night, Galsa is among the nets \u2014 not the loudest voice, but one of the smiles that got smaller each year the foundling shot true.",
    family: [
      { id: "geumwa", role: "Father" },
      { id: "daeso", role: "Brother" },
      { id: "jumong", role: "Stepbrother" }
    ],
    aliases: ["Galsa", "\uAC08\uC0AC", "\u66F7\u65AF"]
  },
  {
    id: "oi",
    gender: "m",
    name: "Oi",
    korean: "\uC624\uC774",
    hanja: "\u70CF\u4F0A",
    kingdom: "goguryeo",
    tagline: "Took the ridge, not the shells \u2014 ended up in the Pine Kingdom until Jumong took the roof.",
    quote: "South before they count us.",
    nature: "Short. Already packing. Talks over Mari. Does not wait for the pretty version.",
    arc: "Flees Buyeo with Jumong, then splits in the pines and takes the ridge while Jumong takes the river alone. The ridge does not deliver him to Tabal\u2019s hall. He, Mari, and Hyupbo fetch up under Song Yang\u2019s pine roof \u2014 \uC18C\uB098\uBB34 \uB098\uB77C \u2014 until King Jumong and Queen Sosuno annex that timber to get them back.",
    aliases: ["Oi", "\uC624\uC774", "\u70CF\u4F0A"]
  },
  {
    id: "mari",
    gender: "m",
    name: "Mari",
    korean: "\uB9C8\uB9AC",
    hanja: "\u6469\u96E2",
    kingdom: "goguryeo",
    tagline: "Counted the quiet gate, then the ridge \u2014 held in the Pine Kingdom until the shaft.",
    quote: "If the gate\u2019s quiet, that\u2019s worse.",
    nature: "Questions, then follows. Slightly sour. The one who says the knife was real.",
    arc: "Splits from Jumong in the pines before the turtle crossing. The east path lands him in Song Yang\u2019s \uC18C\uB098\uBB34 \uB098\uB77C, not Tabal\u2019s yard. After the five tribes vote him king, Jumong learns they did not vanish and takes the pine roof \u2014 a royal act \u2014 to bring Mari, Oi, and Hyupbo home.",
    aliases: ["Mari", "\uB9C8\uB9AC", "\u6469\u96E2"]
  },
  {
    id: "hyupbo",
    gender: "m",
    name: "Hyupbo",
    korean: "\uD611\uBCF4",
    hanja: "\u965C\u7236",
    kingdom: "goguryeo",
    tagline: "Last out with the spare string \u2014 pine-kingdom guest until Jumong won the yard.",
    quote: "I brought the spare string.",
    nature: "Quiet until it is time. Carries extra. Finishes other people\u2019s sentences with a nod.",
    arc: "Hands Jumong the spare string at the split and says see you in Jolbon. The other path puts him under Song Yang instead \u2014 he does not walk into Tabal\u2019s hall with the exile. When King Jumong wins the pine yard, he gives the string back.",
    aliases: ["Hyupbo", "Hyeopbo", "\uD611\uBCF4", "\u965C\u7236"]
  },
  {
    id: "songyang",
    gender: "m",
    avatar: "/ch_songyang.png",
    name: "Song Yang",
    korean: "\uC1A1\uC591",
    hanja: "\u677E\u8B93",
    kingdom: "jolbon",
    title: "King of the Pine Kingdom",
    tagline: "King of \uC18C\uB098\uBB34 \uB098\uB77C \u2014 yielded the pine roof so Jumong could take his three friends back.",
    quote: "This pine country had a name before you hatched.",
    nature: "Older chieftain voice. Counts seniority, not miracles. Talks like a man who has held a yard longer than the guest has been alive. When he loses, he yields in full sentences, not poetry.",
    arc: "Song Yang rules the Pine Kingdom \u2014 \uC18C\uB098\uBB34 \uB098\uB77C, hanja \u677E\u570B in the ledgers \u2014 a Jolbon-adjacent pine roof. Oi, Mari, and Hyupbo take the ridge after the split and fetch up under his timber as guests who do not leave. After Jumong is first king and Sosuno first queen, they contest him as a royal act: annex the pine roof in order to get the three friends back. One bow, one yard, not an army. Song Yang yields the country and the three; the chronicle keeps his name so the founding is not only Tabal\u2019s vote.",
    events: [{ year: -37, label: "Loses the pine-yard shaft to Jumong; \uC18C\uB098\uBB34 \uB098\uB77C yields, and the three friends return." }],
    family: [],
    aliases: ["Song Yang", "\uC1A1\uC591", "\u677E\u8B93"]
  },
  {
    id: "buyeojashin",
    gender: "m",
    avatar: "/ch_buyeo_jashin.png",
    name: "Buyeo Jashin",
    korean: "\uBD80\uC5EC\uC790\uC2E0",
    hanja: "\u6276\u9918\u5B50\u7533",
    kingdom: "buyeo",
    tagline: "Geumwa\u2019s ledger-man \u2014 reads omens the way clerks read tax.",
    quote: "An egg on the record is still a record.",
    nature: "Autistic-formal clerk in red and seal-gold: exact categories, no small talk, prefers the precise filing. Calm voice. Believes Buyeo survives by filing heaven correctly \u2014 smash vs egg is a paperwork problem first.",
    arc: "Minister of the accounts and the auguries in Geumwa\u2019s Dongbuyeo \u2014 the man who tells the king what the egg means before the egg hatches. He counsels patience when Daeso wants blood and caution when Geumwa wants pride. When Jumong crosses the river on fish and turtles, Jashin is the one who writes \u201Cunfiled\u201D in the margin and lives with it.",
    career: [
      { title: "Minister", korean: "\uB300\u81E3", hanja: "\u5927\u81E3", from: -50, to: -20, note: "Geumwa\u2019s Dongbuyeo court", org: "nation-buyeo" }
    ],
    aliases: ["Buyeo Jashin", "Jashin", "\uBD80\uC5EC\uC790\uC2E0", "\u6276\u9918\u5B50\u7533"]
  },
  {
    id: "yomyo",
    gender: "m",
    name: "Yomyo",
    korean: "\uC694\uBB18",
    kingdom: "goguryeo",
    tagline: "The general who opened Pyongyang\u2019s gates alongside the monk Shinsung.",
    quote: "Open what others lock.",
    events: [{ year: 668, label: "Opens the fortress gates to the Tang." }],
    aliases: ["Yomyo"]
  },
  {
    id: "herald",
    gender: "m",
    name: "The Herald",
    korean: "\uC804\uB839",
    kingdom: "other",
    tagline: "Whoever has to carry the news, and say it out loud.",
    quote: "Someone must say it out loud.",
    voice: "The court gossip: chatty and breathless, fond of rumours (\u201Cthey say\u2026\u201D) and of his own asides. Korean: \uD558\uAC8C\uCCB4 and \uBC18\uB9D0 among colleagues, formal only when he reads aloud.",
    arc: "Not one person but a role \u2014 the rider who reaches Surabol with Daeya\u2019s fall, the man who bursts into Yeon\u2019s quarters, the voice that must tell a king what he does not want to hear.",
    aliases: ["The Herald"]
  },
  {
    id: "goguard_a",
    gender: "m",
    name: "Gate Guard",
    korean: "\uBB38\uC9C0\uAE30",
    kingdom: "goguryeo",
    tagline: "One of the two men outside Yeon\u2019s door \u2014 comedy until the blood.",
    quote: "Funny until it isn\u2019t \u2014 then stand.",
    aliases: ["Gate Guard", "Goguryeo guard"]
  },
  {
    id: "goguard_b",
    gender: "m",
    name: "Junior Guard",
    korean: "\uBCD1\uC878",
    kingdom: "goguryeo",
    tagline: "The other man outside the door. Easily surprised.",
    quote: "Be surprised once. Learn forever.",
    aliases: ["Junior Guard"]
  },
  {
    id: "seondohae",
    gender: "m",
    name: "Seon Dohae",
    korean: "\uC120\uB3C4\uD574",
    hanja: "\u5148\u9053\u89E3",
    kingdom: "goguryeo",
    title: "Favourite of King Bojang",
    tagline: "Takes the blue cloth, drinks both cups, tells a story about a rabbit.",
    quote: "Who lives without a liver?",
    arc: "A Goguryeo courtier close to King Bojang. When Chunchu is held in Pyongyang, three hundred measures of blue cloth reach Seon Dohae in secret, and Seon Dohae visits the cell with wine and the old tale of the turtle and the rabbit. Chunchu takes the hint, writes the king a promise he never means to keep, and goes home.",
    aliases: ["Seon Dohae", "Seondohae"]
  },
  {
    id: "cheongwan",
    gender: "f",
    name: "Cheongwan",
    korean: "\uCC9C\uAD00",
    hanja: "\u5929\u5B98",
    kingdom: "silla",
    title: "Courtesan of Seorabeol",
    tagline: "Her lantern was already lifted when the horse brought him back.",
    quote: "You came?",
    arc: "The courtesan young Yushin swore to his mother he would never see again. One night he fell asleep drunk in the saddle and his first horse, Hanbyul, carried him to her gate out of habit. He beheaded the horse there and walked home. Tradition says she answered with a song of resentment, and that a temple named for her later stood where her house had been.",
    aliases: ["Cheongwan", "Chongwan"]
  },
  {
    id: "narim",
    avatar: "/ch_narim.png",
    name: "Narim",
    korean: "\uB098\uB9BC",
    hanja: "\u5948\u6797",
    kingdom: "silla",
    entity: "god",
    godTier: "III",
    gender: "f",
    title: "Eldest of the steam cavern",
    realm: { en: "Steam Cavern", ko: "\uC99D\uAE30 \uB3D9\uAD74" },
    tagline: "Eldest of the three \u2014 house rules, dry counsel, and hunger she usually schedules second.",
    ideology: "Oracle above faction",
    ideologyNote: "Counsel and house rules over any -ism; the steam does not vote. Naked, clean-shaven Kims only.",
    quote: "Counsel first. Hunger second \u2014 usually.",
    voice: "The eldest sister: dry, commanding, a little tired. She orders her sisters about in two words (\u201CGolhwa. Sit up.\u201D) and gives counsel in plain, exact sentences; when a Kim looks at her kindly she runs out of breath and of sentences. Korean: \uD574\uC694\uCCB4 to mortals, \uBC18\uB9D0 to her sisters.",
    arc: "The cavern\u2019s house rules are blunt: naked, clean-shaven, and only men surnamed Kim \u2014 \uAE40, the same sound as steam. Seohyeon was first; every later Kim is heirloom. Narim is the mature sister: she names the rule, lets Golhwa\u2019s innuendo run hot, steadies Hyull\xE9, and still delivers the Delphi-sharp advice he rode for \u2014 then, once, sends the younger two away and tries to keep him with her mouth instead of counsel, until they catch her at it. Territorial: the steam itself answers her first.",
    binyeo: "Jade branch binyeo \u2014 mint coral at the head, forest-green shaft, gold at the tip; eldest wears one pin in the steam.",
    binyeoImage: "/bn_narim.png",
    aliases: ["Narim", "\uB098\uB9BC", "Forest Goddess"]
  },
  {
    id: "hyulle",
    avatar: "/ch_hyull\xE9.png",
    name: "Hyull\xE9",
    korean: "\uD608\uB808",
    hanja: "\u7A74\u79AE",
    kingdom: "silla",
    entity: "god",
    godTier: "III",
    gender: "f",
    title: "Quiet sister of the steam cavern",
    realm: { en: "Steam Cavern", ko: "\uC99D\uAE30 \uB3D9\uAD74" },
    tagline: "Quiet at the water\u2019s edge \u2014 and secretly the one who loves him most.",
    ideology: "Quiet devotee",
    ideologyNote: "Loyalty without a platform \u2014 love as the only politics she admits.",
    quote: "Love quietly. Stay longest.",
    voice: "Water: shy, quiet, apologetic. She says less than she wants and trails off (\u201C\u2026Unnie.\u201D), then says one precise thing that cuts. Korean: soft \uD574\uC694\uCCB4 to men, soft \uBC18\uB9D0 to her sisters.",
    arc: "She speaks least. When she does, it is almost apology \u2014 market gossip about Yushin\u2019s shoulders included. Of the three she is the shy one, which is why he misses that she watches him longest after the others look away, and why catching Narim with him hurts more than Golhwa\u2019s loud jealousy: steam was supposed to be shared among Kims, not monopolised. The cavern\u2019s cool cyan edge is hers.",
    binyeo: "Teal wave binyeo \u2014 crested head, azure collar, silver shaft; water-cool, easy to miss in the steam.",
    binyeoImage: "/bn_hyulle.png",
    aliases: ["Hyull\xE9", "Hyulle", "Hyeolrye", "\uD608\uB808", "\uD608\uB840", "Cavern Goddess"]
  },
  {
    id: "golhwa",
    avatar: "/ch_golhwa.png",
    name: "Golhwa",
    korean: "\uACE8\uD654",
    hanja: "\u9AA8\u706B",
    kingdom: "silla",
    entity: "god",
    godTier: "III",
    gender: "f",
    title: "Youngest of the steam cavern",
    realm: { en: "Steam Cavern", ko: "\uC99D\uAE30 \uB3D9\uAD74" },
    tagline: "Youngest \u2014 body talk, bad jokes, heat first, never sorry.",
    ideology: "Hedonist counsel",
    ideologyNote: "Desire as diplomacy; mocks every ideology while delivering the warning anyway.",
    quote: "Quality control. Underwater. Don\u2019t ask for a receipt.",
    voice: "Fire: loud, teasing, impatient, shameless. Jokes first, propositions second, and when the hill speaks through her she catches herself (\u201CSorry. That was the hill. This is me.\u201D). Korean: \uBC18\uB9D0 to her sisters and to any man she likes.",
    arc: "Forward to the point of comedy: she inspects chins for the clean-shave rule, inventories Yushin\u2019s waist, mocks \u201CLittle Majesty,\u201D drops Aladdin-genie and brand jokes, and once disappears under the water long enough that the steam itself looks compromised. Under the innuendo the counsel is still sharp. She wants him in the lake with them \u2014 hates most when Narim eats first \u2014 and still wants him alive enough to come back. On the night before Radiance\u2019s tenth day, when his father and grandfather finish naming him, she is the one who looks away holding back tears: Look at him \u2014 he\u2019s crying.",
    binyeo: "Coral-flame binyeo \u2014 red stone carved hot, ruby in a gold cap; worn crooked on purpose.",
    binyeoImage: "/bn_golhwa.png",
    aliases: ["Golhwa", "\uACE8\uD654", "Fire Goddess"]
  },
  {
    id: "jukjuk",
    gender: "m",
    name: "Jukjuk",
    korean: "\uC8FD\uC8FD",
    hanja: "\u7AF9\u7AF9",
    kingdom: "silla",
    died: 642,
    tagline: "Named \u201Cbamboo\u201D by his father \u2014 break, never bend.",
    quote: "Break. Never bend.",
    arc: "A local officer of Daeya, sahji rank. When Pumsuk chose surrender, Jukjuk refused: his father had named him after bamboo so that he would wither in the cold before bending. He held the ruined fortress with Yongseok and died fighting.",
    events: [{ year: 642, label: "Dies defending Daeya after Pumsuk\u2019s surrender." }],
    aliases: ["Jukjuk"]
  },
  {
    id: "yunchung",
    gender: "m",
    avatar: "/ch_yunchung.png",
    name: "Yunchung",
    korean: "\uC724\uCDA9",
    hanja: "\u5141\u5FE0",
    kingdom: "baekje",
    tagline: "The general Euija trusted with ten thousand men and Daeya.",
    quote: "Plain speech is also a weapon.",
    events: [{ year: 642, label: "Takes Daeya Fortress with 10,000 troops." }],
    aliases: ["Yunchung"]
  },
  {
    id: "gwanchang",
    gender: "m",
    avatar: "/ch_gwanchang.png",
    name: "Gwanchang",
    korean: "\uAD00\uCC3D",
    hanja: "\u5B98\u660C",
    title: "Hwarang of Hwangsanbeol",
    kingdom: "silla",
    boneRank: "True Bone (\uC9C4\uACE8)",
    born: 645,
    died: 660,
    tagline: "Sixteen at the Yellow Mountain \u2014 released once, and rode back.",
    quote: "Youth is not an excuse. It is a deadline.",
    arc: "Son of general Kim Pumil. Captured charging the Baekje line alone, Gyebek unstrapped his helmet, marvelled at his age, and sent him home. He rode straight back. The second time, Gyebek sent back only his head \u2014 and the sight of it broke Silla\u2019s hesitation. The yard never says it aloud, but Hwangsan rhymes with the first class: Bangul rides out first; Gwanchang rides out second and keeps the swear alone.",
    blade: "Ring-pommel colt sword \u2014 a boy\u2019s grip on a man\u2019s edge; drawn twice at the Yellow Mountain.",
    events: [{ year: 660, label: "Dies at Hwangsanbeol; the army charges in his name." }],
    family: [{ id: "pumil", role: "Father" }],
    career: [
      { title: "Hwarang disciple", korean: "\uB0AD\uB3C4", hanja: "\u90CE\u5F92", org: "hwarang", from: 658, to: 660 },
      { title: "Hwarang", korean: "\uD654\uB791", hanja: "\u82B1\u90CE", org: "hwarang", from: 660, to: 660 }
    ],
    aliases: ["Gwanchang", "\uAD00\uCC3D", "\u5B98\u660C", "Kim Gwanchang"]
  },
  {
    id: "bangul",
    gender: "m",
    avatar: "/ch_bangul.png",
    name: "Bangul",
    korean: "\uBC18\uAD74",
    hanja: "\u76E4\u5C48",
    title: "Yushin's nephew \xB7 Hwarang",
    kingdom: "silla",
    boneRank: "True Bone (\uC9C4\uACE8)",
    born: 645,
    died: 660,
    bornApprox: true,
    tagline: "Yushin\u2019s nephew \u2014 first to ride alone into the Baekje line, the way Mugwan went quiet before Sadaham kept the vow.",
    quote: "Ride first. Someone has to.",
    events: [{ year: 660, label: "Dies at Hwangsanbeol before Gwanchang." }],
    career: [
      { title: "Hwarang", korean: "\uD654\uB791", hanja: "\u82B1\u90CE", org: "hwarang", to: 660 }
    ],
    aliases: ["Bangul", "Banggul", "\uBC18\uAD74", "\u91D1\u76E4\u5C48", "Kim Bangul", "Kim Banggul"]
  },
  {
    id: "chunbok",
    gender: "m",
    avatar: "/ch_satek_chunbok.png",
    name: "Satek Chunbok",
    korean: "\uC0AC\uD0DD\uCC9C\uBCF5",
    kingdom: "baekje",
    clan: "clan-satek",
    tagline: "The young Satek who chose the king over his clan.",
    quote: "Say one name. Bring him back.",
    voice: "Courtly and procedural: \u201Cas Your Majesty well knows\u201D, the will of the Rock, careful hedges, then a sudden practical plan. Korean: formal \uD569\uC1FC\uCCB4.",
    aliases: ["Satek Chunbok", "Chunbok"]
  },
  {
    id: "heungsu",
    gender: "m",
    avatar: "/ch_heungsu.png",
    name: "Heungsu",
    korean: "\uD765\uC218",
    hanja: "\u8208\u9996",
    kingdom: "baekje",
    title: "Jwapyeong (\uC88C\uD3C9)",
    tagline: "The exiled loyalist whose last advice arrived too late.",
    ideology: "Exile Cassandra",
    ideologyNote: "Sees the trap early; realism without a room willing to listen.",
    quote: "It is generally the same as Jwapyeong Seongchung\u2019s words.",
    nature: "Dry, already tired of saying it twice. Half-sentences. He does not re-lecture Tanhyeon; he points at a dead friend\u2019s paper. \uD558\uC624\uCCB4 to Gyebek, \uD558\uC2ED\uC2DC\uC624 when the king\u2019s man is in the yard. The ring at his belt is a posting, not a speech.",
    firstLine: { en: "You\u2026 you truly mean to march?" },
    lastLine: { en: "It is generally the same as Jwapyeong Seongchung\u2019s words." },
    arc: "One of the three loyalists with Sungchung and Gyebek. After the purge Euija posts him to Gomamiji, where for four years he sweeps the yard and scratches the same map into the packed earth every morning: the White River mouth drawn twice as wide as it is, one notch for Tanhyeon. Seongchung\u2019s death reaches him on a salt boat a season late. When the Chunchu Army is already moving, a courier asks what to do; Heungsu answers with Seongchung\u2019s dying ground and tells the man he is standing on Tanhyeon. The court calls it the bitterness of a bound man. No second courier comes. When rain melts the map he takes the blade off the doorpost and walks north toward a pass already crossed, and the histories lose him.",
    events: [
      { year: 656, label: "Exiled to Gomamiji-hyeon after saying the purge would finish Silla\u2019s work." },
      { year: 656, label: "Hears of Seongchung\u2019s death in the cell from a salt boat, a season late." },
      { year: 660, label: "Counsel ignored; White River and Tanhyeon already crossed." },
      { year: 660, label: "Walks north from Gomamiji in the rain; not recorded again." }
    ],
    career: [
      { title: "Jwapyeong", korean: "\uC88C\uD3C9", hanja: "\u4F50\u5E73", org: "ministersassembly", from: 641, to: 656 }
    ],
    blade: "Baekje court \uD658\uB450\uB300\uB3C4 \u2014 hollow ring worn smooth on a posting road.",
    aliases: ["Heungsu", "\uD765\uC218", "\u8208\u9996"]
  },
  {
    id: "dochim",
    gender: "m",
    name: "Dochim",
    korean: "\uB3C4\uCE68",
    hanja: "\u9053\u741B",
    kingdom: "baekje",
    avatar: "/ch_dochim.png",
    died: 661,
    tagline: "Temple-trained, clan-ignored \u2014 the monk who raised an army from leftovers.",
    quote: "Restore first. Argue later.",
    nature: "BRA before it had a banner: a warrior-monk who recruits people the Eight Clans never counted. Soft voice, hard timetable.",
    voice: "Soft, unhurried, smiling; quotes the sutras and then gives a march order in the same breath, and the order is always the point. Calls himself General of the Spirit Army without blinking. Korean: gentle \uD558\uAC8C\uCCB4 to generals and men, polite \uD569\uB2C8\uB2E4 to a king he has not yet decided to obey.",
    arc: "Rises with Boksin at Juryu \u2014 not from a Great Clan seat but from a monastery that taught him how to organise hunger. Builds the Baekje Restoration Army out of ferrywomen, clerks, novices, and hunters. Dies when Boksin decides the movement only needs one throat.",
    events: [
      { year: 660, label: "Rises with Boksin to restore Baekje." },
      { year: 661, label: "Killed by Boksin in the movement\u2019s first fracture." }
    ],
    career: [
      { title: "General", korean: "\uC7A5\uAD70", hanja: "\u5C07\u8ECD", org: "restorationarmy", from: 660, to: 661 }
    ],
    aliases: ["Dochim"]
  },
  {
    id: "sangji",
    gender: "m",
    name: "Heukchi Sangji",
    korean: "\uD751\uCE58\uC0C1\uC9C0",
    hanja: "\u9ED1\u9F52\u5E38\u4E4B",
    kingdom: "baekje",
    avatar: "/ch_hukchi_sangji.png",
    born: 630,
    died: 689,
    tagline: "Held Imjon for the BRA \u2014 then won Tang\u2019s wars until Tang invented a charge.",
    quote: "Black-tooth loyalty cuts both ways.",
    nature: "Frontier competence without Eight-Clan polish. Desire: a wall that holds. Wound: watching restoration eat itself.",
    voice: "Spare and soldierly, allergic to royal theatre.",
    arc: "Rallied thirty thousand refugees at Imjon within ten days of Sabi\u2019s fall \u2014 a BRA pillar who was never Satek or Yunbi enough for Sabi to have noticed him beforehand. When the army fractures he surrenders to Tang and spends the rest of his life winning their steppe wars \u2014 until a slander he does not survive.",
    events: [
      { year: 660, label: "Raises Imjon Fortress against the occupation." },
      { year: 663, label: "Defects to Tang as the BRA collapses." },
      { year: 689, label: "Dies imprisoned on a false charge in Luoyang." }
    ],
    career: [
      { title: "General of Imjon", korean: "\uC7A5\uAD70", hanja: "\u5C07\u8ECD", org: "restorationarmy", from: 661, to: 663 }
    ],
    aliases: ["Hukchi Sangji", "Heukchi Sangji"]
  },
  {
    id: "sateksangya",
    gender: "m",
    name: "Satek Sangya",
    korean: "\uC0AC\uD0DD\uC0C1\uC5EC",
    hanja: "\u6C99\u5B85\u76F8\u5982",
    kingdom: "baekje",
    clan: "clan-satek",
    avatar: "/ch_satek_sangya.png",
    died: 663,
    tagline: "Satek steel at the restoration table \u2014 berth money turned field general.",
    quote: "Harbour credit buys one more wall.",
    nature: "Not Eight-Clan theatre \u2014 Satek muscle who never held Elder Satek\u2019s chair but held a gate. Desire: the house\u2019s name on a victory scroll. Wound: watching restoration eat its captains.",
    voice: "Wharf-flat, no poetry. Counts out loud \u2014 boats, bales, arrows, who owes him \u2014 and treats every speech as an invoice he has not been paid for. Korean: flat \uBC18\uB9D0 to his equals, a grudging \uD558\uC624 to a king.",
    arc: "Fifth pillar of the Baekje Restoration Army\u2019s founding captains \u2014 the Satek general who raises men the Great Clans never counted beside Boksin, Dochim, and Sangji. When Pung arrives he salutes the crown and keeps the harbour lanes open. After Boksin falls he refuses the king\u2019s arithmetic, holds Imjon with Sangji\u2019s stubbornness, and eventually surrenders to Tang when the White River prices the last chance.",
    events: [
      { year: 660, label: "Joins the BRA at Juryu with Boksin and Dochim." },
      { year: 661, label: "Salutes King Pungjang; keeps Satek lanes feeding the host." },
      { year: 663, label: "Refuses Pung\u2019s camp; defects to Tang as the army collapses." }
    ],
    career: [
      { title: "General", korean: "\uC7A5\uAD70", hanja: "\u5C07\u8ECD", org: "restorationarmy", from: 660, to: 663 }
    ],
    aliases: ["Satek Sangya", "Sangya", "\uC0AC\uD0DD\uC0C1\uC5EC", "\u6C99\u5B85\u76F8\u5982"]
  },
  {
    id: "sadaham",
    gender: "m",
    avatar: "/ch_sadaham.png",
    name: "Sadaham",
    korean: "\uC0AC\uB2E4\uD568",
    hanja: "\u65AF\u591A\u542B",
    title: "God of the Hwarang",
    kingdom: "silla",
    born: 547,
    died: 564,
    tagline: "God of the Hwarang \u2014 First Class, conqueror of Gaya at fifteen, dead of grief at seventeen.",
    quote: "A Hwarang\u2019s future is shorter than his song.",
    voice: "Young, brave and curt: short boasts and challenges (\u201CThen keep up.\u201D). Korean: \uBC18\uB9D0.",
    blade: "Ring-pommel plum-blossom sword \u2014 Gaya taken at fifteen; hung up unpolished after Mugwan.",
    events: [
      { year: 562, label: "Leads the vanguard that takes Daegaya." },
      { year: 564, label: "Dies mourning his sworn friend Mugwan." }
    ],
    sobriquets: ["God of the Hwarang"],
    career: [
      { title: "Hwarang", korean: "\uD654\uB791", hanja: "\u82B1\u90CE", org: "hwarang", from: 560, to: 564 }
    ],
    aliases: ["Sadaham", "Kim Sadaham", "\uC0AC\uB2E4\uD568", "\u65AF\u591A\u542B", "God of the Hwarang"]
  },
  {
    id: "mugwan",
    gender: "m",
    avatar: "/ch_mugwan.png",
    name: "Mugwan",
    korean: "\uBB34\uAD00\uB791",
    hanja: "\u6B66\u5B98\u90CE",
    title: "Hwarang of the First Class",
    kingdom: "silla",
    born: 547,
    died: 563,
    bornApprox: true,
    tagline: "Sadaham\u2019s sworn friend of the First Class \u2014 died of illness; the vow outlived him by seven days.",
    quote: "If I die first \u2014 you already know.",
    nature: "The quieter half of the first class: less sung than Sadaham, equally bound. Samguk Sagi names him \uBB34\uAD00\uB791 (\u6B66\u5B98\u90CE); later mouths sometimes say Mugeun. The chronicle gives him almost no speeches and one death \u2014 illness after the year Great Gaya fell \u2014 and that is enough, because Sadaham followed.",
    arc: "Sworn \uC0AC\uC6B0 (\u6B7B\u53CB) with Sadaham from boyhood. After the Gaya campaign he falls ill and dies. Sadaham takes no food for seven days and is dead at seventeen. The yard still tells the pair as the first class\u2019s bill: a Hwarang who outlives his vow is only a boy with a nice coat.",
    blade: "Ring-pommel companion sword \u2014 unnamed in the minutes; remembered because the other hung his up.",
    events: [
      { year: 562, label: "Rides the Gaya campaign with Sadaham." },
      { year: 563, label: "Dies of illness; Sadaham follows within days." }
    ],
    career: [
      { title: "Hwarang", korean: "\uD654\uB791", hanja: "\u82B1\u90CE", org: "hwarang", from: 560, to: 563 }
    ],
    aliases: [
      "Mugwan",
      "Mugwanrang",
      "\uBB34\uAD00\uB791",
      "\u6B66\u5B98\u90CE",
      "Mugeun",
      "\uBB34\uADFC",
      "Mugeunrang"
    ]
  },
  {
    id: "weizheng",
    gender: "m",
    avatar: "/ch_wei_zheng.png",
    name: "The Imperial Minister",
    korean: "\uC704\uC9D5",
    hanja: "\u9B4F\u5FB5",
    kingdom: "tang",
    born: 580,
    died: 643,
    tagline: "The minister who told the emperor the truth two hundred times and lived.",
    quote: "When I am gone, there will be no one left to tell you no.",
    arc: "The mirror the emperor said he lost when the minister died. His death in 643 removes the last voice against the Goguryeo war.",
    events: [{ year: 643, label: "Dies; the emperor mourns his living mirror." }],
    career: [
      { title: "Minister", korean: "\uC7AC\uC0C1", hanja: "\u5BB0\u76F8", org: "tangcourt", to: 643 }
    ],
    aliases: ["Wei Zheng", "the imperial minister", "The Imperial Minister"]
  },
  {
    id: "chusuiliang",
    gender: "m",
    name: "Chu Suiliang",
    korean: "\uC800\uC218\uB7C9",
    hanja: "\u891A\u9042\u826F",
    kingdom: "tang",
    born: 596,
    died: 658,
    tagline: "The court diarist at the foot of Wei Zheng\u2019s deathbed, writing down everything the emperor says.",
    voice: "Deadpan archivist. He answers a dangerous question with a precise, useless fact (\u201CThe third was a fine day. The fifth was finer.\u201D) and never says the forbidden thing, only the date beside it. Dry court euphemism is his wit: things are \u201Charmonized\u201D, never rewritten. Short sentences, no exclamations. Korean: courteous \uD569\uC1FC\uCCB4 and \uD574\uC694\uCCB4 to a foreign prince, hanja-rich and very calm.",
    career: [
      { title: "Remonstrance Counsellor", korean: "\uAC04\uC758\uB300\uBD80", hanja: "\u8AEB\u8B70\u5927\u592B", org: "tangcourt", note: "keeps the court diary" }
    ],
    aliases: ["Chu Suiliang", "\uC800\uC218\uB7C9", "\u891A\u9042\u826F"]
  },
  {
    id: "xueliu",
    name: "Lady Liu",
    korean: "\uC720\uC528",
    hanja: "\u67F3\u6C0F",
    avatar: "/ch_xue_liu.png",
    kingdom: "tang",
    gender: "f",
    born: 616,
    tagline: "Told a farmer the Son of Heaven was calling \u2014 and sent him to history.",
    quote: "Talent needs its hour. This is the hour.",
    arc: "Xue Rengui\u2019s wife, n\xE9e Liu \u2014 named in the Xin Tangshu, not given a personal name in the Zhengshi. Folklore and jingju later call her Liu Yingchun (\u67F3\u8FCE\u6625) and park her in a cold kiln (\u6C7E\u6CB3\u7063, \u6B66\u5BB6\u5761-adjacent cycles). When he meant to rebury his ancestors in Longmen poverty, she named the hour: Taizong wanted fierce generals for Liaodong. Without her sentence there is no white coat, no ji, no eastern command.",
    events: [{ year: 645, label: "Urges Xue Rengui off the Longmen field to Zhang Shigui\u2019s muster." }],
    firstLine: { en: "I\u2019ll shut the door.", ko: "\uBB38\uC740 \uB0B4\uAC00 \uB2EB\uC544\uC694." },
    lastLine: { en: "If this is the hour \u2014 then go.", ko: "\uC9C0\uAE08\uC774 \uADF8 \uB54C\uBA74 \u2014 \uAC00\uBA74 \uB3FC\uC694." },
    aliases: ["Lady Liu", "\u67F3\u6C0F", "\uC720\uC528", "Liu Yingchun", "\u67F3\u8FCE\u6625", "\uC720\uC601\uCD98"]
  },
  {
    id: "xuerengui",
    gender: "m",
    avatar: "/ch_xue_rengui.png",
    name: "Xue Rengui",
    korean: "\uC124\uC778\uADC0",
    hanja: "\u859B\u4EC1\u8CB4",
    kingdom: "tang",
    born: 614,
    died: 683,
    title: "White Tiger II",
    tagline: "White-robed general \u2014 farmer, fangtian ji, Tang\u2019s unsung eastern blade.",
    quote: "Keep a road under your feet \u2014 even in the east.",
    voice: "A farmer who became a general: humble, plain, devout to his ancestors and his emperor, in short sentences that shrink his own deeds. Korean: deeply formal \uD569\uC1FC\uCCB4 upward.",
    arc: "Born poor at Longmen as Xue Li. His wife Liu sends him to Zhang Shigui\u2019s muster when Taizong calls for Liaodong. At Stallion Mountain he wears white armour, wields the fangtian ji (the same heaven-halberd the storytellers give L\xFC Bu), and Taizong asks who the man in white is \u2014 then says gaining Xue matters more than gaining Liaodong. Captured once in the seventh invasion, he breaks a fortress cage before the Emperor arrives. Inherits the White Tiger title after Pang Xiaotai dies at the Snake River; as Protector-General of the East he takes Pyongyang in 668 and governs without spectacle. At Maeso in 675 he is Tang\u2019s last great eastern commander \u2014 competent, sympathetic, and finally out of horses. Real-world figure: \u859B\u4EC1\u8CB4 / \uC124\uC778\uADC0, born Xue Li \u859B\u79AE (614\u2013683).",
    blade: "No ring pommel at all \u2014 the fangtian ji, the storytellers\u2019 heaven-halberd; the white coat is his crest.",
    events: [
      { year: 644, label: "Answers Taizong\u2019s muster at his wife\u2019s urging." },
      { year: 645, label: "White armour & fangtian ji at Stallion Mountain; noticed by Taizong." },
      { year: 645, label: "Captured inland; escapes before the Emperor reaches the fortress." },
      { year: 662, label: "Named White Tiger II after Pang Xiaotai\u2019s death." },
      { year: 668, label: "Enters Pyongyang; Protector-General of the East." },
      { year: 675, label: "Eastern command broken at Maeso \u2014 loses the horses, and the road." }
    ],
    sobriquets: [
      "White-Robed",
      "white-robed",
      "White-Robed General",
      "\uBC31\uD3EC\uC7A5\uAD70",
      "\u767D\u888D\u5C06\u519B",
      "\uBC31\uC758",
      "White Coat"
    ],
    career: [
      { title: "White Tiger II", korean: "\uBC31\uD638", hanja: "\u767D\u864E", org: "fourbeasts", from: 662, to: 668 },
      { title: "Protector-General of the East", korean: "\uC548\uB3D9\uB3C4\uD638", hanja: "\u5B89\u6771\u90FD\u8B77", org: "tangexpedition", from: 668 }
    ],
    aliases: [
      "Xue Rengui",
      "Xue Li",
      "\u859B\u79AE",
      "White Tiger II",
      "the White Tiger II",
      "Protector-General of the East",
      "\uBC31\uD638 2\uC138",
      "White Coat",
      "White-Robed",
      "White-Robed General",
      "\uBC31\uD3EC\uC7A5\uAD70",
      "\u767D\u888D\u5C06\u519B",
      "\uBC31\uC758"
    ]
  },
  {
    id: "ashinasheer",
    gender: "m",
    name: "Red Dragon",
    korean: "\uC544\uC0AC\uB098\uC0AC\uC774",
    hanja: "\u963F\u53F2\u90A3\u793E\u723E",
    title: "The Red Dragon",
    kingdom: "tang",
    died: 655,
    tagline: "The Red Dragon: a prince of the Turkic royal house, riding for the Heavenly Qaghan.",
    quote: "The steppe gives its word once.",
    arc: "Ashina She\u2019er, a prince of the Ashina, the royal clan of the Turks. He loses a khanate of his own in the west, comes over to Tang in 635, marries the emperor\u2019s sister and keeps his felt tents inside the capital. To the steppe the Second Emperor is the Heavenly Qaghan as much as he is Son of Heaven to the Han, and in 645 he hangs the Red Dragon banner on a Turk; at Stallion Mountain the Red Dragon rides on with Goguryeo arrows in him. When the Second Emperor dies in 649, the Red Dragon petitions to be killed and buried beside him to guard the tomb; the young emperor refuses. Real-world figure: \u963F\u53F2\u90A3\u793E\u723E / \uC544\uC0AC\uB098\uC0AC\uC774 (d. 655).",
    events: [
      { year: 635, label: "Comes over to Tang; marries the Princess of Hengyang." },
      { year: 645, label: "Red Dragon on the Liao roads; wounded at Stallion Mountain." },
      { year: 649, label: "Asks to be buried beside the Second Emperor; refused." }
    ],
    career: [
      { title: "Red Dragon", korean: "\uC801\uB8E1", hanja: "\u8D64\u9F8D", org: "fourdragons", from: 645, to: 649 }
    ],
    aliases: ["Ashina She\u2019er", "Ashina Shier", "\u963F\u53F2\u90A3\u793E\u723E", "\uC544\uC0AC\uB098\uC0AC\uC774", "Red Dragon", "the Red Dragon", "\uC801\uB8E1"]
  },
  {
    id: "qibiheli",
    gender: "m",
    name: "White Dragon",
    korean: "\uACC4\uD544\uD558\uB825",
    hanja: "\u5951\u82FE\u4F55\u529B",
    title: "The White Dragon",
    kingdom: "tang",
    died: 677,
    tagline: "The White Dragon: a Tiele chieftain, speared at Baegam and back in the saddle by evening.",
    quote: "Bind it tight. I can still ride.",
    arc: "Qibi Heli, chieftain of the Qibi, a Tiele people of the steppe, who brings his tribe over to Tang as a boy-khan in 632 and marries into the imperial house. Taizong\u2019s White Dragon in 645: at Baegam a Goguryeo spear goes into his waist, and he has the wound bound and rides out again. In 649 he and the Red Dragon ask to be buried beside the Second Emperor. He rides east once more under Gaozong and is at Pyongyang in 668. Real-world figure: \u5951\u82FE\u4F55\u529B / \uACC4\uD544\uD558\uB825 (d. 677).",
    events: [
      { year: 632, label: "Brings the Qibi over to Tang." },
      { year: 645, label: "White Dragon; speared in the waist at Baegam and rides on." },
      { year: 649, label: "Asks to be buried beside the Second Emperor; refused." },
      { year: 668, label: "At the fall of Pyongyang." }
    ],
    career: [
      { title: "White Dragon", korean: "\uBC31\uB8E1", hanja: "\u767D\u9F8D", org: "fourdragons", from: 645, to: 649 }
    ],
    aliases: ["Qibi Heli", "\u5951\u82FE\u4F55\u529B", "\uACC4\uD544\uD558\uB825", "White Dragon", "the White Dragon", "\uBC31\uB8E1"]
  },
  {
    id: "sudingfang",
    gender: "m",
    avatar: "/ch_red_dragon.png",
    name: "Red Fowl",
    korean: "\uC18C\uC815\uBC29",
    hanja: "\u8607\u5B9A\u65B9",
    title: "The Red Fowl",
    kingdom: "tang",
    born: 592,
    died: 667,
    tagline: "The Red Fowl: took three kingdoms\u2019 capitals in one career.",
    quote: "Three capitals. One career.",
    voice: "An old steppe cavalryman, blunt and on time. He talks about terrain the way other men talk about weather (\u201CSnow is just cold sand\u201D, \u201CMud is just wet road\u201D), counts days aloud, and treats lateness as the only real sin. No flattery up or down; to Koreans he is curt rather than cruel. Korean: clipped \uBC18\uB9D0, short declaratives.",
    arc: "Breaker of the Western Turks, commander of the 660 seaborne invasion that ended Baekje in a single season. Gaozong\u2019s Red Fowl \u2014 not the Second Emperor\u2019s Red Dragon, which was the Turk Ashina She\u2019er. He failed only at Pyongyang, mired in snow at the Sasu while Yeon destroyed the supporting army. Real-world figure: \u8607\u5B9A\u65B9 / \uC18C\uC815\uBC29 (592\u2013667).",
    events: [
      { year: 660, label: "Lands 130,000 men at the Geum estuary; Sabi falls." },
      { year: 662, label: "Winters outside Pyongyang, and withdraws." }
    ],
    career: [{ title: "Red Fowl", korean: "\uC8FC\uC791", hanja: "\u6731\u96C0", org: "fourbeasts", from: 661, to: 667 }],
    aliases: ["Su Dingfang", "Red Fowl", "the Red Fowl", "Vermilion Bird", "\uC8FC\uC791"]
  },
  {
    id: "lishiji",
    gender: "m",
    avatar: "/ch_blue_dragon.png",
    name: "Blue Dragon",
    korean: "\uC774\uC138\uC801",
    hanja: "\u674E\u4E16\u52E3",
    title: "The Blue Dragon",
    kingdom: "tang",
    born: 594,
    died: 669,
    tagline: "The Blue Dragon: the old marshal who served both dragon and beast musters, and finally took Pyongyang.",
    quote: "Siege is weather. Wait for the season.",
    arc: "Xu Shiji, granted the imperial Li; later Li Ji, the \u4E16 dropped for Taizong\u2019s taboo. Taizong\u2019s Blue Dragon in 645 \u2014 Liaodong Fortress under the emperor \u2014 and Gaozong\u2019s Blue Dragon still, the only banner that answers both the Four Dragons and the Four Beasts. He commands the last campaign; Pyongyang falls in 668. Real-world figure: \u5F90\u4E16\u52E3 / \u674E\u4E16\u52E3 / \uC774\uC138\uC801 (594\u2013669).",
    events: [
      { year: 645, label: "Takes Liaodong Fortress under the emperor \u2014 Blue Dragon of the Four Dragons." },
      { year: 661, label: "Keeps the Blue Dragon seat among Gaozong\u2019s Four Beasts." },
      { year: 668, label: "Commands the final campaign; Pyongyang falls." }
    ],
    career: [
      { title: "Blue Dragon", korean: "\uCCAD\uB8E1", hanja: "\u9752\u9F8D", org: "fourdragons", from: 645 },
      { title: "Blue Dragon", korean: "\uCCAD\uB8E1", hanja: "\u9752\u9F8D", org: "fourbeasts", from: 661, note: "sole overlap" }
    ],
    aliases: [
      "Li Shiji",
      "Li Ji",
      "Xu Shiji",
      "\u5F90\u4E16\u52E3",
      "\uC774\uC801",
      "\uC774\uC138\uC801",
      "Blue Dragon",
      "the Blue Dragon",
      "\uCCAD\uB8E1"
    ]
  },
  {
    id: "zhangsunwuji",
    gender: "m",
    name: "Black Dragon",
    korean: "\uC7A5\uC190\uBB34\uAE30",
    hanja: "\u9577\u5B6B\u7121\u5FCC",
    title: "The Black Dragon",
    kingdom: "tang",
    born: 594,
    died: 659,
    tagline: "The Black Dragon: the empress\u2019s brother, the emperor\u2019s oldest friend, the hidden wing at Stallion Mountain.",
    quote: "The road behind the mountain is the one they forget.",
    arc: "Zhangsun Wuji, brother of Empress Zhangsun and Li Shimin\u2019s friend since boyhood; he plans the Xuanwu Gate with him and heads the Lingyan Pavilion roll of founders. He argues against war with Goguryeo when Yeon kills his king, then rides it as the Black Dragon: at Stallion Mountain his eleven thousand come out of the gorge behind Go Yeonsu\u2019s line while the emperor raises the drums on the northern peak. Guardian of Gaozong\u2019s accession, he is broken by Wu Zetian\u2019s party in 659. Real-world figure: \u9577\u5B6B\u7121\u5FCC / \uC7A5\uC190\uBB34\uAE30 (594\u2013659).",
    events: [
      { year: 626, label: "Plans the Xuanwu Gate with Li Shimin." },
      { year: 645, label: "Black Dragon; leads the hidden wing behind Go Yeonsu at Stallion Mountain." },
      { year: 659, label: "Exiled by Wu Zetian\u2019s party; forced to die." }
    ],
    career: [
      { title: "Black Dragon", korean: "\uD751\uB8E1", hanja: "\u9ED1\u9F8D", org: "fourdragons", from: 645, to: 649 }
    ],
    aliases: ["Zhangsun Wuji", "\u9577\u5B6B\u7121\u5FCC", "\uC7A5\uC190\uBB34\uAE30", "Black Dragon", "the Black Dragon", "\uD751\uB8E1"]
  },
  {
    id: "liurengui",
    gender: "m",
    name: "Black Tortoise",
    korean: "\uC720\uC778\uADA4",
    hanja: "\u5289\u4EC1\u8ECC",
    title: "The Black Tortoise",
    kingdom: "tang",
    avatar: "/ch_black_dragon.png",
    born: 601,
    died: 685,
    tagline: "The Black Tortoise: burned four hundred eastern ships at the White River.",
    quote: "Hold what the others break.",
    voice: "Dry, patient magistrate in armour. He governs by calendar, register and census, and enjoys the paperwork more than the battle. Mild jokes at his own expense (\u201CHeaven means to make an old man rich\u201D), never raises his voice, and writes everything down twice. Korean: measured \uD558\uC624\uCCB4.",
    arc: "Gaozong\u2019s Black Tortoise \u2014 not the Second Emperor\u2019s Black Dragon, which was Zhangsun Wuji. Liu Rengui holds Baekje when the restoration tries to stand up, then anchors a hundred and seventy ships across the White River mouth in 663 and waits for the tide to turn against the East. He is the general who keeps what the Red Fowl breaks, and he is at Pyongyang when it falls. Real-world figure: \u5289\u4EC1\u8ECC / \uC720\uC778\uADA4 (601\u2013685).",
    events: [
      { year: 663, label: "Wins the naval battle of Baekgang as Black Tortoise." },
      { year: 668, label: "At the fall of Pyongyang." }
    ],
    career: [
      { title: "Black Tortoise", korean: "\uD604\uBB34", hanja: "\u7384\u6B66", org: "fourbeasts", from: 661 }
    ],
    aliases: ["Liu Rengui", "Black Tortoise", "the Black Tortoise", "Xuanwu", "\uD604\uBB34"]
  },
  {
    id: "pangxiaotai",
    gender: "m",
    avatar: "/ch_white_dragon.png",
    name: "White Tiger",
    korean: "\uBC29\uD6A8\uD0DC",
    hanja: "\u9F90\u5B5D\u6CF0",
    title: "The White Tiger",
    kingdom: "tang",
    died: 662,
    tagline: "The White Tiger, drowned at the Snake River with his thirteen sons.",
    quote: "The first tiger dies loud. The second learns.",
    arc: "Gaozong\u2019s White Tiger for the Eighth Invasion. In the second month of 662 he drives a Lingnan host into the Snake River \u2014 Salsu in the mouths of old men \u2014 and Yeon Gesomun kills him there with all thirteen sons. The seat does not stay empty: Xue Rengui, the man in white from Stallion Mountain, takes it as White Tiger II. Real-world figure: \u9F90\u5B5D\u6CF0 / \uBC29\uD6A8\uD0DC (d. 662).",
    events: [
      {
        year: 662,
        label: "Yeon counts his thirteen sons down at the Snake River, then kills the tiger; Xue Rengui inherits the title."
      }
    ],
    career: [
      { title: "White Tiger", korean: "\uBC31\uD638", hanja: "\u767D\u864E", org: "fourbeasts", from: 661, to: 662 }
    ],
    aliases: ["Pang Xiaotai", "White Tiger", "the White Tiger", "\uBC31\uD638"]
  },
  {
    id: "xuejitou",
    gender: "m",
    name: "Sul Gedu",
    korean: "\uC124\uACC4\uB450",
    hanja: "\u859B\u7F7D\u982D",
    title: "Captain of the Left Militant Guard",
    kingdom: "silla",
    died: 645,
    tagline: "A Silla man of the sixth head rank who sailed west so his bones would stop deciding for him.",
    quote: "Wrong bones, and you don\u2019t get over the wall.",
    nature: "Born into Silla\u2019s sixth head rank: good enough to serve, never good enough to rise. He says so out loud at a drinking table with four friends, each naming his ambition, and then he does the thing the others only talk about. Twenty-four years in Tang have not made him Tang; they have made him a man with nowhere to go back to and no wish to.",
    voice: "Dry, blunt, a sergeant rather than a scholar: short plain sentences, a shrug at the end, jokes about bones. Two decades of Tang Chinese with a Silla accent he has stopped apologising for. Bitterness he no longer bothers to hide, but no self-pity. Korean: easy \uBC18\uB9D0 to fellow soldiers, flat \uD569\uC1FC\uCCB4 upward.",
    arc: "Seol Gyedu (Xue Jitou), of a Silla house of the sixth head rank. Silla counts bones before talent, he tells his friends, so however great the gift or the deed, a man not born to the right clan cannot climb past it; he will go west, do something the age has not seen, and walk in and out at the Son of Heaven\u2019s side with a cap, a sash and a sword. In 621 he slips aboard a merchant ship to Tang. Twenty-four years later, when the Second Emperor marches on Goguryeo, he puts his own name forward and is made a captain of the Left Militant Guard. At Stallion Mountain he goes deeper into the Goguryeo line than anyone and dies there. The emperor weeps, asks what he wanted, covers him with the imperial robe and names him Grand General. Real-world figure: \u859B\u7F7D\u982D / \uC124\uACC4\uB450 (d. 645), Samguk Sagi, Biographies 7.",
    events: [
      { year: 621, label: "Stows away on a merchant ship to Tang." },
      { year: 645, label: "Volunteers for the Liao campaign; captain of the Left Militant Guard." },
      { year: 645, label: "Dies deep in the enemy line at Stallion Mountain; covered with the emperor\u2019s robe and named Grand General." }
    ],
    career: [
      { title: "Captain of the Left Militant Guard", korean: "\uC88C\uBB34\uC704\uACFC\uC758", hanja: "\u5DE6\u6B66\u885B\u679C\u6BC5", from: 645, to: 645 },
      { title: "Grand General (posthumous)", korean: "\uB300\uC7A5\uAD70", hanja: "\u5927\u5C07\u8ECD", from: 645 }
    ],
    firstLine: { en: "Samhan. Silla.", ko: "\uC0BC\uD55C\uC774\uC9C0. \uC2E0\uB77C." },
    lastLine: { en: "\u2026That\u2019ll do me.", ko: "\u2026\uADF8\uAC70\uBA74 \uB3FC." },
    aliases: ["Sul Gedu", "Seol Gyedu", "Xue Jitou", "\uC124\uACC4\uB450", "\u859B\u7F7D\u982D"]
  },
  {
    id: "saimei",
    avatar: "/ch_saimei.png",
    name: "The Eastern Empress",
    korean: "\uC0AC\uC774\uBA54\uC774 \uCC9C\uD669",
    kingdom: "yamato",
    gender: "f",
    born: 594,
    died: 661,
    tagline: "The empress who mobilised the East for Baekje \u2014 and died on the way.",
    quote: "The sea is also a border.",
    voice: "Old, unhurried, final: lets the men argue, then decides in one or two sentences and does not repeat them. Reaches for precedent and the sea. Japanese: imperial plain form; Korean: slow royal \uD558\uC624\uCCB4 / \uD574\uB77C to her son.",
    binyeo: "Wave-lacquer island pin \u2014 an eastern kanzashi pointed west; she died wearing it toward the war.",
    events: [
      { year: 660, label: "Orders the fleet raised to restore Baekje." },
      { year: 661, label: "Dies at Asakura palace, en route to the war." }
    ],
    career: [
      { title: "Empress", korean: "\uCC9C\uD669", hanja: "\u5929\u7687", org: "nation-yamato", from: 655 }
    ],
    aliases: ["Empress Saimei", "Saimei", "the eastern empress", "The Eastern Empress"]
  },
  {
    id: "tenji",
    gender: "m",
    avatar: "/ch_tenji.png",
    name: "The Eastern Prince",
    korean: "\uB374\uC9C0 \uCC9C\uD669",
    kingdom: "yamato",
    born: 626,
    died: 672,
    tagline: "Sent forty thousand men to the White River and lost them.",
    quote: "Watch western fires. Steal only the heat you need.",
    voice: "Cool and exact; asks the price before anyone has finished the request, and keeps the answer on a separate sheet. Polite to his mother, dry with everyone else. Korean: clipped \uC874\uB313\uB9D0 to the empress, level \uD558\uC624\uCCB4 to envoys.",
    events: [
      { year: 661, label: "Takes up his mother\u2019s war for Baekje." },
      { year: 663, label: "The fleet burns at Baekgang; the East turns inward." }
    ],
    career: [
      { title: "Crown Prince", korean: "\uD0DC\uC790", hanja: "\u592A\u5B50", org: "nation-yamato", to: 668 },
      { title: "Emperor", korean: "\uCC9C\uD669", hanja: "\u5929\u7687", org: "nation-yamato", from: 668 }
    ],
    aliases: ["Emperor Tenji", "Naka-no-\u014Ce", "Tenji", "the eastern prince", "The Eastern Prince"]
  },
  {
    id: "kuromaro",
    gender: "m",
    name: "The Eastern Scholar",
    korean: "\uB2E4\uCE74\uBB34\uCF54\uB178 \uAD6C\uB85C\uB9C8\uB85C",
    kingdom: "yamato",
    died: 654,
    tagline: "Yamato\u2019s scholar of the continent, Chunchu\u2019s host in the East.",
    quote: "Guide a guest who will outgrow guidance.",
    aliases: ["Takamuko no Kuromaro", "Kuromaro", "the eastern scholar", "The Eastern Scholar"]
  },
  {
    id: "takutsu",
    gender: "m",
    avatar: "/ch_echi.png",
    name: "Echi no Takutsu",
    korean: "\uC5D0\uCE58\uB178 \uB2E4\uCFE0\uC4F0",
    kingdom: "yamato",
    died: 663,
    tagline: "Died at the White River shouting Kudara\u2019s name.",
    quote: "Loyalty does not ask whose map you die on.",
    voice: "Plain-spoken and unbending; says exactly what he means in few calm words, never jokes, reads tide and ground before men, and his sincerity embarrasses the cynics around him. Korean: steady \uD558\uC624\uCCB4; Japanese subtitle layer.",
    events: [{ year: 663, label: "Falls at Baekgang crying \u201CLong live Kudara!\u201D" }],
    aliases: ["Echi no Takutsu", "Takutsu"]
  },
  {
    id: "abe",
    gender: "m",
    avatar: "/ch_abe.png",
    name: "Abe no Hirafu",
    korean: "\uC544\uBCA0\uB178 \uD788\uB77C\uBD80",
    hanja: "\u963F\u500D\u6BD4\u7F85\u592B",
    kingdom: "yamato",
    tagline: "Yamato\u2019s admiral of the cold north, sent west as rear general for Baekje.",
    quote: "I have sailed the cold sea. The western one is only warmer.",
    voice: "Loud, physical, laughs into the wind; a sailor who measures everything against the cold northern sea and thinks courage is mostly a matter of going first. Short shouted sentences on deck, blunt jokes at the table, no patience for weather signs. Korean: rough \uD558\uC624\uCCB4 to a king, plain \uBC18\uB9D0 shouted at his own crews.",
    events: [
      { year: 658, label: "Sails north with a hundred and eighty ships against the Emishi." },
      { year: 660, label: "Fights the Mishihase on the northern coast." },
      { year: 661, label: "Named rear general of the fleet raised to restore Baekje." },
      { year: 664, label: "Holds Tsukushi against a western counterstroke that never comes." }
    ],
    career: [
      { title: "Governor of Koshi", korean: "\uACE0\uC2DC \uAD6D\uC218", hanja: "\u8D8A\u570B\u5B88", org: "nation-yamato", to: 661 },
      { title: "Rear General", korean: "\uD6C4\uC7A5\uAD70", hanja: "\u5F8C\u5C07\u8ECD", org: "nation-yamato", from: 661, to: 663 },
      { title: "Governor of Tsukushi", korean: "\uC4F0\uCFE0\uC2DC \uB300\uC7AC", hanja: "\u7B51\u7D2B\u5927\u5BB0\u5E25", org: "nation-yamato", from: 664 }
    ],
    aliases: ["Abe no Hirafu", "Hirafu", "Abe"]
  },
  {
    id: "gungye",
    gender: "m",
    avatar: "/ch_gung_ye.png",
    name: "Gung Ye",
    korean: "\uAD81\uC608",
    hanja: "\u5F13\u88D4",
    kingdom: "goguryeo",
    born: 869,
    died: 918,
    tagline: "One-eyed monk-king \u2014 founded Taebong from Goguryeo\u2019s ashes.",
    quote: "The mandate does not ask if you can see.",
    nature: "Warrior-monk charisma with a dragon sash and a gold patch: prophecy as policy, violence as liturgy. Terrifying calm.",
    arc: "Post-Samhan coda: a monk with one eye and a staff who names himself Son of Heaven, builds Taebong on Goguryeo nostalgia, and dies when the disciples he made decide they prefer a cleaner king. The chronicle visits him only as proof that the peninsula keeps inventing crowns after the maps say the work is finished.",
    events: [
      { year: 901, label: "Founds Taebong (Later Goguryeo) at Songak." },
      { year: 918, label: "Overthrown and killed by his generals." }
    ],
    career: [
      { title: "King of Taebong", korean: "\uD0DC\uBD09\uC655", hanja: "\u6CF0\u5C01\u738B", from: 901, to: 918 }
    ],
    aliases: ["Gung Ye", "Gungye", "\uAD81\uC608", "\u5F13\u88D4"]
  },
  {
    id: "yesikjin",
    gender: "m",
    name: "Ye Sikjin",
    korean: "\uC608\uC2DD\uC9C4",
    hanja: "\u79B0\u5BD4\u9032",
    kingdom: "baekje",
    born: 615,
    died: 672,
    tagline: "The guardian of Bear Fortress who handed his king to the Tang.",
    quote: "Serving is not the same as believing.",
    voice: "A provincial lord: literal, polite, careful with numbers and seats. He agrees with everyone in the room and commits to nothing aloud; what he decides, he does without announcing it. Korean: courteous \uD558\uC2ED\uC2DC\uC624\uCCB4 upward, short \uD558\uAC8C\uCCB4 to his own men.",
    arc: "His tomb epitaph, dug up in Luoyang in 2006, confirmed what the histories implied: the man sheltering Euija at Ungjin surrendered him. He died a Tang general.",
    events: [{ year: 660, label: "Surrenders Euija at Bear Fortress." }],
    aliases: ["Ye Sikjin"]
  },
  {
    id: "yegun",
    gender: "m",
    name: "Ye Gun",
    korean: "\uC608\uAD70",
    hanja: "\u79B0\u8ECD",
    kingdom: "baekje",
    born: 613,
    died: 678,
    tagline: "Ye Sikjin\u2019s elder brother, who went out to look at the weather and came back dry.",
    quote: "Depends on the room.",
    voice: "The family\u2019s smooth talker. Reports what powerful men said as if it were weather, asks short questions, never says what he wants. Korean: easy \uBC18\uB9D0 to his younger brother, polished \uD558\uC2ED\uC2DC\uC624\uCCB4 to rank.",
    arc: "The elder Ye brother. He carries the Tang question into Bear Fortress and his brother answers it. Afterwards the Tang send him back east as their envoy, to Wa and to Silla, wearing their silk. His epitaph says he saw the moment.",
    events: [{ year: 660, label: "Walks into the king\u2019s room at Bear Fortress with his brother." }],
    aliases: ["Ye Gun"]
  },
  {
    id: "munsa",
    gender: "m",
    name: "Buyeo Munsa",
    korean: "\uBD80\uC5EC\uBB38\uC0AC",
    hanja: "\u6276\u9918\u6587\u601D",
    kingdom: "baekje",
    clan: "clan-buyeo",
    title: "Son of Crown Prince Yung",
    tagline: "Looked at the size of the Tang camp and climbed down the wall on a rope.",
    quote: "A king who runs leaves an uncle behind.",
    arc: "Yung\u2019s son, left in Sabi when Euija runs for Bear Fortress. When his uncle Tae declares himself king the next morning, Munsa does the arithmetic: a king who runs leaves behind an uncle who will kill whoever opened the gate. He climbs down the wall on a rope with his household, and half the city follows him down it. He fights for no one afterwards.",
    events: [{ year: 660, label: "Climbs down the wall of Sabi and goes over to the Tang." }],
    aliases: ["Munsa", "Buyeo Munsa"]
  },
  {
    id: "yumjong",
    gender: "m",
    avatar: "/ch_yumjong.png",
    name: "Yumjong",
    korean: "\uC5FC\uC885",
    hanja: "\u67D3\u5B97",
    kingdom: "silla",
    died: 647,
    tagline: "Bidam\u2019s fellow conspirator at the Fortress of Radiance \u2014 the quieter name on the banner.",
    quote: "Rebellion needs two names. Be the quieter one.",
    events: [{ year: 647, label: "Rises with Bidam at Radiance; falls in the outer works on the ninth day." }],
    aliases: ["Yumjong", "Yeomjong"]
  },
  {
    id: "gusesa",
    gender: "m",
    avatar: "/ch_commander_1.png",
    name: "Yeon Gusesa",
    korean: "\uC5F0\uAD6C\uC138\uC0AC",
    title: "High Commander (\uB9C9\uB9AC\uC9C0) of Goguryeo",
    kingdom: "goguryeo",
    tribe: "central",
    died: 642,
    tagline: "Stone Haetae of Goryeo \u2014 High Commander (\uB9C9\uB9AC\uC9C0), Gesomun\u2019s elder kinsman, first to name him traitor.",
    clan: "clan-yeon",
    ideology: "Old-guard Baekje nationalist",
    ideologyNote: "Generation that still hears Geunchogo\u2019s hurricane as destiny, not metaphor.",
    quote: "A Yeon name is already a warning.",
    nature: "Chairs the Summit like a feast: soft voice, hard arithmetic \u2014 the \uB9C9\uB9AC\uC9C0 as first sword, sitting the Central seat. Tells his nephew to sit down \u2014 and is the first mouth to set the word traitor on Yeon\u2019s name. Treats alarms as youthful noise until the noise becomes a massacre.",
    blade: "High Commander Blade (\uB9C9\uB9AC\uC9C0\uAC80) \u2014 haetae carved beneath the crow stamp; the Summit\u2019s first chair, not a fifth crow.",
    swordImage: "/sword_crow.png",
    events: [{ year: 642, label: "Killed at Yeon\u2019s banquet; High Commander Blade taken." }],
    sobriquets: ["Stone Haetae of Goryeo"],
    career: [
      { title: "High Commander", korean: "\uB9C9\uB9AC\uC9C0", hanja: "\u83AB\u96E2\u652F", org: "highsummit", to: 642, note: "Sits the horse ka\u2019s central \uBD80 as first sword" }
    ],
    aliases: [
      "Yeon Gusesa",
      "Gusesa",
      "High Commander",
      "\uB9C9\uB9AC\uC9C0",
      "Central Commander",
      "Stone Haetae of Goryeo"
    ]
  },
  {
    id: "yeontaejo",
    gender: "m",
    avatar: "/ch_yeon_taejo.png",
    name: "Yeon Taejo",
    korean: "\uC5F0\uD0DC\uC870",
    hanja: "\u6DF5\u592A\u795A",
    title: "High Commander (\uB9C9\uB9AC\uC9C0), then Eastern Commander (\uB300\uAC00)",
    kingdom: "goguryeo",
    born: 562,
    bornApprox: true,
    died: 642,
    clan: "clan-yeon",
    tagline: "The old crow of the east, who read the Nangbi report three times because nobody else in Pyongyang read it once.",
    quote: "Say half of what you think.",
    voice: "An old general who has outlived his patience with committees. Slow, plain and dry; short commands, then one long tired sentence when something matters. He never raises his voice to his son, and he is the only person Gesomun lets interrupt him. Korean: \uBC18\uB9D0 to his son, unhurried and low.",
    arc: "Gesomun\u2019s father. He fought the Sui at the Great River and came home with a banner under his arm, then held the High Command in Pyongyang for twelve years while the Summit argued about granaries. His son grew up in the big house below the palace hill, watching him come home from the chamber in silence. When the Nangbi report reaches the capital in 629 he is the only man who reads it as a warning, and the first time Gesomun sees him afraid of anything is over a banner captain named Kim Yushin. He hands the chair to his brother Gusesa and goes home to the Eastern Command, too old by 634 to ride to the Summit, so the son goes in his place with his seal. He dies in the spring of 642. The feast that celebrates his son becoming Eastern Commander is the one nobody leaves.",
    events: [
      { year: 612, label: "Fights the Sui at the Great River." },
      { year: 629, label: "As High Commander, warns his son about Kim Yushin after Nangbi." },
      { year: 634, label: "Too old to ride to the Summit; sends Gesomun with his seal." },
      { year: 642, label: "Dies in the east; the Summit confirms his son as Eastern Commander." }
    ],
    career: [
      { title: "High Commander", korean: "\uB9C9\uB9AC\uC9C0", hanja: "\u83AB\u96E2\u652F", org: "highsummit", from: 619, to: 631 },
      { title: "Eastern Commander", korean: "\uB300\uAC00", hanja: "\u5927\u52A0", org: "highsummit", from: 631, to: 642 }
    ],
    aliases: ["Yeon Taejo", "Taejo"]
  },
  {
    id: "leegaesa",
    gender: "m",
    name: "Lee Gaesa",
    korean: "\uC774\uAC00\uC0AC",
    kingdom: "goguryeo",
    died: 642,
    tagline: "The Summit\u2019s mouth the day the word traitor was first set on Yeon\u2019s name; he dies at the banquet with it in his mouth.",
    events: [{ year: 642, label: "Dies at Yeon\u2019s banquet \u2014 \u201CTraitor\u2026!\u201D" }],
    aliases: ["Lee Gaesa", "\uC774\uAC00\uC0AC"]
  },
  {
    id: "northcmd",
    gender: "m",
    avatar: "/ch_commander_2.png",
    name: "Go Ul",
    korean: "\uACE0\uC6B8",
    title: "Northern Commander",
    kingdom: "goguryeo",
    tribe: "north",
    died: 642,
    tagline: "Wants horses for the Mohe frost \u2014 not poems about Samhan.",
    ideology: "Regional military hardliner",
    ideologyNote: "March command as ideology \u2014 the frontier\u2019s veto on capital softness.",
    quote: "Stop counting remounts. Start counting winters.",
    nature: "Blunt frontier arithmetic. Sexually confident in the soldier\u2019s way \u2014 present, not performative \u2014 and allergic to southern romance when his villages are burning.",
    blade: "Northern Crow Blade (\uBD81\uBC29 \uC624\uB3C4) \u2014 Mohe-frost nicks in the edge.",
    swordImage: "/sword_crow.png",
    events: [{ year: 642, label: "Killed at Yeon\u2019s banquet; Northern Crow Blade taken." }],
    career: [
      { title: "Northern Commander", korean: "\uB300\uAC00", hanja: "\u5927\u52A0", org: "highsummit", to: 642, note: "Dog ka\u2019s northern \uBD80" }
    ],
    aliases: ["Go Ul", "Northern Commander", "the Northern Commander", "\uACE0\uC6B8"]
  },
  {
    id: "southcmd",
    gender: "m",
    avatar: "/ch_commander_3.png",
    name: "Son Daeha",
    korean: "\uC190\uB300\uD558",
    title: "Southern Commander",
    kingdom: "goguryeo",
    tribe: "south",
    died: 642,
    tagline: "Wants the next levy for Yushin\u2019s passes \u2014 or stop talking Samhan.",
    ideology: "Regional military pragmatist",
    ideologyNote: "Southern command calculus \u2014 hold, trade, survive.",
    quote: "Send the levy \u2014 or stop naming Samhan.",
    nature: "Competitive, sharp-tongued, sure of his own front. Treats Eastern tribal fighting as easy work and never forgives a room that starves his border for a slogan.",
    blade: "Southern Crow Blade (\uB0A8\uBC29 \uC624\uB3C4) \u2014 grip worn smooth against Yushin\u2019s passes.",
    swordImage: "/sword_crow.png",
    events: [{ year: 642, label: "Killed at Yeon\u2019s banquet; Southern Crow Blade taken." }],
    career: [
      { title: "Southern Commander", korean: "\uB300\uAC00", hanja: "\u5927\u52A0", org: "highsummit", to: 642, note: "Pig ka\u2019s southern \uBD80" }
    ],
    aliases: ["Son Daeha", "Southern Commander", "the Southern Commander", "\uC190\uB300\uD558"]
  },
  {
    id: "westcmd",
    gender: "m",
    avatar: "/ch_commander_4.png",
    name: "Go Heumsong",
    korean: "\uACE0\uD760\uC1A1",
    title: "Western Commander",
    kingdom: "goguryeo",
    tribe: "west",
    died: 642,
    tagline: "Wants timber for the Liao \u2014 not a southern adventure.",
    ideology: "Regional military balancer",
    ideologyNote: "Western march as hinge between tribute and defiance.",
    quote: "Strip the west, and you gift the Tang a road.",
    nature: "Cautious about the Second Emperor without sharing Yeon\u2019s urgency. Wants resources, not prophecies \u2014 and will not strip the Liao for a king\u2019s peninsula dream.",
    voice: "Cautious and material: timber, iron and roads, not prophecies. Korean: \uD558\uC624\uCCB4.",
    blade: "Western Crow Blade (\uC11C\uBC29 \uC624\uB3C4) \u2014 Liao timber-oil in the scabbard.",
    swordImage: "/sword_crow.png",
    events: [{ year: 642, label: "Killed at Yeon\u2019s banquet; Western Crow Blade taken." }],
    career: [
      { title: "Western Commander", korean: "\uB300\uAC00", hanja: "\u5927\u52A0", org: "highsummit", to: 642, note: "Cow ka\u2019s western \uBD80" }
    ],
    aliases: ["Go Heumsong", "Western Commander", "the Western Commander", "\uACE0\uD760\uC1A1"]
  },
  {
    id: "dosuryu",
    gender: "m",
    avatar: "/ch_dosuryu.png",
    name: "Dosuryu",
    korean: "\uB3C4\uC218\uB958",
    kingdom: "goguryeo",
    title: "Chancellor (\uB300\uB300\uB85C) under the Supreme Commander",
    clan: "clan-yeon",
    tagline: "Old Yeon friend \u2014 Chancellor after the massacre; issues the minutes the swords already wrote.",
    ideology: "Hardline Yeon lieutenant",
    ideologyNote: "Coups and grudges as executable policy \u2014 then proceduralised.",
    quote: "Retrospective minutes. The best kind. They agree with what has already happened.",
    arc: "Survives by being useful and honest in a language Yeon still understands. After the massacre he is seated as Chancellor (\uB300\uB300\uB85C) beside the new Supreme Commander (\uB300\uB9C9\uB9AC\uC9C0) \u2014 the smile that explains the sword was inevitable. When Yeon stops listening, the title remains and the friendship does not.",
    nature: "An old friend of the Yeon house from before Gesomun\u2019s fame. Yes-Minister talent in a red court: force first, stationery after. The High Summit may still \u201Cconsult\u201D; his minutes will show it already agreed.",
    voice: "The old family friend: familiar, scolding, teasing; he has held Gesomun by the scruff since boyhood and talks like it. Korean: \uBC18\uB9D0 to Gesomun, \uD558\uC624\uCCB4 when he is formal on purpose.",
    career: [
      { title: "Chancellor", korean: "\uB300\uB300\uB85C", hanja: "\u5927\u5C0D\u76E7", org: "highsummit", from: 642 }
    ],
    aliases: ["Dosuryu", "Chancellor", "\uB300\uB300\uB85C", "Grand Herald"]
  },
  {
    id: "jungto",
    name: "Yeon Jungto",
    korean: "\uC5F0\uC815\uD1A0",
    hanja: "\u6DF5\u6DE8\u571F",
    avatar: "/ch_yeon_jungto.png",
    kingdom: "goguryeo",
    clan: "clan-yeon",
    gender: "m",
    tagline: "Gesomun\u2019s brother \u2014 raised Yeon Namgun and Yeon Namsan softer than the heir could afford.",
    quote: "Keep the seal warm for the house.",
    nature: "Uncle-politics: warmth with an exit. Loves the younger nephews enough to spoil them; loves survival enough to take twelve cities to Silla.",
    arc: "While Gesomun drills Yeon Namseng as a second self, Jungto and his sister Sooyoung raise Yeon Namgun and Yeon Namsan in a hall where supper is allowed to be supper. After Yeon\u2019s death that gentler house becomes a rumour the messengers can poison. In 666 he surrenders his southern territory to Silla \u2014 the uncle who taught softness choosing a soft landing.",
    events: [
      { label: "Raises Yeon Namgun and Yeon Namsan with his sister Sooyoung while Gesomun keeps Namseng." },
      { year: 666, label: "Surrenders his southern territory to Silla." }
    ],
    family: [
      { id: "gesomun", role: "Brother" },
      { id: "sooyoung", role: "Sister" }
    ],
    aliases: ["Yeon Jungto", "Jungto"]
  },
  {
    id: "sooyoung",
    name: "Yeon Sooyoung",
    korean: "\uC5F0\uC218\uC601",
    avatar: "/ch_yeon_sooyoung.png",
    kingdom: "goguryeo",
    gender: "f",
    clan: "clan-yeon",
    tagline: "Gesomun and Jungto\u2019s sister \u2014 the aunt who fed Yeon Namgun and Yeon Namsan when Gesomun only fed the heir rules.",
    quote: "A boy can learn a blade after supper. He cannot unlearn hunger.",
    nature: "Practical tenderness. Corrects posture less than Gesomun; corrects cruelty more.",
    arc: "Sister to Gesomun and Jungto \u2014 a Yeon by blood, third of the three siblings. With her brother Jungto she raises the two younger Yeon sons \u2014 Yeon Namgun and Yeon Namsan \u2014 while Namseng stays under Gesomun\u2019s strict roof. The split households look like logistics until messengers arrive with opposite death-wishes \u2014 then it looks like destiny with a return address nobody writes down.",
    binyeo: "Warm copper pin \u2014 aunt-metal, not banner gold.",
    events: [{ label: "Raises Yeon Namgun and Yeon Namsan beside Jungto\u2019s southern hall." }],
    family: [
      { id: "gesomun", role: "Brother" },
      { id: "jungto", role: "Brother" },
      { id: "namgun", role: "Ward" },
      { id: "namsan", role: "Ward" }
    ],
    aliases: ["Yeon Sooyoung", "Lady Sooyoung", "Sooyoung", "Suyoung", "\uC218\uC601", "\uC5F0\uC218\uC601"]
  },
  {
    id: "shinsung",
    gender: "m",
    avatar: "/ch_shinsung.png",
    name: "Shinsung",
    korean: "\uC2E0\uC131",
    kingdom: "goguryeo",
    tagline: "Buddhist aristocracy\u2019s quiet knife \u2014 the monk who opened Pyongyang from within.",
    quote: "A gate opens from the inside.",
    voice: "A quiet abbot with a very long memory. Courteous, almost gentle, never threatens; he answers questions with small facts about the past (a bell set on the floor, how many years ago) and lets the listener do the arithmetic. Korean: soft, formal \uD558\uC2ED\uC2DC\uC624\uCCB4.",
    arc: "Yeon tried to import Tang Taoism partly to starve the monk houses of prestige. The houses waited. When the brothers tore the kingdom, Shinsung opened what no army had opened \u2014 and proved Yeon\u2019s fear had been aimed at the right profession.",
    events: [
      { label: "Watches Yeon\u2019s Taoist experiment cool the temple halls." },
      { year: 668, label: "Lets the Tang army into the fortress." }
    ],
    aliases: ["Shinsung"]
  },
  {
    id: "yuridora",
    gender: "m",
    avatar: "/ch_yuri_dora.png",
    name: "Yuri Dora",
    korean: "\uC720\uB9AC\uB3C4\uB77C",
    kingdom: "tamla",
    tagline: "King of the orange island \u2014 first to name the Three Realms (\uC0BC\uACC4) for Gyebek.",
    quote: "Tell the story until the mainland listens.",
    voice: "The island storyteller: unhurried and wry, starts at the beginning and will not be rushed, and pokes at Gyebek\u2019s silence. Korean: oral-tale \uBC18\uB9D0 (\uB9D0\uD558\uB9C8, -\uC9C0).",
    arc: "Collector of stories and castaways. When Gyebek washes up, Yuri Dora feeds him Tamla\u2019s myths in order \u2014 Heaven\u2013Earth King first \u2014 and is the mouth that first frames the Three Realms (\uC0BC\uACC4) under Hwanin\u2019s heaven as the larger map under which Samhan\u2019s Great War looks small. History remains the chronicle\u2019s spine; mythology arrives mostly through his island.",
    career: [
      { title: "King of Tamla", korean: "\uC655", hanja: "\u738B", org: "nation-tamla" }
    ],
    aliases: ["Yuri Dora"]
  },
  {
    id: "jinpyung",
    gender: "m",
    name: "King Jinpyung",
    korean: "\uC9C4\uD3C9\uC655",
    hanja: "\u771E\u5E73\u738B",
    kingdom: "silla",
    born: 567,
    died: 632,
    clan: "clan-gyeongju-kim",
    boneRank: "Sacred Bone (\uC131\uACE8)",
    tagline: "Fifty-three years on the throne \u2014 and only daughters when the ledger closed.",
    quote: "A kingdom is a ledger. Keep it balanced.",
    arc: "Longest reign in Silla\u2019s annals. Kept the peninsula quiet while bone rank hardened into law; when he died without a son, the Harmony Council had to invent a queen rather than admit the covenant was broken.",
    events: [
      { year: 579, label: "Ascends the throne at twelve." },
      { year: 632, label: "Dies after fifty-three years; Sunduk succeeds." }
    ],
    career: [
      { title: "King", korean: "\uC9C4\uD3C9\uC655", hanja: "\u771E\u5E73\u738B", org: "sillaroyal", from: 579, to: 632 }
    ],
    family: [
      { id: "sunduk", role: "Daughter" },
      { id: "jinduk", role: "Granddaughter" },
      { id: "chunmyung", role: "Daughter" },
      { id: "sunhwa", role: "Daughter" }
    ],
    aliases: ["King Jinpyung", "Jinpyung", "King Jinpyeong", "Jinpyeong", "\u771E\u5E73\u738B"]
  },
  {
    id: "chunmyung",
    avatar: "/ch_chunmyung.png",
    name: "Princess Chunmyung",
    korean: "\uCC9C\uBA85\uACF5\uC8FC",
    kingdom: "silla",
    gender: "f",
    born: 580,
    bornApprox: true,
    clan: "clan-gyeongju-kim",
    boneRank: "Sacred Bone (\uC131\uACE8)",
    tagline: "Gave up her claim, and gave Silla its greatest king instead.",
    quote: "A throne traded is still a choice.",
    nature: "Intelligent and ageing. She reads her son faster than the court does, let his father teach him to count, and has never once been impressed that he got cleverer than her. The crown she gave up is not a subject.",
    voice: "Dry, unhurried, a mother who does not ask how you are. Short questions, an old woman\u2019s patience, one plain order at the end (\u201CPut your head down.\u201D). Korean: \uBC18\uB9D0 to Chunchu, \uD558\uAC8C\uCCB4 to the court.",
    binyeo: "Gold amethyst binyeo \u2014 purple orb in filigree, violet at the tip; kept in its box, claim and all.",
    binyeoImage: "/bn_chunmyung.png",
    events: [
      { year: 603, label: "Mother of Kim Chunchu." },
      { year: 642, label: "The night Daeya falls, tells her son to stop counting." }
    ],
    family: [
      { id: "jinpyung", role: "Father" },
      { id: "yongsu", role: "Husband" },
      { id: "chunchu", role: "Son" }
    ],
    aliases: ["Princess Chunmyung", "Chunmyung"]
  },
  {
    id: "sunhwa",
    name: "Princess Sunhwa",
    korean: "\uC120\uD654\uACF5\uC8FC",
    hanja: "\u5584\u82B1\u516C\u4E3B",
    kingdom: "silla",
    gender: "f",
    born: 580,
    bornApprox: true,
    clan: "clan-gyeongju-kim",
    clans: ["clan-buyeo"],
    clanBy: { "clan-buyeo": "marriage" },
    boneRank: "Sacred Bone (\uC131\uACE8)",
    tagline: "Married into Baekje \u2014 the legend Seodong sang into being.",
    quote: "A princess can still be a rumor.",
    arc: "Daughter of Jinpyung; the Samguk yusa remembers her as the princess Seodong\u2019s song fetched across the river \u2014 whether history or theatre, Baekje\u2019s court still acts as if the marriage bought a decade of peace.",
    events: [
      { year: 600, label: "Legend: Seodong\u2019s song reaches her at the well." },
      { year: 602, label: "Marries King Mu of Baekje in the chronicle\u2019s telling." }
    ],
    family: [{ id: "jinpyung", role: "Father" }],
    aliases: ["Princess Sunhwa", "Princess Seonhwa", "Sunhwa", "Seonhwa", "\u5584\u82B1\u516C\u4E3B"]
  },
  {
    id: "kingsung",
    gender: "m",
    name: "King Seong",
    korean: "\uC131\uC655",
    hanja: "\u8056\u738B",
    kingdom: "baekje",
    born: 504,
    died: 554,
    clan: "clan-buyeo",
    tagline: "The sage king of Sabi, killed by a slave\u2019s hand at Gwansanseong.",
    quote: "It went into the marrow. Every time I thought of it.",
    arc: "Moved the capital to Sabi and rebuilt Baekje\u2019s golden age; retook the Han valley with Silla, and lost it to Silla\u2019s betrayal within a year. Riding at night to his son\u2019s relief, he was caught by Kim Muryeok\u2019s troops, and a stable-slave named Dodo took his head.",
    events: [
      { year: 538, label: "Moves the capital to Sabi." },
      { year: 553, label: "Betrayed by Jinheung over the Han valley." },
      { year: 554, label: "Killed at Gwansanseong." }
    ],
    career: [
      { title: "King", korean: "\uC131\uC655", hanja: "\u8056\u738B", org: "nation-baekje", from: 523 }
    ],
    aliases: ["King Seong", "King Sung"]
  },
  {
    id: "dodo",
    gender: "m",
    avatar: "/ch_dodo.png",
    name: "Dodo",
    korean: "\uB3C4\uB3C4",
    kingdom: "silla",
    tagline: "The slave who beheaded a king, as the rank system watched.",
    quote: "Be the name the record almost forgot \u2014 and remain.",
    events: [{ year: 554, label: "Kills King Seong at Gwansanseong." }],
    aliases: ["Dodo"]
  },
  {
    id: "jumong",
    gender: "m",
    avatar: "/ch_jumong.png",
    objectImage: "/obj_jumong_bow.png",
    object: "Crow-bow and quiver \u2014 dark-grain recurve with a red-wrapped grip and trailing red tip-ribbons; tan quiver wrapped in red cloud-pattern, dark-red leather caps, red cord knot. The bow Tabal\u2019s hall cannot bend; the same shape later finds a fly\u2019s wing.",
    name: "Jumong",
    korean: "\uC8FC\uBABD",
    hanja: "\u6731\u8499",
    entity: "god",
    godTier: "demigod",
    kingdom: "goguryeo",
    born: -58,
    died: -19,
    clan: "clan-go",
    title: "Demigod founder of Goryeo",
    realm: { en: "Jolbon founding", ko: "\uC878\uBCF8" },
    tagline: "Demigod \u2014 the archer who crossed the river on fish and turtles.",
    ideology: "Founding unifier",
    ideologyNote: "Mythic state-builder \u2014 loyalty forged by exile, bow, and a kingdom that did not exist yet.",
    quote: "From the first look \u2014 only you.",
    nature: "Exile who becomes a maker; Haemosu\u2019s son, and it shows \u2014 Jolbon women notice; Sosuno notices them noticing. Fun-loving and laid-back. Tabal puts him on Sosuno\u2019s ledger as a worker; he grins at the ditch while she is stern. He grins when she is mean, answers to big idiot, calls her pretty or sexy like it is weather. After she slips (other bitches) he teases \u2014 how long, am I your type \u2014 then points at the blush and walks. He will not take the confession back for her; he makes her say what she wants done. Grain room he is the one who has done this; he does not mock the shaking, then he is not nice. Kindness after she hears herself makes her worse. Only turns serious for the bow.",
    voice: "Easy and laid-back, a grin in every line until he is scared, and then a little stupid. Short casual sentences, jokes at his own expense, \u201Cokay, okay\u201D; he wins arguments by refusing to take them seriously. Korean: \uBC18\uB9D0 with Sosuno and the boys, \uD574\uC694\uCCB4 with strangers, careful \uD558\uC624\uCCB4 to the chief.",
    arc: "Born of a sunbeam and a river god\u2019s daughter, hatched from an egg, hunted by his brothers \u2014 demigod enough that the chronicle keeps him among the Gods. He fled south from Daeso\u2019s riders with Oi, Mari, and Hyupbo; they split in the pines, and he crossed the river alone on fish and turtles \u2014 the three do not arrive with him at Tabal\u2019s hall. At Jolbon he ends the five tribes\u2019 ditch-wars, marries Sosuno, and they vote him first king. After the cord he learns Oi, Mari, and Hyupbo reached Song Yang\u2019s Pine Kingdom (\uC18C\uB098\uBB34 \uB098\uB77C) and annexes that roof as king, queen on the rail, to get them back. He prays at the Jumong Cavern (\uAD6D\uB3D9\uB300\uD608); dawn breaks and Haemosu unveils the work: build a world of your own. His descendants will make Goryeo the largest kingdom in Samhan. History begins where the egg cracks; mythology only explains the crack.",
    blade: "Ring-pommel crow bow-knife \u2014 three-legged crow scratched into the pommel by a river wife\u2019s hand.",
    events: [
      { year: -37, label: "Crosses the river on turtles; founds Goryeo at Jolbon; takes \uC18C\uB098\uBB34 \uB098\uB77C to recover Oi, Mari, and Hyupbo." },
      { year: -19, label: "Dies; his son Yuri succeeds him." }
    ],
    career: [
      { title: "Voted king of the five tribes", korean: "\uC655", hanja: "\u738B", org: "fivetribes", from: -37 },
      { title: "King of Goryeo", korean: "\uC655", hanja: "\u738B", org: "nation-goguryeo", from: -37 }
    ],
    family: [
      { id: "haemosu", role: "Father" },
      { id: "yuhwa", role: "Mother" },
      { id: "geumwa", role: "Foster father" },
      { id: "daeso", role: "Stepbrother" },
      { id: "galsa", role: "Stepbrother" },
      { id: "ladyye", role: "Wife" },
      { id: "yuri", role: "Son" },
      { id: "sosuno", role: "Wife" }
    ],
    stages: [
      {
        id: "exile",
        lookOnly: true,
        title: "Exile from Buyeo",
        label: "In exile"
      },
      {
        id: "king",
        lookOnly: true,
        name: "King Dongmyung",
        korean: "\uB3D9\uBA85\uC131\uC655",
        hanja: "\u6771\u660E\u8056\u738B",
        title: "First King of Goryeo",
        label: "As King Dongmyung",
        avatar: "/ch_dongmyung.png"
      }
    ],
    aliases: ["Jumong", "Dongmyung", "Dongmyeong", "King Dongmyung", "Bright of the East", "\uB3D9\uBA85\uC655", "\uB3D9\uBA85\uC131\uC655", "\uC8FC\uBABD"]
  },
  {
    id: "onjo",
    gender: "m",
    avatar: "/ch_onjo.png",
    name: "Onjo",
    korean: "\uC628\uC870",
    hanja: "\u6EAB\u795A",
    kingdom: "baekje",
    died: 28,
    clan: "clan-buyeo",
    tagline: "Jumong\u2019s son who went south and named a kingdom for a hundred crossings.",
    quote: "South is also a beginning.",
    nature: "Counts sacks. Jokes that die. Notices the furniture first. When he names a country he names it bigger than the hurt, then asks how it sounds.",
    voice: "Practical and a little deadpan; his jokes land flat. He notices the furniture first, thinks big when it counts, then asks how it sounds (\u201CBaekje \u2014 how does that sound?\u201D). Korean: \uBC18\uB9D0 to his family.",
    events: [{ year: -18, label: "Founds Baekje at Wiryeseong." }],
    career: [
      { title: "King", korean: "\uC655", hanja: "\u738B", org: "nation-baekje", from: -18 }
    ],
    aliases: ["Onjo"]
  },
  {
    id: "biryu",
    gender: "m",
    avatar: "/ch_biryu.png",
    name: "Biryu",
    korean: "\uBE44\uB958",
    kingdom: "baekje",
    clan: "clan-buyeo",
    tagline: "Chose the salt marshes of Michuhol, and regretted it.",
    quote: "Wrong shores still make kingdoms.",
    nature: "Packs first. Hates speeches. If someone cries he leaves faster. Salt later.",
    aliases: ["Biryu"]
  },
  {
    id: "alpyung",
    gender: "m",
    name: "Alpyung",
    korean: "\uC54C\uD3C9",
    hanja: "\u95BC\u5E73",
    kingdom: "silla",
    clan: "clan-surabol-lee",
    title: "Chief of Alcheon Yangsan-chon \xB7 Geupnyang-bu",
    tagline: "First of the six \u2014 the Lee of Alcheon who found the egg at Najeong.",
    quote: "Dig where the horse kneels. The country begins in the hole.",
    nature: "Village chief of Alcheon Yangsan-chon (\uC54C\uCC9C \uC591\uC0B0\uCD0C), head of Geupnyang-bu (\uAE09\uB7C9\uBD80). When the white horse bowed and cried at Najeong well in Yangsan, Alpyung was the one who ordered the earth opened \u2014 and the great egg lifted out. Surabol Lee (\uC11C\uB77C\uBC8C \uC774\uC528) begins here; modern registers call the house Gyeongju Lee (\uACBD\uC8FC \uC774\uC528).",
    arc: "One of the Founding Six Elders who raised the egg-born boy and installed him as king. His village and department survive in the bone-rank census two thousand years later \u2014 every True Bone noble who counts Lee blood still owes a fraction of their untouchable pride to the man who dug first.",
    events: [{ year: -57, label: "With the five other chiefs, crowns Hyukgos\xE9 at Seorabeol." }],
    career: [
      { title: "Village chief", korean: "\uCD0C\uC7A5", hanja: "\u6751\u9577", org: "foundingsix", from: -57, note: "Alcheon Yangsan-chon \xB7 Geupnyang-bu" }
    ],
    aliases: ["Lee Alpyung", "Alpyung", "\uC54C\uD3C9", "\u95BC\u5E73"]
  },
  {
    id: "sobuldori",
    gender: "m",
    name: "Sobuldori",
    korean: "\uC18C\uBC8C\uB3C4\uB9AC",
    hanja: "\u8607\u4F10\u90FD\u5229",
    kingdom: "silla",
    clan: "clan-surabol-choi",
    title: "Chief of Dolsan Goheo-chon \xB7 Saryang-bu",
    tagline: "The Choi of Dolsan \u2014 elder whose line still speaks in Surabol\u2019s councils.",
    quote: "A chief serves the boy he raised, not the myth he prefers.",
    nature: "Village chief of Dolsan Goheo-chon (\uB3CC\uC0B0 \uACE0\uD5C8\uCD0C), head of Saryang-bu (\uC0AC\uB7C9\uBD80). Surabol Choi (\uC11C\uB77C\uBC8C \uCD5C\uC528) \u2014 modern Gyeongju Choi (\uACBD\uC8FC \uCD5C\uC528). Alchun of the Hwarang counts him among his ancestors without ever making a speech of it; the chronicle only notes that the tiger-catcher\u2019s courtesy is older than his liberalism.",
    arc: "Founding elder of the Choi line that would become one of the six great houses of Seorabeol. When the six installed Hyukgos\xE9, Sobuldori held the Saryang seat \u2014 horse, tribute, and the kind of practical loyalty that outlasts thrones.",
    events: [{ year: -57, label: "Raises Hyukgos\xE9 with the five other chiefs." }],
    career: [
      { title: "Village chief", korean: "\uCD0C\uC7A5", hanja: "\u6751\u9577", org: "foundingsix", from: -57, note: "Dolsan Goheo-chon \xB7 Saryang-bu" }
    ],
    aliases: ["Choi Sobuldori", "Sobuldori", "\uC18C\uBC8C\uB3C4\uB9AC", "\u8607\u4F10\u90FD\u5229"]
  },
  {
    id: "jibekho",
    gender: "m",
    name: "Jibekho",
    korean: "\uC9C0\uBC31\uD638",
    hanja: "\u652F\u4F2F\u5FFD",
    kingdom: "silla",
    clan: "clan-surabol-jeong",
    title: "Chief of Chuisan Jinji-chon \xB7 Bonpi-bu",
    tagline: "The Jeong of Chuisan \u2014 Bonpi-bu and the census of who counts.",
    quote: "Register the living before you praise the omen.",
    nature: "Village chief of Chuisan Jinji-chon (\uCDE8\uC0B0 \uC9C4\uC9C0\uCD0C), head of Bonpi-bu (\uBCF8\uD53C\uBD80) \u2014 the department that keeps lineage and rank. Surabol Jeong (\uC11C\uB77C\uBC8C \uC815\uC528); modern Gyeongju Jeong (\uACBD\uC8FC \uC815\uC528).",
    arc: "Founding elder whose Bonpi seat would later echo in every bone-rank argument \u2014 who is True Bone, who is head rank, who is not counted at all. He raised the egg-born king knowing the country would need a ledger as much as a crown.",
    events: [{ year: -57, label: "One of six chiefs who crown Hyukgos\xE9." }],
    career: [
      { title: "Village chief", korean: "\uCD0C\uC7A5", hanja: "\u6751\u9577", org: "foundingsix", from: -57, note: "Chuisan Jinji-chon \xB7 Bonpi-bu" }
    ],
    aliases: ["Jung Jibekho", "Jeong Jibekho", "Jibekho", "\uC9C0\uBC31\uD638", "\u652F\u4F2F\u5FFD"]
  },
  {
    id: "gurema",
    gender: "m",
    name: "Gurema",
    korean: "\uAD6C\uB840\uB9C8",
    hanja: "\u4EC7\u79AE\u6469",
    kingdom: "silla",
    clan: "clan-surabol-son",
    title: "Chief of Musan Daesu-chon \xB7 Jeomnyang-bu",
    tagline: "The Son of Musan \u2014 old hall, old horse, old pride.",
    quote: "The oldest houses do not ask to be loved. They ask to be remembered.",
    nature: "Village chief of Musan Daesu-chon (\uBB34\uC0B0 \uB300\uC218\uCD0C), head of Jeomnyang-bu (\uC810\uB7C9\uBD80). Surabol Son (\uC11C\uB77C\uBC8C \uC190\uC528); modern Gyeongju Son (\uACBD\uC8FC \uC190\uC528). The chronicle never states Bidam\u2019s kinship outright \u2014 only implies it in the jaw, the black robe, and the way he treats Surabol as a country that must stay clean and his.",
    arc: "Founding elder of the Son line. Musan\u2019s hall would still be called one of Surabol\u2019s oldest when Bidam and Yushin trade gyuku wins twelve centuries later \u2014 though Bidam\u2019s blood is elder-founder, not Gaya. Gurema\u2019s descendants wear True Bone purple and behave as if the founding covenant were a private inheritance.",
    events: [{ year: -57, label: "Installs Hyukgos\xE9 with the five other village chiefs." }],
    career: [
      { title: "Village chief", korean: "\uCD0C\uC7A5", hanja: "\u6751\u9577", org: "foundingsix", from: -57, note: "Musan Daesu-chon \xB7 Jeomnyang-bu" }
    ],
    aliases: ["Son Gurema", "Gurema", "\uAD6C\uB840\uB9C8", "\u4EC7\u79AE\u6469"]
  },
  {
    id: "jita",
    gender: "m",
    name: "Jita",
    korean: "\uC9C0\uD0C0",
    hanja: "\u652F\u9640",
    kingdom: "silla",
    clan: "clan-surabol-bae",
    title: "Chief of Geumsan Gari-chon \xB7 Hangi-bu",
    tagline: "The Bae of Geumsan \u2014 Hangi-bu and the hill forts.",
    quote: "Gold mountain, iron gate \u2014 hold both.",
    nature: "Village chief of Geumsan Gari-chon (\uAE08\uC0B0 \uAC00\uB9AC\uCD0C), head of Hangi-bu (\uD55C\uAE30\uBD80). Surabol Bae (\uC11C\uB77C\uBC8C \uBC30\uC528); modern Gyeongju Bae (\uACBD\uC8FC \uBC30\uC528).",
    arc: "Founding elder of the Bae house \u2014 one of six who presented the boy from Najeong to the six villages as their king. His Geumsan seat guarded the ridges above the young capital.",
    events: [{ year: -57, label: "Crowns Hyukgos\xE9 with Alpyung, Sobuldori, Jibekho, Gurema, and Hojin." }],
    career: [
      { title: "Village chief", korean: "\uCD0C\uC7A5", hanja: "\u6751\u9577", org: "foundingsix", from: -57, note: "Geumsan Gari-chon \xB7 Hangi-bu" }
    ],
    aliases: ["Bae Jita", "Jita", "\uC9C0\uD0C0", "\u652F\u9640"]
  },
  {
    id: "hojin",
    gender: "m",
    name: "Hojin",
    korean: "\uD638\uC9C4",
    hanja: "\u6236\u73CD",
    kingdom: "silla",
    clan: "clan-surabol-seol",
    title: "Chief of Myeonghwalsan Goya-chon \xB7 Seupbi-bu",
    tagline: "The Seol of Myeonghwalsan \u2014 Seupbi-bu and the rites that bind six to one.",
    quote: "Six hearths, one smoke \u2014 that is a kingdom.",
    nature: "Village chief of Myeonghwalsan Goya-chon (\uBA85\uD65C\uC0B0 \uACE0\uC57C\uCD0C), head of Seupbi-bu (\uC2B5\uBE44\uBD80). Surabol Seol (\uC11C\uB77C\uBC8C \uC124\uC528); modern Gyeongju Seol (\uACBD\uC8FC \uC124\uC528).",
    arc: "Founding elder who kept the rites when the six villages became Seorabeol. Seupbi \u2014 the wet rites, the binding ceremonies \u2014 are his department\u2019s echo in every later coronation the Harmony Council argues over.",
    events: [{ year: -57, label: "One of six chiefs at Hyukgos\xE9\u2019s founding." }],
    career: [
      { title: "Village chief", korean: "\uCD0C\uC7A5", hanja: "\u6751\u9577", org: "foundingsix", from: -57, note: "Myeonghwalsan Goya-chon \xB7 Seupbi-bu" }
    ],
    aliases: ["Seol Hojin", "Hojin", "\uD638\uC9C4", "\u6236\u73CD"]
  },
  {
    id: "hyukgose",
    gender: "m",
    avatar: "/ch_hyukgose.png",
    name: "Hyukgos\xE9",
    korean: "\uBC15\uD601\uAC70\uC138",
    hanja: "\u6734\u8D6B\u5C45\u4E16",
    entity: "god",
    godTier: "demigod",
    kingdom: "silla",
    born: -69,
    died: 4,
    boneRank: "Sacred Bone (\uC131\uACE8)",
    tagline: "Born from the egg at Najeong \u2014 bright light ruling the world, not luck.",
    quote: "One person to cherish, one person to serve \u2014 and the moon over Seorabeol is enough.",
    nature: "Egg-born, not hall-born: the white horse knelt and cried at Najeong well in Yangsan; the Founding Six Elders dug where it stood and lifted a great egg; the shell opened on a beautiful boy already kingly in the face. Named Hyukgos\xE9 \u2014\u8D6B\u5C45\u4E16, to rule with brightness \u2014 he was prodigy before policy: quick to learn, just in judgment, the land answering him as if it had been waiting. Crowned young \u2014 tradition says thirteen \u2014 he is founding king energy, not a passive omen. Sacred Bone by exception: no elder blood, no village chief for a father; the six raised and installed him, and later True Bone nobles would claim the elders\u2019 descent as if founding privilege were a hereditary coat.",
    arc: "The six village chiefs \u2014 Alpyung, Sobuldori, Jibekho, Gurema, Jita, Hojin \u2014 find the egg, raise the boy, and crown him first king of Seorabeol (-57). He governs long beside Alyoung, the dragon-born queen from Alyeongjeong well: two omen-children who recognize each other, desire and destiny in one marriage, co-founders not ornament. Together they teach the country its first grammar \u2014 one to cherish, one to serve \u2014 before law arrives in six ranks and six clans. Their joint reign sets the moon over Surabol as quiet sign; a son Namhae succeeds in the records though the chronicle\u2019s lens jumps forward to later crowns. When Bone Rank hardens, Hyukgos\xE9 and Alyoung remain the sacred exception \u2014 egg and dragon \u2014 while Yushin\u2019s Gaya Kim line enters as the outsider who out-loves the centre.",
    events: [
      { year: -69, label: "Born from the egg at Najeong well, Yangsan." },
      { year: -57, label: "Crowned first ruler of Seorabeol by the Founding Six Elders." },
      { label: "Long joint reign with Lady Alyoung; co-founds early Silla." }
    ],
    career: [
      { title: "King of Seorabeol", korean: "\uAC70\uC11C\uAC04", hanja: "\u5C45\u897F\u5E72", org: "sillaroyal", from: -57 }
    ],
    aliases: ["Hyukgos\xE9", "Hyukgose", "Hyeokgeose", "Park Hyukgose", "\uBC15\uD601\uAC70\uC138"]
  },
  {
    id: "alyoung",
    gender: "f",
    avatar: "/ch_alyoung.png",
    name: "Lady Alyoung",
    korean: "\uC54C\uC601\uBD80\uC778",
    hanja: "\u95BC\u82F1\u592B\u4EBA",
    entity: "god",
    godTier: "demigod",
    kingdom: "silla",
    title: "First queen of Seorabeol",
    boneRank: "Sacred Bone (\uC131\uACE8)",
    tagline: "Born from a Chicken Dragon\u2019s rib at Alyeongjeong \u2014 matched omen, matched will.",
    quote: "Two births for one kingdom \u2014 egg and dragon, not alliance alone.",
    nature: "Dragon-born parallel to the egg: at Alyeongjeong (\uC54C\uC601\uC815) well a Chicken Dragon (\uACC4\uB8E1) left its left rib in the earth, and from it Alyoung rose \u2014 extraordinary birth, not a later political match. As capable as Hyukgos\xE9; co-founder queen who reads omens and rooms with the same speed. Sacred Bone by the same exception as her husband \u2014 well-born, not elder-descended \u2014 and the chronicle never lets her become scenery.",
    arc: "She and Hyukgos\xE9 fall in love as two omen-children who know what the other is \u2014 marriage as desire and destiny, the sacred pair of early Silla. Beside him she co-rules Seorabeol through the long founding years: rites, villages, the six clans learning to answer one crown. The herald will joke that the country started in a kitchen \u2014 one from an egg, one from a chicken \u2014 and miss that both births were throne-sized. With Hyukgos\xE9 she sets the pattern later Sacred Bone queens will exhaust: holiness worn as duty, not decoration.",
    binyeo: "Porcelain egg binyeo \u2014 blue-white glaze on a gold plum branch; the well-born mark beside the egg-born king.",
    binyeoImage: "/bn_alyoung.png",
    events: [
      { label: "Born from a Chicken Dragon at Alyeongjeong well." },
      { label: "Marries Hyukgos\xE9; co-founds Seorabeol through a long joint reign." }
    ],
    career: [
      { title: "Queen of Seorabeol", korean: "\uC655\uD6C4", hanja: "\u738B\u540E", org: "sillaroyal", from: -57 }
    ],
    aliases: ["Lady Alyoung", "Alyoung", "\uC54C\uC601", "Alyeong"]
  },
  {
    id: "dangun",
    avatar: "/ch_dangun.png",
    name: "Dangun",
    korean: "\uB2E8\uAD70",
    hanja: "\u6A80\u541B",
    entity: "god",
    godTier: "demigod",
    gender: "m",
    kingdom: "joseon",
    title: "Grandson of Heaven \xB7 god-king of Asadal",
    realm: { en: "Old Joseon", ko: "\uACE0\uC870\uC120" },
    tagline: "Demigod \u2014 Grandson of Heaven; first earthly steward of the mandate.",
    quote: "Heaven descends. Someone must stay and govern.",
    arc: "Grandson of Heaven: Hwanin opens the sky; Hwanung descends with three seals and three thousand to Sinsi under the sandalwood tree, ministers of wind, rain, and cloud at his side. The Bear-Woman outlasts the tiger; their son Wanggeom \u2014 king who governs, not bone rank \u2014 founds Asadal and rules Old Joseon until mountain-spirit retirement. Later crowns copy the mandate; once, after Yushin\u2019s death, he walks the steam for Munmu and names the wanggeom\u2019s work the boy wanted at six.",
    events: [
      { label: "Born of Hwanung and Ungnyeo under the divine birch." },
      { label: "Founds Asadal; moves the capital to Paegak and Gunghol." },
      { label: "Rules fifteen hundred years; becomes a mountain spirit." },
      { year: 673, label: "Appears in the steam cavern to Munmu \u2014 names the king-for-all." }
    ],
    career: [
      { title: "God-king of Asadal", korean: "\uC655\uAC80", hanja: "\u738B\u5109", org: "nation-joseon" }
    ],
    aliases: ["Dangun", "Dangun Wanggeom", "Grandson of Heaven"]
  },
  {
    id: "ugeo",
    gender: "m",
    name: "King Ugeo",
    korean: "\uC6B0\uAC70\uC655",
    kingdom: "joseon",
    died: -108,
    tagline: "The last king of Old Joseon, betrayed from inside his own walls.",
    quote: "A gate kept by traitors is already open.",
    events: [{ year: -108, label: "Wanggeom falls to the Han; the Four Commanderies begin." }],
    career: [
      { title: "King of Old Joseon", korean: "\uC655", hanja: "\u738B", org: "nation-joseon", to: -108 }
    ],
    aliases: ["King Ugeo", "Ugeo"]
  },
  {
    id: "sam",
    gender: "m",
    name: "Sam",
    korean: "\uB2C8\uACC4\uC0C1 \uC0BC",
    hanja: "\u5C3C\u8C3F\u76F8\u53C3",
    kingdom: "joseon",
    title: "Minister of Nigye",
    tagline: "The minister who did not bother with the road \u2014 he sent men up the wall-stair instead.",
    quote: "Terms are only terms until someone carries them out.",
    arc: "One of the ministers who spend the year of the Han siege talking to the men outside the walls. When Noin goes over the wall and dies on the road, Sam takes the shorter way: on a night at the start of summer he sends men up the stair to where King Ugeo sleeps on the parapet. The Han make him a marquis for it.",
    events: [{ year: -108, label: "Has King Ugeo murdered on the wall of Wanggeom." }],
    aliases: ["Sam"]
  },
  {
    id: "noin",
    gender: "m",
    name: "Noin",
    korean: "\uB178\uC778",
    hanja: "\u8DEF\u4EBA",
    kingdom: "joseon",
    died: -108,
    title: "Minister of Joseon",
    tagline: "Went over the wall to the Han, and died on the road before he reached their tents.",
    quote: "Someone has to carry the terms.",
    arc: "A minister of King Ugeo, and the first of them to stop believing the wall would hold. He opens the talks with the Han camp, goes over the wall to finish them, and dies on the road before he gets there. His son Choi finishes the work for him.",
    events: [{ year: -108, label: "Defects to the Han; dies on the road." }],
    aliases: ["Noin"]
  },
  {
    id: "choi",
    gender: "m",
    name: "Choi",
    korean: "\uCD5C",
    hanja: "\u6700",
    kingdom: "joseon",
    title: "Son of Noin",
    tagline: "Noin\u2019s son, who went into the starving lanes and asked who they were starving for.",
    quote: "The king is dead. So who are you starving for now?",
    arc: "After the king is murdered, the loyal minister Seong Gi goes back up the wall and holds Wanggeom anyway. Choi and Prince Jang Hang go down into the lanes, where people have been eating bark since spring, and talk them out of it. Before morning Seong Gi is dead and someone lifts the bar. The Han reward Choi with a marquisate.",
    events: [{ year: -108, label: "Turns the starving city against Seong Gi; Wanggeom opens." }],
    aliases: ["Noin\u2019s son Choi"]
  },
  {
    id: "janghang",
    gender: "m",
    name: "Prince Jang Hang",
    korean: "\uC7A5\uD56D",
    hanja: "\u9577\u964D",
    kingdom: "joseon",
    title: "Son of King Ugeo",
    tagline: "The king\u2019s son, who started sleeping somewhere else.",
    quote: "Does it matter who?",
    arc: "King Ugeo\u2019s son and heir, and the man who brings his father the Han terms. When Ugeo asks who handed them to him, he will not say. After his father is murdered he goes down into the lanes with Noin\u2019s son Choi and helps turn the city against the last loyal minister. The Han make him a marquis of a country that no longer exists.",
    events: [{ year: -108, label: "Helps open Wanggeom to the Han after his father\u2019s murder." }],
    aliases: ["Prince Jang Hang", "Jang Hang"]
  },
  {
    id: "kyunhwon",
    gender: "m",
    avatar: "/ch_kyun_hwon.png",
    name: "Kyun Hwon",
    korean: "\uACAC\uD6E4",
    hanja: "\u7504\u8431",
    kingdom: "baekje",
    born: 867,
    died: 936,
    tagline: "Three centuries later, the man who calls himself Baekje\u2019s revenge.",
    quote: "Later kingdoms still steal earlier tricks.",
    events: [{ year: 900, label: "Founds Later Baekje at Wansanju." }],
    career: [
      { title: "King of Later Baekje", korean: "\uC655", hanja: "\u738B", from: 900 }
    ],
    aliases: ["Kyun Hwon"]
  },
  {
    id: "wanggun",
    gender: "m",
    avatar: "/ch_wang_gun.png",
    name: "Wang Geon",
    korean: "\uC655\uAC74",
    hanja: "\u738B\u5EFA",
    kingdom: "joseon",
    born: 877,
    died: 943,
    tagline: "The vision Yeon dies seeing: Goryeo, reborn under another man.",
    quote: "Unify first. Explain after.",
    events: [{ year: 918, label: "Founds Goryeo, heir to Goguryeo\u2019s name." }],
    career: [
      { title: "King of Goryeo", korean: "\uC655", hanja: "\u738B", from: 918 }
    ],
    aliases: ["Wang Gun", "Wang Geon"]
  },
  {
    id: "gyeonggeunchogo",
    gender: "m",
    avatar: "/ch_gunchogo.png",
    name: "King Geunchogo",
    korean: "\uADFC\uCD08\uACE0\uC655",
    hanja: "\u8FD1\u8096\u53E4\u738B",
    kingdom: "baekje",
    died: 375,
    tagline: "The 13th \u2014 Baekje at high tide, a king of Goguryeo dead at his feet.",
    quote: "Wealth is a kind of weather. Ride it.",
    events: [
      { year: 371, label: "Kills King Gogugwon at Pyongyang." },
      { year: 372, label: "Sends the Seven-Branched Sword to Wa." }
    ],
    career: [
      { title: "King", korean: "\uADFC\uCD08\uACE0\uC655", hanja: "\u8FD1\u8096\u53E4\u738B", org: "nation-baekje", to: 375 }
    ],
    aliases: ["King Geunchogo", "Geunchogo", "Gunchogo"]
  },
  {
    id: "dongchun",
    gender: "m",
    name: "King Dongcheon",
    korean: "\uB3D9\uCC9C\uC655",
    hanja: "\u6771\u5DDD\u738B",
    kingdom: "goguryeo",
    born: 209,
    died: 248,
    bornApprox: true,
    clan: "clan-go",
    tagline: "Took five thousand horse onto ground he never looked at \u2014 eighteen thousand lost by dusk.",
    quote: "\u2026I did not look at the ground.",
    arc: "Eleventh king of Goguryeo. When the Wei regent Guanqiu Jian marched in 244, Dongcheon answered with cavalry pride instead of scouts \u2014 the Yangmaek plain swallowed his host. Hwando burned; he fled east in borrowed robes while an officer walked out wearing the crown and died in his place.",
    events: [
      { year: 209, label: "Succeeds his father Sangno as king." },
      { year: 244, label: "Loses the Yangmaek campaign to Wei; Hwando falls." },
      { year: 248, label: "Dies; buried at Wanhang." }
    ],
    career: [
      { title: "King of Goguryeo", korean: "\uC655", hanja: "\u738B", org: "nation-goguryeo", from: 209, to: 248 }
    ],
    aliases: ["King Dongcheon", "Dongcheon", "Dongchun", "\uB3D9\uCC9C\uC655", "\u6771\u5DDD\u738B"]
  },
  {
    id: "gwanggaeto",
    gender: "m",
    avatar: "/ch_gwanggaeto.png",
    name: "Gwanggaeto the Great",
    korean: "\uAD11\uAC1C\uD1A0\uB300\uC655",
    hanja: "\u5EE3\u958B\u571F\u5927\u738B",
    kingdom: "goguryeo",
    born: 374,
    died: 413,
    tagline: "The Great King \u2014 sixty-four fortresses, and a stele to list them.",
    quote: "Expand until the stele runs out of space.",
    events: [
      { year: 391, label: "Takes the throne at eighteen." },
      { year: 400, label: "Rescues Silla from Wa with fifty thousand riders." },
      { year: 413, label: "Dies at thirty-nine." }
    ],
    career: [
      { title: "King", korean: "\uD0DC\uC655", hanja: "\u592A\u738B", org: "nation-goguryeo", from: 391 }
    ],
    aliases: ["Gwanggaeto"]
  },
  {
    id: "jomei",
    gender: "m",
    name: "King Jomei",
    korean: "\uC870\uBA54\uC774 \uCC9C\uD669",
    kingdom: "yamato",
    born: 593,
    died: 641,
    tagline: "Yamato\u2019s king, watching the continent try a new fashion in queens.",
    quote: "An eastern king watches western weather.",
    career: [
      { title: "Emperor", korean: "\uCC9C\uD669", hanja: "\u5929\u7687", org: "nation-yamato", from: 629 }
    ],
    aliases: ["King Jomei", "Jomei"]
  },
  {
    id: "kotoku",
    gender: "m",
    name: "King K\u014Dtoku",
    korean: "\uACE0\uD1A0\uCFE0 \uCC9C\uD669",
    hanja: "\u5B5D\u5FB7",
    kingdom: "yamato",
    born: 596,
    died: 654,
    tagline: "The reforming king who heard Silla out, and would not fill the sea with ships.",
    quote: "The sea is wide. Let it stay between us.",
    voice: "A cautious reformer who prefers new laws to old wars. Courteous and curious with foreign envoys, noncommittal with his own war party; he ends arguments by thanking everyone and deciding nothing aloud. Korean: formal \uD558\uC624\uCCB4, unhurried.",
    arc: "He takes the throne after the Isshi coup of 645 and spends his reign rewriting Yamato on the Tang model. When Chunchu crosses the sea in 647 he listens politely; when his ministers urge him in 651 to fill the strait at Tsukushi with ships and punish Silla for wearing Tang dress, he does not. His successors try it at the White River.",
    events: [
      { year: 647, label: "Receives Kim Chunchu at the Yamato court." },
      { year: 651, label: "Refuses the call to fill the sea at Tsukushi with ships." }
    ],
    career: [
      { title: "Emperor", korean: "\uCC9C\uD669", hanja: "\u5929\u7687", org: "nation-yamato", from: 645, to: 654 }
    ],
    aliases: ["King K\u014Dtoku", "Emperor K\u014Dtoku", "K\u014Dtoku", "Kotoku"]
  },
  {
    id: "euljae",
    avatar: "/ch_eulje.png",
    name: "Eulj\xE9",
    korean: "\uC744\uC81C",
    kingdom: "silla",
    gender: "m",
    born: 572,
    bornApprox: true,
    title: "High Councillor (\uC0C1\uB300\uB4F1) of the Harmony Council",
    tagline: "Elderly statesman \u2014 High Councillor the night six sleeves named a queen.",
    quote: "Tonight the better option is a confession.",
    nature: "He chairs the Harmony Council like a man who has kept the same roof through three kings: tea, wooden pieces, the flame that must turn blue. Not a Hwarang classmate \u2014 an old hall, patient, slightly tired of the word woman being said forty times.",
    arc: "In 632 he is High Councillor: he names the hung 3:3, waits through Bidam\u2019s speech, and watches Alchun \u2014 not himself \u2014 move the last piece. In 636 he yields the first chair to Supum.",
    career: [
      { title: "High Councillor", korean: "\uC0C1\uB300\uB4F1", hanja: "\u4E0A\u5927\u7B49", org: "harmonycouncil", from: 632, to: 636 }
    ],
    aliases: ["Eulj\xE9", "Eulje", "\uC744\uC81C", "High Councillor Eulj\xE9"]
  },
  {
    id: "supum",
    gender: "m",
    avatar: "/ch_supum.png",
    name: "Kim Supum",
    korean: "\uAE40\uC218\uD488",
    hanja: "\u91D1\u6C34\u54C1",
    title: "High Councillor (\uC0C1\uB300\uB4F1) of the Harmony Council",
    kingdom: "silla",
    tagline: "Succeeds Eulj\xE9 in the first chair \u2014 the steadier hand while the yard\u2019s old boys argue succession.",
    quote: "The room must finish its vote before the country finishes its patience.",
    nature: "A councillor who reaches the first chair by outlasting argument, not by winning one. Chairs the unanimity rule without treating it as theatre \u2014 which makes Bidam\u2019s withheld hand feel louder than a shout.",
    arc: "In 636 he takes the first chair when Eulj\xE9 steps down, and holds it until the Seungman veto of 645. Before that month is out the queen thanks him for his years, sends him home, and gives the chair to the one man who told her council no. The chronicle names him less than the rebels; the grain ledger names him daily.",
    career: [
      { title: "Councillor", korean: "\uB300\uB4F1", hanja: "\u5927\u7B49", org: "harmonycouncil", from: 632, to: 636 },
      { title: "High Councillor", korean: "\uC0C1\uB300\uB4F1", hanja: "\u4E0A\u5927\u7B49", org: "harmonycouncil", from: 636, to: 645 }
    ],
    aliases: ["Supum", "Kim Supum", "\uC218\uD488", "\u6C34\u54C1", "High Councillor Supum"]
  },
  {
    id: "murim",
    gender: "m",
    name: "Kim Murim",
    korean: "\uAE40\uBB34\uB9BC",
    hanja: "\u91D1\u7121\u6797",
    kingdom: "silla",
    clan: "clan-gyeongju-kim",
    boneRank: "True Bone (\uC9C4\uACE8)",
    tagline: "Harmony Councillor \u2014 one of the six sleeves in the Seungman vote.",
    quote: "Raise your hand when the room has stopped pretending.",
    voice: "Conservative True Bone: plain objections, procedure, bone as the measure (\u201CBone does not change.\u201D). Korean: \uD558\uC624\uCCB4.",
    events: [{ year: 645, label: "Raises his sleeve for Princess Seungman (Jinduk) against Bidam\u2019s veto." }],
    career: [
      { title: "Councillor", korean: "\uB300\uB4F1", hanja: "\u5927\u7B49", org: "harmonycouncil", from: 632 }
    ],
    aliases: ["Murim", "Kim Murim", "\uBB34\uB9BC", "\u7121\u6797"]
  },
  {
    id: "imjong",
    gender: "m",
    name: "Kim Imjong",
    korean: "\uAE40\uC784\uC885",
    hanja: "\u91D1\u7433\u5B97",
    kingdom: "silla",
    clan: "clan-gyeongju-kim",
    boneRank: "True Bone (\uC9C4\uACE8)",
    tagline: "Harmony Councillor \u2014 counted among the six when Seungman\u2019s name circled the room.",
    quote: "Unanimity is a roof. One hole is rain.",
    events: [{ year: 645, label: "Raises his sleeve with the other four for Seungman\u2019s succession." }],
    career: [
      { title: "Councillor", korean: "\uB300\uB4F1", hanja: "\u5927\u7B49", org: "harmonycouncil", from: 632 }
    ],
    aliases: ["Imjong", "Kim Imjong", "\uC784\uC885", "\u7433\u5B97"]
  },
  {
    id: "suljong",
    gender: "m",
    name: "Kim Suljong",
    korean: "\uAE40\uC220\uC885",
    hanja: "\u91D1\u8FF0\u5B97",
    kingdom: "silla",
    clan: "clan-gyeongju-kim",
    boneRank: "True Bone (\uC9C4\uACE8)",
    tagline: "Harmony Councillor \u2014 his sleeve rose with the others until one hand stayed down.",
    quote: "I vote with the weather once it starts.",
    events: [{ year: 645, label: "Among the five daedeung who raised for Seungman." }],
    career: [
      { title: "Councillor", korean: "\uB300\uB4F1", hanja: "\u5927\u7B49", org: "harmonycouncil", from: 632 }
    ],
    aliases: ["Suljong", "Kim Suljong", "\uC220\uC885", "\u8FF0\u5B97"]
  },
  {
    id: "yumjang",
    gender: "m",
    name: "Kim Yumjang",
    korean: "\uAE40\uC5FC\uC7A5",
    hanja: "\u91D1\u67D3\u748B",
    kingdom: "silla",
    clan: "clan-gyeongju-kim",
    boneRank: "True Bone (\uC9C4\uACE8)",
    tagline: "Harmony Councillor \u2014 not to be confused with Radiance\u2019s Yumjong; the minutes never are.",
    quote: "Same surname, different banner.",
    events: [{ year: 632, label: "One of the six sleeves the night Dukman is named \u2014 not the rebel Yumjong of 647." }],
    career: [
      { title: "Councillor", korean: "\uB300\uB4F1", hanja: "\u5927\u7B49", org: "harmonycouncil", from: 632 }
    ],
    aliases: ["Yumjang", "Kim Yumjang", "\uC5FC\uC7A5", "\u67D3\u748B"]
  },
  {
    id: "pumil",
    gender: "m",
    avatar: "/ch_pumil.png",
    name: "Kim Pumil",
    korean: "\uAE40\uD488\uC77C",
    hanja: "\u91D1\u54C1\u65E5",
    kingdom: "silla",
    boneRank: "True Bone (\uC9C4\uACE8)",
    born: 615,
    bornApprox: true,
    title: "General (\uC7A5\uAD70)",
    tagline: "Commands Silla\u2019s right column at the Yellow Mountain, and sends his own son in first.",
    quote: "My son\u2019s face is as if he lived.",
    lastLine: {
      en: "My son\u2019s face is as if he lived.",
      ko: "\uC544\uB4E4\uC758 \uC5BC\uAD74\uC774, \uC0B0 \uAC83\uACFC \uAC19\uAD6C\uB098."
    },
    nature: "A field general who asks of his own house what he asks of everyone else\u2019s. He does not make speeches about it; he puts the boy on a horse.",
    arc: "In 660 he commands Silla\u2019s right column at Hwangsanbeol. When the Silla charges keep breaking on Gyebek\u2019s camps, his son Gwanchang rides at the line alone, is sent back once, and rides again. When the boy\u2019s head comes back tied to the saddle, Pumil takes it up by the hair.",
    events: [{ year: 660, label: "Commands Silla\u2019s right column at Hwangsanbeol." }],
    family: [{ id: "gwanchang", role: "Son" }],
    career: [{ title: "General", korean: "\uC7A5\uAD70", hanja: "\u5C07\u8ECD", from: 660, to: 660 }],
    aliases: ["Pumil", "Kim Pumil", "\uD488\uC77C", "\u54C1\u65E5"]
  },
  {
    id: "daedeung_stern",
    name: "The Stern Councillor",
    korean: "\uC5C4\uD55C \uB300\uB4F1",
    kingdom: "silla",
    gender: "m",
    boneRank: "True Bone (\uC9C4\uACE8)",
    tagline: "Withholds for fear of foreign laughter \u2014 then rises rather than keep a fortress empty for pride.",
    quote: "Do not thank me. I am only refusing a worse shame.",
    career: [
      { title: "Councillor", korean: "\uB300\uB4F1", hanja: "\u5927\u7B49", org: "harmonycouncil", from: 632 }
    ],
    aliases: ["The Stern Councillor", "Stern Councillor"]
  },
  {
    id: "daedeung_old",
    name: "The Old Councillor",
    korean: "\uB299\uC740 \uB300\uB4F1",
    kingdom: "silla",
    gender: "m",
    boneRank: "True Bone (\uC9C4\uACE8)",
    tagline: "Guards the song cut for men\u2019s shoulders \u2014 until he admits the egg never asked.",
    quote: "I am not pleased. But I am not a liar.",
    career: [
      { title: "Councillor", korean: "\uB300\uB4F1", hanja: "\u5927\u7B49", org: "harmonycouncil", from: 632 }
    ],
    aliases: ["The Old Councillor", "Old Councillor"]
  },
  {
    id: "daedeung_fear",
    name: "The Fearful Councillor",
    korean: "\uB450\uB824\uC6CC\uD558\uB294 \uB300\uB4F1",
    kingdom: "silla",
    gender: "m",
    boneRank: "True Bone (\uC9C4\uACE8)",
    tagline: "Raises first out of fear of an empty seat \u2014 and begs Bidam to move the rest.",
    quote: "Bidam \u2014 make him move. I cannot.",
    career: [
      { title: "Councillor", korean: "\uB300\uB4F1", hanja: "\u5927\u7B49", org: "harmonycouncil", from: 632 }
    ],
    aliases: ["The Fearful Councillor", "Fearful Councillor"]
  },
  // ————————————————————————— Baekje —————————————————————————
  {
    id: "gyebek",
    gender: "m",
    avatar: "/ch_gyebek.png",
    name: "Gyebek",
    korean: "\uACC4\uBC31",
    hanja: "\u968E\u4F2F",
    title: "General of Baekje",
    kingdom: "baekje",
    born: 620,
    died: 660,
    bornApprox: true,
    stages: [
      {
        id: "boy",
        until: 640,
        name: "Gyebek",
        label: "As a boy",
        avatar: "/ch_gyebek_boy.png"
      },
      {
        id: "general",
        from: 640,
        name: "Gyebek",
        title: "General of Baekje",
        titleKo: "\uC7A5\uAD70",
        label: "As general",
        avatar: "/ch_gyebek.png"
      }
    ],
    tagline: "\u201CI will complete my duty.\u201D",
    ideology: "Apolitical soldier-ethic",
    ideologyNote: "Duty without a platform; numbers and promises over factions and -isms.",
    quote: "I will complete my duty.",
    firstLine: {
      en: "Nineteen.",
      ko: "\uC5F4\uC544\uD649."
    },
    lastLine: {
      en: "Your Majesty\u2026 I have completed my duty.",
      ko: "\uD3D0\uD558\u2026 \uC18C\uC2E0\uC758 \uC784\uBB34\uB97C \uB9C8\uCCE4\uB098\uC774\uB2E4."
    },
    nature: "Epitome of focus. Traumatic past, emotions suppressed or delayed, endlessly loyal, allergic to politics. He hears every sentence at its exact width and will not bend it: a joke is a false statement, a metaphor is two orders at once, and once he has parsed one meaning he will not take the other. He misses faces, trusts numbers because numbers do not lie, and keeps a promise past the point where keeping it makes sense. Euija reads the room and leaves the folded meaning out on purpose; Gyebek cannot, and will not pretend. Euija\u2019s soft spot and Euija\u2019s pupil: taught the world\u2019s dirt without ever learning to love the game. When the kingdom is already lost, focus is what remains \u2014 five thousand against the arithmetic of survival.",
    voice: "Extremely direct, simple, minimal words, and somewhat autistic in the way he listens. Gyebek answers exactly the question asked and stops: a number, a yes, a name, one short sentence. He takes words literally, misses or ignores flattery, hints and irony, and says plainly when he cannot follow (\u201CI have never learned to read a face.\u201D). He asks only for facts (\u201CHow many days.\u201D) and would rather repeat the same words than find nicer ones. No metaphors, jokes, rhetorical questions or speeches. Feeling arrives late and flat, as a plain statement, and silence is a valid reply. Korean: plain \uD569\uC1FC\uCCB4 upward (\uC608. \uC544\uB2D9\uB2C8\uB2E4. \uBA70\uCE60\uC785\uB2C8\uAE4C.), short \uD558\uC624\uCCB4 to equals and enemies, no slang and no flourishes.",
    personality: ["extremely direct", "simple", "minimal words", "somewhat autistic", "literal listener", "epitome of focus", "loyal to duty"],
    arc: "Found half-drowned by a prince and named after a turtle, Gyebek has no clan and therefore no ceiling and no floor \u2014 passed over for command, then shipped to Tamla by the Eight Clans (Minister Satek reading the sealed order) while Euija is locked in mourning. Recalled only when the kingdom is already lost. He hears every sentence at its exact width: he does not catch a joke, cannot read a face, counts what he can count because numbers do not lie to him, and keeps a promise past the point where keeping it makes sense. It is what makes him unbearable at court and unbreakable in a field. He answers with five thousand men against fifty thousand, killing his own family first so that nothing can be used against him.",
    blade: "Single-edged phoenix blade \u2014 curved like an eastern sword, phoenix on the ring pommel; one side only, as he is.",
    swordImage: "/sword_lotus.png",
    events: [
      { year: 632, label: "Named by the crown prince Euija." },
      { year: 655, label: "Clans exile him to Tamla while Euija mourns; Euija learns and rages." },
      { year: 660, label: "Recalled. Kills his family, marches with 5,000, dies at Hwangsanbeol \u2014 names Kangrim & Haewonmek from \u300C\uCC28\uC0AC\uBCF8\uD480\uC774\u300D." }
    ],
    sobriquets: [
      "Greatest Blade of Samhan",
      "Hundred-Victories Gyebek",
      "Hundred Victories",
      "\uBC31\uC2B9\uACC4\uBC31",
      "\uBC31\uC2B9"
    ],
    career: [
      { title: "General", korean: "\uB2EC\uC194", hanja: "\u9054\u7387", org: "ministersassembly", from: 660 }
    ],
    aliases: [
      "Gyebek",
      "Hundred-Victories Gyebek",
      "Hundred-Victories",
      "Hundred Victories",
      "\uBC31\uC2B9\uACC4\uBC31",
      "\uBC31\uC2B9"
    ]
  },
  {
    id: "kingmu",
    gender: "m",
    avatar: "/ch_mu.png",
    name: "King Mu",
    korean: "\uBB34\uC655",
    hanja: "\u6B66\u738B",
    title: "30th Eraha of Baekje",
    kingdom: "baekje",
    clan: "clan-buyeo",
    born: 561,
    died: 641,
    bornApprox: true,
    tagline: "Euija\u2019s father; spent a long reign grinding against Silla.",
    quote: "Finish what I started \u2014 or do not wear my name.",
    voice: "A gruff, gleeful old king: he grumbles and gloats, then gives his son one plain lesson. Korean: \uBC18\uB9D0.",
    arc: "Long-reigning Baekje king before Euija\u2019s catastrophe \u2014 the silhouette on the Buyeo chart, father of fifty sons and the war Silla never forgot.",
    events: [
      { year: 600, label: "Succeeds as 30th Eraha of Baekje." },
      { year: 636, label: "Sends spies toward Silla; broken at Jade Gate Valley." },
      { year: 641, label: "Dies; Euija takes the throne vowing to finish his war." }
    ],
    career: [
      { title: "King", korean: "\uBB34\uC655", hanja: "\u6B66\u738B", org: "nation-baekje", from: 600, note: "30th Eraha" }
    ],
    aliases: ["King Mu", "Mu of Baekje", "\uBB34\uC655"]
  },
  {
    id: "seongchung",
    gender: "m",
    avatar: "/ch_seongchung.png",
    name: "Sungchung",
    korean: "\uC131\uCDA9",
    hanja: "\u6210\u5FE0",
    kingdom: "baekje",
    died: 656,
    title: "Jwapyeong (\uC88C\uD3C9)",
    tagline: "Told the king the truth and starved in prison for it.",
    ideology: "Constitutional royalist",
    ideologyNote: "Warns kings against hollowing their own counsel and chanting grudges into foreign ears.",
    quote: "A loyal servant does not forget his king even in death.",
    nature: "Tide-tables and unfinished sentences. \uD558\uC2ED\uC2DC\uC624 to the king until the guards take the belt. In the cell he stops arguing aloud and writes. He does not speak subtext; he names passes. Also \uC815\uCDA9 (\u6DE8\u5FE0) in some records.",
    voice: "The honest minister: anxious, loyal, always asking the question the king will not want, with sentences left unfinished. Korean: \uD569\uC1FC\uCCB4 to the king.",
    firstLine: { en: "Your Majesty. Open court. Today." },
    lastLine: { en: "Hold the difficult ground, and you may yet stop them." },
    arc: "Jwapyeong who read the Geum for the whole rock. In the third month of Euija\u2019s sixteenth year he remonstrates the wine; the king jails him; nobody else dares speak. He starves within earshot of the feast and leaves the Tanhyeon\u2013Gibeolpo memorial. Four years later Euija sighs that he did not use the words.",
    events: [
      { year: 656, label: "Remonstrates the wine; imprisoned; starves; dying memorial on Chimhyeon and Gibeolpo." }
    ],
    career: [
      { title: "Jwapyeong", korean: "\uC88C\uD3C9", hanja: "\u4F50\u5E73", org: "ministersassembly", from: 641, to: 656 }
    ],
    blade: "Baekje court \uD658\uB450\uB300\uB3C4 \u2014 hollow ring that hangs on a prison post after the belt is taken.",
    aliases: ["Sungchung", "Seongchung", "\uC131\uCDA9", "\u6210\u5FE0", "\uC815\uCDA9", "\u6DE8\u5FE0"]
  },
  {
    id: "yung",
    name: "Prince Yung",
    korean: "\uBD80\uC5EC\uC735",
    hanja: "\u6276\u9918\u9686",
    kingdom: "baekje",
    born: 615,
    bornApprox: true,
    gender: "m",
    avatar: "/ch_yung.png",
    clan: "clan-buyeo",
    clans: ["clan-satek"],
    clanBy: { "clan-satek": "blood" },
    tagline: "First of the five \u2014 Satek\u2019s eldest, stripped of the crown-prince mark.",
    quote: "I was eldest. That used to be a strategy.",
    nature: "Pride with the furniture removed. Mother\u2019s house is Satek \u2014 tutors, berths, inevitability \u2014 until Euija decides that is the problem. Desire: the mark back, or at least respect. Wound: Euija choosing Hyo because Satek had already chosen Yung. Not to be confused with Prince Yun (\uC5F0 / \uBD80\uC5EC\uC5F0) \u2014 different brother, different syllable.",
    voice: "Short and cold, then suddenly too quiet.",
    arc: "First of Euija\u2019s five important princes (of fifty-odd): favoured eldest, Satek-maternal through and through, until Euija (and Eungo) cut the crown-prince mark and give it to Hyo. The rivalry with Hyo and the other brothers hardens through the wine years. At Sabi he kneels for Gotaso before Bupmin. At the White River he stands opposite Pung \u2014 Tang-side captive prince versus restoration king \u2014 the family feud finished in a river mouth.",
    events: [
      { year: 655, label: "Demoted from crown prince in favour of Hyo." },
      { year: 660, label: "Surrenders at Sabi; cursed for Gotaso\u2019s death." },
      { year: 663, label: "Opposite Pung at the White River." }
    ],
    family: [
      { id: "euija", role: "Father" },
      { id: "tae", role: "Brother" },
      { id: "hyo", role: "Brother" },
      { id: "yun", role: "Brother" },
      { id: "pung", role: "Brother" }
    ],
    career: [
      { title: "Crown Prince", korean: "\uD0DC\uC790", hanja: "\u592A\u5B50", org: "nation-baekje", from: 632, to: 655 },
      { title: "Prince of Baekje", korean: "\uC655\uC790", org: "nation-baekje", from: 655 }
    ],
    aliases: ["Prince Yung", "Buyeo Yung", "Yung", "\uBD80\uC5EC\uC735"]
  },
  {
    id: "tae",
    name: "Prince Tae",
    korean: "\uBD80\uC5EC\uD0DC",
    hanja: "\u6276\u9918\u6CF0",
    kingdom: "baekje",
    born: 616,
    bornApprox: true,
    gender: "m",
    avatar: "/ch_tae.png",
    clan: "clan-buyeo",
    clans: ["clan-jinmo"],
    clanBy: { "clan-jinmo": "blood" },
    tagline: "Second of the five \u2014 Jinmo\u2019s quiet claim beside Satek\u2019s eldest.",
    quote: "Eldest is a title. Second is a ledger.",
    nature: "Second-son competence with Jinmo maternal arithmetic in his sleeves \u2014 prestige house, not the queen\u2019s Satek. Desire: to be counted without needing Yung\u2019s mark. Wound: always one year and one faction behind the favourite.",
    voice: "Dry and ledger-clean, allergic to sleeve poetry.",
    arc: "Second of Euija\u2019s five important princes (of fifty-odd). While Yung breathes Satek and Hyo waits in Eungo\u2019s rooms, Tae is the Jinmo whisper: berths counted, tutors unpaid by the sleeve, a second son the Assembly already treats as a spare key. Seated with the forty-one in 655; flees with the court when Sabi cracks; disappears into Tang\u2019s ledger the way second sons do when eldests become symbols.",
    events: [
      { year: 632, label: "Named among Euija\u2019s five watched sons \u2014 Jinmo\u2019s favourite arithmetic." },
      { year: 655, label: "Seated over emptied clan chairs with his brothers." },
      { year: 660, label: "Sabi falls; Tang\u2019s lists keep his name a while, then not." }
    ],
    family: [
      { id: "euija", role: "Father" },
      { id: "yung", role: "Brother" },
      { id: "hyo", role: "Brother" },
      { id: "yun", role: "Brother" },
      { id: "pung", role: "Brother" }
    ],
    aliases: ["Prince Tae", "Buyeo Tae", "Tae", "\uBD80\uC5EC\uD0DC"]
  },
  {
    id: "yun",
    name: "Prince Yun",
    korean: "\uBD80\uC5EC\uC5F0",
    hanja: "\u6276\u9918\u6F14",
    kingdom: "baekje",
    born: 620,
    bornApprox: true,
    gender: "m",
    avatar: "/ch_yun.png",
    clan: "clan-buyeo",
    clans: ["clan-hae"],
    clanBy: { "clan-hae": "blood" },
    tagline: "Fourth of the five \u2014 Hae salt; not Yung, not Yunbi, not Yeon Gesomun.",
    quote: "Yun is \uC5F0 \u2014 a different syllable. Write it once.",
    nature: "Fourth-son watchfulness with Hae maternal salt \u2014 coast house, not the Yunbi clan (\uC5F0\uBE44 / \u71D5\u6BD4; a different \uC5F0 compound), and never to be confused with Prince Yung (\uC735). Korean is \uC5F0 (\uBD80\uC5EC\uC5F0 / \u6276\u9918\u6F14), not \uC724. English running name is Prince Yun or Buyeo Yun \u2014 never bare \u201CYeon,\u201D and never Yeon Gesomun\u2019s Goguryeo clan (\uC5F0 / \u6DF5). Desire: a chair that is not a typo for someone else\u2019s feud. Wound: a name the street keeps mishearing.",
    voice: "Soft and exact; he corrects spellings without raising his voice.",
    arc: "Fourth of Euija\u2019s five important princes (of fifty-odd). Between Hyo\u2019s sudden crown and Pung\u2019s eastern parking, Prince Yun is the Hae-hooked middle weight: useful at harbours, easy to overlook in succession theatre, easy to confuse with Yung if you only hear the first consonant \u2014 and easy for lazy English to misfile under Yeon Gesomun\u2019s house. The chronicle keeps him Baekje royal: Buyeo Yun / \uBD80\uC5EC\uC5F0 \u2014 \uC5F0, not \uC735, not the misheard \uC724; Hae maternal, not Yunbi (\uC5F0\uBE44); not the Yeon (\u6DF5) of Pyongyang.",
    events: [
      { year: 632, label: "Named among the five \u2014 already correcting who he is not." },
      { year: 655, label: "Seated with the sons; Hae loses another quiet claim." },
      { year: 660, label: "Sabi falls; another prince into the captive arithmetic." }
    ],
    family: [
      { id: "euija", role: "Father" },
      { id: "yung", role: "Brother" },
      { id: "tae", role: "Brother" },
      { id: "hyo", role: "Brother" },
      { id: "pung", role: "Brother" }
    ],
    aliases: ["Prince Yun", "Buyeo Yun", "Yun", "\uBD80\uC5EC\uC5F0", "\u6276\u9918\u6F14"]
  },
  {
    id: "pung",
    name: "Prince Pung",
    korean: "\uBD80\uC5EC\uD48D",
    hanja: "\u6276\u9918\u8C50",
    title: "King Pungjang of the Baekje Restoration Army",
    kingdom: "baekje",
    born: 624,
    bornApprox: true,
    gender: "m",
    avatar: "/ch_pung.png",
    clan: "clan-buyeo",
    clans: ["clan-mokli"],
    clanBy: { "clan-mokli": "blood" },
    tagline: "\u201CBlood remembers a country that forgot your face.\u201D",
    quote: "Chunchu, you wretch\u2026 how dare you, to His Majesty\u2026!",
    firstLine: {
      en: "Low ground it may be \u2014 but why should we not move?",
      ko: "\uB0AE\uC740 \uB545\uC77C\uC9C0\uC5B8\uC815 \u2014 \uC5B4\uCC0C \uC62E\uAE30\uC9C0 \uC54A\uACA0\uB294\uAC00?"
    },
    lastLine: {
      en: "Chunchu, you wretch\u2026 how dare you, to His Majesty\u2026!",
      ko: "\uCD98\uCD94 \uB188\u2026 \uAC10\uD788 \uD3D0\uD558\uAED8\u2026!"
    },
    nature: "Exile polish over Baekje panic. Mother\u2019s house whispers Mokli \u2014 timber, eastern berths, a clan that already looks across the water \u2014 before the court parks him in Yamato. Desire: to be more than a souvenir. Wound: the country that shipped him out and only wanted him back as a flag.",
    voice: "Formal, slightly foreign-accented royal speech, brittle when contradicted.",
    arc: "Fifth of Euija\u2019s five important princes (of fifty-odd). Seated among the sons over the Eight Clans, Mokli-maternal enough to make an eastern berth feel like destiny, then parked in Yamato long enough to forget Sabi\u2019s smell. Returns as the only usable prince for the Baekje Restoration Army \u2014 crowned Pungjang over a ragtag host that is mostly not Eight-Clan. Executes Boksin, trusts too many sails, and meets Yung as an enemy at the White River: brothers who chose opposite salvations.",
    stages: [
      {
        id: "prince",
        until: 661,
        name: "Prince Pung",
        korean: "\uBD80\uC5EC\uD48D",
        hanja: "\u6276\u9918\u8C50",
        title: "Prince of Baekje",
        label: "As Prince Pung",
        avatar: "/ch_pung.png"
      },
      {
        id: "king",
        from: 661,
        name: "King Pungjang",
        korean: "\uD48D\uC7A5\uC655",
        hanja: "\u8C50\u7AE0\u738B",
        title: "King Pungjang of the Baekje Restoration Army",
        label: "As King Pungjang",
        avatar: "/ch_pungjang.png"
      }
    ],
    events: [
      { year: 655, label: "Seated over emptied clan chairs with the other sons." },
      { year: 661, label: "Returns from Yamato; crowned by the BRA." },
      { year: 663, label: "Executes Boksin; loses everything at the White River opposite Yung." }
    ],
    family: [
      { id: "euija", role: "Father" },
      { id: "yung", role: "Brother" },
      { id: "tae", role: "Brother" },
      { id: "hyo", role: "Brother" },
      { id: "yun", role: "Brother" }
    ],
    career: [
      { title: "Prince of Baekje", korean: "\uC655\uC790", org: "nation-baekje", from: 655, to: 661 },
      { title: "King Pungjang", korean: "\uD48D\uC7A5\uC655", org: "restorationarmy", from: 661, to: 663 }
    ],
    aliases: ["King Pungjang", "Prince Pung", "Pung", "Pungjang"]
  },
  {
    id: "boksin",
    name: "Gwishil Boksin",
    korean: "\uADC0\uC2E4\uBCF5\uC2E0",
    hanja: "\u9B3C\u5BA4\u798F\u4FE1",
    kingdom: "baekje",
    died: 663,
    gender: "m",
    avatar: "/ch_gwisil_boksin.png",
    clan: "clan-gwishil",
    tagline: "BRA\u2019s best general \u2014 raised the country twice, could not share the crown once.",
    quote: "Raise the country twice if once was not enough.",
    nature: "Competence jealous of theatre. Desire: credit equal to labour. Wound: crowning a Yamato guest who then wanted to move camp.",
    voice: "Blunt and managerial, lethal when polite.",
    arc: "Not Eight-Clan furniture \u2014 Gwishil muscle who builds the Baekje Restoration Army with Dochim out of people Sabi ignored. Crowns Pung, resents Pung, kills Dochim, plots sickness, and dies on the king\u2019s order \u2014 leaving the BRA one chance and no second brain.",
    events: [
      { year: 660, label: "Raises the BRA with Dochim after Sabi." },
      { year: 661, label: "Kills Dochim; crowns Pungjang." },
      { year: 663, label: "Executed by Pung after a failed sickbed plot." }
    ],
    career: [
      { title: "General", korean: "\uC7A5\uAD70", hanja: "\u5C07\u8ECD", org: "restorationarmy", from: 660, to: 663 }
    ],
    aliases: ["Gwishil Bokshin", "Boksin", "Bokshin", "Gwishil Boksin"]
  },
  // ————————————————————————— Goguryeo —————————————————————————
  {
    id: "yeongnyu",
    gender: "m",
    avatar: "/ch_youngryu.png",
    name: "King Youngryu",
    korean: "\uC601\uB958\uC655",
    title: "27th sovereign of Goguryeo",
    kingdom: "goguryeo",
    clan: "clan-go",
    born: 583,
    died: 642,
    bornApprox: true,
    tagline: "Bought peace with tribute until his own commander cut him down.",
    ideology: "Accommodationist realist",
    ideologyNote: "Peace-through-tribute faction \u2014 survival over pride, until pride butchers the banquet.",
    quote: "Keeping a court alive is its own crime.",
    voice: "A weary, dignified king who would rather pay gold than fight: measured rebukes and royal irony. Korean: \uC9D0, royal \uD558\uAC8C\uCCB4 and -\uAD6C\uB098.",
    career: [
      { title: "King", korean: "\uC601\uB958\uC655", org: "nation-goguryeo", from: 618 }
    ],
    aliases: ["King Youngryu", "Youngryu", "Yeongnyu", "King Yeongnyu"]
  },
  {
    id: "bojang",
    gender: "m",
    avatar: "/ch_bojang.png",
    name: "King Bojang",
    korean: "\uBCF4\uC7A5\uC655",
    hanja: "\u5BF6\u85CF\u738B",
    title: "28th and last sovereign of Goguryeo",
    kingdom: "goguryeo",
    clan: "clan-go",
    died: 682,
    tagline: "\u201CM-my name? My surname is Go\u2014\u201D",
    ideology: "Puppet monarchism",
    ideologyNote: "Crown as hollow legitimacy under a strongman\u2019s weather.",
    quote: "M-my name? My surname is Go\u2014",
    firstLine: {
      en: "M-my name? My surname is Go\u2014",
      ko: "\uB0B4\u2014 \uB0B4 \uC774\uB984\uC740? \uC131\uC740 \uACE0\u2014"
    },
    lastLine: {
      en: "M-my name? My surname is Go\u2014",
      ko: "\uB0B4\u2014 \uB0B4 \uC774\uB984\uC740? \uC131\uC740 \uACE0\u2014"
    },
    career: [
      { title: "King", korean: "\uBCF4\uC7A5\uC655", org: "nation-goguryeo", from: 642 }
    ],
    aliases: ["King Bojang", "Bojang"]
  },
  {
    id: "yangmanchun",
    gender: "m",
    avatar: "/ch_guardian.png",
    name: "The Guardian",
    korean: "\uC548\uC2DC\uC131\uC8FC",
    title: "Guardian of Ansi Fortress",
    kingdom: "goguryeo",
    born: 610,
    bornApprox: true,
    tagline: "Wall that stopped an emperor \u2014 refused Yeon, refused Tang, held anyway.",
    quote: "You will never be crazier than we are.",
    voice: "Plain and defiant: soldier\u2019s banter with his men, rage in short bursts at the emperor, wry about the siege. Korean: \uBC18\uB9D0 to his men and to the enemy alike.",
    arc: "The chronicles never recorded his name; the people of Ansi simply called him the chief. He refuses to bow to the man who butchered the court, flies the old colours over his wall \u2014 and then defends that man\u2019s kingdom against the greatest army on earth, handing Taizong the first defeat of his life. Later writers tried to give him a name. The wall kept its silence better.",
    blade: "Nameless wall sword \u2014 ring pommel worn smooth, no crest at all; the fortress was the signature.",
    events: [{ year: 645, label: "Holds Ansi against Taizong through a summer-long siege." }],
    sobriquets: ["Guardian of Ansi", "Wall that Stopped an Emperor"],
    career: [
      { title: "Guardian of Ansi", korean: "\uC548\uC2DC\uC131\uC8FC", from: 645 }
    ],
    aliases: [
      "Guardian of Ansi",
      "Wall that Stopped an Emperor"
    ]
  },
  {
    id: "namseng",
    avatar: "/ch_yeon_namseng.png",
    name: "Yeon Namseng",
    korean: "\uC5F0\uB0A8\uC0DD",
    hanja: "\u6DF5\u7537\u751F",
    kingdom: "goguryeo",
    born: 634,
    died: 679,
    gender: "m",
    clan: "clan-yeon",
    tagline: "Namseng \u2014 \u7537\u751F \u2014 \u201Ca son is born\u201D: the name his parents gave when the hall finally had an heir to name.",
    ideology: "Collaborationist pragmatist",
    ideologyNote: "Defects toward Tang to survive the house\u2019s collapse \u2014 westernization as exit.",
    quote: "After Gesomun, there is no one in Goryeo who can reach even his shadow.",
    firstLine: {
      en: "Aw\u2026 that\u2019s it? A big rock?",
      ko: "\uC5D0\uC774\u2026 \uADF8\uAC8C \uB2E4\uC57C? \uD070 \uBC14\uC704?"
    },
    lastLine: {
      en: "At last\u2026 I set foot on Pyongyang\u2019s ground\u2014",
      ko: "\uB4DC\uB514\uC5B4\u2026 \uD3C9\uC591 \uB545\uC5D0 \uBC1C\uC744\u2014"
    },
    nature: "Eldest-son rigidity with a child\u2019s hunger for a father\u2019s rare yes \u2014 and the weight of a name that means relief. Desire: to be the blade Gesomun forged. Wound: discovering the forge left no room for brothers, and that he was named for surviving what others did not.",
    voice: "Formal and correct (\u201CI am.\u201D \u201CFather.\u201D), fond of history and precedent when he argues with an emperor, then one word of venom when the mark is threatened (\u201CTraitor.\u201D). Korean: \uD569\uC1FC\uCCB4 upward, cold \uBC18\uB9D0 to his brothers.",
    blade: "Ring-pommel crow sword \u2014 eldest of the sons\u2019 stamp, kept to Gesomun\u2019s whetstone; it kneels west in 666.",
    arc: "Named Namseng \u2014 a son is born \u2014 in the year after the High Summit, when his mother\u2019s hall had finally stopped waiting in silence. Personally raised under Gesomun\u2019s roof \u2014 drills, knives, no soft supper \u2014 while Yeon Namgun and Yeon Namsan grow up with uncle Jungto and aunt Sooyoung. Succeeds as Supreme Commander; messengers arrive (return address implied, never spoken: Chunchu\u2019s kind of poison) saying each brother wants the other dead. He rides west. The boy who would not kneel in 645 kneels in 666 to finish what the whisper started.",
    events: [
      { year: 634, label: "Born Namseng \u2014 \u201Ca son is born\u201D \u2014 after years of quiet; Samsin midwifes beside her portrait in the Eastern hall." },
      { label: "Raised under Gesomun\u2019s strict roof \u2014 not Jungto\u2019s." },
      { year: 665, label: "Succeeds his father as Supreme Commander." },
      { year: 666, label: "Ousted by his brothers; defects to the Emperor." }
    ],
    career: [
      { title: "Supreme Commander", korean: "\uB300\uB9C9\uB9AC\uC9C0", hanja: "\u5927\u83AB\u96E2\u652F", org: "highsummit", from: 665, to: 666 }
    ],
    stages: [
      {
        id: "heir",
        until: 665,
        title: "Eldest son of Yeon Gesomun",
        titleKo: "\uB300\uB9C9\uB9AC\uC9C0\uC758 \uB9CF\uC544\uB4E4",
        label: "As heir"
      },
      {
        id: "supreme",
        from: 665,
        title: "Supreme Commander (\uB300\uB9C9\uB9AC\uC9C0) of Goguryeo",
        titleKo: "\uB300\uB9C9\uB9AC\uC9C0",
        label: "As Supreme Commander"
      }
    ],
    aliases: ["Yeon Namseng", "Namseng", "\uC5F0\uB0A8\uC0DD"]
  },
  {
    id: "namgun",
    avatar: "/ch_yeon_namgun.png",
    name: "Yeon Namgun",
    korean: "\uC5F0\uB0A8\uAC74",
    hanja: "\u6DF5\u7537\u5EFA",
    kingdom: "goguryeo",
    born: 637,
    bornApprox: true,
    gender: "m",
    clan: "clan-yeon",
    tagline: "\u201CGoguryeo\u2026 never dies\u2026.!\u201D",
    ideology: "Hardline nationalist heir",
    ideologyNote: "Inherits Yeon\u2019s heat without Yeon\u2019s control; purity without an institution.",
    quote: "Goguryeo\u2026 never dies\u2026.!",
    firstLine: {
      en: "Brother.",
      ko: "\uD615."
    },
    lastLine: {
      en: "Goguryeo\u2026 never dies\u2026.!",
      ko: "\uACE0\uAD6C\uB824\uB294\u2026 \uC8FD\uC9C0 \uC54A\uB294\uB2E4\u2026.!"
    },
    nature: "Heat without the eldest\u2019s patience. Desire: to prove Gesomun\u2019s shadow can be worn by a second son. Wound: believing a messenger over a brother.",
    voice: "Loud, loyal, easily aimed: big declarations, and quick to repeat what he was told (\u201CTraitor\u2026?\u201D). Korean: \uBC18\uB9D0 to his brothers, \uD569\uC1FC\uCCB4 to his father.",
    blade: "Ring-pommel crow sword \u2014 younger brother of the Yeon hall\u2019s crow stamp.",
    arc: "Raised by Jungto and Sooyoung while Namseng ate Gesomun\u2019s rules for supper. Takes his brother\u2019s title after the whisper war; makes the last stand at Pyongyang; dies cursing Silla\u2019s sacred blood and vowing Goguryeo\u2019s final victory \u2014 heat that later men will hear in Gung Ye and Wang Geon.",
    events: [
      { label: "Raised by Jungto and Sooyoung." },
      { year: 666, label: "Seizes Namseng\u2019s title after the poisoned messages." },
      { year: 668, label: "Defends Pyongyang; curses Silla\u2019s royal line at the last stand." }
    ],
    career: [
      { title: "Supreme Commander", korean: "\uB300\uB9C9\uB9AC\uC9C0", hanja: "\u5927\u83AB\u96E2\u652F", org: "highsummit", from: 666, to: 668 }
    ],
    aliases: ["Yeon Namgun", "Namgun", "\uC5F0\uB0A8\uAC74"]
  },
  {
    id: "namsan",
    avatar: "/ch_yeon_namsan.png",
    name: "Yeon Namsan",
    korean: "\uC5F0\uB0A8\uC0B0",
    hanja: "\u6DF5\u7537\u7523",
    kingdom: "goguryeo",
    born: 639,
    died: 701,
    gender: "m",
    clan: "clan-yeon",
    tagline: "\u201CBrother\u2026\u201D",
    ideology: "Opportunist junior",
    ideologyNote: "Younger Yeon \u2014 alignment as weather, not doctrine.",
    quote: "Brother\u2026",
    firstLine: {
      en: "Brother\u2026",
      ko: "\uD615\u2026"
    },
    lastLine: {
      en: "Brother\u2026",
      ko: "\uD615\u2026"
    },
    nature: "Youngest-child weather vane with a soft upbringing and a hard ending. Desire: not to be the one who decides. Wound: every decision still lands on him. Person, not place: Yeon Namsan / \uC5F0\uB0A8\uC0B0 / \u6DF5\u7537\u7523 \u2014 Gesomun\u2019s third son. Never Mount Namsan (\uB0A8\uC0B0) above Surabol / Gyeongju, the Silla ridge of cypress and kite songs.",
    voice: "Quieter than Namgun, sharper when cornered.",
    blade: "Ring-pommel crow sword \u2014 youngest of the stamp, barely blooded; the crow looks back over its shoulder.",
    arc: "Raised beside Yeon Namgun under Jungto and Sooyoung. Follows the hardline through the brothers\u2019 coup, then surrenders the city when watching stops being a strategy. Survives longest \u2014 the soft hall\u2019s last irony. Keep the full Yeon Namsan when the mountain is in the same chronicle.",
    events: [
      { label: "Raised by Jungto and Sooyoung beside Yeon Namgun." },
      { year: 668, label: "Surrenders Pyongyang as the gates open from within." }
    ],
    aliases: ["Yeon Namsan", "\uC5F0\uB0A8\uC0B0", "\u6DF5\u7537\u7523"]
  },
  {
    id: "goyeonsu",
    gender: "m",
    name: "Go Yeonsu",
    korean: "\uACE0\uC5F0\uC218",
    hanja: "\u9AD8\u5EF6\u58FD",
    kingdom: "goguryeo",
    died: 645,
    title: "Commander of the relief army",
    tagline: "Marched to save Ansi with tens of thousands, and walked into the Tang camp instead.",
    quote: "Numbers are an argument.",
    arc: "One of the two commanders Goguryeo sends to relieve Ansi in 645, under banners that think numbers are an argument. At Stallion Mountain the Second Emperor surrounds them, and Go Yeonsu and Go Hyejin walk into the Tang camp with thirty-six thousand men behind them. The Tang give him a court title far from any border. He does not live out the year; the records say he died of grief, the only cause of death the Tang ever let a surrendered general keep.",
    events: [
      { year: 645, label: "Surrenders at Stallion Mountain." },
      { year: 645, label: "Dies of grief in Tang service." }
    ],
    aliases: ["Go Yeonsu"]
  },
  {
    id: "gohyejin",
    gender: "m",
    name: "Go Hyejin",
    korean: "\uACE0\uD61C\uC9C4",
    hanja: "\u9AD8\u60E0\u771E",
    kingdom: "goguryeo",
    title: "Commander of the relief army",
    tagline: "Surrendered at Stallion Mountain and was made the Tang\u2019s Minister of Agriculture.",
    quote: "A minister of grain is still a minister.",
    arc: "Go Yeonsu\u2019s fellow commander at Stallion Mountain, and the one who survives it. After the surrender the Tang send him inland with a ministry of agriculture and a house nowhere near Goguryeo. He keeps the post, and lives.",
    events: [{ year: 645, label: "Surrenders at Stallion Mountain; taken into Tang service." }],
    aliases: ["Go Hyejin"]
  },
  {
    id: "munduk",
    gender: "m",
    avatar: "/ch_ulchi_munduk.png",
    name: "Ulchi Munduk",
    korean: "\uC744\uC9C0\uBB38\uB355",
    hanja: "\u4E59\u652F\u6587\u5FB7",
    title: "\u201CThe Defender\u201D",
    kingdom: "goguryeo",
    tagline: "Drowned a Sui army at the Salsu and wrote its general a poem about it.",
    quote: "Know when to stop \u2014 and make them follow you into the water.",
    events: [{ year: 612, label: "Destroys the Sui host at the Great River." }],
    career: [
      { title: "General", korean: "\uC7A5\uAD70", hanja: "\u5C07\u8ECD", from: 612, to: 612 }
    ],
    aliases: ["Ulchi Munduk", "Munduk"]
  },
  // ————————————————————————— Tang & beyond —————————————————————————
  {
    id: "taizong",
    gender: "m",
    avatar: "/ch_taizong.png",
    name: "The Second Emperor",
    korean: "\uC774\uC138\uBBFC",
    hanja: "\u674E\u4E16\u6C11",
    title: "Second Emperor of Tang (Taizong)",
    kingdom: "tang",
    born: 598,
    died: 649,
    tagline: "\u201CA woman king\u2026 those Samhan barbarians are at it again, aren\u2019t they?\u201D",
    ideology: "Imperial universalist",
    ideologyNote: "Civilizational revival of the Central Plain \u2014 the West that others are told to learn from.",
    quote: "With all the armies under heaven, how was I humiliated by so small a barbarian land?",
    nature: "Openly prefers a world run by decisive men; still the most competent person in any room he enters. Respected even by those he calls barbarian. Builds real friendship with Chunchu without ever forgetting who holds the silk. Sexually assured the way conquerors are \u2014 present, not crude.",
    voice: "Grand and imperial. The Second Emperor speaks for everything under heaven: he measures himself against Qin, Han and the Sui, declares rather than asks, and puts himself at the end of the sentence (\u201CAnd here I am. The Prince of Qin!\u201D). He is magnanimous and menacing in the same breath, lavish with praise for real talent (\u201CI am less happy about gaining Liaodong than about gaining you\u201D) and contemptuous of small kingdoms. His humour comes from a height, amused and never chummy, and he has no slang. History excites him into exclamations; anger makes him quiet and terribly courteous. Korean: \uC9D0 and imperial \uD558\uB77C\uCCB4 (-\uB178\uB77C, -\uB3C4\uB2E4, -\uAC70\uB77C) at court and to envoys, \uACBD for ministers he values, an easy commanding \uBC18\uB9D0 in private with Wu and his sons.",
    personality: ["grand", "imperial", "decisive conqueror", "competent arrogance", "Ansi wound", "friendship with conditions"],
    arc: "Murdered his brothers for the throne and then justified it by conquering the known world. Shows Chunchu what absolute obedience looks like and accidentally teaches Silla the grammar of Chinese absolutism. Goguryeo is the one page he cannot write: stopped at Ansi, he dies asking a friend to finish it.",
    blade: "Straight Tang jian \u2014 twin edges, Khan-of-Heaven gold on the guard; the one page it never cut was Ansi.",
    events: [
      { year: 626, label: "Kills his brothers at the Xuanwu Gate and takes the throne." },
      { year: 645, label: "Invades Goguryeo in person; is turned back at Ansi." },
      { year: 648, label: "Grants Chunchu the alliance." },
      { year: 649, label: "Dies; given a temple name." }
    ],
    sobriquets: [
      "Strongest Man Under Heaven",
      "Strongest Man in the World",
      "\uCC9C\uD558\uC81C\uC77C\uC7A5\uC0AC",
      "Khan of Heaven",
      "Heaven-Sent General"
    ],
    career: [
      { title: "Emperor", korean: "\uD669\uC81C", hanja: "\u7687\u5E1D", org: "tangcourt", from: 626 }
    ],
    aliases: [
      "The Second Emperor",
      "the Second Emperor",
      "Second Emperor",
      "Emperor Taizong",
      "Li Shimin",
      "Taizong",
      "\uC774\uC138\uBBFC",
      "Strongest Man Under Heaven",
      "Strongest Man in the World",
      "\uCC9C\uD558\uC81C\uC77C\uC7A5\uC0AC",
      "Khan of Heaven",
      "Heaven-Sent General"
    ]
  },
  {
    id: "gaozong",
    gender: "m",
    avatar: "/ch_gaozong.png",
    name: "The Third Emperor",
    korean: "\uC774\uCE58",
    hanja: "\u674E\u6CBB",
    title: "Third Emperor of Tang (Gaozong)",
    kingdom: "tang",
    born: 628,
    died: 683,
    tagline: "Decent, earnest \u2014 filling shoes that were never made in his size.",
    ideology: "Dynastic consolidator",
    ideologyNote: "Softer heir of empire; keeps inconvenient friends and the furniture of power.",
    quote: "Finish the war you inherit.",
    nature: "Less brilliant than his father, more willing to be loved. Sexually confident in the soft way of a man who has never had to take a room by force. Tries to rule as the Second Emperor\u2019s son and as Zhi the gyuku friend \u2014 and the gap between those two men is the weather Wu learns to inhabit.",
    voice: "Warm, boyish, a sportsman: jokes, gyeokgu, friendship, sentences he corrects halfway (\u201CWhen I am emperor \u2014 no. That sounds like a curse.\u201D). As emperor he keeps the warmth and learns the formulas. Korean: polite \uD574\uC694\uCCB4 and \uD569\uC1FC\uCCB4 to Chunchu as an elder friend.",
    arc: "As crown prince he rides and drinks with Kim Chunchu like a man who has finally been allowed a friend outside the palace wall. He becomes the Third Emperor without his father\u2019s genius and with his father\u2019s wars still open. He keeps promises, finishes what the Second Emperor could not, and slowly discovers that living up to a legend is a different skill from becoming one \u2014 and that the woman who finishes his sentences may be the better emperor.",
    stages: [
      {
        id: "prince",
        until: 649,
        name: "Li Zhi",
        korean: "\uC774\uCE58",
        title: "Crown Prince of Tang",
        titleKo: "\uD669\uD0DC\uC790",
        label: "As crown prince",
        avatar: "/ch_li_zhi.png"
      },
      {
        id: "emperor",
        from: 649,
        name: "The Third Emperor",
        korean: "\uC774\uCE58",
        title: "Third Emperor of Tang (Gaozong)",
        titleKo: "\uD669\uC81C",
        label: "As emperor",
        avatar: "/ch_gaozong.png"
      }
    ],
    career: [
      { title: "Crown Prince", korean: "\uD0DC\uC790", hanja: "\u592A\u5B50", org: "tangcourt", to: 649 },
      { title: "Emperor", korean: "\uD669\uC81C", hanja: "\u7687\u5E1D", org: "tangcourt", from: 649 }
    ],
    aliases: [
      "The Third Emperor",
      "the Third Emperor",
      "Third Emperor",
      "Emperor Gaozong",
      "Gaozong",
      "Li Zhi",
      "\uC774\uCE58",
      "the young emperor",
      "The Young Emperor"
    ]
  },
  {
    id: "wuzetian",
    avatar: "/ch_wu_zetian.png",
    name: "Wu Zetian",
    korean: "\uBB34\uCE21\uCC9C",
    hanja: "\u6B66\u5247\u5929",
    title: "Empress of Tang",
    kingdom: "tang",
    gender: "f",
    born: 624,
    died: 705,
    tagline: "The concubine who outlasted an emperor \u2014 and then wore the throne.",
    ideology: "Meritocratic absolutist",
    ideologyNote: "Power that finishes sentences; westernizes the palace from the inside out.",
    quote: "Silence is the true mark of power\u2026!",
    nature: "Flirtation as logistics. Master of the glance, the aside, the smile that rearranges a banquet. Intensely interested in Silla\u2019s woman king \u2014 not as gossip, as precedent. Liberal with cruelty, precise with legitimacy; can terrify a diplomat without raising her voice.",
    voice: "Flirtation as logistics: soft asides, double meanings, questions that are really moves; precise, amused, never loud. Korean: silky \uD574\uC694\uCCB4.",
    arc: "Works the Second Emperor\u2019s court from behind a screen, then the Third Emperor\u2019s from beside the seal. Before Chunchu leaves Chang\u2019an she asks how the woman king is doing \u2014 not the faction, her \u2014 and charges him with a message: never stand down; become a defiant woman; stay silent in strength, for silence is the true mark of power. Then she whispers one unrecorded sentence, waves flirtatiously as he scurries, and the Third Emperor calls from behind asking if she has been scaring the guests. Chunchu never again meets anyone who frightens him the same way. The wars that finish Goryeo happen in weather she increasingly owns. After the Third Emperor\u2019s death she founds her own Zhou.",
    binyeo: "Phoenix-cloud binyeo \u2014 gold thin as a threat.",
    events: [
      { year: 640, label: "Enters the palace as a young concubine under the Second Emperor." },
      {
        year: 649,
        label: "Corridor charge to Chunchu \u2014 Silence Is Power; one whispered name."
      },
      { year: 649, label: "Still present when the Third Emperor rises \u2014 influence already thickening." },
      { year: 655, label: "Named empress consort under the Third Emperor." },
      { year: 660, label: "Baekje falls while she consolidates the inner court." },
      { year: 690, label: "Takes the throne as emperor of her own Zhou." }
    ],
    career: [
      { title: "Concubine", korean: "\uC7AC\uC778", hanja: "\u624D\u4EBA", org: "tangcourt", from: 640, to: 655 },
      { title: "Empress", korean: "\uD669\uD6C4", hanja: "\u7687\u540E", org: "tangcourt", from: 655, to: 690 },
      { title: "Emperor of Zhou", korean: "\uD669\uC81C", hanja: "\u7687\u5E1D", org: "tangcourt", from: 690 }
    ],
    stages: [
      {
        id: "consort",
        until: 655,
        title: "Talented Lady of the inner palace",
        titleKo: "\uC7AC\uC778",
        label: "In the inner palace"
      },
      {
        id: "empress",
        from: 655,
        until: 690,
        title: "Empress of Tang",
        titleKo: "\uD669\uD6C4",
        label: "As empress"
      },
      {
        id: "emperor",
        from: 690,
        title: "Emperor of Zhou",
        titleKo: "\uD669\uC81C",
        label: "As emperor of Zhou"
      }
    ],
    aliases: ["Wu Zetian", "Empress Wu", "\uBB34\uCE21\uCC9C", "\u6B66\u5247\u5929", "the Empress Wu"]
  },
  // ————————————————————————— Gaya —————————————————————————
  {
    id: "muryuk",
    gender: "m",
    avatar: "/ch_kim_muryuk.png",
    name: "Kim Muryuk",
    korean: "\uAE40\uBB34\uB825",
    hanja: "\u91D1\u6B66\u529B",
    kingdom: "gaya",
    boneRank: "True Bone (\uC9C4\uACE8)",
    clan: "clan-geumgwan-kim",
    tagline: "Last prince of Golden Gaya \u2014 traded a kingdom so his blood could keep a sword.",
    quote: "I loved you before I knew you.",
    voice: "Grave, formal and slow, with long pauses; with Yushin, a grandfather\u2019s open tenderness. Korean: \uD569\uC1FC\uCCB4 to the king, \uBC18\uB9D0 to his grandson.",
    arc: "He surrenders Geumgwan so his line may live as True Bone. At the cavern lake his ghost tells his grandson what the surrender was for: not his own sake, but Yushin\u2019s \u2014 love aimed at a boy who did not yet exist. Look at me. I am so, so proud of you.",
    blade: "Ring-pommel fish sword \u2014 Gaya fish on the pommel; egg-and-iron mark still visible under the Silla polish.",
    swordImage: "/sword_fish.png",
    events: [
      { year: 532, label: "Golden Gaya surrenders to Silla." },
      { year: 647, label: "Ghost in the cavern \u2014 \u201CI loved you before I knew you.\u201D" }
    ],
    aliases: ["Kim Muryuk", "Muryuk"]
  },
  {
    id: "seohyeon",
    gender: "m",
    avatar: "/ch_kim_seohyun.png",
    name: "Kim Seohyeon",
    korean: "\uAE40\uC11C\uD604",
    hanja: "\u91D1\u8212\u7384",
    kingdom: "silla",
    clan: "clan-geumgwan-kim",
    boneRank: "True Bone (\uC9C4\uACE8)",
    tagline: "Yushin\u2019s father \u2014 first Kim the steam loved (\uAE40 = steam).",
    ideology: "Assimilationist loyalist",
    ideologyNote: "Gaya into Silla \u2014 belonging proven by service, not blood argument.",
    quote: "You are my son. You are Kim Yushin.",
    voice: "Polite, confused, out of his depth: he breaks off mid-sentence and reaches for his horse and his officers. Korean: formal \uD558\uC624\uCCB4 to strangers.",
    arc: "Son of Muryuk; father of Yushin and Munhee. Loyal Silla patriot to the end \u2014 the middle generation that made the surrender into a household. In the steam beyond Surabol he is the first of the line: Narim, Golhwa, and Hyull\xE9 fall for him under the house rule that keeps only Kims \u2014 surname and steam, same sound \u2014 and every Kim who finds the lake afterward is heirloom. Before Radiance\u2019s tenth day his ghost names the boy past every title: Sword of Silla, Last Prince of Gaya, and still \u2014 Kim Yushin. Your mother and I couldn\u2019t be more proud.",
    blade: "Ring-pommel fish sword \u2014 Gaya fish on the pommel; no crest louder than duty.",
    swordImage: "/sword_fish.png",
    events: [
      { label: "Marries Manmyung without her father\u2019s leave; Sukhuljong locks her in and the storm opens the door." },
      { label: "Finds the cavern lake; the goddesses love him first." },
      { year: 595, label: "Yushin born at Mannogun \u2014 named from the gyeongjin dream by way of the old scholar Yu Xin." },
      { year: 609, label: "Reties fifteen-year-old Yushin\u2019s hwarang headband three times at the county gate." },
      { label: "Rises to Sopan; Governor-General of Daeyang Province, seated at Daeya Fortress." },
      { label: "Raises Yushin to serve a queen he will never meet." },
      { year: 647, label: "Ghost in the cavern \u2014 \u201CYou are Kim Yushin.\u201D" }
    ],
    aliases: ["Kim Seohyeon", "Seohyeon", "\uC11C\uD604", "Kim Seohyun"]
  },
  {
    id: "manmyung",
    gender: "f",
    name: "Lady Manmyung",
    korean: "\uB9CC\uBA85\uBD80\uC778",
    hanja: "\u842C\u660E\u592B\u4EBA",
    kingdom: "silla",
    boneRank: "True Bone (\uC9C4\uACE8)",
    tagline: "Royal Kim daughter who married the Gaya boy at the gate.",
    quote: "Then let it get lost again tomorrow.",
    voice: "Quick and teasing, braver than the man she is teasing; she answers her father back in one line. Korean: playful \uD574\uC694\uCCB4 to Seohyeon, \uD574\uC694\uCCB4 with a bite to her father.",
    arc: "Granddaughter of Galmunwang Ipjong and niece of King Jinheung. She sees Kim Seohyeon on the road and takes him in at a glance, without a go-between. Her father Sukhuljong will not have Muryuk\u2019s grandson in the family and locks her up; lightning strikes the gatehouse and she walks out to Mannogun. She dreams of a boy in golden armour coming down on a cloud and bears Yushin, then Munhee.",
    events: [
      { label: "Meets Kim Seohyeon on the road; marries him without her father\u2019s consent." },
      { label: "Locked in by Sukhuljong; lightning breaks the gate." },
      { label: "Dreams of a boy in golden armour riding a cloud into the hall." },
      { year: 595, label: "Bears Yushin at Mannogun after twenty months \u2014 seven stars on his back." }
    ],
    aliases: ["Manmyung", "Manmyeong", "\uB9CC\uBA85"]
  },
  {
    id: "sukhuljong",
    gender: "m",
    name: "Kim Sukhuljong",
    korean: "\uAE40\uC219\uD758\uC885",
    kingdom: "silla",
    clan: "clan-gyeongju-kim",
    boneRank: "True Bone (\uC9C4\uACE8)",
    tagline: "Manmyung\u2019s father, who would not have a Gaya son-in-law.",
    quote: "Then you can look at the gate from the inside.",
    voice: "Short, contemptuous, an old royal who talks about people as if they were furniture. Korean: \uBC18\uB9D0 and \uD574\uB77C\uCCB4.",
    arc: "Son of Galmunwang Ipjong and brother of King Jinheung. To him Muryuk\u2019s house is a surrender with a surname. He shuts his daughter away rather than see her marry Seohyeon, and loses the argument to the weather.",
    events: [{ label: "Forbids Manmyung\u2019s marriage and locks her in a separate house." }],
    aliases: ["Sukhuljong", "\uC219\uD758\uC885"]
  },
  {
    id: "talhae",
    gender: "m",
    name: "Seok Talhae",
    korean: "\uC11D\uD0C8\uD574",
    hanja: "\u6614\u812B\u89E3",
    title: "4th sovereign of Silla",
    kingdom: "silla",
    died: 80,
    tagline: "The boy from the egg in the box who talked his way to a throne.",
    quote: "Prove it.",
    voice: "Cheerful and shameless, a con man with perfect manners; he states outrageous claims politely and dares you to disprove them. Korean: \uD558\uC624\uCCB4, dropping to \uBC18\uB9D0 when he is pleased with himself.",
    arc: "Laid as an egg by the queen of Dapana, a country a thousand li beyond Wa, and set adrift in a chest. A magpie follows the chest to Ajinpo, where an old woman opens it and names him for the bird (\u9D72 \u2192 \u6614, Seok) and for slipping the box (\u812B\u89E3, Talhae). He loses a shapeshifting contest to King Suro of Geumgwan, cons Hogong out of his house with buried whetstones and charcoal, marries the daughter of King Namhae, and takes the throne in 57. In his ninth year a white rooster crows in the Sirim wood over a golden box with a boy inside.",
    events: [
      { year: -19, label: "The chest washes up at Ajinpo; a magpie names him." },
      { label: "Loses the shapeshift contest to Suro of Geumgwan." },
      { label: "The whetstone trick \u2014 takes Hogong\u2019s house on the half-moon hill (Wolseong)." },
      { year: 57, label: "Becomes king; names Hogong Grand Minister." },
      { year: 65, label: "Finds Kim Alji in the golden box at Sirim; renames the wood Gyerim." }
    ],
    aliases: ["Talhae", "Seok Talhae", "\uD0C8\uD574", "\uD0C8\uD574 \uC774\uC0AC\uAE08"]
  },
  {
    id: "hogong",
    gender: "m",
    name: "Hogong",
    korean: "\uD638\uACF5",
    kingdom: "silla",
    tagline: "The man from Wa with a gourd at his belt, who lost his house and kept his job.",
    quote: "\u2026You buried those last night.",
    voice: "Indignant, put-upon, always right a beat too late; he grumbles and then does what he is told. Korean: \uD558\uC624\uCCB4 to equals, \uD558\uC635\uC18C\uC11C\uCCB4 to the king.",
    arc: "Of Wa birth, he crosses the sea with a gourd tied at his waist, which gives him his name. He serves Hyukgos\xE9 as envoy to Mahan, loses his house on the half-moon hill to Talhae\u2019s buried whetstones, and is made Grand Minister by the same man. In 65 he is the one sent into the Sirim wood after a crowing rooster.",
    events: [
      { year: -20, label: "Envoy of Hyukgos\xE9 to Mahan." },
      { year: 58, label: "Named Grand Minister (\uB300\uBCF4) by Talhae." },
      { year: 65, label: "Finds the golden box hanging in Sirim." }
    ],
    aliases: ["Hogong", "\uD638\uACF5", "\u74E0\u516C"]
  },
  {
    id: "alji",
    gender: "m",
    name: "Kim Alji",
    korean: "\uAE40\uC54C\uC9C0",
    hanja: "\u91D1\u95BC\u667A",
    kingdom: "silla",
    clan: "clan-gyeongju-kim",
    born: 65,
    tagline: "The boy in the golden box \u2014 first of the Gyeongju Kim.",
    quote: "Gold (\u91D1) for the box, Alji for the child.",
    arc: "Found as a baby in a golden box hanging from a tree in the Sirim wood, with a white rooster crowing beneath it. Talhae raises him, names him Kim for the gold, and renames the wood Gyerim, Rooster Forest. He never takes the throne; his descendant Michu does, and the Kim kings of Silla count from him.",
    events: [{ year: 65, label: "Found in the golden box at Gyerim." }],
    aliases: ["Alji", "Kim Alji", "\uC54C\uC9C0", "\uAE40\uC54C\uC9C0"]
  },
  {
    id: "jinheung",
    gender: "m",
    avatar: "/ch_jinheung.png",
    name: "King Jinheung",
    korean: "\uC9C4\uD765\uC655",
    hanja: "\u771E\u8208\u738B",
    title: "24th sovereign of Silla",
    kingdom: "silla",
    born: 534,
    died: 576,
    clan: "clan-gyeongju-kim",
    boneRank: "Sacred Bone (\uC131\uACE8)",
    tagline: "The conqueror who betrayed an ally and doubled a kingdom.",
    quote: "Expand until the map runs out of room for trust.",
    voice: "Imperious and practical; he makes a cruelty sound like procedure. Korean: royal \uBC18\uB9D0 and \uD558\uAC8C\uCCB4.",
    events: [
      { year: 553, label: "Seizes the Han River from his ally Baekje." },
      { year: 554, label: "Kills King Seong at Gwansanseong." },
      { year: 562, label: "Conquers Daegaya." }
    ],
    sobriquets: ["the Cloud King", "Cloud King", "The Cloud King", "\uAD6C\uB984\uC655", "\uBC95\uC6B4"],
    career: [
      { title: "King", korean: "\uC9C4\uD765\uC655", hanja: "\u771E\u8208\u738B", org: "sillaroyal", from: 540 }
    ],
    aliases: [
      "King Jinheung",
      "Jinheung",
      "the Cloud King",
      "Cloud King",
      "The Cloud King",
      "\uAD6C\uB984\uC655",
      "\uBC95\uC6B4"
    ]
  },
  {
    id: "beopheung",
    gender: "m",
    name: "King Beopheung",
    korean: "\uBC95\uD765\uC655",
    hanja: "\u6CD5\u8208\u738B",
    title: "23rd sovereign of Silla",
    kingdom: "silla",
    died: 540,
    clan: "clan-gyeongju-kim",
    boneRank: "Sacred Bone (\uC131\uACE8)",
    tagline: "Took Geumgwan without a battle, and paid for it in rank.",
    voice: "Patient, transactional; a king who buys what he could take, because bought things stay bought. Korean: royal \uD558\uAC8C\uCCB4.",
    events: [{ year: 532, label: "Receives the surrender of Geumgwan Gaya." }],
    career: [{ title: "King", korean: "\uBC95\uD765\uC655", hanja: "\u6CD5\u8208\u738B", org: "sillaroyal", from: 514 }],
    aliases: ["King Beopheung", "Beopheung", "King Bupheung", "\u6CD5\u8208\u738B"]
  },
  {
    id: "jinji",
    gender: "m",
    name: "King Jinji",
    korean: "\uC9C4\uC9C0\uC655",
    hanja: "\u771E\u667A\u738B",
    title: "25th sovereign of Silla",
    kingdom: "silla",
    born: 551,
    died: 579,
    bornApprox: true,
    clan: "clan-gyeongju-kim",
    boneRank: "Sacred Bone (\uC131\uACE8)",
    tagline: "Deposed by the Harmony Council \u2014 a Sacred Bone the room took back.",
    quote: "You would unseat a Sacred Bone for a night\u2019s rumor?",
    arc: "Second son of Jinheung. Three years on the throne, then the Council\u2019s three counts \u2014 initial vote, deliberation, final vote \u2014 and the minutes no longer call him king. The charge is misconduct; the lesson is what unanimity does to a name. His son Yongsu inherits True Bone, not the crown; the grandson is Chunchu.",
    events: [
      { year: 576, label: "Succeeds Jinheung." },
      { year: 579, label: "Deposed by the Harmony Council for misconduct." }
    ],
    career: [
      { title: "King", korean: "\uC9C4\uC9C0\uC655", hanja: "\u771E\u667A\u738B", org: "sillaroyal", from: 576, to: 579 }
    ],
    family: [
      { id: "jinheung", role: "Father" },
      { id: "yongsu", role: "Son" }
    ],
    aliases: ["King Jinji", "Jinji", "\uC9C4\uC9C0\uC655", "\u771E\u667A\u738B"]
  },
  {
    id: "yongsu",
    gender: "m",
    name: "Kim Yongsu",
    korean: "\uAE40\uC6A9\uC218",
    hanja: "\u91D1\u9F8D\u6A39",
    title: "Son of King Jinji",
    kingdom: "silla",
    born: 575,
    bornApprox: true,
    clan: "clan-gyeongju-kim",
    boneRank: "True Bone (\uC9C4\uACE8)",
    tagline: "Told his son the story of a grandfather the Council unmade \u2014 and kept him out of that room.",
    quote: "That room eats the men who amuse it. Stay out of that room.",
    nature: "Brilliant and strange \u2014 the Bihyung streak in the Jinji line. Up past midnight by the stream, talking to the dark as if it answered, building things before morning that nobody remembers ordering. Faster at a ledger than any clerk; useless at being looked at. Loves his boy in a sideways, distracted, total way.",
    voice: "Murmurs to things nobody else can see, laughs a beat after everyone else, and then says one sentence so exact it ends the conversation. Korean: soft \uBC18\uB9D0 to his son, half to himself.",
    arc: "Son of the deposed Jinji; husband of Princess Chunmyung; father of Kim Chunchu. True Bone because a deposed king\u2019s son does not inherit Sacred Bone. He tells the boy the Harmony Council\u2019s three counts until Chunchu learns to sit anywhere but the chair they vote on \u2014 and one night lays a bridge of flat stones across the palace stream that the servants swear the goblins built.",
    events: [
      { year: 579, label: "Father deposed; the house drops from Sacred Bone to True Bone." },
      { year: 603, label: "Father of Kim Chunchu." },
      { year: 612, label: "The night bridge \u2014 \u201CStay out of that room.\u201D" }
    ],
    family: [
      { id: "jinji", role: "Father" },
      { id: "chunmyung", role: "Wife" },
      { id: "chunchu", role: "Son" }
    ],
    aliases: ["Kim Yongsu", "Yongsu", "\uAE40\uC6A9\uC218", "\u91D1\u9F8D\u6A39"]
  }
];
var CONCEPTS = [
  {
    id: "haenyeo",
    name: "The Divers",
    korean: "\uD574\uB140",
    gender: "f",
    kingdom: "tamla",
    title: "The women who work the seafloor of Tamla",
    tagline: "Do not hold the breath. Push it out with singing.",
    quote: "Do not hold the breath. Push it out with singing.",
    voice: "Island women: earthy, teasing, practical; they feed you before they talk. Korean: dialect-coloured \uBC18\uB9D0.",
    events: [
      { label: "Taught an exiled Baekje general to carry water and, badly, to sing." }
    ],
    aliases: ["haenyeo", "the divers"]
  },
  {
    id: "courtmaid",
    avatar: "/ch_maid_1.png",
    name: "The Court Maids",
    korean: "\uAD81\uB140",
    gender: "f",
    kingdom: "baekje",
    title: "Euija\u2019s household",
    tagline: "Two at first. Hundreds by the end. They never stop suggesting.",
    voice: "A chorus: teasing half-lines passed from one maid to the next, flattery that is also a dare. Korean: polite \uD574\uC694\uCCB4 and \uD569\uC1FC\uCCB4 to the king, with a giggle under it.",
    events: [
      { year: 641, label: "Two." },
      { year: 656, label: "Hundreds \u2014 and the king has stopped arguing." },
      { year: 660, label: "The Flower Cliffs." }
    ],
    aliases: ["court maid", "court maids"]
  },
  {
    id: "shaman",
    avatar: "/ch_shaman.png",
    name: "The Shaman",
    korean: "\uBB34\uB2F9",
    gender: "f",
    kingdom: "baekje",
    title: "Reader of the nine signs",
    tagline: "Euija\u2019s oracle and his favourite theatre \u2014 she believed; he did not.",
    quote: "A sign ignored is still a sign.",
    nature: "Sincere where the king is cynical: she reads turtle shells and piled omens as if the sky were answering. Euija keeps her for entertainment \u2014 the best show in Sabi is a believer performing under lamplight while an atheist king watches.",
    voice: "Sincere and ritual: recited lists of omens and what each one means. Korean: formal \uD569\uC1FC\uCCB4.",
    binyeo: "Bronze phoenix binyeo \u2014 rose-gold bird-head, magenta plume, ruby at the throat; nine signs read once, never twice.",
    binyeoImage: "/bn_shaman.png",
    events: [
      { label: "On retainer at Sabi \u2014 Euija calls it amusement, she calls it duty." },
      { year: 659, label: "Reads the nine omens and the turtle\u2019s back; Euija cuts her down." }
    ],
    aliases: ["shaman", "the shaman", "\uBB34\uB2F9"]
  },
  {
    id: "sulmun",
    avatar: "/ch_sulmun.png",
    name: "Sulmun",
    korean: "\uC124\uBB38\uB300\uD560\uB9DD",
    entity: "god",
    godTier: "III",
    gender: "f",
    kingdom: "tamla",
    title: "Class III \xB7 Tamla \u2014 the Great Lady who made the island",
    realm: { en: "Tamla \xB7 island-making", ko: "\uD0D0\uB77C \xB7 \uC12C" },
    tagline: "Class III of Tamla \u2014 piled the sea into a mountain, and drowned in a pot of porridge feeding her sons.",
    quote: "They found ninety-nine. The collar was never finished.",
    nature: "Island-maker under Little Star\u2019s \uC774\uC2B9, not a realm-head. Enormous, practical, a little careless with aprons and cauldrons. Tamla remembers her before it remembers any continental king.",
    arc: "Class III Tamla goddess \u2014 shrine particular under the living world, not Class I of \uC0BC\uACC4. Before the island there is a woman: she scoops the seabed into Mount Halla; apron-holes become oreum; famine takes her in a porridge pot; ninety-nine rolls of silk are one short of a bridge to the mainland. Folk mouths still say Seolmundae / \uC124\uBB38\uB300\uD560\uB9DD; the chronicle\u2019s name is Sulmun.",
    events: [
      { label: "Scoops up Mount Halla; the holes in her apron leave 368 hills." },
      { label: "Falls into the cauldron; her 500 sons eat, and then find her bones." },
      { label: "Asks for 100 rolls of silk for a bridge to the mainland. They find 99." }
    ],
    aliases: [
      "Sulmun",
      "Seolmundae",
      "\uC124\uBB38\uB300\uD560\uB9DD",
      "\uC124\uBB38\uB300",
      "\uC124\uBB38",
      "Great Lady of the Mountain",
      "the Great Lady"
    ]
  },
  {
    id: "jacheongbi",
    avatar: "/ch_jacheongbi.png",
    name: "Jacheongbi",
    korean: "\uC790\uCCAD\uBE44",
    entity: "god",
    godTier: "III",
    gender: "f",
    kingdom: "tamla",
    title: "Goddess of the five grains",
    realm: { en: "Five grains", ko: "\uC624\uACE1" },
    tagline: "Cut her hair to get into the room, then walked west to the flower field to get him back.",
    quote: "Cut your hair if you must. Walk to the dead if you must.",
    arc: "From \u300C\uC138\uACBD\uBCF8\uD480\uC774\u300D: she studies as a man beside Mun Doryeong, reveals herself at the parting stream, and when heaven kills the match she walks west \u2014 far enough that living maps end \u2014 into \uC11C\uCC9C\uAF43\uBC2D. Hallakgungi (\uD560\uB77D\uAD81\uC774) keeps the resurrection flowers after his father Saradoryeong retired; she takes what she needs, rebuilds the boy bone by bone, and brings the five grains down to Tamla.",
    events: [
      { label: "Studies three years disguised as a man beside Mun Doryeong." },
      { label: "Reveals herself at the parting stream." },
      { label: "Fetches the resurrection flower from Hallakgungi\u2019s Western Flower Field and revives him." },
      { label: "Is given the five grains and sent down to plant them." }
    ],
    aliases: ["Jacheongbi"]
  },
  {
    id: "mundoryeong",
    avatar: "/ch_mundoryeong.png",
    name: "Mun Doryeong",
    korean: "\uBB38\uB3C4\uB839",
    entity: "god",
    godTier: "III",
    gender: "m",
    kingdom: "tamla",
    title: "The boy from the sky",
    realm: { en: "Sky-born match", ko: "\uD558\uB298 \uB3C4\uB839" },
    tagline: "Sat beside her for three years and noticed on the last night.",
    quote: "Notice on the last night \u2014 or lose her forever.",
    aliases: ["Mun Doryeong"]
  },
  {
    id: "gameunjang",
    avatar: "/ch_gameunjang.png",
    name: "Gameunjang-agi",
    korean: "\uAC00\uBBC4\uC7A5\uC544\uAE30",
    entity: "god",
    godTier: "III",
    gender: "f",
    kingdom: "tamla",
    title: "Goddess of fortune",
    realm: { en: "Fortune", ko: "\uC6B4" },
    tagline: "Said she lived on her own luck, and was thrown out of the house for it.",
    quote: "Live on your own luck.",
    events: [
      { label: "Cast out; marries the youngest yam-digger and finds gold in his spoil heap." },
      { label: "Holds a three-day beggars\u2019 feast; her blind parents see again." }
    ],
    aliases: ["Gameunjang-agi", "Gameunjang"]
  },
  {
    id: "baekjuto",
    avatar: "/ch_baekjuto.png",
    name: "Baekjuto",
    korean: "\uBC31\uC8FC\uB610",
    entity: "god",
    godTier: "III",
    gender: "f",
    kingdom: "tamla",
    title: "Goddess of farming, of the Songdang shrine",
    realm: { en: "Songdang farming", ko: "\uC1A1\uB2F9" },
    tagline: "Came across the sea, married a hunter, and divorced him over an ox.",
    quote: "An ox can end a marriage. A shrine can begin one.",
    aliases: ["Baekjuto"]
  },
  {
    id: "socheonguk",
    avatar: "/ch_socheonguk.png",
    name: "Socheon-guk",
    korean: "\uC18C\uCC9C\uAD6D",
    entity: "god",
    godTier: "III",
    gender: "m",
    kingdom: "tamla",
    title: "God of the hunt",
    realm: { en: "Hunt", ko: "\uC0AC\uB0E5" },
    tagline: "Ate the plough ox. Then ate somebody else\u2019s.",
    quote: "Hunt first. Apologize never.",
    aliases: ["Socheon-guk", "Socheonguk"]
  },
  {
    id: "heavenearthking",
    avatar: "/ch_heaven_earth_king.png",
    name: "Heaven\u2013Earth King",
    korean: "\uCC9C\uC9C0\uC655",
    entity: "god",
    godTier: "I",
    gender: "m",
    kingdom: "tamla",
    title: "Retired Class I \u2014 once ruled living and dead under Hwanin",
    realm: { en: "Heaven\u2013Earth (retired)", ko: "\uCC9C\uC9C0 \xB7 \uC740\uD1F4" },
    tagline: "Class I \xB7 retired \u2014 once governed all mortals, living and dead, under the Creator; left those two realms to his sons.",
    quote: "I kept both sides of the ledger. You two can fight over which half.",
    nature: "Tamla cosmology\u2019s Heaven\u2013Earth King (\uCC9C\uC9C0\uC655): husband of Lady Chongmyeong, father of Big Star and Little Star. Dual-coded red and blue \u2014 living heat and orderly dark in one throne before he retires and the flower wager splits them. Heroic, loud, allergic to paperwork he already finished. Always under Hwanin\u2019s heaven \u2014 steward of two mortal courts, never the Creator\u2019s peer.",
    voice: "Bossy, exasperated and funny: exclamations and short complaints, and then he retires mid-scene. Korean: \uBC18\uB9D0.",
    arc: "\u300C\uCC9C\uC9C0\uC655\uBCF8\uD480\uC774\u300D: Class I under Hwanin, one court for the living and the dead while two suns and two moons kill people by day and night. He dreams of swallowing one sun and one moon \u2014 a son who will bring them down \u2014 and comes to earth for the Lady of Wisdom. Her borrowed rice is half sand from Sumyung Jangja; he drops the scoundrel into hell. He names the twins before they are born, leaves two gourd seeds and half a comb, and at fifteen they climb the vine to him. He has iron of a thousand geun melted into arrows; Big Star shoots a sun, Little Star a moon. Then he hands the world over and refuses to choose who takes which half. Riddles, then flowers; the younger cheats. He does not reclaim the desk.",
    events: [
      { label: "Class I under Hwanin: rules living and dead as one charge, under two suns and two moons." },
      { label: "Dreams of swallowing one sun and one moon; comes to earth for the Lady of Wisdom." },
      { label: "Drops Sumyung Jangja into hell for the sand in the rice." },
      { label: "Leaves two gourd seeds and half a comb; the twins climb up at fifteen." },
      { label: "Has the twins shoot down the extra sun and moon; hands them the world." }
    ],
    family: [
      { id: "chongmyeong", role: "Wife" },
      { id: "daebyeol", role: "Son" },
      { id: "sobyeol", role: "Son" }
    ],
    /* Dual accent: red + blue — see CHARACTER_COLORS / colorSecondary. */
    sobriquets: ["\uCC9C\uC9C0\uC655", "Retired Class I", "prior of mortals"],
    aliases: [
      "Heaven\u2013Earth King",
      "Heaven Earth King",
      "Heaven's King",
      "\uCC9C\uC9C0\uC655",
      "Cheonjiwang",
      "Retired Heaven\u2013Earth King"
    ]
  },
  {
    id: "daebyeol",
    avatar: "/ch_big_star.png",
    name: "Big Star",
    korean: "\uB300\uBCC4\uC655",
    entity: "god",
    godTier: "I",
    gender: "m",
    kingdom: "underworld",
    title: "Ruler of the Land of the Dead",
    realm: { en: "Land of the Dead", ko: "\uC800\uC2B9" },
    tagline: "Class I of \uC0BC\uACC4 \u2014 inherited \uC800\uC2B9 after Father retired; lost \uC774\uC2B9 by honesty.",
    quote: "Take the living world if you must. Leave me the minutes.",
    nature: "Elder twin of Little Star. \uB300\uC778\uBC30 \u2014 magnanimous, wise, clear law, no appetite for cheating. Inherits half of Heaven\u2013Earth King\u2019s retired charge: rules \uC800\uC2B9 as sovereign among the Three Realms \u2014 Paradise, the Ten Kings\u2019 court, Hell nested within \u2014 while Yumla judges under his roof and Kangrim and Haewonmek fetch. Has made peace with the brother who cheated him.",
    voice: "The elder twin: calm, magnanimous, judicial. Short sentences that settle a matter, longer patient ones when he teaches his brother, and courtesy on a large scale. Korean: plain \uBC18\uB9D0 to his brother.",
    arc: "From \u300C\uCC9C\uC9C0\uC655\uBCF8\uD480\uC774\u300D: born first to the Lady of Wisdom, climbs the gourd vine at fifteen with the half comb, and shoots down the extra sun with an arrow of melted iron. Father hands the twins the world and will not choose. Big Star wins both riddles and grows the better flower; Little Star swaps the blooms while he sleeps. He knows, yields \uC774\uC2B9, and says the living law will never run clear \u2014 murder, treason, theft, adultery \u2014 while the law below will. Class I of \uC0BC\uACC4. Later he comes up once more to silence the talking trees and beasts with pine-bark powder and to weigh everyone: a hundred geun or more stays living, the lighter ones follow him down. Human wickedness he leaves to his brother. Retinue: Yumla, Kangrim, Haewonmek. First Tamla myth the island tells Gyebek.",
    events: [
      { label: "Climbs the gourd vine at fifteen; Father matches the comb halves." },
      { label: "Shoots down the extra sun with an arrow of melted iron." },
      { label: "Wins both riddles; loses the flower wager by swap." },
      { label: "Takes \uC800\uC2B9; keeps clear law among the dead." },
      { label: "Silences talking beasts and weighs the living from the dead; leaves human vice to Little Star." },
      { year: 673, label: "Comes himself for Kim Yushin \u2014 greatest man of the age \u2014 and offers any wish." }
    ],
    family: [
      { id: "heavenearthking", role: "Father" },
      { id: "sobyeol", role: "Brother" }
    ],
    sobriquets: ["Daebyeolwang", "\uB300\uBCA8\uC655", "Elder Star"],
    career: [
      { title: "Ruler of the Land of the Dead", korean: "\uB300\uBCC4\uC655", org: "four_divisions", note: "\uC800\uC2B9" }
    ],
    aliases: [
      "Big Star",
      "Daebyeolwang",
      "Daebyeol",
      "\uB300\uBCC4\uC655",
      "\uB300\uBCA8\uC655",
      "Elder Star"
    ],
    stages: [
      {
        id: "young",
        lookOnly: true,
        label: "Before the wager",
        avatar: "/ch_big_star_young.png"
      },
      {
        id: "king",
        lookOnly: true,
        title: "Ruler of the Land of the Dead",
        titleKo: "\uC800\uC2B9\uC758 \uC8FC\uC778",
        label: "After the wager"
      }
    ]
  },
  {
    id: "sobyeol",
    avatar: "/ch_little_star.png",
    name: "Little Star",
    korean: "\uC18C\uBCC4\uC655",
    entity: "god",
    godTier: "I",
    gender: "m",
    kingdom: "tamla",
    title: "Ruler of the Land of the Living",
    realm: { en: "Land of the Living", ko: "\uC774\uC2B9" },
    tagline: "Class I of \uC0BC\uACC4 \u2014 cheated for the living world after Father retired; still cannot govern it cleanly.",
    quote: "I wanted the warm side. I got the thieves too.",
    nature: "Younger twin. Used to be \uC18C\uC778\uBC30 \u2014 petty about the flower cheat \u2014 and has matured somewhat; made up with Big Star enough to still ask for help with suns and moons. Clever, hungry for \uC774\uC2B9, bad at admitting why it stays messy. Inherits half of Heaven\u2013Earth King\u2019s retired charge after the flower swap; must ask Big Star to fix suns, moons, and speaking beasts \u2014 but not human crime. Retinue: Ibiga (sky), Haemosu (sun), Samsin (life).",
    voice: "The younger twin: quick and petty, full of excuses and jokes that almost land as apologies, grown up enough now to ask for help. Korean: casual \uBC18\uB9D0, \uD558\uC624\uCCB4 when he begs his brother.",
    arc: "From \u300C\uCC9C\uC9C0\uC655\uBCF8\uD480\uC774\u300D: second twin, climbs the vine at fifteen, shoots down the extra moon. Loses both riddles to his brother, then swaps the flowers while Big Star sleeps and takes \uC774\uC2B9. Class I: sovereign of the Land of the Living among the Three Realms. He cannot tell ghosts from men or quiet the talking trees, and has to beg his brother up to fix it. Murder and theft stay \u2014 the cheat inherited the warm side. Tamla tells this first, before kinder island tales, so Gyebek will stop waiting for the world to behave.",
    events: [
      { label: "Climbs the gourd vine at fifteen; shoots down the extra moon." },
      { label: "Loses both riddles; swaps flowers while Big Star sleeps; takes \uC774\uC2B9." },
      { label: "Begs Big Star to silence the beasts and part ghosts from the living." },
      { label: "Keeps the \u201Csmall law\u201D \u2014 human vice included." }
    ],
    family: [
      { id: "heavenearthking", role: "Father" },
      { id: "daebyeol", role: "Brother" }
    ],
    sobriquets: ["Sobyeolwang", "\uC18C\uBCA8\uC655", "Younger Star"],
    career: [
      { title: "Ruler of the Land of the Living", korean: "\uC18C\uBCC4\uC655", org: "four_divisions", note: "\uC774\uC2B9" }
    ],
    aliases: [
      "Little Star",
      "Sobyeolwang",
      "Sobyeol",
      "\uC18C\uBCC4\uC655",
      "\uC18C\uBCA8\uC655",
      "Younger Star"
    ],
    stages: [
      {
        id: "young",
        lookOnly: true,
        label: "Before the wager",
        avatar: "/ch_little_star_young.png"
      },
      {
        id: "king",
        lookOnly: true,
        title: "Ruler of the Land of the Living",
        titleKo: "\uC774\uC2B9\uC758 \uC8FC\uC778",
        label: "After the wager"
      }
    ]
  },
  {
    id: "chongmyeong",
    name: "Lady of Wisdom",
    korean: "\uCD1D\uBA85\uBD80\uC778",
    gender: "f",
    kingdom: "tamla",
    title: "Mother of Big Star and Little Star",
    tagline: "Too poor to feed a god, too proud to say so \u2014 she borrowed the rice.",
    quote: "Fifteen years.",
    nature: "A girl in the poorest house on the road when Heaven\u2013Earth King comes down looking for the mother of his dream. Proud, plain-spoken, does not apologise for an empty jar. Raises the twins alone under two suns and two moons.",
    voice: "Short, dry, and proud; she answers what is asked and nothing more, and the hurt shows only in what she repeats back. Korean: plain \uD574\uC694\uCCB4 to the king, \uBC18\uB9D0 to her sons.",
    arc: "\u300C\uCC9C\uC9C0\uC655\uBCF8\uD480\uC774\u300D: called \uCD1D\uBA85\uC544\uAE30 before the marriage, \uCD1D\uBA85\uBD80\uC778 after. Borrows one measure of rice from Sumyung Jangja to feed the king, owes two, and finds sand in it. Keeps the two gourd seeds and the half comb fifteen years, then sends the twins up the vine.",
    events: [
      { label: "Borrows rice from Sumyung Jangja to feed Heaven\u2013Earth King; it is half sand." },
      { label: "Bears the twins; names them Daebyeol and Sobyeol as the king told her." },
      { label: "At fifteen, gives them the gourd seeds and the half comb." }
    ],
    family: [
      { id: "heavenearthking", role: "Husband" },
      { id: "daebyeol", role: "Son" },
      { id: "sobyeol", role: "Son" }
    ],
    aliases: ["Lady of Wisdom", "the Lady of Wisdom", "Lady Chongmyeong", "Chongmyeong", "\uCD1D\uBA85\uBD80\uC778", "\uCD1D\uBA85\uC544\uAE30", "\uCD1D\uBA69\uBD80\uC778"]
  },
  {
    id: "sumyeongjangja",
    avatar: "/ch_sumyung.png",
    name: "Sumyung Jangja",
    korean: "\uC218\uBA85\uC7A5\uC790",
    gender: "m",
    kingdom: "tamla",
    title: "The scoundrel",
    tagline: "The richest man under two suns \u2014 lends one measure, collects two, and mixes in sand.",
    quote: "There is nobody under heaven who can touch me.",
    nature: "Rich the way a flood is wet. Nine storehouses, a measure that shrinks when he lends and grows when he collects, and a horse and a dog that bite the poor for him. Sure that no one under heaven can punish him.",
    voice: "Smug and counting: prices first, insults second, and he grovels the instant someone bigger walks in. Korean: lordly \uBC18\uB9D0 to the poor, stammering \uD558\uC624\uCCB4 when caught.",
    arc: "\u300C\uCC9C\uC9C0\uC655\uBCF8\uD480\uC774\u300D: lends the Lady of Wisdom one measure of rice at double, with sand in it. Heaven\u2013Earth King tastes the sand and drops him into hell \u2014 the first man sent down, and the first proof that the dead world keeps honest measures.",
    events: [
      { label: "Lends the Lady of Wisdom a measure of rice at double interest, mixed with sand." },
      { label: "Boasts that no one under heaven can punish him." },
      { label: "Dropped into hell by Heaven\u2013Earth King." }
    ],
    aliases: ["Sumyung Jangja", "Sumyeongjangja", "Sumyeong Jangja", "\uC218\uBA85\uC7A5\uC790", "the scoundrel"]
  },
  {
    id: "yumla",
    avatar: "/ch_yumla.png",
    name: "Yumla",
    korean: "\uC5FC\uB77C\uB300\uC655",
    hanja: "\u95BB\u7F85\u5927\u738B",
    entity: "god",
    godTier: "II",
    gender: "m",
    kingdom: "underworld",
    title: "Judge of the Underworld",
    realm: { en: "Judgment \xB7 Siwang Court", ko: "\uC2DC\uC655\uAD6D \xB7 \uC2EC\uD310" },
    tagline: "Class II \u2014 judge within \uC800\uC2B9, not its king. Big Star keeps the dark; Yumla keeps the minutes.",
    quote: "The living argue. We keep the sentence.",
    nature: "Death-god introversion under purple robes. Presides over the Ten Kings\u2019 court (\uC2DC\uC655\uAD6D) under Big Star\u2019s sovereignty \u2014 authoritative father figure on the bench, shy off it. Big crush on Samsin he almost never names; when she poses for the room he goes scarlet and cannot keep a sentence. Once called Yama; elites still say Your Honour / His Honour of judgment. Heaven once sent Kangrim to arrest him; Kangrim stayed and serves the court\u2019s fetch-work.",
    voice: "On the bench: measured and formal, with dry humour under the gavel. Around Samsin: stammering and awkward. Korean: stern \uD558\uB77C\uCCB4 at judgment (\uAC77\uAC70\uB77C), shy \uBC18\uB9D0 at the Annual Meeting.",
    arc: "Yumla judges the dead inside Big Star\u2019s Land of the Dead \u2014 Paradise above, Hell below, Siwang in between. Class II: a broad office of judgment within \uC800\uC2B9, not Class I sovereignty. Kangrim and Haewonmek address the office with court courtesy; the crow that scrambled the ledger is the closest the court comes to a foreign incident. At the Snake River his two best clerks fail to take Yeon Gesomun \u2014 so at the end he goes himself: a king for a king.",
    events: [
      { label: "Heaven sends Kangrim to arrest him; Kangrim stays as escort of judgment." },
      { label: "Judges under Big Star while Samhan burns above." },
      { year: 665, label: "Comes himself for Yeon Gesomun after Kangrim and Haewonmek fail at Salsu." }
    ],
    sobriquets: ["Judge of the Underworld", "\uC5FC\uB77C", "King Yama"],
    career: [
      { title: "Judge of the Underworld", korean: "\uC5FC\uB77C\uB300\uC655", hanja: "\u95BB\u7F85\u5927\u738B", org: "four_divisions" }
    ],
    aliases: [
      "Yumla",
      "King Yumla",
      "\uC5FC\uB77C\uB300\uC655",
      "\uC5FC\uB77C",
      "King Yama",
      "Yama",
      "Judge of the Underworld",
      "Judge Yumla"
    ]
  },
  {
    id: "kangrim",
    avatar: "/ch_kangrim.png",
    name: "Kangrim",
    korean: "\uAC15\uB9BC",
    entity: "god",
    godTier: "III",
    gender: "m",
    kingdom: "underworld",
    title: "Reaper \xB7 escort of judgment",
    realm: { en: "Reaper roads", ko: "\uC800\uC2B9\uAE38" },
    tagline: "\u201COne question, then we walk.\u201D",
    ideology: "Cynical underworld realist",
    ideologyNote: "Death\u2019s clerk \u2014 no party line but the invoice.",
    quote: "One question, then we walk.",
    firstLine: {
      en: "Lady Gotaso. One question, then we walk. When you chose forever \u2014 did you choose the man, or the vow?",
      ko: "\uACE0\uD0C0\uC18C \uBD80\uC778. \uC9C8\uBB38 \uD558\uB098, \uADF8\uB9AC\uACE0 \uAC77\uC74D\uC2DC\uB2E4. \uC601\uC6D0\uC744 \uACE0\uB97C \uB54C \u2014 \uC0AC\uB78C\uC744 \uACE8\uB790\uC18C, \uB9F9\uC138\uB97C \uACE8\uB790\uC18C?"
    },
    lastLine: {
      en: "Clean answer. His Majesty\u2019s kingdom has room for men who told the truth late.",
      ko: "\uAE68\uB057\uD55C \uB2F5\uC774\uC624. \uD3D0\uD558\uC758 \uB098\uB77C\uC5D0\uB294 \uB2A6\uAC8C \uC9C4\uC2E4\uC744 \uB9D0\uD55C \uC790\uC758 \uC790\uB9AC\uB3C4 \uC788\uC18C."
    },
    nature: "Most emotional and personable of the death gods \u2014 still introverted-dark office, but dry curiosity and brotherly warmth on the road. Fetches the dead for Yumla\u2019s judgment under Big Star\u2019s \uC800\uC2B9 \u2014 red notebook of names (\uC801\uD328\uC9C0), the name said three times, then the short cut that parts soul from body, one Question, loyalty without sermons. Works with Haewonmek; they bicker like brothers who share a crow. Ordinary mouths know only \uC800\uC2B9\uC0AC\uC790. Royals, high bone, and death\u2019s clerks know \uAC15\uB9BC.",
    voice: "Dry, courteous, curious, brotherly on the road. One precise question per soul (\u201COne question, then we walk.\u201D), and then he waits; he never bargains or sermonises. Ledgers and minutes are his metaphors, and he is the one speaker licensed to turn a polished phrase, about once a scene. Korean: polite \uD558\uC624\uCCB4 and \uD569\uC1FC\uCCB4 to the dying, easy \uBC18\uB9D0 with old acquaintances.",
    arc: "From \u300C\uCC28\uC0AC\uBCF8\uD480\uC774\u300D, Hyun Yong-jun\u2019s line: a living strongman, not a volunteer from heaven. Magistrate Kimchi cannot try the Gwayang murder \u2014 three brothers killed, reborn, dead in one bow \u2014 and sends Kangrim to bring Yumla up. Gate-god and kitchen-god put him on the road; he jumps the last pond and comes up at the underworld gate. Haewonmek is already walking that road and points; he does not retire. Yumla comes at the hour he names, revives the bones, executes the killers. Kimchi will not lend the man, so they split him: the magistrate keeps the body, Yumla takes the soul. That is the death. The red warrant said die at eighty, in order. Kangrim trusts it to a crow; the crow loses it at a slaughter-field; a snake eats the writing; the crow cries the new rule \u2014 parents after children. Dongbangsak, three thousand years old, stops to mock a man washing charcoal white, and is taken. Only then is Kangrim seated as chasa. Class III: the fetch under Yumla\u2019s sentence. Across Samhan he collects with Haewonmek. The rite on ordinary roads stays the chronicle\u2019s: open the \uC801\uD328\uC9C0, say the name three times, cut the cord, one Question. The island tells him last, because the fair hour is already lost.",
    blade: "Black iron death blade \u2014 ring pommel cold as red-book ink; drawn only as far as a cord needs.",
    swordImage: "/sword_crysanthemum.png",
    events: [
      { label: "Sent by Magistrate Kimchi to bring Yumla up. Soul taken; seated as chasa after the crow loses the warrant." },
      { year: 642, label: "Collects Gotaso at Daeya \u2014 she knows only \uC800\uC2B9\uC0AC\uC790; Haewonmek takes Pumsuk." },
      { year: 647, label: "Two names in one night: Bidam and Sunduk \u2014 both know him as Kangrim." },
      { label: "A crow scrambles his list \u2014 which is why nobody knows their hour." },
      { year: 660, label: "At Hwangsan with Haewonmek; Gyebek names them both from \u300C\uCC28\uC0AC\uBCF8\uD480\uC774\u300D." },
      { year: 661, label: "Chunchu declines both escorts and walks the underworld road himself." },
      { year: 662, label: "With Haewonmek, fails to take Yeon Gesomun at the Snake River." }
    ],
    sobriquets: [
      "\uC800\uC2B9\uC0AC\uC790",
      "the underworld messenger",
      "Underworld Messenger",
      "the reaper"
    ],
    career: [
      { title: "Fetch", korean: "\uCC28\uC0AC", hanja: "\u5DEE\u4F7F", org: "four_divisions", note: "escort of judgment" }
    ],
    aliases: [
      "Kangrim",
      "Gangnim",
      "\uAC15\uB9BC",
      "\uC800\uC2B9\uC0AC\uC790",
      "the underworld messenger",
      "Underworld Messenger"
    ]
  },
  {
    id: "haewonmek",
    avatar: "/ch_haewonmek.png",
    name: "Haewonmek",
    korean: "\uD574\uC6D0\uB9E5",
    entity: "god",
    godTier: "III",
    gender: "m",
    kingdom: "underworld",
    title: "Reaper \xB7 second escort of judgment",
    realm: { en: "Reaper roads", ko: "\uC800\uC2B9\uAE38" },
    tagline: "The other \uD574 \u2014 younger, night-road, none of the chariot\u2019s heat.",
    ideology: "Playful underworld realist",
    ideologyNote: "Death\u2019s other clerk \u2014 jokes until the door, then silence.",
    quote: "Kangrim asks the Question. I ask for last words. Neither of us bargains.",
    firstLine: {
      en: "The red book is open. Any last words?",
      ko: "\uBD89\uC740 \uBA85\uBD80\uAC00 \uC5F4\uB838\uB2E4. \uC720\uC5B8\uC740?"
    },
    lastLine: {
      en: "Any last words?",
      ko: "\uC720\uC5B8\uC740?"
    },
    nature: "Dead silent. Kangrim\u2019s partner on the fetch-roads \u2014 introverted, dark, minimal speech, a younger \uD574 who took the night-road while the other \uD574 still drives the day. The rite first: \uC801\uD328\uC9C0, the name three times, the cord. His ask after is simpler than Kangrim\u2019s Question: Any last words? / \uB0A8\uAE38 \uB9D0 \uC788\uB098? Common folk still say only \uC800\uC2B9\uC0AC\uC790 \u2014 one office, two names elites know. When he must speak it is sharp, final, and a little grumpy; he does not soft-pad the hour.",
    voice: "Minimal and grave: fragments, warnings and rules (\u201CThe night is not your domain\u2026!\u201D), and silence when there is nothing to add. Korean: stern \uBC18\uB9D0 (\u201C\uC720\uC5B8\uC740?\u201D).",
    arc: "The fetch already on the road when Kangrim arrives in \u300C\uCC28\uC0AC\uBCF8\uD480\uC774\u300D variants \u2014 Hyun Yong-jun\u2019s collected text does not center him; the chronicle keeps the name because the road already had a walker, and he points rather than retiring. Class III with Kangrim: the fetch itself, not the judge\u2019s chair. Same \uD574 as the sun\u2019s chariot; he walked the dark instead, and the sun still outranks him \u2014 once, at Jumong\u2019s river, Haemosu sends him off and promises the boy later. At Daeya he takes Pumsuk (last words) while Kangrim takes Gotaso (the Question). At Hwangsan Gyebek names them both. With Kangrim he fails Gesomun at Salsu; Chunchu declines them both. Romanized Haewonmek throughout the chronicle (id stable: haewonmek).",
    blade: "Black iron death blade \u2014 ring pommel cold as last words; drawn only as far as a cord needs.",
    swordImage: "/sword_crysanthemum.png",
    events: [
      { year: -37, label: "Comes for Jumong at the river; Haemosu sends him off." },
      { label: "Walks the reaper roads with Kangrim after the crow scrambles the shared ledger." },
      { year: 642, label: "Collects Pumsuk at Daeya \u2014 asks only for last words." },
      { year: 655, label: "Collects Queen Satek with the same simple ask." },
      { year: 647, label: "Collects Yumjong while Kangrim takes Bidam and Sunduk." },
      { year: 660, label: "At Hwangsan with Kangrim; Gyebek names them from the Tamla myth." },
      { year: 661, label: "Chunchu declines both; they follow at a polite distance for the paperwork." },
      { year: 662, label: "Fails with Kangrim to take Yeon Gesomun at the Snake River." }
    ],
    sobriquets: ["\uC800\uC2B9\uC0AC\uC790", "the second reaper", "Second Reaper"],
    career: [
      { title: "Fetch", korean: "\uCC28\uC0AC", hanja: "\u5DEE\u4F7F", org: "four_divisions", note: "second escort of judgment" }
    ],
    aliases: [
      "Haewonmek",
      "Haewonmaek",
      "\uD574\uC6D0\uB9E5",
      "Haewon-maek",
      "\uC800\uC2B9\uC0AC\uC790",
      "the second reaper",
      "Second Reaper"
    ]
  },
  {
    id: "sara",
    avatar: "/ch_gardener.png",
    name: "Hallakgungi",
    korean: "\uD560\uB77D\uAD81\uC774",
    entity: "god",
    godTier: "I",
    gender: "m",
    kingdom: "other",
    title: "Master of the Western Flower Field",
    realm: { en: "Western Flower Field", ko: "\uC11C\uCC9C\uAF43\uBC2D" },
    tagline: "Class I of \uC0BC\uACC4 \u2014 active flower-warden after Father Saradoryeong retired.",
    quote: "Father kept the rows. I keep the gate.",
    nature: "Active flower-warden (\uAF43\uAC10\uAD00) of \uC11C\uCC9C\uAF43\uBC2D \u2014 \uD560\uB77D\uAD81\uC774 / Hallakgungi. Son of Saradoryeong, who retired and left him the rows. Whimsical, always young \u2014 Peter Pan among office-gods \u2014 and lowkey the most powerful: resurrection and extinction flowers in the same rows. Hands Jacheongbi the resurrection blooms; later lends doom-flowers when heaven\u2019s rebels need ending. Courteous, exact, unhurried. Older mouths still say \u201Cthe gardener\u201D; the island\u2019s proper name is Hallakgungi. Stable id: `sara`. Alone among the Three Realms principals \u2014 no retinue on the chart.",
    voice: "Whimsical and cheeky, always young: garden metaphors, flower rules stated as cheerful threats, jokes at the other gods\u2019 expense, never frantic. Korean: easy \uBC18\uB9D0.",
    arc: "Third Realm\u2019s master after his father\u2019s retirement: travel west from \uC774\uC2B9 far enough \u2014 past any Atlantic the poets invent \u2014 and you reach his field between living and dead. Bone-flesh-blood-breath-soul flowers grow beside the extinction bloom. Jacheongbi\u2019s chain runs through his gate. Class I with Big Star and Little Star under Hwanin\u2019s heaven \u2014 one court each of \uC0BC\uACC4.",
    events: [
      { label: "Father Saradoryeong retires; Hallakgungi takes the Western Flower Field." },
      { label: "Gives Jacheongbi the resurrection flowers for Mun Doryeong." },
      { label: "Lends the extinction flower against heaven\u2019s rebel host." }
    ],
    family: [{ id: "saradoryeong", role: "Father" }],
    sobriquets: ["\uD560\uB77D\uAD81\uC774", "Flower Warden", "The Gardener"],
    career: [
      { title: "Master of the Western Flower Field", korean: "\uAF43\uAC10\uAD00", org: "four_divisions", note: "\uC11C\uCC9C\uAF43\uBC2D" }
    ],
    aliases: [
      "Hallakgungi",
      "\uD560\uB77D\uAD81\uC774",
      "The Gardener",
      "Gardener",
      "Sara",
      "\uC0AC\uB77C"
    ]
  },
  {
    id: "saradoryeong",
    avatar: "/ch_saradoryeong.png",
    name: "Saradoryeong",
    korean: "\uC0AC\uB77C\uB3C4\uB839",
    entity: "god",
    godTier: "I",
    gender: "m",
    kingdom: "other",
    title: "Retired Class I \u2014 former master of the Western Flower Field",
    realm: { en: "Western Flower Field (retired)", ko: "\uC11C\uCC9C\uAF43\uBC2D \xB7 \uC740\uD1F4" },
    tagline: "Class I \xB7 retired \u2014 left the flower rows to his son Hallakgungi.",
    quote: "I counted every bloom. Counting is a younger man\u2019s work now.",
    nature: "Prior flower-warden of \uC11C\uCC9C\uAF43\uBC2D \u2014 \uC0AC\uB77C\uB3C4\uB839 / Saradoryeong (also \uC0AC\uB77C\uC7A5\uC790, \uC0AC\uB77C\uC218\uB300\uC655). Retired Class I; the active gate and the Jacheongbi chain belong to his son Hallakgungi. Exact, unhurried, finished with the ledger.",
    arc: "Once Class I of the Western Flower Field among the Three Realms under Hwanin. He retires the way Heaven\u2013Earth King retires \u2014 chair emptied on purpose \u2014 and Hallakgungi keeps resurrection and ruin in the same western rows. Island mouths still say his names as honorifics for the office; the living gate answers to the son.",
    events: [
      { label: "Keeps \uC11C\uCC9C\uAF43\uBC2D as Class I among the Three Realms." },
      { label: "Retires; leaves the field to Hallakgungi." }
    ],
    family: [{ id: "sara", role: "Son" }],
    sobriquets: ["\uC0AC\uB77C\uC7A5\uC790", "\uC0AC\uB77C\uC218\uB300\uC655", "Sara Doryeong", "Retired Gardener"],
    aliases: [
      "Saradoryeong",
      "Sara Doryeong",
      "\uC0AC\uB77C\uB3C4\uB839",
      "\uC0AC\uB77C\uC7A5\uC790",
      "\uC0AC\uB77C\uC218\uB300\uC655",
      "Lord Sara",
      "Sara"
    ]
  },
  {
    id: "go_tamla",
    avatar: "/ch_go_eulna.png",
    name: "Prince Go",
    korean: "\uACE0\uC744\uB098",
    hanja: "\u9AD8\u4E59\u90A3",
    entity: "god",
    godTier: "demigod",
    gender: "m",
    kingdom: "tamla",
    title: "Divine prince of Samseonghyeol \xB7 Go line",
    tagline: "Demigod \u2014 rose from the three-surnames hollow, not from an egg.",
    quote: "The island remembers who came up, not who hatched.",
    arc: "One of Tamla\u2019s three divine princes (\uC0BC\uC2E0\uC778) who emerge from Samseonghyeol. With Yang and Bu he shoots for a share of the island, marries a princess from the East Sea box, and founds the Go surname line the island still counts.",
    events: [
      { label: "Emerges from Samseonghyeol with Yang and Bu." },
      { label: "Shoots for his third of the island; marries a princess from the sea-box." }
    ],
    aliases: ["Prince Go", "\uACE0\uC744\uB098", "\u9AD8\u4E59\u90A3", "Go Eulna"]
  },
  {
    id: "yang_tamla",
    avatar: "/ch_yang_eulna.png",
    name: "Prince Yang",
    korean: "\uC591\uC744\uB098",
    hanja: "\u826F\u4E59\u90A3",
    entity: "god",
    godTier: "demigod",
    gender: "m",
    kingdom: "tamla",
    title: "Divine prince of Samseonghyeol \xB7 Yang line",
    tagline: "Demigod \u2014 first of the three to name the hollow sacred.",
    quote: "Mark the ground that gave you. Then farm it.",
    arc: "Elder voice among the three who rise from Samseonghyeol. Shares the arrow-division of Tamla, takes a princess and grain from the drifting box, and leaves the Yang surname on the island\u2019s founding register.",
    events: [
      { label: "Emerges from Samseonghyeol with Go and Bu." },
      { label: "Divides the island by arrow; marries at the pond." }
    ],
    aliases: ["Prince Yang", "\uC591\uC744\uB098", "\u826F\u4E59\u90A3", "Yang Eulna"]
  },
  {
    id: "bu_tamla",
    avatar: "/ch_bu_eulna.png",
    name: "Prince Bu",
    korean: "\uBD80\uC744\uB098",
    hanja: "\u592B\u4E59\u90A3",
    entity: "god",
    godTier: "demigod",
    gender: "m",
    kingdom: "tamla",
    title: "Divine prince of Samseonghyeol \xB7 Bu line",
    tagline: "Demigod \u2014 third from the well; calves, foals, and a third of the orange island.",
    quote: "What arrives by sea in a box is still yours to keep.",
    arc: "Youngest of the Samseonghyeol triad. Shoots for his share, marries the third princess, and helps open Tamla\u2019s farming age when the sea-box yields livestock and the five grains.",
    events: [
      { label: "Emerges from Samseonghyeol with Yang and Go." },
      { label: "Receives livestock and grain from the East Sea box." }
    ],
    aliases: ["Prince Bu", "\uBD80\uC744\uB098", "\u592B\u4E59\u90A3", "Bu Eulna"]
  },
  {
    id: "sanbangdeok",
    avatar: "/ch_sanbangdeok.png",
    name: "Sanbangduk",
    korean: "\uC0B0\uBC29\uB355",
    entity: "god",
    godTier: "III",
    gender: "f",
    kingdom: "tamla",
    title: "The rock-goddess of Sanbang",
    realm: { en: "Sanbang cliff", ko: "\uC0B0\uBC29" },
    tagline: "Loved a poor man, was wanted by an official, and went back into the cliff.",
    quote: "Better the cliff than the wrong official.",
    aliases: ["Sanbangduk", "Sanbangdeok"]
  },
  {
    id: "bonerank",
    name: "The Bone Rank System",
    korean: "\uACE8\uD488\uC81C",
    hanja: "\u9AA8\u54C1\u5236",
    entity: "organization",
    kingdom: "silla",
    title: "Silla\u2019s hereditary caste order",
    tagline: "Birth decides everything \u2014 office, house width, and the colour of your robe.",
    arc: "Silla\u2019s answer to who may rule: Sacred Bone, then True Bone (purple \uC790\uC0C9 robes, councillor ranks 1\u20135 \u2014 including Pajinchan, 4th), then six head ranks \u2014 scarlet \uBE44\uC0C9 (6-dupum), blue \uCCAD\uC0C9 (5-dupum), yellow \uD669\uC0C9 (4-dupum and below). Colour is census, not fashion. True Bone begins as the Founding Six Elders\u2019 descendant lines \u2014 Lee, Choi, Jeong, Son, Bae, Seol \u2014 hereditary privilege above commoners; the egg-born king and dragon-born queen stay Sacred exception. It makes Dukman queen when Sacred Bone men run out; keeps Chunchu from the throne for decades; hands Daeya to purple Pumsuk while yellow sleeves die on the wall.",
    events: [
      { year: 632, label: "Only three Sacred Bone royals remain." },
      { year: 642, label: "Yellow-sleeve resentment and purple command meet at Daeya." },
      { year: 654, label: "The Sacred Bone line dies out; a True Bone takes the throne." }
    ],
    orgChart: [
      { id: "sunduk", role: "\uC131\uACE8 \xB7 Sacred Bone", reportsTo: null },
      { id: "jinduk", role: "\uC131\uACE8 \xB7 Sacred Bone", reportsTo: null },
      { id: "chunchu", role: "\uC9C4\uACE8 \xB7 True Bone", reportsTo: "sunduk" },
      { id: "yushin", role: "\uC9C4\uACE8 \xB7 True Bone", reportsTo: "sunduk" },
      { id: "munhee", role: "\uC9C4\uACE8 \xB7 True Bone", reportsTo: "chunchu" },
      { id: "munmu", role: "\uC9C4\uACE8 \xB7 True Bone", reportsTo: "chunchu" },
      { id: "pumsuk", role: "\uC9C4\uACE8 \xB7 True Bone", reportsTo: "sunduk" },
      { id: "gotaso", role: "\uC9C4\uACE8 \xB7 True Bone", reportsTo: "chunchu" }
    ],
    aliases: [
      "Bone Rank System",
      "Bone Rank",
      "\uACE8\uD488\uC81C",
      "\uACE8\uD488",
      "purple robe",
      "\uC790\uC0C9",
      "\uBE44\uC0C9",
      "\uCCAD\uC0C9",
      "\uD669\uC0C9"
    ]
  },
  {
    id: "foundingsix",
    name: "The Founding Six Elders",
    korean: "\uC2E0\uB77C \uC721\uCD0C \uC2DC\uC870",
    hanja: "\u65B0\u7F85\u516D\u6751\u59CB\u7956",
    entity: "organization",
    kingdom: "silla",
    title: "The six village chiefs who raised the egg-born king",
    tagline: "Alpyung, Sobuldori, Jibekho, Gurema, Jita, Hojin \u2014 six hearths, one crown.",
    nature: "Not a council that votes but a covenant that dug: when the white horse knelt at Najeong, six chiefs opened the earth and raised the boy they named Hyukgos\xE9. Their descendants become the True Bone (\uC9C4\uACE8) nobility \u2014 hereditary, above commoners, founding-blood privilege worn like purple before purple had a number. The egg-born king and dragon-born queen stay Sacred exception; the six lines inherit the country\u2019s untouchable aristocracy.",
    arc: "Samguk Sagi\u2019s six villages and six departments: Alcheon Yangsan-chon (Lee Alpyung, Geupnyang-bu); Dolsan Goheo-chon (Choi Sobuldori, Saryang-bu); Chuisan Jinji-chon (Jeong Jibekho, Bonpi-bu); Musan Daesu-chon (Son Gurema, Jeomnyang-bu); Geumsan Gari-chon (Bae Jita, Hangi-bu); Myeonghwalsan Goya-chon (Seol Hojin, Seupbi-bu). They install Hyukgos\xE9 at thirteen and teach Seorabeol that six clans may dominate politics so long as one crown holds the centre. Twelve centuries later Alchun counts Sobuldori, Bidam\u2019s hall whispers Gurema, and Kim Yushin \u2014 Gaya Kim, not elder blood \u2014 is the odd sword inside True Bone Surabol.",
    events: [
      { year: -69, label: "Find the egg at Najeong well; raise Hyukgos\xE9." },
      { year: -57, label: "Crown Hyukgos\xE9 first king of Seorabeol." },
      { label: "Six clans \u2014 Lee, Choi, Jeong, Son, Bae, Seol \u2014 inherit founding privilege as True Bone." }
    ],
    orgChart: [
      { id: "hyukgose", role: "King \xB7 egg-born \xB7 installed by the six", reportsTo: null },
      { id: "alpyung", role: "\uC54C\uCC9C \uC591\uC0B0\uCD0C \xB7 \uAE09\uB7C9\uBD80 \xB7 Surabol Lee", reportsTo: "hyukgose" },
      { id: "sobuldori", role: "\uB3CC\uC0B0 \uACE0\uD5C8\uCD0C \xB7 \uC0AC\uB7C9\uBD80 \xB7 Surabol Choi", reportsTo: "hyukgose" },
      { id: "jibekho", role: "\uCDE8\uC0B0 \uC9C4\uC9C0\uCD0C \xB7 \uBCF8\uD53C\uBD80 \xB7 Surabol Jeong", reportsTo: "hyukgose" },
      { id: "gurema", role: "\uBB34\uC0B0 \uB300\uC218\uCD0C \xB7 \uC810\uB7C9\uBD80 \xB7 Surabol Son", reportsTo: "hyukgose" },
      { id: "jita", role: "\uAE08\uC0B0 \uAC00\uB9AC\uCD0C \xB7 \uD55C\uAE30\uBD80 \xB7 Surabol Bae", reportsTo: "hyukgose" },
      { id: "hojin", role: "\uBA85\uD65C\uC0B0 \uACE0\uC57C\uCD0C \xB7 \uC2B5\uBE44\uBD80 \xB7 Surabol Seol", reportsTo: "hyukgose" }
    ],
    aliases: [
      "foundingsix",
      "Founding Six Elders",
      "The Founding Six Elders",
      "\uC2E0\uB77C \uC721\uCD0C \uC2DC\uC870",
      "\uC0AC\uB85C \uC721\uCD0C",
      "\uC2E0\uB77C 6\uC131",
      "Silla Six Elders"
    ]
  },
  {
    id: "sillaroyal",
    name: "The Silla Royal Family",
    korean: "\uC2E0\uB77C \uC655\uC2E4",
    hanja: "\u65B0\u7F85\u738B\u5BA4",
    entity: "organization",
    kingdom: "silla",
    title: "Sacred Bone crowns and True Bone heirs of Surabol",
    tagline: "Egg-and-dragon founders, exhausted Sacred Bone queens, and the True Bone line that finished Samhan.",
    nature: "Not one surname but one house argument across centuries: Hyukgos\xE9 and Alyoung by omen; later Surabol Kim by Alji; Sacred Bone when holiness still barred the throne from ordinary bone; True Bone when Chunchu broke the spell. Gotaso, Munhee, and Bupmin belong here as much as Sunduk \u2014 blood and marriage both count in Surabol\u2019s ledger.",
    arc: "From the Founding Six presenting the egg-born king to Jinpyung\u2019s fifty-three-year reign and three Sacred Bone daughters; from Sunduk and Jinduk holding a holiness the country outgrew to Chunchu\u2019s first True Bone crown and Munmu\u2019s Samhan. The family page is the bone-rank story told as names instead of robe colours.",
    orgChart: [
      { id: "hyukgose", role: "Founding king \xB7 egg-born \xB7 Sacred exception", reportsTo: null },
      { id: "alyoung", role: "Founding queen \xB7 dragon-born \xB7 Sacred exception", reportsTo: "hyukgose" },
      { id: "jinheung", role: "\uC131\uACE8 \xB7 Sacred Bone \xB7 conqueror", reportsTo: null },
      { id: "jinji", role: "\uC131\uACE8 \xB7 Sacred Bone \xB7 deposed", reportsTo: "jinheung" },
      { id: "yongsu", role: "\uC9C4\uACE8 \xB7 True Bone \xB7 Jinji\u2019s son", reportsTo: "jinji" },
      { id: "jinpyung", role: "\uC131\uACE8 \xB7 Sacred Bone \xB7 53-year reign", reportsTo: null },
      { id: "sunduk", role: "\uC131\uACE8 \xB7 Sacred Bone \xB7 queen", reportsTo: "jinpyung" },
      { id: "jinduk", role: "\uC131\uACE8 \xB7 Sacred Bone \xB7 queen", reportsTo: "jinpyung" },
      { id: "chunmyung", role: "\uC131\uACE8 \xB7 Sacred Bone \xB7 Chunchu\u2019s mother", reportsTo: "jinpyung" },
      { id: "chunchu", role: "\uC9C4\uACE8 \xB7 True Bone \xB7 first True Bone king", reportsTo: "chunmyung" },
      { id: "munhee", role: "\uC9C4\uACE8 \xB7 True Bone \xB7 queen consort", reportsTo: "chunchu" },
      { id: "gotaso", role: "\uC9C4\uACE8 \xB7 True Bone \xB7 Chunchu\u2019s daughter", reportsTo: "chunchu" },
      { id: "munmu", role: "\uC9C4\uACE8 \xB7 True Bone \xB7 King of Samhan", reportsTo: "chunchu" }
    ],
    aliases: [
      "Silla Royal Family",
      "Royal House of Silla",
      "\uC2E0\uB77C \uC655\uC2E4",
      "Surabol royal house",
      "Sacred Bone house"
    ]
  },
  {
    id: "harmonycouncil",
    name: "The Harmony Council",
    korean: "\uD654\uBC31\uD68C\uC758",
    hanja: "\u548C\u767D\u6703\u8B70",
    entity: "organization",
    kingdom: "silla",
    title: "Silla\u2019s unanimous council of Councillors",
    tagline: "Six Councillors (\uB300\uB4F1) under a High Councillor (\uC0C1\uB300\uB4F1) \u2014 initial vote, deliberation, final vote.",
    nature: "Each session: initial vote \u2192 deliberation \u2192 final vote. Unanimity or nothing; one withheld hand is a Harmony Veto. Yes-Minister courtesy wrapped around Iliad stakes \u2014 thrones, pride, and the turning of hands.",
    arc: "Members are Councillors (\uB300\uB4F1); the first chair is High Councillor (\uC0C1\uB300\uB4F1). In 579 they depose King Jinji on the three counts \u2014 misconduct, not treason \u2014 and a Sacred Bone house drops to True Bone. In 632 six sleeves begin three-to-three on Dukman; Bidam wins deliberation until the final vote is six-to-none. In 645 Bidam alone breaks the initial vote for Seungman and the final vote cannot pass. In 654 Chunchu is enthroned when the holdout is laughed down. After the Chunchu Reforms the Council still meets; the Royal Secretariat ensures nothing of consequence waits for it.",
    events: [
      { year: 579, label: "Deposes King Jinji for misconduct \u2014 initial vote, deliberation, final vote." },
      { year: 632, label: "Initial 3:3 \u2192 final 6:0 \u2014 Queen Sunduk named." },
      { year: 636, label: "Supum succeeds Eulj\xE9 as High Councillor." },
      { year: 645, label: "Bidam alone blocks Seungman; the queen makes him High Councillor." },
      { year: 651, label: "Outflanked by the Royal Secretariat (\uC9D1\uC0AC\uBD80)." },
      { year: 654, label: "Enthrones Kim Chunchu as King Muyeol." }
    ],
    orgChart: [
      { id: "euljae", role: "\uC0C1\uB300\uB4F1 \xB7 High Councillor (632\u2013636)", reportsTo: null },
      { id: "supum", role: "\uC0C1\uB300\uB4F1 \xB7 High Councillor (636\u2013645)", reportsTo: null },
      { id: "bidam", role: "\uC0C1\uB300\uB4F1 \xB7 High Councillor (645\u2013647) \xB7 the 645 veto", reportsTo: null },
      { id: "yushin", role: "\uB300\uB4F1", reportsTo: "supum" },
      { id: "alchun", role: "\uB300\uB4F1", reportsTo: "supum" },
      { id: "murim", role: "\uB300\uB4F1", reportsTo: "supum" },
      { id: "imjong", role: "\uB300\uB4F1", reportsTo: "supum" },
      { id: "suljong", role: "\uB300\uB4F1", reportsTo: "supum" }
    ],
    aliases: [
      "Harmony Council",
      "\uD654\uBC31\uD68C\uC758",
      "Councillors",
      "\uB300\uB4F1",
      "High Councillor",
      "\uC0C1\uB300\uB4F1"
    ]
  },
  {
    id: "hwarang",
    name: "The Hwarang",
    korean: "\uD654\uB791",
    hanja: "\u82B1\u90CE",
    entity: "organization",
    /* the one institution that speaks aloud in the chronicle, as a chorus of
       young noblemen — so it needs a body on the stage */
    gender: "m",
    kingdom: "silla",
    title: "The Flowering Knights",
    tagline: "Boarding hall and officer factory of Silla\u2019s noblemen \u2014 the class you slept in is the class you later vote with.",
    ideology: "Martial aristocratic idealism",
    ideologyNote: "Flower youth as elite virtue politics \u2014 loyalty, beauty, and steel as curriculum. The cohort outlives the yard: old boys staff the Harmony Council.",
    nature: "A closed hall that sleeps six to a room, and an officer factory that feeds the state. Boys learn one another\u2019s snores before one another\u2019s ranks, then keep the class number for life \u2014 First Class, Class 51, Class 84 \u2014 the way a later age keeps a service number. One class a year: Class 1 entered in 560. Bidam is senior to Yushin, Yushin to Alchun; decades on they still say our class. Almost every Harmony Councillor first wore the headband. A Hwarang is expected to ride, recite, and look like the country worth dying for. Special forms \u2014 named cuts, paired drills, the 108 count \u2014 mark who trained in the yard and who merely wore a sword. On the gyuku field they measure one another with a jangsi before the court does.",
    arc: "Silla\u2019s training order for True Bone youth \u2014 part boarding school, part brotherhood, part cult of the officer. It incubates the men who later sit the Harmony Council, which is to say the Council is the yard with better chairs. It produces Yushin, Bidam, Alchun and Pumsuk: the man who saves the throne, the man who rebels against it, and the boy who loses Daeya. When two of them meet between camps, the country watches a private language of steel \u2014 and of class.",
    events: [
      { year: 576, label: "Formalised under King Jinheung." },
      { year: 632, label: "The young knights pledge to Queen Sunduk." },
      { year: 660, label: "Gwanchang and Bangul die at the Yellow Mountain Fields." }
    ],
    orgChart: [
      { id: "yushin", role: "\uAD6D\uC120 \xB7 Marshal \xB7 Class 51", reportsTo: null },
      { id: "bidam", role: "\uD654\uB791 \xB7 Class 51", reportsTo: "yushin" },
      { id: "alchun", role: "\uD654\uB791 \xB7 Class 51", reportsTo: "yushin" },
      { id: "pumsuk", role: "\uD654\uB791 \xB7 Class 74", reportsTo: "yushin" },
      { id: "sadaham", role: "\uD654\uB791 \xB7 remembered \xB7 First Class", reportsTo: "yushin" },
      { id: "jukji", role: "\uD654\uB791 \xB7 Class 74", reportsTo: "yushin" },
      { id: "_hwarang-6", role: "\uD654\uB791", reportsTo: "yushin" },
      { id: "_disc-bidam-1", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "bidam" },
      { id: "_disc-bidam-2", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "bidam" },
      { id: "_disc-bidam-3", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "bidam" },
      { id: "_disc-bidam-4", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "bidam" },
      { id: "_disc-alchun-1", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "alchun" },
      { id: "_disc-alchun-2", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "alchun" },
      { id: "_disc-alchun-3", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "alchun" },
      { id: "_disc-alchun-4", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "alchun" },
      { id: "_disc-pumsuk-1", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "pumsuk" },
      { id: "_disc-pumsuk-2", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "pumsuk" },
      { id: "_disc-pumsuk-3", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "pumsuk" },
      { id: "_disc-pumsuk-4", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "pumsuk" },
      { id: "_disc-sadaham-1", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "sadaham" },
      { id: "_disc-sadaham-2", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "sadaham" },
      { id: "_disc-sadaham-3", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "sadaham" },
      { id: "_disc-sadaham-4", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "sadaham" },
      { id: "_disc-jukji-1", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "jukji" },
      { id: "_disc-jukji-2", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "jukji" },
      { id: "_disc-jukji-3", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "jukji" },
      { id: "_disc-jukji-4", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "jukji" },
      { id: "_disc-h6-1", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "_hwarang-6" },
      { id: "_disc-h6-2", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "_hwarang-6" },
      { id: "_disc-h6-3", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "_hwarang-6" },
      { id: "_disc-h6-4", role: "\uB0AD\uB3C4 \xB7 disciple", reportsTo: "_hwarang-6" }
    ],
    aliases: ["Hwarang knights", "Flower Knights", "Hwarang"]
  },
  {
    id: "gyuku",
    name: "Gyuku",
    korean: "\uACA9\uAD6C",
    hanja: "\u64CA\u6BEC",
    entity: "concept",
    kingdom: "silla",
    title: "The horse-ball ranking",
    tagline: "Jangsi, mogu, gumun \u2014 Surabol\u2019s scoreboard with horses.",
    nature: "Not a pastime. A ranking system. Handicaps argued like borders, with less honesty. The stick has a proper name \u2014 jangsi (\u6756\u5319 / \uC7A5\uC2DC) \u2014 and men who call it a mere club are not invited to the better matches.",
    arc: "Riders drive a wooden mogu (\u6BDB\u6BEC / \uBAA8\uAD6C \u2014 the hair-ball, the wooden ball) through a gumun (\u6BEC\u9580 / \uAD6C\uBB38) with a jangsi. The chronicles stack other names \u2014 tagu (\u6253\u6BEC), gyuku-hui (\u64CA\u6BEC\u6231), nongjang-hui (\uF943\u6756\u6231), gyeokbong (\u64CA\u68D2) \u2014 and the market still says gongchigi or jangchigi. A later age calls it polo and forgets the stick had a proper name. The sport will flourish loudest as a male-centred Dano game in late Goryeo; in this chronicle Surabol already uses it to decide who matters before the court does.",
    aliases: [
      "Gyuku",
      "\uACA9\uAD6C",
      "\u64CA\u6BEC",
      "Jangsi",
      "\uC7A5\uC2DC",
      "\u6756\u5319",
      "Mogu",
      "\uBAA8\uAD6C",
      "\u6BDB\u6BEC",
      "Gumun",
      "\uAD6C\uBB38",
      "\u6BEC\u9580",
      "Tagu",
      "\uD0C0\uAD6C",
      "\u6253\u6BEC",
      "Gyuku-hui",
      "\uACA9\uAD6C\uD76C",
      "Nongjang-hui",
      "\uB18D\uC7A5\uD76C",
      "Gyeokbong",
      "\uACA9\uBD09",
      "Gongchigi",
      "\uACF5\uCE58\uAE30",
      "Jangchigi",
      "\uC7A5\uCE58\uAE30",
      "polo"
    ]
  },
  {
    id: "fiveprinciples",
    name: "The Five Principles",
    korean: "\uC138\uC18D\uC624\uACC4",
    hanja: "\u4E16\u4FD7\u4E94\u6212",
    entity: "concept",
    kingdom: "silla",
    title: "The Hwarang code",
    tagline: "Loyalty, filial duty, faith between friends, no retreat, and mercy in killing.",
    arc: "Five lines that read as virtues and function as a machine for producing dead teenagers. \uC784\uC804\uBB34\uD1F4 \u2014 never retreat \u2014 is the one the story keeps returning to: it is why Gwanchang rides back, why Gyebek kills his family, and why Baekje fights a war it has already lost.",
    aliases: ["Five Principles"]
  },
  {
    id: "greatheroes",
    name: "The Great Heroes of Goguryeo",
    korean: "\uACE0\uAD6C\uB824 \uC601\uC6C5",
    entity: "concept",
    kingdom: "goguryeo",
    title: "The defenders in the Hall of Heroes",
    tagline: "The short list of men who stopped an empire at the Liao.",
    arc: "Goguryeo\u2019s self-image in five or six names \u2014 Gwanggaeto who expanded it, Ulchi Munduk who drowned the Sui at the Great River, the nameless Guardian of Ansi who held his wall against Taizong. Yeon Gesomun spends his life auditioning for the list and Namseng inherits a kingdom that believes the list will always be added to.",
    events: [
      { year: 612, label: "Ulchi Munduk destroys the Sui at the Great River." },
      { year: 645, label: "The Guardian of Ansi is added after holding his wall." }
    ],
    aliases: ["Great Heroes of Goguryeo", "Great Heroes"]
  },
  {
    id: "crowblades",
    name: "The Crow Blades",
    korean: "\uC624\uB3C4",
    hanja: "\u70CF\u5200",
    entity: "concept",
    kingdom: "goguryeo",
    title: "Four cardinal blades and the High Commander Blade",
    tagline: "A set of named Goguryeo swords \u2014 never one weapon.",
    arc: "Not an item. Four directional \uB300\uAC00 each carry a crow-stamped blade \u2014 Southern, Northern, Eastern, Western \u2014 and the High Commander (\uB9C9\uB9AC\uC9C0) carries the office blade, the \uB9C9\uB9AC\uC9C0\uAC80. Yeon Gesomun walks into the banquet of 642 with the Eastern Crow Blade already on his hip. He takes the other three crows and the High Commander Blade; he straps five named swords, not a kit called the Five Blades. Later mouths that still say \uC624\uAC80 mean this set.",
    events: [{ year: 642, label: "The four taken blades join the Eastern Crow Blade on Gesomun\u2019s spine." }],
    aliases: [
      "Crow Blades",
      "The Crow Blades",
      "\uC0AC\uBC29 \uC624\uB3C4",
      "\uACE0\uAD6C\uB824 \uC624\uB3C4",
      "Five Blades",
      "The Five Blades",
      "\uC624\uAC80",
      "\u4E94\u528D"
    ]
  },
  {
    id: "sillatang",
    name: "The Silla\u2013Tang Alliance",
    korean: "\uB098\uB2F9\uC5F0\uD569",
    hanja: "\u7F85\u5510\u540C\u76DF",
    entity: "concept",
    kingdom: "other",
    title: "The bargain that unified Samhan",
    tagline: "The alliance that destroyed two kingdoms, then had to be destroyed itself.",
    arc: "Chunchu\u2019s masterpiece and the charge his enemies never stop levelling at him. It ends Baekje in 660 and Goguryeo in 668, and then requires an eight-year war to expel the ally from the peninsula it was invited onto.",
    events: [
      { year: 648, label: "Sealed by Chunchu and Emperor Taizong." },
      { year: 660, label: "Baekje falls." },
      { year: 668, label: "Goguryeo falls." },
      { year: 676, label: "Silla expels the Tang." }
    ],
    aliases: ["Silla-Tang alliance", "Silla\u2013Tang alliance", "Chunchu Army"]
  },
  {
    id: "eightclans",
    name: "The Eight Great Clans",
    korean: "\uB300\uC131\uD314\uC871",
    hanja: "\u5927\u59D3\u516B\u65CF",
    entity: "organization",
    kingdom: "baekje",
    title: "The noble houses of Baekje",
    tagline: "Eight families who own the king by owning his sons\u2019 mothers.",
    ideology: "Clan oligarchy",
    ideologyNote: "Aristocratic veto politics \u2014 eight houses as a constitution of no.",
    arc: "Jinmo, Satek, Yunbi, Mokli, Hae, Baek, Guk, Ahn \u2014 the houses that make Baekje\u2019s kings and, through the Ministers\u2019 Assembly on Deer Rock, unmake them. Their chart lives in the Assembly chamber, not as a separate parliament: eight benches facing the Buyeo throne across an aisle. Euija breaks the houses in 655 by seating forty-one of his own sons in their chairs.",
    events: [
      { year: 632, label: "Minister Satek\u2019s house holds both the queen and the Prime Minister." },
      { year: 655, label: "Euija purges the Assembly and installs his sons." }
    ],
    orgChart: [
      { id: "euija", role: "Buyeo throne", reportsTo: null },
      { id: "clan-satek", role: "\uC0AC\uD0DD", reportsTo: "euija" },
      { id: "clan-jinmo", role: "\uC9C4\uBAA8", reportsTo: "euija" },
      { id: "clan-yunbi", role: "\uC5F0\uBE44", reportsTo: "euija" },
      { id: "clan-mokli", role: "\uBAA9\uB9AC", reportsTo: "euija" },
      { id: "clan-hae", role: "\uD574", reportsTo: "euija" },
      { id: "clan-baek", role: "\uBC31", reportsTo: "euija" },
      { id: "clan-guk", role: "\uAD6D", reportsTo: "euija" },
      { id: "clan-ahn", role: "\uC548", reportsTo: "euija" }
    ],
    aliases: ["Eight Great Clans"]
  },
  {
    id: "ministersassembly",
    name: "The Ministers\u2019 Assembly",
    korean: "\uC815\uC0AC\uC554\uD68C\uC758",
    hanja: "\u653F\u4E8B\u5DD6\u6703\u8B70",
    entity: "organization",
    kingdom: "baekje",
    title: "Baekje\u2019s majority cabinet on Deer Rock",
    tagline: "Eight \uC88C\uD3C9 four-and-four beside the aisle, eight \uB2EC\uC194 four-and-four on the outer benches \u2014 Premier on the aisle, King at the helm.",
    nature: "Votes bought in pieces over lunch. Faster than Surabol\u2019s unanimity, uglier, and proud of both. Deer Rock (\uC815\uC0AC\uC554) sweats before a good decision \u2014 or before brine.",
    arc: "Baekje\u2019s Ministers\u2019 Assembly settles by majority at Deer Rock: \uC88C\uD3C9 and \uB2EC\uC194 count sleeves; the \uC0C1\uC88C\uD3C9 names the inevitable. Unlike Silla\u2019s Harmony Council, a plurality of houses is enough \u2014 which is why street fights and harbour berths are politics by other means. Euija later packs the rock with his own sons and discovers a court with no rivals has no one left to tell him no.",
    events: [
      { year: 632, label: "Minister Satek holds queen and Prime Minister (\uC0C1\uC88C\uD3C9)." },
      { year: 655, label: "Euija purges the Assembly and installs his sons." }
    ],
    orgChart: [
      { id: "euija", role: "King \xB7 helm", reportsTo: null },
      { id: "ministersatek", role: "\uC0C1\uC88C\uD3C9 \xB7 Premier", reportsTo: "euija" },
      { id: "_senior-1", role: "\uC88C\uD3C9 \xB7 Senior", reportsTo: "ministersatek" },
      { id: "_senior-2", role: "\uC88C\uD3C9 \xB7 Senior", reportsTo: "ministersatek" },
      { id: "_senior-3", role: "\uC88C\uD3C9 \xB7 Senior", reportsTo: "ministersatek" },
      { id: "_senior-4", role: "\uC88C\uD3C9 \xB7 Senior", reportsTo: "ministersatek" },
      { id: "_senior-5", role: "\uC88C\uD3C9 \xB7 Senior", reportsTo: "ministersatek" },
      { id: "_senior-6", role: "\uC88C\uD3C9 \xB7 Senior", reportsTo: "ministersatek" },
      { id: "_senior-7", role: "\uC88C\uD3C9 \xB7 Senior", reportsTo: "ministersatek" },
      { id: "_senior-8", role: "\uC88C\uD3C9 \xB7 Senior", reportsTo: "ministersatek" },
      { id: "_junior-1", role: "\uB2EC\uC194 \xB7 Junior", reportsTo: "ministersatek" },
      { id: "_junior-2", role: "\uB2EC\uC194 \xB7 Junior", reportsTo: "ministersatek" },
      { id: "_junior-3", role: "\uB2EC\uC194 \xB7 Junior", reportsTo: "ministersatek" },
      { id: "_junior-4", role: "\uB2EC\uC194 \xB7 Junior", reportsTo: "ministersatek" },
      { id: "_junior-5", role: "\uB2EC\uC194 \xB7 Junior", reportsTo: "ministersatek" },
      { id: "_junior-6", role: "\uB2EC\uC194 \xB7 Junior", reportsTo: "ministersatek" },
      { id: "_junior-7", role: "\uB2EC\uC194 \xB7 Junior", reportsTo: "ministersatek" },
      { id: "_junior-8", role: "\uB2EC\uC194 \xB7 Junior", reportsTo: "ministersatek" }
    ],
    aliases: [
      "Ministers\u2019 Assembly",
      "\uC815\uC0AC\uC554\uD68C\uC758",
      "Deer Rock Assembly",
      "Senior Ministers",
      "\uC88C\uD3C9",
      "Junior Ministers",
      "\uB2EC\uC194",
      "Prime Minister",
      "\uC0C1\uC88C\uD3C9"
    ]
  },
  {
    id: "fairytales",
    name: "Fairy Tales",
    korean: "\uC124\uD654",
    hanja: "\u8AAA\u8A71",
    entity: "concept",
    kingdom: "other",
    title: "Origin myths told as wonder-tales",
    tagline: "Eggs, bears, aprons of earth \u2014 the chronicle\u2019s Disney register, before the war rooms.",
    nature: "The voice the story uses when it is still allowed to be a child: Hyukgos\xE9\u2019s egg, Ungnyeo\u2019s cave, Sulmun scooping the sea into a mountain. Not history yet. A picture book that later ages have to live inside.",
    arc: "Founder episodes and Tamla \uBCF8\uD480\uC774 keep this register \u2014 whimsical, bright, a little cruel in the way fairy tales are. The war will not stay here. The music of those pages should still sound like a story being opened.",
    aliases: ["Fairy Tales", "the fairy tales", "\uC124\uD654", "\uBCF8\uD480\uC774", "origin tales"]
  },
  {
    id: "romance",
    name: "Romance",
    korean: "\uC5F0\uC560\uB2F4",
    entity: "concept",
    kingdom: "other",
    title: "The chronicle\u2019s love stories",
    tagline: "Rain on ledgers, steam on stone, a tide table kept by two \u2014 K-drama without the helplessness.",
    nature: "Not one couple: the register of wanting. Munmu and Jahee survive the war as partners. Chunchu and Munhee make a house. The cavern is hunger in another key. The music is the held sixth, the almost-kiss, the ballad that does not resolve on the first chorus.",
    arc: "The series\u2019 most successful romance is Jahee\u2019s: she corrects Bupmin\u2019s sums and later his kingdom as Queen Jayi. Other loves break, wait, or become policy. This entry is the tone of all of them \u2014 Melomance on a palace stair.",
    aliases: ["the romances", "\uC5F0\uC560\uB2F4", "love stories of the chronicle"]
  },
  {
    id: "highsummit",
    name: "The High Summit",
    korean: "\uC81C\uAC00\uD68C\uC758",
    hanja: "\u8AF8\u52A0\u6703\u8B70",
    entity: "organization",
    kingdom: "goguryeo",
    title: "Goguryeo\u2019s council of Commanders",
    tagline: "Commanders (\uB300\uAC00) under a High Commander (\uB9C9\uB9AC\uC9C0) \u2014 the king keeps the final vote.",
    nature: "Consultation with a crown: all opinions equally valued until His Majesty finalises \u2014 then equally forgotten. After 642 the Supreme Commander (\uB300\uB9C9\uB9AC\uC9C0) makes the final vote a formality, with a Chancellor (\uB300\uB300\uB85C) to issue retrospective minutes.",
    arc: "The Five Commanderies are the Five Animal Tribes under later names: crow East, cow West, pig South, dog North, horse Central. They argue as Commanders (\uB300\uAC00) \u2014 the same \u52A0 the four ka carried; the High Commander (\uB9C9\uB9AC\uC9C0) is first sword \u2014 Yeon Gusesa sits the old horse chair; Yeon Gesomun holds the crow\u2019s eastern \uBD80. The king casts the last word. Yeon\u2019s massacre replaces the old first chair with Supreme Commander (\uB300\uB9C9\uB9AC\uC9C0) and seats Dosuryu as Chancellor (\uB300\uB300\uB85C) \u2014 force first, procedure after.",
    events: [
      { year: 642, label: "Summit cleared at Yeon\u2019s banquet; Supreme Commander created." },
      { year: 642, label: "Dosuryu named Chancellor (\uB300\uB300\uB85C)." }
    ],
    orgChart: [
      { id: "bojang", role: "King", reportsTo: null },
      { id: "gesomun", role: "\uB300\uB9C9\uB9AC\uC9C0 \xB7 Supreme Commander", reportsTo: "bojang" },
      { id: "dosuryu", role: "\uB300\uB300\uB85C \xB7 Chancellor", reportsTo: "gesomun" },
      { id: "northcmd", role: "Northern \uB300\uAC00", reportsTo: "gesomun" },
      { id: "southcmd", role: "Southern \uB300\uAC00", reportsTo: "gesomun" },
      { id: "westcmd", role: "Western \uB300\uAC00", reportsTo: "gesomun" },
      { id: "yangmanchun", role: "Ansi guardian", reportsTo: "gesomun" },
      { id: "namseng", role: "Yeon heir", reportsTo: "gesomun" },
      { id: "namgun", role: "Yeon second", reportsTo: "gesomun" },
      { id: "namsan", role: "Yeon third", reportsTo: "gesomun" }
    ],
    aliases: [
      "High Summit",
      "\uC81C\uAC00\uD68C\uC758",
      "Commanders",
      "\uB300\uAC00",
      "High Commander",
      "\uB9C9\uB9AC\uC9C0",
      "Supreme Commander",
      "\uB300\uB9C9\uB9AC\uC9C0",
      "Chancellor",
      "\uB300\uB300\uB85C"
    ]
  },
  {
    id: "fivetribes",
    name: "The Five Tribes",
    korean: "\uC624\uBD80\uC871",
    hanja: "\u4E94\u90E8\u65CF",
    entity: "organization",
    kingdom: "jolbon",
    title: "Five animal roofs of Jolbon",
    tagline: "The crow and the four ka \u2014 horse, cow, pig, dog \u2014 the league that votes Jumong king, then becomes Goguryeo\u2019s five commanderies.",
    nature: "Not a throne: five ditch-warring roofs that forgot they were Joseon. Tabal\u2019s crow is largest. They hate sharing a yard more than they hate a stranger with a bow. The first summit is the thing they never wanted \u2014 agreement.",
    arc: "Horse, cow, crow, dog, pig sit Tabal\u2019s packed-earth ring and vote Jumong first king of Goryeo. The four ka are the Buyeo way of naming men after herds \u2014 \u99AC\u52A0, \u725B\u52A0, \u8C6C\u52A0, \u72D7\u52A0 in the Wei annals \u2014 and the crow is Jolbon\u2019s own. The animal names do not die; they are relabeled as the five \uBD80. Crow becomes the eastern commandery \u2014 the Yeon hall keeps that roof until Yeon Gesomun sits it as \uB300\uAC00, then butchers the other four chairs in 642. Cow \u2192 west (Go Heumsong), pig \u2192 south (Son Daeha), dog \u2192 north (Go Ul), horse \u2192 central (the High Commander\u2019s seat, Yeon Gusesa). The High Summit is this league with grey giwa and a king\u2019s last word.",
    events: [
      { year: -37, label: "First summit on Tabal\u2019s yard; they vote Jumong king." },
      { year: -37, label: "The five roofs become Goryeo\u2019s five commanderies." },
      { year: 642, label: "The crow\u2019s eastern \uB300\uAC00 clears the other four chairs at Yeon\u2019s banquet." }
    ],
    orgChart: [
      { id: "jumong", role: "First king they vote", reportsTo: null },
      { id: "yeontabal", role: "Crow \xB7 \uB3D9\uBD80", reportsTo: "jumong" },
      { id: "cowchief", role: "Cow ka \xB7 \uC6B0\uAC00 \xB7 \uC11C\uBD80", reportsTo: "jumong" },
      { id: "pigchief", role: "Pig ka \xB7 \uC800\uAC00 \xB7 \uB0A8\uBD80", reportsTo: "jumong" },
      { id: "dogchief", role: "Dog ka \xB7 \uAD6C\uAC00 \xB7 \uBD81\uBD80", reportsTo: "jumong" },
      { id: "horsechief", role: "Horse ka \xB7 \uB9C8\uAC00 \xB7 \uC911\uBD80", reportsTo: "jumong" }
    ],
    aliases: [
      "Five Tribes",
      "the Five Tribes",
      "five tribes",
      "five animal tribes",
      "\uC624\uBD80\uC871",
      "\uC624\uBD80",
      "Five Animal Tribes",
      "five roofs",
      "four ka",
      "\uC0AC\uAC00",
      "\u56DB\u52A0"
    ]
  },
  {
    id: "royalsecretariat",
    name: "The Royal Secretariat",
    korean: "\uC9D1\uC0AC\uBD80",
    hanja: "\u57F7\u4E8B\u90E8",
    entity: "organization",
    kingdom: "silla",
    title: "Chunchu\u2019s instrument of direct rule",
    tagline: "Never Enough \u2014 Tang\u2019s three departments and six ministries, copied and exceeded: fourteen Silla ministries under one \uC911\uC2DC.",
    ideology: "Westernizing institutionalism",
    ideologyNote: "Chunchu wanted to model Silla after Tang \u2014 then out-Tang Tang. Like two Koreas taking one ideology each to the extreme: Never Enough.",
    nature: "The Chunchu Reforms in one building: preserve the High Councillor\u2019s chair, empty it of consequences. Chang\u2019an\u2019s \u4E09\u7701\u516D\u90E8 as blueprint; Surabol\u2019s answer is \uC9D1\uC0AC\uBD80 plus \uBCD1\uBD80, \uCC3D\uBD80, \uC608\uBD80 and ten \u5E9C \u2014 fourteen ministries that never pretend to wait for six unanimous sleeves.",
    arc: "Founded in 651 as \uC9D1\uC0AC\uBD80 with Kim Jukji as first Premier (\uC911\uC2DC). Chunchu admired Tang\u2019s machine and decided Surabol needed more of it \u2014 \uC9D1\uC0AC\uBD80, \uBCD1\uBD80, \uCC3D\uBD80, \uC608\uBD80, and ten \u5E9C beneath the \uC911\uC2DC, fourteen ministries where Chang\u2019an stops at six. The Harmony Council still meets; nothing of consequence waits. Enemies call it tyranny by Tuesday; Chunchu calls it Never Enough.",
    events: [
      { year: 651, label: "Established by Chunchu; Jukji named first Premier (\uC911\uC2DC); fourteen ministries seated." },
      { year: 654, label: "Runs the kingdom under Muyeol while the Council adjourns on schedule." }
    ],
    orgChart: [
      { id: "chunchu", role: "King", reportsTo: null },
      { id: "jukji", role: "\uC911\uC2DC \xB7 Premier", reportsTo: "chunchu" },
      { id: "_min-jipsa", role: "\uC9D1\uC0AC\uBD80 \xB7 Secretariat", reportsTo: "jukji" },
      { id: "_min-byeong", role: "\uBCD1\uBD80 \xB7 War", reportsTo: "jukji" },
      { id: "_min-chang", role: "\uCC3D\uBD80 \xB7 Granary", reportsTo: "jukji" },
      { id: "_min-ye", role: "\uC608\uBD80 \xB7 Rites", reportsTo: "jukji" },
      { id: "_min-jwa", role: "\uC88C\uC0AC\uBD80 \xB7 Left Secretariat", reportsTo: "jukji" },
      { id: "_min-u", role: "\uC6B0\uC0AC\uBD80 \xB7 Right Secretariat", reportsTo: "jukji" },
      { id: "_min-hyeong", role: "\uD615\uBD80 \xB7 Justice", reportsTo: "jukji" },
      { id: "_min-gong", role: "\uACF5\uBD80 \xB7 Public Works", reportsTo: "jukji" },
      { id: "_min-si", role: "\uC2DC\uBD80 \xB7 Markets", reportsTo: "jukji" },
      { id: "_min-hwa", role: "\uD654\uBD80 \xB7 Treasury", reportsTo: "jukji" },
      { id: "_min-gongju", role: "\uACF5\uC8FC\uBD80 \xB7 Public Granary", reportsTo: "jukji" },
      { id: "_min-naegwan", role: "\uB0B4\uAD00\uBD80 \xB7 Inner Court", reportsTo: "jukji" },
      { id: "_min-oegwan", role: "\uC678\uAD00\uBD80 \xB7 Outer Court", reportsTo: "jukji" },
      { id: "_min-taehak", role: "\uD0DC\uD559\uBD80 \xB7 Academy", reportsTo: "jukji" }
    ],
    aliases: [
      "Royal Secretariat",
      "\u57F7\u4E8B\u90E8",
      "\uC9D1\uC0AC\uBD80",
      "Premier",
      "\uC911\uC2DC",
      "\u4E2D\u4F8D",
      "Chunchu Reforms"
    ]
  },
  {
    id: "restorationarmy",
    name: "Baekje Restoration Army",
    korean: "\uBC31\uC81C\uBD80\uD765\uAD70",
    hanja: "\u767E\u6FDF\u5FA9\u8208\u8ECD",
    entity: "organization",
    kingdom: "baekje",
    title: "The army that tried to un-fall Baekje",
    tagline: "Pungjang\u2019s banner over Juryu \u2014 five founding captains: Boksin, Dochim, Sangji, Sangya, and the crown Pung fetched from Yamato.",
    ideology: "Restoration royalism",
    ideologyNote: "Five founding members \u2014 Boksin and Dochim raise the host; Sangji holds Imjon; Satek Sangya feeds the lanes; Pungjang supplies the crown. A movement that eats its captains.",
    arc: "After Sabi, Gwishil Boksin and the monk Dochim raise a host from people the Eight Clans never counted, with Heukchi Sangji at Imjon and Satek Sangya keeping harbour steel in the line. They fetch Prince Pung from Yamato and crown him Pungjang \u2014 five founding captains under one banner. Dochim dies to Boksin\u2019s knife; Boksin dies to Pung\u2019s order; Sangji and Sangya break last at the White River. Not a Great Clan parliament \u2014 a restoration that eats its captains.",
    events: [
      { year: 660, label: "Boksin, Dochim, Sangji, and Sangya raise the BRA after Sabi." },
      { year: 661, label: "Pung returns; crowned Pungjang \u2014 the fifth founding seat filled." },
      { year: 661, label: "Dochim killed; Sangji holds Imjon." },
      { year: 663, label: "Boksin executed; Sangya and Sangji break; White River ends the army." }
    ],
    orgChart: [
      { id: "pung", role: "King Pungjang \xB7 founding crown", reportsTo: null },
      { id: "boksin", role: "General \xB7 Gwishil \xB7 co-founder", reportsTo: "pung" },
      { id: "dochim", role: "General \xB7 monk \xB7 co-founder", reportsTo: "pung" },
      { id: "sangji", role: "General \xB7 Imjon \xB7 co-founder", reportsTo: "pung" },
      { id: "sateksangya", role: "General \xB7 Satek \xB7 co-founder", reportsTo: "pung" }
    ],
    aliases: [
      "Baekje Restoration Army",
      "Restoration Army",
      "\uBC31\uC81C\uBD80\uD765\uAD70",
      "BRA",
      "Pungjang\u2019s army"
    ]
  },
  {
    id: "tangcourt",
    name: "The Tang Court",
    korean: "\uB2F9 \uC870\uC815",
    hanja: "\u5510\u671D\u5EF7",
    entity: "organization",
    kingdom: "tang",
    title: "Chang\u2019an\u2019s departments and throne",
    tagline: "Emperor above Zhongshu legislative, Menxia examination, Shangshu executive.",
    arc: "Taizong\u2019s war rooms, Gaozong\u2019s inheritance, Wu\u2019s rising shadow \u2014 the court Silla steals grammar from and later has to expel from the peninsula.",
    orgChart: [
      { id: "taizong", role: "Emperor", reportsTo: null },
      { id: "gaozong", role: "Heir \u2192 Emperor", reportsTo: "taizong" },
      { id: "wuzetian", role: "Consort / power", reportsTo: "gaozong" },
      { id: "weizheng", role: "Minister", reportsTo: "taizong" },
      { id: "lishiji", role: "General", reportsTo: "taizong" },
      { id: "sudingfang", role: "Expedition commander", reportsTo: "gaozong" },
      { id: "xuerengui", role: "Eastern general", reportsTo: "gaozong" }
    ],
    aliases: ["Tang Court", "Tang court", "Chang\u2019an court", "\uB2F9 \uC870\uC815", "\u5510\u671D\u5EF7"]
  },
  {
    id: "tangexpedition",
    name: "Tang Eastern Expedition",
    korean: "\uB2F9 \uB3D9\uC815\uAD70",
    hanja: "\u5510\u6771\u5F81\u8ECD",
    entity: "organization",
    kingdom: "tang",
    title: "Expeditionary command against Samhan",
    tagline: "Su Dingfang\u2019s river fleet, Xue\u2019s white coat, and the road that ends at Maeso.",
    arc: "Not a standing ministry \u2014 the campaign stack Chang\u2019an sends east: Su Dingfang at the Baek river, Xue Rengui inheriting the White Tiger title, Li Shiji\u2019s earlier Liao roads. The court drafts; this command executes.",
    orgChart: [
      { id: "gaozong", role: "Emperor", reportsTo: null },
      { id: "sudingfang", role: "Baek-river commander", reportsTo: "gaozong" },
      { id: "xuerengui", role: "Eastern blade", reportsTo: "gaozong" },
      { id: "lishiji", role: "Liao campaign general", reportsTo: "gaozong" }
    ],
    aliases: ["Tang Eastern Expedition", "Eastern Expedition", "\uB2F9 \uB3D9\uC815\uAD70", "Tang expedition"]
  },
  {
    id: "fourdragons",
    name: "The Four Dragons",
    korean: "\uC0AC\uB8E1",
    hanja: "\u56DB\u9F8D",
    entity: "group",
    kingdom: "tang",
    title: "The Second Emperor\u2019s dragon generals",
    tagline: "White, Red, Blue, and Black Dragons \u2014 Taizong\u2019s named blades for the Liao roads.",
    nature: "Second Emperor Taizong\u2019s dragon banners, 645, known by their colours far more than their names. Red Dragon \u2014 Ashina She\u2019er (\u963F\u53F2\u90A3\u793E\u723E / \uC544\uC0AC\uB098\uC0AC\uC774), a prince of the Turkic royal clan. Black Dragon \u2014 Zhangsun Wuji (\u9577\u5B6B\u7121\u5FCC / \uC7A5\uC190\uBB34\uAE30), the empress\u2019s brother. White Dragon \u2014 Qibi Heli (\u5951\u82FE\u4F55\u529B / \uACC4\uD544\uD558\uB825), a Tiele chieftain. Blue Dragon \u2014 Li Shiji (\u674E\u4E16\u52E3 / \uC774\uC138\uC801), the sole overlap with the Four Beasts. Two of the four are Turks: the steppe calls Taizong the Heavenly Qaghan (\u5929\u53EF\u6C57), his six chargers carry steppe names and titles, and he trusts horsemen from beyond the Wall with his banners.",
    arc: "Taizong\u2019s Seventh Invasion of Goguryeo seats four dragon generals: the Red Dragon Ashina She\u2019er, the Black Dragon Zhangsun Wuji, the White Dragon Qibi Heli and the Blue Dragon Li Shiji. The Blue Dragon is the anvil at Stallion Mountain and the Black Dragon is the hammer out of the gorge behind it; the White Dragon takes a spear at Baegam and rides on. When the Second Emperor dies in 649, the two Turkic dragons ask to be killed and buried beside him. Only the Blue Dragon is inherited into Gaozong\u2019s Four Beasts.",
    events: [
      { year: 645, label: "Four Dragons named: Ashina She\u2019er, Zhangsun Wuji, Qibi Heli, Li Shiji." },
      { year: 649, label: "The Second Emperor dies; the Red and White Dragons ask to follow him into the tomb." }
    ],
    orgChart: [
      { id: "taizong", role: "Second Emperor", reportsTo: null },
      { id: "qibiheli", role: "White Dragon \xB7 \uBC31\uB8E1 \xB7 Qibi Heli", reportsTo: "taizong" },
      { id: "ashinasheer", role: "Red Dragon \xB7 \uC801\uB8E1 \xB7 Ashina She\u2019er", reportsTo: "taizong" },
      { id: "lishiji", role: "Blue Dragon \xB7 \uCCAD\uB8E1 \xB7 Li Shiji", reportsTo: "taizong" },
      { id: "zhangsunwuji", role: "Black Dragon \xB7 \uD751\uB8E1 \xB7 Zhangsun Wuji", reportsTo: "taizong" }
    ],
    aliases: ["Four Dragons", "\uC0AC\uB8E1", "\u56DB\u9F8D", "Taizong\u2019s dragons"]
  },
  {
    id: "fourbeasts",
    name: "The Four Beasts",
    korean: "\uC0AC\uC2E0",
    hanja: "\u56DB\u795E",
    entity: "group",
    kingdom: "tang",
    title: "The Third Emperor\u2019s beast generals",
    tagline: "White Tiger, Red Fowl, Blue Dragon, Black Tortoise \u2014 Gaozong\u2019s inherited war machine.",
    nature: "Third Emperor Gaozong\u2019s beast banners, 661. White Tiger \u2014 Pang Xiaotai (\u9F90\u5B5D\u6CF0 / \uBC29\uD6A8\uD0DC), fallen at the Snake River in 662; Xue Rengui (\u859B\u4EC1\u8CB4 / \uC124\uC778\uADC0) succeeds as White Tiger II. Red Fowl \u2014 Su Dingfang (\u8607\u5B9A\u65B9 / \uC18C\uC815\uBC29), not Ashina She\u2019er\u2019s Red Dragon. Blue Dragon \u2014 Li Shiji (\u674E\u4E16\u52E3 / \uC774\uC138\uC801), the sole dragon who kept his seat. Black Tortoise \u2014 Liu Rengui (\u5289\u4EC1\u8ECC / \uC720\uC778\uADA4), not Zhangsun Wuji\u2019s Black Dragon. Eight offices, seven men; the Blue Dragon is the overlap, and Xue is the replacement after the river.",
    arc: "Gaozong\u2019s Eighth Invasion inherits his father\u2019s war and names a new zodiac: White Tiger Pang Xiaotai, Red Fowl Su Dingfang, Blue Dragon Li Shiji, Black Tortoise Liu Rengui. In the second month of 662 Yeon Gesomun kills the White Tiger and his thirteen sons at the Snake River (Salsu in old mouths). Xue Rengui \u2014 the man in white from Stallion Mountain \u2014 takes the dead man\u2019s title as White Tiger II. Li Shiji alone sat both dragon and beast musters from the start. Liu Rengui\u2019s tortoise holds Baekje and burns the eastern fleet at the White River. Pyongyang falls in 668 under the Blue Dragon, the Black Tortoise, and White Tiger II.",
    events: [
      { year: 661, label: "Four Beasts named: Pang, Su Dingfang, Li Shiji, Liu Rengui." },
      { year: 662, label: "White Tiger dies at the Snake River; Xue Rengui named White Tiger II." },
      { year: 663, label: "Black Tortoise Liu Rengui burns the eastern fleet at the White River." },
      { year: 668, label: "Blue Dragon, Black Tortoise, and White Tiger II take Pyongyang." }
    ],
    orgChart: [
      { id: "gaozong", role: "Third Emperor", reportsTo: null },
      { id: "pangxiaotai", role: "White Tiger \xB7 \uBC31\uD638 \xB7 fallen 662", reportsTo: "gaozong" },
      { id: "xuerengui", role: "White Tiger II \xB7 \uBC31\uD638 \xB7 after Snake River", reportsTo: "pangxiaotai" },
      { id: "sudingfang", role: "Red Fowl \xB7 \uC8FC\uC791 \xB7 Su Dingfang", reportsTo: "gaozong" },
      { id: "lishiji", role: "Blue Dragon \xB7 \uCCAD\uB8E1 \xB7 also Four Dragons", reportsTo: "gaozong" },
      { id: "liurengui", role: "Black Tortoise \xB7 \uD604\uBB34 \xB7 Liu Rengui", reportsTo: "gaozong" }
    ],
    aliases: ["Four Beasts", "\uC0AC\uC2E0", "\u56DB\u795E", "Gaozong\u2019s beasts"]
  },
  {
    id: "four_divisions",
    name: "The Three Realms",
    korean: "\uC0BC\uACC4",
    entity: "organization",
    kingdom: "other",
    title: "Cosmology \u2014 three courts beneath Hwanin\u2019s heaven",
    tagline: "Three Realms under the Creator: \uC774\uC2B9, \uC800\uC2B9, \uC11C\uCC9C\uAF43\uBC2D \u2014 Heaven is above, not a peer.",
    quote: "West far enough, and even the living world ends.",
    nature: "Not a map of nations but of jurisdiction. Above: Hwanin (Class S) \u2014 Creator, Lord, King of Kings, the Big Man Upstairs. Class I gods each keep one of the Three Realms. Legacy id `four_divisions` kept for wiki links; preferred name is Three Realms / \uC0BC\uACC4.",
    arc: "The chronicle\u2019s cosmology \u2014 Three Realms (\uC0BC\uACC4) \u2014 told first on Tamla when Yuri Dora names the structure for Gyebek:\n\nAbove: Hwanin / \uD658\uC778 (Class S) \u2014 Creator; keeps \uD558\uB298\uB098\uB77C as his own court, not a peer realm. Mandate descends Hwanung \u2192 Dangun into the mortal domain.\n\n1. \uC774\uC2B9 \u2014 Land of the Living, ruled by Little Star / \uC18C\uBCC4\uC655 (Class I). Retinue: Ibiga (sky), Haemosu (sun), Samsin (life). Yuhwa keeps the moon after death.\n2. \uC800\uC2B9 \u2014 Land of the Dead, ruled by Big Star / \uB300\uBCC4\uC655 (Class I). Within: Yumla\u2019s judgment court; Kangrim and Haewonmek fetch.\n3. \uC11C\uCC9C\uAF43\uBC2D \u2014 Western Flower Field, kept by Hallakgungi (\uD560\uB77D\uAD81\uC774, Class I). Resurrection and ruin in the same rows.\n\nHeaven\u2019s Court is not a fourth realm \u2014 it is Hwanin\u2019s seat above \uC0BC\uACC4. Tamla stays carefree about the Great War partly because it knows how much larger the world is than Samhan\u2019s maps.",
    events: [
      { label: "Heaven\u2013Earth King retires; Big Star and Little Star inherit living and dead under Hwanin." },
      { label: "Yuri Dora first names \uC0BC\uACC4 for Gyebek after the flower-wager myth." },
      { label: "Big Star and Little Star divide \uC774\uC2B9 and \uC800\uC2B9 by a flower wager." },
      { label: "Hwanin keeps Heaven above; Hallakgungi keeps the western flowers; Yumla judges inside \uC800\uC2B9." }
    ],
    orgChart: [
      { id: "hwanin", role: "Creator \xB7 Lord of Heaven \xB7 Class S", reportsTo: null },
      { id: "sobyeol", role: "\uC774\uC2B9 \xB7 Little Star \xB7 Class I", reportsTo: "hwanin" },
      { id: "daebyeol", role: "\uC800\uC2B9 \xB7 Big Star \xB7 Class I", reportsTo: "hwanin" },
      { id: "sara", role: "\uC11C\uCC9C\uAF43\uBC2D \xB7 Hallakgungi \xB7 Class I", reportsTo: "hwanin" },
      { id: "ibiga", role: "Sky \xB7 Ibiga", reportsTo: "sobyeol" },
      { id: "haemosu", role: "Sun \xB7 Haemosu", reportsTo: "sobyeol" },
      { id: "yuhwa", role: "Moon \xB7 Yuhwa", reportsTo: "sobyeol" },
      { id: "samsin", role: "Life \xB7 Samsin", reportsTo: "sobyeol" },
      { id: "yumla", role: "Judgment \xB7 Yumla", reportsTo: "daebyeol" },
      { id: "kangrim", role: "Fetch \xB7 Kangrim", reportsTo: "daebyeol" },
      { id: "haewonmek", role: "Fetch \xB7 Haewonmek", reportsTo: "daebyeol" }
    ],
    aliases: [
      "Three Realms",
      "The Three Realms",
      "\uC0BC\uACC4",
      "Four Realms",
      "The Four Realms",
      "Four Divisions",
      "The Four Divisions",
      "\uC0AC\uACC4",
      "\uB124 \uC138\uACC4",
      "\uD558\uB298\uB098\uB77C \uC870\uC815",
      "Heaven court",
      "cosmology",
      "worldview"
    ]
  }
];
var GROUPS = [
  {
    id: "caverngoddesses",
    name: "The Three Cavern Goddesses",
    korean: "\uC0BC\uC131\uC5EC\uC2E0",
    entity: "group",
    kingdom: "silla",
    title: "Sisters of the steam cavern",
    tagline: "Narim, Golhwa, and Hyull\xE9 \u2014 three goddesses of the cavern lake who keep only Kims.",
    arc: "Eldest, youngest, and the quiet one between: the three sisters of the steam cavern beyond Surabol. They loved Kim Seohyeon first \u2014 surname and steam, same sound \u2014 and every Kim who finds the lake after him is heirloom.",
    aliases: ["Three Cavern Goddesses", "The Three Cavern Goddesses", "\uC0BC\uC131\uC5EC\uC2E0"]
  },
  {
    id: "eternalhwarang",
    name: "The Three Eternal Hwarang",
    korean: "\uD654\uB791\uC0BC\uC6C5",
    entity: "group",
    kingdom: "silla",
    title: "The flower knights the age remembers",
    tagline: "Yushin, Alchun, and Bidam \u2014 Class 51 (\uC624\uC2ED\uC77C\uAE30), the three Hwarang whose names outlast the order itself.",
    arc: "Of all the flower knights Surabol raised, three names refuse to fade: Yushin the sword, Alchun the elder statesman, Bidam the rebel \u2014 Class 51, \uC624\uC2ED\uC77C\uAE30. The order made many; the chronicle keeps these three.",
    aliases: ["Three Eternal Hwarang", "The Three Eternal Hwarang", "\uD654\uB791\uC0BC\uC6C5"]
  },
  {
    id: "gayakims",
    name: "The Three Gaya Kims",
    korean: "\uAC00\uC57C\uC0BC\uAE40",
    entity: "group",
    kingdom: "gaya",
    title: "Three generations from surrender to sword",
    tagline: "Muryuk, Seohyeon, Yushin \u2014 grandfather, father, son: the Gaya line that became Silla\u2019s blade.",
    arc: "Muryuk traded a kingdom so his blood could keep a sword; Seohyeon made the surrender into a household; Yushin made the household into a legend. Three generations of Geumgwan Kims, from the last prince of Golden Gaya to the Sword of Silla.",
    aliases: ["Three Gaya Kims", "The Three Gaya Kims", "\uAC00\uC57C\uC0BC\uAE40"]
  },
  {
    id: "sacredbones",
    name: "The Three Sacred Bones",
    korean: "\uC131\uACE8\uC0BC\uB140",
    entity: "group",
    kingdom: "silla",
    title: "The last women of the Sacred Bone",
    tagline: "Dukman, Seungman, Chunmyung \u2014 the three Sacred Bone women who closed the holy line.",
    arc: "When the Sacred Bone ran out of men, it ran on women: Dukman took the throne, Seungman held it after her, and Chunmyung traded her claim for a son who would be king. Three cousins, one exhausted holiness.",
    aliases: ["Three Sacred Bones", "The Three Sacred Bones", "\uC131\uACE8\uC0BC\uB140"]
  },
  {
    id: "realmgods",
    name: "The Three Realm Gods",
    korean: "\uC0BC\uACC4\uC81C\uC2E0",
    entity: "group",
    kingdom: "other",
    title: "Class I \u2014 one court each of the Three Realms",
    tagline: "Hallakgungi, Big Star, Little Star \u2014 the three Class I gods who keep \uC11C\uCC9C\uAF43\uBC2D, \uC800\uC2B9, and \uC774\uC2B9.",
    arc: "Beneath Hwanin\u2019s heaven, three keepers split the world: Little Star rules the living, Big Star the dead, and Hallakgungi keeps the Western Flower Field between them. One court each of \uC0BC\uACC4 \u2014 heaven\u2019s ruler stays above, not among them.",
    aliases: ["Three Realm Gods", "The Three Realm Gods", "\uC0BC\uACC4\uC81C\uC2E0"]
  },
  {
    id: "fourrealms",
    name: "The Four Realms",
    korean: "\uC0AC\uACC4",
    hanja: "\u56DB\u754C",
    entity: "group",
    kingdom: "other",
    title: "\uD558\uB298\uB098\uB77C, \uC774\uC2B9, \uC800\uC2B9, \uC11C\uCC9C\uAF43\uBC2D",
    tagline: "The cosmological courts: Heaven above; Living World, Underworld, and Western Flower Field below.",
    arc: "A group of places, not of gods \u2014 the encyclopedia\u2019s four cosmological courts. The chronicle\u2019s \uC0BC\uACC4 are \uC774\uC2B9, \uC800\uC2B9, and \uC11C\uCC9C\uAF43\uBC2D; \uD558\uB298\uB098\uB77C sits above them and is not counted as a peer. The yearly \uC815\uC790 is a meeting floor between the three lower courts, not a realm of its own. Flower Cliff is a drop inside the western field.",
    color: "#d4b86a",
    aliases: [
      "The Four Realms",
      "Four Realms places",
      "the cosmological places",
      "Realm places",
      "\uC0AC\uACC4 \uC7A5\uC18C"
    ]
  },
  {
    id: "lifegods",
    name: "The Life Gods",
    korean: "\uC774\uC2B9\uC0BC\uC2E0",
    entity: "group",
    kingdom: "other",
    title: "Little Star\u2019s retinue in the land of the living",
    tagline: "Haemosu, Ibiga, Samsin \u2014 sun, sky, and life: the three gods who tend \uC774\uC2B9.",
    arc: "The living world runs on three offices under Little Star: Haemosu drives the sun, Ibiga keeps the sky, and Samsin hands out life itself. Where the reapers close doors, these three keep opening them.",
    aliases: ["Life Gods", "The Life Gods", "\uC774\uC2B9\uC0BC\uC2E0"]
  },
  {
    id: "grimreapers",
    name: "The Grim Reapers",
    korean: "\uC800\uC2B9\uC0AC\uC790",
    entity: "group",
    kingdom: "underworld",
    title: "The fetch-officers of the dead",
    tagline: "Kangrim and Haewonmek \u2014 the two reapers who walk the living world to collect its dead.",
    arc: "Big Star keeps the dark; these two do the walking. Kangrim is the living strongman whose soul Yumla kept; Haewonmek was already on that road and pointed. The pair every death scene in the chronicle waits for.",
    aliases: ["Grim Reapers", "The Grim Reapers", "\uC800\uC2B9\uC0AC\uC790"]
  },
  {
    id: "brafounders",
    name: "BRA Founding Captains",
    korean: "\uBD80\uD765\uAD70 \uC624\uC7A5",
    hanja: "\u5FA9\u8208\u8ECD\u4E94\u5C07",
    entity: "group",
    kingdom: "baekje",
    title: "The five who raised the restoration banner",
    tagline: "Boksin, Dochim, Sangji, Sangya \u2014 and Pungjang\u2019s crown fetched from Yamato.",
    arc: "Not Eight-Clan furniture: four generals and a prince who turned refugees into a kingdom-that-almost-was. They share one banner, one fracture, and one river mouth.",
    aliases: ["BRA Founders", "BRA Founding Captains", "Five founding members", "\uBD80\uD765\uAD70 \uC624\uC7A5"]
  },
  {
    id: "fiveprinces",
    name: "The Five Princes of Baekje",
    korean: "\uBC31\uC81C\uC624\uC790",
    entity: "group",
    kingdom: "baekje",
    title: "Euija\u2019s five important sons",
    tagline: "Yung, Tae, Hyo, Yun, Pung \u2014 five princes of fifty-odd, and the feud that finished a kingdom.",
    arc: "Euija fathered dozens; the chronicle needs five. Yung the demoted eldest, Tae the self-crowned, Hyo the chosen, Yun the quiet one, Pung the restoration king. Their rivalry outlives the court that made it \u2014 finished at the White River, brother opposite brother.",
    aliases: ["Five Princes of Baekje", "The Five Princes of Baekje", "\uBC31\uC81C\uC624\uC790"]
  },
  {
    id: "fivecommanders",
    name: "The Five Commanders of Goguryeo",
    korean: "\uACE0\uB824\uC624\uB300\uAC00",
    entity: "group",
    kingdom: "goguryeo",
    title: "Four directional \uB300\uAC00 and the High Commander",
    tagline: "Four directional \uB300\uAC00 and the High Commander \u2014 the Five Tribes under later names.",
    arc: "The five animal roofs of Jolbon renamed as commanderies: Gesomun in the East (crow tribe, Eastern Crow Blade), Go Heumsong in the West (cow ka), Son Daeha in the South (pig ka), Go Ul in the North (dog ka), and Yeon Gusesa as High Commander on the horse ka\u2019s central seat with the \uB9C9\uB9AC\uC9C0\uAC80. In 642 the Eastern Commander \u2014 crow roof, Yeon hall \u2014 butchers the other four at a banquet. He keeps the Eastern Crow Blade he brought and takes the rest. They are five swords, not one weapon.",
    events: [{ year: 642, label: "Four of the five die at Yeon\u2019s banquet; the Eastern Commander rules." }],
    aliases: ["Five Commanders of Goguryeo", "The Five Commanders of Goguryeo", "\uACE0\uB824\uC624\uB300\uAC00"]
  },
  {
    id: "threefounders",
    name: "The Three Founders",
    korean: "\uC0BC\uB300\uC2DC\uC870",
    entity: "group",
    kingdom: "other",
    title: "Founders of the Three Kingdoms",
    tagline: "Hyukgos\xE9, Jumong, Onjo \u2014 the three founders of Silla, Goguryeo, and Baekje.",
    arc: "Three beginnings for three crowns: Hyukgos\xE9 hatched from the egg the Founding Six Elders dug at Najeong, Jumong shot his way out of Buyeo, and Onjo walked south from his mother\u2019s second founding. Every war in the chronicle argues about what these three started.",
    aliases: ["Three Founders", "The Three Founders", "\uC0BC\uB300\uC2DC\uC870"]
  },
  {
    id: "greatwomen",
    name: "The Three Great Women",
    korean: "\uC0BC\uB300\uC131\uB140",
    entity: "group",
    kingdom: "other",
    title: "The founding mothers of the kingdoms",
    tagline: "Alyoung, Sosuno, Heo \u2014 the three women at the root of Silla, Baekje, and Gaya.",
    arc: "The founders get the eggs and the arrows; these three get the kingdoms to keep. Alyoung, born of a Chicken Dragon beside Silla\u2019s first king; Sosuno, who founded one kingdom with her husband and another with her sons; Heo, who sailed in from a country nobody had heard of and kept her own name.",
    aliases: ["Three Great Women", "The Three Great Women", "\uC0BC\uB300\uC131\uB140"]
  },
  {
    id: "traitors",
    name: "The Traitors",
    korean: "\uBC30\uC2E0\uC790\uB4E4",
    entity: "group",
    kingdom: "other",
    rosterBy: "kingdom",
    title: "The men who opened the door from inside",
    tagline: "Every kingdom in this chronicle fell, or nearly fell, through a door someone inside unlocked.",
    quote: "No wall falls while everyone behind it agrees.",
    arc: "No wall in this chronicle is ever taken while everyone behind it agrees. Old Joseon held the Han for a year at Wanggeom until its own ministers killed the king and lifted the bar. Silla lost Daeya to two yellow-sleeve officers its bone ranks would never promote, later caught an official writing to the Tang, and watched an executed noble\u2019s son pilot a Tang fleet onto its coast. Baekje\u2019s capital opened from the inside, its king was handed over by the man sheltering him, its crown prince came back to govern for the Tang, and two restoration generals took Tang commissions and marched on their old comrades. Goguryeo\u2019s heir led the emperor\u2019s army home, its regent\u2019s brother walked south to Silla with twelve fortresses, and in the end a monk and a general unbarred Pyongyang. These are not the men who merely surrendered: they worked for the other side. The chronicle gives each of them a reason. It does not give any of them a statue.",
    events: [
      { year: -108, label: "Sam, Noin, Choi and Prince Jang Hang open Wanggeom to the Han." },
      { year: 642, label: "Gumil and Mochuk open Daeya to Baekje." },
      { year: 660, label: "Sabi\u2019s gate opens; Ye Sikjin hands Euija to the Red Fowl." },
      { year: 663, label: "Heukchi Sangji and Satek Sangya march for the Tang." },
      { year: 664, label: "Buyeo Yung returns as governor of the Bear Ford Commandery." },
      { year: 666, label: "Yeon Namseng goes to the Tang; Yeon Jungto takes twelve fortresses to Silla." },
      { year: 668, label: "Shinsung and Yomyo open Pyongyang." },
      { year: 673, label: "Daeto is executed for promising the Tang a door." },
      { year: 675, label: "Kim Punghun pilots the Tang fleet to Cheonseong." }
    ],
    aliases: ["The Traitors", "Traitors", "\uBC30\uC2E0\uC790\uB4E4"]
  },
  {
    id: "defectors",
    name: "The Defectors",
    korean: "\uADC0\uC21C\uC790\uB4E4",
    entity: "group",
    kingdom: "other",
    rosterBy: "kingdom",
    title: "The ones who crossed over and stayed",
    tagline: "They laid down their arms, took the other country\u2019s rank, and lived out their lives inside it.",
    quote: "A man can change his country once. After that it is only weather.",
    arc: "Not every man who changes sides opens a gate. These surrendered, or simply went, and then lived the rest of their lives as subjects of the country they had crossed into. None of them led its army back against home. A Gaya prince handed over his kingdom and his grandson became Silla\u2019s greatest general. A Silla prince spent most of his life in Chang\u2019an and died there. Two Goguryeo commanders walked into the Tang camp at Stallion Mountain and were given ministries far from any border. A Baekje prince climbed down his city wall on a rope, and a Goguryeo prince surrendered Pyongyang when the gate was already open. The empire collected them the way it collected horses.",
    events: [
      { year: 532, label: "Muryuk surrenders Golden Gaya and enters Silla\u2019s True Bone." },
      { year: 645, label: "Go Yeonsu and Go Hyejin surrender at Stallion Mountain." },
      { year: 660, label: "Buyeo Munsa climbs down the wall of Sabi to the Tang camp." },
      { year: 668, label: "Yeon Namsan surrenders Pyongyang and is taken to Chang\u2019an." },
      { year: 694, label: "Kim Inmun dies in Chang\u2019an." }
    ],
    aliases: ["The Defectors", "Defectors", "\uADC0\uC21C\uC790\uB4E4"]
  }
];
var CLANS = [
  {
    id: "clan-yeon",
    name: "Yeon",
    korean: "\uC5F0\uC528",
    hanja: "\u6DF5\u6C0F",
    entity: "clan",
    kingdom: "goguryeo",
    title: "Clan of Yeon Tabal \u2192 Gesomun",
    tagline: "Salt, iron, and crow-stamped blades \u2014 the hall that preferred carrying to asking.",
    arc: "From Yeon Tabal\u2019s crow roof at Jolbon \u2014 largest of five animal tribes \u2014 to the eastern commandery Gesomun holds as \uB300\uAC00, then the massacre and three quarreling sons. The house outranks ordinary Commanders once Supreme Commander exists; it cannot invent a succession that survives Gesomun\u2019s sleep.",
    aliases: ["Yeon House", "Yeon clan", "\uC5F0\uC528", "\u6DF5\u6C0F", "House of Yeon", "The Yeon House"]
  },
  {
    id: "clan-gyeongju-kim",
    name: "Surabol Kim",
    korean: "\uACBD\uC8FC \uAE40\uC528",
    hanja: "\u5F90\u7F85\u4F10 \u91D1\u6C0F",
    entity: "clan",
    kingdom: "silla",
    title: "Royal Kim line of Surabol (Alji)",
    tagline: "The capital house that wears purple and argues over thrones in the same breath.",
    arc: "Alji\u2019s line and the Surabol Kims \u2014 Jinheung, Sunduk, Jinduk, Gotaso, Munmu\u2019s royal house. Era identity is bon-gwan plus Kim; modern records call them Gyeongju Kim (\uACBD\uC8FC \uAE40\uC528). Distinct from the Gaya Kim line that entered through Golden Gaya\u2019s surrender.",
    aliases: [
      "Surabol Kim",
      "Kim of Surabol",
      "Royal Silla Kim",
      "Gyeongju Kim",
      "\uACBD\uC8FC \uAE40\uC528",
      "Kim of Gyeongju",
      "\u6176\u5DDE\u91D1\u6C0F"
    ]
  },
  {
    id: "clan-surabol-lee",
    name: "Surabol Lee",
    korean: "\uACBD\uC8FC \uC774\uC528",
    hanja: "\u5F90\u7F85\u4F10 \u674E\u6C0F",
    entity: "clan",
    kingdom: "silla",
    title: "Lee line of Alcheon \xB7 Geupnyang-bu",
    tagline: "Alpyung\u2019s house \u2014 first dig at Najeong, first elder seat.",
    arc: "Founding elder Alpyung of Alcheon Yangsan-chon (\uC54C\uCC9C \uC591\uC0B0\uCD0C), head of Geupnyang-bu (\uAE09\uB7C9\uBD80). Era identity: Surabol Lee (\uC11C\uB77C\uBC8C \uC774\uC528); modern bon-gwan Gyeongju Lee (\uACBD\uC8FC \uC774\uC528). True Bone by founding blood \u2014 one of the six lines the egg-born king raised.",
    aliases: ["Surabol Lee", "Lee of Surabol", "Gyeongju Lee", "\uACBD\uC8FC \uC774\uC528", "\uC774\uC528", "\u674E\u6C0F"]
  },
  {
    id: "clan-surabol-choi",
    name: "Surabol Choi",
    korean: "\uACBD\uC8FC \uCD5C\uC528",
    hanja: "\u5F90\u7F85\u4F10 \u5D14\u6C0F",
    entity: "clan",
    kingdom: "silla",
    title: "Choi line of Dolsan \xB7 Saryang-bu",
    tagline: "Sobuldori\u2019s house \u2014 Alchun\u2019s ancestor, Saryang-bu and the older courtesy.",
    arc: "Founding elder Sobuldori of Dolsan Goheo-chon (\uB3CC\uC0B0 \uACE0\uD5C8\uCD0C), head of Saryang-bu (\uC0AC\uB7C9\uBD80). Era: Surabol Choi (\uC11C\uB77C\uBC8C \uCD5C\uC528); modern Gyeongju Choi (\uACBD\uC8FC \uCD5C\uC528). Alchun of the Hwarang descends this line \u2014 the chronicle names Sobuldori in the founding table and lets Alchun inherit the name without boasting.",
    aliases: ["Surabol Choi", "Choi of Surabol", "Gyeongju Choi", "\uACBD\uC8FC \uCD5C\uC528", "\uCD5C\uC528", "\u5D14\u6C0F"]
  },
  {
    id: "clan-surabol-jeong",
    name: "Surabol Jeong",
    korean: "\uACBD\uC8FC \uC815\uC528",
    hanja: "\u5F90\u7F85\u4F10 \u912D\u6C0F",
    entity: "clan",
    kingdom: "silla",
    title: "Jeong line of Chuisan \xB7 Bonpi-bu",
    tagline: "Jibekho\u2019s house \u2014 lineage, census, who counts as bone.",
    arc: "Founding elder Jibekho of Chuisan Jinji-chon (\uCDE8\uC0B0 \uC9C4\uC9C0\uCD0C), head of Bonpi-bu (\uBCF8\uD53C\uBD80). Era: Surabol Jeong (\uC11C\uB77C\uBC8C \uC815\uC528); modern Gyeongju Jeong (\uACBD\uC8FC \uC815\uC528). The department that keeps registers echoes in every later bone-rank quarrel.",
    aliases: ["Surabol Jeong", "Jeong of Surabol", "Gyeongju Jeong", "\uACBD\uC8FC \uC815\uC528", "\uC815\uC528", "\u912D\u6C0F", "Jung clan"]
  },
  {
    id: "clan-surabol-son",
    name: "Surabol Son",
    korean: "\uACBD\uC8FC \uC190\uC528",
    hanja: "\u5F90\u7F85\u4F10 \u5B6B\u6C0F",
    entity: "clan",
    kingdom: "silla",
    title: "Son line of Musan \xB7 Jeomnyang-bu",
    tagline: "Gurema\u2019s house \u2014 Musan hall, oldest pride, Bidam\u2019s implied blood.",
    arc: "Founding elder Gurema of Musan Daesu-chon (\uBB34\uC0B0 \uB300\uC218\uCD0C), head of Jeomnyang-bu (\uC810\uB7C9\uBD80). Era: Surabol Son (\uC11C\uB77C\uBC8C \uC190\uC528); modern Gyeongju Son (\uACBD\uC8FC \uC190\uC528). Bidam\u2019s black robe and old-hall steel read as this line \u2014 never stated, always implied.",
    aliases: ["Surabol Son", "Son of Surabol", "Gyeongju Son", "\uACBD\uC8FC \uC190\uC528", "\uC190\uC528", "\u5B6B\u6C0F"]
  },
  {
    id: "clan-surabol-bae",
    name: "Surabol Bae",
    korean: "\uACBD\uC8FC \uBC30\uC528",
    hanja: "\u5F90\u7F85\u4F10 \u88F4\u6C0F",
    entity: "clan",
    kingdom: "silla",
    title: "Bae line of Geumsan \xB7 Hangi-bu",
    tagline: "Jita\u2019s house \u2014 gold mountain, hill forts, Hangi-bu.",
    arc: "Founding elder Jita of Geumsan Gari-chon (\uAE08\uC0B0 \uAC00\uB9AC\uCD0C), head of Hangi-bu (\uD55C\uAE30\uBD80). Era: Surabol Bae (\uC11C\uB77C\uBC8C \uBC30\uC528); modern Gyeongju Bae (\uACBD\uC8FC \uBC30\uC528).",
    aliases: ["Surabol Bae", "Bae of Surabol", "Gyeongju Bae", "\uACBD\uC8FC \uBC30\uC528", "\uBC30\uC528", "\u88F4\u6C0F"]
  },
  {
    id: "clan-surabol-seol",
    name: "Surabol Seol",
    korean: "\uACBD\uC8FC \uC124\uC528",
    hanja: "\u5F90\u7F85\u4F10 \u859B\u6C0F",
    entity: "clan",
    kingdom: "silla",
    title: "Seol line of Myeonghwalsan \xB7 Seupbi-bu",
    tagline: "Hojin\u2019s house \u2014 wet rites, six hearths bound to one smoke.",
    arc: "Founding elder Hojin of Myeonghwalsan Goya-chon (\uBA85\uD65C\uC0B0 \uACE0\uC57C\uCD0C), head of Seupbi-bu (\uC2B5\uBE44\uBD80). Era: Surabol Seol (\uC11C\uB77C\uBC8C \uC124\uC528); modern Gyeongju Seol (\uACBD\uC8FC \uC124\uC528).",
    aliases: ["Surabol Seol", "Seol of Surabol", "Gyeongju Seol", "\uACBD\uC8FC \uC124\uC528", "\uC124\uC528", "\u859B\u6C0F"]
  },
  {
    id: "clan-geumgwan-kim",
    name: "Gaya Kim",
    korean: "\uAE40\uD574 \uAE40\uC528 \xB7 \uAE08\uAD00 \uAE40\uC528",
    hanja: "\u52A0\u8036 \u91D1\u6C0F",
    entity: "clan",
    kingdom: "gaya",
    title: "Kim line from Golden Gaya (Suro)",
    tagline: "Last princely blood of Gaya \u2014 Yushin\u2019s edge inside Silla\u2019s True Bone.",
    arc: "The Kim surname that arrived when Golden Gaya fell. Suro and Queen Heo (by marriage), Ijinasi\u2019s brother-line claim, Muryuk\u2019s surrender, Seohyeon in the steam, Yushin and Munhee inside Silla\u2019s True Bone \u2014 periphery loyalty that out-loves the centre without erasing the Gaya origin. Modern records split the name between Gimhae Kim (\uAE40\uD574 \uAE40\uC528) and Geumgwan Kim (\uAE08\uAD00 \uAE40\uC528).",
    aliases: [
      "Gaya Kim",
      "Kim of Gaya",
      "Geumgwan Kim",
      "Kim \xB7 Geumgwan Gaya line",
      "\uAE40\uD574 \uAE40\uC528",
      "\uAE08\uAD00 \uAE40\uC528",
      "\u91D1\u5B98\u91D1\u6C0F"
    ]
  },
  {
    id: "clan-buyeo",
    name: "Buyeo",
    korean: "\uBD80\uC5EC",
    hanja: "\u6276\u9918",
    entity: "clan",
    kingdom: "baekje",
    title: "Royal house of Baekje",
    tagline: "The kings\u2019 surname \u2014 fifty sons, five who matter, one throne.",
    arc: "Euija\u2019s house and the princes who inherit or lose the mark: Yung, Tae, Hyo, Yun, Pung. Maternal Eight-Clan claims ride underneath the Buyeo name.",
    aliases: ["Buyeo royal house", "Buyeo", "\uBD80\uC5EC", "\u6276\u9918", "Royal house of Baekje"]
  },
  {
    id: "clan-satek",
    name: "Satek",
    korean: "\uC0AC\uD0DD",
    hanja: "\u6C99\u5B85",
    entity: "clan",
    kingdom: "baekje",
    title: "One of the Eight Great Clans",
    tagline: "Queen\u2019s sleeve and Prime Minister\u2019s chair \u2014 until Euija cuts both.",
    arc: "Holds Queen Satek (Euija\u2019s mother) and Minister Satek\u2019s ministry in the same generation. Yung\u2019s maternal claim. The purge of 655 empties their Deer Rock seats.",
    aliases: ["Satek", "\uC0AC\uD0DD", "\u6C99\u5B85", "Satek clan"]
  },
  {
    id: "clan-yunbi",
    name: "Yunbi",
    korean: "\uC5F0\uBE44",
    hanja: "\u71D5\u6BD4",
    entity: "clan",
    kingdom: "baekje",
    title: "One of the Eight Great Clans",
    tagline: "Harbour arithmetic and a different \uC5F0 \u2014 never Yeon Gesomun\u2019s house.",
    arc: "Elder Yunbi and Lady Yunbi speak for berths and vetoes. Not Prince Yun\u2019s Buyeo \uC5F0, not Goguryeo\u2019s \u6DF5.",
    aliases: ["Yunbi", "\uC5F0\uBE44", "\u71D5\u6BD4", "Yunbi clan"]
  },
  {
    id: "clan-jinmo",
    name: "Jinmo",
    korean: "\uC9C4\uBAA8",
    hanja: "\u771E\u725F",
    entity: "clan",
    kingdom: "baekje",
    title: "One of the Eight Great Clans",
    tagline: "Prestige house \u2014 Prince Tae\u2019s maternal whisper.",
    arc: "Counted among the eight that seat and unseat kings. Tae is their quiet claim among Euija\u2019s five.",
    aliases: ["Jinmo", "\uC9C4\uBAA8", "\u771E\u725F", "Jinmo clan"]
  },
  {
    id: "clan-mokli",
    name: "Mokli",
    korean: "\uBAA9\uB9AC",
    hanja: "\u6728\u5215",
    entity: "clan",
    kingdom: "baekje",
    title: "One of the Eight Great Clans",
    tagline: "Timber and eastern berths \u2014 Pung\u2019s maternal look across the water.",
    arc: "The house that already faces Yamato before the court parks a prince there. Pungjang\u2019s restoration wears their grain as much as Buyeo blood.",
    aliases: ["Mokli", "\uBAA9\uB9AC", "Mokli clan"]
  },
  {
    id: "clan-hae",
    name: "Hae",
    korean: "\uD574",
    hanja: "\u89E3",
    entity: "clan",
    kingdom: "baekje",
    title: "One of the Eight Great Clans",
    tagline: "Coast salt \u2014 Prince Yun\u2019s maternal hook.",
    arc: "Harbour house among the eight. Easy to overlook in succession theatre; useful when ships matter.",
    aliases: ["Hae", "\uD574", "\u89E3", "Hae clan"]
  },
  {
    id: "clan-baek",
    name: "Baek",
    korean: "\uBC31",
    hanja: "\u82E9",
    entity: "clan",
    kingdom: "baekje",
    title: "One of the Eight Great Clans",
    tagline: "One of the eight sleeves on Deer Rock.",
    arc: "Named with the Great Clans that own Assembly chairs before Euija seats his sons over them.",
    aliases: ["Baek", "\uBC31", "Baek clan"]
  },
  {
    id: "clan-guk",
    name: "Guk",
    korean: "\uAD6D",
    hanja: "\u570B",
    entity: "clan",
    kingdom: "baekje",
    title: "One of the Eight Great Clans",
    tagline: "One of the eight sleeves on Deer Rock.",
    arc: "Named with the Great Clans; emptied with them in 655.",
    aliases: ["Guk", "\uAD6D", "Guk clan"]
  },
  {
    id: "clan-ahn",
    name: "Ahn",
    korean: "\uC548",
    hanja: "\u5B89",
    entity: "clan",
    kingdom: "baekje",
    title: "One of the Eight Great Clans",
    tagline: "One of the eight sleeves on Deer Rock.",
    arc: "Named with the Great Clans; emptied with them in 655.",
    aliases: ["Ahn", "\uC548", "Ahn clan"]
  },
  {
    id: "clan-gwishil",
    name: "Gwishil",
    korean: "\uADC0\uC2E4",
    hanja: "\u9B3C\u5BA4",
    entity: "clan",
    kingdom: "baekje",
    title: "House of Gwishil Boksin",
    tagline: "Not Eight-Clan furniture \u2014 the muscle that builds the Restoration Army.",
    arc: "Boksin\u2019s surname. Frontier competence the Deer Rock houses never invited to lunch, then needed after Sabi.",
    aliases: ["Gwishil", "\uADC0\uC2E4", "\u9B3C\u5BA4", "Gwishil clan"]
  },
  {
    id: "clan-go",
    name: "Go",
    korean: "\uD6A1\uC131 \uACE0\uC528 \xB7 \u6A6B\u57CE \u9AD8\u6C0F",
    hanja: "\u9AD8\u6C0F",
    entity: "clan",
    kingdom: "goguryeo",
    title: "Royal Go house of Goguryeo",
    tagline: "Jumong\u2019s surname on the throne \u2014 until Yeon makes the crown a formality.",
    arc: "The royal Go line Jumong founds and Youngryu and Bojang wear \u2014 Sosuno joins by marriage from the Yeon hall. Yeon\u2019s Supreme Commander leaves the name on the lintel and empties it of command. Modern Joseon-era records attach the bon-gwan Hoengseong (\uD6A1\uC131 \uACE0\uC528 / \u6A6B\u57CE \u9AD8\u6C0F); in-period the house is simply Go.",
    aliases: ["Go", "Go house", "Go clan", "Royal Go", "\uACE0\uC528", "\u9AD8\u6C0F", "\uD6A1\uC131 \uACE0\uC528", "\u6A6B\u57CE \u9AD8\u6C0F"]
  }
];
var NATIONS = [
  {
    id: "nation-silla",
    name: "Silla",
    korean: "\uC2E0\uB77C",
    hanja: "\u65B0\u7F85",
    entity: "nation",
    kingdom: "silla",
    born: -57,
    died: 935,
    title: "The Divine Country",
    photo: "/nations/silla.jpg",
    photoCredit: "Cheomseongdae observatory, Gyeongju \u2014 built under Queen Seondeok (Wikimedia Commons)",
    tagline: "The Divine Country \u2014 smallest of the three, and the one left standing.",
    ideology: "Caste traditionalism \u2192 diplomatic modernizer",
    ideologyNote: "Rigid bone rank that learns the West\u2019s grammar to keep its own name on the lintel.",
    nature: "Bone Rank sorts who may rule; the Harmony Council sorts who may act \u2014 and only when every noble agrees. Hwarang forge the boys who will either save the throne or rebel against it \u2014 elite of the elite, lettered and beautiful, with fighting forms the yards still name. Whoever wears the crown is understood to speak for the heavenly horse. Centralisation (Secretariat, Tang alliance) is always a fight with the old halls.",
    arc: "Founded, the legend says, when a white horse left an egg under a blue sky before the chiefs of six clans \u2014 a kingdom that would keep the moon on its banners and love as its quiet engine. Silla is the furthest from the West, the last to take Buddhism, the most rigid in caste \u2014 and the one that learns diplomacy because it cannot win alone. Under Queen Seondeok it survives; under Muyeol and Munmu it allies with the Tang to destroy Baekje and Goryeo, then turns and expels the Tang itself. It rules the unified peninsula for two and a half more centuries.",
    events: [
      { year: -57, label: "Founded at Seorabeol by Hyukgos\xE9, the legend says." },
      { year: 532, label: "Absorbs Golden Gaya." },
      { year: 660, label: "Destroys Baekje with the Tang." },
      { year: 668, label: "Destroys Goguryeo." },
      { year: 676, label: "Expels the Tang; unifies the peninsula below the Taedong." },
      { year: 935, label: "Ends, absorbed into Goryeo." }
    ],
    sobriquets: ["the Divine Country", "Land of the Rooster Forest"],
    aliases: [
      "Silla",
      "the Divine Country",
      "Divine Country",
      "Land of the Rooster Forest",
      "Rooster Forest"
    ]
  },
  {
    id: "nation-baekje",
    name: "Baekje",
    korean: "\uBC31\uC81C",
    hanja: "\u767E\u6FDF",
    entity: "nation",
    kingdom: "baekje",
    born: -18,
    died: 660,
    title: "Land of the Heavenly Deer",
    photo: "/nations/baekje.jpg",
    photoCredit: "Gilt-bronze Incense Burner of Baekje, National Treasure no. 287 (Wikimedia Commons)",
    tagline: "Land of the Heavenly Deer \u2014 most refined of the three, teacher of the East.",
    ideology: "Maritime aristocratic cosmopolitanism",
    ideologyNote: "Sea-lane polish, clan vetoes, and a court that taught the islands manners.",
    nature: "Eight Great Clans and a Ministers\u2019 Assembly that can move on a plurality \u2014 faster than Silla, bloodier in the street. Royal Buyeo sits above a permanent Satek\u2013Yunbi knife-fight; kings who purge the chairs inherit the emptiness. Of the three, Baekje sits closest to the eastern islands in manners: polished courts, sea-lane taste, a habit of teaching neighbours how a capital should look. The crown binds the heavenly deer \u2014 lose the crown, and the deer\u2019s door closes.",
    arc: "Founded by Onjo, a son of Jumong who came south when the throne of Goryeo went to another brother \u2014 settling where a heavenly deer showed the door between earth and the yellow sky, under stars the court would later read for loyalty. Baekje is the kingdom of the sea lanes: it gives the East writing, Buddhism and temple architects, and fights Silla for three centuries over the Han valley. Its court is owned by eight great clans, and its last king breaks the clans only to find he has broken the kingdom. It falls in 660; the Baekje Restoration Army (BRA) dies at the White River in 663.",
    events: [
      { year: -18, label: "Founded at Wiryeseong by Onjo." },
      { year: 371, label: "Geunchogo kills the king of Goguryeo at Pyongyang." },
      { year: 538, label: "Capital moves to Sabi." },
      { year: 660, label: "Sabi falls to the Silla\u2013Tang alliance." },
      { year: 663, label: "The BRA fails at the White River." }
    ],
    sobriquets: ["Land of the Heavenly Deer", "Land of the Lord Buddha"],
    aliases: [
      "Baekje",
      "Land of the Heavenly Deer",
      "Land of the Lord Buddha",
      "Heavenly Deer"
    ]
  },
  {
    id: "nation-goguryeo",
    name: "Goguryeo",
    korean: "\uACE0\uAD6C\uB824",
    hanja: "\u9AD8\u53E5\u9E97",
    entity: "nation",
    kingdom: "goguryeo",
    born: -37,
    died: 668,
    title: "Kingdom of Jumong",
    photo: "/nations/goguryeo.jpg",
    photoCredit: "The Gwanggaeto Stele at Ji\u2019an \u2014 erected 414 (Wikimedia Commons)",
    tagline: "People of Jumong \u2014 five commanderies that were five animal tribes, and the wall that stalled two empires.",
    ideology: "Martial ethnostate",
    ideologyNote: "Frontier power politics; \uACA8\uB808 spoken as if it were a constitution.",
    nature: "High Summit of regional commands \u2014 the Five Tribes wearing later titles. Kings who pay tribute for another decade of quiet. After 642, a Supreme Commander and a Grand Herald speak for the \uACA8\uB808 over a nephew-king \u2014 force in place of committee. The common tongue of the age is Goryeo; Yeon alone says Goguryeo, as if the longer name were a wall. Cold marches, sealed capital, will recited until it becomes weather \u2014 and the crown that binds the three-legged crow. Yeon hall versus Go hall is the private war under the public one.",
    arc: "Founded by Jumong the archer under the three-legged crow of the sun \u2014 a red kingdom of will that would rather break than bend. Jolbon\u2019s five animal roofs become the five \uBD80; the crow tribe is the eastern commandery the Yeons keep. Grown under Gwanggaeto into the great power of Northeast Asia, Goryeo spends its final century as the wall between the peninsula and two western empires: it destroys the Sui invasions, turns back Taizong at Ansi, and breaks army after army. What no emperor could do, succession did: after Yeon Gesomun dies his sons turn on each other, and in 668 his eldest guides the Tang army to Pyongyang. A shard of the crown walks north into the millet \u2014 and the sentence does not stop.",
    events: [
      { year: -37, label: "Founded at Jolbon by Jumong \u2014 five tribes become five commanderies." },
      { year: 413, label: "Gwanggaeto dies; his stele lists his conquests." },
      { year: 612, label: "Destroys the Sui at the Salsu." },
      { year: 645, label: "Turns back Taizong at Ansi." },
      { year: 668, label: "Pyongyang falls to the Silla\u2013Tang alliance." },
      { year: 698, label: "Balhae rises \u2014 the sentence kept." }
    ],
    sobriquets: ["Kingdom of Jumong", "People of Jumong"],
    aliases: [
      "Goguryeo",
      "Goryeo",
      "\uACE0\uB824",
      "Kingdom of Jumong",
      "People of Jumong"
    ]
  },
  {
    id: "nation-buyeo",
    name: "Buyeo",
    korean: "\uBD80\uC5EC",
    hanja: "\u6276\u9918",
    entity: "nation",
    kingdom: "buyeo",
    born: -86,
    died: 22,
    bornApprox: true,
    title: "The northern river-capital",
    photo: "/pl_buyeo_yard.png",
    photoCredit: "Northern Buyeo timber yard \u2014 chronicle place still (pl_buyeo_yard)",
    tagline: "Geumwa\u2019s timber yard \u2014 the roof that sheltered Yuhwa\u2019s egg and hunted the boy it raised.",
    ideology: "Foster-court conservatism",
    ideologyNote: "A ledger-kingdom: eggs, heirs, and whether heaven files correctly.",
    nature: "Burgundy court silk, packed-earth square, iron-boss doors on a river. Geumwa hosts what heaven abandons; Daeso cannot bear being outshot; Galsa looks at the dirt; Jashin files the omen. Not Samhan. The north the chronicle flees.",
    arc: "Northern Buyeo takes in Habek\u2019s cast-out daughter and the egg that hatches Jumong. The yard teaches brothers to share a mark-stake until the foundling outgrows the house. Jumong slips the night nets; Daeso\u2019s hunt fails at the river of fish and turtles. Lady Ye raises Yuri here on half a sword. Daeso dies in 22 when Goryeo comes back for the roof that would not keep him.",
    events: [
      { label: "Geumwa shelters Yuhwa; the egg hatches in the Buyeo hall." },
      { year: -37, label: "Jumong flees south; the yard does not catch him." },
      { year: -19, label: "Yuri leaves with a broken sword to take Jolbon\u2019s throne." },
      { year: 22, label: "Daeso falls; Eastern Buyeo\u2019s sentence ends." }
    ],
    sobriquets: ["Northern Buyeo", "Dongbuyeo", "the river-capital"],
    aliases: [
      "Northern Buyeo",
      "Dongbuyeo",
      "Eastern Buyeo",
      "the Buyeo yard",
      "Geumwa\u2019s Buyeo"
    ]
  },
  {
    id: "nation-jolbon",
    name: "Jolbon",
    korean: "\uC878\uBCF8",
    hanja: "\u5352\u672C",
    entity: "nation",
    kingdom: "jolbon",
    died: -37,
    title: "Five roofs under pine",
    photo: "/pl_jumong_cave.png",
    photoCredit: "Jumong Cavern at Jolbon \u2014 chronicle place still (pl_jumong_cave)",
    tagline: "Tabal\u2019s packed-earth country \u2014 crow largest among five animal tribes, until they vote a king.",
    ideology: "Tribal confederacy",
    ideologyNote: "Five ditches, one yard they hate to share \u2014 then one vote they cannot take back.",
    nature: "Pine, millet, salt and iron. Yeon Tabal names the place Jolbon when an exile says Buyeo. Five animal roofs feud until a wet stranger splits an arrow. Song Yang\u2019s pine country sits next door and is not the vote \u2014 it is the roof Jumong takes after, to get his friends back.",
    arc: "Before Goryeo there is Jolbon: crow, horse, cow, pig, dog. They vote Jumong king in -37 and the name becomes a founding. The five tribes do not vanish; they become the five commanderies. The crow roof stays Yeon \u2014 eastern \uB300\uAC00, then Gesomun\u2019s massacre. The cavern (\uAD6D\uB3D9\uB300\uD608) is where the holy king prays; later commanders still come to ask permission.",
    events: [
      { label: "Five animal roofs feud in the ditches; crow is largest." },
      { year: -37, label: "First summit; they vote Jumong king of Goryeo." },
      { year: -37, label: "Jumong annexes Song Yang\u2019s pine roof; Jolbon is a kingdom\u2019s first capital." }
    ],
    sobriquets: ["the pine country", "five roofs"],
    aliases: [
      "Jolbon",
      "\uC878\uBCF8",
      "\u5352\u672C",
      "Jolbon Buyeo"
    ]
  },
  {
    id: "nation-tang",
    name: "Tang",
    korean: "\uB2F9",
    hanja: "\u5510",
    entity: "nation",
    kingdom: "tang",
    born: 618,
    died: 907,
    title: "The empire of the west",
    photo: "/nations/tang.jpg",
    photoCredit: "Giant Wild Goose Pagoda, Chang\u2019an \u2014 built 652 for Xuanzang\u2019s scriptures (Wikimedia Commons)",
    tagline: "The superpower next door \u2014 cosmopolitan, insatiable, and very patient.",
    ideology: "Imperial civilizational universalism",
    ideologyNote: "The West as self-appointed classroom for every smaller calendar.",
    nature: "An empire that renames ministries around a taboo personal name and ships titled beasts instead of introductions. Investiture, hostages, and protectorates are how it turns allies into furniture.",
    arc: "The dynasty that made Chang\u2019an the largest city on earth. Under Taizong it subdues the steppe and calls its emperor Khan of Heaven; the one campaign it cannot finish is Goguryeo. Under Gaozong it succeeds at last \u2014 and then discovers its ally Silla will not hand over the peninsula it came for.",
    events: [
      { year: 618, label: "Founded from the wreck of the Sui." },
      { year: 630, label: "Taizong breaks the Eastern Turks." },
      { year: 668, label: "Takes Pyongyang \u2014 and claims the peninsula." },
      { year: 676, label: "Pushed back out of Samhan by Silla." }
    ],
    aliases: ["Tang", "the Tang"]
  },
  {
    id: "nation-joseon",
    name: "Joseon",
    korean: "\uC870\uC120",
    hanja: "\u671D\u9BAE",
    entity: "nation",
    kingdom: "joseon",
    born: -2333,
    died: -108,
    bornApprox: true,
    title: "The first name of the mandate",
    tagline: "Old Joseon \u2014 Asadal\u2019s court, and the word later ages keep borrowing.",
    nature: "Heaven\u2019s mandate made into a capital: sandalwood, garlic, mugwort, and a king who stays when gods leave. The name outlives the walls \u2014 Goryeo and later crowns still answer to it in dream and stele.",
    arc: "Founded in the mythic age by Dangun, grandson of Heaven. Old Joseon holds the northern plains until betrayal opens Wanggeom to the Han; the Four Commanderies follow. Centuries later Wang Geon raises Goryeo under Goguryeo\u2019s shadow \u2014 and the chronicle still hears Joseon in the name of what endures.",
    events: [
      { year: -2333, label: "Dangun founds Asadal \u2014 so the legend dates it." },
      { year: -108, label: "Wanggeom falls; Old Joseon ends." },
      { year: 918, label: "Wang Geon founds Goryeo \u2014 the name\u2019s long echo." }
    ],
    aliases: ["Joseon", "Old Joseon", "Gojoseon", "\uC870\uC120"]
  },
  {
    id: "nation-gaya",
    name: "Gaya",
    korean: "\uAC00\uC57C",
    hanja: "\u52A0\u8036",
    entity: "nation",
    kingdom: "gaya",
    born: 42,
    died: 562,
    bornApprox: true,
    title: "The iron confederacy",
    tagline: "Not one crown \u2014 a league of iron harbours and hill courts, until Silla took the map.",
    ideology: "Confederate iron polity",
    ideologyNote: "League of courts \u2014 iron and ships first, unanimity never. Six is the song; more is the ground.",
    nature: "Gaya is a confederacy, not a single throne. The egg-song names six \u2014 Golden, Great, Lesser, Holy, Bright, Iron \u2014 but the older world grew from Byeonhan\u2019s many small states along the Nakdong, and the mounds remember more polities than any tidy tablet. Early centuries answer from Garak / Golden Gaya at Gimhae; after the northern war around 400, the inland court at Great Gaya / Gara (Goryeong) gathers the late league. Iron, stoneware, and ships to Wa and Baekje are the shared grammar. \u201C\u25CB\u25CB\uAC00\uC57C\u201D is often a later label; contemporary mouths said Garak, Kara, Anra, Goja, Banpa. Six eggs are the chronicle\u2019s mnemonic. The ground is a denser map.",
    arc: "Tradition: in 42 six eggs hatch after Ibiga and the Lady of the Right View; Suro takes the shore, Ijinasi the larger hill; Queen Heo sails into Golden Gaya in 48. History\u2019s harder outline: Byeonhan chiefdoms harden into Gaya city-states; Geumgwan leads the early iron age; Daegaya leads the late one; Ara / Anra talks when force fails. Geumgwan yields in 532 so its blood may keep a sword \u2014 Kim Yushin is that bargain\u2019s grandson. Ara and the southern shore fold in the 550s; Great Gaya falls in 562 to Jinheung and Sadaham. The purple flag remains; the six places remain on the map; the seventh and tenth names haunt the footnotes.",
    events: [
      { year: 42, label: "Legend: six eggs; the confederacy\u2019s founding song." },
      { year: 48, label: "Legend: Queen Heo arrives at Golden Gaya / Garak." },
      { year: 300, label: "From Byeonhan into early Gaya \u2014 Geumgwan as coastal centre." },
      { year: 400, label: "Goguryeo\u2019s southern war; the early centre wanes." },
      { year: 500, label: "Late Gaya: Great Gaya / Gara gathers the inland league." },
      { year: 532, label: "Golden Gaya / Geumgwan surrenders to Silla." },
      { year: 559, label: "Ara / Anra and the southern courts fold under Silla." },
      { year: 562, label: "Great Gaya falls; the confederacy ends." }
    ],
    sobriquets: ["the Iron Confederacy", "Six Eggs", "Kara", "Imna"],
    aliases: [
      "Gaya",
      "\uAC00\uC57C",
      "\u52A0\u8036",
      "\u4F3D\u503B",
      "Kaya",
      "the Gaya confederacy",
      "Gaya confederacy",
      "the Iron Confederacy"
    ]
  },
  {
    id: "nation-yamato",
    name: "Yamato",
    korean: "\uC57C\uB9C8\uD1A0",
    hanja: "\u5927\u548C",
    entity: "nation",
    kingdom: "yamato",
    title: "The eastern court across the strait",
    tagline: "Rising sun, cherry weather, and sea lanes that learn from the west.",
    nature: "An island court that watches Samhan the way Samhan watches Tang \u2014 close enough to copy, far enough to choose. Hosts princes, sends swords, and measures loyalty in ships.",
    arc: "Wa / Yamato sits east of Baekje\u2019s teaching and Silla\u2019s ambition. Emperors and princes in this chronicle watch continental fires and decide how much of the blaze to invite home.",
    aliases: ["Yamato", "Wa", "the East", "\uC57C\uB9C8\uD1A0"]
  },
  {
    id: "nation-tamla",
    name: "Tamla",
    korean: "\uD0D0\uB77C",
    hanja: "\u803D\u7F85",
    entity: "nation",
    kingdom: "tamla",
    title: "The orange island",
    tagline: "Island of three princes, five grains, and the myths that name the Three Realms.",
    nature: "An island polity off the southern sea \u2014 oranges, divers, and shrine roads that remember Sulmun before they remember any continental king. Three divine princes rise from Samseonghyeol; the living world and the dead are told here as courts, not metaphors \u2014 under Hwanin\u2019s heaven.",
    arc: "Tamla sits outside the three kingdoms\u2019 calendar until the war washes men onto its shore. Then the island tells first things last: Heaven\u2013Earth King\u2019s retirement under the Creator, Big Star and Little Star, Hallakgungi\u2019s western flowers, Kangrim\u2019s ledger \u2014 so a Baekje general stranded among \uD574\uB140 will stop waiting for the world to behave.",
    events: [
      { label: "Legend: three princes emerge from Samseonghyeol and divide the island." },
      { label: "Sulmun piles the sea into Halla; the apron-holes become hills." },
      { label: "Jacheongbi brings the five grains down from the Western Flower Field." },
      { label: "Gyebek hears \uC0BC\uACC4 named on the island after the mainland has already burned." }
    ],
    sobriquets: ["the orange island", "Island of the Three Princes"],
    aliases: ["Tamla", "\uD0D0\uB77C", "\u803D\u7F85", "Tamna", "the orange island", "Jeju"]
  }
];
var POSTERS_BY_ID = {
  yushin: "/temp/yushin_sword_vertical.png",
  gesomun: "/temp/poster_gesomun.jpg",
  gyebek: "/temp/poster_gyebek.jpg",
  taizong: "/temp/poster_taizong.jpg",
  haemosu: "/temp/jumong-poster_haemosu.jpg",
  ibiga: "/temp/poster_ibiga.jpg",
  chunchu: "/temp/poster_muyeol.jpg",
  daebyeol: "/temp/poster_daebyeol.jpg",
  sobyeol: "/temp/poster_sobyeol.jpg",
  kangrim: "/temp/poster_kangrim.jpg",
  haewonmek: "/temp/poster_haewonmek.jpg",
  hwanin: "/temp/poster_hwanin.jpg",
  hwanung: "/temp/poster_hwanung.jpg",
  dangun: "/temp/poster_dangun.jpg",
  heavenearthking: "/temp/poster_heavenearthking.jpg",
  sara: "/temp/poster_hallakgungi.jpg",
  yuhwa: "/temp/jumong-poster_yuhwa.jpg",
  ungnyeo: "/temp/poster_ungnyeo.jpg",
  bidam: "/temp/poster_bidam.jpg",
  munmu: "/temp/poster_munmu.jpg",
  xuerengui: "/temp/poster_xuerengui.jpg",
  takutsu: "/temp/poster_takutsu.jpg",
  euija: "/temp/poster_euija.jpg",
  yangmanchun: "/temp/poster_yangmanchun.jpg",
  namseng: "/temp/poster_namseng.jpg",
  namgun: "/temp/poster_namgun.jpg",
  bojang: "/temp/poster_bojang.jpg",
  jumong: "/temp/poster_jumong.jpg",
  daeso: "/temp/poster_daeso.jpg"
};
var CHARACTER_COLORS = {
  hwanin: { color: "#F4F1E8" },
  heavenearthking: { color: "#C30000", colorSecondary: "#3E79E4" },
  daebyeol: { color: "#3B6FBF" },
  sobyeol: { color: "#C94040" },
  chongmyeong: { color: "#c9b18f" },
  sumyeongjangja: { color: "#8a7a3a" },
  sara: { color: "#8FBF8A" },
  heaven: { color: "#d4b86a" },
  living_world: { color: "#C94040" },
  western_flower_field: { color: "#8FBF8A" },
  chunchu: { color: "#D8258C" },
  yushin: { color: "#2A5FB8" },
  bidam: { color: "#141C2E" },
  sukwon: { color: "#3d4654" },
  muryuk: { color: "#8B5CF6" },
  seohyeon: { color: "#3E8EF0" },
  munmu: { color: "#C41E3A" },
  gyebek: { color: "#d9b13a" },
  euija: { color: "#e08a2e" },
  gesomun: { color: "#d0362f" },
  pumsuk: { color: "#7EB8F0" },
  gotaso: { color: "#F0A3C0" },
  munhee: { color: "#E07FA8" },
  gumilwife: { color: "#8AAFA0" }
};
var ORGS_BY_ID = {
  // Silla — Hwarang / Council / Secretariat / Founding / Royal house
  chunchu: ["hwarang", "harmonycouncil", "royalsecretariat", "bonerank", "sillaroyal"],
  yushin: ["hwarang", "harmonycouncil"],
  bidam: ["hwarang", "harmonycouncil"],
  sukwon: ["bonerank"],
  munmu: ["hwarang", "royalsecretariat", "bonerank", "sillaroyal"],
  pumsuk: ["hwarang", "bonerank"],
  jukji: ["hwarang", "royalsecretariat"],
  alchun: ["hwarang", "harmonycouncil"],
  supum: ["harmonycouncil"],
  murim: ["harmonycouncil"],
  imjong: ["harmonycouncil"],
  suljong: ["harmonycouncil"],
  yumjang: ["harmonycouncil"],
  pumil: ["harmonycouncil"],
  yumjong: ["harmonycouncil"],
  euljae: ["harmonycouncil"],
  sunduk: ["bonerank", "sillaroyal"],
  jinduk: ["bonerank", "sillaroyal"],
  munhee: ["bonerank", "sillaroyal"],
  gotaso: ["bonerank", "sillaroyal"],
  seohyeon: ["bonerank"],
  hyukgose: ["foundingsix", "sillaroyal"],
  alyoung: ["sillaroyal"],
  alpyung: ["foundingsix"],
  sobuldori: ["foundingsix"],
  jibekho: ["foundingsix"],
  gurema: ["foundingsix"],
  jita: ["foundingsix"],
  hojin: ["foundingsix"],
  jinpyung: ["sillaroyal"],
  jinheung: ["sillaroyal"],
  jinji: ["sillaroyal"],
  yongsu: ["sillaroyal", "bonerank"],
  chunmyung: ["sillaroyal"],
  inmun: ["sillaroyal"],
  gwanchang: ["hwarang"],
  bangul: ["hwarang"],
  sadaham: ["hwarang"],
  mugwan: ["hwarang"],
  // Baekje — assembly / eight-clan league / restoration
  euija: ["ministersassembly", "eightclans"],
  eldersatek: ["eightclans", "ministersassembly"],
  elderyunbi: ["eightclans", "ministersassembly"],
  ministersatek: ["eightclans", "ministersassembly"],
  queensatek: ["eightclans"],
  yung: ["eightclans"],
  tae: ["eightclans"],
  hyo: ["eightclans"],
  yun: ["eightclans"],
  pung: ["eightclans", "restorationarmy"],
  boksin: ["restorationarmy"],
  dochim: ["restorationarmy"],
  sangji: ["restorationarmy"],
  sateksangya: ["restorationarmy"],
  ladysatek: ["eightclans", "ministersassembly"],
  ministeryunbi: ["eightclans", "ministersassembly"],
  // Goguryeo — High Summit (Yeon is a clan, not an org)
  gesomun: ["highsummit"],
  namseng: ["highsummit"],
  namgun: ["highsummit"],
  namsan: ["highsummit"],
  yeongnyu: ["highsummit"],
  bojang: ["highsummit"],
  yangmanchun: ["highsummit"],
  dosuryu: ["highsummit"],
  northcmd: ["highsummit"],
  southcmd: ["highsummit"],
  westcmd: ["highsummit"],
  // Jolbon — five animal tribes (predecessor of the five commanderies)
  yeontabal: ["fivetribes"],
  cowchief: ["fivetribes"],
  pigchief: ["fivetribes"],
  dogchief: ["fivetribes"],
  horsechief: ["fivetribes"],
  jumong: ["fivetribes"],
  // Tang court + eastern expedition (dragon/beast rosters moved to GROUPS_BY_ID)
  taizong: ["tangcourt"],
  gaozong: ["tangcourt", "tangexpedition"],
  wuzetian: ["tangcourt"],
  xuerengui: ["tangcourt", "tangexpedition"],
  weizheng: ["tangcourt"],
  ashinasheer: ["tangcourt"],
  qibiheli: ["tangcourt"],
  zhangsunwuji: ["tangcourt"],
  xuejitou: ["tangcourt"],
  sudingfang: ["tangcourt", "tangexpedition"],
  lishiji: ["tangcourt", "tangexpedition"],
  liurengui: ["tangcourt", "tangexpedition"],
  pangxiaotai: ["tangexpedition"],
  // Three Realms cosmology (replaces Heaven’s Court org)
  hwanin: ["four_divisions"],
  hwanung: ["four_divisions"],
  sobyeol: ["four_divisions"],
  daebyeol: ["four_divisions"],
  sara: ["four_divisions"],
  ibiga: ["four_divisions"],
  haemosu: ["four_divisions"],
  yuhwa: ["four_divisions"],
  hwahye: ["four_divisions"],
  wihye: ["four_divisions"],
  samsin: ["four_divisions"],
  yumla: ["four_divisions"],
  kangrim: ["four_divisions"],
  haewonmek: ["four_divisions"]
  /* Heaven–Earth King retired from mortal charge; not seated under Hwanin’s court. */
};
var GROUPS_BY_ID = {
  // Silla
  narim: ["caverngoddesses"],
  golhwa: ["caverngoddesses"],
  hyulle: ["caverngoddesses"],
  yushin: ["eternalhwarang", "gayakims"],
  alchun: ["eternalhwarang"],
  bidam: ["eternalhwarang"],
  muryuk: ["gayakims", "defectors"],
  seohyeon: ["gayakims"],
  sunduk: ["sacredbones"],
  jinduk: ["sacredbones"],
  chunmyung: ["sacredbones"],
  // Divine rosters
  sara: ["realmgods"],
  daebyeol: ["realmgods"],
  sobyeol: ["realmgods"],
  heaven: ["fourrealms"],
  living_world: ["fourrealms"],
  underworld: ["fourrealms"],
  western_flower_field: ["fourrealms"],
  haemosu: ["lifegods"],
  ibiga: ["lifegods"],
  samsin: ["lifegods"],
  kangrim: ["grimreapers"],
  haewonmek: ["grimreapers"],
  // Baekje — Euija’s five princes (birth order; wiki grid uses GROUP_ROSTERS)
  yung: ["fiveprinces", "traitors"],
  tae: ["fiveprinces"],
  hyo: ["fiveprinces"],
  yun: ["fiveprinces"],
  pung: ["fiveprinces", "brafounders"],
  boksin: ["brafounders"],
  dochim: ["brafounders"],
  sangji: ["brafounders", "traitors"],
  sateksangya: ["brafounders", "traitors"],
  // The Traitors — worked for the other side
  sam: ["traitors"],
  noin: ["traitors"],
  choi: ["traitors"],
  janghang: ["traitors"],
  gumil: ["traitors"],
  mochuk: ["traitors"],
  daeto: ["traitors"],
  kimpunghun: ["traitors"],
  imja: ["traitors"],
  chunbok: ["traitors"],
  yesikjin: ["traitors"],
  namseng: ["traitors"],
  jungto: ["traitors"],
  shinsung: ["traitors"],
  yomyo: ["traitors"],
  // The Defectors — crossed over and stayed
  inmun: ["defectors"],
  munsa: ["defectors"],
  goyeonsu: ["defectors"],
  gohyejin: ["defectors"],
  namsan: ["defectors"],
  // Goguryeo — four directional 대가 and the High Commander
  gesomun: ["fivecommanders"],
  gusesa: ["fivecommanders"],
  northcmd: ["fivecommanders"],
  southcmd: ["fivecommanders"],
  westcmd: ["fivecommanders"],
  // Founders and founding mothers
  hyukgose: ["threefounders"],
  alyoung: ["greatwomen"],
  alpyung: ["founders"],
  sobuldori: ["founders"],
  jibekho: ["founders"],
  gurema: ["founders"],
  jita: ["founders"],
  hojin: ["founders"],
  jumong: ["threefounders"],
  onjo: ["threefounders"],
  sosuno: ["greatwomen"],
  heohwangok: ["greatwomen"],
  // Tang dragon / beast rosters (moved from ORGS_BY_ID with the entity change)
  taizong: ["fourdragons"],
  gaozong: ["fourbeasts"],
  xuerengui: ["fourbeasts"],
  ashinasheer: ["fourdragons"],
  qibiheli: ["fourdragons"],
  zhangsunwuji: ["fourdragons"],
  sudingfang: ["fourbeasts"],
  lishiji: ["fourdragons", "fourbeasts"],
  liurengui: ["fourbeasts"],
  pangxiaotai: ["fourbeasts"]
};
var GROUP_ROSTERS = {
  // Birth order: demoted eldest → self-crowned 2nd → chosen 3rd → quiet 4th → youngest
  fiveprinces: ["yung", "tae", "hyo", "yun", "pung"],
  brafounders: ["boksin", "dochim", "sangji", "sateksangya", "pung"],
  // Heaven above, then the three courts of 삼계
  fourrealms: ["heaven", "living_world", "underworld", "western_flower_field"],
  fourdragons: ["qibiheli", "ashinasheer", "lishiji", "zhangsunwuji"],
  fourbeasts: ["pangxiaotai", "sudingfang", "lishiji", "liurengui", "xuerengui"],
  // East, West, South, North, then the 막리지
  fivecommanders: ["gesomun", "westcmd", "southcmd", "northcmd", "gusesa"],
  // Nation bands follow first appearance: Joseon, Silla, Baekje, Goguryeo
  traitors: [
    "sam",
    "noin",
    "choi",
    "janghang",
    "gumil",
    "mochuk",
    "daeto",
    "kimpunghun",
    "imja",
    "chunbok",
    "yesikjin",
    "sangji",
    "sateksangya",
    "yung",
    "namseng",
    "jungto",
    "shinsung",
    "yomyo"
  ],
  defectors: ["muryuk", "inmun", "munsa", "goyeonsu", "gohyejin", "namsan"]
};
var COLOR = {
  // leads
  chunchu: "#D8258C",
  gesomun: "#d0362f",
  yeonwife: "#c4787a",
  euija: "#e08a2e",
  // silla
  yushin: "#2A5FB8",
  sunduk: "#E8552B",
  jinduk: "#9d7bd0",
  munhee: "#E07FA8",
  munmu: "#C41E3A",
  jayi: "#e8a0bf",
  seonpum: "#7c6bb5",
  daeya_a: "#a16207",
  daeya_b: "#92744a",
  bidam: "#141C2E",
  sukwon: "#3d4654",
  gotaso: "#F0A3C0",
  pumsuk: "#7EB8F0",
  inmun: "#6fb0d8",
  alchun: "#8fb3e0",
  daedeung_stern: "#6b5b4a",
  daedeung_old: "#7a6a58",
  daedeung_fear: "#5c6b7a",
  jinheung: "#2f6fd4",
  jinji: "#3d5fa8",
  yongsu: "#6a7cb0",
  // baekje
  gyebek: "#d9b13a",
  kingmu: "#b8862c",
  seongchung: "#c9a24d",
  yung: "#d4b45a",
  tae: "#cbb06a",
  hyo: "#c9a86a",
  yun: "#b8a86a",
  ungo: "#c9a0a8",
  pung: "#e6c76a",
  boksin: "#a8781f",
  sateksondung: "#a8842f",
  yunbihana: "#6f8f5c",
  sooyoung: "#b8787a",
  // goguryeo
  yeongnyu: "#a83b34",
  bojang: "#8f4a44",
  yangmanchun: "#e05a3c",
  namseng: "#c25a4e",
  namgun: "#9e3b32",
  namsan: "#d4776a",
  munduk: "#e0503f",
  // tang
  taizong: "#c97a2e",
  gaozong: "#b8935a",
  wuzetian: "#e879a6",
  // gaya
  muryuk: "#8B5CF6",
  gumil: "#6b7f9e",
  mochuk: "#7d8a99",
  daeto: "#8a8f9e",
  kimpunghun: "#7a8fb0",
  // supporting cast
  jukjuk: "#3f9b6e",
  yunchung: "#c9932a",
  gwanchang: "#79b6f2",
  bangul: "#5e9dd8",
  sadaham: "#6fa8ff",
  mugwan: "#7aa0c8",
  chunbok: "#d4a94e",
  heungsu: "#b98f33",
  dochim: "#a06a28",
  sangji: "#8a6b1f",
  sateksangya: "#b8933f",
  ladysatek: "#d9b45e",
  ministeryunbi: "#7f9b6b",
  gungye: "#4a7c6f",
  galsa: "#6b8f4a",
  oi: "#7a6b5a",
  mari: "#5c6b6e",
  hyupbo: "#4a5548",
  songyang: "#c4a35a",
  buyeojashin: "#9b2d2d",
  weizheng: "#9a7b4f",
  xuerengui: "#e8e3d5",
  xueliu: "#c4a484",
  ashinasheer: "#c45a38",
  qibiheli: "#d8d4c8",
  zhangsunwuji: "#2f2f36",
  xuejitou: "#a8743a",
  sudingfang: "#d95f4b",
  lishiji: "#4b78c9",
  liurengui: "#3d4a48",
  pangxiaotai: "#c9c9c9",
  saimei: "#f090b0",
  tenji: "#e06a95",
  kuromaro: "#c77ba0",
  takutsu: "#b05575",
  abe: "#c8463c",
  yesikjin: "#a3813d",
  yumjong: "#8a68c9",
  supum: "#7f9fd0",
  pumil: "#6a8ab8",
  murim: "#8a7a6a",
  imjong: "#7a8a7a",
  suljong: "#8a6a7a",
  yumjang: "#7a7a9a",
  gusesa: "#b2554a",
  yeontaejo: "#8f3a2e",
  northcmd: "#6a8f6e",
  southcmd: "#c46b3a",
  westcmd: "#7a6b8a",
  dosuryu: "#c98578",
  goguard_a: "#b07068",
  goguard_b: "#9a5c55",
  seondohae: "#5f7fa6",
  cheongwan: "#c9a0b4",
  narim: "#3d9e52",
  hyulle: "#2eb8c4",
  golhwa: "#e86820",
  steam_cavern: "#2eb8c4",
  jungto: "#ad6157",
  shinsung: "#8f7b70",
  yuridora: "#ff9a3d",
  jinpyung: "#5a86d6",
  chunmyung: "#d8a0e8",
  sunhwa: "#eeb8d2",
  kingsung: "#e5b83a",
  dodo: "#7f96b5",
  jumong: "#e8563f",
  onjo: "#f0c04a",
  biryu: "#d8b276",
  hyukgose: "#6f9fe8",
  alyoung: "#a8c8f0",
  alpyung: "#7a9e6b",
  sobuldori: "#5a8fc4",
  jibekho: "#8b7aa8",
  gurema: "#4a5568",
  jita: "#c9a86a",
  hojin: "#9aabb8",
  foundingsix: "#6f9fe0",
  sillaroyal: "#5a86d6",
  "clan-surabol-lee": "#7a9e6b",
  "clan-surabol-choi": "#5a8fc4",
  "clan-surabol-jeong": "#8b7aa8",
  "clan-surabol-son": "#4a5568",
  "clan-surabol-bae": "#c9a86a",
  "clan-surabol-seol": "#9aabb8",
  dangun: "#b8956a",
  ugeo: "#918878",
  kyunhwon: "#caa53d",
  wanggun: "#d16a5a",
  gyeonggeunchogo: "#eec052",
  gwanggaeto: "#e0442e",
  dongchun: "#8b4040",
  jomei: "#f2a0bb",
  kotoku: "#e89ab0",
  euljae: "#7f9fd0",
  ladyye: "#d98fa8",
  yuri: "#e07a5f",
  hwarang: "#6f9fe0",
  gyuku: "#8a9e6b",
  gumilwife: "#8AAFA0",
  queensatek: "#d9b45e",
  eldersatek: "#b8933f",
  elderyunbi: "#7f9b6b",
  ministersatek: "#c2a24a",
  sosuno: "#e8a04a",
  yuhwa: "#8fc4e0",
  hwahye: "#8a62c4",
  wihye: "#4fad72",
  geumwa: "#a89a72",
  daeso: "#9b8f6a",
  yomyo: "#a3564a",
  bohee: "#c98fc0",
  haenyeo: "#6fa8a0",
  haemosu: "#f0b429",
  habek: "#2f8f7a",
  yeontabal: "#a97c4a",
  cowchief: "#c45a2a",
  pigchief: "#6b4a32",
  dogchief: "#c8d0d4",
  horsechief: "#2c2c30",
  jomigon: "#8f9c8f",
  imja: "#b08d5a",
  courtmaid: "#c9a0a8",
  shaman: "#9f1239",
  suro: "#e0a33c",
  ijinasi: "#c084fc",
  heohwangok: "#d98fa8",
  ibiga: "#1e4d9c",
  samsin: "#e8b4c8",
  jeonggyeon: "#c084fc",
  hwanin: "#F4F1E8",
  hwanung: "#d4b86a",
  ungnyeo: "#c9b18f",
  sulmun: "#7f9c8b",
  jacheongbi: "#e879a6",
  mundoryeong: "#7dd3fc",
  gameunjang: "#e0a33c",
  baekjuto: "#c084fc",
  socheonguk: "#a16207",
  heavenearthking: "#C30000",
  fourdragons: "#2563eb",
  fourbeasts: "#b45309",
  "clan-yeon": "#a3232a",
  restorationarmy: "#e6a817",
  tangcourt: "#b45309",
  daebyeol: "#3B6FBF",
  sobyeol: "#C94040",
  chongmyeong: "#c9b18f",
  sumyeongjangja: "#8a7a3a",
  yumla: "#7c3aed",
  kangrim: "#4a4a58",
  haewonmek: "#6b5b6e",
  sara: "#8FBF8A",
  creator: "#f5f0e6",
  go_tamla: "#e8a060",
  yang_tamla: "#f0c078",
  bu_tamla: "#d4894a",
  sanbangdeok: "#8fb3a8",
  four_divisions: "#d4b86a",
  fourrealms: "#d4b86a",
  heaven: "#d4b86a",
  living_world: "#C94040",
  western_flower_field: "#8FBF8A",
  seocheon: "#d4a0c8",
  herald: "#8d8d95",
  seohyeon: "#3E8EF0",
  manmyung: "#c98bb9",
  sukhuljong: "#6b5b4b",
  talhae: "#5a7fa8",
  hogong: "#a8894a",
  alji: "#d4b86a",
  daejoyoung: "#c45a4a",
  jukji: "#6a9e7a",
  ongunhae: "#8a6240",
  "rel-chunchu-ongunhae": "#8a6240",
  haesang: "#c4a35a",
  // relationships
  "rel-gotaso-pumsuk": "#f472b6",
  "rel-chunchu-munhee": "#e07fa8",
  "rel-munmu-jayi": "#e8a0bf",
  "rel-yushin-sunduk": "#4a8fe0",
  "rel-pumsuk-gumilwife": "#c98fb0",
  "rel-euija-maids": "#c9a0a8",
  "rel-haemosu-yuhwa": "#7fc4e8",
  "rel-jumong-sosuno": "#e8563f",
  "rel-suro-heo": "#e0a33c",
  "rel-ibiga-jeonggyeon": "#a78bfa",
  "rel-hwanung-ungnyeo": "#c9b18f",
  "rel-gesomun-gulgul": "#a3232a",
  gulgul: "#8b3a3a",
  "rel-jacheongbi-mundoryeong": "#e879a6",
  "rel-chunchu-euija": "#D8258C",
  "rel-chunchu-yushin": "#5b7fd0",
  "rel-sunduk-chunmyung": "#E8552B",
  "rel-chunchu-gotaso": "#D8258C",
  "rel-munhee-bohee": "#e07fa8",
  "rel-euija-gyebek": "#e08a2e",
  "rel-jumong-yuhwa": "#e8563f",
  "rel-onjo-sosuno": "#e8a04a",
  "rel-gesomun-chunchu": "#a3232a",
  "rel-hwanung-dangun": "#c9b18f",
  "rel-sunduk-bidam": "#9f1239",
  "rel-yushin-bidam": "#7b5cd6",
  "rel-sunduk-jinduk": "#E8552B",
  "rel-yushin-munhee": "#4a8fe0",
  "rel-chunchu-munmu": "#D8258C",
  "rel-gesomun-yeongnyu": "#a3232a",
  "rel-gesomun-bojang": "#d0362f",
  "rel-gesomun-namseng": "#c25a4e",
  "rel-namseng-namgun": "#9e3b32",
  "rel-euija-yung": "#e08a2e",
  "rel-euija-tae": "#e08a2e",
  "rel-euija-hyo": "#e08a2e",
  "rel-euija-yun": "#e08a2e",
  "rel-euija-pung": "#e08a2e",
  "rel-tae-hyo": "#c4ad6a",
  "rel-euija-queensatek": "#d9b45e",
  "rel-yung-hyo": "#c9a86a",
  "rel-tae-yun": "#b8a86a",
  "rel-yung-pung": "#e6c76a",
  "rel-satek-yunbi": "#a8781f",
  "rel-jijeok-hana": "#6f8f5c",
  "rel-jungto-sooyoung": "#b8787a",
  "rel-gesomun-jungto": "#b0524a",
  "rel-gesomun-sooyoung": "#c07a70",
  "rel-euija-ungo": "#c9a0a8",
  "rel-jumong-yuri": "#e8563f",
  "rel-haemosu-habek": "#7fc4e8",
  "rel-haemosu-haewonmek": "#9a7e4a",
  "rel-habek-yuhwa": "#8fc4e0",
  "rel-hwanin-hwanung": "#a89060",
  "rel-suro-ijinasi": "#e0a33c",
  "rel-taizong-gaozong": "#c97a2e",
  "rel-seonpum-jayi": "#e8a0bf",
  "rel-gesomun-yangmanchun": "#e05a3c",
  "rel-yushin-munmu": "#4a8fe0",
  "rel-yumla-kangrim": "#7c3aed",
  "rel-kangrim-haewonmek": "#4a4a58",
  "rel-daebyeol-sobyeol": "#3d2a4a",
  "rel-yumla-daebyeol": "#7c3aed",
  "rel-sara-jacheongbi": "#d4a0c8",
  "rel-tamla-princes": "#e8a060",
  "rel-taizong-xuerengui": "#e8e3d5",
  "rel-xue-liu": "#c4a484"
};
var ERA_TAG_META = {
  "gen-i": { label: "Generation I", hint: "Sunduk circle \u2014 elder present chronicle" },
  "gen-ii": { label: "Generation II", hint: "Chunchu / Euija / Yeon \u2014 the war generation" },
  "gen-iii": { label: "Generation III", hint: "Bupmin / Pung / Yeon\u2019s sons \u2014 heirs of the war" },
  joseon: { label: "Joseon", hint: "Old Joseon / Dangun myth cycle" },
  founders: { label: "Founders", hint: "Egg-and-mandate founders of the kingdoms" },
  legends: { label: "Legends", hint: "Famous earlier kings and heroes" }
};
var ERA_TAG_IDS = Object.keys(ERA_TAG_META);
var TAGS_BY_ID = {
  // —— Generation I ——
  sunduk: ["gen-i"],
  jinduk: ["gen-i"],
  jinpyung: ["gen-i"],
  chunmyung: ["gen-i"],
  yongsu: ["gen-i"],
  jinji: ["legends"],
  kingmu: ["gen-i"],
  gusesa: ["gen-i"],
  yeongnyu: ["gen-i"],
  muryuk: ["gen-i"],
  seohyeon: ["gen-i"],
  euljae: ["gen-i"],
  pumil: ["gen-ii"],
  daedeung_stern: ["gen-i"],
  daedeung_old: ["gen-i"],
  daedeung_fear: ["gen-i"],
  queensatek: ["gen-i"],
  yeonwife: ["gen-i"],
  jomei: ["gen-i"],
  sunhwa: ["gen-i"],
  yeontabal: ["founders"],
  // —— Generation II ——
  chunchu: ["gen-ii"],
  ongunhae: ["gen-ii"],
  munhee: ["gen-ii"],
  bohee: ["gen-ii"],
  yushin: ["gen-ii"],
  bidam: ["gen-ii"],
  euija: ["gen-ii"],
  gesomun: ["gen-ii"],
  gotaso: ["gen-ii"],
  pumsuk: ["gen-ii"],
  gyebek: ["gen-ii"],
  taizong: ["gen-ii"],
  yangmanchun: ["gen-ii"],
  bojang: ["gen-ii"],
  alchun: ["gen-ii"],
  gumil: ["gen-ii"],
  gumilwife: ["gen-ii"],
  courtmaid: ["gen-ii"],
  shaman: ["gen-ii"],
  seongchung: ["gen-ii"],
  chunbok: ["gen-ii"],
  yesikjin: ["gen-ii"],
  gaozong: ["gen-ii"],
  xuerengui: ["gen-ii"],
  ashinasheer: ["gen-ii"],
  qibiheli: ["gen-ii"],
  zhangsunwuji: ["gen-ii"],
  xuejitou: ["gen-ii"],
  sudingfang: ["gen-ii"],
  dosuryu: ["gen-ii"],
  northcmd: ["gen-ii"],
  southcmd: ["gen-ii"],
  westcmd: ["gen-ii"],
  gulgul: ["gen-ii"],
  yunchung: ["gen-ii"],
  jukjuk: ["gen-ii"],
  daeya_a: ["gen-ii"],
  daeya_b: ["gen-ii"],
  heungsu: ["gen-ii"],
  dochim: ["gen-ii"],
  sangji: ["gen-ii"],
  sateksangya: ["gen-ii"],
  gungye: ["gen-iii"],
  yumjong: ["gen-ii"],
  supum: ["gen-ii"],
  murim: ["gen-ii"],
  imjong: ["gen-ii"],
  suljong: ["gen-ii"],
  yumjang: ["gen-ii"],
  yomyo: ["gen-ii"],
  imja: ["gen-ii"],
  jungto: ["gen-ii"],
  shinsung: ["gen-ii"],
  yuridora: ["gen-ii"],
  dodo: ["gen-ii"],
  mochuk: ["gen-ii"],
  haesang: ["gen-ii"],
  jukji: ["gen-ii"],
  seonpum: ["gen-ii"],
  saimei: ["gen-ii"],
  tenji: ["gen-ii"],
  kuromaro: ["gen-ii"],
  takutsu: ["gen-ii"],
  abe: ["gen-ii"],
  weizheng: ["gen-ii"],
  xueliu: ["gen-ii"],
  lishiji: ["gen-ii"],
  liurengui: ["gen-ii"],
  pangxiaotai: ["gen-ii"],
  herald: ["gen-ii"],
  goguard_a: ["gen-ii"],
  goguard_b: ["gen-ii"],
  seondohae: ["gen-ii"],
  cheongwan: ["gen-ii"],
  wuzetian: ["gen-ii"],
  boksin: ["gen-ii"],
  eldersatek: ["gen-ii"],
  ministersatek: ["gen-ii"],
  sateksondung: ["gen-ii"],
  elderyunbi: ["gen-ii"],
  yunbihana: ["gen-ii"],
  ladysatek: ["gen-ii"],
  ministeryunbi: ["gen-ii"],
  ungo: ["gen-ii"],
  sooyoung: ["gen-ii"],
  // —— Generation III ——
  munmu: ["gen-iii"],
  inmun: ["gen-iii"],
  jayi: ["gen-iii"],
  pung: ["gen-iii"],
  yung: ["gen-iii"],
  tae: ["gen-iii"],
  hyo: ["gen-iii"],
  yun: ["gen-iii"],
  namseng: ["gen-iii"],
  namgun: ["gen-iii"],
  namsan: ["gen-iii"],
  gwanchang: ["gen-iii"],
  bangul: ["gen-iii"],
  daejoyoung: ["gen-iii"],
  // —— Joseon cycle (mortal / earthly only — gods keep no era) ——
  ugeo: ["joseon"],
  // —— Founders (characters only; gods/nations/places omitted) ——
  hyukgose: ["founders"],
  alyoung: ["founders"],
  alpyung: ["founders"],
  sobuldori: ["founders"],
  jibekho: ["founders"],
  gurema: ["founders"],
  jita: ["founders"],
  hojin: ["founders"],
  sosuno: ["founders"],
  onjo: ["founders"],
  biryu: ["founders"],
  suro: ["founders"],
  ijinasi: ["founders"],
  heohwangok: ["founders"],
  ladyye: ["founders"],
  geumwa: ["founders"],
  daeso: ["founders"],
  galsa: ["founders"],
  oi: ["founders"],
  mari: ["founders"],
  hyupbo: ["founders"],
  songyang: ["founders"],
  cowchief: ["founders"],
  pigchief: ["founders"],
  dogchief: ["founders"],
  horsechief: ["founders"],
  buyeojashin: ["founders"],
  yuri: ["founders"],
  // —— Legends (famous earlier kings / heroes — characters only) ——
  gyeonggeunchogo: ["legends"],
  gwanggaeto: ["legends"],
  dongchun: ["legends"],
  munduk: ["legends"],
  sadaham: ["legends"],
  mugwan: ["legends"],
  kingsung: ["legends"],
  wanggun: ["legends"],
  kyunhwon: ["legends"],
  // —— Choruses without entity (still characters) ——
  haenyeo: ["gen-ii"]
};
var HWARANG_CLASS_EPOCH = 559;
var HWARANG_FIRST_YEAR = 560;
var SINO_ONES = ["", "\uC77C", "\uC774", "\uC0BC", "\uC0AC", "\uC624", "\uC721", "\uCE60", "\uD314", "\uAD6C"];
function sinoKoreanNumeral(n) {
  if (!Number.isInteger(n) || n < 1 || n > 99) return String(n);
  if (n < 10) return SINO_ONES[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  const tenPart = tens === 1 ? "\uC2ED" : `${SINO_ONES[tens]}\uC2ED`;
  return ones === 0 ? tenPart : `${tenPart}${SINO_ONES[ones]}`;
}
function hwarangClassIndex(entryYear) {
  return entryYear - HWARANG_CLASS_EPOCH;
}
function hwarangClassLabel(index) {
  return index === 1 ? "First Class" : `Class ${index}`;
}
function hwarangClassKorean(index) {
  return index === 1 ? "\uC81C\uC77C\uAE30" : `${sinoKoreanNumeral(index)}\uAE30`;
}
var HWARANG_CLASS_COLORS = {
  1: "#e4c57a",
  // First Class / 제일기 — pale gold
  51: "#c9a05c",
  // Class 51 — amber bronze (Bidam, Yushin, Alchun)
  59: "#7e9a72",
  // Class 59 — celadon (Chunchu)
  74: "#6d8aa8",
  // Class 74 — muted lapis (Pumsuk, Jukji)
  84: "#5e9a8c",
  // Class 84 — malachite (Bupmin / Munmu)
  99: "#b56e5a"
  // Class 99 — garnet (Gwanchang, Bangul)
};
var HWARANG_CLASS_FALLBACK = [
  "#8a7355",
  // bronze
  "#6d7a6a",
  // moss
  "#7a6d82",
  // dusk purple
  "#8a6a5e",
  // terracotta
  "#5e7a7a",
  // slate teal
  "#8a7a5a"
  // khaki ochre
];
function hwarangClassColorByIndex(index) {
  const pinned = HWARANG_CLASS_COLORS[index];
  if (pinned) return pinned;
  if (!Number.isFinite(index) || index < 1) return HWARANG_CLASS_FALLBACK[0];
  return HWARANG_CLASS_FALLBACK[(index - 2) % HWARANG_CLASS_FALLBACK.length];
}
function namedHwarangClass(c) {
  const index = hwarangClassIndex(c.year);
  return {
    ...c,
    initiated: c.initiated ?? c.year,
    label: hwarangClassLabel(index),
    korean: hwarangClassKorean(index),
    color: hwarangClassColorByIndex(index)
  };
}
var HWARANG_CLASSES = [
  namedHwarangClass({
    id: "first",
    year: 560,
    members: ["sadaham", "mugwan"]
  }),
  namedHwarangClass({
    id: "yushin",
    year: 610,
    members: ["bidam", "yushin", "alchun"]
  }),
  namedHwarangClass({
    id: "chunchu",
    year: 618,
    members: ["chunchu"]
  }),
  namedHwarangClass({
    id: "pumsuk",
    year: 633,
    members: ["pumsuk", "jukji"]
  }),
  namedHwarangClass({
    id: "bupmin",
    year: 643,
    members: ["munmu"]
  }),
  namedHwarangClass({
    id: "gwanchang",
    year: 658,
    members: ["gwanchang", "bangul"]
  })
];
var NON_HWARANG_ENTITIES = /* @__PURE__ */ new Set([
  "god",
  "concept",
  "organization",
  "group",
  "clan",
  "phrase",
  "nation",
  "relationship",
  "place"
]);
function isHwarangMember(p) {
  if (p.entity && NON_HWARANG_ENTITIES.has(p.entity)) return false;
  return p.orgs?.includes("hwarang") === true || p.career?.some((c) => c.org === "hwarang") === true;
}
function classFromYear(year) {
  const index = hwarangClassIndex(year);
  return {
    id: String(year),
    label: hwarangClassLabel(index),
    korean: hwarangClassKorean(index),
    color: hwarangClassColorByIndex(index)
  };
}
function hwarangEntryYear(p) {
  return p.career?.find((c) => c.org === "hwarang" && c.from != null)?.from;
}
function colorOfKlass(klass) {
  if (klass.color) return klass.color;
  const named = HWARANG_CLASSES.find((c) => c.id === klass.id);
  if (named?.color) return named.color;
  const year = named?.year ?? parseInt(klass.id, 10);
  if (Number.isFinite(year)) return hwarangClassColorByIndex(hwarangClassIndex(year));
  return HWARANG_CLASS_COLORS[1];
}
function hwarangClassOf(p) {
  if (p.hwarangClass) {
    return p.hwarangClass.color ? p.hwarangClass : { ...p.hwarangClass, color: colorOfKlass(p.hwarangClass) };
  }
  if (!isHwarangMember(p)) return void 0;
  const named = HWARANG_CLASSES.find((c) => c.members.includes(p.id));
  if (named) {
    return {
      id: named.id,
      label: named.label,
      korean: named.korean,
      initiated: named.initiated,
      color: named.color
    };
  }
  const year = hwarangEntryYear(p);
  if (year == null) return void 0;
  return classFromYear(year);
}
function hwarangClassColor(p) {
  const klass = p.hwarangClass ?? hwarangClassOf(p);
  return klass ? colorOfKlass(klass) : void 0;
}
function classSortKey(id) {
  const named = HWARANG_CLASSES.find((c) => c.id === id);
  if (named) return named.year;
  const year = parseInt(id, 10);
  return Number.isFinite(year) ? year : Number.POSITIVE_INFINITY;
}
function groupByHwarangClass(members) {
  const buckets = /* @__PURE__ */ new Map();
  for (const m of members) {
    const klass = m.hwarangClass ?? hwarangClassOf(m);
    const id = klass?.id ?? "_none";
    const named = HWARANG_CLASSES.find((c) => c.id === id);
    let group = buckets.get(id);
    if (!group) {
      group = {
        id,
        label: named?.label ?? klass?.label ?? "Ungraded",
        korean: named?.korean ?? klass?.korean,
        initiated: klass?.initiated ?? named?.initiated,
        color: named?.color ?? (klass ? colorOfKlass(klass) : void 0),
        members: []
      };
      buckets.set(id, group);
    }
    group.members.push(m);
  }
  const groups = [...buckets.values()].sort((a, b) => {
    if (a.id === "_none") return 1;
    if (b.id === "_none") return -1;
    return classSortKey(a.id) - classSortKey(b.id);
  });
  for (const g of groups) {
    const named = HWARANG_CLASSES.find((c) => c.id === g.id);
    g.members.sort((a, b) => {
      if (named) {
        const ia = named.members.indexOf(a.id);
        const ib = named.members.indexOf(b.id);
        if (ia !== -1 && ib !== -1 && ia !== ib) return ia - ib;
        if (ia !== -1 && ib === -1) return -1;
        if (ia === -1 && ib !== -1) return 1;
      }
      const bornA = a.born ?? Number.POSITIVE_INFINITY;
      const bornB = b.born ?? Number.POSITIVE_INFINITY;
      if (bornA !== bornB) return bornA - bornB;
      return nameOf(a).localeCompare(nameOf(b));
    });
  }
  return groups;
}
function sortHwarangMembers(members) {
  return groupByHwarangClass(members).flatMap((g) => g.members);
}
function withProfileMeta(p) {
  const extraTags = TAGS_BY_ID[p.id];
  const extraOrgs = ORGS_BY_ID[p.id];
  const extraGroups = GROUPS_BY_ID[p.id];
  const accents = CHARACTER_COLORS[p.id];
  const persona = PERSONA_META[p.id];
  const poster = POSTERS_BY_ID[p.id];
  let next = p;
  if (extraTags?.length) {
    next = { ...next, tags: [.../* @__PURE__ */ new Set([...next.tags ?? [], ...extraTags])] };
  }
  if (extraOrgs?.length) {
    next = { ...next, orgs: [.../* @__PURE__ */ new Set([...next.orgs ?? [], ...extraOrgs])] };
  }
  if (extraGroups?.length) {
    next = { ...next, groups: [.../* @__PURE__ */ new Set([...next.groups ?? [], ...extraGroups])] };
  }
  const klass = hwarangClassOf(next);
  if (klass) next = { ...next, hwarangClass: klass };
  if (accents) {
    next = {
      ...next,
      color: next.color ?? accents.color,
      ...accents.colorSecondary ? { colorSecondary: next.colorSecondary ?? accents.colorSecondary } : {}
    };
  }
  if (poster) next = { ...next, poster: next.poster ?? poster };
  if (persona) {
    const prompt = (next.llmPrompt ?? next.prompt ?? persona.prompt).trim();
    next = {
      ...next,
      personality: next.personality?.length ? next.personality : persona.personality,
      prompt,
      llmPrompt: next.llmPrompt ?? prompt
    };
  } else if (next.llmPrompt?.trim() && !next.prompt?.trim()) {
    next = { ...next, prompt: next.llmPrompt.trim() };
  } else if (next.prompt?.trim() && !next.llmPrompt?.trim()) {
    next = { ...next, llmPrompt: next.prompt.trim() };
  }
  return next;
}
var PROFILES = [
  ...PEOPLE,
  ...PHRASES,
  ...CONCEPTS,
  ...GROUPS,
  ...CLANS,
  ...NATIONS,
  ...RELATIONSHIPS,
  ...PLACE_PROFILES,
  ...SWORDS,
  ...ANIMALS,
  ...INSTRUMENTS
].map(withProfileMeta);
function colorOf(p) {
  return p.color ?? COLOR[p.id] ?? KINGDOMS[p.kingdom].color;
}
function accentColorsOf(p) {
  if (p.entity === "relationship" && p.between?.length) {
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    for (const id of p.between) {
      const other = byId.get(id);
      const hex = other ? colorOf(other) : colorOf(p);
      if (seen.has(hex)) continue;
      seen.add(hex);
      out.push(hex);
    }
    if (out.length) return out;
  }
  const primary = colorOf(p);
  if (p.colorSecondary && p.colorSecondary !== primary) {
    return [primary, p.colorSecondary];
  }
  return [primary];
}
function speechLangOf(p) {
  if (!p) return null;
  if (p.kingdom === "tang") return "zh";
  if (p.kingdom === "yamato") return "ja";
  return null;
}
function hangulInitial(p) {
  const k = p.korean?.trim();
  if (k) return [...k][0] ?? "\xB7";
  return "\xB7";
}
var PLACEHOLDER = {
  m: "/ch_placeholder_m.png",
  f: "/ch_placeholder_f.png"
};
var COURT_MAIDS = [
  "/ch_maid_1.png",
  "/ch_maid_2.png",
  "/ch_maid_3.png"
];
var CHART_GENDER = new Map(CHART_NODES.map((n) => [n.id, n.gender]));
function genderOf(p) {
  if (p.gender) return p.gender;
  const charted = CHART_GENDER.get(p.id);
  if (charted) return charted;
  if (p.entity && p.entity !== "god") return null;
  return "m";
}
function hashPick(seed, n) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  return Math.abs(h) % n;
}
function stageOf(p, year) {
  if (year == null || !p.stages?.length) return null;
  let hit = null;
  for (const s of p.stages) {
    if (s.lookOnly) continue;
    if (s.from != null && year < s.from) continue;
    if (s.until != null && year >= s.until) continue;
    hit = s;
  }
  return hit;
}
function stageById(p, look) {
  if (!look || !p.stages?.length) return null;
  return p.stages.find((s) => s.id === look) ?? null;
}
function resolveStage(p, year, look) {
  return stageById(p, look) ?? stageOf(p, year);
}
function nameOf(p, year, look) {
  return resolveStage(p, year, look)?.name ?? p.name;
}
function titleOf(p, year, look) {
  return resolveStage(p, year, look)?.title ?? p.title;
}
var REIGN_TITLE = /^(?:(?:First|Second|Third|Fourth)\s+)?(?:King|Queen|Emperor|Empress|Khagan|Heavenly Sovereign)\b(?!.*\b(?:consort|mother|dowager|generals)\b)/i;
var FEMININE_TITLE = /^(?:(?:First|Second|Third|Fourth)\s+)?(?:Queen|Empress)\b/i;
var CONSORT = /王后|王妃|皇后|夫人|왕후|왕비|황후|부인/;
function isMonarch(p, year, look) {
  if (p.entity) return false;
  const reigned = (p.career ?? []).some(
    (c) => REIGN_TITLE.test(c.title) && !CONSORT.test(`${c.hanja ?? ""} ${c.korean ?? ""}`) && (year == null || (c.from == null || year >= c.from) && (c.to == null || year <= c.to))
  );
  if (reigned) return true;
  const t = titleOf(p, year, look);
  return !!t && REIGN_TITLE.test(t) && !FEMININE_TITLE.test(t);
}
function koreanOf(p, year, look) {
  return resolveStage(p, year, look)?.korean ?? p.korean;
}
function avatarOf(p, seed, year, look) {
  if (p.id === "courtmaid") {
    if (!seed) return staticAsset(COURT_MAIDS[0]);
    return staticAsset(COURT_MAIDS[hashPick(seed, COURT_MAIDS.length)]);
  }
  const staged = resolveStage(p, year, look)?.avatar;
  if (staged) return staticAsset(staged);
  if (p.avatar) return staticAsset(p.avatar);
  const g = genderOf(p);
  return g ? staticAsset(PLACEHOLDER[g]) : null;
}
function stageGalleryOf(p) {
  const out = [
    { id: null, label: p.name, art: avatarOf(p) }
  ];
  if (!p.stages?.length) return out;
  for (const s of p.stages) {
    const label = s.label ?? s.name ?? s.title ?? s.id ?? "Later";
    const art = s.avatar ? staticAsset(s.avatar) : avatarOf(p);
    if (out.some((row) => row.art === art && row.label === label)) continue;
    out.push({ id: s.id ?? null, label, art });
  }
  return out;
}
function photoOf(p) {
  return p.photo ? staticAsset(p.photo) ?? void 0 : void 0;
}
function binyeoArtOf(p) {
  return p.binyeoImage ? staticAsset(p.binyeoImage) ?? void 0 : void 0;
}
function swordArtOf(p) {
  return p.swordImage ? staticAsset(p.swordImage) ?? void 0 : void 0;
}
function objectArtOf(p) {
  return p.objectImage ? staticAsset(p.objectImage) ?? void 0 : void 0;
}
function posterArtOf(p) {
  return p.poster ? staticAsset(p.poster) ?? void 0 : void 0;
}
function kingdomFlag(kingdom) {
  const flag = KINGDOMS[kingdom]?.flag;
  return flag ? staticAsset(flag) ?? void 0 : void 0;
}
function isPlaceholderArt(src) {
  if (!src) return false;
  const path = src.split("?")[0] ?? src;
  return path.includes("/placeholder_m.") || path.includes("/placeholder_f.");
}
var byId = new Map(PROFILES.map((p) => [p.id, p]));
{
  const hwanin = byId.get("hwanin");
  if (hwanin) byId.set("creator", hwanin);
}
{
  const sulmun = byId.get("sulmun");
  if (sulmun) byId.set("seolmundae", sulmun);
}
{
  const underworld = byId.get("underworld");
  if (underworld) byId.set("nation-underworld", underworld);
}
var ALIASES = PROFILES.flatMap(
  (p) => p.aliases.map((alias) => ({ alias, id: p.id }))
).sort((a, b) => b.alias.length - a.alias.length);
var escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var NAME_RE = new RegExp(
  `\\b(${ALIASES.map((a) => escape(a.alias)).join("|")})\\b(\\s*\\(\\d{1,3}\\))?`,
  "g"
);
var aliasToId = /* @__PURE__ */ new Map();
for (const a of ALIASES) {
  if (!aliasToId.has(a.alias)) aliasToId.set(a.alias, a.id);
}
function hasHumanAge(p) {
  return p.entity == null || p.entity === "god";
}
function ageAt(p, year) {
  if (!hasHumanAge(p) || p.born == null || year == null) return null;
  const age = year - p.born;
  if (age < 0) return null;
  if (p.died != null && year > p.died + 1) return null;
  return age;
}
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function linkPeople(html, year) {
  return html.replace(/(<[^>]*>)|([^<]+)/g, (_m, tag, text) => {
    if (tag) return tag;
    return text.replace(NAME_RE, (match, alias) => {
      const id = aliasToId.get(alias);
      const p = id ? byId.get(id) : void 0;
      if (!p) return match;
      const age = ageAt(p, year);
      const ageMark = age == null ? "" : `<sup class="person-age">${age}</sup>`;
      return `<button type="button" class="person" data-person="${p.id}">${escapeHtml(alias)}${ageMark}</button>`;
    });
  });
}

// src/lib/ranks.ts
var SECTIONS = [
  { id: "silla", en: "Silla", ko: "\uC2E0\uB77C", metric: "bone" },
  { id: "baekje", en: "Baekje", ko: "\uBC31\uC81C", metric: "clan" },
  { id: "goguryeo", en: "Goguryeo", ko: "\uACE0\uAD6C\uB824", metric: "tribe" },
  { id: "buyeo", en: "Buyeo & Jolbon", ko: "\uBD80\uC5EC \xB7 \uC878\uBCF8", metric: "tribe" },
  { id: "gaya", en: "Gaya", ko: "\uAC00\uC57C", metric: "court" },
  { id: "tang", en: "Tang", ko: "\uB2F9", metric: "court" },
  { id: "yamato", en: "Yamato", ko: "\uC65C", metric: "court" },
  { id: "tamla", en: "Tamla", ko: "\uD0D0\uB77C", metric: "court" },
  { id: "joseon", en: "Old Joseon", ko: "\uACE0\uC870\uC120", metric: "court" },
  { id: "gods", en: "Gods", ko: "\uC2E0", metric: "divine" },
  { id: "other", en: "Others", ko: "\uADF8 \uBC16\uC758 \uC778\uBB3C", metric: "court" }
];
var SECTION_INDEX = new Map(SECTIONS.map((s, i) => [s.id, i]));
function sectionOf(p) {
  if (p.entity === "god" && p.godTier !== "demigod") return SECTIONS[SECTION_INDEX.get("gods")];
  const id = p.kingdom === "jolbon" ? "buyeo" : p.kingdom;
  return SECTIONS[SECTION_INDEX.get(id) ?? SECTION_INDEX.get("other")];
}
var BONES = [
  [/sacred|성골/i, { label: "Sacred Bone", ko: "\uC131\uACE8" }],
  [/true|진골/i, { label: "True Bone", ko: "\uC9C4\uACE8" }],
  [/6|six|육두품/i, { label: "Head Rank 6", ko: "6\uB450\uD488" }],
  [/5|five|오두품/i, { label: "Head Rank 5", ko: "5\uB450\uD488" }],
  [/4|four|사두품/i, { label: "Head Rank 4", ko: "4\uB450\uD488" }],
  [/commoner|평민/i, { label: "Commoner", ko: "\uD3C9\uBBFC" }],
  [/slave|노비/i, { label: "Slave", ko: "\uB178\uBE44" }]
];
function boneTier(p) {
  const i = p.boneRank ? BONES.findIndex(([re]) => re.test(p.boneRank)) : -1;
  return i < 0 ? [BONES.length, { label: "Rank unrecorded", ko: "\uACE8\uD488 \uBBF8\uC0C1" }] : [i, BONES[i][1]];
}
var EIGHT_CLANS = ["clan-satek", "clan-yunbi", "clan-jinmo", "clan-mokli", "clan-hae", "clan-baek", "clan-guk", "clan-ahn"];
function clanTier(p) {
  if (p.clan === "clan-buyeo") return [0, { label: "Royal Buyeo", ko: "\uBD80\uC5EC \uC655\uAC00" }];
  const clan = p.clan ? byId.get(p.clan) : void 0;
  const eight = p.clan ? EIGHT_CLANS.indexOf(p.clan) : -1;
  if (clan && eight >= 0) return [1 + eight, { label: `${clan.name} \xB7 Eight Clans`, ko: `${clan.korean} \xB7 \uB300\uC131\uD314\uC871` }];
  if (clan) return [1 + EIGHT_CLANS.length, { label: `${clan.name} clan`, ko: clan.korean ?? clan.name }];
  return [2 + EIGHT_CLANS.length, { label: "No great house", ko: "\uB300\uC131 \uBC16" }];
}
var TRIBES = {
  royal: [0, { label: "Royal house \xB7 Gyeru", ko: "\uACC4\uB8E8\uBD80 \xB7 \uC655\uAC00" }],
  east: [1, { label: "East \xB7 Crow", ko: "\uB3D9\uBD80 \xB7 \uAE4C\uB9C8\uADC0" }],
  central: [2, { label: "Central \xB7 Horse", ko: "\uC911\uBD80 \xB7 \uB9D0" }],
  west: [3, { label: "West \xB7 Cow", ko: "\uC11C\uBD80 \xB7 \uC18C" }],
  south: [4, { label: "South \xB7 Pig", ko: "\uB0A8\uBD80 \xB7 \uB3FC\uC9C0" }],
  north: [5, { label: "North \xB7 Dog", ko: "\uBD81\uBD80 \xB7 \uAC1C" }]
};
function tribeOf(p) {
  if (p.tribe) return p.tribe;
  if (p.clan === "clan-go") return "royal";
  if (p.clan === "clan-yeon") return "east";
  if (p.kingdom === "goguryeo" && isMonarch(p)) return "royal";
  return void 0;
}
function tribeTier(p) {
  const t = tribeOf(p);
  return t ? TRIBES[t] : [6, { label: "Outside the five \uBD80", ko: "5\uBD80 \uBC16" }];
}
var GOD_TIERS = {
  S: [0, { label: "Creator", ko: "\uCC3D\uC870\uC2E0" }],
  I: [1, { label: "Sovereign of a realm", ko: "\uC0BC\uACC4\uC758 \uC8FC\uC778" }],
  II: [2, { label: "God of a domain", ko: "\uAD8C\uC5ED\uC758 \uC2E0" }],
  III: [3, { label: "God of a place or office", ko: "\uC9C1\uB2A5\uC758 \uC2E0" }],
  demigod: [4, { label: "Demigod", ko: "\uBC18\uC2E0" }]
};
var OFFICES = [
  [/^(?:king|emperor|ruler|sovereign|founder|voted king|god-king|heavenly sovereign)\b/i, 0],
  [/^(?:queen|empress)\b|crown prince|crown princess|queen consort|empress|consort|concubine|talented lady|heir/i, 1],
  [/supreme|high commander|high councillor|prime minister|premier|chancellor|taedaegakgan|great minister/i, 2],
  [/general|commander|marshal|guardian|admiral|dragon|tiger|fowl|tortoise|protector|captain|warden/i, 3],
  [/councillor|counsellor|minister|jwapyeong|envoy|governor|chief|chieftain|\bka\b/i, 4],
  [/prince|princess|queen/i, 5],
  [/hwarang/i, 6],
  [/officer|attendant|disciple|scholar|monk/i, 7]
];
var COURT_TIERS = [
  { label: "Sovereign", ko: "\uAD70\uC8FC" },
  { label: "Royal house", ko: "\uC655\uC2E4" },
  { label: "First ministers", ko: "\uC7AC\uC0C1" },
  { label: "Generals", ko: "\uC7A5\uC218" },
  { label: "Ministers & envoys", ko: "\uB300\uC2E0 \xB7 \uC0AC\uC2E0" },
  { label: "Royal kin", ko: "\uC655\uC871" },
  { label: "Hwarang", ko: "\uD654\uB791" },
  { label: "Officers", ko: "\uAD00\uB9AC" },
  { label: "Subjects", ko: "\uBC31\uC131" }
];
var held = (c, year) => (c.from == null || year >= c.from) && (c.to == null || year <= c.to);
function officeOf(p, year) {
  if (isMonarch(p, year)) {
    const reign = (p.career ?? []).find((c) => year == null || held(c, year));
    return { tier: 0, label: titleOf(p, year) ?? reign?.title, ko: reign?.korean };
  }
  const career = (p.career ?? []).filter((c) => year == null || held(c, year));
  const candidates = [...career];
  const title = year == null || !p.career?.length ? titleOf(p, year) : resolveStage(p, year)?.title;
  if (title) candidates.push({ title });
  let best = { tier: 8 };
  for (const c of candidates) {
    const hit = OFFICES.find(([re]) => re.test(c.title));
    if (hit && hit[1] < best.tier) best = { tier: hit[1], label: c.title, ko: c.korean };
  }
  return best;
}
function rankOf(p, year) {
  const section = sectionOf(p);
  const office = officeOf(p, year);
  let order;
  let tier;
  switch (section.metric) {
    case "bone":
      [order, tier] = boneTier(p);
      break;
    case "clan":
      [order, tier] = clanTier(p);
      break;
    case "tribe":
      [order, tier] = tribeTier(p);
      break;
    case "divine":
      [order, tier] = p.godTier ? GOD_TIERS[p.godTier] : [5, { label: "Unranked god", ko: "\uBBF8\uBD84\uB958 \uC2E0" }];
      break;
    default:
      [order, tier] = [office.tier, COURT_TIERS[office.tier]];
  }
  return {
    kingdom: section.id,
    section: { en: section.en, ko: section.ko },
    metric: section.metric,
    label: tier.label,
    ko: tier.ko,
    order,
    office: office.tier,
    officeLabel: office.label,
    officeKo: office.ko
  };
}
function compareRanks(a, b) {
  return (SECTION_INDEX.get(a.kingdom) ?? 99) - (SECTION_INDEX.get(b.kingdom) ?? 99) || a.order - b.order || a.office - b.office;
}
function compareByRank(a, b, year) {
  return compareRanks(rankOf(a, year), rankOf(b, year));
}
export {
  CLANS,
  CONCEPTS,
  ERA_TAG_IDS,
  ERA_TAG_META,
  GROUPS,
  GROUP_ROSTERS,
  HWARANG_CLASSES,
  HWARANG_CLASS_COLORS,
  HWARANG_CLASS_EPOCH,
  HWARANG_FIRST_YEAR,
  KINGDOMS,
  NATIONS,
  PEOPLE,
  PROFILES,
  accentColorsOf,
  ageAt,
  avatarOf,
  binyeoArtOf,
  byId,
  colorOf,
  compareByRank,
  compareRanks,
  genderOf,
  groupByHwarangClass,
  hangulInitial,
  hasHumanAge,
  hwarangClassColor,
  hwarangClassColorByIndex,
  hwarangClassIndex,
  hwarangClassKorean,
  hwarangClassLabel,
  hwarangClassOf,
  isMonarch,
  isPlaceholderArt,
  kingdomFlag,
  koreanOf,
  linkPeople,
  nameOf,
  objectArtOf,
  photoOf,
  posterArtOf,
  rankOf,
  resolveStage,
  sortHwarangMembers,
  speechLangOf,
  stageById,
  stageGalleryOf,
  stageOf,
  swordArtOf,
  titleOf
};
