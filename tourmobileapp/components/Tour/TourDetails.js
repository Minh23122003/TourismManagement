import React, { useContext } from 'react';
import { View, Text, ScrollView, ActivityIndicator, useWindowDimensions, Image, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import APIs, { authApi, endpoints } from '../../configs/APIs';
import Style from './Style';
import { Button, Card, List, TextInput } from 'react-native-paper';
import RenderHTML from 'react-native-render-html';
import moment from 'moment';
import { MyUserContext, TourDispatchContext } from '../../configs/Contexts'
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'moment/locale/vi'
import { isCloseToBottom } from '../Utils/Utils';
import { Rating, AirbnbRating } from "react-native-ratings"
import { useNavigation } from '@react-navigation/native';

const TourDetails = ({ route, navigation }) => {
    const tourId = route.params?.tourId;
    const [tour, setTour] = React.useState(null);
    const [comment, setComment] = React.useState(null);
    const { width } = useWindowDimensions();
    const user = useContext(MyUserContext)
    const [content, setContent] = React.useState()
    const [page,setPage] = React.useState(1)
    const [loading, setLoading] = React.useState(false)
    const [stars, setStars] = React.useState(0)
    const nav = useNavigation()
    const tourDispatch = useContext(TourDispatchContext)
    const [change, setChange] =React.useState("")

    const loadTour = async () => {
        try {
            let res = await APIs.get(endpoints['tour-details'](tourId))
            setTour(res.data)
        } catch (ex) {
            console.error(ex);
        }
    }

    const loadComment = async () => {
        if (page > 0){
            let url = `${endpoints['commentTour'](tourId)}?page=${page}`
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

    const loadRating = async () => {
        if (user!==null){
            try {
                let token = await AsyncStorage.getItem('access-token')
                let res = await authApi(token).get(endpoints['rating'](tourId))
                setStars(res.data.stars)
            } catch (ex) {
                console.error(ex)
            }
        }
        
    }

    React.useEffect(() => {
        loadTour();
    }, [tourId])

    React.useEffect(() => {
        loadComment();
    }, [page])

    React.useEffect(() => {
        loadRating();
    }, [])

    const addComment = async () => {
        if(user===null)
            Alert.alert('Lỗi', 'Bạn chưa đăng nhập. Vui lòng đăng nhập để bình luận', [{text:'Ok', onPress: () => nav.navigate('LogIn'), style:"default"}])
        else{
            try {
                let token = await AsyncStorage.getItem('access-token')
                let res = await authApi(token).post(endpoints['addCommentTour'](tourId), {
                    'content': content
                })
                setPage(1)
                setContent(null)
            } catch (ex) {
                console.error(ex)
            } 
        }
    }

    const patchComment = async (id) => {
        try {
            let res = await APIs.put(endpoints['patchCommentTour'], {
                'content': change,
                'id':id
            })
            setPage(1)
            setChange("")
        } catch (ex) {
            console.error(ex)
        } finally {
        }
    }

    const deleteComment = async (id) => {
        try {
            let res = await APIs.delete(endpoints['deleteCommentTour'](id))
            setPage(1)
        } catch (ex) {
            console.error(ex)
        }
    }

    const confirmDeleteComment = async (id) => {
        await Alert.alert('Xác nhận', 'Bạn chắc chắn muốn xóa?', [{text:'Có', onPress: () => {deleteComment(id)}, style:"delete"}, {text:'Không'}])
    } 

    const addRating = async (number) => {
        if(user===null)
            Alert.alert('Lỗi', 'Bạn chưa đăng nhập. Vui lòng đăng nhập để đánh giá', [{text:'Ok', onPress: () => nav.navigate('LogIn'), style:"default"}])
        else {
            try {
                let token = await AsyncStorage.getItem('access-token')
                let res = await authApi(token).post(endpoints['addRating'](tourId), {
                    'stars':number
                })
            } catch (ex) {
                console.error(ex)
            }
        }
    }

    const deleteTour = async () => {
        try {
            let res = await APIs.delete(endpoints['deleteTour'](tourId))
            tourDispatch({
                'type': "delete",
            })
            Alert.alert('Thành công', 'Xóa tour thành công', [{text:'Ok', onPress: () => nav.navigate('Tour'), style:"default"}])
        } catch (ex){
            console.error(ex)
        }
    }

    const confirmDeleteTour = async () => {
        await Alert.alert('Xác nhận', 'Bạn chắc chắn muốn xóa?', [{text:'Có', onPress: () => {deleteTour()}, style:"delete"}, {text:'Không'}])
    } 

    const loadMore = ({nativeEvent}) => {
        if (loading===false && isCloseToBottom(nativeEvent)){
            setPage(page+1)
        }
    }

    return (
            <ScrollView style={[Style.margin, Style.container]} onScroll={loadMore}>   
                <View>
                {tour===null?<ActivityIndicator/>:<>
                    <Card key={tour.id}>
                        <Text style={[Style.nameTour, {marginLeft:15}]} >{tour.name}</Text>
                        <Card.Content>
                            <RenderHTML contentWidth={width} source={{html: tour.description}} />
                        </Card.Content>
                        <View style={Style.row}>
                            <View>
                                <Text style={Style.margin}>Ngày bắt đầu: {moment(tour.start_date).format('DD-MM-YYYY')}</Text>
                                <Text style={Style.margin}>Ngày kết thúc: {moment(tour.end_date).format('DD-MM-YYYY')}</Text>
                                <Text style={Style.margin}>Giá người lớn: {tour.price_adult} VND</Text>
                                <Text style={Style.margin}>Giá trẻ em: {tour.price_children} VND</Text>
                                <Text style={Style.margin}>Số vé còn lại: {tour.remain_ticket}</Text>
                            </View>
                            <View style={{marginStart:40}}>
                                <AirbnbRating count={5} reviews={['terrible', 'bad', 'ok', 'good', 'very good']} defaultRating={stars} size={20} onFinishRating={(number)=>{setStars(number); addRating(number)}}/>
                            </View>
                        </View>
                        <Button style={[{backgroundColor:"lightblue", width:100}]} onPress={() => navigation.navigate('Booking', {tour : tour})}>Đặt vé</Button>
                        {tour.tour_image.map(t => <View key={t.id}>
                            <Card.Cover style={Style.margin} source={{uri:t.image}} />
                            <View style={{alignItems:"center"}} >
                                <Text style={{fontStyle:"italic"}}>{t.name}</Text>
                            </View>                       
                        </View> )}
                    </Card>
                </>}
                {user!==null && user.is_superuser===true?<>
                <View style={[Style.container, Style.row, Style.margin]}>
                <TouchableOpacity style={Style.margin} onPress={()=>navigation.navigate('ChangTour', {tour:tour})} >
                    <Text style={[Style.button, {width:150, backgroundColor:"blue"}]} >Sửa tour du lịch</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Style.margin} onPress={() => confirmDeleteTour()} >
                    <Text style={[Style.button, {width:150, backgroundColor:"blue"}]} >Xóa tour du lịch</Text>
                </TouchableOpacity>
                </View>
                </>:<></>}
                <Text style={[Style.nameTour, Style.margin]}>Bình luận</Text>
                    <View style={[Style.row,{alignItems:"center", justifyContent:"center"}]}>
                            <TextInput value={content} onChangeText={t => setContent(t)} placeholder='Nội dung bình luận' style={Style.comment} />
                            <TouchableOpacity onPress={addComment}>
                                <Text style={Style.button}>Bình luận</Text>
                            </TouchableOpacity>
                    </View>
                </View>
                <View>
                <ScrollView>
                {<RefreshControl onRefresh={() => {setPage(1), loadComment()}} />}
                {comment===null?<ActivityIndicator/>:<>
                    {comment.map(c => <View key={c.id} style={[Style.row, {margin:10, backgroundColor:"lightblue"}]}>
                        <Image source={{uri: c.user.avatar}} style={[Style.avatar, Style.margin]} />
                        <View>
                            <Text style={Style.margin}>Người bình luận: {c.user.first_name} {c.user.last_name}</Text>
                            <Text style={Style.margin}>{c.content}</Text>
                            <Text style={Style.margin}>{moment(c.updated_date).fromNow()}</Text>
                        </View>
                        {user!==null && c.user.id===user.id?<>
                        <View>
                            <TouchableOpacity onPress={() => patchComment(c.id)} style={Style.margin}><Text style={[Style.button, {padding:10}]}>Chỉnh sửa</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => confirmDeleteComment(c.id)} style={Style.margin}><Text style={[Style.button, {padding:10}]}>Xóa</Text></TouchableOpacity>
                        </View>
                        <TextInput value={change} onChangeText={t => setChange(t)} placeholder='Nội dung bình luận sửa' style={Style.comment} />
                        </>:<></>}
                    </View>)}               
                </>}
                {loading && page > 1 && <ActivityIndicator/>}
                </ScrollView>
                </View>
            </ScrollView>
    )
}

export default TourDetails