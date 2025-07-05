import "./LoginForm.css";

import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../../redux/session";
import errorSetter from "../../../helper/error";

const LoginForm = ({ currUser, keepOpen }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const emailRef = useRef(null);
	const passwordRef = useRef(null);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({
		email: [],
		password: [],
	});

	const [emailFocus, setEmailFocus] = useState(false);
	const [passwordFocus, setPasswordFocus] = useState(false);

	const handleLogin = async (e) => {
		e.preventDefault();

		dispatch(login({ email, password })).then((res) => {
			errorSetter(res, setErrors);
			if (res.type === "LOAD_SESSION") {
				keepOpen(false);
			}
		});
	};

	if (currUser) {
		keepOpen(false);
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
			{/* login modal - exit button container */}
			<section className="login-modal-exit-container">
				<button onClick={() => keepOpen(false)} className="login-modal-exit-button pointer">
					<i className="fa-solid fa-xmark fa-lg"></i>
				</button>
			</section>

			{/* login modal - main form container */}
			<section>
				<form onSubmit={(e) => handleLogin(e)} className="login-modal-form-container">
					{/* login modal - login blurb */}
					<section className="login-modal-form-blurb-container dfc aic gap-05em">
						<h2 className="font-24 font-bold font-white">Log In</h2>
						<p className="font-14">
							By continuing, you agree are setting up a Readdit account and gree to our User Agreement and Privacy
							Policy.
						</p>
					</section>

					{/* login modal - email section*/}
					<section className="login-modal-form-email-container">
						{/* login modal - email input container */}
						<aside
							className={`login-modal-form-input-container login-modal-email-error-${
								errors.email && errors.email.length > 0
							} dfc jcc`}
							onClick={() => {
								emailRef.current.focus();
							}}>
							<aside className={`email-input-focused-${emailFocus} noselect`}>Email</aside>
							{/* login modal - email input */}
							<input
								className={`login-modal-form-input`}
								name="email"
								type="text"
								autoComplete="off"
								value={email}
								ref={emailRef}
								onChange={(e) => {
									filterErrors("email");
									setEmail(e.target.value);
								}}
								onFocus={() => setEmailFocus(true)}
								onBlur={() => {
									if (email.length === 0) {
										setEmailFocus(false);
									}
								}}
							/>
							{errors.email && errors.email.length > 0 ? (
								<aside className="login-modal-form-error-icon">
									<i className="fa-solid fa-circle-exclamation"></i>
								</aside>
							) : (
								<></>
							)}
						</aside>

						{/* login modal - email input error message */}
						<aside className="login-modal-form-errors-container">
							{errors.email &&
								errors.email.map((error, i) => (
									<div key={i} className="font-11">
										{error}
									</div>
								))}
						</aside>
					</section>

					{/* login modal - password section */}
					<section className="login-modal-form-password-container">
						<aside
							className={`login-modal-form-input-container login-modal-password-error-${
								errors.password && errors.password.length > 0
							} dfc jcc`}
							onClick={() => {
								passwordRef.current.focus();
							}}>
							<aside className={`password-input-focused-${passwordFocus} noselect`}>Password</aside>
							{/* login modal - password input */}
							<input
								className={`login-modal-form-input`}
								name="password"
								type="password"
								autoComplete="off"
								value={password}
								ref={passwordRef}
								onChange={(e) => {
									filterErrors("password");
									setPassword(e.target.value);
								}}
								onFocus={() => setPasswordFocus(true)}
								onBlur={() => {
									if (password.length === 0) {
										setPasswordFocus(false);
									}
								}}
							/>

							{errors.password && errors.password.length > 0 ? (
								<aside className="login-modal-form-error-icon">
									<i className="fa-solid fa-circle-exclamation"></i>
								</aside>
							) : (
								<></>
							)}
						</aside>

						{/* login modal - password input error message */}
						<div className="login-modal-form-errors-container">
							{errors.password &&
								errors.password.map((error, i) => (
									<div key={i} className="font-11">
										{error}
									</div>
								))}
						</div>
					</section>

					{/* login modal - sign up modal shortcut */}
					<section className="login-modal-form-sign-up-shortcut-container dfr">
						<p>
							New to Reddit? <span className="login-modal-form-sign-up-link pointer">Sign Up</span>
						</p>
					</section>

					{/* login modal - log in buttons container */}
					<section>
						{/* login modal - log in button */}
						<aside className="login-modal-form-login-container">
							<button
								className={`login-modal-form-button button-disabled-${
									email.length === 0 || password.length === 0
								} pointer font-14 font-bold`}
								type="submit"
								disabled={email.length === 0 || password.length === 0}>
								Log In
							</button>
						</aside>

						{/* login modal - demo user login button */}
						<aside>
							<button
								className="login-modal-form-button modal-demo-user-button pointer font-14 font-bold"
								onClick={() => {
									setErrors({ email: [], password: [] });
									setEmail("demo@user.io");
									setPassword("password");
								}}
								type="submit">
								Demo User
							</button>
						</aside>
					</section>
				</form>
			</section>
		</div>
	);
};

export default LoginForm;
