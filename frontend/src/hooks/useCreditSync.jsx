import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getSocket } from "../lib/socket";
import { updateCredits } from "../features/auth/authSlice";

// Global realtime credit sync — mount once inside PrivateComponent.
// Listens for backend "credits_updated" (admin grant + roadmap deduct)
// and updates redux + localStorage instantly, then refreshes cached queries.
export default function useCreditSync(token) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) return;
    const socket = getSocket(token);
    if (!socket) return;

    const onCreditsUpdated = (payload) => {
      const next =
        typeof payload === "number"
          ? payload
          : payload?.credits ?? payload?.creditBalance;
      if (typeof next !== "number") return;

      dispatch(updateCredits(next));
      queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["creditHistory"] });

      if (payload?.reason === "roadmap_generated") {
        toast.success(`Roadmap generated • Balance: ${next} credits`);
      } else if (payload?.status === "granted") {
        toast.success(`🎉 Credits updated • New balance: ${next}`);
      }
    };

    socket.on("credits_updated", onCreditsUpdated);
    return () => {
      socket.off("credits_updated", onCreditsUpdated);
    };
  }, [token, dispatch, queryClient]);
}
