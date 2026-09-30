import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";

class CameraManager {
  cameraRef: any = null;
  constructor() {
    makeAutoObservable(this);
  }
  setCameraRef(ref: any) {
    this.cameraRef = ref;
  }
}

class EnvManager {
  envVisibility: boolean = false;
  envRotation = { x: 0, y: -Math.PI / 6, z: 1.5 };
  envIntensity: number = 1.0;
  environmentTexture: any = null;
  constructor() {
    makeAutoObservable(this);
  }
}

class HosePipe3DManager {
  minX: number = 0;
  maxX: number = 0;
  groupRef: any = null;
  currentModelUrl: string | null = null;
  constructor() {
    makeAutoObservable(this);
  }
  setBounds(minX: number, maxX: number) {
    this.minX = minX;
    this.maxX = maxX;
  }
  setGroupRef(ref: any) {
    this.groupRef = ref;
  }
  setCurrentModelUrl(url: string | null) {
    this.currentModelUrl = url;
  }
}

class Design3DManager {
  cameraManager = new CameraManager();
  envManager = new EnvManager();
  hosePipe3DManager = new HosePipe3DManager();
  constructor() {
    makeAutoObservable(this);
  }
}

class ViewManager {
  viewerReady: boolean = false;
  constructor() {
    makeAutoObservable(this);
  }
  setViewerReady() {
    this.viewerReady = true;
  }
}

class StepManager {
  currentStep: number = 1;
  constructor() {
    makeAutoObservable(this);
  }
}

class DesignManager {
  viewManager = new ViewManager();
  stepManager = new StepManager();
  constructor() {
    makeAutoObservable(this);
  }
}

class ConfiguratorStore {
  hoseData: any = null;

  selectedSeriesId: number | null = null;
  selectedBraidId: number | null = null;
  selectedSizeId: number | null = null;

  constructor() {
    makeAutoObservable(this);
    this.fetchHoseData();
  }

  async fetchHoseData() {
    try {
      const res = await fetch("/data/hose.json");
      const data = await res.json();
      this.setHoseData(data);
    } catch (e) {
      console.error("Failed to load hose.json", e);
    }
  }

  setHoseData(data: any) {
    this.hoseData = data;
    // Auto-select first available options
    if (data && data.hoseSeries?.length > 0) {
      this.setSeriesId(data.hoseSeries[0].id);
    }
  }

  setSeriesId(id: number) {
    this.selectedSeriesId = id;
    const series = this.hoseData?.hoseSeries.find((s: any) => s.id === id);
    if (series?.braids?.length > 0) {
      this.setBraidId(series.braids[0].id);
    } else {
      this.setBraidId(null);
    }
  }

  setBraidId(id: number | null) {
    this.selectedBraidId = id;
    const series = this.hoseData?.hoseSeries.find(
      (s: any) => s.id === this.selectedSeriesId,
    );
    const braid = series?.braids?.find((b: any) => b.id === id);
    if (braid?.sizes?.length > 0) {
      this.setSizeId(braid.sizes[0].id);
    } else {
      this.setSizeId(null);
    }
  }

  setSizeId(id: number | null) {
    this.selectedSizeId = id;
  }

  get activeModelName() {
    if (
      !this.hoseData ||
      !this.selectedSeriesId ||
      !this.selectedBraidId ||
      !this.selectedSizeId
    )
      return "";

    const series = this.hoseData.hoseSeries.find(
      (s: any) => s.id === this.selectedSeriesId,
    );
    const braid = series?.braids?.find(
      (b: any) => b.id === this.selectedBraidId,
    );
    const size = braid?.sizes?.find((s: any) => s.id === this.selectedSizeId);

    if (series && braid && size) {
      return `${series.name} - ${braid.name} (${size.value})`;
    }
    return "No Selection";
  }
}

class FeedbackManager {
  approvedModels: Set<string> = new Set();
  rejectedModels: Set<string> = new Set();

  constructor() {
    makeAutoObservable(this);
  }

  setInitialFeedbackState(approved: string[], rejected: string[]) {
    this.approvedModels = new Set(approved);
    this.rejectedModels = new Set(rejected);
  }

  approveModel(modelName: string) {
    this.approvedModels.add(modelName);
    this.rejectedModels.delete(modelName);
  }

  rejectModel(modelName: string) {
    this.rejectedModels.add(modelName);
    this.approvedModels.delete(modelName);
  }
}

class RootStore {
  design3DManager = new Design3DManager();
  designManager = new DesignManager();
  configuratorStore = new ConfiguratorStore();
  feedbackManager = new FeedbackManager();
  constructor() {
    makeAutoObservable(this);
  }
}

const store = new RootStore();
const MainContext = createContext(store);

// Auto-sync model URL to HosePipe3DManager
import { autorun } from "mobx";
autorun(() => {
  const { configuratorStore, design3DManager } = store;
  if (configuratorStore.hoseData) {
    const series = configuratorStore.hoseData.hoseSeries.find(
      (s: any) => s.id === configuratorStore.selectedSeriesId,
    );
    const braid = series?.braids?.find(
      (b: any) => b.id === configuratorStore.selectedBraidId,
    );
    const size = braid?.sizes?.find(
      (s: any) => s.id === configuratorStore.selectedSizeId,
    );

    if (size?.modelURL) {
      design3DManager.hosePipe3DManager.setCurrentModelUrl(size.modelURL);
    } else {
      design3DManager.hosePipe3DManager.setCurrentModelUrl(null);
    }
  }
});

export const useMainContext = () => {
  return useContext(MainContext);
};

export const MainContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <MainContext.Provider value={store}>{children}</MainContext.Provider>;
};
