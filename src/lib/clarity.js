import Clarity from '@microsoft/clarity';

const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID;

/** Starts Microsoft Clarity session recording/heatmaps. No-op when unconfigured or in dev. */
export const initClarity = () => {
    if (!CLARITY_PROJECT_ID || import.meta.env.DEV) return;
    Clarity.init(CLARITY_PROJECT_ID);
};
