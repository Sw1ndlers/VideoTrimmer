"use client";

import { listen } from "@tauri-apps/api/event";
import { useEffect, useRef, useState } from "react";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import Header from "@/components/Header";
import RangeSlider from "@/components/RangeSlider";
import VideoPlayer from "@/components/VideoPlayer";
import VideoControls from "@/components/VideoControls";

export default function Home() {
	const [assetUrl, setAssetUrl] = useState("");

	const [startPercentage, setStartPercentage] = useState(0);
	const [endPercentage, setEndPercentage] = useState(1);
	const [videoLoaded, setVideoLoaded] = useState(false);
	const [videoPlaying, setVideoPlaying] = useState(false);
	const [videoCurrentTime, setVideoCurrentTime] = useState(0);

    const [videoPath, setVideoPath] = useState<string | null>(null);

	const videoRef = useRef<HTMLVideoElement>(null);
	let updateInterval: any = null;

	function onPlayPauseClick() {
		if (!videoRef.current) return;

		if (videoRef.current.paused) {
			videoRef.current.play();
			setVideoPlaying(true);

			updateInterval = setInterval(() => {
				setVideoCurrentTime(videoRef.current!.currentTime);
			}, 1);
		} else {
			videoRef.current.pause();
			setVideoPlaying(false);

			clearInterval(updateInterval);
		}
	}

	useEffect(() => {
		if (!videoRef.current) return;

		const lowerBound = startPercentage * videoRef.current.duration;
		const upperBound = endPercentage * videoRef.current.duration;

		if (videoCurrentTime > upperBound) {
			videoRef.current.currentTime = lowerBound;
		} else if (videoCurrentTime < lowerBound) {
			videoRef.current.currentTime = lowerBound;
		}
	}, [videoCurrentTime]);

	return (
		<div className=" bg-neutral-950 h-screen w-full flex flex-col">

			<div className="w-full h-full p-2 flex flex-col gap-1">
				<div className="flex flex-row h-10 -mt-1 items-center justify-between px-1">
					<div className=" flex gap-2">
						<input
							className="bg-neutral-900 text-sm p-1 rounded-md focus:shadow-lg border border-transparent focus:border focus:border-neutral-300/50"
							placeholder="Title"
						/>
						<p className=" translate-y-1 text-xl">.</p>
						<input
							className="bg-neutral-900 text-sm p-1 rounded-md focus:shadow-lg border border-transparent focus:border focus:border-neutral-300/50 w-12"
							placeholder="ext"
						/>
					</div>

					<button
						className=" bg-neutral-900 text-sm px-2 py-1 rounded-md"
						onClick={() => {
							// window.location.href = "/process";
						}}
					>
						Finalize Video
					</button>
				</div>

				<VideoPlayer
					onPlayPauseClick={onPlayPauseClick}
					videoRef={videoRef}
					assetUrl={assetUrl}
					setAssetUrl={setAssetUrl}
					setVideoLoaded={setVideoLoaded}
				/>

				<RangeSlider
					videoRef={videoRef}
					setStartPercentage={setStartPercentage}
					setEndPercentage={setEndPercentage}
					videoLoaded={videoLoaded}
					videoDuration={videoRef.current?.duration}
					videoCurrentTime={videoCurrentTime}
					currentTime={videoCurrentTime}
				/>

				<VideoControls
					videoRef={videoRef}
					onPlayPauseClick={onPlayPauseClick}
					setVideoPlaying={setVideoPlaying}
					videoPlaying={videoPlaying}
					setVideoCurrentTime={setVideoCurrentTime}
					videoCurrentTime={videoCurrentTime}
					videoLength={videoRef.current?.duration}
					startPercentage={startPercentage}
					endPercentage={endPercentage}
				/>
			</div>
		</div>
	);
}
