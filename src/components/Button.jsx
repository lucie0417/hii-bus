const Button = (props) => {
	const style = {
		display: 'flex',
		width: '72px',
		height: '35px',
		borderRadius: '100px',
		color: props.fontColor,
		border: props.borderStyle,
		padding: '18px 8px',
		outline: 0,
		fontSize: props.fontSize,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: props.backgroundColor,
		margin: props.margin,
	}

	return (
		<>
			<button style={style}>{props.children}</button>
		</>
	)
}
export default Button;