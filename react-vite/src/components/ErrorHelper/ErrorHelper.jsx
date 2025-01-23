import "./ErrorHelper.css";

export default function ErrorHelper({ errors }) {
	return (
		<div>
			{errors && errors.length > 0 ? (
				<div>
					{errors.map((el, i) => {
						return <div key={i}>{el}</div>;
					})}
				</div>
			) : (
				<></>
			)}
		</div>
	);
}
