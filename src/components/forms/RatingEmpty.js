import React from "react";

const RatingEmpty = (props) => (
	<svg
		width={50}
		height={50}
		viewBox="0 0 480 480"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M2260 3274c-347-67-602-282-708-599-35-102-45-188-39-324 11-234 92-417 257-581 484-479 1312-254 1491 405 32 116 33 327 1 441-55 205-163 366-325 486-165 122-304 169-517 174-74 1-146 0-160-2zm243-174c199-29 377-140 486-304 86-129 123-249 123-402 0-225-100-422-286-563-140-107-273-146-461-138-172 7-293 52-421 156-315 253-351 725-78 1020 173 186 392 266 637 231z"
			style={{
			fill: "#d91426",
		}}
		transform="matrix(.1 0 0 -.1 0 480)"
		/>
		<path
			d="M2193 3000c-174-46-314-164-394-335-59-126-75-279-43-415 54-232 250-435 462-479 76-16 122-14 122 4 0 11-11 15-39 15-67 0-193 46-258 93-203 150-307 400-259 625 53 253 255 447 491 471 46 5 61 10 63 24 5 23-49 22-145-3z"
			style={{
			fill: "#d91426",
		}}
		transform="matrix(.1 0 0 -.1 0 480)"
		/>
	</svg>
  )
  
export default RatingEmpty;