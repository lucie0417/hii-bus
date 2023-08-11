import { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'


const SignupModal = ({ setMenuOpen, setIsSignupModalOpen, setIsLoginModalOpen }) => {
	const emailRef = useRef();
	const passwordRef = useRef();
	const displayNameRef = useRef();
	const passwordConfirmRef = useRef();
	const { signup, setIsLoggedIn } = useAuth()
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false);


	async function handleSubmit(e) {
		e.preventDefault()

		if (passwordRef.current.value !== passwordConfirmRef.current.value) {
			return setError('Password do not match.')
		}
		try {
			setError('')
			setLoading(true)
			await signup(emailRef.current.value, passwordRef.current.value, displayNameRef.current.value);
			console.log('Sign up success');
			setIsLoggedIn(true)
			setMenuOpen(false)
			setIsLoginModalOpen(false)
			setIsSignupModalOpen(false)
		} catch (error) {
			console.log('error', error);
			setError('註冊失敗，請檢查資料是否填寫正確')
		}
		setLoading(false)
	}


	return (
		<>
			<div className='fixed inset-0 z-50 bg-white/50'>
				<div className="absolute w-full md:w-[472px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
					<div className="bg-white rounded-lg shadow dark:bg-gray-700">
						<div className="px-6 py-6 lg:px-8">
							<div className='flex justify-between'>
								<h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
									Sign up to Hi Bus!
								</h3>
								<button onClick={() => setIsSignupModalOpen(false)} className='text-white text-lg mb-4'>
									X
								</button>
							</div>
							{error && (
								<div className='w-full h-1/12 py-1.5 mb-4 bg-yellow-500/80 text-nav-dark/80 text-sm text-center rounded-md'>
									{error}
								</div>
							)}
							<form className="space-y-6" onSubmit={handleSubmit}>
								<div>
									<label htmlFor="userName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
										暱稱
									</label>
									<input ref={displayNameRef} type="text" name="userName" id="userName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white focus:ring-1 focus:border-gradient-end focus:outline-none  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Lucie" required />
								</div>
								<div>
									<label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
										電子信箱
									</label>
									<input ref={emailRef} type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white focus:ring-1 focus:border-gradient-end focus:outline-none  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />
								</div>
								<div>
									<label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
										密碼（需超過六碼）
									</label>
									<input ref={passwordRef} type="password" name="password" id="password" placeholder="⋯⋯" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white focus:ring-1 focus:border-gradient-end focus:outline-none block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
								</div>
								<div>
									<label htmlFor="passwordConfirm" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
										確認密碼
									</label>
									<input ref={passwordConfirmRef} type="password" name="passwordConfirm" id="passwordConfirm" placeholder="⋯⋯" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white focus:ring-1 focus:border-gradient-end focus:outline-none block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
								</div>
								<button type="submit" disabled={loading} className="w-full text-white bg-gradient-end hover:bg-hover-green focus:ring-2 focus:outline-none focus:ring-ring-green font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-hover-light-green dark:hover:bg-gradient-end dark:focus:ring-hover-green">
									加入會員
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default SignupModal
