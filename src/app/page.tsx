"use client";

import { listen } from "@tauri-apps/api/event";
import { RefObject, useEffect, useRef, useState } from "react";
import { convertFileSrc, invoke } from "@tauri-apps/api/tauri";
import Header from "@/components/header";

function VideoPlayer({
	videoRef,
	assetUrl,
	fileHovering,
}: {
	videoRef: RefObject<HTMLVideoElement>;
	assetUrl: string;
	fileHovering: boolean;
}) {
	// console.log(assetUrl);

	return (
		<div className="relative flex-grow overflow-hidden">
			{assetUrl != "" ? (
				<video
					className="absolute object-fill max-h-full "
					ref={videoRef}
					src={assetUrl}
					controls
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
                            flex justify-center items-center h-full w-full text-2xl 
                        `}
					>
						Drop a video file here
					</p>
				</div>
			)}
		</div>
	);
}

export default function Home() {
	const [fileHovering, setFileHovering] = useState(false);
	const [assetUrl, setAssetUrl] = useState("");
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		listen("tauri://file-drop-hover", (_event) => {
			setFileHovering(true);
		});

		listen("tauri://file-drop-cancelled", (_event) => {
			setFileHovering(false);
		});
	}, []);

	useEffect(() => {
		listen("tauri://file-drop", async (event: any) => {
			console.log(event == undefined);
			let filePath = event.payload[0];
			setFileHovering(false);

			// await invoke("extend_scope", {
			// 	path: filePath,
			// });

			const assetUrl = convertFileSrc(filePath);

			setAssetUrl(assetUrl);
		});
	}, [videoRef]);

	return (
		<div className="rounded-md bg-neutral-950 h-screen w-full flex flex-col">
			<Header />

			<div className="w-full h-full p-2 flex flex-col gap-2">
				<VideoPlayer
					fileHovering={fileHovering}
					videoRef={videoRef}
					assetUrl={assetUrl}
				/>

				<div className="bg-neutral-900 w-full h-16 flex items-center z-20 overflow-hidden">
					{/* Left Dot */}
					<div className=" bg-neutral-900 relative flex justify-center items-center">
						<span className="size-3 rounded-full bg-blue-800 absolute left-10 flex justify-center items-center">
							<span className=" h-2 bg-neutral-900 w-[10000px] right-0 absolute -z-10 rounded-r-full "></span>
						</span>
					</div>

					{/* Center Range */}
					<div className=" w-full h-2 bg-blue-900 -z-20"></div>

					{/* Right Dot */}
					<div className=" bg-neutral-900 relative flex justify-center items-center">
						<span className="size-3 rounded-full bg-blue-800 absolute right-10 flex justify-center items-center">
							<span className=" h-2 bg-neutral-900 w-[10000px] left-0 absolute -z-10 rounded-l-full"></span>
						</span>
					</div>
				</div>
				<div className="bg-neutral-900 w-full h-16"></div>
			</div>
		</div>
	);
}
