import React from 'react';
import { View, Text } from 'react-native';
import APIs, { endpoints } from '../../configs/APIs';
import Style from './Style';
import moment from 'moment';
import { Button, HelperText, TextInput } from 'react-native-paper';

const Booking = ({ route, navigation }) => {
    // const tourId = route.params?.tour;
    const [tour, setTour] = React.useState(route.params?.tour);
    const [loading, setLoading] = React.useState(false)
    const [user] = React.useState(2)
    const [ticketAdult, setTicketAdult] = React.useState(0)
    const [ticketChildren, setTicketChildren] = React.useState(0)

    // const loadTour = async () => {
    //     try {
    //         setLoading(true)
    //         let res = await APIs.get(endpoints["tour-details"](tourId))
    //         setTour(tour)
    //     } catch (ex) {
    //         console.error(ex);
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    // React.useEffect(() => {
    //     loadTour()
    // }, [tourId])


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
            <Button mode='contained' style={Style.margin}>Dat ve</Button>
        </View>
    )
}

export default Booking;