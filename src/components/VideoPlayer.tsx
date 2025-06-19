"use client";

import { listen } from "@tauri-apps/api/event";
import { convertFileSrc } from "@tauri-apps/api/core";
import { RefObject, useEffect, useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { videoExtensions } from "@/utils";
import { getCurrentWindow } from "@tauri-apps/api/window";

export default function VideoPlayer({
	onPlayPauseClick,
	videoRef,
	assetUrl,
	setAssetUrl,
	setVideoLoaded,
	setVideoPath,
}: {
	onPlayPauseClick: () => void;
	videoRef: RefObject<HTMLVideoElement>;
	assetUrl: string;
	setAssetUrl: (url: string) => void;
	setVideoLoaded: (loaded: boolean) => void;
	setVideoPath: (path: string) => void;
}) {
	const [fileHovering, setFileHovering] = useState(false);
	const appWindow = getCurrentWindow();

	function setVideo(filePath: string) {
		const assetUrl = convertFileSrc(filePath);

		setAssetUrl(assetUrl);
		setVideoPath(filePath);
		setVideoLoaded(true);
	}

	async function onClick() {
		const videoPath = await open({
			multiple: false,
			filters: [{ name: "Videos", extensions: videoExtensions }],
		});

		if (!videoPath) return;

		setVideo(videoPath as string);
	}

	useEffect(() => {
		const unlisten = appWindow.onDragDropEvent((event) => {
			if (event.payload.type === "over") {
				setFileHovering(true);
			} else if (event.payload.type === "drop") {
				setFileHovering(false);
				const filePath = event.payload.paths[0];
				setVideo(filePath);
			} else {
				setFileHovering(false);
			}
		});

		return () => {
			unlisten.then((unlistenFn) => unlistenFn());
		};
	}, []);

	return (
		<div className="relative flex-grow overflow-hidden">
			{assetUrl != "" ? (
				<video
					loop
					className="absolute object-fill max-h-full "
					ref={videoRef}
					src={assetUrl}
					onClick={onPlayPauseClick}
					style={{
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
					}}
				/>
			) : (
				<div className="border-dashed border h-full w-full rounded-lg">
					<p
						className={`
                            ${fileHovering ? "text-neutral-300" : "text-neutral-500"} 
                            flex justify-center items-center h-full w-full text-2xl hover:cursor-pointer
                        `}
						onClick={onClick}
					>
						Click or Drag a Video
					</p>
				</div>
			)}
		</div>
	);
}
