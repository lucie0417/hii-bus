import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoLocationSharp, IoHeart, IoPerson, IoReorderThree } from "react-icons/io5";
import { useAuth } from '../contexts/AuthContext'
import LogoWhite from "../images/M-logo-white.svg";
import LoginModal from "../components/LoginModal";


const Navbar = ({ setFavorites }) => {
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [error, setError] = useState('');
	const [menuOpen, setMenuOpen] = useState(false);
	const { currentUser, logout, isLoggedIn, setIsLoggedIn } = useAuth()

	const openModal = () => {
		setIsLoginModalOpen(true);
	}

	const toggleMenu = () => {
		setMenuOpen(!menuOpen)
	}

	console.log('menuOpen', menuOpen);

	async function handleLogout() {
		setError('');
		try {
			await logout();
			setFavorites([]);
			setIsLoggedIn(false);
		} catch (error) {
			console.log('Failed to log out!');
		}
	}


	return (
		<>
			{error && (
				<div className='text-nav-dark'>
					{error}
				</div>
			)}
			<nav>
				<div className="flex bg-nav-dark h-14 items-center justify-between
								 md:h-1/12">
					{/* Logo */}
					<Link to="/">
						<img src={LogoWhite} alt="HiBus nav logo" className="w-24 ml-5" />
					</Link>

					{/* 打招呼 */}
					{isLoggedIn && (
						<div className="text-white text-md tracking-wider ml-28
									md:ml-[280px]
									lg:ml-[440px]">
							{`Hi! ${currentUser?.displayName}`}
						</div>
					)}

					{/* 分頁連結 */}
					<div className="relative md:hidden">
						<IoReorderThree size={30} className="text-white mr-4 md:invisible"
							onClick={toggleMenu} />
						{menuOpen && (
							<div className="absolute min-w-[140px] z-50 right-0 bg-nav-dark">
								<ul className="px-6 text-white">
									{!isLoggedIn && (
										<li className="py-3 hover:text-gradient-end">
											<button className="flex items-center"
												id="login" onClick={openModal}>
												<IoPerson size={22} className="mr-1 md:mr-1" />
												會員登入
											</button>
										</li>
									)}
									{isLoggedIn && (
										<li className="py-3 hover:text-gradient-end">
											<button className="flex items-center"
												id="logout" onClick={handleLogout}>
												<IoPerson size={22} className="mr-1 md:mr-1" />
												登出
											</button>
										</li>
									)}

									<li className="py-3 hover:text-gradient-end">
										<Link className="flex items-center" id="myFavorite"
											to="/myfavorite">
											<IoHeart size={22} className="mr-1 md:mr-1" />
											我的收藏
										</Link>
									</li>
									<li className="py-3 hover:text-gradient-end">
										<Link className="flex items-center"
											id="myLocation" to="/nearbystop">
											<IoLocationSharp size={22} className="mr-1 md:mr-1" />
											附近站牌
										</Link>
									</li>
								</ul>
							</div>
						)}
					</div>

					<div className="hidden mr-3 
               				 md:flex md:justify-end 
               				 lg:mr-6">
						<Link className="flex text-white hover:text-yellow-400 mx-2"
							id="myLocation"
							to="/nearbystop">
							<IoLocationSharp className="md:mr-1" size={22} />
							<span className="hidden md:block font-light">附近站牌</span>
						</Link>
						<Link className="flex text-white hover:text-yellow-400 mx-2"
							id="myFavorite"
							to="/myfavorite">
							<IoHeart size={22} className="md:mr-1" />
							<span className="hidden md:block font-light">我的收藏</span>
						</Link>

						{isLoggedIn && (
							<button onClick={handleLogout}
								className="flex text-white hover:text-yellow-400 mx-2"
								id="logout">
								<IoPerson size={22} className="md:mr-1" />
								<span className="hidden md:block font-light">登出</span>
							</button>
						)}
						{!isLoggedIn && (
							<button className="flex text-white hover:text-yellow-400 mx-2"
								id="login" onClick={openModal}>
								<IoPerson size={22} className="md:mr-1" />
								<span className="hidden md:block font-light">會員登入</span>
							</button>
						)}
					</div>
				</div>
			</nav>
			<div className="h-1.5 animate-color "></div>

			{isLoginModalOpen &&
				<LoginModal setMenuOpen={setMenuOpen}
					isLoginModalOpen={isLoginModalOpen}
					setIsLoginModalOpen={setIsLoginModalOpen} />
			}
		</>
	)
}


export default Navbar;
