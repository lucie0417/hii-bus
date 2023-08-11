import { useEffect, useState } from "react";
import axios from "axios";
import { IoLocationSharp, IoReload } from "react-icons/io5";
import useGeolocation from "../util/useGeolocation";
import getAuthorizationHeader from "../util/getAuthorizationHeader";
import NearByMap from "../util/NearByMap";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Loading from "../components/Loading";


const NearByBusStop = ({ CityObj, city, setFavorites }) => {
	const [stopInfo, setStopInfo] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const api = `https://tdx.transportdata.tw/api/basic/v2/Bus/`;


	// 打API先跑該縣市全部站牌
	const getAllStops = async () => {
		if (!city) return;

		const accessToken = await getAuthorizationHeader();
		const StopsRes = await axios.get(`${api}Stop/City/${CityObj[city]}?%24select=StopPosition%2C%20StopName&%24format=JSON`, {
			headers: {
				"authorization": "Bearer " + accessToken,
			}
		})
		const stopData = StopsRes.data;

		// 取出各站牌位置及名稱
		const result = stopData.map((stop) => {
			return ({
				StopName: stop.StopName.Zh_tw,
				StopLat: stop.StopPosition.PositionLat,
				StopLon: stop.StopPosition.PositionLon,
			})
		});
		setStopInfo(result);
		setIsLoading(false);
	}

	// 計算兩個經緯度之間的距離（使用 Haversine 公式）
	function calculateDistance(lat1, lon1, lat2, lon2) {
		const R = 6371; // 地球半徑，單位：公里
		const dLat = toRadians(lat2 - lat1);
		const dLon = toRadians(lon2 - lon1);
		const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
			Math.sin(dLon / 2) * Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = R * c;
		return distance;
	}

	// 將角度轉換為弧度
	function toRadians(degrees) {
		return degrees * (Math.PI / 180);
	}

	// 取得使用者所在位置座標
	const location = useGeolocation();
	const userLat = location.coordinates.lat;
	const userLon = location.coordinates.lon;


	// 取出 500 公尺內站牌，符合條件的 push 進以上陣列
	const nearbyStops = [];
	for (let i = 0; i < stopInfo.length; i++) {
		// 用來儲存符合條件的站牌
		const stop = stopInfo[i];
		const Distance = calculateDistance(userLat, userLon, stop.StopLat, stop.StopLon);
		if (Distance < 0.25) {
			const stopWithDistance = { ...stop, Distance };
			nearbyStops.push(stopWithDistance);
		} else {
			continue;
		}
	}


	// 剔除重複的站牌
	const finalNearbyStops = [];
	nearbyStops.forEach((stop) => {
		// 如果 finalNearbyStops 已有存在的值，不push stop.StopName === nearbyStops.StopName
		const DuppliateIndex = finalNearbyStops.findIndex((obj) => {
			return obj.StopName === stop.StopName
		});
		if (DuppliateIndex === -1) {
			finalNearbyStops.push(stop);
		}
	})


	useEffect(() => {
		try {
			getAllStops();
		} catch (error) {
			console.log('error', error);
		}
	}, []);

	// 手動重新整理頁面
	const handleRefresh = () => {
		window.location.reload();
	};


	return (
		<>
			{isLoading ? (<div>
				<Loading />
			</div>) : (
				<div className="h-screen">
					<Navbar setFavorites={setFavorites} />
					<main className="h-full lg:flex ">
						{/* 地圖區塊 */}
						<div className="h-1/2 md:h-1/2
								lg:min-h-screen lg:w-2/3 ">
							<NearByMap className="w-auto"
								finalNearbyStops={finalNearbyStops}
								location={location}
								userLat={userLat}
								userLon={userLon} />
						</div>

						{/* 站牌資訊 */}
						<div className="h-1/2 px-5 pt-5 bg-white overflow-y-auto
								md:h-1/2 md:px-12 md:pt-8 md:overflow-y-auto
								lg:w-1/3 lg:min-h-screen lg:px-10 lg:pt-8">
							<div className="flex text-nav-dark justify-between">
								<h1 className="text-lg font-medium md:text-xl lg:text-2xl">
									附近公車站牌
									<span className="px-1.5 text-xs font-light text-slate-400 lg:text-sm">
										300m內
									</span>
								</h1>
								<button onClick={handleRefresh}>
									<IoReload size={18} className="text-slate-400 md:mr-4 lg:mr-0" />
								</button>
							</div>

							<ul className="px-2 py-3 divide-y divide-slate-200 lg:px-0">
								{finalNearbyStops.map((stop) => (
									<li className="flex justify-between py-2 align-middle"
										key={stop.StopName}>
										<div className="text-searchbar-dark">
											<p className="font-medium leading-6">{stop.StopName}</p>
											<p className="text-sm ">?條路線（待處理）</p>
										</div>
										<div>
											<Button backgroundColor="#F8F8FB" fontSize="15px"
												fontColor="#8C90AB">
												<IoLocationSharp size={14} />
												{Math.floor(stop.Distance * 100)}0m
											</Button>
										</div>
									</li>
								))}
							</ul>
						</div>
					</main>
					<Footer />
				</div>
			)}

		</>
	)
}

export default NearByBusStop;