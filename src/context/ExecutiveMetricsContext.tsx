import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

export interface AppliedMeetingDecision {
  meetingId: string;
  recId: string;
  labelEn: string;
  labelAr: string;
  reductionPct: number;
  hoursSaved: number;
  kwdSaved: number;
  usdSaved: number;
}

export interface ResolvedKnowledgeGap {
  gapId: string;
  titleEn: string;
  titleAr: string;
  hoursSaved: number;
  kwdSaved: number;
  usdSaved: number;
}

export interface MitigatedWarningItem {
  warningId: string;
  titleEn: string;
  titleAr: string;
  category: string;
  downtimeMinutesSaved: number;
  kwdProtected: number;
  usdProtected: number;
  hoursSaved: number;
}

interface ExecutiveMetricsContextType {
  // Stored active decisions across the 3 apps
  appliedMeetingDecisions: Record<string, AppliedMeetingDecision>;
  resolvedKnowledgeGaps: Record<string, ResolvedKnowledgeGap>;
  mitigatedWarnings: Record<string, MitigatedWarningItem>;

  // Action dispatches
  applyMeetingDecision: (meetingId: string, decision: AppliedMeetingDecision) => void;
  removeMeetingDecision: (meetingId: string) => void;

  resolveKnowledgeGap: (gapId: string, item: ResolvedKnowledgeGap) => void;
  unresolveKnowledgeGap: (gapId: string) => void;

  applyWarningMitigation: (warningId: string, item: MitigatedWarningItem) => void;
  removeWarningMitigation: (warningId: string) => void;

  resetAllDecisions: () => void;

  // Live Aggregated High-Impact Metrics
  baselineHours: number;
  baselineUsd: number;
  baselineKwd: number;

  liveAdditionalHours: number;
  liveAdditionalUsd: number;
  liveAdditionalKwd: number;

  totalHoursSaved: number;
  totalUsdSaved: number;
  totalKwdSaved: number;

  activeDecisionsCount: number;
  lastUpdatedTimestamp: number;
}

const BASELINE_HOURS = 31260;
const BASELINE_USD = 1490000;
const BASELINE_KWD = 458000;

const ExecutiveMetricsContext = createContext<ExecutiveMetricsContextType | null>(null);

export const ExecutiveMetricsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from localStorage or initialize empty
  const [appliedMeetingDecisions, setAppliedMeetingDecisions] = useState<Record<string, AppliedMeetingDecision>>(() => {
    try {
      const saved = localStorage.getItem('boubyan_applied_meetings_v2');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [resolvedKnowledgeGaps, setResolvedKnowledgeGaps] = useState<Record<string, ResolvedKnowledgeGap>>(() => {
    try {
      const saved = localStorage.getItem('boubyan_resolved_gaps_v2');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [mitigatedWarnings, setMitigatedWarnings] = useState<Record<string, MitigatedWarningItem>>(() => {
    try {
      const saved = localStorage.getItem('boubyan_mitigated_warnings_v2');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [lastUpdatedTimestamp, setLastUpdatedTimestamp] = useState<number>(Date.now());

  // Auto-persist changes
  useEffect(() => {
    localStorage.setItem('boubyan_applied_meetings_v2', JSON.stringify(appliedMeetingDecisions));
    setLastUpdatedTimestamp(Date.now());
  }, [appliedMeetingDecisions]);

  useEffect(() => {
    localStorage.setItem('boubyan_resolved_gaps_v2', JSON.stringify(resolvedKnowledgeGaps));
    setLastUpdatedTimestamp(Date.now());
  }, [resolvedKnowledgeGaps]);

  useEffect(() => {
    localStorage.setItem('boubyan_mitigated_warnings_v2', JSON.stringify(mitigatedWarnings));
    setLastUpdatedTimestamp(Date.now());
  }, [mitigatedWarnings]);

  // Handlers for App 1: Meetings
  const applyMeetingDecision = (meetingId: string, decision: AppliedMeetingDecision) => {
    setAppliedMeetingDecisions(prev => ({
      ...prev,
      [meetingId]: decision
    }));
  };

  const removeMeetingDecision = (meetingId: string) => {
    setAppliedMeetingDecisions(prev => {
      const next = { ...prev };
      delete next[meetingId];
      return next;
    });
  };

  // Handlers for App 2: Knowledge Gaps
  const resolveKnowledgeGap = (gapId: string, item: ResolvedKnowledgeGap) => {
    setResolvedKnowledgeGaps(prev => ({
      ...prev,
      [gapId]: item
    }));
  };

  const unresolveKnowledgeGap = (gapId: string) => {
    setResolvedKnowledgeGaps(prev => {
      const next = { ...prev };
      delete next[gapId];
      return next;
    });
  };

  // Handlers for App 3: Early Warning Risk Shield
  const applyWarningMitigation = (warningId: string, item: MitigatedWarningItem) => {
    setMitigatedWarnings(prev => ({
      ...prev,
      [warningId]: item
    }));
  };

  const removeWarningMitigation = (warningId: string) => {
    setMitigatedWarnings(prev => {
      const next = { ...prev };
      delete next[warningId];
      return next;
    });
  };

  const resetAllDecisions = () => {
    setAppliedMeetingDecisions({});
    setResolvedKnowledgeGaps({});
    setMitigatedWarnings({});
  };

  // Computations
  const liveAdditionalHours = useMemo(() => {
    const meetHours = (Object.values(appliedMeetingDecisions) as AppliedMeetingDecision[]).reduce((acc, curr) => acc + (curr?.hoursSaved || 0), 0);
    const gapHours = (Object.values(resolvedKnowledgeGaps) as ResolvedKnowledgeGap[]).reduce((acc, curr) => acc + (curr?.hoursSaved || 0), 0);
    const warnHours = (Object.values(mitigatedWarnings) as MitigatedWarningItem[]).reduce((acc, curr) => acc + (curr?.hoursSaved || 0), 0);
    return Math.round(meetHours + gapHours + warnHours);
  }, [appliedMeetingDecisions, resolvedKnowledgeGaps, mitigatedWarnings]);

  const liveAdditionalKwd = useMemo(() => {
    const meetKwd = (Object.values(appliedMeetingDecisions) as AppliedMeetingDecision[]).reduce((acc, curr) => acc + (curr?.kwdSaved || 0), 0);
    const gapKwd = (Object.values(resolvedKnowledgeGaps) as ResolvedKnowledgeGap[]).reduce((acc, curr) => acc + (curr?.kwdSaved || 0), 0);
    const warnKwd = (Object.values(mitigatedWarnings) as MitigatedWarningItem[]).reduce((acc, curr) => acc + (curr?.kwdProtected || 0), 0);
    return Math.round(meetKwd + gapKwd + warnKwd);
  }, [appliedMeetingDecisions, resolvedKnowledgeGaps, mitigatedWarnings]);

  const liveAdditionalUsd = useMemo(() => {
    const meetUsd = (Object.values(appliedMeetingDecisions) as AppliedMeetingDecision[]).reduce((acc, curr) => acc + (curr?.usdSaved || 0), 0);
    const gapUsd = (Object.values(resolvedKnowledgeGaps) as ResolvedKnowledgeGap[]).reduce((acc, curr) => acc + (curr?.usdSaved || 0), 0);
    const warnUsd = (Object.values(mitigatedWarnings) as MitigatedWarningItem[]).reduce((acc, curr) => acc + (curr?.usdProtected || 0), 0);
    return Math.round(meetUsd + gapUsd + warnUsd);
  }, [appliedMeetingDecisions, resolvedKnowledgeGaps, mitigatedWarnings]);

  const totalHoursSaved = BASELINE_HOURS + liveAdditionalHours;
  const totalUsdSaved = BASELINE_USD + liveAdditionalUsd;
  const totalKwdSaved = BASELINE_KWD + liveAdditionalKwd;

  const activeDecisionsCount = 
    Object.keys(appliedMeetingDecisions).length + 
    Object.keys(resolvedKnowledgeGaps).length + 
    Object.keys(mitigatedWarnings).length;

  return (
    <ExecutiveMetricsContext.Provider
      value={{
        appliedMeetingDecisions,
        resolvedKnowledgeGaps,
        mitigatedWarnings,
        applyMeetingDecision,
        removeMeetingDecision,
        resolveKnowledgeGap,
        unresolveKnowledgeGap,
        applyWarningMitigation,
        removeWarningMitigation,
        resetAllDecisions,
        baselineHours: BASELINE_HOURS,
        baselineUsd: BASELINE_USD,
        baselineKwd: BASELINE_KWD,
        liveAdditionalHours,
        liveAdditionalUsd,
        liveAdditionalKwd,
        totalHoursSaved,
        totalUsdSaved,
        totalKwdSaved,
        activeDecisionsCount,
        lastUpdatedTimestamp
      }}
    >
      {children}
    </ExecutiveMetricsContext.Provider>
  );
};

export const useExecutiveMetrics = () => {
  const context = useContext(ExecutiveMetricsContext);
  if (!context) {
    throw new Error('useExecutiveMetrics must be used within an ExecutiveMetricsProvider');
  }
  return context;
};
