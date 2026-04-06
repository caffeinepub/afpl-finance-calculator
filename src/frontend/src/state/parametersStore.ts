import type { CalculationParameters } from "@/lib/calculator";
import { defaultParameters } from "@/lib/defaultParameters";
import { create } from "zustand";

interface ParametersStore {
  parameters: CalculationParameters;
  setParameters: (params: CalculationParameters) => void;
  loadParameters: () => void;
}

const STORAGE_KEY = "afpl-calculator-parameters";

function loadFromStorage(): CalculationParameters {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load parameters from storage:", error);
  }
  return defaultParameters;
}

function saveToStorage(params: CalculationParameters): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  } catch (error) {
    console.error("Failed to save parameters to storage:", error);
  }
}

export const useParametersStore = create<ParametersStore>((set) => ({
  parameters: loadFromStorage(),
  setParameters: (params) => {
    saveToStorage(params);
    set({ parameters: params });
  },
  loadParameters: () => {
    const params = loadFromStorage();
    set({ parameters: params });
  },
}));
