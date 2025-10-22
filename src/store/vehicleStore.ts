import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vehicle } from '../types/Vehicle';
import { Comment } from '../types/Comment';

interface VehicleStore {
  vehicles: Vehicle[];
  addVehicle: (
    vehicle: Omit<
      Vehicle,
      'status' | 'technicianComment' | 'created' | 'updated' | 'comments'
    >,
  ) => void;
  updateVehicleStatus: (
    number: string,
    status: Vehicle['status'],
    technicianComment?: string,
  ) => void;
  deleteVehicle: (number: string) => void;
  addComment: (vehicleNumber: string, comment: Omit<Comment, 'id'>) => void;
  editComment: (
    vehicleNumber: string,
    commentId: string,
    newText: string,
  ) => void;
  deleteComment: (vehicleNumber: string, commentId: string) => void;
}

export const useVehicleStore = create<VehicleStore>()(
  persist(
    (set, get) => ({
      vehicles: [],
      addVehicle: vehicle =>
        set(state => ({
          vehicles: [
            ...state.vehicles,
            {
              ...vehicle,
              status: 'Pending',
              technicianComment: '',
              created: new Date().toISOString(),
              updated: new Date().toISOString(),
              comments: [],
            },
          ],
        })),
      updateVehicleStatus: (number, status, technicianComment) =>
        set(state => ({
          vehicles: state.vehicles.map(v =>
            v.number === number
              ? {
                  ...v,
                  status,
                  technicianComment: technicianComment ?? v.technicianComment,
                  updated: new Date().toISOString(),
                }
              : v,
          ),
        })),
      deleteVehicle: number =>
        set(state => ({
          vehicles: state.vehicles.filter(v => v.number !== number),
        })),
      addComment: (vehicleNumber, comment) =>
        set(state => ({
          vehicles: state.vehicles.map(v =>
            v.number === vehicleNumber
              ? {
                  ...v,
                  comments: [
                    ...(v.comments ?? []),
                    {
                      ...comment,
                      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                    },
                  ],
                }
              : v,
          ),
        })),
      editComment: (vehicleNumber, commentId, newText) =>
        set(state => ({
          vehicles: state.vehicles.map(v =>
            v.number === vehicleNumber
              ? {
                  ...v,
                  comments: v.comments?.map(c =>
                    c.id === commentId ? { ...c, text: newText } : c,
                  ),
                }
              : v,
          ),
        })),
      deleteComment: (vehicleNumber, commentId) =>
        set(state => ({
          vehicles: state.vehicles.map(v =>
            v.number === vehicleNumber
              ? {
                  ...v,
                  comments: v.comments?.filter(c => c.id !== commentId),
                }
              : v,
          ),
        })),
    }),
    {
      name: 'vehicle-storage',
      getStorage: () => AsyncStorage,
    },
  ),
);
