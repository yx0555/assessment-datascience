import { SampleCase } from '../types';

export const SAMPLE_CASES: SampleCase[] = [
  {
    id: 'case-1',
    title: 'Faulty Traffic Lights & Pedestrian Signal',
    agencyLabel: 'LTA',
    category: 'Road Infrastructure',
    tag: 'Urgent Road Hazard',
    text: `The pedestrian green man signal at the junction of Tampines Ave 4 and Tampines St 21 (near Blk 201D) has not been turning green for the past 2 days. School children from the nearby primary school are forced to dash across the road during breaks in heavy morning traffic. Please send a technician urgently before an accident occurs!`
  },
  {
    id: 'case-2',
    title: 'Severe Mosquito Breeding at Canal Perimeter',
    agencyLabel: 'NEA / PUB',
    category: 'Vector Control',
    tag: 'Public Health',
    text: `Along the Bukit Timah canal verge behind Sixth Avenue MRT station, there is a large puddle of stagnant muddy water with hundreds of active mosquito larvae wriggling around. Our estate has had 3 dengue cases reported this month. Please carry out immediate larviciding and inspect the perimeter drain.`
  },
  {
    id: 'case-3',
    title: 'Corridor Obstruction & Cluttered Hoarding',
    agencyLabel: 'Town Council',
    category: 'Estate Cleanliness',
    tag: 'Fire Safety / Common Property',
    text: `At Blk 432 Ang Mo Kio Ave 10, 8th floor common corridor, unit #08-112 has piled up over 15 cardboard boxes, old bicycles, and wooden cupboard parts completely blocking the escape route. The width remaining is less than 0.8 meters, which is a major fire hazard and prevents elderly neighbours with wheelchairs from passing.`
  },
  {
    id: 'case-4',
    title: 'Dangerous Overhanging Roadside Tree Branch',
    agencyLabel: 'NParks',
    category: 'Greenery & Trees',
    tag: 'Safety Hazard',
    text: `There is a huge, cracked tree branch hanging precariously above the public bus shelter (Bus Stop ID: 41021) along Upper Bukit Timah Road right after heavy thunderstorms yesterday. It looks like it could snap and crash onto waiting commuters anytime.`
  },
  {
    id: 'case-5',
    title: 'Inter-floor Ceiling Water Leakage',
    agencyLabel: 'HDB',
    category: 'Public Housing Defects',
    tag: 'Structural Maintenance',
    text: `I am the owner of Blk 118 Jurong East St 13 #04-32. Since last week, dirty water has been continuously dripping from my master bedroom ceiling, coming from the unit directly above #05-32. The upstairs owner refuses to open the door or cooperate with us. The ceiling plaster is already cracking and turning mouldy. Please assist to arrange a joint HDB inspection.`
  },
  {
    id: 'case-6',
    title: 'Choked Storm Drain & Flash Flooding Risk',
    agencyLabel: 'PUB',
    category: 'Drainage & Floods',
    tag: 'Infrastructure',
    text: `The roadside monsoon drain grating along Balestier Road outside shophouses #280-#290 is completely choked with heavy tree roots, dried leaves, and plastic beverage cups. Every time it rains, water overflows onto the pedestrian pathway and spills into the restaurants.`
  },
  {
    id: 'case-7',
    title: 'Illegal Dumping of Construction Waste on State Land',
    agencyLabel: 'SLA',
    category: 'State Land',
    tag: 'Encroachment & Dumping',
    text: `Someone has dumped several lorry loads of broken tiles, discarded concrete slabs, and rotting furniture on the open grassland plot beside Jalan Kayu (near the expressway slip road). The plot has an SLA boundary signboard. Please clear the waste and look into fencing up the area.`
  },
  {
    id: 'case-8',
    title: 'Wild Boar Intrusion & Feeding at Park Connector',
    agencyLabel: 'NParks (AVS)',
    category: 'Wildlife Management',
    tag: 'Animal Nuisance',
    text: `A sounder of 5 wild boars has been aggressively foraging and chasing joggers along the Ulu Pandan Park Connector near Sunset Way every evening. Some members of the public are also feeding them bread and apples, which makes them bolder and dangerous to young children.`
  },
  {
    id: 'case-9',
    title: 'Scam Call Impersonating OneService Officer',
    agencyLabel: 'Out of Purview (SPF)',
    category: 'Non-Municipal / Crime',
    tag: 'Scam / Police Matter',
    text: `I received an automated phone call from a local +65 number claiming to be from the 'OneService MSO Compliance Unit'. The caller stated that I have an unpaid municipal fine of $850 for illegal littering and threatened immediate arrest unless I transferred money to a PayNow UEN account. They also asked for my Singpass 2FA code.`
  },
  {
    id: 'case-10',
    title: 'Private Condominium Gym Maintenance Dispute',
    agencyLabel: 'Out of Purview (Private MCST)',
    category: 'Non-Municipal / Private Property',
    tag: 'Private MCST Matter',
    text: `The managing agent and MCST council of my private condominium in River Valley has refused to repair the broken air-conditioning in our resident gym for 6 months despite collecting our monthly maintenance fee of $480. Can the government fine the MCST or force them to hold an EGM?`
  }
];
