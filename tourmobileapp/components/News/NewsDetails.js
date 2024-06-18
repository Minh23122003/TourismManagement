import React, { useContext } from "react"
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from "react-native"
import APIs, { authApi, endpoints } from "../../configs/APIs"
import Style from "./Style"
import { Card, Chip, TextInput } from "react-native-paper"
import RenderHTML from "react-native-render-html"
import { isCloseToBottom } from "../Utils/Utils"
import moment from 'moment';
import { MyUserContext, NewsDispatchContext } from '../../configs/Contexts'
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'moment/locale/vi'
import { useNavigation } from "@react-navigation/native"

const NewsDetails = ({ navigation, route }) => {
    const newsId = route.params?.newsId
    const [news, setNews] = React.useState(null)
    const { width } = useWindowDimensions();
    const [comment, setComment] = React.useState(null);
    const user = useContext(MyUserContext)
    const [content, setContent] = React.useState()
    const [page,setPage] = React.useState(1)
    const [loading, setLoading] = React.useState(false)
    const [like, setLike] = React.useState(false)
    const nav = useNavigation()
    const newsDispatch = useContext(NewsDispatchContext)

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

    const loadLike = async () => {
        if(user!==null){
            try {
                let token = await AsyncStorage.getItem('access-token')
                let res = await authApi(token).get(endpoints['like'](newsId))
                setLike(res.data.active)
            } catch (ex) {
                console.error(ex)
            }
        }
    }

    React.useEffect(() => {
        loadNews();
    }, [newsId])

    React.useEffect(() => {
        loadComment();
    }, [page])

    React.useEffect(() => {
        loadLike();
    }, [])

    const addComment = async () => {
        if(user===null)
            Alert.alert('Lỗi', 'Bạn chưa đăng nhập. Vui lòng đăng nhập để bình luận', [{text:'Ok', onPress: () => nav.navigate('LogIn'), style:"default"}])
        else {
            try {
                let token = await AsyncStorage.getItem('access-token')
                let res = await authApi(token).post(endpoints['addCommentNews'](newsId), {
                    'content': content
                })
                setPage(1)
                setContent(null)
            } catch (ex) {
                console.error(ex)
            }
        }
    }

    const deleteComment = async (id) => {
        try {
            let res = await APIs.delete(endpoints['deleteCommentNews'](id))
            setPage(1)
        } catch (ex) {
            console.error(ex)
        }
    }

    const confirmDeleteComment = async (id) => {
        await Alert.alert('Xác nhận', 'Bạn chắc chắn muốn xóa?', [{text:'Có', onPress: () => {deleteComment(id)}, style:"delete"}, {text:'Không'}])
    }

    const addLike = async () => {
        if(user===null)
            Alert.alert('Lỗi', 'Bạn chưa đăng nhập. Vui lòng đăng nhập', [{text:'Ok', onPress: () => nav.navigate('LogIn'), style:"default"}])
        else {
            try {
                let token = await AsyncStorage.getItem('access-token')
                let res = await authApi(token).post(endpoints['addLike'](newsId))
                setLike(res.data.active)
            } catch (ex) {
                console.error(ex)
            }
        }
    }

    const deleteNews = async () => {
        try {
            let res = await APIs.delete(endpoints['deleteNews'](newsId))
            newsDispatch({
                'type': "delete",
            })
            Alert.alert('Thành công', 'Xóa tin thành công', [{text:'Ok', onPress: () => nav.navigate('News'), style:"default"}])
        } catch (ex){
            console.error(ex)
        }
    }

    const confirmDeleteNews = async () => {
        await Alert.alert('Xác nhận', 'Bạn chắc chắn muốn xóa?', [{text:'Có', onPress: () => {deleteNews()}, style:"delete"}, {text:'Không'}])
    } 

    const loadMore = ({nativeEvent}) => {
        if (loading===false && isCloseToBottom(nativeEvent)){
            setPage(page+1)
        }
    }

    return (
            <ScrollView style={[Style.margin, Style.container]}>
                {news===null?<ActivityIndicator/>:<>
                    <Card key={news.id} style={Style.margin}>
                        <Text style={[Style.title, {marginLeft:15}]}>{news.title}</Text>
                        <Card.Content>
                            <RenderHTML contentWidth={width} source={{html: news.content}} />
                        </Card.Content>
                        {news.news_image.map(n => <View key={n.id} style={Style.margin}>
                            <Card.Cover style={Style.margin} source={{uri:n.image}} />
                            <View style={{alignItems:"center"}} >
                                <Text style={{fontStyle:"italic"}}>{n.name}</Text>
                            </View>                       
                        </View> )}
                    </Card>
                </>}

                <Chip onPress={() => addLike()} style={[Style.margin, {width:100, backgroundColor: like===true?"lightblue":"white"}]} icon="heart">Thich</Chip>
                {user!==null && user.is_superuser===true?<>
                <View style={[Style.container, Style.row, Style.margin]}>
                <TouchableOpacity style={Style.margin} onPress={() => navigation.navigate('ChangeNews', {news:news})} >
                    <Text style={[Style.button, {width:150, backgroundColor:"blue"}]} >Sửa tin tức</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Style.margin} onPress={() => confirmDeleteNews()} >
                    <Text style={[Style.button, {width:150, backgroundColor:"blue"}]} >Xóa tin tức</Text>
                </TouchableOpacity>
                </View>
                </>:<></>}
                <Text style={[Style.text, Style.margin]}>Bình luận</Text>
                <View style={[Style.row,{alignItems:"center", justifyContent:"center"}]}>
                        <TextInput value={content} onChangeText={t => setContent(t)} placeholder='Nội dung bình luận' style={Style.comment} />
                        <TouchableOpacity onPress={addComment}>
                            <Text style={Style.button}>Bình luận</Text>
                        </TouchableOpacity>
                </View>

                {comment===null?<ActivityIndicator/>:<>
                    {comment.map(c => <View key={c.id} style={[Style.row, {margin:10, backgroundColor:"lightblue"}]}>
                        <Image source={{uri: c.user.avatar}} style={[Style.avatar, Style.margin]} />
                        <View>
                            <Text style={Style.margin}>Người bình luận: {c.user.first_name} {c.user.last_name}</Text>
                            <Text style={Style.margin}>{c.content}</Text>
                            <Text style={Style.margin}>{moment(c.updated_date).fromNow()}</Text>
                        </View>
                        {user !== null && c.user.id===user.id?<>
                        <View>
                            <TouchableOpacity  style={Style.margin}><Text style={[Style.button, {padding:10}]}>Chỉnh sửa</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => confirmDeleteComment(c.id)} style={Style.margin}><Text style={[Style.button, {padding:10}]}>Xóa</Text></TouchableOpacity>
                        </View>
                        </>:<></>}
                    </View>)}               
                </>}
                {loading && page > 1 && <ActivityIndicator/>}
            </ScrollView>
    )
}

export default NewsDetails;