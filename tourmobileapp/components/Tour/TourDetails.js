import React, { useContext } from 'react';
import { View, Text, ScrollView, ActivityIndicator, useWindowDimensions, Image, TouchableOpacity, RefreshControl } from 'react-native';
import APIs, { authApi, endpoints } from '../../configs/APIs';
import Style from './Style';
import { Button, Card, List, TextInput } from 'react-native-paper';
import RenderHTML from 'react-native-render-html';
import moment from 'moment';
import { MyUserContext } from '../../configs/Contexts'
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'moment/locale/vi'
import { isCloseToBottom } from '../Utils/Utils';

const TourDetails = ({ route, navigation }) => {
    const tourId = route.params?.tourId;
    const [tour, setTour] = React.useState(null);
    const [comment, setComment] = React.useState(null);
    const { width } = useWindowDimensions();
    const [user] = React.useState(2)
    const [content, setContent] = React.useState()
    const [page,setPage] = React.useState(1)
    const [loading, setLoading] = React.useState(false)

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

    React.useEffect(() => {
        loadTour();
    }, [tourId])

    React.useEffect(() => {
        loadComment();
    }, [page])

    const addComment = async () => {
        try {
            // let token = await AsyncStorage.getItem('access-token')
            let token = "32ps1bRS9FPvDc8BLbk9fm6W86OY6x"
            let res = await authApi(token).post(endpoints['addCommentTour'](tourId), {
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
            <ScrollView style={[Style.margin, Style.container]} onScroll={loadMore}>
                {<RefreshControl onRefresh={() => {setPage(1), loadComment()}} />}
                {tour===null?<ActivityIndicator/>:<>
                    <Card key={tour.id}>
                        <Card.Title titleStyle={Style.nameTour} title={tour.name} />
                        <Card.Content>
                            <RenderHTML contentWidth={width} source={{html: tour.description}} />
                        </Card.Content>
                        <Text style={Style.margin}>Ngay bat dau: {moment(tour.start_date).format('DD-MM-YYYY')}</Text>
                        <Text style={Style.margin}>Ngay ket thuc: {moment(tour.end_date).format('DD-MM-YYYY')}</Text>
                        <Text style={Style.margin}>Gia nguoi lon: {tour.price_adult} VND</Text>
                        <Text style={Style.margin}>Gia tre em: {tour.price_children} VND</Text>
                        <Button style={[{backgroundColor:"lightblue", width:100}]} onPress={() => navigation.navigate('Booking', {tourId : tour.id})}>
                            Dat ve {tour.id}
                        </Button>
                        {tour.tour_image.map(t => <View key={t.id}>
                            <Card.Cover style={Style.margin} source={{uri:t.image}} />
                            <View style={{alignItems:"center"}} >
                                <Text style={{fontStyle:"italic"}}>{t.name}</Text>
                            </View>                       
                        </View> )}
                    </Card>
                </>}

                <Text style={[Style.nameTour, Style.margin]}>Binh luan</Text>
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

export default TourDetails