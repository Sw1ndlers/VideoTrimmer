"use client";

import { listen } from "@tauri-apps/api/event";
import { useEffect, useRef, useState } from "react";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import Header from "@/components/Header";
import RangeSlider from "@/components/RangeSlider";
import VideoPlayer from "@/components/VideoPlayer";
import VideoControls from "@/components/VideoControls";
import { invoke } from '@tauri-apps/api/tauri'

export default function Home() {
	const [assetUrl, setAssetUrl] = useState("");

	const [startPercentage, setStartPercentage] = useState(0);
	const [endPercentage, setEndPercentage] = useState(1);
	const [videoLoaded, setVideoLoaded] = useState(false);
	const [videoPlaying, setVideoPlaying] = useState(false);
	const [videoCurrentTime, setVideoCurrentTime] = useState(0);

    const [videoPath, setVideoPath] = useState<string | null>(null);
    const [videoName, setVideoName] = useState<string>("");
    const [videoExt, setVideoExt] = useState<string>("");

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

    function splitVideoPath(fullPath: string) {
        const fullVideoName = fullPath.split("\\");
        const extensionSplit = fullPath.split(".");

        const videoExt = extensionSplit[extensionSplit.length - 1];
        const videoName = fullVideoName[fullVideoName.length - 1].split("." + videoExt)[0];

        return {
            videoName,
            videoExt
        }
    }

    function createNewVideoPath(fullPath: string) {
        const videoFolder = fullPath.split("\\").slice(0, -1).join("\\");
        const newVideoPath = `${videoFolder}\\${videoName}.${videoExt}`;

        return newVideoPath;
    }

    async function onFinalizeVideo() {
        if (!videoPath || !videoRef.current) return;

        const newVideoPath = createNewVideoPath(videoPath);
        const videoLength = videoRef.current.duration;

        const result = invoke("process_video", {
            inputPath: videoPath,
            outputPath: newVideoPath,
            startTime: Math.max(startPercentage * videoLength, 0),
            endTime: Math.min(endPercentage * videoLength, videoLength)
        })

        console.log(result);
    }


    useEffect(() => {
        if (videoPath) {
            const { videoName, videoExt } = splitVideoPath(videoPath);
            setVideoName(videoName);
            setVideoExt(videoExt);
        }
    }, [videoPath]);

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
                            value={videoName}
                            onChange={(e) => setVideoName(e.target.value)}
                            
						/>
						<p className=" translate-y-1 text-xl">.</p>
						<input
							className="bg-neutral-900 text-sm p-1 rounded-md focus:shadow-lg border border-transparent focus:border focus:border-neutral-300/50 w-12"
							placeholder="ext"
                            value={videoExt}
                            onChange={(e) => setVideoExt(e.target.value)}
						/>
					</div>

					<button
						className=" bg-neutral-900 text-sm px-2 py-1 rounded-md"
						onClick={onFinalizeVideo}
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
                    setVideoPath={setVideoPath}
				/>

				<RangeSlider
					videoRef={videoRef}
                    startPercentage={startPercentage}
                    endPercentage={endPercentage}
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
