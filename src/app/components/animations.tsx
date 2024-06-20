// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useDispatch } from "react-redux";
import AnimationsContainer from "./animations-container";
import { useEffect } from "react";
import { fetchAnimations } from "../common/redux/reducers/animations-slice";
import { useSelector } from "react-redux";
import { Bounce, ToastContainer, toast } from "react-toastify";

const selector = (state) => {
  return state?.animations?.animations;
};

const errorSelector = (state) => {
  return state;
};

function Animations() {
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
    if (state?.animations?.error) {
      toast(state?.animations?.error);
    }
  }, [state]);

  return (
    <div>
      <AnimationsContainer animations={animations} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}

export default Animations;
