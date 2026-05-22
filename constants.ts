
import { TowLog } from './types';

export const COLORS = {
  primary: '#FF4D00',
  bg: '#0B0E14',
  card: '#161B22',
  text: '#E2E8F0',
  success: '#00D100',
  warning: '#FBBF24',
  error: '#EF4444',
};

export const MOCK_LOGS: TowLog[] = [
  { 
    id: '1', 
    dateTime: '2026-02-03 10:02', 
    tailNumber: 'N412EF', 
    duration: '23m', 
    operator: 'C. Lee', 
    status: 'online',
    details: { distance: '450 ft', maxSpeed: '2.1 mph', events: 1, batteryEnd: '84%', path: 'Hangar 1 -> Ramp' }
  },
  { 
    id: '2', 
    dateTime: '2026-02-02 15:48', 
    tailNumber: 'N715SD', 
    duration: '12m', 
    operator: 'H. Dossaji', 
    status: 'online',
    details: { distance: '320 ft', maxSpeed: '1.8 mph', events: 0, batteryEnd: '92%', path: 'Hangar 2 -> Hangar 3' }
  },
  { 
    id: '3', 
    dateTime: '2026-02-01 13:11', 
    tailNumber: 'N342AT', 
    duration: '15m', 
    operator: 'J. Taylor', 
    status: 'online',
    details: { distance: '410 ft', maxSpeed: '2.0 mph', events: 0, batteryEnd: '78%', path: 'Ramp -> Hangar 1' }
  },
  { 
    id: '4', 
    dateTime: '2026-02-01 06:58', 
    tailNumber: 'N102QX', 
    duration: '20m', 
    operator: 'D. Ladnier', 
    status: 'online',
    details: { distance: '500 ft', maxSpeed: '2.2 mph', events: 2, batteryEnd: '65%', path: 'Hangar 3 -> Ramp' }
  },
  { 
    id: '5', 
    dateTime: '2026-01-31 18:23', 
    tailNumber: 'N586BJ', 
    duration: '18m', 
    operator: 'J. Doe',
    status: 'online',
    details: { distance: '380 ft', maxSpeed: '1.9 mph', events: 0, batteryEnd: '88%', path: 'Hangar 1 -> Hangar 2' }
  },
  { 
    id: '6', 
    dateTime: '2026-01-31 14:12', 
    tailNumber: 'N994LL', 
    duration: '25m', 
    operator: 'M. Chen',
    status: 'online',
    details: { distance: '520 ft', maxSpeed: '2.3 mph', events: 0, batteryEnd: '72%', path: 'Hangar 2 -> Ramp' }
  },
  { 
    id: '7', 
    dateTime: '2026-01-31 09:45', 
    tailNumber: 'N812XP', 
    duration: '14m', 
    operator: 'S. Ramos', 
    status: 'online',
    details: { distance: '310 ft', maxSpeed: '1.7 mph', events: 0, batteryEnd: '91%', path: 'Ramp -> Hangar 3' }
  },
];
