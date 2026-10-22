import type { Home, Track, Event, Artist, Release, Campaign, Stats } from './types';
export const genres = ['All Music','Live Events','Discover','New Releases','Pop','Hip Hop','Country','Kwaito','Amapiano','Afro House','R&B','Gospel'];
export const demoTracks: Track[] = [
 {id:1,title:'After the Rain',artist:'Nomusa M',artist_id:101,genre:'Amapiano',plays:8420,likes:731,release:'City Lights',audio_url:'/demo/after-rain.wav'},
 {id:2,title:'Jozi Nights',artist:'Themba Waves',artist_id:102,genre:'Kwaito',plays:7092,likes:542,release:'Midnight Sessions',audio_url:'/demo/jozi-nights.wav'},
 {id:3,title:'Home Again',artist:'Lebo & The Collective',artist_id:103,genre:'Afro House',plays:6330,likes:481,release:'Beyond the Skyline',audio_url:'/demo/home-again.wav'},
 {id:4,title:'Green Horizon',artist:'Maya Soul',artist_id:104,genre:'R&B',plays:5859,likes:403,release:'Slow Motion',audio_url:'/demo/after-rain.wav'},
 {id:5,title:'Soweto Sunrise',artist:'Nomusa M',artist_id:101,genre:'Amapiano',plays:5124,likes:388,release:'City Lights',audio_url:'/demo/jozi-nights.wav'},
 {id:6,title:'Deep in Motion',artist:'Themba Waves',artist_id:102,genre:'Hip Hop',plays:4802,likes:331,release:'Midnight Sessions',audio_url:'/demo/home-again.wav'},
 {id:7,title:'Golden Hour',artist:'Lebo & The Collective',artist_id:103,genre:'Pop',plays:4100,likes:287,release:'Beyond the Skyline',audio_url:'/demo/after-rain.wav'},
 {id:8,title:'Another Chapter',artist:'Maya Soul',artist_id:104,genre:'Country',plays:3804,likes:220,release:'Slow Motion',audio_url:'/demo/home-again.wav'}
];
export const demoArtists:Artist[]=[{id:101,name:'Nomusa M',tracks:2},{id:102,name:'Themba Waves',tracks:2},{id:103,name:'Lebo & The Collective',tracks:2},{id:104,name:'Maya Soul',tracks:2}];
export const demoReleases:Release[]=[{id:11,title:'City Lights',artist:'Nomusa M',type:'Album',year:2026,track_ids:[1,5]},{id:12,title:'Midnight Sessions',artist:'Themba Waves',type:'EP',year:2026,track_ids:[2,6]},{id:13,title:'Beyond the Skyline',artist:'Lebo & The Collective',type:'Album',year:2026,track_ids:[3,7]},{id:14,title:'Slow Motion',artist:'Maya Soul',type:'Single',year:2026,track_ids:[4,8]}];
export const demoEvents:Event[]=[{id:21,title:'Amapiano After Dark',date:'2026-12-12T18:00:00+02:00',location:'Johannesburg, South Africa',description:'An evening of South African sounds and live performances.'},{id:22,title:'Green Room Sessions',date:'2027-01-23T17:00:00+02:00',location:'Pretoria, South Africa',description:'New voices. One stage.'},{id:23,title:'Soweto Live',date:'2027-02-20T15:00:00+02:00',location:'Soweto, South Africa',description:'A celebration of local talent.'}];
export const demoHome: Home = {trending:demoTracks.slice(0,5), tracks:demoTracks, artists:demoArtists,releases:demoReleases,events:demoEvents,genres,recommended:demoTracks.slice(3,8)};
export const demoCampaigns:Campaign[]=[{id:41,title:'Weekend Showcase',destination_url:'https://example.org',daily_budget:20,status:'pending',reach:0,spent:0,copy:'Discover something special.'}];
export const demoStats:Stats={tracks:8,pending_tracks:2,events:3,pending_events:1,campaigns:1,pending_campaigns:1,fans:0,studio:0,premium:0,streams:0};
export function artGradient(seed:number) { const shades=[['#034E40','#09241f'],['#345C53','#102825'],['#136D5B','#101c20'],['#324b65','#092a27'],['#587767','#092520'],['#5f4d64','#1b3030']]; const c=shades[Math.abs(seed)%shades.length]; return `linear-gradient(140deg,${c[0]},${c[1]})`; }
