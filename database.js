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
    area: "Intro Valley",
    solved_value: 1162,
    item_id: "e902bde0-e23a-4651-a601-712fa66de665"
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
    label: "Cannonball",
    area: "Main Peak",
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
    label: "Pointers' Paradise",
    area: "Red Tower",
    solved_value: 1372,
    item_id: "c06844a3-c8fc-4019-9972-e3a7913ba8dc"
  },
  {
    key: "gourdOpticalTelegraph",
    label: "Optical Telegraph",
    area: "Green Tower",
    solved_value: 1242,
    item_id: "01fb88ad-d614-45f9-8f16-fd3fd06cd8bc"
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
    area: "Main Peak",
    solved_value: 1142,
    item_id: "79e09b95-3a26-4a4e-a494-af599948f1f5"
  },
  {
    key: "gourdCoordinatesHolding",
    label: "Coordinates Holding",
    area: "Red Tower",
    solved_value: 1382,
    item_id: "723416d8-eff6-474e-ab5f-c3c398b1d799"
  },
  {
    key: "gourdMemoryBombs",
    label: "Memory Bombs",
    area: "Green Tower",
    solved_value: 1272,
    item_id: "7e1cbead-d5b2-4d0a-b4a0-9a22f1c95856"
  },
  {
    key: "gourdPerspectiveCounting",
    label: "Perspective Counting",
    area: "Green Tower",
    solved_value: 1552,
    item_id: "929cee23-1d31-4a8a-ad56-aec75acdf079"
  },
  {
    key: "gourdTrapRoom",
    label: "Trap Room",
    area: "Green Tower",
    solved_value: 1062,
    item_id: "e4dce483-ca49-4c24-b362-ec7304f6d4a1"
  },
  {
    key: "gourdRingRoom",
    label: "Ring Room",
    area: "Green Tower",
    solved_value: 1092,
    item_id: "8405503b-2ea3-4708-babe-e5cb47e75ba3"
  },
  {
    key: "gourdCabinFever",
    label: "Cabin Fever",
    area: "Blue Tower",
    solved_value: 1002,
    item_id: "903d3924-ec05-456d-aa5d-33f6431bf558"
  },
  {
    key: "gourdFlareRun",
    label: "Flare Run",
    area: "Blue Tower",
    solved_value: 1572,
    item_id: "b151ce51-fda9-4caa-8ed2-d78fce41098b"
  },
  {
    key: "gourdCenturonSong",
    label: "Centurion Song",
    area: "Yellow Tower",
    solved_value: 1472,
    item_id: "97454e67-9a62-495b-9fa9-7b01adcb5e04"
  },
  {
    key: "gourdScoutBombs",
    label: "Scout Bombs",
    area: "Yellow Tower",
    solved_value: 1442,
    item_id: "53ea5ed0-5534-4e3a-9500-5cf2f620c497"
  },
  {
    key: "gourdIndoorSemaphore",
    label: "Indoor Semaphore",
    area: "Yellow Tower",
    solved_value: 1232,
    item_id: "fe48178e-1ccc-41d4-9642-3b974efa2184"
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
    area: "Yellow Tower",
    solved_value: 1352,
    item_id: "587c27b4-6ec3-408b-8390-96f80c65da16"
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
    area: "Yellow Tower",
    solved_value: 1532,
    item_id: "36332988-68d9-4e33-9cbb-dacd156dea83"
  },
  {
    key: "gourdSignalFlags",
    label: "Signal Flags",
    area: "Green Tower",
    solved_value: 1412,
    item_id: "5a72ab76-fa7f-4b87-b967-6cd6c1d5990c"
  },
  {
    key: "gourdDancerAndSelecter",
    label: "Dancer & Selector",
    area: "Purple",
    solved_value: 1512,
    item_id: "30bc3f4c-08fc-47ca-a95b-36df9efed8bf"
  },
  {
    key: "gourdCabinFeverLong",
    label: "Cabin Fever Long",
    area: "Purple",
    solved_value: 1422,
    item_id: "bc8ffeb2-72d5-4a52-81c4-43cccf81c7d5"
  },
  {
    key: "gourdKickUpPits",
    label: "Kick Up Pits",
    area: "Main Peak",
    solved_value: 1492,
    item_id: "67b16620-bb35-4254-89bd-9a27cc7c872c"
  },
  {
    key: "gourdCoordinates",
    label: "Coordinates",
    area: "Green Tower",
    solved_value: 1152,
    item_id: "1831bcbf-fdbc-442b-a4bb-52270e0a24f9"
  },
  {
    key: "gourdBlindfoldFishtrap",
    label: "Blindfold Fishtrap",
    area: "Green Tower",
    solved_value: 1542,
    item_id: "a7feca56-e073-4649-b62b-dcbe064fb5a2"
  },
  {
    key: "gourdMediumSimPress",
    label: "Medium Sim Press",
    area: "Green Tower",
    solved_value: 1072,
    item_id: "34ea1a2f-8dd1-4ac4-be39-80126a390464"
  },
  {
    key: "gourdBreadcrumbLoop",
    label: "Breadcrumb Loop",
    area: "Main Peak",
    solved_value: 1432,
    item_id: "51ed260a-e519-4ac7-a8bb-79356344ffa6"
  },
  {
    key: "gourdCannonballCommute",
    label: "Cannonball Commute",
    area: "Purple",
    solved_value: 1582,
    item_id: "bba47059-5dc0-4f0c-9a91-ed0232a2babb"
  },
  {
    key: "gourdCharadesRooms",
    label: "Charades Rooms",
    area: "Purple",
    solved_value: 1342,
    item_id: "268fc057-9e09-4f41-b950-077b3841e2e8"
  },
  {
    key: "gourdSpeedObby",
    label: "Speed Obby",
    area: "Purple",
    solved_value: 1522,
    item_id: "b90611e9-5f88-4d22-91d8-b515293dce54"
  },
  {
    key: "gourdPoetAndPontiff",
    label: "Poet & Pontiff",
    area: "Purple",
    solved_value: 1592,
    item_id: "cbbca208-0dcf-40a9-b5c2-2bab30e80e05"
  },
  {
    key: "gourdTileThief",
    label: "Tile Thief",
    area: "Green Tower",
    solved_value: 1332,
    item_id: "92b54fba-6b48-4273-b3e2-0f318a0a5825"
  },
  {
    key: "gourdCenturionSeance",
    label: "Centurion Seance",
    area: "Purple",
    solved_value: 1562,
    item_id: "e9d4ceeb-0735-48aa-a2f2-996b36eeba8a"
  },
  {
    key: "gourdMusicalHoliday",
    label: "Musical Holiday",
    area: "Blue Tower",
    solved_value: 1482,
    item_id: "edd455c7-cdfd-467a-a854-5f44499df55c"
  },
  {
    key: "gourdSingerAndSelecter",
    label: "Singer & Selector",
    area: "Yellow Tower",
    solved_value: 1502,
    item_id: "9b70befb-d3f4-4deb-ad32-939ec6a20005"
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

// Orb Beacons
const ORB_BEACON_DATABASE = [
  {coordinate_1: 3069, coordinate_2: 1119, light_id: "a63e8fae-211e-4c2f-bc86-afde28fc07cb", orb_id: "c716c86d-81a7-40cc-873f-0405821dbd72"},
  {coordinate_1: 3164, coordinate_2: 1432, light_id: "75bb0253-e96c-4efe-915c-2b0d51ea44c7", orb_id: "6beb48a3-60de-41e8-a9f6-d39772bcdfa4"},
  {coordinate_1: 3201, coordinate_2: 1351, light_id: "f902d694-7312-42aa-8e0a-2b96f4b6b3a4", orb_id: "4ee18fc7-2a43-44e0-9a2b-4508e9d2705d"},
  {coordinate_1: 3214, coordinate_2: 1352, light_id: "540b3025-4100-43f7-b2d1-2bd26b3af2ab", orb_id: "cef7ae31-a105-491d-8d0d-daab0253909c"},
  {coordinate_1: 3230, coordinate_2: 1800, light_id: "e83c1a3b-cde9-4601-a933-1e53f00f5f1f", orb_id: "6a673617-992d-49ca-87f9-223aef4c9fe4"},
  {coordinate_1: 3262, coordinate_2: 1677, light_id: "dd114fa8-5d9c-40ed-8665-fb63f6db2ac4", orb_id: "face4ac8-c8ec-4f7f-8b52-5a51d3f252d5"},
  {coordinate_1: 3274, coordinate_2: 1906, light_id: "39d52eb6-691e-4fdc-93dc-2d048345ee9b", orb_id: "59a73457-6368-4639-8ec7-335902797343"},
  {coordinate_1: 3303, coordinate_2: 1580, light_id: "f459ff9e-5e12-43f5-ba1c-f2b4ce383415", orb_id: "d0f4305f-b577-41f7-a879-18be53553509"},
  {coordinate_1: 3304, coordinate_2: 1598, light_id: "23f2cac5-7466-4b0a-ac52-e769c635078f", orb_id: "3d09137d-fbbd-4cb8-a17a-05de7676f61c"},
  {coordinate_1: 3314, coordinate_2: 1594, light_id: "03acaf4c-82d1-4e79-84e2-338c3b347879", orb_id: "1ff0231c-4933-4bec-b878-4e6f1fe88856"},
  {coordinate_1: 3357, coordinate_2: 1935, light_id: "2f2387fc-5ea1-4601-a598-75919500e09e", orb_id: "5aee9530-d618-4635-a461-154729bbad3c"},
  {coordinate_1: 3378, coordinate_2: 1523, light_id: "0b9ab152-5db9-456f-bf01-4219ae59d77f", orb_id: "080554bb-bc16-41cd-bc96-4765cec96beb"},
  {coordinate_1: 3389, coordinate_2: 1933, light_id: "002de760-e207-470e-8619-218c529b56b3", orb_id: "18c9fe41-46ff-43a4-bb21-5b9687d31c2f"},
  {coordinate_1: 3414, coordinate_2: 1691, light_id: "4272b27c-ace3-45a5-bb56-46276c138d12", orb_id: "11c1d018-3dbf-46d4-b1de-f9aba4d29fc2"},
  {coordinate_1: 3445, coordinate_2: 1684, light_id: "94f80351-5005-4e01-b001-f1c7215e6ade", orb_id: "bef6d32e-57a9-4ba1-b984-05fdec08800c"},
  {coordinate_1: 3449, coordinate_2: 1475, light_id: "d3ab0a60-cde6-483d-ac39-5f2d7e503d24", orb_id: "80e38f3e-d054-4187-9675-66d6e70c8356"},
  {coordinate_1: 3498, coordinate_2: 1455, light_id: "62f5e205-392e-4c58-a8cc-7b27ec12b94f", orb_id: "df814b39-e550-4e17-ad44-e32028ab3c47"},
  {coordinate_1: 3504, coordinate_2: 1990, light_id: "c2760565-906a-427b-822b-bed82907c12e", orb_id: "a552b903-066f-45a8-8550-4cbf5652de74"},
  {coordinate_1: 3514, coordinate_2: 1386, light_id: "07e31f8e-a5d7-40fe-b122-5652856f15de", orb_id: "0460483f-1636-4ee6-8635-2168a9acaf34"},
  {coordinate_1: 3514, coordinate_2: 1450, light_id: "7be99f42-d102-4a36-a759-f63c39951de4", orb_id: "fa653354-bdfa-431d-aa19-7453e5730e80"},
  {coordinate_1: 3520, coordinate_2: 1428, light_id: "c5b1e5f1-fb47-460e-94f5-10733b2a5553", orb_id: "007a1599-17ad-426f-a68b-37718423e9f7"},
  {coordinate_1: 3521, coordinate_2: 1262, light_id: "49fb5727-90b6-4d56-aa2a-a2e5957e36c4", orb_id: "cec1412b-4727-48c4-b6a1-5a5e7989af18"},
  {coordinate_1: 3524, coordinate_2: 1299, light_id: "4183b7b7-3b5d-45cd-b8d6-e6d1cd2b421f", orb_id: "5efbf72b-9dff-4251-a536-f625ba8ff315"},
  {coordinate_1: 3528, coordinate_2: 1328, light_id: "22dbe305-2ed7-460b-8e51-f4905696b838", orb_id: "fee806b8-8617-49f8-99af-bdea0c148ed0"},
  {coordinate_1: 3531, coordinate_2: 1417, light_id: "fe27e473-05f1-4ef7-975c-cffd5f79dadc", orb_id: "99d8a99a-89eb-4ad0-8736-104aafe1fdd7"},
  {coordinate_1: 3544, coordinate_2: 1259, light_id: "ed71dda8-21d1-4844-9874-52dbf567b13e", orb_id: "4ec6aca0-9961-4550-9c26-7cacb9917566"},
  {coordinate_1: 3544, coordinate_2: 1837, light_id: "c7f34815-a273-40a7-bc17-e083699cd906", orb_id: "1cdcd9a1-0343-4234-b1d9-7be646dec4ae"},
  {coordinate_1: 3549, coordinate_2: 1850, light_id: "fa34f5ff-cb44-4d2c-8295-c93ffd45a82e", orb_id: "0537b69a-6e49-406a-b93c-d6bc7f6cc4b3"},
  {coordinate_1: 3561, coordinate_2: 1628, light_id: "9ac557cb-0182-4b63-b99e-32894d647f8b", orb_id: "b6b916cf-b0d6-478d-be1a-95feba8a4c0d"},
  {coordinate_1: 3565, coordinate_2: 1397, light_id: "5b608612-f55c-4435-923c-d24adca2d2ab", orb_id: "4df70c57-8d1b-447e-bad5-5aa66c1169f4"},
  {coordinate_1: 3565, coordinate_2: 1759, light_id: "789be0af-809f-4b3b-bdc1-9a9e18aa001f", orb_id: "accb5df0-1452-4b84-8607-9f01bd517103"},
  {coordinate_1: 3566, coordinate_2: 1380, light_id: "7fef39cf-918b-4787-9054-d6e5bf28c72d", orb_id: "0abc8402-398d-4f0d-bf5e-fb3051a16e21"},
  {coordinate_1: 3571, coordinate_2: 1227, light_id: "3474aa3c-af13-4aa7-bd65-9ef2d8e10cbc", orb_id: "94876c24-50ba-41cb-8fdd-9bd026f3be32"},
  {coordinate_1: 3571, coordinate_2: 1640, light_id: "9d8ad4a5-1b6d-4fc5-8e19-9adb3782453b", orb_id: "34ceba57-c27a-48a1-93bd-2b7e9f8fdd56"},
  {coordinate_1: 3575, coordinate_2: 1627, light_id: "51e6ce7a-a8c4-427d-984b-6cf3d8fc3b24", orb_id: "bc22db01-a328-461b-bc01-0b47300b4128"},
  {coordinate_1: 3577, coordinate_2: 1388, light_id: "15c4dee9-3722-482c-b7ec-b2b49e9675a6", orb_id: "942347f0-cd23-445f-8019-d296e5c92ead"},
  {coordinate_1: 3588, coordinate_2: 1574, light_id: "d1633e95-1eb4-4666-9f01-3bcf9a530ba7", orb_id: "dda45672-d1fe-4758-8a7e-132d58db7708"},
  {coordinate_1: 3589, coordinate_2: 1297, light_id: "60d7ac2d-5c26-49ff-977b-f9032cb43214", orb_id: "d3e57e13-a91d-492c-bd46-2c59da8bef9e"},
  {coordinate_1: 3606, coordinate_2: 1730, light_id: "e3a9c247-12a3-4e2e-9975-1b4610215409", orb_id: "cd88c773-6375-42c7-9475-76b288bd1c91"},
  {coordinate_1: 3609, coordinate_2: 1725, light_id: "d0f0e0b6-dc3a-4057-a885-40fd496d6d6e", orb_id: "52b0dfcb-4588-4ce7-a78c-bdb9cb800fe6"},
  {coordinate_1: 3614, coordinate_2: 1568, light_id: "98273c3b-4fc9-41dd-af90-a27726a2edbe", orb_id: "b234d29d-0850-4dae-b8da-4f43c44d032c"},
  {coordinate_1: 3621, coordinate_2: 1699, light_id: "61e3a323-363e-4465-bf10-fc5b2edd16cd", orb_id: "24d2f9a5-5376-4a7c-b08c-17e9c060855b"},
  {coordinate_1: 3625, coordinate_2: 1737, light_id: "f43cc8f5-84c5-420b-b3ae-6a1a3ce434cd", orb_id: "f84cb1c7-1702-4fa1-9ddb-f4c334041237"},
  {coordinate_1: 3634, coordinate_2: 1691, light_id: "4116478f-99a2-4a4b-b644-bf666d78595e", orb_id: "dab5cfc8-f4d9-44f2-abb0-90bc42b3cade"},
  {coordinate_1: 3649, coordinate_2: 1298, light_id: "993e835a-1135-498b-baa8-1e63cc654261", orb_id: "5ee8fa69-8937-4841-b9a7-ee8a10c3a933"},
  {coordinate_1: 3651, coordinate_2: 1288, light_id: "d4ca0139-9030-4209-a1a5-d41f03bc0309", orb_id: "226bdfbc-c2ad-4bda-b9ec-2d72c09f1502"},
  {coordinate_1: 3657, coordinate_2: 1339, light_id: "e9452917-53be-4c64-81eb-1252f85b302f", orb_id: "2cb8963f-ac2f-4f2a-b720-11a701bc4b08"},
  {coordinate_1: 3668, coordinate_2: 1708, light_id: "9ca3244c-4ab5-4da7-8a38-2d50bd22d130", orb_id: "f85a273f-6a96-4671-92d3-2fad913cdf50"},
  {coordinate_1: 3675, coordinate_2: 1406, light_id: "37bb9314-5ae6-4410-b52f-be39fd3234f2", orb_id: "d27fe6ce-2b92-42bd-8d60-8885e368877c"},
  {coordinate_1: 3677, coordinate_2: 1326, light_id: "1d32a146-d38a-4c7a-8cf7-682400f6183e", orb_id: "d467b790-8968-46b1-9be9-e36eac9ebe52"},
  {coordinate_1: 3686, coordinate_2: 1392, light_id: "634e8a21-1236-436c-816e-778b9ec18299", orb_id: "1b047167-6e68-49c3-abf2-e15fbbeca0a5"},
  {coordinate_1: 3689, coordinate_2: 1752, light_id: "5842c5fd-bc0f-46b7-b11e-bd7f8faec223", orb_id: "b2f9b7af-39f5-431c-9908-c2ebf6d6453b"},
  {coordinate_1: 3698, coordinate_2: 1698, light_id: "c82559c7-8484-4e80-b061-cf7ea581f8bd", orb_id: "12a7f64b-8175-4857-a371-77dc2989cd68"},
  {coordinate_1: 3705, coordinate_2: 2189, light_id: "937b4bc8-b0aa-4b4d-b037-e2498c434784", orb_id: "087f1e73-309b-4db2-8e39-dee6c926ad59"},
  {coordinate_1: 3710, coordinate_2: 1397, light_id: "3b2ab572-eccf-49dd-bd1e-4f77268a85de", orb_id: "17e22f02-4f01-4aa4-83fb-d2871acd97cd"},
  {coordinate_1: 3710, coordinate_2: 1616, light_id: "76d4ee2b-a258-4202-81dc-c23e4c171724", orb_id: "db9c9240-b43a-4336-b11f-4c9096f80efc"},
  {coordinate_1: 3713, coordinate_2: 1297, light_id: "2f03c9e1-9486-43f5-85bf-b4c2b18fe0bb", orb_id: "4b9cad35-ab44-4dfe-9e4b-390cb165aca5"},
  {coordinate_1: 3713, coordinate_2: 1943, light_id: "3f60b59c-49ef-4189-b17e-a2120cdb83a3", orb_id: "bf436b99-fb48-43cc-9ceb-364a8ef0afd7"},
  {coordinate_1: 3732, coordinate_2: 1620, light_id: "b2c2cded-ff71-4b88-b14e-3209448aa2ed", orb_id: "0f131f71-b907-4b3a-8691-d301984810cf"},
  {coordinate_1: 3737, coordinate_2: 1256, light_id: "3c1167c6-d338-4099-a2f3-b4fd50e5bd04", orb_id: "c2756ad3-4f4a-45e5-93a3-4c10e892ebdc"},
  {coordinate_1: 3754, coordinate_2: 2155, light_id: "9f8f580e-998f-475b-a750-859efdd2d09b", orb_id: "d327588f-8645-45e5-8893-dd75ece59e7b"},
  {coordinate_1: 3760, coordinate_2: 1794, light_id: "ebbc1f8d-b12c-435c-a8f1-4d4f1f027c7f", orb_id: "16990dcc-ebb8-453e-88fc-6478e3980728"},
  {coordinate_1: 3769, coordinate_2: 1448, light_id: "0eb07974-bc8a-4fa8-884e-de216abb4b31", orb_id: "dafcd747-771e-428f-b6b3-8fda3dc03f87"},
  {coordinate_1: 3780, coordinate_2: 1508, light_id: "c39a2559-bd40-4192-b878-ea93f63b6aac", orb_id: "38722a78-da82-4d6e-80c4-efd70e1be90f"},
  {coordinate_1: 3781, coordinate_2: 1434, light_id: "2d1a8ac7-7259-478f-a490-502f814c7bba", orb_id: "d368b4c7-8389-4f63-a20f-ba88ef17f0a5"},
  {coordinate_1: 3825, coordinate_2: 1593, light_id: "9dad04ca-57b9-4d90-8fa5-5880abc116fc", orb_id: "60412245-4b6c-47eb-a4e7-67eec146bf20"},
  {coordinate_1: 3825, coordinate_2: 1801, light_id: "41575caa-16fa-4c53-b0a2-2c145655d674", orb_id: "b46c590f-7038-4033-b84d-e3fb664e095c"},
  {coordinate_1: 3842, coordinate_2: 1348, light_id: "643937b3-d9ba-4e49-927d-b79091cac555", orb_id: "ab7edc0a-082f-4e7c-9f5a-36dac37916d3"},
  {coordinate_1: 3845, coordinate_2: 1352, light_id: "d75bf508-c8b0-4a6c-91af-cd278464c74f", orb_id: "545c1691-9463-46ed-bb76-fb964b916fcf"},
  {coordinate_1: 3851, coordinate_2: 1360, light_id: "f06f725e-1b4f-4d7f-8f72-47e56f500967", orb_id: "fa1f1175-98b8-4f2c-bba0-9c2213eae7bc"},
  {coordinate_1: 3854, coordinate_2: 1364, light_id: "56addbdd-6ce3-4295-8e24-a8bcf6b6a589", orb_id: "ccc262b3-f753-4655-82b8-fd222e626dce"},
  {coordinate_1: 3855, coordinate_2: 1503, light_id: "66a2e130-9bce-4627-9701-f3cc9a2e32d2", orb_id: "d0a1c556-d62f-42df-a36e-019636da7679"},
  {coordinate_1: 3857, coordinate_2: 2029, light_id: "75fd9a31-5621-4984-80d4-b32575f95548", orb_id: "7017169d-96f6-4578-8c1f-eb65f3549e32"},
  {coordinate_1: 3874, coordinate_2: 1714, light_id: "d253c285-7510-4e0a-8206-04fd74a1ab3f", orb_id: "c7141d1b-96bf-4c2c-8c05-3d2067e64a93"},
  {coordinate_1: 3878, coordinate_2: 1836, light_id: "6521db4b-0a02-417a-a0cb-522f5601bebf", orb_id: "d069a848-37f5-40e0-ac18-64516951f481"},
  {coordinate_1: 3889, coordinate_2: 1522, light_id: "6aea2bf6-b5e0-4b57-8768-3018d97e1172", orb_id: "01de40ae-bdf0-42b2-9407-ccfa1a2be482"},
  {coordinate_1: 3935, coordinate_2: 1913, light_id: "86eaf5d3-fa93-4f05-b163-c095d4ed87c3", orb_id: "68287599-1f13-42f0-9424-cabd187e8a55"},
  {coordinate_1: 3936, coordinate_2: 1927, light_id: "409af7f3-cb97-4c06-827a-ddf8344aae06", orb_id: "eaa97883-12ad-4e8e-9f6d-cdf7f1a3a061"},
  {coordinate_1: 3938, coordinate_2: 1593, light_id: "77c23a85-d1fb-450d-9055-93d1be2a35eb", orb_id: "982f4dbf-22bb-4553-aa9c-dd6588c19fda"},
  {coordinate_1: 3944, coordinate_2: 1922, light_id: "b7a6929f-a26d-431c-8c9f-c915e768ac8f", orb_id: "fcda7d44-81af-4526-be44-f16a90e5b0ec"},
  {coordinate_1: 4021, coordinate_2: 1875, light_id: "160238fb-8fef-4abd-a7a1-d9c2aa4b6f0c", orb_id: "7ba7b0e5-af33-4246-a648-ee09b45dc196"},
  {coordinate_1: 4033, coordinate_2: 1859, light_id: "2a24dbaa-e33e-4eeb-8af8-8c428de0b5f3", orb_id: "4274d393-5d48-4e94-ab9d-a865e0155827"},
  {coordinate_1: 4038, coordinate_2: 1862, light_id: "8bcab6e6-730c-4e35-82a2-60f5a999017e", orb_id: "3191264d-2b5a-47a0-8054-fa16544d54ce"},
  {coordinate_1: 4041, coordinate_2: 1874, light_id: "98e29c66-8142-4839-8330-062310ad3fa2", orb_id: "5cd38107-3b8e-42de-b08a-f60a8083265a"},
  {coordinate_1: 4113, coordinate_2: 1867, light_id: "949ae672-5237-4c67-be7b-ad497e19769e", orb_id: "0e8faaf2-b5fd-4906-aaab-788f8ccbf603"},
  {coordinate_1: 4172, coordinate_2: 1653, light_id: "5df13092-258a-46c0-b294-4fc6495e4943", orb_id: "d2b218b4-279c-4e3e-9751-53a8cbfade87"},
  {coordinate_1: 4183, coordinate_2: 1984, light_id: "9a8c3101-3d23-4302-a587-1336af4f7ac8", orb_id: "07034671-09fc-4220-9bd4-c73e7942a194"},
  {coordinate_1: 4184, coordinate_2: 1644, light_id: "3649ebf8-69cf-48f8-a7b1-42070d1f7843", orb_id: "c5e792c4-080b-4377-8d68-f09c00debc91"},
  {coordinate_1: 4204, coordinate_2: 1750, light_id: "8f0bd4c1-8aa8-487d-a4a6-0568324942bd", orb_id: "632fc258-f424-4b88-930a-a62c45044965"},
  {coordinate_1: 4215, coordinate_2: 1996, light_id: "2244d8e7-2c13-44b5-a268-7205f9418517", orb_id: "d252953b-ebd1-484a-a555-953bccb904c0"},
  {coordinate_1: 4216, coordinate_2: 1985, light_id: "7f702850-355b-463e-9301-cfe370014a27", orb_id: "4cd9c5fc-7414-4bfc-b4a2-6fb4fa0312c5"},
  {coordinate_1: 4221, coordinate_2: 1561, light_id: "7aadec78-5e35-4794-86dc-89d8791695d7", orb_id: "a4b64c23-b583-4efc-af9a-feecb8485e18"},
  {coordinate_1: 4246, coordinate_2: 1920, light_id: "5c594416-ade6-4a99-b080-9b98a23d593c", orb_id: "b5461e87-1a09-4f2c-b9b5-158f195adbf3"},
  {coordinate_1: 4343, coordinate_2: 1844, light_id: "22f81a3d-1ed4-49b0-b4eb-0d44e8116da6", orb_id: "b28ac861-6c5d-4702-8b11-ef38df1eac22"},
  {coordinate_1: 4358, coordinate_2: 1842, light_id: "bcc02dfe-1cff-4ee8-b68f-53eee7cab476", orb_id: "98c2cd14-bbcf-4066-b58c-d7d23d2757f1"},
  {coordinate_1: 4396, coordinate_2: 1697, light_id: "28df1667-24c9-4005-8d48-fbe0c3082a66", orb_id: "1329e6b4-8821-4add-98c3-9f71eceeb0e4"},
  {coordinate_1: 4497, coordinate_2: 1761, light_id: "8bf8d10f-7ec6-4940-b614-394e9cf72ccf", orb_id: "5a87bda7-9397-481d-80f8-d9e52ec98242"},  
]

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
  "cf899912-898f-4486-86ae-91ed78025a9d": "Flashlight (blue tunnel)",
  "b4dbfae3-89e9-45c0-9dd0-3fd815cd3904": "Scanner (blue tower)",
  "6364d493-5c48-4480-a02d-ae086ef06825": "Binoculars (blue tower)",
  "f68a6dbc-0b73-47b6-b9e6-fd28e016606e": "Laser (blue tower)",
  "b459af97-5a07-4024-8950-02f752c5292b": "Flashlight (yellow tower)",
  "56a5d535-d1a6-4ada-a1b3-cf6951bb2e66": "Flashlight (yellow tunnel)",
  "9fadd6c5-af79-437f-80dd-ebb74d8526d4": "Scanner (yellow tower)",
  "6debc10d-8e02-40d5-a5be-bfc992b89a9a": "Binoculars (yellow tower)",
  "e69463b0-e27c-4247-93e4-50df64cd12ad": "Laser (yellow tower)",
  "730affd5-3139-473c-aaf2-4ecd5142c82f": "Backpack green (golf)",
  "9057af3c-12c5-48d8-8251-07233a203861": "Belt green (north face)",
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
  "ef09f445-cd71-4414-938a-7a7122dcd121": "Belt orange (northeast)",
  "88942e8e-6fae-4d71-93f0-8500741a82d1": "Binoculars (chair ride puzzle)",
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
  "87dbbb84-5c58-43a4-96ba-e43c1c7308b9": "Radio (station 3)",
  "070cf8f2-6824-413e-9c2a-43a1027c24c5": "Radio (station 6)",
  "eed83af3-1958-4718-a634-5280bdc6b3cb": "Binoculars (southern peak)",
  "c420401c-ba23-4e0c-aeac-2ea3ebcafa26": "Scanner (southern peak)",
  "30d9262e-172d-49f8-8448-1df83f228f2d": "Text Sign (GPS Box)",
  "53a9dbfc-8f28-4f29-8f7a-ce40fe53beaa": "Text Sign (hub 1)",
  "8e4c6b5a-fe32-4153-88e5-115b4e67cc99": "Text Sign (hub 2)",
  "63d54442-149e-4aab-822e-63af72c1630a": "Text Sign (hub 3)",
  "aef5ae8b-6b16-4dd2-859e-eaaa004cd9d5": "Football",
  "f29614f5-0c70-4ed8-b152-9e57b371f20d": "Walkie Talkie Blue (red tower)",
  "76601ed6-da1c-4326-9c8d-2c6168d31f36": "Backpack yellow",
  "185e3864-0dcb-498b-baee-6da1a4b21a8e": "Walkie Talkie Yellow (red tower)",
  "cee6114c-2dc0-4d02-a393-5686a2f2e9b8": "Walkie Talkie Yellow (northeast)",
  "56a7313e-9e55-485b-ac52-fcc6f8030133": "Walkie Talkie Blue (northeast)",
  "48da7ac6-988f-4f4b-a376-3686fe550f69": "Megaphone (southern tip)",
  "7e2f3ba8-2124-4fe9-8707-1621be5a0926": "Megaphone (green tower)",
  "3a73627e-2c56-4227-8ace-cd9b1e0614a4": "Tea kettle 1",
  "ef7d6c42-bdf5-4dfe-bb26-79eadbd3105d": "Tea kettle 2",
  "9e7486b7-e953-401e-bdab-49f665e02f4c": "Tea kettle 3",
  "92b8e9be-f548-499a-8c2f-c92212df7e6a": "Tea kettle 4",
  "0a379de4-d171-4ebd-aeb2-8ac2409787cb": "Tea kettle 5",
  "119fcab4-2086-4ed9-a02e-a9945e849f96": "Tea kettle 6",
  "c6259d07-2499-4063-b033-b72cddd951c2": "Megaphone (yellow tower)",
  "d73ec09b-8e2b-432e-8e62-b5ff71db2d23": "Belt purple (tunnels)",
  "ea8c71ac-810f-4426-84a1-17e0e3b0b81d": "Radio (peak)",
  "ed2f8967-b4c1-43d9-91b5-11679be10bc6": "Binoculars (peak)",
  "5fa8468a-dfaa-48fe-8057-46d47b9e56a5": "Gourd Case (balloon)",
  "3bfe0dec-42de-4c31-87ab-a72f0b94722a": "Belt (yellow)",
  "6efb6db4-76c1-4ffa-b249-8badc6d4bf82": "Walkie Talkie Blue (peak)",
  "a5992995-191a-45b7-aa23-e9a64a4fede7": "Walkie Talkie Yellow (peak)",
  "fdf796fb-fe22-4ee2-b2aa-f0ad071a279a": "Orb (basketball)",
};