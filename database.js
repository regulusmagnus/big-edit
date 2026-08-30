// Progression Gates & Zone Unlocks
const UNLOCK_DEFINITIONS = [
  { key: "SpawnHubGate", label: "Gate (Starting Area)", value: 1 },
  { key: "HubShortcutToSportsCreek", label: "Gate (Red Tower)", value: 1 },
  { key: "HubTunnel", label: "Gate (Yellow Tower)", value: 1 },
  { key: "bigKeyIntro", label: "Intro Bridge Unlocked", value: 210 },
  { key: "bigKeyRedZone", label: "Map Room Unlocked", value: 220 },
  { key: "bigKeyBlueZone", label: "Train Unlocked", value: 221 },
  { key: "bigKeyGreenZone", label: "Chairlift Unlocked", value: 222 },
  { key: "bigKeyYellowZone", label: "Tunnels Unlocked", value: 223 },
  { key: "BlackTowerInteriorDoor", label: "Black Tower Interior", value: 1},
  { key: "bigKeyBoss", label: "Black Key Placed", value: 224 }
];

// Endgame Gauntlet
const GAUNTLET_DEFINITIONS = [
  { key: "GauntletChamber0", label: "Chamber 1", value: 1 },
  { key: "GauntletChamber1", label: "Chamber 2", value: 1 },
  { key: "GauntletChamber2", label: "Chamber 3", value: 1 },
  { key: "GauntletChamber3", label: "Chamber 4", value: 1 },
  { key: "GauntletChamber4", label: "Chamber 5", value: 1 },
  { key: "GauntletChamber5", label: "Chamber 6", value: 1 },
  { key: "GauntletChamber6", label: "Chamber 7", value: 1 },
  { key: "GauntletComplete", label: "Gauntlet Complete", value: 1 },
  { key: "bigKeyOverflow", label: "White Key Placed", value: 225 }
];

// Radio Stations
const RADIO_DEFINITIONS = [
  { key: "FmStationBreathwork", label: "Radio Station 1", value: 1 },
  { key: "FmStationSleuthFm", label: "Radio Station 2", value: 1 },
  { key: "FmStationFourthSpace", label: "Radio Station 3", value: 1 },
  { key: "FmStationJourneyBeat", label: "Radio Station 4", value: 1 },
  { key: "FmStationDanceFm", label: "Radio Station 5", value: 1 },
  { key: "FmStationAFJ", label: "Radio Station 6", value: 1 },
  { key: "FmStationKosmische", label: "Radio Station 7", value: 1 }
];

// Gourd Definitions
const GOURD_DEFINITIONS = [
  {
    key: "gourdEasySimPress",
    label: "Easy Sim Press",
    area: "Intro Valley",
    solved_value: 1082,
    item_id: "aee838dc-281f-41fd-8f48-c97c10769172"
  },
  {
    key: "gourdHighButton",
    label: "High Button",
    area: "Intro Valley",
    solved_value: 1012,
    item_id: "78c2bd04-9f92-41c9-b605-6f079df4cc30"
  },
  {
    key: "gourdTellerWindow",
    label: "Teller Window",
    area: "Intro Valley",
    solved_value: 1402,
    item_id: "84f2b536-41a9-4571-8304-579b3f5cf584"
  },
  {
    key: "gourdTelescopeToBox",
    label: "Telescope to Box",
    area: "Intro Valley"
  },
  {
    key: "gourdBasketball",
    label: "Basketball",
    area: "Red Tower",
    solved_value: 1212,
    item_id: "03b99000-0640-4f67-9da4-8eac378a4158"
  },
  {
    key: "gourdFielding",
    label: "Fielding",
    area: "Red Tower",
    solved_value: 1032,
    item_id: "e0da06cd-6f68-44d9-8541-7616d8c4de9a"
  },
  {
    key: "gourdCannonBall",
    label: "Fielding",
    area: "Red Tower",
    solved_value: 1042,
    item_id: "787f8a29-8752-4f45-b3bd-fc37bdc57ca2"
  },
  {
    key: "gourdWindowLabyrinth",
    label: "Window Labyrinth",
    area: "Red Tower",
    solved_value: 1182,
    item_id: "e854b404-7ad4-4b2c-82f9-54d1b0bf6591"
  },
  {
    key: "gourdPointersParadise",
    label: "Pointers Paradise",
    area: "Red Tower"
  },
  {
    key: "gourdOpticalTelegraph",
    label: "Optical Telegraph",
    area: "Green Tower"
  },
  {
    key: "gourdObservationRoom",
    label: "Observation Room",
    area: "Blue Tower",
    solved_value: 1172,
    item_id: "ead91cc2-57d8-4556-878a-cb22174ff7b6"
  },
  {
    key: "gourdPoetAndPreist",
    label: "Poet & Priest",
    area: "Blue Tower",
    solved_value: 1252,
    item_id: "b10b2c30-96f5-4a31-9c04-e7d37ef0eab1"
  },
  {
    key: "gourdInvisibleInk",
    label: "Invisible Ink",
    area: "Blue Tower",
    solved_value: 1052,
    item_id: "7dba3ab6-54c3-4cf4-812f-a108d1d6c858"
  },
  {
    key: "gourdObby",
    label: "Obby (Jungle Gym)",
    area: "Blue Tower",
    solved_value: 1132,
    item_id: "9c0a4126-6e80-4ba4-aec0-533ff0da9dbf"
  },
  {
    key: "gourdCarousel",
    label: "Carousel",
    area: "Yellow Tower",
    solved_value: 1142,
    item_id: "79e09b95-3a26-4a4e-a494-af599948f1f5"
  },
  {
    key: "gourdCoordinatesHolding",
    label: "Coordinates Holding",
    area: "Unsorted",
  },
  {
    key: "gourdMemoryBombs",
    label: "gourdMemoryBombs",
    area: "Unsorted",
  },
  {
    key: "gourdPerspectiveCounting",
    label: "Perspective Counting",
    area: "Unsorted",
  },
  {
    key: "gourdTrapRoom",
    label: "Trap Room",
    area: "Unsorted",
  },
  {
    key: "gourdRingRoom",
    label: "Ring Room",
    area: "Unsorted",
  },
  {
    key: "gourdCabinFever",
    label: "Cabin Fever",
    area: "Unsorted",
  },
  {
    key: "gourdFlareRun",
    label: "Flare Run",
    area: "Unsorted",
  },
  {
    key: "gourdCenturonSong",
    label: "Centuron Song",
    area: "Yellow Tower",
    solved_value: 1472,
    item_id: "97454e67-9a62-495b-9fa9-7b01adcb5e04"
  },
  {
    key: "gourdScoutBombs",
    label: "Scout Bombs",
    area: "Unsorted",
  },
  {
    key: "gourdIndoorSemaphore",
    label: "Indoor Semaphore",
    area: "Unsorted",
  },
  {
    key: "gourdEggHunt",
    label: "Egg Hunt",
    area: "Yellow Tower",
    solved_value: 1392,
    item_id: "bfd723fd-83a5-4942-8eb4-6e3586ec60eb"
  },
  {
    key: "gourdMicrophoneArray",
    label: "Microphone Array",
    area: "Unsorted",
  },
  {
    key: "gourdConcert",
    label: "Concert",
    area: "Yellow Tower",
    solved_value: 1222,
    item_id: "f566452b-bde4-4328-b78a-f8a05e993f87"
  },
  {
    key: "gourdBlindfoldCatwalk",
    label: "Blindfold Catwalk",
    area: "Unsorted",
  },
  {
    key: "gourdSignalFlags",
    label: "Signal Flags",
    area: "Unsorted",
  },
  {
    key: "gourdDancerAndSelecter",
    label: "Dancer & Selector",
    area: "Purple",
  },
  {
    key: "gourdCabinFeverLong",
    label: "Cabin Fever Long",
    area: "Purple",
  },
  {
    key: "gourdKickUpPits",
    label: "Kick Up Pits",
    area: "Unsorted",
  },
  {
    key: "gourdCoordinates",
    label: "Coordinates",
    area: "Unsorted",
  },
  {
    key: "gourdBlindfoldFishtrap",
    label: "Blindfold Fishtrap",
    area: "Unsorted",
  },
  {
    key: "gourdMediumSimPress",
    label: "Medium Sim Press",
    area: "Unsorted",
  },
  {
    key: "gourdBreadcrumbLoop",
    label: "Breadcrumb Loop",
    area: "Unsorted",
  },
  {
    key: "gourdCannonballCommute",
    label: "Cannonball Commute",
    area: "Purple",
  },
  {
    key: "gourdCharadesRooms",
    label: "Charades Rooms",
    area: "Purple",
  },
  {
    key: "gourdSpeedObby",
    label: "Speed Obby",
    area: "Purple",
  },
  {
    key: "gourdPoetAndPontiff",
    label: "Poet & Pontiff",
    area: "Purple",
  },
  {
    key: "gourdTileThief",
    label: "Tile Thief",
    area: "Unsorted",
  },
  {
    key: "gourdCenturionSeance",
    label: "Centurion Seance",
    area: "Purple",
  },
  {
    key: "gourdMusicalHoliday",
    label: "Musical Holiday",
    area: "Unsorted",
  },
  {
    key: "gourdSingerAndSelecter",
    label: "Singer & Selector",
    area: "Unsorted",
  }
];

// Gourd Placement Slots
const GOURD_SLOTS = [
  { area: "Intro Valley", slot_number: 1, value: 150 },
  { area: "Intro Valley", slot_number: 2, value: 151 },
  { area: "Intro Valley", slot_number: 3, value: 152 },
  { area: "Intro Valley", slot_number: 4, value: 153 },
  { area: "Red Tower", slot_number: 1, value: 100 },
  { area: "Red Tower", slot_number: 2, value: 101 },
  { area: "Red Tower", slot_number: 3, value: 102 },
  { area: "Red Tower", slot_number: 4, value: 103 },
  { area: "Red Tower", slot_number: 5, value: 104 },
  { area: "Green Tower", slot_number: 1, value: 110 },
  { area: "Green Tower", slot_number: 2, value: 111 },
  { area: "Green Tower", slot_number: 3, value: 112 },
  { area: "Green Tower", slot_number: 4, value: 113 },
  { area: "Green Tower", slot_number: 5, value: 114 },
  { area: "Blue Tower", slot_number: 1, value: 120 },
  { area: "Blue Tower", slot_number: 2, value: 121 },
  { area: "Blue Tower", slot_number: 3, value: 122 },
  { area: "Blue Tower", slot_number: 4, value: 123 },
  { area: "Blue Tower", slot_number: 5, value: 124 },
  { area: "Yellow Tower", slot_number: 1, value: 130 },
  { area: "Yellow Tower", slot_number: 2, value: 131 },
  { area: "Yellow Tower", slot_number: 3, value: 132 },
  { area: "Yellow Tower", slot_number: 4, value: 133 },
  { area: "Yellow Tower", slot_number: 5, value: 134 },
  { area: "Black Tower", slot_number: 1, value: 140 },
  { area: "Black Tower", slot_number: 2, value: 141 },
  { area: "Black Tower", slot_number: 3, value: 142 },
  { area: "Black Tower", slot_number: 4, value: 143 },
  { area: "Black Tower", slot_number: 5, value: 144 },
  { area: "Black Tower", slot_number: 6, value: 145 },
  { area: "Endgame Hub", slot_number: 1, value: 160 },
  { area: "Endgame Hub", slot_number: 2, value: 161 },
  { area: "Endgame Hub", slot_number: 3, value: 162 },
  { area: "Endgame Hub", slot_number: 4, value: 163 },
  { area: "Endgame Hub", slot_number: 5, value: 164 },
  { area: "Endgame Hub", slot_number: 6, value: 174 },
  { area: "Endgame Hub", slot_number: 7, value: 165 },
  { area: "Endgame Hub", slot_number: 8, value: 166 },
  { area: "Endgame Hub", slot_number: 9, value: 167 },
  { area: "Endgame Hub", slot_number: 10, value: 175 },
  { area: "Endgame Hub", slot_number: 11, value: 168 },
  { area: "Endgame Hub", slot_number: 12, value: 169 },
  { area: "Endgame Hub", slot_number: 13, value: 170 },
  { area: "Endgame Hub", slot_number: 14, value: 171 },
  { area: "Endgame Hub", slot_number: 15, value: 172 }
];

// Curated Inventory Items (Orbs, Lights, and Lamps excluded)
const INVENTORY_DATABASE = {
  "307d526d-780f-4fe2-b3fd-95f74b86319c": "Cowbell (blue)",
  "a418a7cd-0945-44c1-9f7b-14eac4584cf1": "Cowbell (red)",
  "cf0fd97f-0f39-4b0c-9474-54c665aeb2e9": "Cowbell (yellow)",
  "c7ba38c6-f0fe-45fd-ad4a-6d1907b408ae": "Laser (map 1)",
  "7c788690-d373-4b31-9be9-31bbb3ec1f88": "Laser (map 2)",
  "cb8326bc-26c2-4214-8dc4-3ebafe0b5603": "Laser (map 3)",
  "d793e0fe-a145-496f-a348-2d8a65add9e8": "Compass",
  "672cd949-1e5b-465a-a1cb-3860594f9e9f": "Map",
  "d6270f5f-1ab7-4526-9e64-cccebde9389d": "Flashlight (red tower)",
  "0132c70b-9a0c-4b5a-be06-b9bb077a6e5a": "Scanner (red tower)",
  "f40709b7-b15b-4131-ab88-ae08571224ac": "Binoculars (red tower)",
  "8fbe1de2-1ea0-4da4-8ef5-282f5d19b492": "Laser (red tower)",
  "cbbf5ba7-0026-4737-9547-2e69187a2845": "Flashlight (red tunnel)",
  "57632bfc-688b-40e4-aabd-d020f489b291": "Flashlight (green tunnel)",
  "44015a0e-20ca-441a-b6e9-bbd28657b5f3": "Clock (green tower station)",
  "63d13c11-3557-402d-ad0c-b7b255d5b3d8": "GPS Box",
  "b25443e0-ec2d-4b55-b8e9-01ac48604ba5": "Flashlight (green tower)",
  "ed7b657e-5949-4a1e-8b82-e50ad2a8d785": "Scanner (green tower)",
  "16e1e4a2-aadf-43e1-a67b-f2513dd63303": "Binoculars (green tower)",
  "b2913ee0-2c3f-4582-a2f5-6c9f33b40b3b": "Laser (green tower)",
  "381abbdb-da55-4243-a5df-692acd3fb2c0": "Flashlight (blue tower)",
  "b4dbfae3-89e9-45c0-9dd0-3fd815cd3904": "Scanner (blue tower)",
  "6364d493-5c48-4480-a02d-ae086ef06825": "Binoculars (blue tower)",
  "f68a6dbc-0b73-47b6-b9e6-fd28e016606e": "Laser (blue tower)",
  "b459af97-5a07-4024-8950-02f752c5292b": "Flashlight (yellow tower)",
  "9fadd6c5-af79-437f-80dd-ebb74d8526d4": "Scanner (yellow tower)",
  "6debc10d-8e02-40d5-a5be-bfc992b89a9a": "Binoculars (yellow tower)",
  "e69463b0-e27c-4247-93e4-50df64cd12ad": "Laser (yellow tower)",
  "730affd5-3139-473c-aaf2-4ecd5142c82f": "Backpack green (golf)",
  "9057af3c-12c5-48d8-8251-07233a203861": "Belt green (north face)",
  "03b99000-0640-4f67-9da4-8eac378a4158": "Gourd (basketball)",
  "5fa8468a-dfaa-48fe-8057-46d47b9e56a5": "Gourd Case (balloon)",
  "cd159c6e-88aa-4158-a11f-2790cf581052": "Walkie Talkie yellow (balloon)",
  "00d7ed74-a4d9-4969-b8e2-bf8d4975ac8a": "Walkie Talkie blue (balloon)",
  "80381b52-ede7-494f-b800-0c77a71f57e0": "Flare Gun (red)",
  "72bc4c22-4418-4b7c-9c1d-e8cfa5040102": "Flare Gun (green)",
  "044daaf7-fb90-4f73-a9bb-00b8a3df9c60": "Scanner (intro)",
  "ac52bd4b-990f-4908-999d-5badeb8b6eda": "Flashlight (intro bridge)",
  "41e7b481-2e10-4d62-9136-5e6e0ba9fa7d": "Radio (station 1)",
  "ebdec567-58c0-48c7-a62a-bbd843bef36f": "Radio (hub)",
  "28cf2386-5e54-4b7e-99ba-283298aa3816": "Scanner (hub)",
  "a08daa18-2fef-4a49-a062-2baafdf48686": "Clock (hub station)",
  "1c9f8bc9-5850-4085-80f6-05c2821b505d": "Clock (yellow tower station)",
  "f468d4dc-594e-4c62-80d4-3a85d9e25b3e": "Clock (southern field station)",
  "e56da5eb-bac5-4c5e-b489-a8de3d204e7c": "Clock (southwestern bay station)",
  "209a7dc3-9dcb-425e-86c5-3a84aa9bd0ec": "Clock (red tower station)",
  "2d8101c4-223f-4939-8df6-809562469516": "Backpack blue (hub)",
  "66de92ed-177d-49d5-aa97-e86d98083ac0": "Flare Gun (yellow)",
  "d8e70c55-9800-498e-af4e-7054093950e4": "Radio (station 7)",
  "8b9fc973-4200-4934-8169-dde2de5b1d10": "Flare Gun (blue)",
  "ec17f547-5b1f-4fcf-828e-f2932dc2f620": "Radio (station 4)",
  "22009189-d33d-4e65-8b3c-c8257188743d": "Backpack red (northeast)",
  "ef09f445-cd71-4414-938a-7a7122dcd121": "Belt red (northeast)",
  "88942e8e-6fae-4d71-93f0-8500741a82d1": "Binoculars (chair ride puzzle)",
  "79e09b95-3a26-4a4e-a494-af599948f1f5": "Gourd (carousel)",
  "84f2b536-41a9-4571-8304-579b3f5cf584": "Gourd (teller window)",
  "78c2bd04-9f92-41c9-b605-6f079df4cc30": "Gourd (high button)",
  "aee838dc-281f-41fd-8f48-c97c10769172": "Gourd (easy sim press)",
  "e854b404-7ad4-4b2c-82f9-54d1b0bf6591": "Gourd (window labyrinth)",
  "e0da06cd-6f68-44d9-8541-7616d8c4de9a": "Gourd (fielding)",
  "9bf74ba0-af80-45c7-b9db-bd3d15137f10": "Chair (jam 1)",
  "70501fef-7827-41cb-989e-7c8d8a44925f": "Chair (jam 2)",
  "2808bcb9-e9a0-4d86-b830-34f9b9d871f6": "Chair (jam 3)",
  "e94ea998-7014-4cd9-acfa-02abd795ca02": "Chair (jam 4)",
  "e94f569e-9f96-4d3c-9c7e-a1b369c74ab3": "Chair (jam 5)",
  "13e8b476-3985-44b8-8ec6-aae5cec8bb78": "Chair (jam 6)",
  "f2dea8ab-08ea-434d-b98b-7e66a499392e": "Backpack peach (south valley)",
  "02e75b25-ffa8-49e9-9fa3-7c453206aad9": "Backpack red (south tip)",
  "3e944e74-2d2e-40e2-b1ba-a1afa8c937ee": "Belt blue (south tip)",
  "2835fac9-81b1-4312-a576-cc977e6e8c85": "Radio (station 2)",
  "eed83af3-1958-4718-a634-5280bdc6b3cb": "Binoculars (southern peak)",
  "c420401c-ba23-4e0c-aeac-2ea3ebcafa26": "Scanner (southern peak)"
};