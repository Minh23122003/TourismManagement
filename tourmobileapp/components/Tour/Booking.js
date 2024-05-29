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
        try {
            let token = await AsyncStorage.getItem('access-token')
            let res = await authApi(token).post(endpoints['addBooking'](tour.id), {
                'quantity_ticket_adult': ticketAdult,
                'quantity_ticket_children': ticketChildren
            })
            if (res.data.status===406)
                Alert.alert('Loi', res.data.content, [{text:'ok', onPress: () => navigation.navigate('Booking'), style:"default"}])
            else
                Alert.alert('Thanh cong', 'Dat ve thanh cong', [{text:'ok', onPress: () => navigation.navigate('Tour'), style:"default"}])
        } catch (ex) {
            console.error(ex)
        }
    }


    return (
        <View style={{marginStart:20}}>
            <Text style={[Style.nameTour, Style.margin]}>{tour.name}</Text>
            <Text style={Style.margin}>Ngay bat dau: {moment(tour.start_date).format('DD-MM-YYYY')}</Text>
            <Text style={Style.margin}>Ngay ket thuc: {moment(tour.end_date).format('DD-MM-YYYY')}</Text>
            <Text style={Style.margin}>Gia nguoi lon: {tour.price_adult} VND</Text>
            <Text style={Style.margin}>Gia tre em: {tour.price_children} VND</Text>
            <Text style={Style.margin}>So ve con lai: {tour.remain_ticket}</Text>
            <TextInput onChangeText={setTicketAdult} placeholder='Nhap so ve nguoi lon' style={[Style.margin, {width:400}]} mode='outlined' keyboardType='numeric' />
            <TextInput onChangeText={setTicketChildren} placeholder='Nhap so ve tre em' style={[Style.margin, {width:400}]} mode='outlined' keyboardType='numeric' />
            <Button mode='contained' style={Style.margin} onPress={addBooking} >Dat ve</Button>
        </View>
    )
}

export default Booking;