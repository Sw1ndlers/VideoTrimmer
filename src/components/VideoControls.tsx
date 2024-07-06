import { formatTimestamp } from "@/utils";
import { StepBack, PauseIcon, PlayIcon, StepForward } from "lucide-react";

export default function VideoControls({
	videoRef,
	onPlayPauseClick,
	setVideoPlaying,
	videoPlaying,
	setVideoCurrentTime,
	videoCurrentTime,
	videoLength,
	startPercentage,
	endPercentage,
}: {
	videoRef: React.RefObject<HTMLVideoElement>;
	onPlayPauseClick: () => void;
	setVideoPlaying: (playing: boolean) => void;
	videoPlaying: boolean;
	setVideoCurrentTime: (time: number) => void;
	videoCurrentTime: number;
	videoLength: number | undefined;
	startPercentage: number;
	endPercentage: number;
}) {
	function onStepForwardClick() {
		if (!videoRef.current) return;

		videoRef.current.currentTime += 5;
	}

	function onStepBackClick() {
		if (!videoRef.current) return;

		videoRef.current.currentTime -= 5;
	}

	const lowerTime = formatTimestamp(startPercentage * (videoLength || 0));
	const upperTime = formatTimestamp(endPercentage * (videoLength || 0));

	return (
		<div className=" flex flex-row h-min items-center mb-1 justify-center gap-1 relative">
			<p className=" absolute left-0 text-sm">
				({lowerTime}) - ({upperTime})
			</p>

			<button
				className=" hover:bg-neutral-900 rounded-md p-1"
				onClick={onStepBackClick}
			>
				<StepBack size={20} />
			</button>

			<button
				className=" hover:bg-neutral-900 rounded-md p-1"
				onClick={onPlayPauseClick}
			>
				{videoPlaying ? (
					<PauseIcon size={26} />
				) : (
					<PlayIcon size={26} />
				)}
			</button>

			<button
				className=" hover:bg-neutral-900 rounded-md p-1"
				onClick={onStepForwardClick}
			>
				<StepForward size={20} />
			</button>

			<p className=" absolute right-0 text-sm">
				{(videoRef.current && formatTimestamp(videoCurrentTime)) ||
					"00:00"}
			</p>
		</div>
	);
}
