export type User = { id: number; name: string; email: string; role: string; pro: boolean; pro_until?: string; avatar?: string };
export type Track = { id: number; title: string; artist: string; artist_id: number; cover?: string; audio_url?: string; genre: string; plays: number; likes: number; release?: string; duration?: string; status?: string };
export type Artist = { id: number; name: string; tracks: number; cover?: string; followers?: number };
export type Release = { id: number; title: string; artist: string; cover?: string; type: string; year?: number; track_ids?: number[] };
export type Event = { id: number; title: string; date: string; location: string; image?: string; description?: string; ticket_url?: string; interested?: number; status?: string; rsvp?: string };
export type Campaign = { id: number; title: string; destination_url: string; daily_budget: number; status: string; reach: number; spent: number; copy?: string };
export type Home = { trending: Track[]; tracks: Track[]; artists: Artist[]; releases: Release[]; events: Event[]; genres: string[]; recommended: Track[] };
export type Stats = { tracks: number; pending_tracks: number; events: number; pending_events: number; campaigns: number; pending_campaigns: number; fans: number; studio: number; premium: number; streams: number };
