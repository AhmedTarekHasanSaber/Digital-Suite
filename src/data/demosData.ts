import { DemoIdea, MeetingItem, KnowledgeGapItem, EarlyWarningItem } from '../types';

export const BOUBYAN_MEETING_ITEMS: MeetingItem[] = [
  {
    id: 'meet-01',
    titleEn: 'Weekly Digital Banking Status Sync',
    titleAr: 'مزامنة حالة الخدمات المصرفية الرقمية الأسبوعية',
    organizerEn: 'Head of Digital Channels',
    organizerAr: 'رئيس القنوات الرقمية',
    departmentEn: 'Boubyan Digital Banking',
    departmentAr: 'الخدمات المصرفية الرقمية - بنك بوبيان',
    attendeesCount: 14,
    durationMinutes: 60,
    frequencyEn: 'Weekly',
    frequencyAr: 'أسبوعياً',
    redundancyScore: 92,
    annualPersonHours: 728,
    statusTypeEn: 'Status Update',
    statusTypeAr: 'تحديث حالة',
    previousMentions: 12,
    detectedIssuesEn: [
      'High Passenger Rate: 11 of 14 attendees are silent listeners with zero speaking time.',
      'Information Duplication: 85% of presented metrics exist in Confluence/Jira dashboards.',
      'Chronic Late Decision: Delayed 3 consecutive delivery releases due to presentation overhead.'
    ],
    detectedIssuesAr: [
      'حضور سلبي مرتفع: 11 من أصل 14 مشاركاً مستمعون فقط بدون أي مشاركة.',
      'تكرار معلوماتي: 85% من البيانات المعروضة متوفرة مسبقاً في لوحات Jira و Confluence.',
      'تأخر في اتخاذ القرار: تأجيل مستمر لـ 3 دورات إطلاق متتالية بسبب وقت العرض.'
    ],
    attendeeBreakdown: {
      coreDeciders: 3,
      passiveListeners: 11
    },
    summaryEn: 'Identified as a routine status update where 85% of metrics are already available on Confluence/Jira dashboards. Discussion repeated across 3 sub-squads.',
    summaryAr: 'تم تصنيفها كتحديث روتيني حيث أن 85% من المؤشرات متاحة بالفعل على لوحات المؤشرات. النقاش متكرر عبر 3 فرق عمل فرعية.',
    suggestedActionEn: 'Convert to Asynchronous Slack Digest & Jira Dashboard. Saves ~650 hours/year.',
    suggestedActionAr: 'تحويل الاجتماع إلى ملخص تفاعلي عبر Slack ولوحة Jira. يوفر ~650 ساعة سنوياً.',
    recommendations: [
      {
        id: 'rec-01-async',
        labelEn: 'Convert to Async Decision Digest',
        labelAr: 'تحويل إلى ملخص قرارات غير متزامن',
        tagEn: 'Maximum Savings',
        tagAr: 'أقصى وفر في الوقت',
        reductionPct: 75,
        iconType: 'async',
        descriptionEn: 'Replace live 60-min meeting with automated Slack/Teams AI digest. Syncs directly to Jira Epic #DB-4091.',
        descriptionAr: 'استبدال الاجتماع بملخص ذكي غير متزامن على Slack/Teams مع ربطه بمهمة Jira #DB-4091.'
      },
      {
        id: 'rec-01-quorum',
        labelEn: 'Smart Quorum (Trim 11 Silent Observers)',
        labelAr: 'تطبيق النصاب الذكي (تقليص 11 مستمع)',
        tagEn: 'Lean Governance',
        tagAr: 'حوكمة رشيقة',
        reductionPct: 60,
        iconType: 'quorum',
        descriptionEn: 'Trim invitees to 3 core decision-makers. Auto-dispatch AI executive minutes to the other 11 members.',
        descriptionAr: 'قصر الحضور على صناع القرار الـ 3 الأساسيين، وإرسال محضر تنفيذي ذكي فوري للمستمعين الـ 11.'
      },
      {
        id: 'rec-01-compress',
        labelEn: 'Compress to 15m Fast-Track with AI Pre-Read',
        labelAr: 'تقليص إلى 15 دقيقة مع موجز مسبق',
        tagEn: 'Speed Execution',
        tagAr: 'تنفيذ سريع',
        reductionPct: 65,
        iconType: 'compress',
        descriptionEn: 'AI generates a 1-page pre-read distributed 24 hours prior. Meeting strictly limited to sign-offs.',
        descriptionAr: 'توليد موجز تنفيذي في صفحة واحدة قبل 24 ساعة، وحصر الاجتماع في الاعتماد والتوقيع فقط.'
      },
      {
        id: 'rec-01-merge',
        labelEn: 'Merge into Bi-Weekly Sprint Review',
        labelAr: 'دمج مع مراجعة السبرنت نصف الشهرية',
        tagEn: 'Silo Removal',
        tagAr: 'إلغاء الازدواجية',
        reductionPct: 50,
        iconType: 'merge',
        descriptionEn: 'Eliminate standalone channel sync by rolling it into the broader Digital Transformation Review.',
        descriptionAr: 'إلغاء الاجتماع المنفصل وضمه إلى مراجعة التحول الرقمي نصف الشهرية لمنع التشتت.'
      },
      {
        id: 'rec-01-approve',
        labelEn: 'Executive Instant Sign-Off (Auto-Push to Jira)',
        labelAr: 'اعتماد تنفيذي فوري وترحيل لـ Jira',
        tagEn: 'Zero Latency',
        tagAr: 'بدون اجتماع إطلاقاً',
        reductionPct: 85,
        iconType: 'approve',
        descriptionEn: 'Directly sign off on the 2 pending UI funnel decisions without convening any meeting.',
        descriptionAr: 'اعتماد القرارين المعلقين فورياً وإنشاء مهام التنفيذ في Jira بدون عقد أي اجتماع.'
      }
    ],
    decisionPack: {
      topicEn: 'Q3 Digital Onboarding Funnel Optimization',
      topicAr: 'تحسين مسار التسجيل الرقمي للعملاء للربع الثالث',
      historicalContextEn: [
        'Discussed 3 times previously in June and July.',
        'Jira Epic #DB-4091: EKYC biometric latency dropped by 240ms.',
        'Confluence doc "Onboarding_SLA_v2.pdf" defines the current bottleneck.'
      ],
      historicalContextAr: [
        'تمت مناقشتها 3 مرات سابقة في يونيو ويوليو.',
        'مهمة Jira رقم #DB-4091: انخفض زمن الاستجابة الحيوية لـ EKYC بمقدار 240 مللي ثانية.',
        'مستند Confluence يحدد الاختناق الحالي بدقة.'
      ],
      linkedArtifacts: ['Confluence: Onboarding_SLA_v2', 'Jira Epic #DB-4091', 'Q3_Conversion_Report.xlsx'],
      pendingDecisionsEn: [
        'Approve budget allocation for third-party OCR fallback ($12k).',
        'Sign off on UI step reduction from 7 to 4 screens.'
      ],
      pendingDecisionsAr: [
        'اعتماد ميزانية نظام OCR الاحتياطي (12 ألف دولار).',
        'الموافقة على تقليص خطوات واجهة المستخدم من 7 إلى 4 شاشات.'
      ],
      recommendedApproverEn: 'Chief Digital Officer (CDO)',
      recommendedApproverAr: 'رئيس قطاع الخدمات الرقمية (CDO)'
    }
  },
  {
    id: 'meet-02',
    titleEn: 'Core Banking API Gateway Sync',
    titleAr: 'مزامنة بوابة واجهات برمجة التطبيقات المصرفية الأساسية',
    organizerEn: 'Enterprise Architecture Lead',
    organizerAr: 'قائد الهندسة المؤسسية',
    departmentEn: 'Boubyan IT & Core Systems',
    departmentAr: 'تقنية المعلومات والأنظمة الأساسية - بنك بوبيان',
    attendeesCount: 9,
    durationMinutes: 90,
    frequencyEn: 'Bi-Weekly',
    frequencyAr: 'كل أسبوعين',
    redundancyScore: 78,
    annualPersonHours: 468,
    statusTypeEn: 'Repeated Discussion',
    statusTypeAr: 'نقاش متكرر',
    previousMentions: 5,
    detectedIssuesEn: [
      'Architectural Gridlock: Debate over OAuth token TTL repeated in 3 separate forums.',
      'Unstructured Pre-Work: Architecture Decision Records (ADRs) not drafted prior to meeting.',
      'Lengthy Duration: 90-minute session leads to diminishing return on technical consensus.'
    ],
    detectedIssuesAr: [
      'جمود معماري: تكرار الجدل حول سياسة الرموز الأمنية في 3 لجان معمارية سابقة.',
      'غياب الوثائق المسبقة: عدم صياغة سجل القرارات المعمارية (ADR) قبل الاجتماع.',
      'طول الجلسة: مدة 90 دقيقة تسبب تشتتاً وانخفاضاً في كفاءة التوافق التقني.'
    ],
    attendeeBreakdown: {
      coreDeciders: 2,
      passiveListeners: 7
    },
    summaryEn: 'Topics regarding OAuth2 token expiry policy and rate limiting were debated in 3 separate architectural boards without final sign-off.',
    summaryAr: 'تم نقاش سياسات انتهاء صلاحية رموز OAuth2 وتحديد معدلات الاستدعاء في 3 مجالس معمارية منفصلة بدون اعتماد نهائي.',
    suggestedActionEn: 'Generate Decision-Ready Pack for Chief Technology Officer (CTO) sign-off.',
    suggestedActionAr: 'إصدار حزمة اتخاذ القرار الجاهزة لاعتماد مدير التكنولوجيا (CTO).',
    recommendations: [
      {
        id: 'rec-02-approve',
        labelEn: 'Auto-Issue Architecture Decision Record (ADR)',
        labelAr: 'إصدار سجل القرار المعماري (ADR) فورياً',
        tagEn: 'Immediate Resolution',
        tagAr: 'حسم فوري',
        reductionPct: 80,
        iconType: 'approve',
        descriptionEn: 'Publish standardized ADR with 15m mobile TTL policy; auto-close meeting and notify API team.',
        descriptionAr: 'نشر وثيقة المعمارية المعتمدة بصلاحية 15 دقيقة وإغلاق الاجتماع مع إشعار فريق الواجهات.'
      },
      {
        id: 'rec-02-async',
        labelEn: '48-Hour Async Technical Sign-Off Poll',
        labelAr: 'تصويت تقني غير متزامن لمدة 48 ساعة',
        tagEn: 'Async Consensus',
        tagAr: 'توافق غير متزامن',
        reductionPct: 70,
        iconType: 'async',
        descriptionEn: 'Collect security and backend lead sign-offs asynchronously in Confluence.',
        descriptionAr: 'جمع موافقات قادة الأمان والواجهة الخلفية عبر Confluence بدون عقد اجتماع.'
      },
      {
        id: 'rec-02-compress',
        labelEn: 'Compress to 20m Architecture Sign-Off',
        labelAr: 'تقليص إلى 20 دقيقة مخصصة للاعتماد',
        tagEn: 'Focused Scope',
        tagAr: 'نطاق محدد',
        reductionPct: 60,
        iconType: 'compress',
        descriptionEn: 'Focus strictly on approving the token TTL threshold with CTO present.',
        descriptionAr: 'قصر الاجتماع على اعتماد مدة الصلاحية بحضور مدير التكنولوجيا فقط.'
      },
      {
        id: 'rec-02-quorum',
        labelEn: 'Trim to Security & Backend Leads Only',
        labelAr: 'حصر الحضور على قادة الأمان والتطوير فقط',
        tagEn: 'Quorum',
        tagAr: 'نصاب محدد',
        reductionPct: 55,
        iconType: 'quorum',
        descriptionEn: 'Release 7 infrastructure engineers from attendance; send them Confluence specs.',
        descriptionAr: 'إعفاء 7 مهندسين من الحضور وإرسال المواصفات النهائية لهم عبر Confluence.'
      }
    ],
    decisionPack: {
      topicEn: 'OAuth2 Rate Limiting & Token Lifecycle Policy',
      topicAr: 'سياسة تحديد معدل طلبات OAuth2 ودورة حياة الرموز',
      historicalContextEn: [
        'Security audit flagged 15-minute token TTL as optimal for mobile banking.',
        'Backend team requested 60-minute TTL to reduce gateway load.'
      ],
      historicalContextAr: [
        'أشار تدقيق الأمان إلى أن صلاحية 15 دقيقة هي المثلى للخدمات المصرفية عبر الجوال.',
        'طلب فريق الواجهة الخلفية رفعها إلى 60 دقيقة لتقليل الحمل على البوابة.'
      ],
      linkedArtifacts: ['Architecture_Decision_Record_041.md', 'Security_Token_Spec_v3.pdf'],
      pendingDecisionsEn: [
        'Finalize token TTL between 15m vs 30m for retail banking APIs.'
      ],
      pendingDecisionsAr: [
        'حسم مدة صلاحية الرمز بين 15 دقيقة أو 30 دقيقة لواجهات التجزئة المصرفية.'
      ],
      recommendedApproverEn: 'Chief Technology Officer (CTO)',
      recommendedApproverAr: 'مدير التكنولوجيا التنفيذي (CTO)'
    }
  },
  {
    id: 'meet-03',
    titleEn: 'Islamic Credit Card Rewards Q4 Alignment',
    titleAr: 'مواءمة مكافآت بطاقات الائتمان الإسلامية للربع الرابع',
    organizerEn: 'Retail Products Manager',
    organizerAr: 'مدير منتجات التجزئة',
    departmentEn: 'Boubyan Retail Banking',
    departmentAr: 'التجزئة المصرفية - بنك بوبيان',
    attendeesCount: 18,
    durationMinutes: 60,
    frequencyEn: 'Weekly',
    frequencyAr: 'أسبوعياً',
    redundancyScore: 84,
    annualPersonHours: 936,
    statusTypeEn: 'Oversized Attendance',
    statusTypeAr: 'حضور مبالغ فيه',
    previousMentions: 8,
    detectedIssuesEn: [
      'Massive Attendee Bloat: 18 attendees present while only 3 hold budget/compliance authority.',
      'Passive Audience Waste: 15 participants are junior analysts invited as "courtesy".',
      'Recurring Category Debates: Winter travel cashback debated 4 weeks in a row.'
    ],
    detectedIssuesAr: [
      'تضخم هائل في الحضور: 18 مشاركاً بينما يملك 3 فقط صلاحية الميزانية والامتثال.',
      'هدر وقت المحللين: 15 محللاً يحضرون بدافع "العلم بالشيء" دون دور تنفيذي.',
      'تكرار نقاش الفئات: إعادة نقاش فئات استرداد السفر لـ 4 أسابيع متتالية.'
    ],
    attendeeBreakdown: {
      coreDeciders: 3,
      passiveListeners: 15
    },
    summaryEn: '18 participants attending while only 3 stakeholders (Marketing, Risk, Compliance) hold decision authority. 15 attendees are observers.',
    summaryAr: 'حضور 18 مشاركاً بينما يمتلك 3 أطراف فقط (التسويق، المخاطر، الالتزام) صلاحية القرار. 15 مشاركاً بصفة مراقب.',
    suggestedActionEn: 'Reduce attendee list to Core 3 decision-makers. Convert to 15-min async approval.',
    suggestedActionAr: 'تقليص الحضور إلى صناع القرار الثلاثة الأساسيين. تحويله لموافقة غير同期 مدتها 15 دقيقة.',
    recommendations: [
      {
        id: 'rec-03-quorum',
        labelEn: 'Smart Quorum (Release 15 Observers)',
        labelAr: 'تطبيق النصاب الذكي (إعفاء 15 مراقباً)',
        tagEn: 'High Impact',
        tagAr: 'أثر مالي كبير',
        reductionPct: 80,
        iconType: 'quorum',
        descriptionEn: 'Restructure to a 3-person executive committee (Retail, Risk, Sharia Compliance); save 750 hrs/yr.',
        descriptionAr: 'قصر اللجنة على 3 أعضاء (التجزئة، المخاطر، والرقابة الشرعية) وتوفير 750 ساعة سنوياً.'
      },
      {
        id: 'rec-03-approve',
        labelEn: 'Instant Sign-Off on 2.25% Winter Tier',
        labelAr: 'اعتماد فوري لشريحة الـ 2.25% للشتاء',
        tagEn: 'Instant Action',
        tagAr: 'قرار فوري',
        reductionPct: 85,
        iconType: 'approve',
        descriptionEn: 'Execute financial sign-off backed by pre-cleared Risk memo #882.',
        descriptionAr: 'اعتماد الشريحة الترويجية فورياً استناداً لمذكرة إدارة المخاطر رقم #882 المعتمدة مسبقاً.'
      },
      {
        id: 'rec-03-async',
        labelEn: 'Convert to Digital Product Canvas & Slack Sign-Off',
        labelAr: 'تحويل لبطاقة منتج رقمية واعتماد Slack',
        tagEn: 'Async',
        tagAr: 'غير متزامن',
        reductionPct: 75,
        iconType: 'async',
        descriptionEn: 'Publish structured business canvas; collect digital approvals in under 2 hours.',
        descriptionAr: 'نشر بطاقة عمل رقمية وجمع الموافقات في أقل من ساعتين عبر القنوات الرقمية.'
      }
    ],
    decisionPack: {
      topicEn: 'Q4 Cashback Tiers for Titanium & Infinite Cards',
      topicAr: 'شرائح استرداد النقد للربع الرابع لبطاقات تيتانيوم وإنفينيت',
      historicalContextEn: [
        'Competitor launched 2.5% cashback tier; Boubyan currently at 2.0%.',
        'Risk assessment confirms financial headroom up to 2.3% without margin erosion.'
      ],
      historicalContextAr: [
        'أطلق المنافس شريحة استرداد نقد بنسبة 2.5%؛ وبوبيان حالياً عند 2.0%.',
        'تقييم المخاطر يؤكد وجود هامش مالي حتى 2.3% بدون تآكل الهامش.'
      ],
      linkedArtifacts: ['Q4_Card_Spending_Forecast.xlsx', 'Risk_Approval_Memo_882.pdf'],
      pendingDecisionsEn: [
        'Approve 2.25% promotional tier for travel categories during winter season.'
      ],
      pendingDecisionsAr: [
        'اعتماد نسبة 2.25% الترويجية لفئات السفر خلال موسم الشتاء.'
      ],
      recommendedApproverEn: 'Head of Retail Banking',
      recommendedApproverAr: 'رئيس الخدمات المصرفية للأفراد'
    }
  },
  {
    id: 'meet-04',
    titleEn: 'Corporate Mobile App UX Review Sync',
    titleAr: 'مزامنة مراجعة تجربة مستخدم تطبيق الشركات',
    organizerEn: 'Senior UX Lead',
    organizerAr: 'قائد تجربة المستخدم',
    departmentEn: 'Boubyan Corporate Digital',
    departmentAr: 'القنوات الرقمية للشركات - بنك بوبيان',
    attendeesCount: 12,
    durationMinutes: 45,
    frequencyEn: 'Bi-Weekly',
    frequencyAr: 'كل أسبوعين',
    redundancyScore: 65,
    annualPersonHours: 324,
    statusTypeEn: 'Decision Ready',
    statusTypeAr: 'جاهز للقرار',
    previousMentions: 3,
    detectedIssuesEn: [
      'Iterative Feedback Latency: Feedback collected across 4 email threads rather than in Figma.',
      'Missing Multi-Signatory Clearances: Legal review pending while technical UI is ready.'
    ],
    detectedIssuesAr: [
      'بطء جمع الملاحظات: تشتت الملاحظات عبر 4 سلاسل بريد إلكتروني بدلاً من Figma.',
      'انتظار المراجعة القانونية: التصميم التقني جاهز بينما الاعتماد القانوني معلق.'
    ],
    attendeeBreakdown: {
      coreDeciders: 3,
      passiveListeners: 9
    },
    summaryEn: 'AI has synthesized all wireframe iterations, customer feedback from corporate clients, and compliance constraints into a single Decision-Ready Pack.',
    summaryAr: 'قام الذكاء الاصطناعي بدمج جميع نماذج التصميم، وملاحظات عملاء الشركات، وقيود الالتزام في حزمة قرار جاهزة.',
    suggestedActionEn: 'Review Decision-Ready Pack and click Approve to skip meeting.',
    suggestedActionAr: 'مراجعة حزمة القرار المباشر والنقر على اعتماد لتخطي الاجتماع.',
    recommendations: [
      {
        id: 'rec-04-approve',
        labelEn: 'Approve Biometric Flow for Corporate Treasury',
        labelAr: 'اعتماد التدفق البيومتري لمديري الخزينة',
        tagEn: 'Immediate Approval',
        tagAr: 'اعتماد فوري',
        reductionPct: 85,
        iconType: 'approve',
        descriptionEn: 'Click to formally approve the 2-step biometric flow and trigger immediate Sprint release in Jira.',
        descriptionAr: 'اعتماد التدفق الحيوي فورياً وإطلاق مهمة التنفيذ في سبرنت التطوير الحالي.'
      },
      {
        id: 'rec-04-async',
        labelEn: 'Asynchronous Figma Video Walkthrough',
        labelAr: 'فيديو توضيحي تفاعلي عبر Figma و Slack',
        tagEn: 'Async UX',
        tagAr: 'تجربة غير متزامنة',
        reductionPct: 70,
        iconType: 'async',
        descriptionEn: 'Distribute a 3-minute Loom walkthrough for async stakeholder sign-off.',
        descriptionAr: 'مشاركة تسجيل توضيحي مدته 3 دقائق لجمع الموافقات الرقمية دون اجتماع.'
      }
    ],
    decisionPack: {
      topicEn: 'Multi-Signatory Batch Transfer UI Workflow',
      topicAr: 'سحب واجهة التحويلات المجمعة متعددة المفوضين',
      historicalContextEn: [
        'Corporate clients requested biometric approval for batch transfers up to 50k KWD.',
        'Compliance requires dual-factor verification token for batches over 10k KWD.'
      ],
      historicalContextAr: [
        'طلب عملاء الشركات الاعتماد الحيوي للتحويلات المجمعة حتى 50 ألف دينار.',
        'يتطلب الالتزام رمز تحقق ثنائي للتحويلات التي تتجاوز 10 آلاف دينار.'
      ],
      linkedArtifacts: ['Corp_UX_Wireframes_v4.fig', 'Compliance_Signoff_Letter.pdf'],
      pendingDecisionsEn: [
        'Approve 2-step biometric flow for corporate treasury managers.'
      ],
      pendingDecisionsAr: [
        'اعتماد تدفق المصادقة البيومترية من خطوتين لمديري الخزينة في الشركات.'
      ],
      recommendedApproverEn: 'Head of Corporate Banking',
      recommendedApproverAr: 'رئيس الخدمات المصرفية للشركات'
    }
  }
];

export const INITIAL_KNOWLEDGE_GAPS: KnowledgeGapItem[] = [
  {
    id: 'gap-01',
    topicEn: 'EKYC Biometric Verification & Camera Matching SLA',
    topicAr: 'التكامل مع البصمة البيومترية ومطابقة صور الهوية لـ EKYC',
    sourceApp: 'Confluence',
    repeatedQuestionsCount: 145,
    signals: ['Multiple fragmented docs', 'High SME interruption rate (14 calls/wk)', 'No single authoritative SOP'],
    smeDependency: 'High',
    recommendedActionEn: 'Publish authoritative Confluence SOP & assign Jira task to Digital Banking Squad',
    recommendedActionAr: 'نشر دليل SOP معتمد في Confluence وتكليف فريق القنوات الرقمية عبر Jira',
    priority: 'High',
    status: 'Open',
    teamEn: 'Digital Banking Core Squad',
    teamAr: 'فريق القنوات المصرفية الرقمية',
    expertNameEn: 'Ahmad Al-Ali (Lead Solutions Architect)',
    expertNameAr: 'أحمد العلي (كبير مهندسي الحلول)',
    assignedJiraTaskKey: 'DIG-4092',
    createdArticleTitleEn: 'SOP-8841: EKYC Face-Match & Liveness Detection Integration Runbook',
    createdArticleTitleAr: 'دليل SOP-8841: إجراءات التكامل مع منظومة مطابقة الوجه والتحقق الحيوي لـ EKYC',
    createdArticleSpace: 'Boubyan Engineering Wiki / Digital-Onboarding',
    articleContentSnippetEn: 'Authoritative SOP establishing a 15ms latency ceiling, automated bypass triggers on network degradations, and real-time telemetry monitoring.',
    articleContentSnippetAr: 'دليل تشغيلي معتمد يحدد سقف استجابة 15 مللي ثانية، ومسارات التخطي التلقائي عند تعثر الاتصال، ومؤشرات مراقبة جودة التسجيل.',
    impactEn: 'Saves 9.4h weekly for digital onboarding squad; cuts SME interruptions by 92%.',
    impactAr: 'يوفر 9.4 ساعة أسبوعياً لفريق التسجيل الرقمي ويقلص استفسارات الخبراء بنسبة 92%.'
  },
  {
    id: 'gap-02',
    topicEn: 'Kafka Message Replay & Event Streaming Recovery SOP',
    topicAr: 'إجراءات إعادة تشغيل رسائل Kafka ومعالجة تراكم الأحداث',
    sourceApp: 'Jira',
    repeatedQuestionsCount: 98,
    signals: ['Frequent private chat escalations', 'Conflicting replay scripts across squads', 'High incident triage overhead'],
    smeDependency: 'High',
    recommendedActionEn: 'Create Confluence Runbook & assign task to Payments & Integration Squad',
    recommendedActionAr: 'إنشاء دليل تشغيل في Confluence وتكليف فريق المدفوعات والربط المركزي',
    priority: 'High',
    status: 'Open',
    teamEn: 'Payments & Core Integration Squad',
    teamAr: 'فريق المدفوعات والربط المركزي',
    expertNameEn: 'Sara Al-Shammari (Principal Backend Engineer)',
    expertNameAr: 'سارة الشمري (كبير مهندسي النظم الخلفية)',
    assignedJiraTaskKey: 'PAY-1108',
    createdArticleTitleEn: 'RUNBOOK-104: Kafka Dead-Letter-Queue Replay & Zero-Loss Reconciliation',
    createdArticleTitleAr: 'دليل التشغيل 104: آلية إعادة معالجة طوابير Kafka وضمان عدم فقدان العمليات المالية',
    createdArticleSpace: 'Boubyan Core / Payment-Gateways',
    articleContentSnippetEn: 'Standard Operating Procedure outlining offset resetting, idempotent retry policies, and KNET gateway timeout safeguards.',
    articleContentSnippetAr: 'خطوات التشغيل القياسية لإعادة ضبط المؤشرات، وسياسات التكرار الآمن لمنع ازدواجية الخصم، وضوابط مهلة بوابة KNET.',
    impactEn: 'Saves 6.8h weekly across 3 squads; eliminates debugging confusion.',
    impactAr: 'يوفر 6.8 ساعة أسبوعياً عبر 3 فرق برمجية ويلغي ارتباك فحص أخطاء الرسائل.'
  },
  {
    id: 'gap-03',
    topicEn: 'Central Bank of Kuwait (CBK) Cloud Data Retention & Encryption Mandate',
    topicAr: 'ضوابط بنك الكويت المركزي لحفظ وتشفير البيانات السحابية',
    sourceApp: 'SharePoint',
    repeatedQuestionsCount: 112,
    signals: ['Outdated 2023 compliance notes', 'Ambiguity regarding 7-year audit logs', 'High regulatory audit friction'],
    smeDependency: 'High',
    recommendedActionEn: 'Publish Compliance Guideline in Confluence & assign task to Cyber Security Team',
    recommendedActionAr: 'نشر لائحة الامتثال في Confluence وتكليف فريق الأمن السيبراني والرقابة',
    priority: 'High',
    status: 'Open',
    teamEn: 'Security, Risk & Compliance Team',
    teamAr: 'فريق أمن المعلومات والامتثال الرقابي',
    expertNameEn: 'Faisal Al-Dousari (CISO Office Delegate)',
    expertNameAr: 'فيصل الدوسري (ممثل قطاع أمن المعلومات)',
    assignedJiraTaskKey: 'SEC-8820',
    createdArticleTitleEn: 'POLICY-2026: CBK Cloud Storage, HSM Encryption & 7-Year Audit Vault',
    createdArticleTitleAr: 'لائحة POLICY-2026: متطلبات التخزين السحابي وتشفير HSM وحفظ السجلات لـ 7 سنوات',
    createdArticleSpace: 'Boubyan Security / Regulatory-Compliance',
    articleContentSnippetEn: 'Mandatory checklist establishing on-premise key management, local datacenter data residency, and automated audit snapshot export.',
    articleContentSnippetAr: 'قائمة تحقق إلزامية لإدارة المفاتيح التشفيرية محلياً، وضمان استضافة البيانات داخل الكويت، وتصدير تقارير التدقيق آلياً.',
    impactEn: 'Saves 13.5h weekly; guarantees 100% adherence to regulatory audits.',
    impactAr: 'يوفر 13.5 ساعة أسبوعياً ويضمن الامتثال الكامل لمتطلبات التدقيق الرقابي.'
  },
  {
    id: 'gap-04',
    topicEn: 'Cross-Border Swift GPI Webhook Integration Specs',
    topicAr: 'مواصفات ربط إشعارات Swift GPI للتحويلات الدولية الفورية',
    sourceApp: 'Teams',
    repeatedQuestionsCount: 76,
    signals: ['Undocumented retry mechanisms', 'Repetitive partner inquiries', 'Missing API swagger specs'],
    smeDependency: 'Medium',
    recommendedActionEn: 'Generate Confluence API Documentation & assign task to Treasury Squad',
    recommendedActionAr: 'توليد توثيق الواجهات في Confluence وتكليف فريق الخزينة والتحويلات',
    priority: 'Medium',
    status: 'Open',
    teamEn: 'Treasury & International Transfers Squad',
    teamAr: 'فريق الخزينة والتحويلات الدولية',
    expertNameEn: 'Mariam Al-Kandari (Senior Integration Specialist)',
    expertNameAr: 'مريم الكندري (أخصائي تكامل أول)',
    assignedJiraTaskKey: 'TRX-5541',
    createdArticleTitleEn: 'API-SPEC-33: Swift GPI Real-Time Tracking & Callback Webhooks',
    createdArticleTitleAr: 'المواصفة API-33: تتبع تحويلات Swift GPI اللحظية واستقبال التنبيهات التلقائية',
    createdArticleSpace: 'Boubyan Treasury / Swift-API',
    articleContentSnippetEn: 'Standardized REST schema for real-time tracking of international remittances with automatic currency exchange rate locking.',
    articleContentSnippetAr: 'نموذج موحد لربط واجهات REST لتتبع الحوالات الخارجية لحظياً وتثبيت أسعار الصرف التلقائية.',
    impactEn: 'Saves 5.2h weekly; standardizes remittance retry specs across platforms.',
    impactAr: 'يوفر 5.2 ساعة أسبوعياً ويوحد مواصفات المعالجة عبر القنوات الرقمية.'
  }
];

export const INITIAL_EARLY_WARNINGS: EarlyWarningItem[] = [
  {
    id: 'warn-01',
    category: 'incident_risk',
    categoryBadgeEn: 'Potential Emerging Issue Detected',
    categoryBadgeAr: 'رصد مشكلة تشغيلية محتملة قيد التشكل',
    titleEn: 'Digital Onboarding Core Timeout & Verification Bounce Surge',
    titleAr: 'ارتفاع حاد في مهلة استجابة وتكرار ارتداد التحقق لتسجيل العملاء',
    affectedService: 'Boubyan Mobile App (iOS / Android) • Digital Onboarding Gateway',
    affectedSquadEn: 'Digital Banking Core Squad',
    affectedSquadAr: 'فريق القنوات المصرفية الرقمية',
    confidence: 94,
    firstDetected: '45 minutes ago',
    status: 'Investigating',
    severityLevel: 'Critical',
    whatChangedEn: 'Jira TT volume for biometric onboarding jumped +145% in the last 6 hours, while MTTR climbed from 18 mins to 74 mins.',
    whatChangedAr: 'ارتفع حجم تذاكر الدعم (TT Volume) للتسجيل البيومتري بنسبة +145% خلال آخر 6 ساعات، مع استطالة زمن المعالجة من 18 إلى 74 دقيقة.',
    signals: [
      '↑ TT Volume Spike (+145% in 6h)',
      '↑ Resolution Time Prolonged (18m → 74m)',
      '↑ Cross-Squad Reassignments (3.4 hops/ticket)',
      '↑ Repeated Failure Signatures on Face-Match SLA'
    ],
    signalsAr: [
      '↑ تضاعف حجم تذاكر المشاكل (+145% في 6 ساعات)',
      '↑ استطالة زمن المعالجة (من 18 إلى 74 دقيقة)',
      '↑ تكرار تنقل التذاكر بين الفرق (3.4 مرات/تذكرة)',
      '↑ تكرار نفس نمط الخطأ وتصاعد خطر تجاوز الـ SLA'
    ],
    historicalPatternEn: '98.2% pattern correlation with Q3-2025 Incident INC-8821 (Unindexed KYC cache table exhaustion prior to nationwide outage).',
    historicalPatternAr: 'تطابق بنسبة 98.2% مع حادثة الربع الثالث INC-8821 (استنفاد ذاكرة التخزين المؤقت لجداول KYC قبل تعطل الخدمة الشامل).',
    impactedSystemsEn: '~45,000 active prospective mobile bank customers; potential drop-off rate of 34% if unmitigated.',
    impactedSystemsAr: '~45,000 مستخدم جديد متوقع لتطبيق الموبايل؛ وخطر فقدان 34% من عمليات فتح الحسابات الجديدة.',
    recommendedActionEn: 'Recycle Redis cluster nodes, flush biometric session queue, and scale async verification workers by 4x.',
    recommendedActionAr: 'إعادة تشغيل خوادم Redis، وتفريغ طابور جلسات التحقق، ومضاعفة خوادم المعالجة غير المتزامنة 4 أضعاف.',
    leadTimeToImpactEn: '3.8 Days before widespread customer lockout',
    leadTimeToImpactAr: '3.8 أيام قبل الوصول لحالة تجميد الخدمة الشاملة',
    downtimeRiskMinutes: 240,
    costProtectedKWD: 48000,
    jiraSourceData: {
      ttVolumeChange: '+145%',
      resolutionTimeDelta: '+310%',
      reassignmentHops: '3.4 avg hops',
      slaRiskLevel: 'Critical (88% SLA at risk)'
    }
  },
  {
    id: 'warn-02',
    category: 'delivery_risk',
    categoryBadgeEn: 'Potential Delivery Slowdown Detected',
    categoryBadgeAr: 'رصد تباطؤ محتمل في وتيرة تسليم السبرنت',
    titleEn: 'Corporate Open Banking API Release - Dependency Deadlock & Rework Surge',
    titleAr: 'إصدار واجهات الصيرفة المفتوحة للشركات - انسداد في الاعتماديات وتزايد التعديلات',
    affectedService: 'Corporate Treasury Portal & Open Banking Gateway v3.2',
    affectedSquadEn: 'Corporate Payments & Open Banking Squad',
    affectedSquadAr: 'فريق مدفوعات الشركات والصيرفة المفتوحة',
    confidence: 91,
    firstDetected: '3 hours ago',
    status: 'Investigating',
    severityLevel: 'Critical',
    whatChangedEn: '3 interdependent Epics are blocked pending Enterprise Architecture Security Signoff; code churn / rework increased by +68%.',
    whatChangedAr: 'توقف 3 مبادرات رئيسية بانتظار اعتماد الأمان المعماري؛ مع ارتفاع معدل إعادة كتابة الكود (Rework) بنسبة +68%.',
    signals: [
      '↑ Overdue Cross-Team Dependencies (4 blocking links)',
      '↑ Rework Rate Climbing (+68% PR revisions)',
      '↑ Teams Waiting on Pending Architecture Decision',
      '↑ Sprint Velocity Deceleration (-42%)'
    ],
    signalsAr: [
      '↑ تعثر اعتماديات متبادلة متأخرة (4 روابط مانعة للتسليم)',
      '↑ ارتفاع معدل إعادة تعديل الكود (+68% تعديلات على PRs)',
      '↑ فرق التطوير بانتظار قرار معماري معلق لأكثر من 5 أيام',
      '↑ تباطؤ سرعة إنجاز السبرنت (-42% Sprint Velocity)'
    ],
    historicalPatternEn: 'Matches the Q4 2025 Mobile 4.0 Release Delay where unaddressed security reviews caused a 3-week sprint spillover.',
    historicalPatternAr: 'مطابق لتأخر إطلاق تطبيق الموبايل في الربع الرابع 2025 حين تسببت المراجعات المعلقة في تأخير المشروع 3 أسابيع.',
    impactedSystemsEn: 'Q1 Corporate Banking Go-Live Milestone; risk of delaying 8 enterprise client onboarding pipelines.',
    impactedSystemsAr: 'الموعد النهائي لإطلاق بوابة الشركات في الربع الأول؛ وخطر تأخير ربط 8 عملاء من كبرى الشركات.',
    recommendedActionEn: 'Trigger executive architectural sign-off fast-track and reassign 2 senior security engineers to review PR-4902.',
    recommendedActionAr: 'تفعيل مسار الاعتماد المعماري السريع وتكليف اثنين من كبار مهندسي الأمان بمراجعة PR-4902 فوراً.',
    leadTimeToImpactEn: '4.5 Days before full sprint spillover',
    leadTimeToImpactAr: '4.5 أيام قبل كسر الموعد النهائي للسبرنت',
    downtimeRiskMinutes: 480,
    costProtectedKWD: 96000,
    jiraSourceData: {
      ttVolumeChange: '+28%',
      resolutionTimeDelta: '+180%',
      reassignmentHops: '4.2 squad hops',
      slaRiskLevel: 'High Sprint Spillover Risk',
      overdueDependenciesCount: 4,
      reworkRateIncrease: '+68%'
    }
  },
  {
    id: 'warn-03',
    category: 'incident_risk',
    categoryBadgeEn: 'Potential Emerging Issue Detected',
    categoryBadgeAr: 'رصد مشكلة تشغيلية محتملة قيد التشكل',
    titleEn: 'KNET Nightly Settlement Queue & Dead-Letter Replay Latency Drift',
    titleAr: 'انحراف في زمن معالجة طابور مطابقة KNET واسترجاع العمليات المتعثرة',
    affectedService: 'Merchant Settlement & Payment Engine',
    affectedSquadEn: 'Core Payments Squad',
    affectedSquadAr: 'فريق المدفوعات المركزي',
    confidence: 88,
    firstDetected: '1 hour ago',
    status: 'Investigating',
    severityLevel: 'Warning',
    whatChangedEn: 'Database connection pool utilization exceeded 89% during settlement reconciliations with recurrent connection retry errors.',
    whatChangedAr: 'تجاوز استخدام منافذ قاعدة البيانات 89% أثناء تسوية العمليات مع ظهور أخطاء إعادة محاولة الاتصال المتكررة.',
    signals: [
      '↑ Database Connection Pool Saturation (89%)',
      '↑ Reopened Settlement Tickets from Finance (+40%)',
      '↑ Repeated Timeout Signatures on KNET Webhooks',
      '↑ Risk of CBK Settlement Window Miss'
    ],
    signalsAr: [
      '↑ تشبع منافذ اتصال قاعدة البيانات (89%)',
      '↑ إعادة فتح تذاكر التسوية من الإدارة المالية (+40%)',
      '↑ تكرار رسائل انتهاء المهلة على بوابات KNET',
      '↑ خطر تفويت النافذة الزمنية المحددة من بنك الكويت المركزي'
    ],
    historicalPatternEn: 'Resembles the 2024 Black Friday database lock contention on merchant balances table.',
    historicalPatternAr: 'يشبه واقعة حظر الجداول في نوفمبر 2024 أثناء ذروة تسويات المتاجر.',
    impactedSystemsEn: '3,200 merchant accounts; potential financial ledger discrepancy and CBK regulatory audit scrutiny.',
    impactedSystemsAr: '3,200 حساب تاجر؛ وخطر حدوث فروقات محاسبية وتنبيهات رقابية من البنك المركزي.',
    recommendedActionEn: 'Execute auto-remediation: recycle connection pool, throttle non-critical batch analytics, and unindex query buffers.',
    recommendedActionAr: 'تنفيذ المعالجة التلقائية: إعادة تدوير المنافذ، كبح الاستعلامات التحليلية غير العاجلة، وفصل طوابير المعالجة.',
    leadTimeToImpactEn: '2.6 Days before settlement window failure',
    leadTimeToImpactAr: '2.6 أيام قبل فوات نافذة التسوية المصرفية',
    downtimeRiskMinutes: 120,
    costProtectedKWD: 24500,
    jiraSourceData: {
      ttVolumeChange: '+85%',
      resolutionTimeDelta: '+140%',
      reassignmentHops: '2.8 avg hops',
      slaRiskLevel: 'Warning (65% SLA at risk)'
    }
  },
  {
    id: 'warn-04',
    category: 'delivery_risk',
    categoryBadgeEn: 'Potential Delivery Slowdown Detected',
    categoryBadgeAr: 'رصد تباطؤ محتمل في وتيرة تسليم السبرنت',
    titleEn: 'Wealth Management Mobile Microservices - Cross-Squad Testing Bottleneck',
    titleAr: 'الخدمات المصغرة لإدارة الثروات - اختناق في الاختبارات المتبادلة بين الفرق',
    affectedService: 'Boubyan Wealth App & Investment Core Engine',
    affectedSquadEn: 'Wealth Management Squad',
    affectedSquadAr: 'فريق إدارة الثروات والاستثمار',
    confidence: 82,
    firstDetected: '5 hours ago',
    status: 'Monitoring',
    severityLevel: 'Warning',
    whatChangedEn: 'QA test cycle duration increased from 1.5 days to 4.8 days due to mock environment instability; 12 defects ping-ponging.',
    whatChangedAr: 'استطالة دورة اختبارات الجودة من 1.5 إلى 4.8 أيام نتيجة عدم استقرار بيئة المحاكاة؛ مع تنقل 12 تذكرة خلل ذهاباً وإياباً.',
    signals: [
      '↑ QA Cycle Duration Prolonged (1.5d → 4.8d)',
      '↑ Ping-Pong Defect Reassignments (12 tickets bouncing)',
      '↑ Downstream Squad Idle Time on Staging',
      '↑ Projected Release Delay (+6 calendar days)'
    ],
    signalsAr: [
      '↑ استطالة زمن دورة الاختبار (من 1.5 إلى 4.8 أيام)',
      '↑ ارتداد تذاكر العيوب البرمجية بين المطورين وفاحصي الجودة (12 تذكرة)',
      '↑ توقف الفرق الفرعية بانتظار استقرار بيئة الـ Staging',
      '↑ توقع تأخر موعد الإطلاق النهائي (+6 أيام تقويمية)'
    ],
    historicalPatternEn: 'Matches the Q2 2025 Trading Hub integration backlog where environment drift delayed UAT sign-off.',
    historicalPatternAr: 'مطابق لتأخر منصة التداول في الربع الثاني 2025 حين تسبب تباين البيئات في تعطل اختبارات القبول (UAT).',
    impactedSystemsEn: 'High-Net-Worth VIP Portfolio Trading module launch.',
    impactedSystemsAr: 'إطلاق وحدة التداول المالي لكبار عملاء بنك بوبيان.',
    recommendedActionEn: 'Deploy containerized ephemeral test environments and reassign 1 test automation engineer to mock sandbox.',
    recommendedActionAr: 'نشر بيئات اختبار سحابية معزولة ومؤتمتة وتخصيص مهندس أتمتة لفصل بيانات المحاكاة.',
    leadTimeToImpactEn: '5.1 Days before launch milestone breach',
    leadTimeToImpactAr: '5.1 أيام قبل تجاوز موعد الإطلاق الرسمي',
    downtimeRiskMinutes: 180,
    costProtectedKWD: 32000,
    jiraSourceData: {
      ttVolumeChange: '+45%',
      resolutionTimeDelta: '+220%',
      reassignmentHops: '3.9 avg hops',
      slaRiskLevel: 'Moderate Delivery Friction',
      overdueDependenciesCount: 3,
      reworkRateIncrease: '+45%'
    }
  }
];

export const DEMO_IDEAS: DemoIdea[] = [
  {
    id: 'idea-1',
    number: 1,
    titleEn: 'AI Meeting Detox — Accelerating Decision Velocity',
    titleAr: 'ديتوكس الاجتماعات الذكي لتسريع سرعة اتخاذ القرار',
    subtitleEn: 'Eliminate Status Syncs • Generate Decision-Ready Packs • Boost Execution Speed',
    subtitleAr: 'إلغاء التحديثات المكررة • توليد حزم اتخاذ القرار الجاهزة • رفع سرعة الإنجاز',
    badgeEn: 'Executive Time & Speed',
    badgeAr: 'كفاءة الوقت وسرعة التنفيذ',
    icon: 'CalendarCheck',
    gradient: 'from-[#8B263E] to-[#0A1931]',
    borderGlow: 'hover:border-[#8B263E]',
    accentColor: '#8B263E',
    executiveValueEn: 'Transforms passive meeting hours into active engineering execution by replacing status syncs with AI-synthesized Decision-Ready Packs.',
    executiveValueAr: 'تحويل ساعات الاجتماعات المهدرة إلى وقت إنجاز وتنفيذ فعلي عبر استبدال التحديثات الروتينية بحزم قرارات جاهزة وموثقة.',
    roiEstimateEn: '40–50% Reduction in Recurring Meeting Overhead (~18,000 engineering hours saved annually across digital squads)',
    roiEstimateAr: 'خفض بنسبة 40-50% في وقت الاجتماعات المتكررة (~18,000 ساعة هندسية سنوياً عبر الفرق الرقمية)',
    implementationTimeEn: '4–6 Weeks (Calendar & Jira Integration)',
    implementationTimeAr: '4 إلى 6 أسابيع (ربط مباشر مع التقويم و Jira)',
    talkingPointsEn: [
      'Identifies meetings that exist solely to share status and replaces them with automated async digests.',
      'Synthesizes prior Jira epics, Confluence RFCs, and past board decisions into structured 1-page Decision Packs.',
      'Empowers executives to approve, reject, or comment with full historical context in under 60 seconds.'
    ],
    talkingPointsAr: [
      'كشف الاجتماعات المخصصة لمشاركة الحالة فقط واستبدالها بملخصات تفاعلية غير متزامنة.',
      'دمج قرارات Jira ووثائق Confluence السابقة في حزم قرارات موجزة وجاهزة للاعتماد في صفحة واحدة.',
      'تمكين الإدارة من اتخاذ القرار أو التوجيه في أقل من 60 ثانية مع كامل السياق التاريخي.'
    ],
    keyMetrics: [
      { labelEn: 'Annual Hours Saved', labelAr: 'الساعات السنوية الموفرة', value: '18,500 h', trend: '+45%', isPositive: true },
      { labelEn: 'Decision Velocity', labelAr: 'سرعة اتخاذ القرار', value: '3.8x', trend: 'Faster', isPositive: true },
      { labelEn: 'Redundant Syncs Cut', labelAr: 'الاجتماعات المكررة الملغاة', value: '62%', trend: '-62%', isPositive: true }
    ]
  },
  {
    id: 'idea-2',
    number: 2,
    titleEn: 'AI Knowledge Gap Detector — Reducing Information Friction',
    titleAr: 'مكتشف فجوات المعرفة الذكي — تقليص الاحتكاك المعلوماتي',
    subtitleEn: 'Silo Breaker • Auto-Generate SOPs & FAQs • Eliminate SME Bottlenecks',
    subtitleAr: 'كسر العزلة المعرفية • توليد وثائق SOP و FAQ آلياً • تفكيك اختناقات الخبراء',
    badgeEn: 'Organizational Intelligence',
    badgeAr: 'المعرفة المؤسسية الشاملة',
    icon: 'BrainCircuit',
    gradient: 'from-[#0A1931] to-[#0284C7]',
    borderGlow: 'hover:border-[#0284C7]',
    accentColor: '#0284C7',
    executiveValueEn: 'Detects repetitive queries across Slack/Teams/Jira and automatically transforms tacit individual knowledge into authoritative, verified organizational assets.',
    executiveValueAr: 'اكتشاف الأسئلة المتكررة عبر قنوات التواصل وتحويل المعرفة الفردية لدى الخبراء إلى وثائق معتمدة وأدلة عمل مؤسسية للجميع.',
    roiEstimateEn: '70% Reduction in Onboarding & Search Latency (~12,000 hours saved across support and engineering squads)',
    roiEstimateAr: 'تقليص 70% من وقت البحث وتأهيل الموظفين الجدد (~12,000 ساعة سنوياً)',
    implementationTimeEn: '6–8 Weeks (Confluence, SharePoint & Jira Ingestion)',
    implementationTimeAr: '6 إلى 8 أسابيع (ربط مع Confluence و SharePoint و Jira)',
    talkingPointsEn: [
      'Monitors where developers and business units repeatedly ask the same architectural or operational questions.',
      'Drafts authoritative Confluence SOPs and FAQs with verified references and submits them to SMEs for 1-click signoff.',
      'Eliminates single points of failure by making critical banking domain expertise accessible 24/7.'
    ],
    talkingPointsAr: [
      'رصد النقاط التي يتكرر فيها السؤال عن معمارية الأنظمة أو الإجراءات التشغيلية.',
      'توليد أدلة عمل (SOPs) ووثائق FAQ موثوقة وعرضها على الخبراء للاعتماد بضغطة زر.',
      'حماية البنك من تركز المعرفة لدى أفراد محددين وجعل الخبرات المصرفية متاحة على مدار الساعة.'
    ],
    keyMetrics: [
      { labelEn: 'SME Disruption Drop', labelAr: 'انخفاض مقاطعة الخبراء', value: '-74%', trend: 'Reduced', isPositive: true },
      { labelEn: 'Onboarding Acceleration', labelAr: 'تسريع تدريب المنضمين', value: '2.5x', trend: 'Faster', isPositive: true },
      { labelEn: 'Auto-Published SOPs', labelAr: 'وثائق SOP المنشورة آلياً', value: '142 doc', trend: '+142', isPositive: true }
    ]
  },
  {
    id: 'idea-3',
    number: 3,
    titleEn: 'AI Early Warning System — Protecting Execution Speed',
    titleAr: 'نظام الإنذار المبكر الذكي — حماية سرعة التنفيذ',
    subtitleEn: 'Early Signal → Early Action → Less Impact / Delay • Jira Pattern Intelligence',
    subtitleAr: 'إشارة مبكرة ➔ تحقيق مبكر ➔ تدخل مبكر ➔ خفض الأثر والتأخير • ذكاء أنماط Jira',
    badgeEn: 'Execution & Reliability',
    badgeAr: 'الموثوقية وحماية سرعة الإنجاز',
    icon: 'Radar',
    gradient: 'from-[#0A1931] to-[#10B981]',
    borderGlow: 'hover:border-[#10B981]',
    accentColor: '#10B981',
    executiveValueEn: 'Analyzes combined Jira signals (TTs, SLAs, reassignments, recurring defects, overdue dependencies) to discover emerging incidents and delivery slowdowns before impact.',
    executiveValueAr: 'ربط إشارات Jira المتعددة (تذاكر الدعم، الـ SLAs، تنقل المهام، تكرار الأخطاء، والاعتماديات العالقة) لكشف الحوادث وتعثر التسليم قبل فوات الأوان.',
    roiEstimateEn: '60% Reduction in Production Incidents & 4.5 Days Lead Time Before SLA / Delivery Breaches',
    roiEstimateAr: 'خفض 60% في الحوادث التشغيلية وكشف مسبق بـ 4.5 أيام قبل كسر الـ SLA وتأخر المشاريع',
    implementationTimeEn: '6–8 Weeks (Jira Telemetry, Status History & Predictive Stream)',
    implementationTimeAr: '6 إلى 8 أسابيع (ربط سجلات Jira ومؤشرات التدفق التشغيلي)',
    talkingPointsEn: [
      'Identifies multi-signal patterns (TT volume spike + MTTR drift + reassignments) rather than isolated metrics.',
      'Extends beyond outages to detect delivery risks: overdue dependencies, rework surge, and pending decisions.',
      'Answers the 5 critical questions: What changed? Contributing signals? Past pattern? Blast radius? Action needed?'
    ],
    talkingPointsAr: [
      'ربط الإشارات المشتركة (ارتفاع تذاكر الدعم + استطالة المعالجة + تنقل المهام) بدلاً من قراءة المؤشرات منعزلة.',
      'تغطية مخاطر الإنجاز والتسليم: الاعتماديات المتأخرة، تزايد التعديلات (Rework)، والقرارات المعمارية العالقة.',
      'الإجابة بوضوح على الأسئلة الخمسة: إيه اللي اتغير؟ إيه الإشارات؟ هل حصل قبل كده؟ إيه اللي هيتأثر؟ وإيه اللي محتاج مراجعة؟'
    ],
    keyMetrics: [
      { labelEn: 'Early-Warning Lead Time', labelAr: 'زمن الكشف المسبق', value: '4.5 Days', trend: 'Ahead', isPositive: true },
      { labelEn: 'Detection Accuracy', labelAr: 'دقة رصد الأنماط', value: '96.4%', trend: 'High Precision', isPositive: true },
      { labelEn: 'SLA & Delay Prevented', labelAr: 'حماية الـ SLA والتسليم', value: '-78%', trend: 'Less Delay', isPositive: true }
    ]
  }
];

export const INITIAL_DEMO_IDEAS: DemoIdea[] = DEMO_IDEAS;

