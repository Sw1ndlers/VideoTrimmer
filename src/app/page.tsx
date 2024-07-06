"use client";

import { listen } from "@tauri-apps/api/event";
import { useEffect, useRef, useState } from "react";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import Header from "@/components/Header";
import RangeSlider from "@/components/RangeSlider";
import VideoPlayer from "@/components/VideoPlayer";
import VideoControls from "@/components/VideoControls";

export default function Home() {
	const [fileHovering, setFileHovering] = useState(false);
	const [assetUrl, setAssetUrl] = useState("");

	const [startPercentage, setStartPercentage] = useState(0);
	const [endPercentage, setEndPercentage] = useState(1);
	const [videoLoaded, setVideoLoaded] = useState(false);
	const [videoPlaying, setVideoPlaying] = useState(false);
	const [videoCurrentTime, setVideoCurrentTime] = useState(0);

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

	function seekToPercentage(percentage: number) {
		if (!videoRef.current) return;

		videoRef.current.currentTime = percentage * videoRef.current.duration;
	}

	function seekToTime(time: number) {
		if (!videoRef.current) return;

		videoRef.current.currentTime = time;
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
			const assetUrl = convertFileSrc(filePath);

			setAssetUrl(assetUrl);
			setVideoLoaded(true);
		});
	}, []);

	return (
		<div className="rounded-md bg-neutral-950 h-screen w-full flex flex-col">
			<Header />

			<div className="w-full h-full p-2 flex flex-col gap-1">
				<VideoPlayer
					onPlayPauseClick={onPlayPauseClick}
					fileHovering={fileHovering}
					videoRef={videoRef}
					assetUrl={assetUrl}
				/>

				<RangeSlider
					startPercentage={startPercentage}
					endPercentage={endPercentage}
					setStartPercentage={setStartPercentage}
					setEndPercentage={setEndPercentage}
					videoLoaded={videoLoaded}
					videoDuration={videoRef.current?.duration}
					seekToPercentage={seekToPercentage}
					videoCurrentTime={videoCurrentTime}
					currentTime={videoCurrentTime}
					seekToTime={seekToTime}
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
