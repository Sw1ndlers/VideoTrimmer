"use client";

import { useEffect, useState } from "react";
import { Maximize, MinusIcon, XIcon } from "lucide-react";
import { WebviewWindow } from "@tauri-apps/api/window";

function TilebarButton({
	icon,
	className,
	onClick,
}: {
	icon: any;
	className: string;
	onClick: () => void;
}) {
	return (
		<div
			className={`size-7 flex justify-center items-center rounded-sm ${className}`}
			onClick={onClick}
		>
			{icon}
		</div>
	);
}

export default function Header() {
	const [appWindow, setAppWindow] = useState<WebviewWindow>();

	// Import appWindow and save it inside the state for later usage
	async function setupAppWindow() {
		const appWindow = (await import("@tauri-apps/api/window")).appWindow;
		setAppWindow(appWindow);
	}

    useEffect(() => {
		setupAppWindow();
	}, []);

	// These 3 functions will see the "appWindow" stored inside the state
	function windowMinimize() {
		appWindow?.minimize();
	}
	function windowToggleMaximize() {
		appWindow?.toggleMaximize();
	}
	function windowClose() {
		appWindow?.close();
	}

	return (
		<div
			data-tauri-drag-region
			className="
            rounded-t-md w-screen h-10 border-b 
            border-neutral-800 
            flex items-center justify-between px-2
            z-50
            "
		>
			<div>
				<button className=" text-xs hover:bg-neutral-800 px-2 py-1 rounded-sm">
					Open File
				</button>
			</div>

			<div className=" w-max flex flex-row gap-1">
				<TilebarButton
					icon={<MinusIcon />}
					className="hover:bg-neutral-300/30 bg-none bg-opacity-40 p-1"
					onClick={windowMinimize}
				/>
				<TilebarButton
					icon={<Maximize />}
					className=" hover:bg-neutral-300/30   p-1"
					onClick={windowToggleMaximize}
				/>
				<TilebarButton
					icon={<XIcon />}
					className="hover:bg-red-600/80 p-0.5"
					onClick={windowClose}
				/>
			</div>
		</div>
	);
}
