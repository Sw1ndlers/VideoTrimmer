
import { WebviewWindow } from "@tauri-apps/api/window";
import { useState, useEffect } from "react";


export function useAppWindow() {
    const [appWindow, setAppWindow] = useState<WebviewWindow>();

    // Import appWindow and save it inside the state for later usage
    async function setupAppWindow() {
        const appWindow = (await import("@tauri-apps/api/window")).appWindow;
        setAppWindow(appWindow);
    }

    useEffect(() => {
        setupAppWindow();
    }, []);

    return appWindow;
}