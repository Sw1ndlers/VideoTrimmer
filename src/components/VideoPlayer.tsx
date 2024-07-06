"use client";

import { RefObject } from "react";

export default function VideoPlayer({
	onPlayPauseClick,
	videoRef,
	assetUrl,
	fileHovering,
}: {
	onPlayPauseClick: () => void;
	videoRef: RefObject<HTMLVideoElement>;
	assetUrl: string;
	fileHovering: boolean;
}) {
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
