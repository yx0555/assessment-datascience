export type AgencyCode = 
  | 'HDB' 
  | 'TOWN_COUNCIL' 
  | 'NEA' 
  | 'LTA' 
  | 'NPARKS' 
  | 'PUB' 
  | 'SLA' 
  | 'BCA' 
  | 'OUT_OF_PURVIEW'
  | 'OTHER_AGENCY';

export type PurviewStatus = 
  | 'UNDER_PURVIEW' 
  | 'MULTI_AGENCY' 
  | 'OUT_OF_PURVIEW' 
  | 'AMBIGUOUS';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface AgencyInfo {
  code: AgencyCode;
  name: string;
  shortName: string;
  fullName: string;
  badgeColor: string;
  accentColor: string;
  domain: string;
  iconName: string;
  description: string;
  typicalIssues: string[];
}

export interface ExtractedEntities {
  location?: string;
  landmark?: string;
  townOrEstate?: string;
  timeOrDate?: string;
  safetyHazard: boolean;
  hazardDetails?: string;
  sentiment: 'Frustrated' | 'Urgent' | 'Informative' | 'Neutral' | 'Distressed';
  category: string;
}

export interface TriageResult {
  id: string;
  timestamp: string;
  originalFeedback: string;
  purviewStatus: PurviewStatus;
  isPurviewOfMSO: boolean;
  
  primaryAgency: {
    code: AgencyCode;
    name: string;
    specificDivision?: string;
    targetTownCouncil?: string;
  };
  
  secondaryAgencies?: Array<{
    code: AgencyCode;
    name: string;
    roleReason: string;
  }>;
  
  outOfPurviewDetails?: {
    recommendedAuthority: string;
    reason: string;
    alternativeChannel?: string;
  };

  priority: PriorityLevel;
  slaHoursEstimate: number;
  confidenceScore: number; // 0 - 100
  
  summary: string;
  jurisdictionReasoning: string;
  extractedEntities: ExtractedEntities;
  
  actionPlan: string[];
  
  draftReply: {
    standardAcknowledgment: string;
    requestMoreInfoReply: string;
    urgentSafetyReply: string;
    outOfPurviewReferralReply?: string;
    activeDraftText: string;
  };
}

export interface SampleCase {
  id: string;
  title: string;
  agencyLabel: string;
  category: string;
  tag: string;
  text: string;
}
