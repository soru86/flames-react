// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useDispatch } from "react-redux";
import AnimationsContainer from "./animations-container";
import { useEffect } from "react";
import {
  fetchAnimations,
  setNetworkStatus,
} from "../common/redux/reducers/animations-slice";
import { useSelector } from "react-redux";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { isConnectionAlive } from "../utils/utils";

const selector = (state) => {
  return state?.animations?.animations;
};

const errorSelector = (state) => {
  return state;
};

const handleConnection = async (dispatch: CallableFunction) => {
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
    toast("You're offline!", { type: "error" });
  }
};

const Animations = () => {
  const animations = useSelector(selector);
  const state = useSelector(errorSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchAnimations());
    };
    fetchData();
  }, []);

  useEffect(() => {
    window.addEventListener("online", () => handleConnection(dispatch));
    window.addEventListener("offline", () => handleConnection(dispatch));

    return () => {
      window.removeEventListener("online", () => handleConnection(dispatch));
      window.removeEventListener("offline", () => handleConnection(dispatch));
    };
  }, []);

  useEffect(() => {
    if (state?.animations?.error) {
      toast(state?.animations?.error, { type: "error" });
    }
  }, [state]);

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
