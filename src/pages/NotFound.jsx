import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


const NoResult = ({ setFavorites}) => {
	// 自動跳轉回首頁
	const navigate = useNavigate();
	useEffect(() => {
		setTimeout(() => {
			navigate('/')
		}, 2000);
	}, []);

	return (
		<>
			<div className="flex flex-col h-screen">
				<Navbar setFavorites={setFavorites}/>

				<div className="flex h-full text-center justify-center items-center">
					<p className="text-nav-dark font-medium text-xl leading-8">Oh，找不到符合搜尋的結果，<br />
						請再試看看其他的搜尋吧！</p>
				</div>

				<Footer />
			</div>
		</>
	)
}
export default NoResult;
