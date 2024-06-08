import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View, RefreshControl, ActivityIndicator } from "react-native"
import APIs, { endpoints } from "../../configs/APIs";
import { List, Chip, Searchbar } from "react-native-paper";
import Style from "./Style";
import TourDetails from "./TourDetails";
import { isCloseToBottom } from "../Utils/Utils";


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
            <Text style={{fontSize:30, fontWeight:"bold"}}>Danh sách tour du lịch</Text>
            <ScrollView onScroll={loadMore}>
                <RefreshControl onRefresh={() => loadTours()} />
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