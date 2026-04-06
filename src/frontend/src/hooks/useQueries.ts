import { useParametersStore } from "@/state/parametersStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UpdateParams } from "../backend";
import { useActor } from "./useActor";

export function useGetParameters() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ["parameters"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      const params = await actor.getParameters();
      return {
        interestRate: params.interestRate,
        processingFeeRate: params.processingFeeRate,
        gstRate: params.gstRate,
        insurancePer1000: params.insurancePer1000,
        numberOfPersons: Number(params.numberOfPersons),
      };
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateParameters() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { setParameters } = useParametersStore();

  return useMutation({
    mutationFn: async (params: UpdateParams) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateParameters(params);
    },
    onSuccess: async () => {
      // Refetch parameters from backend
      const result = await queryClient.fetchQuery({
        queryKey: ["parameters"],
        queryFn: async () => {
          if (!actor) throw new Error("Actor not available");
          const params = await actor.getParameters();
          return {
            interestRate: params.interestRate,
            processingFeeRate: params.processingFeeRate,
            gstRate: params.gstRate,
            insurancePer1000: params.insurancePer1000,
            numberOfPersons: Number(params.numberOfPersons),
          };
        },
      });

      // Update local store
      setParameters(result);
    },
  });
}
