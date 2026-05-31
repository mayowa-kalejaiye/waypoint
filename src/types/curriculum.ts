export type LearningLevel = "beginner" | "intermediate" | "advanced";

export interface GenerateCurriculumRequest {
  goal: string;
  level: LearningLevel;
  hours_per_day: number;
  session_id?: string;
  prefer_long_videos?: boolean;
}

export interface Video {
  source_type?: "youtube" | "paper" | "repo" | "doc";
  youtube_id: string;
  paper_id?: string;
  repo_id?: string;
  doc_id?: string;
  url?: string;
  title: string;
  channel: string;
  duration_seconds: number;
  score: number;
  why_this_video: string;
  transcript_available: boolean;
  duration_advice?: string | null;
  reading_time_minutes?: number;
}

export interface Day {
  day: number;
  concept: string;
  video: Video;
  alternative_video?: Video | null;
}

export interface Week {
  week: number;
  theme: string;
  days: Day[];
}

export interface ProjectDayPlan {
  day: number;
  node_ids_covered: string[];
  project_title: string;
  duration_minutes: number;
  description: string;
  deliverable?: string;
  hints?: string[];
  success_criteria?: string[];
}

export interface FinalProjectPlan {
  title: string;
  integrates_nodes: string[];
  description: string;
  estimated_total_hours?: number;
  rubric?: string;
}

export interface CurriculumProjects {
  daily_breakdown?: ProjectDayPlan[];
  final_project?: FinalProjectPlan;
}

export interface AdaptiveRules {
  if_learner_struggles?: {
    action?: string;
    trigger?: string;
  };
  if_learner_accelerates?: {
    action?: string;
    trigger?: string;
  };
}

export interface LearnerValue {
  roi_summary?: string;
  outcomes?: string[];
  transfer_skills?: string[];
  milestones?: string[];
  daily_commitment?: string;
  practice_style?: string;
  coach_note?: string;
}

export interface SocialProof {
  completion_count?: number;
  rating_avg?: number;
  rating_count?: number;
}

export interface Curriculum {
  curriculum_id: string;
  topic: string;
  duration_days: number;
  level: string;
  hours_per_day: number;
  description: string;
  warning?: string | null;
  weeks: Week[];
  can_expand?: boolean;
  generator_version?: string;
  domain?: string;
  diversity_warnings?: string[];
  requires_review?: boolean;
  projects?: CurriculumProjects;
  adaptive_rules?: AdaptiveRules;
  learner_value?: LearnerValue;
  social_proof?: SocialProof;
  progression_concepts?: Array<Record<string, unknown>>;
  cached?: boolean;
}

export interface CurriculumJobResponse {
  job_id: string;
  status: string;
  curriculum_id?: string | null;
  topic?: string | null;
  progress_message?: string | null;
  duration_days?: number | null;
  warning?: string | null;
  weeks?: Week[] | null;
  result_json?: Partial<Curriculum> | null;
  poll_url: string;
  error?: string | null;
  can_expand?: boolean;
  remaining_requests?: number | null;
  hourly_limit?: number | null;
}

export interface CurriculumProgress {
  completedDays: number;
  totalDays: number;
  currentStreak: number;
  remainingHours: number;
  percent: number;
  completedProjects?: number;
  totalProjects?: number;
  completedCriteria?: number;
  totalCriteria?: number;
}
