import React, { useContext } from "react";
import { ActivityIndicator, RefreshControl, Text, View, TouchableOpacity, ScrollView, RefreshControlBase, Image } from "react-native"
import APIs, { endpoints } from "../../configs/APIs";
import { isCloseToBottom } from "../Utils/Utils";
import Style from "./Style";
import { Chip, List } from "react-native-paper";
import { MyUserContext, NewsContext, NewsDispatchContext } from "../../configs/Contexts";
import { useNavigation } from "@react-navigation/native";

const News = ({route, navigation}) => {
    const [news, setNews] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [categories, setCategories] = React.useState(null)
    const [cateId, setCateId] = React.useState("")
    const [page, setPage] = React.useState(1)
    const user = useContext(MyUserContext)
    const nav = useNavigation()

    const loadNews = async () => {
        if(page > 0) {
            url = `${endpoints["news"]}?cate_id=${cateId}&&page=${page}`
            try {
                setLoading(true)
                let res = await APIs.get(url)
                if (page===1)
                    setNews(res.data.results)
                else if ( page > 1)
                    setNews(current => {return [...current, ...res.data.results]})
                if (res.data.next === null)
                    setPage(-99)
            } catch (ex) {
                console.error(ex)
            } finally {
                setLoading(false)
            }          
        }
    }

    const loadCategories = async () => {
        try {
            let res = await APIs.get(endpoints['cateNews'])
            setCategories(res.data)
        } catch (ex) {
            console.error(ex)
        }
    }

    React.useEffect(() => {
        loadNews();
    }, [cateId, page])

    React.useEffect(() => {
        loadCategories()
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
            loadNews()
            setPage(1)
            setRefreshing(false);
        }, 1000);
    }, []);

    return (
        <View style={[Style.container, Style.margin]}>
            <View style={Style.row}>
                <Chip onPress={() => search("", setCateId)} mode={!cateId?"outlined":"flat"} style={Style.margin} icon="shape-outline">Tất cả</Chip>
                {categories===null?<ActivityIndicator />: <>
                    {categories.map(c => <Chip onPress={() => search(c.id, setCateId)} mode={cateId===c.id?"outlined":"flat"} key={c.id} style={Style.margin} icon="shape-outline">{c.name}</Chip>)}
                </>}
            </View>
            <Text style={{fontSize:30, fontWeight:"bold"}}>Các tin tức mới</Text>
            <ScrollView onScroll={loadMore} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {loading && <ActivityIndicator />}
                {news.map(n => <TouchableOpacity key={n.id} onPress={() => navigation.navigate('NewsDetails', {newsId : n.id})}>
                    <List.Item style={Style.margin} title={n.title} left={() => <Image style={Style.img} source={{uri : n.images[0].image}} />} />
                </TouchableOpacity>)}
                {loading && page > 1 && <ActivityIndicator/>}
            </ScrollView>
        </View>
    )
}

export default News;