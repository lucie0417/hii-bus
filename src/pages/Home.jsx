import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import MLogo from "../images/M-logo.svg";
import DLogo from "../images/D-logo.svg";
import MBackground from "../images/M-bg.svg";
import TBackground from "../images/T-bg.svg";
import DBackground from "../images/D-bg.svg";
import Bus from "../images/M-bus-gif.png";


const Home = ({ routeNumber, setRouteNumber, routeName, setRouteName, city, setCity, CityObj, setFavorites }) => {

	return (
		<>
			<div className="h-screen">
				<main>
					<Navbar
						setFavorites={setFavorites} />

					<div className="grid justify-items-center mt-14 gap-3 md:gap-5 lg:gap-7">
						<img src={MLogo} alt="hi bus logo" className=" lg:hidden" />
						<img src={DLogo} alt="hi bus logo" className=" hidden md:hidden lg:block mt-7" />
						<h1 className="z-30 font-chinese">今天想搭乘哪輛公車呢？</h1>
					</div>

					<SearchBar
						routeNumber={routeNumber}
						setRouteNumber={setRouteNumber}
						routeName={routeName}
						setRouteName={setRouteName}
						city={city}
						setCity={setCity}
						CityObj={CityObj} />


					<div>
						<img src={MBackground} className="-z-10 absolute bottom-24 w-full object-cover block md:hidden" alt="background" />
						<img src={TBackground} className="-z-10 absolute bottom-32 w-full object-cover hidden md:block lg:hidden" alt="background" />
						<img src={DBackground} className="-z-10 absolute bottom-28 w-full object-cover hidden lg:block" alt="background" />
						<img src={Bus} className="-z-10 w-1/3 absolute animate-slide bottom-14 
						md:w-1/4 lg:w-1/6" alt="bus" />
					</div>
				</main>

				<div className="fixed w-full z-10 bottom-0">
					<Footer />
				</div>
			</div>
		</>
	)
}


export default Home;
