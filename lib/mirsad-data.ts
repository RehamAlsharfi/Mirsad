// Mirsad — coherent mock data model.
// A single source of truth shared across the beneficiary view, the employee
// dashboard, transaction details and the analytics section. Numbers here are
// fictional prototype values and are kept internally consistent.

export type RiskIndicator = 'normal' | 'done' | 'warn' | 'danger'

// Human-readable transaction status shown to the beneficiary. This is a
// DIFFERENT dimension from the Mirsad risk indicator above.
export type HumanStatus =
  | 'تسير بشكل طبيعي'
  | 'قيد المعالجة'
  | 'قد تستغرق وقتًا أطول من المتوقع'
  | 'بانتظار استكمال مستند'
  | 'مكتملة'

export type StageState = 'done' | 'current' | 'upcoming'

export interface JourneyStage {
  name: string
  entity: string
  date: string // hijri-style display date
  time: string
  state: StageState
  lastAction: string
  durationLabel: string // e.g. "12 ساعة"
  expectedLabel?: string // expected duration for the stage
}

export interface MissingDocument {
  name: string
  note: string
}

export interface Transaction {
  id: string
  service: string
  submittedAt: string
  lastUpdate: string
  humanStatus: HumanStatus
  indicator: RiskIndicator
  progress: number // 0-100 for the journey
  currentEntity: string
  currentStage: string
  elapsedLabel: string // time in current stage
  expectedLabel: string // expected time for current stage
  riskScore: number // 0-100, employee-only
  beneficiaryName: string
  beneficiaryMaskedId: string
  // Employee-only intelligence
  riskReasons?: string[]
  recommendation?: string
  missingDocument?: MissingDocument
  notifiedBeneficiary?: boolean
  beneficiaryAlert?: string // calm proactive message for beneficiary
  journey: JourneyStage[]
}

export const INDICATOR_META: Record<
  RiskIndicator,
  { label: string; color: string; soft: string; text: string }
> = {
  normal: {
    label: 'المسار الطبيعي',
    color: 'var(--status-normal)',
    soft: 'var(--status-normal-soft)',
    text: 'var(--status-normal)',
  },
  done: {
    label: 'مكتمل',
    color: 'var(--status-done)',
    soft: 'var(--status-done-soft)',
    text: 'var(--status-done)',
  },
  warn: {
    label: 'بوادر تعثّر',
    color: 'var(--status-warn)',
    soft: 'var(--status-warn-soft)',
    text: 'var(--status-warn)',
  },
  danger: {
    label: 'خطر — تدخّل عاجل',
    color: 'var(--status-danger)',
    soft: 'var(--status-danger-soft)',
    text: 'var(--status-danger)',
  },
}

// The signals Mirsad conceptually weighs to derive a risk score.
export const RISK_SIGNALS: string[] = [
  'الزمن المتوقع للخدمة',
  'الزمن المتوقع للمرحلة الحالية',
  'المرحلة والجهة الحالية',
  'الزمن منذ آخر إجراء',
  'حالة المستندات ووجود مستند ناقص',
  'نمط المعاملات السابقة والانحراف عن المسار المعتاد',
]

const BENEFICIARY = {
  name: 'سالم بن عبدالله الغامدي',
  maskedId: '10••••42',
}

export const TRANSACTIONS: Transaction[] = [
  {
    id: 'BAH-2026-004821',
    service: 'طلب استثمار',
    submittedAt: '1447/07/02',
    lastUpdate: 'قبل 44 ساعة',
    humanStatus: 'قيد المعالجة',
    indicator: 'warn',
    progress: 55,
    currentEntity: 'وزارة الاستثمار — فرع الباحة',
    currentStage: 'مراجعة الطلب',
    elapsedLabel: '44 ساعة',
    expectedLabel: '48 ساعة',
    riskScore: 72,
    beneficiaryName: BENEFICIARY.name,
    beneficiaryMaskedId: BENEFICIARY.maskedId,
    beneficiaryAlert:
      'قد تستغرق معاملتك وقتًا أطول من المتوقع. نرصد مسار طلبك ونتابع مستجداته أولًا بأول.',
    riskReasons: [
      'سبب محتمل: لم يُسجَّل إجراء منذ مدة أطول من النمط المعتاد لهذه المرحلة.',
      'سبب محتمل: اقتراب الزمن المنقضي من الحد المتوقع للمرحلة دون تحديث.',
      'انحراف طفيف عن المسار المعتاد لمعاملات هذه الخدمة.',
    ],
    recommendation:
      'يوصى بمراجعة الطلب لدى الجهة الحالية خلال أقرب وقت، لعدم تسجيل إجراء منذ 18 ساعة مقارنةً بالمدة المعتادة لهذه المرحلة.',
    journey: [
      {
        name: 'تقديم الطلب',
        entity: 'البوابة الإلكترونية',
        date: '1447/07/02',
        time: '09:14',
        state: 'done',
        lastAction: 'تم استلام الطلب إلكترونيًا',
        durationLabel: 'فوري',
      },
      {
        name: 'استلام الطلب',
        entity: 'ديوان الإمارة',
        date: '1447/07/02',
        time: '11:40',
        state: 'done',
        lastAction: 'إحالة الطلب إلى الجهة المختصة',
        durationLabel: '3 ساعات',
      },
      {
        name: 'مراجعة الطلب',
        entity: 'وزارة الاستثمار — فرع الباحة',
        date: '1447/07/03',
        time: '08:05',
        state: 'current',
        lastAction: 'مراجعة المستندات المرفقة',
        durationLabel: '44 ساعة',
        expectedLabel: '48 ساعة',
      },
      {
        name: 'اعتماد الطلب',
        entity: 'اللجنة المختصة',
        date: '—',
        time: '—',
        state: 'upcoming',
        lastAction: 'بانتظار انتهاء المراجعة',
        durationLabel: '—',
      },
      {
        name: 'إنهاء المعاملة',
        entity: 'ديوان الإمارة',
        date: '—',
        time: '—',
        state: 'upcoming',
        lastAction: 'بانتظار الاعتماد',
        durationLabel: '—',
      },
    ],
  },
  {
    id: 'BAH-2026-004795',
    service: 'طلب تكوين لجنة',
    submittedAt: '1447/06/28',
    lastUpdate: 'قبل 3 ساعات',
    humanStatus: 'بانتظار استكمال مستند',
    indicator: 'danger',
    progress: 35,
    currentEntity: 'اللجنة المختصة — ديوان الإمارة',
    currentStage: 'مراجعة الطلب',
    elapsedLabel: '61 ساعة',
    expectedLabel: '36 ساعة',
    riskScore: 88,
    beneficiaryName: BENEFICIARY.name,
    beneficiaryMaskedId: BENEFICIARY.maskedId,
    beneficiaryAlert:
      'لاستكمال رحلة طلبك يلزم إرفاق مستند مطلوب. أرفق المستند لمتابعة معالجة المعاملة.',
    missingDocument: {
      name: 'خطاب تفويض معتمد من الجهة المعنية',
      note: 'المستند مطلوب لاستكمال دراسة الطلب قبل انتقاله إلى مرحلة الاعتماد.',
    },
    riskReasons: [
      'مستند مطلوب غير مرفق يمنع انتقال الطلب إلى المرحلة التالية.',
      'تجاوز الزمن المنقضي الحدَّ المتوقع للمرحلة الحالية.',
      'سبب محتمل: توقّف المعالجة بانتظار إجراء من المستفيد.',
    ],
    recommendation:
      'يوصى بإشعار المستفيد لاستكمال المستند الناقص قبل متابعة المرحلة التالية، مع ضبط مؤقّت متابعة خلال 24 ساعة.',
    journey: [
      {
        name: 'تقديم الطلب',
        entity: 'البوابة الإلكترونية',
        date: '1447/06/28',
        time: '13:22',
        state: 'done',
        lastAction: 'تم استلام الطلب إلكترونيًا',
        durationLabel: 'فوري',
      },
      {
        name: 'استلام الطلب',
        entity: 'ديوان الإمارة',
        date: '1447/06/28',
        time: '15:10',
        state: 'done',
        lastAction: 'إحالة الطلب إلى اللجنة المختصة',
        durationLabel: 'ساعتان',
      },
      {
        name: 'مراجعة الطلب',
        entity: 'اللجنة المختصة — ديوان الإمارة',
        date: '1447/06/29',
        time: '09:30',
        state: 'current',
        lastAction: 'طلب استكمال مستند من المستفيد',
        durationLabel: '61 ساعة',
        expectedLabel: '36 ساعة',
      },
      {
        name: 'اعتماد التكوين',
        entity: 'ديوان الإمارة',
        date: '—',
        time: '—',
        state: 'upcoming',
        lastAction: 'بانتظار استكمال المستند',
        durationLabel: '—',
      },
    ],
  },
  {
    id: 'BAH-2026-004760',
    service: 'طلب علاج خارجي',
    submittedAt: '1447/07/04',
    lastUpdate: 'قبل 18 ساعة',
    humanStatus: 'تسير بشكل طبيعي',
    indicator: 'normal',
    progress: 45,
    currentEntity: 'وزارة الصحة — الشؤون الصحية بالباحة',
    currentStage: 'مراجعة الطلب',
    elapsedLabel: '18 ساعة',
    expectedLabel: '48 ساعة',
    riskScore: 21,
    beneficiaryName: BENEFICIARY.name,
    beneficiaryMaskedId: BENEFICIARY.maskedId,
    journey: [
      {
        name: 'تقديم الطلب',
        entity: 'البوابة الإلكترونية',
        date: '1447/07/04',
        time: '10:02',
        state: 'done',
        lastAction: 'تم استلام الطلب إلكترونيًا',
        durationLabel: 'فوري',
      },
      {
        name: 'استلام الطلب',
        entity: 'ديوان الإمارة',
        date: '1447/07/04',
        time: '12:20',
        state: 'done',
        lastAction: 'إحالة الطلب إلى الشؤون الصحية',
        durationLabel: 'ساعتان',
      },
      {
        name: 'مراجعة الطلب',
        entity: 'وزارة الصحة — الشؤون الصحية بالباحة',
        date: '1447/07/05',
        time: '08:40',
        state: 'current',
        lastAction: 'دراسة الحالة الطبية',
        durationLabel: '18 ساعة',
        expectedLabel: '48 ساعة',
      },
      {
        name: 'اعتماد العلاج',
        entity: 'اللجنة الطبية',
        date: '—',
        time: '—',
        state: 'upcoming',
        lastAction: 'بانتظار انتهاء المراجعة',
        durationLabel: '—',
      },
      {
        name: 'إنهاء المعاملة',
        entity: 'الشؤون الصحية بالباحة',
        date: '—',
        time: '—',
        state: 'upcoming',
        lastAction: 'بانتظار الاعتماد',
        durationLabel: '—',
      },
    ],
  },
  {
    id: 'BAH-2026-004712',
    service: 'طلب متعلق بالعقار',
    submittedAt: '1447/06/12',
    lastUpdate: 'قبل 6 أيام',
    humanStatus: 'مكتملة',
    indicator: 'done',
    progress: 100,
    currentEntity: 'كتابة العدل بالباحة',
    currentStage: 'إنهاء المعاملة',
    elapsedLabel: '—',
    expectedLabel: '72 ساعة',
    riskScore: 8,
    beneficiaryName: BENEFICIARY.name,
    beneficiaryMaskedId: BENEFICIARY.maskedId,
    journey: [
      {
        name: 'تقديم الطلب',
        entity: 'البوابة الإلكترونية',
        date: '1447/06/12',
        time: '09:00',
        state: 'done',
        lastAction: 'تم استلام الطلب إلكترونيًا',
        durationLabel: 'فوري',
      },
      {
        name: 'استلام الطلب',
        entity: 'ديوان الإمارة',
        date: '1447/06/12',
        time: '10:30',
        state: 'done',
        lastAction: 'إحالة الطلب إلى كتابة العدل',
        durationLabel: 'ساعة ونصف',
      },
      {
        name: 'مراجعة الطلب',
        entity: 'كتابة العدل بالباحة',
        date: '1447/06/13',
        time: '11:15',
        state: 'done',
        lastAction: 'التحقق من بيانات العقار',
        durationLabel: '26 ساعة',
      },
      {
        name: 'اعتماد المعاملة',
        entity: 'كتابة العدل بالباحة',
        date: '1447/06/14',
        time: '13:40',
        state: 'done',
        lastAction: 'اعتماد الإجراء',
        durationLabel: '18 ساعة',
      },
      {
        name: 'إنهاء المعاملة',
        entity: 'كتابة العدل بالباحة',
        date: '1447/06/14',
        time: '15:05',
        state: 'done',
        lastAction: 'إنجاز المعاملة وإشعار المستفيد',
        durationLabel: 'ساعة ونصف',
      },
    ],
  },
  // Additional employee-only transactions (other beneficiaries)
  {
    id: 'BAH-2026-004688',
    service: 'طلب تصريح فعالية',
    submittedAt: '1447/06/30',
    lastUpdate: 'قبل 30 ساعة',
    humanStatus: 'قد تستغرق وقتًا أطول من المتوقع',
    indicator: 'warn',
    progress: 50,
    currentEntity: 'أمانة منطقة الباحة',
    currentStage: 'دراسة الطلب',
    elapsedLabel: '30 ساعة',
    expectedLabel: '40 ساعة',
    riskScore: 66,
    beneficiaryName: 'نورة بنت محمد الزهراني',
    beneficiaryMaskedId: '10••••17',
    riskReasons: [
      'سبب محتمل: بطء المعالجة مقارنةً بالنمط المعتاد لهذه الخدمة.',
      'انحراف عن متوسط زمن هذه المرحلة لمعاملات مماثلة.',
    ],
    recommendation:
      'يوصى بمتابعة الطلب لدى الجهة الحالية، مع مراجعة سبب بطء المعالجة مقارنةً بمعاملات الفعاليات المماثلة.',
    journey: [
      {
        name: 'تقديم الطلب',
        entity: 'البوابة الإلكترونية',
        date: '1447/06/30',
        time: '08:12',
        state: 'done',
        lastAction: 'تم استلام الطلب إلكترونيًا',
        durationLabel: 'فوري',
      },
      {
        name: 'استلام الطلب',
        entity: 'أمانة منطقة الباحة',
        date: '1447/06/30',
        time: '10:00',
        state: 'done',
        lastAction: 'إحالة إلى إدارة التصاريح',
        durationLabel: 'ساعتان',
      },
      {
        name: 'دراسة الطلب',
        entity: 'أمانة منطقة الباحة',
        date: '1447/07/01',
        time: '09:00',
        state: 'current',
        lastAction: 'دراسة موقع الفعالية والاشتراطات',
        durationLabel: '30 ساعة',
        expectedLabel: '40 ساعة',
      },
      {
        name: 'إصدار التصريح',
        entity: 'أمانة منطقة الباحة',
        date: '—',
        time: '—',
        state: 'upcoming',
        lastAction: 'بانتظار انتهاء الدراسة',
        durationLabel: '—',
      },
    ],
  },
  {
    id: 'BAH-2026-004640',
    service: 'طلب إصدار صك',
    submittedAt: '1447/06/25',
    lastUpdate: 'قبل ساعتين',
    humanStatus: 'خطر — تدخّل عاجل' as HumanStatus,
    indicator: 'danger',
    progress: 40,
    currentEntity: 'كتابة العدل بالباحة',
    currentStage: 'التحقق من الملكية',
    elapsedLabel: '96 ساعة',
    expectedLabel: '60 ساعة',
    riskScore: 91,
    beneficiaryName: 'عبدالرحمن بن سعد الغامدي',
    beneficiaryMaskedId: '10••••90',
    riskReasons: [
      'تجاوز كبير للزمن المتوقع للمرحلة الحالية.',
      'عدم تسجيل إجراء منذ مدة أطول بكثير من المعتاد.',
      'سبب محتمل: تعارض في بيانات الملكية يتطلب مراجعة يدوية.',
    ],
    recommendation:
      'يوصى بتدخّل عاجل ومراجعة الطلب مباشرةً لدى الجهة الحالية لتجاوز التعارض في بيانات الملكية قبل تصاعد التأخير.',
    journey: [
      {
        name: 'تقديم الطلب',
        entity: 'البوابة الإلكترونية',
        date: '1447/06/25',
        time: '11:45',
        state: 'done',
        lastAction: 'تم استلام الطلب إلكترونيًا',
        durationLabel: 'فوري',
      },
      {
        name: 'استلام الطلب',
        entity: 'كتابة العدل بالباحة',
        date: '1447/06/25',
        time: '13:00',
        state: 'done',
        lastAction: 'فتح ملف المعاملة',
        durationLabel: 'ساعة',
      },
      {
        name: 'التحقق من الملكية',
        entity: 'كتابة العدل بالباحة',
        date: '1447/06/26',
        time: '09:20',
        state: 'current',
        lastAction: 'مطابقة بيانات الصك السابق',
        durationLabel: '96 ساعة',
        expectedLabel: '60 ساعة',
      },
      {
        name: 'إصدار الصك',
        entity: 'كتابة العدل بالباحة',
        date: '—',
        time: '—',
        state: 'upcoming',
        lastAction: 'بانتظار انتهاء التحقق',
        durationLabel: '—',
      },
    ],
  },
  {
    id: 'BAH-2026-004599',
    service: 'طلب دعم خيري',
    submittedAt: '1447/07/01',
    lastUpdate: 'قبل 10 ساعات',
    humanStatus: 'قيد المعالجة',
    indicator: 'normal',
    progress: 60,
    currentEntity: 'ديوان الإمارة — الشؤون الاجتماعية',
    currentStage: 'دراسة الطلب',
    elapsedLabel: '20 ساعة',
    expectedLabel: '48 ساعة',
    riskScore: 18,
    beneficiaryName: 'هند بنت علي الغامدي',
    beneficiaryMaskedId: '10••••33',
    journey: [
      {
        name: 'تقديم الطلب',
        entity: 'البوابة الإلكترونية',
        date: '1447/07/01',
        time: '14:00',
        state: 'done',
        lastAction: 'تم استلام الطلب إلكترونيًا',
        durationLabel: 'فوري',
      },
      {
        name: 'استلام الطلب',
        entity: 'ديوان الإمارة',
        date: '1447/07/01',
        time: '15:20',
        state: 'done',
        lastAction: 'إحالة إلى الشؤون الاجتماعية',
        durationLabel: 'ساعة',
      },
      {
        name: 'دراسة الطلب',
        entity: 'ديوان الإمارة — الشؤون الاجتماعية',
        date: '1447/07/02',
        time: '09:10',
        state: 'current',
        lastAction: 'دراسة الحالة الاجتماعية',
        durationLabel: '20 ساعة',
        expectedLabel: '48 ساعة',
      },
      {
        name: 'اعتماد الدعم',
        entity: 'اللجنة المختصة',
        date: '—',
        time: '—',
        state: 'upcoming',
        lastAction: 'بانتظار انتهاء الدراسة',
        durationLabel: '—',
      },
    ],
  },
  {
    id: 'BAH-2026-004540',
    service: 'طلب علاج خارجي',
    submittedAt: '1447/06/05',
    lastUpdate: 'قبل 9 أيام',
    humanStatus: 'مكتملة',
    indicator: 'done',
    progress: 100,
    currentEntity: 'وزارة الصحة — الشؤون الصحية بالباحة',
    currentStage: 'إنهاء المعاملة',
    elapsedLabel: '—',
    expectedLabel: '96 ساعة',
    riskScore: 6,
    beneficiaryName: 'ماجد بن فهد الغامدي',
    beneficiaryMaskedId: '10••••08',
    journey: [
      {
        name: 'تقديم الطلب',
        entity: 'البوابة الإلكترونية',
        date: '1447/06/05',
        time: '08:30',
        state: 'done',
        lastAction: 'تم استلام الطلب إلكترونيًا',
        durationLabel: 'فوري',
      },
      {
        name: 'مراجعة الطلب',
        entity: 'وزارة الصحة — الشؤون الصحية بالباحة',
        date: '1447/06/06',
        time: '10:00',
        state: 'done',
        lastAction: 'دراسة الحالة الطبية',
        durationLabel: '30 ساعة',
      },
      {
        name: 'اعتماد العلاج',
        entity: 'اللجنة الطبية',
        date: '1447/06/08',
        time: '12:00',
        state: 'done',
        lastAction: 'اعتماد العلاج الخارجي',
        durationLabel: '20 ساعة',
      },
      {
        name: 'إنهاء المعاملة',
        entity: 'الشؤون الصحية بالباحة',
        date: '1447/06/08',
        time: '14:30',
        state: 'done',
        lastAction: 'إنجاز المعاملة وإشعار المستفيد',
        durationLabel: 'ساعتان ونصف',
      },
    ],
  },
  {
    id: 'BAH-2026-004512',
    service: 'طلب استثمار',
    submittedAt: '1447/06/20',
    lastUpdate: 'قبل يومين',
    humanStatus: 'تسير بشكل طبيعي',
    indicator: 'normal',
    progress: 70,
    currentEntity: 'وزارة الاستثمار — فرع الباحة',
    currentStage: 'اعتماد الطلب',
    elapsedLabel: '22 ساعة',
    expectedLabel: '48 ساعة',
    riskScore: 24,
    beneficiaryName: 'فيصل بن عبدالله الزهراني',
    beneficiaryMaskedId: '10••••55',
    journey: [
      {
        name: 'تقديم الطلب',
        entity: 'البوابة الإلكترونية',
        date: '1447/06/20',
        time: '09:00',
        state: 'done',
        lastAction: 'تم استلام الطلب إلكترونيًا',
        durationLabel: 'فوري',
      },
      {
        name: 'مراجعة الطلب',
        entity: 'وزارة الاستثمار — فرع الباحة',
        date: '1447/06/21',
        time: '10:00',
        state: 'done',
        lastAction: 'مراجعة المستندات',
        durationLabel: '40 ساعة',
      },
      {
        name: 'اعتماد الطلب',
        entity: 'اللجنة المختصة',
        date: '1447/06/23',
        time: '11:00',
        state: 'current',
        lastAction: 'دراسة الجدوى',
        durationLabel: '22 ساعة',
        expectedLabel: '48 ساعة',
      },
      {
        name: 'إنهاء المعاملة',
        entity: 'ديوان الإمارة',
        date: '—',
        time: '—',
        state: 'upcoming',
        lastAction: 'بانتظار الاعتماد',
        durationLabel: '—',
      },
    ],
  },
  {
    id: 'BAH-2026-004498',
    service: 'طلب متعلق بالعقار',
    submittedAt: '1447/06/18',
    lastUpdate: 'قبل 34 ساعة',
    humanStatus: 'قد تستغرق وقتًا أطول من المتوقع',
    indicator: 'warn',
    progress: 45,
    currentEntity: 'أمانة منطقة الباحة',
    currentStage: 'التحقق الميداني',
    elapsedLabel: '52 ساعة',
    expectedLabel: '60 ساعة',
    riskScore: 63,
    beneficiaryName: 'أحمد بن سالم الغامدي',
    beneficiaryMaskedId: '10••••71',
    riskReasons: [
      'سبب محتمل: تأخر جدولة التحقق الميداني مقارنةً بالمعتاد.',
      'اقتراب الزمن المنقضي من الحد المتوقع دون إجراء جديد.',
    ],
    recommendation:
      'يوصى بمتابعة جدولة الزيارة الميدانية لدى الجهة الحالية لتفادي تجاوز الزمن المتوقع للمرحلة.',
    journey: [
      {
        name: 'تقديم الطلب',
        entity: 'البوابة الإلكترونية',
        date: '1447/06/18',
        time: '10:15',
        state: 'done',
        lastAction: 'تم استلام الطلب إلكترونيًا',
        durationLabel: 'فوري',
      },
      {
        name: 'مراجعة الطلب',
        entity: 'أمانة منطقة الباحة',
        date: '1447/06/19',
        time: '09:00',
        state: 'done',
        lastAction: 'مراجعة بيانات العقار',
        durationLabel: '24 ساعة',
      },
      {
        name: 'التحقق الميداني',
        entity: 'أمانة منطقة الباحة',
        date: '1447/06/20',
        time: '11:00',
        state: 'current',
        lastAction: 'بانتظار جدولة الزيارة الميدانية',
        durationLabel: '52 ساعة',
        expectedLabel: '60 ساعة',
      },
      {
        name: 'إنهاء المعاملة',
        entity: 'أمانة منطقة الباحة',
        date: '—',
        time: '—',
        state: 'upcoming',
        lastAction: 'بانتظار التحقق',
        durationLabel: '—',
      },
    ],
  },
  {
    id: 'BAH-2026-004455',
    service: 'طلب تكوين لجنة',
    submittedAt: '1447/06/02',
    lastUpdate: 'قبل 12 يومًا',
    humanStatus: 'مكتملة',
    indicator: 'done',
    progress: 100,
    currentEntity: 'ديوان الإمارة',
    currentStage: 'إنهاء المعاملة',
    elapsedLabel: '—',
    expectedLabel: '48 ساعة',
    riskScore: 11,
    beneficiaryName: 'خالد بن ناصر الزهراني',
    beneficiaryMaskedId: '10••••26',
    journey: [
      {
        name: 'تقديم الطلب',
        entity: 'البوابة الإلكترونية',
        date: '1447/06/02',
        time: '09:00',
        state: 'done',
        lastAction: 'تم استلام الطلب إلكترونيًا',
        durationLabel: 'فوري',
      },
      {
        name: 'مراجعة الطلب',
        entity: 'اللجنة المختصة',
        date: '1447/06/03',
        time: '10:00',
        state: 'done',
        lastAction: 'مراجعة الطلب',
        durationLabel: '20 ساعة',
      },
      {
        name: 'اعتماد التكوين',
        entity: 'ديوان الإمارة',
        date: '1447/06/03',
        time: '15:00',
        state: 'done',
        lastAction: 'اعتماد تكوين اللجنة',
        durationLabel: '5 ساعات',
      },
      {
        name: 'إنهاء المعاملة',
        entity: 'ديوان الإمارة',
        date: '1447/06/04',
        time: '09:30',
        state: 'done',
        lastAction: 'إنجاز المعاملة',
        durationLabel: '18 ساعة',
      },
    ],
  },
  {
    id: 'BAH-2026-004401',
    service: 'طلب دعم خيري',
    submittedAt: '1447/06/22',
    lastUpdate: 'قبل 5 ساعات',
    humanStatus: 'قيد المعالجة',
    indicator: 'normal',
    progress: 50,
    currentEntity: 'ديوان الإمارة — الشؤون الاجتماعية',
    currentStage: 'دراسة الطلب',
    elapsedLabel: '16 ساعة',
    expectedLabel: '48 ساعة',
    riskScore: 15,
    beneficiaryName: 'ريم بنت سعيد الغامدي',
    beneficiaryMaskedId: '10••••64',
    journey: [
      {
        name: 'تقديم الطلب',
        entity: 'البوابة الإلكترونية',
        date: '1447/06/22',
        time: '11:00',
        state: 'done',
        lastAction: 'تم استلام الطلب إلكترونيًا',
        durationLabel: 'فوري',
      },
      {
        name: 'استلام الطلب',
        entity: 'ديوان الإمارة',
        date: '1447/06/22',
        time: '12:30',
        state: 'done',
        lastAction: 'إحالة إلى الشؤون الاجتماعية',
        durationLabel: 'ساعة ونصف',
      },
      {
        name: 'دراسة الطلب',
        entity: 'ديوان الإمارة — الشؤون الاجتماعية',
        date: '1447/06/23',
        time: '09:00',
        state: 'current',
        lastAction: 'دراسة الحالة',
        durationLabel: '16 ساعة',
        expectedLabel: '48 ساعة',
      },
      {
        name: 'اعتماد الدعم',
        entity: 'اللجنة المختصة',
        date: '—',
        time: '—',
        state: 'upcoming',
        lastAction: 'بانتظار انتهاء الدراسة',
        durationLabel: '—',
      },
    ],
  },
]

// The id of the beneficiary whose transactions appear in the beneficiary view.
export const BENEFICIARY_NAME = BENEFICIARY.name
export const BENEFICIARY_MASKED_ID = BENEFICIARY.maskedId

export function getBeneficiaryTransactions(): Transaction[] {
  return TRANSACTIONS.filter((t) => t.beneficiaryName === BENEFICIARY.name)
}

export function getTransaction(id: string): Transaction | undefined {
  return TRANSACTIONS.find((t) => t.id === id)
}

export function countByIndicator(list: Transaction[]) {
  return {
    total: list.length,
    normal: list.filter((t) => t.indicator === 'normal').length,
    done: list.filter((t) => t.indicator === 'done').length,
    warn: list.filter((t) => t.indicator === 'warn').length,
    danger: list.filter((t) => t.indicator === 'danger').length,
  }
}

// -------------------- Analytics (period-driven) --------------------

export type Period = 'week' | 'month' | 'year'

export const PERIOD_LABELS: Record<Period, string> = {
  week: 'أسبوع',
  month: 'شهر',
  year: 'سنة',
}

export interface ServiceRow {
  service: string
  total: number
  done: number
  delayed: number
  warn: number
  danger: number
  avgDays: number // average completion time (days)
  stallRate: number // نسبة التعثّر %
  change: number // change vs previous period (%)
}

export interface AnalyticsData {
  total: number
  done: number
  delayed: number
  warn: number
  danger: number
  avgCompletionDays: number
  completionRate: number
  stallRate: number
  improvement: number // نسبة التحسن %
  statusDistribution: { key: RiskIndicator; label: string; value: number }[]
  trend: { label: string; delayed: number; completed: number; risk: number }[]
  causes: { label: string; value: number }[]
  processingTime: { label: string; expected: number; actual: number }[]
  services: ServiceRow[]
}

export const ANALYTICS: Record<Period, AnalyticsData> = {
  week: {
    total: 214,
    done: 148,
    delayed: 31,
    warn: 22,
    danger: 13,
    avgCompletionDays: 2.6,
    completionRate: 69,
    stallRate: 16,
    improvement: 9,
    statusDistribution: [
      { key: 'normal', label: 'المسار الطبيعي', value: 31 },
      { key: 'done', label: 'مكتمل', value: 148 },
      { key: 'warn', label: 'بوادر تعثّر', value: 22 },
      { key: 'danger', label: 'خطر', value: 13 },
    ],
    trend: [
      { label: 'السبت', delayed: 7, completed: 20, risk: 4 },
      { label: 'الأحد', delayed: 6, completed: 24, risk: 3 },
      { label: 'الاثنين', delayed: 5, completed: 22, risk: 5 },
      { label: 'الثلاثاء', delayed: 4, completed: 26, risk: 3 },
      { label: 'الأربعاء', delayed: 5, completed: 21, risk: 4 },
      { label: 'الخميس', delayed: 4, completed: 35, risk: 3 },
    ],
    causes: [
      { label: 'نقص مستندات', value: 38 },
      { label: 'تأخر إجراء', value: 27 },
      { label: 'انتظار جهة أخرى', value: 19 },
      { label: 'إعادة الطلب للاستكمال', value: 10 },
      { label: 'أسباب أخرى', value: 6 },
    ],
    processingTime: [
      { label: 'علاج خارجي', expected: 2, actual: 2.4 },
      { label: 'استثمار', expected: 2, actual: 2.8 },
      { label: 'عقار', expected: 3, actual: 3.3 },
      { label: 'تكوين لجنة', expected: 1.5, actual: 2.2 },
      { label: 'دعم خيري', expected: 2, actual: 2.1 },
    ],
    services: [
      { service: 'طلب علاج خارجي', total: 54, done: 41, delayed: 7, warn: 4, danger: 2, avgDays: 2.4, stallRate: 13, change: -6 },
      { service: 'طلب استثمار', total: 38, done: 24, delayed: 8, warn: 4, danger: 2, avgDays: 2.8, stallRate: 21, change: 4 },
      { service: 'طلب متعلق بالعقار', total: 46, done: 31, delayed: 7, warn: 5, danger: 3, avgDays: 3.3, stallRate: 17, change: -3 },
      { service: 'طلب تكوين لجنة', total: 29, done: 21, delayed: 4, warn: 2, danger: 2, avgDays: 2.2, stallRate: 14, change: -8 },
      { service: 'طلب دعم خيري', total: 47, done: 31, delayed: 5, warn: 7, danger: 4, avgDays: 2.1, stallRate: 15, change: 2 },
    ],
  },
  month: {
    total: 936,
    done: 662,
    delayed: 118,
    warn: 104,
    danger: 52,
    avgCompletionDays: 2.9,
    completionRate: 71,
    stallRate: 17,
    improvement: 14,
    statusDistribution: [
      { key: 'normal', label: 'المسار الطبيعي', value: 118 },
      { key: 'done', label: 'مكتمل', value: 662 },
      { key: 'warn', label: 'بوادر تعثّر', value: 104 },
      { key: 'danger', label: 'خطر', value: 52 },
    ],
    trend: [
      { label: 'الأسبوع 1', delayed: 34, completed: 150, risk: 18 },
      { label: 'الأسبوع 2', delayed: 30, completed: 168, risk: 15 },
      { label: 'الأسبوع 3', delayed: 28, completed: 172, risk: 12 },
      { label: 'الأسبوع 4', delayed: 26, completed: 172, risk: 11 },
    ],
    causes: [
      { label: 'نقص مستندات', value: 34 },
      { label: 'تأخر إجراء', value: 29 },
      { label: 'انتظار جهة أخرى', value: 21 },
      { label: 'إعادة الطلب للاستكمال', value: 9 },
      { label: 'أسباب أخرى', value: 7 },
    ],
    processingTime: [
      { label: 'علاج خارجي', expected: 2, actual: 2.5 },
      { label: 'استثمار', expected: 2, actual: 3.1 },
      { label: 'عقار', expected: 3, actual: 3.5 },
      { label: 'تكوين لجنة', expected: 1.5, actual: 2 },
      { label: 'دعم خيري', expected: 2, actual: 2.2 },
    ],
    services: [
      { service: 'طلب علاج خارجي', total: 232, done: 176, delayed: 26, warn: 21, danger: 9, avgDays: 2.5, stallRate: 13, change: -9 },
      { service: 'طلب استثمار', total: 168, done: 112, delayed: 28, warn: 19, danger: 9, avgDays: 3.1, stallRate: 20, change: -5 },
      { service: 'طلب متعلق بالعقار', total: 205, done: 141, delayed: 26, warn: 24, danger: 14, avgDays: 3.5, stallRate: 18, change: -7 },
      { service: 'طلب تكوين لجنة', total: 131, done: 98, delayed: 16, warn: 11, danger: 6, avgDays: 2, stallRate: 13, change: -12 },
      { service: 'طلب دعم خيري', total: 200, done: 135, delayed: 22, warn: 29, danger: 14, avgDays: 2.2, stallRate: 16, change: -3 },
    ],
  },
  year: {
    total: 10842,
    done: 8127,
    delayed: 1184,
    warn: 981,
    danger: 550,
    avgCompletionDays: 3.2,
    completionRate: 75,
    stallRate: 14,
    improvement: 21,
    statusDistribution: [
      { key: 'normal', label: 'المسار الطبيعي', value: 1184 },
      { key: 'done', label: 'مكتمل', value: 8127 },
      { key: 'warn', label: 'بوادر تعثّر', value: 981 },
      { key: 'danger', label: 'خطر', value: 550 },
    ],
    trend: [
      { label: 'الربع 1', delayed: 360, completed: 1820, risk: 190 },
      { label: 'الربع 2', delayed: 320, completed: 1990, risk: 160 },
      { label: 'الربع 3', delayed: 268, completed: 2110, risk: 118 },
      { label: 'الربع 4', delayed: 236, completed: 2207, risk: 82 },
    ],
    causes: [
      { label: 'نقص مستندات', value: 31 },
      { label: 'تأخر إجراء', value: 28 },
      { label: 'انتظار جهة أخرى', value: 23 },
      { label: 'إعادة الطلب للاستكمال', value: 11 },
      { label: 'أسباب أخرى', value: 7 },
    ],
    processingTime: [
      { label: 'علاج خارجي', expected: 2, actual: 2.7 },
      { label: 'استثمار', expected: 2, actual: 3.4 },
      { label: 'عقار', expected: 3, actual: 3.8 },
      { label: 'تكوين لجنة', expected: 1.5, actual: 2.1 },
      { label: 'دعم خيري', expected: 2, actual: 2.4 },
    ],
    services: [
      { service: 'طلب علاج خارجي', total: 2680, done: 2064, delayed: 268, warn: 232, danger: 116, avgDays: 2.7, stallRate: 13, change: -14 },
      { service: 'طلب استثمار', total: 1942, done: 1398, delayed: 254, warn: 196, danger: 94, avgDays: 3.4, stallRate: 18, change: -10 },
      { service: 'طلب متعلق بالعقار', total: 2371, done: 1730, delayed: 289, warn: 231, danger: 121, avgDays: 3.8, stallRate: 17, change: -12 },
      { service: 'طلب تكوين لجنة', total: 1520, done: 1178, delayed: 168, warn: 118, danger: 56, avgDays: 2.1, stallRate: 11, change: -18 },
      { service: 'طلب دعم خيري', total: 2329, done: 1757, delayed: 205, warn: 204, danger: 163, avgDays: 2.4, stallRate: 14, change: -6 },
    ],
  },
}
