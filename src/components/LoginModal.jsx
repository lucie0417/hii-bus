import { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import SignupModal from './SignupModal';


const LoginModal = ({ setMenuOpen, isLoginModalOpen, setIsLoginModalOpen }) => {
	const emailRef = useRef()
	const passwordRef = useRef()
	const { login, setIsLoggedIn } = useAuth()
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false);
	const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);


	async function handleSubmit(e) {
		e.preventDefault()
		try {
			setError('')
			setLoading(true)
			await login(emailRef.current.value, passwordRef.current.value);
			// console.log('Log in success');
			setMenuOpen(false);
			setIsLoginModalOpen(false);
			setIsLoggedIn(true);
		} catch (error) {
			setError('登入失敗，請確認信箱及密碼是否正確')
		}
		setLoading(false)
	}

	console.log('isLoginModalOpen', isLoginModalOpen);

	return (
		<>
			<div className='fixed inset-0 z-50 bg-white/50'>
				<div className="absolute w-full md:w-[472px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
					<div className="bg-white rounded-lg shadow dark:bg-gray-700">
						<div className="px-6 py-6 lg:px-8">
							<div className='flex justify-between'>
								<h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
									Login to Hi Bus!
								</h3>
								<button onClick={() => setIsLoginModalOpen(false)} className='text-white text-lg mb-4'>
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
									<label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
										電子信箱
									</label>
									<input ref={emailRef} type="text" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white focus:ring-1 focus:border-gradient-end focus:outline-none  block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />
								</div>
								<div>
									<label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
										密碼
									</label>
									<input ref={passwordRef} type="password" name="password" id="password" placeholder="⋯⋯" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-white focus:ring-1 focus:border-gradient-end focus:outline-none block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
								</div>
								<button type="submit" disabled={loading} className="w-full text-white bg-gradient-end hover:bg-hover-green focus:ring-2 focus:outline-none focus:ring-ring-green font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-hover-light-green dark:hover:bg-gradient-end dark:focus:ring-hover-green">
									登入會員
								</button>
								<div className="text-sm font-medium text-gray-500 dark:text-gray-300">
									還沒有帳戶嗎？&ensp;
									<button onClick={() => setIsSignupModalOpen(true)} className="text-gradient-end hover:underline dark:text-gradient-end">
										加入會員
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>

			{isSignupModalOpen &&
				<SignupModal setMenuOpen={setMenuOpen}
					setIsSignupModalOpen={setIsSignupModalOpen}
					setIsLoginModalOpen={setIsLoginModalOpen} />
			}
		</>
	)
}

export default LoginModal