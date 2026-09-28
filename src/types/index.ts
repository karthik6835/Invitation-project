export interface InvitationDetails {
  hostName?: string;
  guestOfHonor?: string;
  eventDate?: string;
  eventTime?: string;
  venue?: string;
  address?: string;
  message?: string;
  rsvpDate?: string;
  rsvpContact?: string;
  dressCode?: string;
  additionalInfo?: string;
  [key: string]: string | undefined;
}

export interface Invitation {
  id: string;
  user_id: string;
  template_id: string;
  event_type: string;
  title: string;
  details: InvitationDetails;
  share_uuid: string;
  is_premium_unlocked: boolean;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  isPremium: boolean;
  description: string;
  theme: {
    bgGradient: string;
    cardBg: string;
    accentColor: string;
    textColor: string;
    subTextColor: string;
    fontFamily: string;
    decoration: string;
  };
  preview: {
    title: string;
    subtitle: string;
  };
}
