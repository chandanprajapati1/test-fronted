import React from 'react';
import {WarningFilled} from "@carbon/icons-react";

interface MessageProps {
	message: string;
}
export const ErrorMessage = ({ message }: MessageProps) => {
	if (!message) return null;

	return (
		<div className="">
			<p className="text-negativeBold text-sm flex items-start break-normal text-start gap-1.5">
				<WarningFilled className="w-4 h-4 flex-shrink-0 mt-0.5" />
				{message}
			</p>
		</div>
	);
};