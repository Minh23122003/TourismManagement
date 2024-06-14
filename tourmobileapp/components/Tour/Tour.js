import React, { useContext } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View, RefreshControl, ActivityIndicator } from "react-native"
import APIs, { endpoints } from "../../configs/APIs";
import { List, Chip, Searchbar } from "react-native-paper";
import Style from "./Style";
import TourDetails from "./TourDetails";
import { isCloseToBottom } from "../Utils/Utils";
import { MyUserContext } from "../../configs/Contexts";


const Tour = ({route, navigation}) => {
    const [tours, setTours] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [categories, setCategories] = React.useState(null)
    const [cateId, setCateId] = React.useState("")
    const [page, setPage] = React.useState(1)
    const [priceMin, setPriceMin] = React.useState("");
    const [priceMax, setPriceMax] = React.useState("");
    const [date, setDate] = React.useState("");
    const [destination, setDestination] = React.useState("");
    const user = useContext(MyUserContext)
    
    const loadTours = async () => {
        if (page > 0){
            let url = `${endpoints["tours"]}?price_min=${priceMin}&&price_max=${priceMax}&&start_date=${date}&&cate_id=${cateId}&&destination=${destination}&&page=${page}`
            try {
                setLoading(true)
                let res = await APIs.get(url);
                if (page===1)
                    setTours(res.data.results);
                else if (page > 1)
                    setTours(current => {return [...current, ...res.data.results]})
                if (res.data.next===null)
                    setPage(-99);
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false)
            }
        }
    }

    const loadCategories = async () => {
        try {
            let res = await APIs.get(endpoints["cateTours"]);
            setCategories(res.data);
        } catch (ex) {
            console.error(ex);
        }
    }

    React.useEffect(() => {
        loadTours();
    }, [page, priceMin, priceMax, date, cateId, destination])

    React.useEffect(() => {
        loadCategories();
    }, [])

    const loadMore = ({nativeEvent}) => {
        if (loading===false && isCloseToBottom(nativeEvent)) {
            setPage(page+1);
        }
    }

    const search = (value, callback) => {
        setPage(1);
        callback(value);
    }

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setPage(1)
            loadTours()
            setRefreshing(false);
        }, 1000);
    }, []);
    
    return (
        <View style={[Style.margin, Style.container]}>
            <View style={Style.row}>
                <Chip onPress={() => search("", setCateId)} mode={!cateId?"outlined":"flat"} style={Style.margin} icon="shape-outline">Tất cả</Chip>
                {categories===null?<ActivityIndicator />: <>
                    {categories.map(c => <Chip onPress={() => search(c.id, setCateId)} mode={cateId===c.id?"outlined":"flat"} key={c.id} style={Style.margin} icon="shape-outline">{c.name}</Chip>)}
                </>}
            </View>
            <View>
                <Searchbar style={Style.margin} placeholder="Nhập giá thấp nhất" value={priceMin} onChangeText={t => search(t, setPriceMin)} />
                <Searchbar style={Style.margin} placeholder="Nhập giá cao nhất" value={priceMax} onChangeText={t => search(t, setPriceMax)} />
                <Searchbar style={Style.margin} placeholder="Nhập ngày đi: dd-mm-yyyy" value={date} onChangeText={t => search(t, setDate)} />
                <Searchbar style={Style.margin} placeholder="Nhập điểm đến" value={destination} onChangeText={t => search(t, setDestination)} />
            </View>
            {user!==null && user.is_superuser===true?<>
            <TouchableOpacity style={Style.margin} >
                <Text style={[Style.button, {width:150, backgroundColor:"blue"}]} >Tạo tour du lịch</Text>
            </TouchableOpacity>
            </>:<></>}
            <Text style={{fontSize:30, fontWeight:"bold"}}>Danh sách tour du lịch</Text>
            <ScrollView onScroll={loadMore} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >
                {loading && <ActivityIndicator />}
                {tours.map(t => <TouchableOpacity key={t.id} onPress={() => navigation.navigate('TourDetails', {tourId : t.id})}>
                    <List.Item style={Style.margin} title={t.name} left={() => <Image style={Style.img} source={{uri : t.tour_image[0].image}} />} />
                </TouchableOpacity>)}
                {loading && page > 1 && <ActivityIndicator/>}
            </ScrollView>
        </View>
    )
}


export default Tour;