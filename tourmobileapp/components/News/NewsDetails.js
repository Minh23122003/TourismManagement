import React, { useContext } from "react"
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from "react-native"
import APIs, { authApi, endpoints } from "../../configs/APIs"
import Style from "./Style"
import { Card, Chip, TextInput } from "react-native-paper"
import RenderHTML from "react-native-render-html"
import { isCloseToBottom } from "../Utils/Utils"
import moment from 'moment';
import { MyUserContext } from '../../configs/Contexts'
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'moment/locale/vi'
import { useNavigation } from "@react-navigation/native"

const NewsDetails = ({ route }) => {
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
            Alert.alert('Loi', 'Ban chua dang nhap. Vui long dang nhap', [{text:'ok', onPress: () => nav.navigate('LogIn'), style:"default"}])
        else {
            try {
                let token = await AsyncStorage.getItem('access-token')
                let res = await authApi(token).post(endpoints['addCommentNews'](newsId), {
                    'content': content
                })
                setPage(1)
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

    const confirmDelete = async (id) => {
        await Alert.alert('Xac nhan', 'Ban chac chan muon xoa?', [{text:'Co', onPress: () => {deleteComment(id)}, style:"delete"}, {text:'Khong'}])
    } 

    const addLike = async () => {
        if(user===null)
            Alert.alert('Loi', 'Ban chua dang nhap. Vui long dang nhap', [{text:'ok', onPress: () => nav.navigate('LogIn'), style:"default"}])
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

    const loadMore = ({nativeEvent}) => {
        if (loading===false && isCloseToBottom(nativeEvent)){
            setPage(page+1)
        }
    }

    return (
            <ScrollView style={[Style.margin, Style.container]}>
                {news===null?<ActivityIndicator/>:<>
                    <Card key={news.id} style={{alignItems:"center"}}>
                        <Card.Title titleStyle={[Style.title, {display:"flex", flexWrap:"wrap"}]} title={news.title} />
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

                <Text style={[Style.text, Style.margin]}>Binh luan</Text>
                <View style={[Style.row,{alignItems:"center", justifyContent:"center"}]}>
                        <TextInput value={content} onChangeText={t => setContent(t)} placeholder='Noi dung binh luan' style={Style.comment} />
                        <TouchableOpacity onPress={addComment}>
                            <Text style={Style.button}>Binh luan</Text>
                        </TouchableOpacity>
                </View>

                {comment===null?<ActivityIndicator/>:<>
                    {comment.map(c => <View key={c.id} style={[Style.row, {margin:10, backgroundColor:"lightblue"}]}>
                        <Image source={{uri: c.user.avatar}} style={[Style.avatar, Style.margin]} />
                        <View>
                            <Text style={Style.margin}>Nguoi binh luan: {c.user.first_name} {c.user.last_name}</Text>
                            <Text style={Style.margin}>{c.content}</Text>
                            <Text style={Style.margin}>{moment(c.updated_date).fromNow()}</Text>
                        </View>
                        {user !== null && c.user.id===user.id?<>
                        <View>
                            <TouchableOpacity  style={Style.margin}><Text style={[Style.button, {padding:10}]}>Chinh sua</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => confirmDelete(c.id)} style={Style.margin}><Text style={[Style.button, {padding:10}]}>Xoa</Text></TouchableOpacity>
                        </View>
                        </>:<></>}
                    </View>)}               
                </>}
                {loading && page > 1 && <ActivityIndicator/>}
            </ScrollView>
    )
}

export default NewsDetails;