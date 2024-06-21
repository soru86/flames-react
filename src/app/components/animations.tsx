// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useDispatch } from "react-redux";
import AnimationsContainer from "./animations-container";
import { useCallback, useEffect } from "react";
import {
  fetchAnimations,
  setNetworkStatus,
} from "../common/redux/reducers/animations-slice";
import { useSelector } from "react-redux";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { isConnectionAlive } from "../utils/utils";
import { syncOfflineAnimations } from "../common/redux/reducers/resilient-sync-slice";

const selector = (state) => {
  return state?.animations?.animations;
};

const errorSelector = (state) => state?.animations?.error;

const offlineAnimationsSelector = (state) =>
  state?.offlineAnimations?.offlineAnimations;

const handleConnection = async (
  unsyncedAnimations: Array<Animation>,
  dispatch: CallableFunction
) => {
  if (navigator.onLine) {
    const online = await isConnectionAlive();
    if (online) {
      dispatch(setNetworkStatus("online"));
      toast("Back online!", { type: "success" });
      toast("Starting data sync with server...", {
        type: "info",
      });
      const response = await dispatch(
        syncOfflineAnimations(unsyncedAnimations)
      );

      if (!response?.error) {
        toast("Data sync completed!", {
          type: "success",
        });
      }
    } else {
      toast("No connectivity!", { type: "error" });
    }
  } else {
    dispatch(setNetworkStatus("offline"));
    toast("You're offline!", { type: "error" });
  }
};

const Animations = () => {
  const animations = useSelector(selector);
  const error = useSelector(errorSelector);
  const unsyncedAnimations = useSelector(offlineAnimationsSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchAnimations());
    };
    fetchData();
  }, []);

  const eventCallback = useCallback(
    () => handleConnection(unsyncedAnimations, dispatch),
    [unsyncedAnimations, dispatch]
  );

  useEffect(() => {
    window.addEventListener("online", eventCallback);
    window.addEventListener("offline", eventCallback);

    return () => {
      window.removeEventListener("online", eventCallback);
      window.removeEventListener("offline", eventCallback);
    };
  }, []);

  useEffect(() => {
    if (error) {
      toast(error, { type: "error" });
    }
  }, [error]);

  return (
    <div>
      <AnimationsContainer animations={animations} />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </div>
  );
};

export default Animations;
