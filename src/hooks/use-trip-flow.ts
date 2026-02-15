import { useReducer, useCallback } from "react";
import {
  TripRequest,
  TripStep,
  FulfillmentOption,
  BookingConfirmation,
  SearchProgress,
  TripConstraints,
  Patient,
  Companion,
} from "@/lib/types";
import {
  getMockFleetOptions,
  getMockTNCOptions,
  getMockMarketplaceOptions,
} from "@/lib/mock-data";
import {
  delay,
  generateTripId,
  generateConfirmationNumber,
} from "@/lib/utils";

// === State ===

export interface TripFlowState {
  step: TripStep;
  tripRequest: TripRequest | null;
  options: FulfillmentOption[];
  selectedOption: FulfillmentOption | null;
  booking: BookingConfirmation | null;
  searchProgress: SearchProgress;
  errors: Record<string, string>;
}

const initialState: TripFlowState = {
  step: "prefill",
  tripRequest: null,
  options: [],
  selectedOption: null,
  booking: null,
  searchProgress: {
    fleet: "pending",
    tnc: "pending",
    marketplace: "pending",
  },
  errors: {},
};

// === Actions ===

export type TripFlowAction =
  | { type: "SET_TRIP_REQUEST"; payload: TripRequest }
  | { type: "UPDATE_TRIP"; payload: Partial<TripRequest> }
  | { type: "UPDATE_PATIENT"; payload: Partial<Patient> }
  | { type: "UPDATE_CONSTRAINTS"; payload: Partial<TripConstraints> }
  | { type: "SET_STEP"; payload: TripStep }
  | {
      type: "SEARCH_PROGRESS";
      payload: {
        source: "fleet" | "tnc" | "marketplace";
        status: "loading" | "done" | "error";
        results?: FulfillmentOption[];
      };
    }
  | { type: "SELECT_OPTION"; payload: FulfillmentOption }
  | { type: "CONFIRM_BOOKING"; payload: BookingConfirmation }
  | { type: "SET_ERRORS"; payload: Record<string, string> }
  | { type: "RESET" };

// === Reducer ===

function tripFlowReducer(
  state: TripFlowState,
  action: TripFlowAction
): TripFlowState {
  switch (action.type) {
    case "SET_TRIP_REQUEST":
      return {
        ...state,
        tripRequest: action.payload,
        step: "confirm",
        errors: {},
      };

    case "UPDATE_TRIP":
      if (!state.tripRequest) return state;
      return {
        ...state,
        tripRequest: { ...state.tripRequest, ...action.payload },
      };

    case "UPDATE_PATIENT":
      if (!state.tripRequest) return state;
      return {
        ...state,
        tripRequest: {
          ...state.tripRequest,
          patient: { ...state.tripRequest.patient, ...action.payload },
        },
      };

    case "UPDATE_CONSTRAINTS":
      if (!state.tripRequest) return state;
      return {
        ...state,
        tripRequest: {
          ...state.tripRequest,
          constraints: {
            ...state.tripRequest.constraints,
            ...action.payload,
          },
        },
      };

    case "SET_STEP":
      return { ...state, step: action.payload };

    case "SEARCH_PROGRESS": {
      const newProgress = {
        ...state.searchProgress,
        [action.payload.source]: action.payload.status,
      };
      const newOptions = action.payload.results
        ? [...state.options, ...action.payload.results]
        : state.options;

      // Auto-transition to compare when all done
      const allDone =
        newProgress.fleet === "done" &&
        newProgress.tnc === "done" &&
        newProgress.marketplace === "done";

      return {
        ...state,
        searchProgress: newProgress,
        options: newOptions,
        step: allDone ? "compare" : state.step,
      };
    }

    case "SELECT_OPTION":
      return {
        ...state,
        selectedOption: action.payload,
        step: "booking",
      };

    case "CONFIRM_BOOKING":
      return {
        ...state,
        booking: action.payload,
        step: "confirmed",
      };

    case "SET_ERRORS":
      return { ...state, errors: action.payload };

    case "RESET":
      return { ...initialState };

    default:
      return state;
  }
}

// === Hook ===

export function useTripFlow() {
  const [state, dispatch] = useReducer(tripFlowReducer, initialState);

  const simulateSearch = useCallback(
    async (constraints: TripConstraints) => {
      dispatch({ type: "SET_STEP", payload: "searching" });

      // Fleet: starts immediately, arrives in ~800ms
      dispatch({
        type: "SEARCH_PROGRESS",
        payload: { source: "fleet", status: "loading" },
      });
      await delay(800);
      dispatch({
        type: "SEARCH_PROGRESS",
        payload: {
          source: "fleet",
          status: "done",
          results: getMockFleetOptions(constraints),
        },
      });

      // TNC: starts after fleet, arrives in ~700ms
      dispatch({
        type: "SEARCH_PROGRESS",
        payload: { source: "tnc", status: "loading" },
      });
      await delay(700);
      dispatch({
        type: "SEARCH_PROGRESS",
        payload: {
          source: "tnc",
          status: "done",
          results: getMockTNCOptions(),
        },
      });

      // Marketplace: starts after TNC, arrives in ~1000ms
      dispatch({
        type: "SEARCH_PROGRESS",
        payload: { source: "marketplace", status: "loading" },
      });
      await delay(1000);
      dispatch({
        type: "SEARCH_PROGRESS",
        payload: {
          source: "marketplace",
          status: "done",
          results: getMockMarketplaceOptions(),
        },
      });
    },
    []
  );

  const confirmBooking = useCallback(
    async (option: FulfillmentOption) => {
      await delay(1500);

      const tripId = generateTripId();
      const confirmationNumber = generateConfirmationNumber();

      let pickupTime = "";
      let nextSteps: string[] = [];

      switch (option.type) {
        case "fleet":
          pickupTime = option.estimatedPickupTime;
          nextSteps = [
            `Driver ${option.driverName} assigned with vehicle ${option.vehicleId}`,
            "Patient will receive SMS notification with driver details",
            "Track trip status in the MediRoutes dashboard",
            "Driver will call patient 5 minutes before arrival",
          ];
          break;
        case "tnc":
          pickupTime = option.estimatedPickupTime;
          nextSteps = [
            `${option.providerDisplayName} ${option.serviceLevel} dispatched`,
            "Patient will receive ride details via SMS",
            `Estimated pickup in ${option.etaMinutes} minutes`,
            "Track ride status in the MediRoutes dashboard",
          ];
          break;
        case "marketplace":
          pickupTime = option.estimatedPickupTime;
          nextSteps = [
            `${option.providerName} confirmed and dispatched`,
            "Patient will receive provider details via SMS",
            `Estimated pickup in ${option.etaMinutes} minutes`,
            "Track trip status in the MediRoutes dashboard",
          ];
          break;
      }

      const booking: BookingConfirmation = {
        tripId,
        confirmationNumber,
        selectedOption: option,
        estimatedPickupTime: pickupTime,
        nextSteps,
      };

      dispatch({ type: "CONFIRM_BOOKING", payload: booking });
    },
    []
  );

  return { state, dispatch, simulateSearch, confirmBooking };
}
