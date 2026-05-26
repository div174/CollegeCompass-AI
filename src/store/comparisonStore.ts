import { create } from "zustand";
import { persist } from "zustand/middleware";
import { College } from "@/types";

interface ComparisonState {
  selectedColleges: College[];
  addCollege: (college: College) => { success: boolean; message: string };
  removeCollege: (collegeId: string) => void;
  clearComparison: () => void;
  isCompared: (collegeId: string) => boolean;
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      selectedColleges: [],

      addCollege: (college: College) => {
        const { selectedColleges } = get();
        
        // Check if already in comparison
        if (selectedColleges.some((c) => c.id === college.id)) {
          return { success: false, message: "College already added to comparison!" };
        }

        // Limit to 3 colleges
        if (selectedColleges.length >= 3) {
          return {
            success: false,
            message: "You can compare up to 3 colleges at a time. Remove one to add another.",
          };
        }

        set({ selectedColleges: [...selectedColleges, college] });
        return { success: true, message: `${college.name} added to comparison.` };
      },

      removeCollege: (collegeId: string) => {
        const { selectedColleges } = get();
        set({
          selectedColleges: selectedColleges.filter((c) => c.id !== collegeId),
        });
      },

      clearComparison: () => {
        set({ selectedColleges: [] });
      },

      isCompared: (collegeId: string) => {
        return get().selectedColleges.some((c) => c.id === collegeId);
      },
    }),
    {
      name: "campus-compass-comparison-store", // Name of the key in localStorage
    }
  )
);
