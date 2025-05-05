import "./LoginForm.css";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../../redux/session";
import errorSetter from "../../../helper/error";

const LoginForm = ({ currUser, keepOpen }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({
		email: [],
		password: [],
	});

	const onLogin = async (e) => {
		e.preventDefault();
        keepOpen(false)
		dispatch(login({ email, password })).then((res) => {
			errorSetter(res, setErrors);
		});
	};

	if (currUser) {
        keepOpen(false)
		return navigate("/");
	}

	const filterErrors = (errorType) => {
		setErrors({
			email: errorType === "email" ? [] : errors["email"],
			password: errorType === "password" ? [] : errors["password"],
		});
	};

	return (
		<div className="login-modal-main-container">
			<section className="login-modal-exit-container">
				<button onClick={() => keepOpen(false)} className="login-modal-exit-button">
					<i className="fa-solid fa-xmark fa-lg"></i>
				</button>
			</section>
			<section>
				<form onSubmit={(e) => onLogin(e)} className="login-form-modal-main-container">
					<div className="login-form-modal-text-container">
						<h2>Log In</h2>
						<p>
							By continuing, you agree are setting up a Readdit account and gree to our User Agreement and Privacy
							Policy.
						</p>
					</div>
					<div className="login-form-modal-email-container">
						<input
							className="login-form-modal-email-input"
							name="email"
							type="text"
							placeholder="Email"
							value={email}
							onChange={(e) => {
								filterErrors("email");
								setEmail(e.target.value);
							}}
						/>
					</div>
					<div className="login-form-modal-errors-container">
						{errors.email && errors.email.map((error, i) => <div key={i}>{error}</div>)}
						{errors.password && errors.password.map((error, i) => <div key={i}>{error}</div>)}
					</div>
					<div className="login-form-modal-password-container">
						<input
							className="login-form-modal-password-input"
							name="password"
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => {
								filterErrors("password");
								setPassword(e.target.value);
							}}
						/>
					</div>

					<div className="login-form-modal-demo-container">
						<button
							className="login-form-modal-demo-button"
							onClick={() => {
								setErrors({ email: [], password: [] });
								setEmail("demo@user.io");
								setPassword("password");
							}}
							type="submit">
							Demo User
						</button>
					</div>
					<div className="login-form-modal-login-container">
						<button className="login-form-login-button" type="submit">
							Log In
						</button>
					</div>
				</form>
			</section>
		</div>
	);
};

export default LoginForm;
