import { IoChevronBack } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import BusStopStatus from "../components/BusStopStatus";
import BusInformation from "../components/BusInformation";
import Loading from "../components/Loading";
import getAuthorizationHeader from "../util/getAuthorizationHeader";
import BusMap from "../util/BusMap";
import { useAuth } from "../contexts/AuthContext";


const BusStatusPage = ({ CityObj, city, stopData, setStopData, favorites, setFavorites }) => {
	const [routeDirection, setRouteDirection] = useState("");
	const [finalRoute, setFinalRoute] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [plateNumb, setPlateNum] = useState([]);
	const api = `https://tdx.transportdata.tw/api/basic/v2/Bus/`;
	const navigate = useNavigate();
	const { routeName } = useParams();
	const { currentUser } = useAuth();
	const [isOneDirection, setIsOneDirection] = useState({
		leftBtn: false,
		rightBtn: false
	})


	const getAllRoutes = async () => {
		if (!city) return;

		const accessToken = await getAuthorizationHeader();
		const eta = axios.get(`${api}EstimatedTimeOfArrival/City/${CityObj[city]}/${routeName
			}?%24select=StopUID%2CDirection%2CEstimateTime%2CStopStatus&%24format=JSON`, {
			headers: {
				"authorization": "Bearer " + accessToken,
			},
		});
		// console.log('eta', eta);
		const stop = axios.get(`${api}StopOfRoute/City/${CityObj[city]}/${routeName
			}?%24select=RouteName%2CDirection%2CStops&%24format=JSON`, {
			headers: {
				"authorization": "Bearer " + accessToken,
			},
		});

		const plateNumb = axios.get(`${api}RealTimeNearStop/City/${CityObj[city]}/${routeName
			}?%24select=PlateNumb%2C%20RouteUID%2C%20RouteName%2CDirection%2CStopUID%2CStopSequence&%24format=JSON`, {
			headers: {
				"authorization": "Bearer " + accessToken,
			},
		});

		const result = await Promise.all([eta, stop, plateNumb]);
		// console.log('result', result);
		const etaRes = result[0].data;
		const stopRes = result[1].data;
		const plateNumbRes = result[2].data;
		// 當輸入無效路線號碼時
		if (etaRes.length === 0 || stopRes.length === 0) {
			navigate("/NotFound");
			return;
		}


		// #1 取出需要的欄位
		const etas = etaRes.map((eta) => {
			return {
				Direction: eta.Direction,
				EstimateTime: eta.EstimateTime,
				StopUID: eta.StopUID,
				StopStatus: eta.StopStatus,
			}
		});

		const stops = stopRes.map((item) => {
			return {
				RouteName: item.RouteName.Zh_tw,
				key: `${item.RouteName.Zh_tw}_${item.Direction}`,
				stops: item.Stops
			}
		});

		const plateNumbs = plateNumbRes.map((plate) => {
			return {
				PlateNumb: plate.PlateNumb,
				Key: `${plate.StopUID}_${plate.Direction}`
			}
		});
		setPlateNum(plateNumbs);


		// #2 forEach 分別取出物件中的 key 及 value 並組裝成 {StopUID:EstimateTime} 的資料型態
		const estimateTimeObj = etas.reduce((obj, item) => {
			const EstimateTime = item.EstimateTime;
			const StopUID = item.StopUID;
			obj[StopUID] = EstimateTime;
			return obj;
		}, {});

		// 取出站牌狀態資料
		const stopStatusObj = etas.reduce((stopObj, item) => {
			const StopStatus = item.StopStatus;
			const StopUID = item.StopUID;
			stopObj[StopUID] = StopStatus;
			return stopObj;
		}, {});

		// 取出方向
		const etaDirectionObj = etas.reduce((directionObj, item) => {
			const Direction = item.Direction;
			const StopUID = item.StopUID;
			directionObj[StopUID] = Direction;
			return directionObj;
		}, {});

		// 取出路線
		const routeObj = {};
		stops.forEach(item => {
			const { key, stops } = item  // 解構取值
			routeObj[key] = stops
		});


		// #3 組合資料（上面的 routeObj 還缺 EstimateTime 資料）
		const innerFinalRoute = {};
		for (const routeAndDirection in routeObj) {
			const stops = routeObj[routeAndDirection];
			const defaultStops = stops.map(stop => {
				const StopStatus = stopStatusObj[stop.StopUID];
				const EtaDirection = etaDirectionObj[stop.StopUID];
				const EstimateTime = estimateTimeObj[stop.StopUID];
				// 用 StopUID 抓 estimateTimeObj相對應的站牌再賦予EstimateTime 的值，return EstimateTime 跟 stop 中的其他屬性 
				return {
					StopStatus,
					EtaDirection,
					EstimateTime,
					...stop
				}
			})
			// 第一圈先取出該路線的站牌資料
			innerFinalRoute[routeAndDirection] = defaultStops;
		}

		// 畫面初始要跑預設:去程路線
		const defaultDirection = `${routeName}_0`;
		setRouteDirection(defaultDirection);
		setFinalRoute(innerFinalRoute);

		if (!innerFinalRoute[`${routeName}_0`]) {
			setIsOneDirection({
				...isOneDirection,
				leftBtn: true
			})
		}
		if (!innerFinalRoute[`${routeName}_1`]) {
			setIsOneDirection({
				...isOneDirection,
				rightBtn: true
			})
		}
		const defaultStopsData = innerFinalRoute[defaultDirection];

		// 當輸入無效路線號碼時
		if (defaultStopsData === undefined) return;
		const fromStopName = defaultStopsData[(defaultStopsData.length) - 1].StopName.Zh_tw;
		const toStopName = defaultStopsData[0].StopName.Zh_tw;
		setFrom(fromStopName);
		setTo(toStopName);
		setIsLoading(false);
	};

	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");

	useEffect(() => {
		getAllRoutes();
	}, [routeName]);

	const defaultButtonStyle = "flex justify-center items-center p-2";
	const [directionFromStyle, setDirectionFromStyle] = useState(defaultButtonStyle);
	const [directionToStyle, setDirectionToStyle] = useState(defaultButtonStyle);

	const selectStyle = "text-white bg-gradient-start";
	const unSelectStyle = "text-gradient-start bg-white";


	// 當觸發 direction 改變時
	useEffect(() => {
		if (!routeDirection) return;
		// 當路線只有單一方向或為環狀路線時
		const newStopData = finalRoute[routeDirection];
		if (newStopData === undefined) {
			return;
		}
		setStopData(newStopData); // 帶入搜尋到的公車路線
		const direction = routeDirection.split("_")[1];


		if (direction === "0") {
			setDirectionFromStyle(defaultButtonStyle + " " + selectStyle);
			setDirectionToStyle(defaultButtonStyle + " " + unSelectStyle);
		} else {
			setDirectionFromStyle(defaultButtonStyle + " " + unSelectStyle);
			setDirectionToStyle(defaultButtonStyle + " " + selectStyle);
		}
	}, [routeDirection]);


	// 切換愛心按鈕顏色
	const [isHighlighted, setIsHighlighted] = useState(false);
	const toggleHeartColor = () => {
		setIsHighlighted(!isHighlighted);
	}
	const getButtonClassName = () => {
		if (isHighlighted) return "text-highlight";
		return "text-gray-300";
	}


	// 加入收藏功能
	const addToFavorites = (item) => {
		// 檢查  中是否已經存在相同的項目
		const isDuplicate = favorites.some((fav) => fav.id === item.id);
		setIsHighlighted(!isHighlighted);
		if (isDuplicate) {
			// 有重複就移除 localStorage 中的資料
			const updatedFavorites = favorites.filter((fav) => fav.id !== item.id);
			localStorage.setItem(currentUser.displayName, JSON.stringify(updatedFavorites));
			// console.log("Item already exists in localStorage");
			return;
		}
		// 加入新項目至畫面上的資料
		setFavorites((prevFavorites) => [...prevFavorites, item]);
		// 加入新項目至 localStorage 中的資料
		const updatedFavorites = [...favorites, item];
		localStorage.setItem(currentUser.displayName, JSON.stringify(updatedFavorites));
		// 切換愛心顏色
		toggleHeartColor();
	}

	// sm 視窗大小時展開地圖功能
	const [showMap, setShowMap] = useState(false);
	const toggleMap = () => {
		setShowMap(!showMap);
	}


	return (
		<>
			{/* 判斷是否 Loading */}
			{isLoading ?
				(<div>
					<Loading />
				</div>) : (
					<div className="h-screen lg:h-screen lg:flex lg:flex-col">
						<Navbar setFavorites={setFavorites}/>
						<div className="relative bg-white w-full h-auto 
										md:static
										lg:flex lg:h-full lg:p-5 lg:bg-gray-100">
							{/* 地圖來囉 */}
							<div className="hidden
						md:block md:h-[400px] md:w-full md:sticky md:z-10
						lg:w-11/12 lg:h-[650px]">
								<BusMap
									routeName={routeName}
									finalRoute={finalRoute}
									stopData={stopData} />
							</div>

							{showMap === true &&
								(<div className="block absolute w-full h-[300px] top-0
								md:hidden lg:hidden">
									<BusMap
										routeName={routeName}
										finalRoute={finalRoute}
										stopData={stopData} />
								</div>)}

							{/* md 以上不顯示返回及顯示地圖鍵 地圖直接顯示 */}
							<div className={`${showMap ? "absolute top-[300px]" : "absolute top-0"} 
				            p-4 bg-white w-full overflow-y-scroll rounded-lg 
							 md:px-10 md:static
				             lg:w-1/2 lg:h-[500px] lg:bg-white lg:ml-3 lg:px-5  
							 xl:h-[650px]`}>
								<div className="flex justify-between md:hidden">
									<button type="button" onClick={() =>
										navigate(-1)
									}>
										<IoChevronBack className="text-slate-300" size={22} />
									</button>
									<button type="button" className="w-24 h-10 border border-slate-300 rounded-full text-sm text-slate-400 tracking-wider"
										onClick={toggleMap}>
										展開地圖
									</button>
								</div>



								{/* md 以上 路線名稱、起迄站那塊 */}
								<main className="md:px-2 h-auto">
									<BusInformation
										CityObj={CityObj}
										routeName={routeName}
										city={city}
										from={from}
										to={to}
										getButtonClassName={getButtonClassName}
										addToFavorites={addToFavorites} />


									{/* 切換去回程按鈕 路線為環狀或單向判斷？？？ */}
									{stopData[0]?.EtaDirection !== undefined && (
										<div className={`grid divide-x divide-transparent border border-gradient-start rounded-lg overflow-hidden ${isOneDirection.leftBtn || isOneDirection.rightBtn ? "grid-cols-1" : "grid-cols-2"}`}>
											{!isOneDirection.leftBtn && <button className={directionFromStyle}
												onClick={() => setRouteDirection(`${routeName}_0`)}>
												<p className="whitespace-pre">往  </p>
												<span className="font-bold tracking-wide">{from}</span>
											</button>}
											{!isOneDirection.rightBtn && <button className={directionToStyle}
												onClick={() => setRouteDirection(`${routeName}_1`)}>
												<p className="whitespace-pre">往  </p>
												<span className="font-bold tracking-wide">{to}</span>
											</button>}
										</div>
									)}

									{/* 公車到站狀態 */}
									<ul className="px-2 py-3 divide-y divide-slate-200 md:py-6 lg:py-4">
										<BusStopStatus stopData={stopData}
											plateNumb={plateNumb} />
									</ul>
								</main>
							</div>
						</div>

						<div className="fixed w-full z-10 bottom-0">
							<Footer />
						</div>

					</div>
				)}
		</>
	)
}


export default BusStatusPage;
