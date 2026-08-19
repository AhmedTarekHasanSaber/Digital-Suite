export type Language = 'ar' | 'en';

export interface MeetingRecommendation {
  id: string;
  labelEn: string;
  labelAr: string;
  tagEn: string;
  tagAr: string;
  reductionPct: number;
  descriptionEn: string;
  descriptionAr: string;
  iconType: 'async' | 'quorum' | 'compress' | 'merge' | 'approve';
}

export interface MeetingItem {
  id: string;
  titleEn: string;
  titleAr: string;
  organizerEn: string;
  organizerAr: string;
  departmentEn: string;
  departmentAr: string;
  attendeesCount: number;
  durationMinutes: number;
  frequencyEn: string;
  frequencyAr: string;
  redundancyScore: number;
  annualPersonHours: number;
  statusTypeEn: 'Status Update' | 'Repeated Discussion' | 'Oversized Attendance' | 'Decision Ready' | 'Optimized';
  statusTypeAr: 'تحديث حالة' | 'نقاش متكرر' | 'حضور مبالغ فيه' | 'جاهز للقرار' | 'تم التحسين';
  previousMentions: number;
  summaryEn: string;
  summaryAr: string;
  suggestedActionEn: string;
  suggestedActionAr: string;
  detectedIssuesEn?: string[];
  detectedIssuesAr?: string[];
  attendeeBreakdown?: {
    coreDeciders: number;
    passiveListeners: number;
  };
  recommendations?: MeetingRecommendation[];
  appliedDecisionEn?: string;
  appliedDecisionAr?: string;
  appliedReductionPct?: number;
  decisionPack?: {
    topicEn: string;
    topicAr: string;
    historicalContextEn: string[];
    historicalContextAr: string[];
    linkedArtifacts: string[];
    pendingDecisionsEn: string[];
    pendingDecisionsAr: string[];
    recommendedApproverEn: string;
    recommendedApproverAr: string;
  };
}

export interface KnowledgeGapItem {
  id: string;
  topicEn: string;
  topicAr: string;
  sourceApp: 'Jira' | 'Confluence' | 'SharePoint' | 'Teams' | 'Outlook';
  repeatedQuestionsCount: number;
  signals: string[];
  smeDependency: 'High' | 'Medium' | 'Low';
  recommendedActionEn: string;
  recommendedActionAr: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
}

export interface EarlyWarningItem {
  id: string;
  titleEn: string;
  titleAr: string;
  signals: string[]; // e.g. ['↑ Ticket Volume', '↑ Resolution Time', '↑ Reassignments']
  confidence: number;
  firstDetected: string;
  status: 'Investigating' | 'Monitoring' | 'Mitigated';
  impact: 'High' | 'Medium' | 'Low';
  affectedService: string;
  aiExplanationEn: string;
  aiExplanationAr: string;
}

export interface DemoIdea {
  id: string;
  number: number;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  badgeAr: string;
  badgeEn: string;
  icon: string;
  gradient: string;
  borderGlow: string;
  accentColor: string;
  executiveValueAr: string;
  executiveValueEn: string;
  roiEstimateAr: string;
  roiEstimateEn: string;
  implementationTimeAr: string;
  implementationTimeEn: string;
  talkingPointsAr: string[];
  talkingPointsEn: string[];
  keyMetrics: {
    labelAr: string;
    labelEn: string;
    value: string;
    trend: string;
    isPositive: boolean;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  textAr: string;
  textEn: string;
  timestamp: string;
  sources?: string[];
  confidence?: number;
}

