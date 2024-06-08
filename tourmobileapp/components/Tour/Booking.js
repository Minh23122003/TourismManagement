import React, { useContext } from 'react';
import { View, Text, Alert } from 'react-native';
import APIs, { authApi, endpoints } from '../../configs/APIs';
import Style from './Style';
import moment from 'moment';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { MyUserContext } from '../../configs/Contexts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Booking = ({ route, navigation }) => {
    // const tourId = route.params?.tour;
    const [tour, setTour] = React.useState(route.params?.tour);
    const [loading, setLoading] = React.useState(false)
    const user = useContext(MyUserContext)
    const [ticketAdult, setTicketAdult] = React.useState(0)
    const [ticketChildren, setTicketChildren] = React.useState(0)

    const addBooking = async () => {
        if ((parseInt(ticketAdult) + parseInt(ticketChildren)) > tour.remain_ticket)
            Alert.alert('Lỗi', "Số lượng vé đặt vượt quá số lượng vé còn lại", [{text:'Ok', onPress: () => navigation.navigate('Booking'), style:"default"}])
        else {
            try {
                let token = await AsyncStorage.getItem('access-token')
                let res = await authApi(token).post(endpoints['addBooking'](tour.id), {
                    'quantity_ticket_adult': ticketAdult,
                    'quantity_ticket_children': ticketChildren
                })
                if (res.data.status===406)
                    Alert.alert('Lỗi', res.data.content, [{text:'Ok', onPress: () => navigation.navigate('Booking'), style:"default"}])
                else
                    Alert.alert('Thành công', 'Đặt vé thành công', [{text:'Ok', onPress: () => navigation.navigate('Tour'), style:"default"}])
            } catch (ex) {
                console.error(ex)
            }
        }
    }


    return (
        <View style={{marginStart:20}}>
            <Text style={[Style.nameTour, Style.margin]}>{tour.name}</Text>
            <Text style={Style.margin}>Ngày bắt đầu: {moment(tour.start_date).format('DD-MM-YYYY')}</Text>
            <Text style={Style.margin}>Ngày kết thúc: {moment(tour.end_date).format('DD-MM-YYYY')}</Text>
            <Text style={Style.margin}>Giá người lớn: {tour.price_adult} VND</Text>
            <Text style={Style.margin}>Giá trẻ em: {tour.price_children} VND</Text>
            <Text style={Style.margin}>Số vé còn lại: {tour.remain_ticket}</Text>
            <TextInput onChangeText={setTicketAdult} placeholder='Nhập số vé người lớn' style={[Style.margin, {width:400}]} mode='outlined' keyboardType='numeric' />
            <TextInput onChangeText={setTicketChildren} placeholder='Nhập số vé trẻ em' style={[Style.margin, {width:400}]} mode='outlined' keyboardType='numeric' />
            <Button mode='contained' style={Style.margin} onPress={addBooking} >Đặt vé</Button>
        </View>
    )
}

export default Booking;