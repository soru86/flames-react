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
import {
  setSyncStatus,
  syncOfflineAnimations,
} from "../common/redux/reducers/resilient-sync-slice";

const animationsSelector = (state) => {
  return state?.animations?.animations;
};

const errorSelector = (state) => state?.animations?.error;

const offlineAnimationsSelector = (state) =>
  state?.offlineAnimations?.offlineAnimations;

const syncStatusSelector = (state) => state?.offlineAnimations?.syncStatus;

const networkStatusSelector = (state) => state?.animations?.networkStatus;

const handleConnection = async (
  syncStatus: string,
  unsyncedAnimations: Array<Animation>,
  dispatch: CallableFunction
) => {
  if (navigator.onLine) {
    const online = await isConnectionAlive();
    if (online) {
      dispatch(setNetworkStatus("online"));
      toast("Back online!", { type: "success" });
    } else {
      toast("No connectivity!", { type: "error" });
    }
  } else {
    dispatch(setNetworkStatus("offline"));
    dispatch(setSyncStatus("pending"));
    toast("You're offline!", { type: "error" });
  }
};

const Animations = () => {
  const animations = useSelector(animationsSelector);
  const error = useSelector(errorSelector);
  const unsyncedAnimations = useSelector(offlineAnimationsSelector);
  const syncStatus = useSelector(syncStatusSelector);
  const nwStatus = useSelector(networkStatusSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchAnimations());
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const synchronizeData = async () => {
      if (
        nwStatus === "online" &&
        syncStatus === "pending" &&
        unsyncedAnimations?.length
      ) {
        toast("Starting data sync with server...", {
          type: "info",
        });

        const response = await dispatch(
          syncOfflineAnimations(unsyncedAnimations)
        );

        if (!response?.error) {
          dispatch(setSyncStatus("completed"));
          toast("Data sync completed!", {
            type: "success",
          });
        }
      }
    };
    synchronizeData();
  }, [nwStatus, unsyncedAnimations, syncStatus, dispatch]);

  useEffect(() => {
    if (syncStatus === "completed" || !error) {
      const fetchUpdatedData = async () => {
        await dispatch(fetchAnimations());
      };
      fetchUpdatedData();
    }
  }, [syncStatus, error, dispatch]);

  const eventCallback = useCallback(() => {
    handleConnection(syncStatus, unsyncedAnimations, dispatch);
  }, []);

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
