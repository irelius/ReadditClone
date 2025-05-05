import "./SignUpForm.css";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { signUp } from "../../../redux/session";
import errorSetter from "../../../helper/error";
import { useNavigate } from "react-router-dom";

const SignUpForm = ({ currUser, keepOpen }) => {
	const dispatch = useDispatch();
    const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [errors, setErrors] = useState({
		email: [],
		password: [],
		username: [],
	});

	const onSignup = async (e) => {
		e.preventDefault();
        keepOpen(false)
		dispatch(signUp({ username, email, password })).then((res) => {
			errorSetter(res, setErrors);
		});
	};

	if (currUser) {
        keepOpen(false)
        return navigate("/")
	}

	const filterErrors = (errorType) => {
		setErrors({
			username: errorType === "username" ? [] : errors["username"],
			email: errorType === "email" ? [] : errors["email"],
			password: errorType === "password" ? [] : errors["password"],
		});
	};

	return (
		<div className="signup-modal-main-container">
			<section className="signup-modal-exit-container">
				<button onClick={() => keepOpen(false)} className="signup-modal-exit-button">
					<i className="fa-solid fa-xmark fa-lg"></i>
				</button>
			</section>
			<section>
				<form onSubmit={(e) => onSignup(e)} className="signup-form-modal-main-container">
					<div className="signup-form-modal-text-container">
						<h2>Sign Up</h2>
						<p>
							By continuing, you are setting up a Readdit account and agree to our user Agreement and Privacy Policy.
						</p>
					</div>
					<div className="signup-form-modal-email-container">
						<input
							className="signup-form-modal-email-input"
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
					<div className="signup-form-modal-errors-container">
						{errors.email && errors.email.map((error, i) => <div key={i}>{error}</div>)}
						{errors.password && errors.password.map((error, i) => <div key={i}>{error}</div>)}
					</div>
					<div className="signup-form-modal-password-container">
						<input
							className="signup-form-modal-password-input"
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
					<div className="signup-form-modal-text-container">
						<p>
							Readdit is anonymous, so your username is what you’ll go by here. Choose wisely—because once you get a
							name, you can’t change it.
						</p>
					</div>
					<div className="signup-form-modal-username-container">
						<input
							className="signup-form-modal-username-input"
							name="username"
							type="username"
							placeholder="Username"
							value={username}
							onChange={(e) => {
								filterErrors("username");
								setUsername(e.target.value);
							}}
						/>
					</div>
					<div className="signup-form-modal-errors-container">
						{errors.username && errors.username.map((error, i) => <div key={i}>{error}</div>)}
					</div>
					<div className="signup-form-modal-signup-container">
						<button className="signup-form-signup-button" type="submit">
							Sign Up
						</button>
					</div>
				</form>
			</section>
		</div>
	);
};

export default SignUpForm;
