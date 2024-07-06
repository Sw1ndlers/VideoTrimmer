"use client";

import { listen } from "@tauri-apps/api/event";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { RefObject, useEffect, useState } from "react";
import { open } from "@tauri-apps/api/dialog";
import { videoExtensions } from "@/utils";

export default function VideoPlayer({
	onPlayPauseClick,
	videoRef,
	assetUrl,
	setAssetUrl,
	setVideoLoaded,
}: {
	onPlayPauseClick: () => void;
	videoRef: RefObject<HTMLVideoElement>;
	assetUrl: string;
	setAssetUrl: (url: string) => void;
	setVideoLoaded: (loaded: boolean) => void;
}) {
	const [fileHovering, setFileHovering] = useState(false);

	function setVideo(filePath: string) {
		const assetUrl = convertFileSrc(filePath);

		setAssetUrl(assetUrl);
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
		listen("tauri://file-drop-hover", (_event) => {
			setFileHovering(true);
		});

		listen("tauri://file-drop-cancelled", (_event) => {
			setFileHovering(false);
		});

		listen("tauri://file-drop", async (event: any) => {
			setFileHovering(false);

			let filePath = event.payload[0];
			setVideo(filePath);
		});
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
