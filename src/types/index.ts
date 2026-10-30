export type Role = 'citizen' | 'volunteer' | 'worker' | 'guest';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  area: string;
  ward: string;
  avatar: string;
  department?: string;
  points: number;
  badges: string[];
  createdAt: string;
  lastLogin: string;
}

export interface AuthSession {
  token: string;
  userId: string;
  role: Role;
  device: string;
  ip: string;
  createdAt: string;
  lastActive: string;
}

export type ComplaintCategory =
  | 'Road Damage'
  | 'Garbage'
  | 'Streetlight'
  | 'Drainage/Sewage'
  | 'Water Supply'
  | 'Electricity'
  | 'Public Safety'
  | 'Amenities Petitions'
  | 'Borewell & Watersupply'
  | 'Bus Stand Maintenance'
  | 'Canel Cleaning'
  | 'Other';

export type Priority = 'Low' | 'Medium' | 'High' | 'Emergency';

export type ComplaintStage =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Cannot be solved';

export interface StatusHistoryItem {
  stage: ComplaintStage;
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface WorkerInfo {
  id: string;
  name: string;
  department: string;
  phone: string;
  avatar: string;
  activeTasks: number;
  completedTasks: number;
  rating: number;
}

export interface Complaint {
  id: string; // e.g. CC-2026-00101
  title: string;
  category: ComplaintCategory;
  description: string;
  location: {
    address: string;
    ward: string;
    lat: number;
    lng: number;
  };
  priority: Priority;
  status: ComplaintStage;
  createdAt: string;
  estimatedResolutionDate?: string;
  resolvedAt?: string;
  images: string[];
  beforeImage?: string;
  afterImage?: string;
  reportedBy: {
    id: string;
    name: string;
    avatar?: string;
    isAnonymous?: boolean;
    phone?: string;
  };
  assignedWorker?: WorkerInfo;
  votes: number;
  userVoted?: boolean;
  communityVerifiedVotes: {
    yes: number;
    no: number;
    userVote?: 'yes' | 'no';
  };
  rating?: number;
  feedback?: string;
  cannotSolveReason?: string;
  nextSteps?: string[];
  needsMoreInfo?: boolean;
  moreInfoRequest?: string;
  timeline: StatusHistoryItem[];
  duplicateOf?: string;
  comments: {
    id: string;
    userName: string;
    userAvatar?: string;
    text: string;
    timestamp: string;
    image?: string;
  }[];
}

export interface VolunteerEvent {
  id: string;
  title: string;
  category: 'Cleanliness Drive' | 'Tree Plantation' | 'Drain Clearing' | 'Awareness Campaign' | 'Road Safety';
  description: string;
  location: string;
  ward: string;
  date: string;
  time: string;
  organizer: string;
  neededVolunteers: number;
  registeredCount: number;
  registeredUsers: string[];
  image: string;
  hoursCredit: number;
  pointsReward: number;
  pastPhotos?: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'status_change' | 'assignment' | 'emergency' | 'volunteer' | 'reward';
  complaintId?: string;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  type: 'Flood' | 'Fire' | 'Gas Leak' | 'Fallen Tree' | 'Water Cut' | 'Power Outage';
  severity: 'Critical' | 'Warning' | 'Notice';
  location: string;
  timestamp: string;
  actionRequired: string;
  helpline: string;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  area: string;
  points: number;
  solvedCount: number;
  supportedCount: number;
  avatar: string;
  badge: string;
}

export type LanguageCode = 'en' | 'kn' | 'hi';
