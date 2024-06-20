import Animation from "../shapes/animation";

function jp(jsonString: string) {
  return JSON.parse(jsonString);
}

function js(jsonObj: any) {
  return JSON.stringify(jsonObj);
}

function emptyAnimation(): Animation {
  return {
    id: "",
    title: "",
    definition: "",
    description: "",
    dimension: "",
    frameRate: 0,
    duration: 0,
    layers: 0,
    totalFrames: 0,
    fileSize: "",
  };
}

export { jp, js, emptyAnimation };
