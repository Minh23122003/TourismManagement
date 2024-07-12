import React, { useContext } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import APIs, { authApi, endpoints } from '../../configs/APIs';
import Style from './Style';
import moment from 'moment';
import { Button, HelperText, RadioButton, TextInput } from 'react-native-paper';
import { CartDispatchContext, MyUserContext } from '../../configs/Contexts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Booking = ({ route, navigation }) => {
    const [tour, setTour] = React.useState(route.params?.tour);
    const [loading, setLoading] = React.useState(false)
    const user = useContext(MyUserContext)
    const [quantity, setQuantity] = React.useState(0)
    const cartDispatch = useContext(CartDispatchContext)
    const [type, setType] = React.useState("")

    const addBooking = async () => {
        if (parseInt(quantity) > tour.remain_ticket)
            Alert.alert('Lỗi', "Số lượng vé đặt vượt quá số lượng vé còn lại", [{text:'Ok', onPress: () => navigation.navigate('Booking'), style:"default"}])
        else {
            try {
                let token = await AsyncStorage.getItem('access-token')
                let res = await authApi(token).post(endpoints['addBooking'](tour.id), {
                    'quantity': quantity,
                    'price_id': type 
                })
                if (res.data.status===406)
                    Alert.alert('Lỗi', res.data.content, [{text:'Ok', onPress: () => navigation.navigate('Booking'), style:"default"}])
                else{
                    cartDispatch({
                        'type': "add",
                    })
                    Alert.alert('Thành công', 'Đặt vé thành công', [{text:'Ok', onPress: () => navigation.navigate('Tour'), style:"default"}])
                }
            } catch (ex) {
                console.error(ex)
            }
        }
    }


    return (
        <ScrollView style={{marginStart:20}}>
            <Text style={[Style.nameTour, Style.margin]}>{tour.name}</Text>
            <Text style={Style.margin}>Ngày bắt đầu: {moment(tour.start_date).format('DD-MM-YYYY')}</Text>
            <Text style={Style.margin}>Ngày kết thúc: {moment(tour.end_date).format('DD-MM-YYYY')}</Text>
            <Text style={Style.margin}>Giá vé: </Text>
            {tour.prices.map(p => <Text style={Style.margin}>{p.type}: {p.price} đồng</Text>)}
            <Text style={Style.margin}>Số vé còn lại: {tour.remain_ticket}</Text>
            <Text style={Style.margin}>Chon loai ve</Text>
            <RadioButton.Group onValueChange={value => setType(value)} value={type}>
                {tour.prices.map(p => <RadioButton.Item value={p.id} label={p.type} />)}
            </RadioButton.Group>
            <TextInput onChangeText={setQuantity} placeholder='Nhập số vé' style={[Style.margin, {width:400}]} mode='outlined' keyboardType='numeric' />
            <Button mode='contained' style={Style.margin} onPress={addBooking} >Đặt vé</Button>
        </ScrollView>
    )
}

export default Booking;