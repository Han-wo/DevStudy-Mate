export interface User {
  id: string;
  email: string;
  name: string;
  interests: string[];
  location: {
    city: string;
    district: string;
  };
  matchCount: number;
  lastMatchDate: Date;
  fcmToken?: string;
}

export interface Match {
  id: string;
  users: [string, string];
  status: "pending" | "accepted" | "rejected";
  chatRoomId?: string;
  createdAt: Date;
}

export interface Group {
  id: string;
  hostId: string;
  title: string;
  content: string;
  chatLink: string;
  meetingDate?: Date;
  location: {
    city: string;
    district: string;
  };
  applicants: {
    userId: string;
    status: "pending" | "accepted" | "rejected";
    appliedAt: Date;
  }[];
  createdAt: Date;
}
