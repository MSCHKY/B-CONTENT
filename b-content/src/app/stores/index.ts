import { create } from "zustand";
import type {
    AppView,
    CreateFlowState,
    InstanceId,
    TopicFieldId,
    PostLanguage,
    ImageFormat,
} from "@/types";

// --- App Navigation Store ---

interface AppStore {
    view: AppView;
    setView: (view: AppView) => void;
}

export const useAppStore = create<AppStore>((set) => ({
    view: "create",
    setView: (view) => set({ view }),
}));

// --- Create Flow Store ---

const initialCreateState: CreateFlowState = {
    step: 1,
    instance: null,
    contentType: null,
    topicField: null,
    userInput: "",
    language: "en",
    generatedText: null,
    generatedImageUrl: null,
    imageFormat: "single-square",
    isGenerating: false,
};

interface CreateStore extends CreateFlowState {
    // Step navigation
    goToStep: (step: CreateFlowState["step"]) => void;
    nextStep: () => void;
    prevStep: () => void;

    // Selections
    selectInstance: (id: InstanceId) => void;
    selectContentType: (id: string) => void;
    selectTopicField: (id: TopicFieldId) => void;
    setUserInput: (input: string) => void;
    setLanguage: (lang: PostLanguage) => void;
    setImageFormat: (format: ImageFormat) => void;

    // Generation
    setGeneratedText: (text: string) => void;
    setGeneratedImageUrl: (url: string | null) => void;
    setIsGenerating: (loading: boolean) => void;

    // Reset
    reset: () => void;
}

export const useCreateStore = create<CreateStore>((set) => ({
    ...initialCreateState,

    goToStep: (step) => set({ step }),
    nextStep: () =>
        set((state) => ({
            step: Math.min(state.step + 1, 4) as CreateFlowState["step"],
        })),
    prevStep: () =>
        set((state) => ({
            step: Math.max(state.step - 1, 1) as CreateFlowState["step"],
        })),

    selectInstance: (id) =>
        set({ instance: id, contentType: null, step: 2 }),
    selectContentType: (id) => set({ contentType: id, step: 3 }),
    selectTopicField: (id) => set({ topicField: id }),
    setUserInput: (input) => set({ userInput: input }),
    setLanguage: (lang) => set({ language: lang }),
    setImageFormat: (format) => set({ imageFormat: format }),

    setGeneratedText: (text) => set({ generatedText: text }),
    setGeneratedImageUrl: (url) => set({ generatedImageUrl: url }),
    setIsGenerating: (loading) => set({ isGenerating: loading }),

    reset: () => set(initialCreateState),
}));
