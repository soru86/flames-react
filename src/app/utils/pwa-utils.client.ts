import ResponseObject from "../shapes/response-object";

export async function checkConnectivity(
  online: () => void,
  offline: () => void
): Promise<ResponseObject> {
  try {
    if (navigator.onLine) {
      online();
      return {
        status: "success",
        message: "Connected to the internet",
      };
    } else {
      offline();
      return {
        status: "bad",
        message: "No internet connection available",
      };
    }
  } catch (err) {
    console.debug(err);
    throw new Error("Unable to check network connectivity!");
  }
}

export async function EnableFullScreenMode(): Promise<ResponseObject> {
  try {
    if (document.fullscreenEnabled) {
      document.documentElement.requestFullscreen();
      return {
        status: "success",
        message: "Fullscreen mode activated",
      };
    } else {
      return {
        status: "bad",
        message: "Fullscreen mode not supported",
      };
    }
  } catch (err) {
    console.debug(err);
    throw new Error("Error activating fullscreen mode!");
  }
}

// Exit fullscreen mode
export async function ExitFullScreenMode(): Promise<ResponseObject> {
  try {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      return {
        status: "success",
        message: "Fullscreen mode deactivated",
      };
    } else {
      return {
        status: "bad",
        message: "Fullscreen mode not supported",
      };
    }
  } catch (err) {
    console.debug(err);
    throw new Error("Error deactivating fullscreen mode!");
  }
}

export async function SendNotification(
  title: string,
  options: NotificationOptions
) {
  try {
    if ("Notification" in window) {
      const permissions = await (
        await navigator.permissions.query({ name: "notifications" })
      ).state;
      navigator.permissions
        .query({ name: "notifications" })
        .then((permissionStatus) => {
          if (permissionStatus.state === "granted") {
            return;
          } else {
            return Notification.requestPermission();
          }
        });

      if (permissions === "granted") {
        await navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, options);
          return {
            status: "success",
            message: "Sent Notification to user successfully",
          };
        });
      } else {
        return {
          status: "bad",
          message: "Denied access to sending notifications!",
        };
      }
    } else {
      return {
        status: "bad",
        message: "Notification API not supported",
      };
    }
  } catch (error) {
    console.debug(error);
    throw new Error("Error sending notification!");
  }
}
