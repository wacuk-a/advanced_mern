import { create } from 'zustand';
import { jsonrpc } from '../utils/jsonrpc';
import { getSocket } from '../utils/socket';

interface PanicEvent {
  eventId: string;
  status: 'active' | 'resolved' | 'false_alarm' | 'aborted';
  location: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp: Date;
  };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  triggerType: string;
  countdownSeconds?: number;
}

interface PanicState {
  activeEvent: PanicEvent | null;
  isActivating: boolean;
  countdown: number | null;
  activatePanic: (triggerType?: string, location?: GeolocationPosition) => Promise<void>;
  deactivatePanic: (reason?: string) => Promise<void>;
  updateLocation: (location: GeolocationPosition) => Promise<void>;
  startCountdown: (seconds: number) => void;
  stopCountdown: () => void;
}

export const usePanicStore = create<PanicState>((set, get) => ({
  activeEvent: null,
  isActivating: false,
  countdown: null,

  activatePanic: async (triggerType = 'button', location?: GeolocationPosition) => {
    try {
      set({ isActivating: true });

      // Get current location if not provided
      let currentLocation = location;
      if (!currentLocation && navigator.geolocation) {
        currentLocation = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });
      }

      if (!currentLocation) {
        throw new Error('Location access required for panic button');
      }

      const result = await jsonrpc.call('panic.activate', {
        triggerType,
        location: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          accuracy: currentLocation.coords.accuracy
        },
        countdownSeconds: 30,
        riskLevel: 'high'
      });

      const panicEvent: PanicEvent = {
        eventId: result.eventId,
        status: result.status,
        location: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          accuracy: currentLocation.coords.accuracy,
          timestamp: new Date()
        },
        riskLevel: 'high',
        triggerType,
        countdownSeconds: result.countdownSeconds
      };

      set({
        activeEvent: panicEvent,
        isActivating: false,
        countdown: result.countdownSeconds || 30
      });

      // Start countdown
      if (result.countdownSeconds) {
        get().startCountdown(result.countdownSeconds);
      }

      // Start location tracking
      if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            get().updateLocation(position);
          },
          (error) => {
            console.error('Location tracking error:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );

        // Store watch ID for cleanup
        (window as any).panicLocationWatchId = watchId;
      }

      // Emit socket event
      const socket = getSocket();
      if (socket) {
        socket.emit('panic:activate', {
          eventId: result.eventId,
          location: panicEvent.location,
          riskLevel: panicEvent.riskLevel
        });
      }
    } catch (error) {
      console.error('Failed to activate panic button:', error);
      set({ isActivating: false });
      throw error;
    }
  },

  deactivatePanic: async (reason = 'aborted') => {
    try {
      const { activeEvent } = get();
      if (!activeEvent) {
        return;
      }

      await jsonrpc.call('panic.deactivate', {
        eventId: activeEvent.eventId,
        reason
      });

      // Stop location tracking
      if ((window as any).panicLocationWatchId) {
        navigator.geolocation.clearWatch((window as any).panicLocationWatchId);
        delete (window as any).panicLocationWatchId;
      }

      // Stop countdown
      get().stopCountdown();

      // Emit socket event
      const socket = getSocket();
      if (socket) {
        socket.emit('panic:deactivate', {
          eventId: activeEvent.eventId,
          reason
        });
      }

      set({
        activeEvent: null,
        countdown: null
      });
    } catch (error) {
      console.error('Failed to deactivate panic button:', error);
      throw error;
    }
  },

  updateLocation: async (location: GeolocationPosition) => {
    try {
      const { activeEvent } = get();
      if (!activeEvent || activeEvent.status !== 'active') {
        return;
      }

      await jsonrpc.call('panic.updateLocation', {
        eventId: activeEvent.eventId,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy
        }
      });

      // Update local state
      set({
        activeEvent: {
          ...activeEvent,
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            timestamp: new Date()
          }
        }
      });

      // Emit socket event
      const socket = getSocket();
      if (socket) {
        socket.emit('panic:location_update', {
          eventId: activeEvent.eventId,
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy
          }
        });
      }
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  },

  startCountdown: (seconds: number) => {
    set({ countdown: seconds });

    const interval = setInterval(() => {
      const { countdown, activeEvent } = get();
      if (countdown === null || countdown <= 0) {
        clearInterval(interval);
        return;
      }

      const newCountdown = countdown - 1;
      set({ countdown: newCountdown });

      // If countdown reaches 0 and panic is still active, contact emergency services
      if (newCountdown === 0 && activeEvent?.status === 'active') {
        // Emergency services would be contacted automatically by the backend
        console.warn('Countdown reached zero - emergency services should be contacted');
      }
    }, 1000);

    // Store interval ID for cleanup
    (window as any).panicCountdownInterval = interval;
  },

  stopCountdown: () => {
    if ((window as any).panicCountdownInterval) {
      clearInterval((window as any).panicCountdownInterval);
      delete (window as any).panicCountdownInterval;
    }
    set({ countdown: null });
  }
}));

