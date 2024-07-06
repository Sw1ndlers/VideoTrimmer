"use client";

export default function Page() {
	return (
		<p
			onClick={() => {
				window.location.href = "/";
			}}
		>
			Processing
		</p>
	);

}
