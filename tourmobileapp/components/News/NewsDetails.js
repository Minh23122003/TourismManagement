import React from "react"
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from "react-native"
import APIs, { authApi, endpoints } from "../../configs/APIs"
import Style from "./Style"
import { Card, TextInput } from "react-native-paper"
import RenderHTML from "react-native-render-html"
import { isCloseToBottom } from "../Utils/Utils"
import moment from 'moment';
import { MyUserContext } from '../../configs/Contexts'
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'moment/locale/vi'

const NewsDetails = ({ route }) => {
    const newsId = route.params?.newsId
    const [news, setNews] = React.useState(null)
    const { width } = useWindowDimensions();
    const [comment, setComment] = React.useState(null);
    const [user] = React.useState(2)
    const [content, setContent] = React.useState()
    const [page,setPage] = React.useState(1)
    const [loading, setLoading] = React.useState(false)

    const loadNews = async () => {
        try {
            let res = await APIs.get(endpoints['news-details'](newsId))
            setNews(res.data)
        } catch (ex) {
            console.error(ex);
        }
    }

    const loadComment = async () => {
        if (page > 0){
            let url = `${endpoints['commentNews'](newsId)}?page=${page}`
            try {
                setLoading(true)
                let res = await APIs.get(url)
                if(page===1)
                    setComment(res.data.results)
                else if(page > 1)
                    setComment(current => {return [...current, ...res.data.results]})
                if(res.data.next===null)
                    setPage(-99)
            } catch (ex) {
                console.error(ex)
            } finally {
                setLoading(false)
            }
        }
    }

    React.useEffect(() => {
        loadNews();
    }, [newsId])

    React.useEffect(() => {
        loadComment();
    }, [page])

    const addComment = async () => {
        try {
            // let token = await AsyncStorage.getItem('access-token')
            let token = "32ps1bRS9FPvDc8BLbk9fm6W86OY6x"
            let res = await authApi(token).post(endpoints['addCommentNews'](newsId), {
                'content': content
            })
        } catch (ex) {
            console.error(ex)
        } finally {
            loadComment()
        }
    }

    const loadMore = ({nativeEvent}) => {
        if (loading===false && isCloseToBottom(nativeEvent)){
            setPage(page+1)
        }
    }

    return (
            <ScrollView style={[Style.margin, Style.container]}>
                {news===null?<ActivityIndicator/>:<>
                    <Card key={news.id}>
                        <Card.Title titleStyle={Style.title} title={news.title} />
                        <Card.Content>
                            <RenderHTML contentWidth={width} source={{html: news.content}} />
                        </Card.Content>
                        {news.news_image.map(n => <View key={n.id}>
                            <Card.Cover style={Style.margin} source={{uri:n.image}} />
                            <View style={{alignItems:"center"}} >
                                <Text style={{fontStyle:"italic"}}>{n.name}</Text>
                            </View>                       
                        </View> )}
                    </Card>
                </>}

                <Text style={[Style.text, Style.margin]}>Binh luan</Text>
                {user===null?<ActivityIndicator/>:<>
                    <View style={[Style.row,{alignItems:"center", justifyContent:"center"}]}>
                            <TextInput value={content} onChangeText={t => setContent(t)} placeholder='Noi dung binh luan' style={Style.comment} />
                            <TouchableOpacity onPress={addComment}>
                                <Text style={Style.button}>Binh luan</Text>
                            </TouchableOpacity>
                    </View>
                </>}

                {comment===null?<ActivityIndicator/>:<>
                    {comment.map(c => <View key={c.id} style={[Style.row, {margin:10, backgroundColor:"lightblue"}]}>
                        <Image source={{uri: c.user.avatar}} style={[Style.avatar, Style.margin]} />
                        <View>
                            <Text style={Style.margin}>Nguoi binh luan: {c.user.first_name} {c.user.last_name}</Text>
                            <Text style={Style.margin}>{c.content}</Text>
                            <Text style={Style.margin}>{moment(c.updated_date).fromNow()}</Text>
                        </View>
                    </View>)}               
                </>}
                {loading && page > 1 && <ActivityIndicator/>}
            </ScrollView>
    )
}

export default NewsDetails;