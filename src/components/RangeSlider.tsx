"use client";
import { clamp } from "@/utils";
import { useState, useRef, useEffect } from "react";

export type CurrentDragging = "Start" | "End" | "None";

export default function RangeSlider({
	startPercentage,
	endPercentage,
	setStartPercentage,
	setEndPercentage,
	videoLoaded,
	videoDuration,
	seekToPercentage,
	videoCurrentTime,
	currentTime,
	seekToTime,
}: {
	startPercentage: number;
	endPercentage: number;
	setStartPercentage: (percentage: number) => void;
	setEndPercentage: (percentage: number) => void;
	videoLoaded: boolean;
	videoDuration: number | undefined;
	seekToPercentage: (percentage: number) => void;
	videoCurrentTime: number;
	currentTime: number;
	seekToTime: (time: number) => void;
}) {
	const [currentDragging, setCurrentDragging] =
		useState<CurrentDragging>("None");
	const [currentTimePreviewOffset, setCurrentTimePreviewOffset] = useState(0);

	const containerRef = useRef<HTMLDivElement>(null);
	const startDotRef = useRef<HTMLDivElement>(null);
	const endDotRef = useRef<HTMLDivElement>(null);

	const [seekPreviewTime, setSeekPreviewTime] = useState<number | null>(null);

	useEffect(() => {
		if (currentDragging !== "None") return;

		setCurrentTimePreviewOffset((videoCurrentTime / videoDuration!) * 100);
	}, [videoCurrentTime]);

	function onStartDotDown() {
		if (!videoLoaded) return;

		setSeekPreviewTime(currentTime);
		setCurrentDragging("Start");
	}

	function onEndDotDown() {
		if (!videoLoaded) return;

		setSeekPreviewTime(currentTime);
		setCurrentDragging("End");
	}

	function onMouseUp() {
		if (seekPreviewTime !== null) {
			seekToTime(seekPreviewTime!);

			setSeekPreviewTime(null);
		}

		setCurrentDragging("None");
	}

	function onMouseMove(event: MouseEvent) {
		if (currentDragging === "None") return;

		let container = containerRef.current!;

		let startDot = startDotRef.current!;
		let endDot = endDotRef.current!;

		let containerRect = container.getBoundingClientRect();

		if (currentDragging === "Start") {
			let startDotWidth = startDot.getBoundingClientRect().width;

			let endDotX = endDot.getBoundingClientRect().left;
			let mouseX = event.clientX - containerRect.left - startDotWidth / 2;

			let offset = clamp(mouseX, 0, endDotX - 20);
			startDot.style.left = `${offset}px`;

			let percentage = offset / containerRect.width;

			setStartPercentage(percentage);
			seekToPercentage(percentage);
		} else if (currentDragging === "End") {
			let endDotWidth = endDot.getBoundingClientRect().width;

			let startDotX = startDot.getBoundingClientRect().right;
			let mouseX = event.clientX - containerRect.left + endDotWidth / 2;

			let offset = clamp(mouseX, startDotX + 10, containerRect.width);
			endDot.style.right = `${containerRect.width - offset}px`;

			let percentage = offset / containerRect.width;

			setEndPercentage(percentage);
			seekToPercentage(percentage);
		}
	}

	useEffect(() => {
		window.addEventListener("mouseup", onMouseUp);
		window.addEventListener("mousemove", onMouseMove);

		return () => {
			window.removeEventListener("mouseup", onMouseUp);
			window.removeEventListener("mousemove", onMouseMove);
		};
	}, [currentDragging]);

	return (
		// pt-6
		<div className="w-full h-min py-2 flex items-center z-20 overflow-hidden relative">
			{/* Left Dot */}
			<div className=" bg-neutral-900 relative flex justify-center items-center">
				<span
					className={`${currentDragging == "Start" ? "size-4" : "size-3"} 
                    rounded-full bg-blue-800 absolute flex justify-center items-center
                `}
					style={{
						left: "0px",
					}}
					onMouseDown={onStartDotDown}
					ref={startDotRef}
				>
					<span className="h-2 bg-neutral-900 w-[10000px] right-0 absolute -z-10 rounded-r-full"></span>
				</span>
			</div>

			{/* Current Time Display */}
			<div
				className={`absolute w-1 h-2 bg-white/80 z-30 }`}
				style={{
					left: `${currentTimePreviewOffset}%`,
				}}
			></div>

			{/* Center Range */}
			<div
				className=" w-full h-2 bg-blue-900 -z-30 relative overflow-visible"
				ref={containerRef}
			></div>

			{/* Right Dot */}
			<div className=" bg-neutral-900 relative flex justify-center items-center">
				<span
					className={`
                    ${currentDragging == "End" ? "size-4" : "size-3"} 
                    rounded-full bg-blue-800 absolute flex justify-center items-center
                `}
					style={{
						right: "0px",
					}}
					onMouseDown={onEndDotDown}
					ref={endDotRef}
				>
					<span className="h-2 bg-neutral-900 w-[10000px] left-0 absolute -z-10 rounded-l-full"></span>
				</span>
			</div>
		</div>
	);
}
