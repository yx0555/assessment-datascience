import { AgencyCode, AgencyInfo } from '../types';

export const MSO_AGENCIES: Record<AgencyCode, AgencyInfo> = {
  HDB: {
    code: 'HDB',
    name: 'Housing & Development Board',
    shortName: 'HDB',
    fullName: 'Housing & Development Board',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    accentColor: '#DC2626',
    domain: 'Public Housing & Structural Maintenance',
    iconName: 'Building2',
    description: 'Responsible for public housing structures, structural defects (e.g. spalling concrete, inter-floor ceiling leaks), HDB car park structures, and HDB commercial shops.',
    typicalIssues: [
      'Inter-floor ceiling water leakages in HDB flats',
      'Spalling concrete or facade structural cracks',
      'HDB multi-storey carpark structural faults / gantries',
      'HDB commercial shop tenancy/lease compliance',
      'Flat renovation guidelines & structural safety'
    ]
  },
  TOWN_COUNCIL: {
    code: 'TOWN_COUNCIL',
    name: 'Town Council',
    shortName: 'TC',
    fullName: 'Relevant Town Council (e.g., Ang Mo Kio, Tanjong Pagar, Tampines)',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accentColor: '#059669',
    domain: 'Common Property & Estate Cleanliness',
    iconName: 'Home',
    description: 'Manages common property in HDB estates including corridors, void decks, estate lighting, rubbish chutes, estate landscape/grass cutting within boundaries, and lift maintenance.',
    typicalIssues: [
      'Corridor clutter & hoarding obstruction in common hallways',
      'Void deck cleanliness, littering, and dirty common areas',
      'HDB block lift breakdowns or elevator lighting issues',
      'Estate playground equipment defects & park amenities in precinct',
      'Estate grass cutting & landscaping inside HDB estate boundaries',
      'Bulky item removal and choked rubbish chutes'
    ]
  },
  NEA: {
    code: 'NEA',
    name: 'National Environment Agency',
    shortName: 'NEA',
    fullName: 'National Environment Agency',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    accentColor: '#D97706',
    domain: 'Public Health, Vector Control & Sanitation',
    iconName: 'ShieldAlert',
    description: 'Oversees environmental public health, mosquito/dengue vector control, pest infestations in public places, hawker centre hygiene, smoking prohibition, and noise/odour emissions.',
    typicalIssues: [
      'Mosquito breeding & stagnant water (Dengue vector control)',
      'Pest infestations (rats, cockroaches) in public areas / food outlets',
      'Smoking in prohibited areas / second-hand smoke nuisance',
      'Hawker centre hygiene & public toilet cleanliness',
      'Funeral wake noise and tentage permits',
      'Air pollution, burning smells, and industrial odour'
    ]
  },
  LTA: {
    code: 'LTA',
    name: 'Land Transport Authority',
    shortName: 'LTA',
    fullName: 'Land Transport Authority',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    accentColor: '#2563EB',
    domain: 'Roads, Public Transport & Active Mobility',
    iconName: 'Car',
    description: 'Maintains public roads, expressways, traffic lights, road directional signs, bus stops, pedestrian overhead bridges, cycling paths, illegal parking on public roads, and PMD enforcement.',
    typicalIssues: [
      'Road potholes, road cracks, and uneven road tarmac',
      'Faulty traffic lights, pedestrian crossings, or signal timings',
      'Damaged bus shelters, overhead bridge lifts, or commuter paths',
      'Illegal parking & obstruction along public roads/yellow lines',
      'Reckless e-scooter (PMD/PAB) usage on pedestrian footpaths',
      'Damaged street directional signs and road barriers'
    ]
  },
  NPARKS: {
    code: 'NPARKS',
    name: 'National Parks Board',
    shortName: 'NParks',
    fullName: 'National Parks Board (incl. Animal & Veterinary Service)',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    accentColor: '#0D9488',
    domain: 'Greenery, Public Trees, Wildlife & Pets',
    iconName: 'Trees',
    description: 'Manages trees and greenery along public roads and roadside verges, public parks, nature reserves, park connectors (PCN), and wildlife/animal matters (AVS).',
    typicalIssues: [
      'Overgrown roadside tree branches & fallen trees on public roads',
      'Public park maintenance, park connector network (PCN) pathways',
      'Wild animal management (monkeys, wild boars, otter sightings)',
      'Bird nuisance, pigeon feeding, and crow roosting/cawing',
      'Stray dog/cat welfare & pet management (AVS purview)'
    ]
  },
  PUB: {
    code: 'PUB',
    name: 'PUB, National Water Agency',
    shortName: 'PUB',
    fullName: 'PUB, Singapore’s National Water Agency',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    accentColor: '#0891B2',
    domain: 'Drainage, Flood Management & Water Supply',
    iconName: 'Droplets',
    description: 'Oversees public storm water drains, canals, flood alleviation, public water pipe leaks/bursts, public sewer maintenance, and reservoir cleanliness.',
    typicalIssues: [
      'Roadside drain choking and flash flood occurrences',
      'Canal maintenance and water flow obstruction',
      'Burst public water mains and sudden water pressure drops',
      'Sewer odour and manhole drainage issues in public areas',
      'Cleanliness and safety of reservoirs and water catchment zones'
    ]
  },
  SLA: {
    code: 'SLA',
    name: 'Singapore Land Authority',
    shortName: 'SLA',
    fullName: 'Singapore Land Authority',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    accentColor: '#4F46E5',
    domain: 'State Land Management & Unallocated Plots',
    iconName: 'Landmark',
    description: 'Manages vacant state land, maintenance/grass cutting on unallocated state plots, illegal dumping on state land, and boundary demarcations.',
    typicalIssues: [
      'Illegal dumping of bulky trash/construction waste on vacant state land',
      'Overgrown vegetation and fence repairs on unallocated state land',
      'Encroachment or unauthorized structures on state property'
    ]
  },
  BCA: {
    code: 'BCA',
    name: 'Building and Construction Authority',
    shortName: 'BCA',
    fullName: 'Building and Construction Authority',
    badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
    accentColor: '#475569',
    domain: 'Private Building Safety & Construction Works',
    iconName: 'HardHat',
    description: 'Oversees structural safety and maintenance standards of private residential and commercial developments, as well as construction site regulations.',
    typicalIssues: [
      'Structural defects or falling tiles on private buildings/condos',
      'Construction site safety hazards & construction noise permits'
    ]
  },
  OUT_OF_PURVIEW: {
    code: 'OUT_OF_PURVIEW',
    name: 'Out of MSO Purview',
    shortName: 'Non-MSO',
    fullName: 'Outside Municipal Services Office Purview',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    accentColor: '#E11D48',
    domain: 'Non-Municipal / External Jurisdiction',
    iconName: 'AlertTriangle',
    description: 'Feedback does not relate to physical municipal infrastructure or estate cleanliness. Must be routed/referred to specialized non-municipal bodies (e.g. SPF, MOM, IRAS, CPF, ICA, SCDF).',
    typicalIssues: [
      'Police matters: Scams, theft, harassment, criminal disputes (SPF)',
      'Emergency ambulance or active fire response (SCDF 995)',
      'Employment disputes or domestic helper issues (MOM)',
      'CPF savings, retirement payouts, tax assessments (CPF / IRAS)',
      'Immigration, passport, checkpoints queries (ICA)',
      'Private internal condo management / MCST monetary disputes (Strata Title Board / Small Claims)'
    ]
  },
  OTHER_AGENCY: {
    code: 'OTHER_AGENCY',
    name: 'Other Specialized Agency',
    shortName: 'Other',
    fullName: 'Other Specialized Government Agency',
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
    accentColor: '#7C3AED',
    domain: 'Specialized Government Function',
    iconName: 'Layers',
    description: 'Requires specific coordination with specialized statutory boards or ministries.',
    typicalIssues: ['Specialized cross-ministry requests']
  }
};
