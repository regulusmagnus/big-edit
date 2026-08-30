// Progression Gates & Zone Unlocks
const UNLOCK_DEFINITIONS = [
  { key: "SpawnHubGate", label: "Gate (Starting Area)", value: 1 },
  { key: "HubShortcutToSportsCreek", label: "Gate (Red Tower)", value: 1 },
  { key: "HubTunnel", label: "Gate (Yellow Tower)", value: 1 },
  { key: "bigKeyIntro", label: "Intro Bridge Unlocked", value: 210 },
  { key: "bigKeyRedZone", label: "Map Room Unlocked", value: 220 },
  { key: "bigKeyBlueZone", label: "Train Unlocked", value: 221 },
  { key: "bigKeyGreenZone", label: "Chairlift Unlocked", value: 222 },
  { key: "bigKeyYellowZone", label: "Tunnels Unlocked", value: 223 }
];

// Radio Stations
const RADIO_DEFINITIONS = [
  { key: "FmStationBreathwork", label: "Radio Station 1", value: 1 }
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
  "d8e70c55-9800-498e-af4e-7054093950e4": "Radio (station 7)"
};